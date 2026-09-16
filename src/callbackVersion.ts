//console.log('Callback version is running');

import * as https from 'https';

import {
    WEATHER_API_URL,
    GEOCODING_API_URL,
    NEWS_API_URL
} from './config'

import type {
    NewsApiResponse,
    NewsPost,
    WeatherApiResponse,
    WeatherData,
    GeocodingApiResponse,
    GeocodingResult
} from './types'

import {
    displayDashboard,
    displayError,
    getWeatherCondition
} from './display'

import {
    askForMyCityCallback
} from './input'

function getCoordinates(
    city: string,
    callback: (error : Error | null, location?: GeocodingResult) => void
): void {

    console.log(`Searching for ${city}...`)

        const url = `${GEOCODING_API_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const request = https.get(url, (response) => {

            let data = '';

            response.setEncoding('utf8');

            response.on('data', (chunk) => {
                data += chunk;

            });

            response.on('end', () => {

                try {
    
                    if (
                        response.statusCode === undefined ||
                        response.statusCode < 200 ||
                        response.statusCode >= 300
                    ) {
                        callback(
                            new Error(
                                `Location request failed with status code: ${response.statusCode}`
                            )
                        );
    
                        return;
                    }
    
                    const parseData: GeocodingApiResponse = JSON.parse(data);
    
                    const location = parseData.results?.[0];

                    if (!location) {

                        callback(
                            new Error(
                                `Could not find a location matching '${city}'.`
                            )
                        );

                        return;
                    }

                    callback(null, location);

                } catch (error) {

                    if (error instanceof Error) {

                        callback(error);

                    } else {

                        callback(
                            new Error(
                                'Unable to get location data.'
                            )
                        );
                    }
                }
            });

        });

        request.setTimeout(10_000, () => {

            request.destroy(
                new Error('Location request timed out.')
            );
        });
        
        request.on('error', (error) => {

            callback(
                new Error(
                    `Unable to retrieve location: ${error.message}`
                )
            );
        });
       
    
}

function getWeather(
    latitude: number,
    longitude: number,
    locationName: string,
    callback: (error: Error | null, data?: WeatherData) => void
): void {

    console.log(`Fetching weather for ${locationName}...`);

    const url = `${WEATHER_API_URL}` +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&current=temperature_2m,apparent_temperature,wind_speed_10m,weather_code`;


    https.get(url, (response) => {

        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {

            try {

                if (
                    response.statusCode === undefined ||
                    response.statusCode < 200 ||
                    response.statusCode >= 300
                ) {
                    callback(
                        new Error(
                            `Weather request failed with status code: ${response.statusCode}`
                        )
                    );

                    return;
                }

                const parseData: WeatherApiResponse = JSON.parse(data);

                const weather: WeatherData = {

                    temperature: parseData.current.temperature_2m,
                    apparentTemperature: parseData.current.apparent_temperature,
                    windSpeed: parseData.current.wind_speed_10m,
                    weatherCode: parseData.current.weather_code
                };

                callback(null, weather);

            } catch (error) {

                if (error instanceof Error) {

                    callback(error);

                } else {

                    callback(
                        new Error('Unknown error occurred while parsing weather data.')
                    );

                }
            }
        });

    }).on('error', (error) => {

        callback(error);
    });

}

{/*getWeather((error, weather) => {

    if (error) {

        console.error(
            `[ERROR] Unable to fetch weather: ${error.message}`
        );

        return;
    }

    if (!weather) {

        console.error(
            '[ERROR] Weather data was not returned.'
        );

        return;
    }

    console.log('\n===============================');
    console.log('WEATHER');
    console.log('===============================');

    console.log(`Location: ${LOCATION_NAME}`);
    console.log(`Temperature: ${weather.temperature}°C`);
    console.log(`Feels Like: ${weather.apparentTemperature}°C`);

    console.log(`Wind speed: ${weather.windSpeed} km/h`);
    console.log(`Weather Code: ${weather.weatherCode}`);

});*/}

function getNews(
    callback: (error: Error | null, data?: NewsPost[]) => void
): void {

    console.log('Fetching news headlines...');

    https.get(NEWS_API_URL, (response) => {

        let data = "";

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {

            try {

                if (
                    response.statusCode === undefined ||
                    response.statusCode < 200 ||
                    response.statusCode >= 300
                ) {
                    callback(
                        new Error(
                            `News request failed with status code: ${response.statusCode}`
                        )
                    );

                    return;
                }

                const parsedData: NewsApiResponse = JSON.parse(data);

                callback(null, parsedData.posts);

            } catch (error) {
                if (error instanceof Error) {

                    callback(error);

                } else {

                    callback(
                        new Error('Unknown error occurred while parsing news data.')
                    );

                }
            }
        });
    }).on('error', (error) => {

        callback(error);
    });
}

// Testing news callback function
{/*getNews((error, posts) => {

    if (error) {

        console.error(
            `[ERROR] Unable to fetch news: ${error.message}`
        );

        return;
    }

    if (!posts) {

        console.error(
            '[ERROR] News data was not returned.'
        );

        return;
    }

    console.log('\n===============================');
    console.log('NEWS HEADLINES');
    console.log('===============================');

    posts.forEach((post, index) => {
        console.log(`${index + 1}. ${post.title}`);
    });

});*/}

// testing all functions
askForMyCityCallback((city) => {

    if (!city) {

        displayError(
            'Please enter a city.'
        );

        return;
    }

    getCoordinates(
        city,
        (locationError, location) => {

            if(locationError) {
                displayError(
                    locationError.message
                );

                return
            }

            if (!location) {
                displayError(
                    'Location data was not returned.'
                );

                return;
            }

            console.log(
                `\nLocation found: ${location.name}` +
                `${location.country ? `, ${location.country}` : ''}`
            );

            getWeather(
                location.latitude,
                location.longitude,
                location.name,

                (weatherError, weather) => {

                    if (weatherError) {

                        displayError(
                            `Unable to fetch weather: ${weatherError.message}`
                        );

                        return;
                    }


                    if (!weather) {

                        displayError(
                            "Weather data was not returned."
                        );

                        return;
                    }


                    getNews((newsError, posts) => {

                        if (newsError) {

                            displayError(
                                `Unable to fetch news: ${newsError.message}`
                            );

                            return;
                        }


                        if (!posts) {

                            displayError(
                                "News data was not returned."
                            );

                            return;
                        }

                        displayDashboard(
                            location.name,
                            weather,
                            posts
                        );


                        console.log(
                            "CALLBACK VERSION COMPLETED"
                        );

                        console.log(
                            "======================================"
                        );

                    });

                }

            );

        }

    );

});
    