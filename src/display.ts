import * as https from 'https'

import {
    WEATHER_API_URL,
    GEOCODING_API_URL,
    NEWS_API_URL
} from './config'

// imports are only being used as types, not actual JavaScript values.
import type {
    NewsApiResponse,
    NewsPost,
    WeatherApiResponse,
    WeatherData,
    GeocodingApiResponse,
    GeocodingResult
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
    console.log(`Weather Code: ${getWeatherCondition(weather.weatherCode)}`);

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

export function getWeatherCondition(code: number): string {

    const conditions: Record<number, string> = {
        "0": "Clear sky",
        "1": "Mainly clear",
        "2": "Partly cloudy",
        "3": "Overcast",
        "45": "Fog",
        "48": "Depositing rime fog",
        "51": "Light drizzle",
        "53": "Moderate drizzle",
        "55": "Dense drizzle",
        "56": "Light freezing drizzle",
        "57": "Dense freezing drizzle",
        "61": "Slight rain",
        "63": "Moderate rain",
        "65": "Heavy rain",
        "66": "Light freezing rain",
        "67": "Heavy freezing rain",
        "71": "Slight snow fall",
        "73": "Moderate snow fall",
        "75": "Heavy snow fall",
        "77": "Snow grains",
        "80": "Slight rain showers",
        "81": "Moderate rain showers",
        "82": "Violent rain showers",
        "85": "Slight snow showers",
        "86": "Heavy snow showers",
        "95": "Thunderstorm",
        "96": "Thunderstorm with slight hail",
        "99": "Thunderstorm with heavy hail"
    }

    return conditions[code] ?? 'Unknow weather condition';

}