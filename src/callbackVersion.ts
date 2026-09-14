//console.log('Callback version is running');

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

function getWeather(
    callback: (error: Error | null, data?: WeatherData) => void
): void {

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
                        new Error('Unknown error occurred while pasrsing weather data.')
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
                            `News request faild with status code: ${response.statusCode}`
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
                        new Error('Unknown error occurred while pasrsing news data.')
                    );

                }
            }
        });
    }).on('error', (error) => {

        callback(error);
    });
}

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

getWeather((weatherError, weather) => {

    if (weatherError) {

        console.error(
            `[ERROR] Unable to fetch weather: ${weatherError.message}`
        );

        return;
    }

    if (!weather) {

        console.error(
            `[ERROR] Weather data was not returned.`
        );

        return;
    }

    getNews((newsError, posts) => {

        if (newsError) {

            console.error(
                `[ERROR] Unable to fetch news: ${newsError.message}`
            );

            return;
        }

        if (!posts) {

            console.error(
                '[Error] News data was not returned.'
            );

            return;
        }

        console.log('\n===============================');
        console.log('ASYNC WEATHER & NEWS DASHBOARD');
        console.log('===============================');

        console.log('\nNEWS HEADLINES');
        console.log('===============================');

        console.log(`Location: ${LOCATION_NAME}`);
        console.log(`Temperature: ${weather.temperature}°C`);
        console.log(`Feels Like: ${weather.apparentTemperature}°C`);

        console.log(`Wind speed: ${weather.windSpeed} km/h`);
        console.log(`Weather Code: ${weather.weatherCode}`);

        console.log('\nNEWS HEADLINES');
        console.log('===============================');
        posts.forEach((post, index) => {
            console.log(`${index + 1}. ${post.title}`);
        });

        console.log('\n===============================');
        console.log('Callback version completed.');
        console.log('===============================');
    });
});