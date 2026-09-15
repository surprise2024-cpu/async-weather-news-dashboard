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

export function displayDashboard(
    location: string,
    weather: WeatherData,
    posts: NewsPost[]
): void {

    console.log('\n=======================================');
    console.log('ASYNC WEATHER & NEWS DASHBOARD');
    console.log('======================================');

    console.log('\nWEATHER');
    console.log('--------------------------------------');

    console.log(`\nLocation: ${location}°C`);
    console.log(`Temperature: ${weather.temperature}°C`);
    console.log(`Feels Like: ${weather.apparentTemperature}°C`);
    console.log(`Wind Speed: ${weather.windSpeed} km/h`);
    console.log(`Weather Code: ${weather.weatherCode}`);

    console.log('\nNEWS HEADLINES');
    console.log('--------------------------------------');

    posts.forEach((post, index) => {

        console.log(
            `${index + 1}. ${post.title}`
        );

    });

    console.log('\n=======================================');
    
}

export function displayError(

    message: string

): void {

    console.error(`[ERROR]: ${message}`);
}

