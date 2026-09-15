//console.log('Promise version is running');

import * as https from 'https';

import {
    WEATHER_API_URL,
    LOCATION_NAME,
    NEWS_API_URL
} from './config'

import type {
    NewsApiResponse,
    NewsPost,
    WeatherApiResponse,
    WeatherData
} from './types'

import {
    displayDashboard,
    displayError
} from './display'

function getWeather(): Promise<WeatherData> {

    return new Promise((resolve, reject) => {

        console.log(`Fetching weather for ${LOCATION_NAME}...`);
    
        https.get(WEATHER_API_URL, (response) => {
    
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

// Weather domain below
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

{/*getWeather()
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

        console.log('\n=======================================');
        console.log('PROMISE CHAINING DEMONSTRATION');
        console.log('======================================');

        displayDashboard(
            LOCATION_NAME,
            weather,
            posts
        );

        console.log('PROMISE CHAINING COMPLETED');
        console.log('=======================================');

    })
    .catch((error) => {

        if (error instanceof Error) {

            displayError(error.message`);
        } else {

            displayError(
                'Unknown error occurred.'
            );
        }
    });*/}

function runPromiseAllExample(): void {

    console.log('\n=======================================');
    console.log('PROMISE.ALL DEMONSTRATION');
    console.log('======================================');

    console.log('\nFetching weather and news at the same time...');

    Promise.all([
        getWeather(),
        getNews()
    ])
    .then(([ weather, posts ]) => {

        displayDashboard(
            LOCATION_NAME,
            weather,
            posts
        );

        console.log('PROMISE CHAINING COMPLETED');
        console.log('======================================');

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

// promise.all function testing
runPromiseAllExample();

// PROMISE RACE DEMONSTRATION
function runPromiseRaceExample(): void {

    console.log('\n=======================================');
    console.log('PROMISE.RACE DEMONSTRATION');
    console.log('======================================');

    console.log('\nFetching weather and news...');

    const weatherPromise = getWeather().then((weather) => {

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

runPromiseRaceExample();
