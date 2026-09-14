// structure of the weather data coming directly from the API
export interface WeatherApiResponse {
    current: {
        temperature_2m: number;
        apparent_temperature: number;
        wind_speed_10m: number;
        weather_code: number; // code that represents the weather condition
    };
}

// my applications cleaner version of the weather data
// for easier readability
export interface WeatherData {
    temperature: number;
    apparentTemperature: number;
    windSpeed: number;
    weatherCode: number;
}

// represents one post/headline coming from DummyJSON API
export interface NewsPost {
    id: number;
    title: string;
    body: string;
}

// full DummyJSON response containing an array of posts
export interface NewsApiResponse {
    posts: NewsPost[];
}