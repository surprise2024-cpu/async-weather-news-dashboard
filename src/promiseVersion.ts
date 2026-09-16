//console.log('Promise version is running');

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
    displayError
} from './display'

import {
    askForMyCity
} from './input'
import { get } from 'http';

function getCoordinates(
    city: string
): Promise<GeocodingResult> {

    return new Promise((resolve, reject) => {

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
                        reject(
                            new Error(
                                `Location request failed with status code: ${response.statusCode}`
                            )
                        );
    
                        return;
                    }
    
                    const parseData: GeocodingApiResponse = JSON.parse(data);
    
                    const location = parseData.results?.[0];

                    if (!location) {

                        reject(
                            new Error(
                                `Could not find a location matching '${city}'.`
                            )
                        );

                        return;
                    }

                    resolve(location)

                } catch (error) {

                    if (error instanceof Error) {

                        reject(error);

                    } else {

                        reject(
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

            reject(
                new Error(
                    `Unable to retrieve location: ${error.message}`
                )
            );
        });
    });       
    
}

function getWeather(
    latitude: number,
    longitude: number,
    locationName: string
): Promise<WeatherData> {

    return new Promise((resolve, reject) => {

        console.log(`Fetching weather for ${locationName}...`);
    
        const url = `${WEATHER_API_URL}?latitude=${latitude}` + 
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
                        reject(
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

                    resolve(weather)

                } catch (error) {

                    if (error instanceof Error) {

                        reject(error);
                    } else {

                        reject(
                            new Error(
                                'Unknown error occurred while parsing weather data.'
                            )
                        );
                    }
                }
            });

        }).on('error', (error) => {

            reject(error);
        });

    });
}

// temporary test for the function
{/*getWeather()
    .then((weather) => {

        console.log('\nWEATHER');
        console.log('=======================================');

        console.log(`Location: ${LOCATION_NAME}`);
        console.log(`Temperature: ${weather.temperature}°C`);
        console.log(`Feels Like: ${weather.apparentTemperature}°C`);
        console.log(`Wind Speed: ${weather.windSpeed} km/h`);
        console.log(`Weather Code: ${weather.weatherCode}`);

    })
    .catch((error) => {

        if (error instanceof Error) {

            console.error(`[ERROR] Unable to fetch weather: ${error.message}`);
        } else {

            console.error(
                '[ERROR] Unknown weather error occurred.'
            );
        }
    });*/}


function getNews(): Promise<NewsPost[]> {

    return new Promise((resolve, reject) => {

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
                        reject(
                            new Error(
                                `News request failed with status code: ${response.statusCode}`
                            )
                        );
    
                        return;
                    }
    
                    const parsedData: NewsApiResponse = JSON.parse(data);
    
                    resolve(parsedData.posts);
    
                } catch (error) {
                    if (error instanceof Error) {
    
                        reject(error);
    
                    } else {
    
                        reject(
                            new Error('Unknown error occurred while parsing news data.')
                        );
    
                    }
                }
            });

        }).on('error', (error) => {
    
            reject(error);
            
        });

    });

}

function runPromiseChainExample(
    location: GeocodingResult
): Promise<void> {

    console.log('\n=======================================');
    console.log('PROMISE CHAINING DEMONSTRATION');
    console.log('======================================');

    return getWeather(
        location.latitude,
        location.longitude,
        location.name
    )
    .then((weather) => {

        console.log('Weather request completed');

        return getNews()
            .then((posts) => {

                return {
                    weather,
                    posts
                };
            });

    })
    .then(({ weather, posts }) => {

        

        displayDashboard(
            location.name,
            weather,
            posts
        );

        console.log('PROMISE CHAINING COMPLETED');
        console.log('=======================================');

    })
    .catch((error) => {

        if (error instanceof Error) {

            displayError(error.message);
        } else {

            displayError(
                'Unknown error occurred.'
            );
        }
    });

}
    

function runPromiseAllExample(
    location: GeocodingResult
): void {

    console.log('\n=======================================');
    console.log('PROMISE.ALL DEMONSTRATION');
    console.log('======================================');

    console.log('\nFetching weather and news at the same time...');

    Promise.all([
        getWeather(
            location.latitude,
            location.longitude,
            location.name
        ),
        getNews()
    ])
    .then(([ weather, posts ]) => {

        displayDashboard(
            location.name,
            weather,
            posts
        );

        console.log('PROMISE.ALL COMPLETED');
        console.log('======================================');

    });

}


// PROMISE RACE DEMONSTRATION
function runPromiseRaceExample(
    location: GeocodingResult
): void {

    console.log('\n=======================================');
    console.log('PROMISE.RACE DEMONSTRATION');
    console.log('======================================');

    console.log('\nFetching weather and news...');

    const weatherPromise = getWeather(
        location.latitude,
        location.longitude,
        location.name
    ).then((weather) => {

        return {

            source: 'Weather',
            data: weather
        };
    });

    const newsPromise = getNews().then((posts) => {

        return {
            
            source: 'News',
            data: posts
        };
    });

    Promise.race([
        weatherPromise,
        newsPromise
    ])
    .then((result) => {

        console.log('\nFastest response: ');
        
        console.log(`${result.source} responded first!`);
        
        console.log('\n======================================');
        console.log('\nPROMISE.RACE COMPLETED');
        console.log('======================================');

    });

}

askForMyCity()
    .then((city) => {

        if (!city) {
            throw new Error(
                'Please enter a city.'
            );
        }

        return getCoordinates(city);
        
    })
    .then((location) => {

        console.log(
            `Location found: ${location.name}` +
            `${location.country ? `, ${location.name}`: ''} `
        );

        // normal chaining demo
        return runPromiseChainExample(location)

            .then(() => {

                return runPromiseAllExample(location);
            })
            .then(() => {
                return runPromiseRaceExample(location);
            });
    })
    .catch((error) => {

        if (error instanceof Error) {

            displayError(error.message);

        } else {

            displayError(
                'Unknown error occurred.'
            );

        }

    });
