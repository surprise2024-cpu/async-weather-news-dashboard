//console.log('Async/Await version is running');

import * as https from 'https'

import {
    WEATHER_API_URL,
    GEOCODING_API_URL,
    NEWS_API_URL
} from './config'

import {
    askForMyCity
} from './input'

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
} from './display';
import { request } from 'http';

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
    longitude: number
): Promise<WeatherData> {

    return new Promise((resolve, reject) => {

        console.log(`\nFetching weather...`);

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

        const city = await askForMyCity();

        if (!city) {
            displayError('PLease enter a city.');

            return;
        }

        console.log(`\nSearch or ${city}...`);

        const location = await getCoordinates(city);

        console.log(
            `Location found: ${location.name}` +
            `${location.country ? `, ${location.name}`: ''} `
        );

        const [weather, posts] = await Promise.all([
            getWeather(
                location.latitude,
                location.longitude
            ),
            getNews()
        ]);

        displayDashboard(
            location.name,
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