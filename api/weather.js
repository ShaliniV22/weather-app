// /api/weather.js (This code runs securely on the Vercel server)

// 1. Get the securely stored API key from Vercel's environment variables
const API_KEY = process.env.OPENWEATHER_API_KEY; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Vercel function handler
export default async function handler(request, response) {
  
  // Extract query parameters (like 'city') from the client request URL
  const url = new URL(request.url, `http://${request.headers.host}`);
  const city = url.searchParams.get('city');

  if (!city) {
    return new Response(JSON.stringify({ error: "Missing 'city' parameter" }), { status: 400 });
  }

  // Construct the secure URL using the HIDDEN API_KEY, units=metric, and the city
  const weatherUrl = `${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`;
  
  try {
    // 2. Make the secure request to OpenWeatherMap (Server-to-Server)
    const weatherResponse = await fetch(weatherUrl);
    const data = await weatherResponse.json();

    // 3. Send the response back to the client (your index.js)
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error("OpenWeatherMap API Error:", error);
    return new Response(JSON.stringify({ error: "Error fetching weather data." }), { status: 500 });
  }
}