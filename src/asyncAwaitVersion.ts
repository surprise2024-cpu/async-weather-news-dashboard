//console.log('Async/Await version is running');

import * as https from 'https'

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
import { displayDashboard, displayError } from './display';

function getWeather(): Promise<WeatherData> {

    return new Promise((resolve, reject) => {

        console.log(`\nFetching weather for ${LOCATION_NAME}...`);
    
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

// ASYNC/AWAIT DEMONSTRATION
async function runAsyncAwaitExample(): Promise<void> {

    console.log('\n=======================================');
    console.log('ASYNC/AWAIT DEMONSTRATION');
    console.log('======================================');

    try {

        const [weather, posts] = await Promise.all([
            getWeather(),
            getNews()
        ]);

        displayDashboard(
            LOCATION_NAME,
            weather,
            posts
        );

        console.log('ASYNC/AWAIT VERSION COMPLETED');
        console.log('=======================================');

    } catch (error) {
        if (error instanceof Error) {

            displayError(error.message);

        } else {

            displayError(
                'Unknown error occurred.'
            );

        }
    }
}

runAsyncAwaitExample();