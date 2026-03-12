// ===== Configuration =====
const USGS_SITE = '14092500';
const UPDATE_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
let updateTimer = null;
let countdownTimer = null;
let nextUpdateTime = null;

// ===== Weather Code Mappings =====
const weatherDescriptions = {
    0: 'Clear Sky',
    1: 'Mainly Clear',
    2: 'Partly Cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Rime Fog',
    51: 'Light Drizzle',
    53: 'Moderate Drizzle',
    55: 'Dense Drizzle',
    56: 'Light Freezing Drizzle',
    57: 'Dense Freezing Drizzle',
    61: 'Slight Rain',
    63: 'Moderate Rain',
    65: 'Heavy Rain',
    66: 'Light Freezing Rain',
    67: 'Heavy Freezing Rain',
    71: 'Slight Snowfall',
    73: 'Moderate Snowfall',
    75: 'Heavy Snowfall',
    77: 'Snow Grains',
    80: 'Slight Showers',
    81: 'Moderate Showers',
    82: 'Violent Showers',
    85: 'Slight Snow Showers',
    86: 'Heavy Snow Showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm w/ Hail',
    99: 'Thunderstorm w/ Heavy Hail'
};

const weatherIcons = {
    0: 'clear',
    1: 'mainly-clear',
    2: 'partly-cloudy',
    3: 'overcast',
    45: 'fog',
    48: 'fog',
    51: 'drizzle',
    53: 'drizzle',
    55: 'drizzle',
    56: 'drizzle',
    57: 'drizzle',
    61: 'rain',
    63: 'rain',
    65: 'heavy-rain',
    66: 'rain',
    67: 'heavy-rain',
    71: 'snow',
    73: 'snow',
    75: 'snow',
    77: 'snow',
    80: 'showers',
    81: 'showers',
    82: 'heavy-rain',
    85: 'snow',
    86: 'snow',
    95: 'thunderstorm',
    96: 'thunderstorm',
    99: 'thunderstorm'
};

// ===== SVG Weather Icons =====
function getWeatherSVG(code, isDay) {
    const type = weatherIcons[code] || 'clear';
    const sunColor = '#fbbf24';
    const moonColor = '#cbd5e1';
    const cloudColor = '#94a3b8';
    const darkCloud = '#64748b';

    switch (type) {
        case 'clear':
            if (isDay) {
                return `<circle cx="40" cy="40" r="16" fill="${sunColor}"/>
                    <g stroke="${sunColor}" stroke-width="3" stroke-linecap="round">
                        <line x1="40" y1="10" x2="40" y2="18"/>
                        <line x1="40" y1="62" x2="40" y2="70"/>
                        <line x1="10" y1="40" x2="18" y2="40"/>
                        <line x1="62" y1="40" x2="70" y2="40"/>
                        <line x1="18.8" y1="18.8" x2="24.4" y2="24.4"/>
                        <line x1="55.6" y1="55.6" x2="61.2" y2="61.2"/>
                        <line x1="18.8" y1="61.2" x2="24.4" y2="55.6"/>
                        <line x1="55.6" y1="24.4" x2="61.2" y2="18.8"/>
                    </g>`;
            }
            return `<circle cx="40" cy="40" r="16" fill="${moonColor}"/>
                    <circle cx="48" cy="33" r="12" fill="#0a0a0a"/>`;

        case 'mainly-clear':
            if (isDay) {
                return `<circle cx="32" cy="32" r="14" fill="${sunColor}"/>
                    <g stroke="${sunColor}" stroke-width="2.5" stroke-linecap="round">
                        <line x1="32" y1="6" x2="32" y2="13"/>
                        <line x1="32" y1="51" x2="32" y2="58"/>
                        <line x1="6" y1="32" x2="13" y2="32"/>
                        <line x1="51" y1="32" x2="58" y2="32"/>
                    </g>
                    <ellipse cx="52" cy="54" rx="14" ry="10" fill="${cloudColor}" opacity="0.6"/>`;
            }
            return `<circle cx="35" cy="32" r="14" fill="${moonColor}"/>
                    <circle cx="43" cy="25" r="10" fill="#0a0a0a"/>
                    <ellipse cx="52" cy="54" rx="14" ry="10" fill="${cloudColor}" opacity="0.6"/>`;

        case 'partly-cloudy':
            if (isDay) {
                return `<circle cx="30" cy="28" r="14" fill="${sunColor}"/>
                    <g stroke="${sunColor}" stroke-width="2" stroke-linecap="round">
                        <line x1="30" y1="6" x2="30" y2="12"/>
                        <line x1="30" y1="44" x2="30" y2="50"/>
                        <line x1="8" y1="28" x2="14" y2="28"/>
                        <line x1="46" y1="28" x2="52" y2="28"/>
                    </g>
                    <ellipse cx="46" cy="52" rx="22" ry="14" fill="${cloudColor}"/>
                    <ellipse cx="36" cy="48" rx="16" ry="12" fill="${darkCloud}"/>`;
            }
            return `<circle cx="30" cy="28" r="14" fill="${moonColor}"/>
                    <circle cx="38" cy="21" r="10" fill="#0a0a0a"/>
                    <ellipse cx="46" cy="52" rx="22" ry="14" fill="${cloudColor}"/>
                    <ellipse cx="36" cy="48" rx="16" ry="12" fill="${darkCloud}"/>`;

        case 'overcast':
            return `<ellipse cx="40" cy="42" rx="28" ry="16" fill="${cloudColor}"/>
                    <ellipse cx="30" cy="36" rx="20" ry="14" fill="${darkCloud}"/>
                    <ellipse cx="52" cy="38" rx="16" ry="12" fill="#78909c"/>`;

        case 'fog':
            return `<ellipse cx="40" cy="30" rx="24" ry="12" fill="${cloudColor}" opacity="0.6"/>
                    <line x1="14" y1="48" x2="66" y2="48" stroke="#9ca3af" stroke-width="3" stroke-linecap="round" opacity="0.5"/>
                    <line x1="18" y1="56" x2="62" y2="56" stroke="#9ca3af" stroke-width="3" stroke-linecap="round" opacity="0.4"/>
                    <line x1="22" y1="64" x2="58" y2="64" stroke="#9ca3af" stroke-width="3" stroke-linecap="round" opacity="0.3"/>`;

        case 'drizzle':
            return `<ellipse cx="40" cy="30" rx="24" ry="14" fill="${cloudColor}"/>
                    <ellipse cx="30" cy="26" rx="16" ry="12" fill="${darkCloud}"/>
                    <line x1="28" y1="50" x2="26" y2="58" stroke="#60a5fa" stroke-width="2" stroke-linecap="round"/>
                    <line x1="40" y1="50" x2="38" y2="58" stroke="#60a5fa" stroke-width="2" stroke-linecap="round"/>
                    <line x1="52" y1="50" x2="50" y2="58" stroke="#60a5fa" stroke-width="2" stroke-linecap="round"/>`;

        case 'rain':
            return `<ellipse cx="40" cy="28" rx="26" ry="14" fill="${darkCloud}"/>
                    <ellipse cx="30" cy="24" rx="18" ry="12" fill="#475569"/>
                    <line x1="24" y1="48" x2="20" y2="60" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round"/>
                    <line x1="34" y1="48" x2="30" y2="60" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round"/>
                    <line x1="44" y1="48" x2="40" y2="60" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round"/>
                    <line x1="54" y1="48" x2="50" y2="60" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round"/>`;

        case 'heavy-rain':
            return `<ellipse cx="40" cy="24" rx="28" ry="14" fill="#475569"/>
                    <ellipse cx="30" cy="20" rx="20" ry="12" fill="#374151"/>
                    <line x1="20" y1="44" x2="14" y2="62" stroke="#2563eb" stroke-width="3" stroke-linecap="round"/>
                    <line x1="32" y1="44" x2="26" y2="62" stroke="#2563eb" stroke-width="3" stroke-linecap="round"/>
                    <line x1="44" y1="44" x2="38" y2="62" stroke="#2563eb" stroke-width="3" stroke-linecap="round"/>
                    <line x1="56" y1="44" x2="50" y2="62" stroke="#2563eb" stroke-width="3" stroke-linecap="round"/>
                    <line x1="64" y1="44" x2="58" y2="62" stroke="#2563eb" stroke-width="3" stroke-linecap="round"/>`;

        case 'showers':
            return `<ellipse cx="40" cy="28" rx="24" ry="14" fill="${cloudColor}"/>
                    <ellipse cx="30" cy="24" rx="16" ry="12" fill="${darkCloud}"/>
                    <line x1="26" y1="48" x2="23" y2="58" stroke="#60a5fa" stroke-width="2" stroke-linecap="round"/>
                    <line x1="38" y1="48" x2="35" y2="58" stroke="#60a5fa" stroke-width="2" stroke-linecap="round"/>
                    <line x1="50" y1="48" x2="47" y2="58" stroke="#60a5fa" stroke-width="2" stroke-linecap="round"/>`;

        case 'snow':
            return `<ellipse cx="40" cy="28" rx="24" ry="14" fill="${cloudColor}"/>
                    <circle cx="26" cy="52" r="3" fill="#e2e8f0"/>
                    <circle cx="40" cy="56" r="3" fill="#e2e8f0"/>
                    <circle cx="54" cy="50" r="3" fill="#e2e8f0"/>
                    <circle cx="33" cy="64" r="2.5" fill="#e2e8f0"/>
                    <circle cx="48" cy="66" r="2.5" fill="#e2e8f0"/>`;

        case 'thunderstorm':
            return `<ellipse cx="40" cy="24" rx="28" ry="14" fill="#475569"/>
                    <ellipse cx="30" cy="20" rx="20" ry="12" fill="#374151"/>
                    <polygon points="38,38 30,54 38,54 32,70 50,48 42,48 48,38" fill="#fbbf24"/>`;

        default:
            return `<circle cx="40" cy="40" r="16" fill="${sunColor}"/>`;
    }
}

function getForecastIcon(code) {
    if (code === 0 || code === 1) return '☀️';
    if (code === 2) return '⛅';
    if (code === 3) return '☁️';
    if (code >= 45 && code <= 48) return '🌫️';
    if (code >= 51 && code <= 57) return '🌦️';
    if (code >= 61 && code <= 67) return '🌧️';
    if (code >= 71 && code <= 77) return '🌨️';
    if (code >= 80 && code <= 82) return '🌦️';
    if (code >= 85 && code <= 86) return '🌨️';
    if (code >= 95) return '⛈️';
    return '🌤️';
}

// ===== Location =====
function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
            (err) => reject(err),
            { timeout: 10000, enableHighAccuracy: false }
        );
    });
}

async function reverseGeocode(lat, lon) {
    try {
        const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10`);
        const data = await resp.json();
        const addr = data.address || {};
        const city = addr.city || addr.town || addr.village || addr.county || 'Unknown';
        const country = addr.country || '';
        return `${city}, ${country}`;
    } catch {
        return `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
    }
}

// ===== Weather API =====
async function fetchWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_gusts_10m,uv_index,is_day` +
        `&hourly=temperature_2m,weather_code,precipitation_probability` +
        `&daily=sunrise,sunset` +
        `&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto&forecast_days=2`;
    
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Weather API error: ${resp.status}`);
    return resp.json();
}

// ===== USGS River API =====
async function fetchRiverData() {
    // Fetch water temp (00010), streamflow (00060), and gage height (00065)
    const url = `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${USGS_SITE}&parameterCd=00010,00060,00065&siteStatus=active`;
    
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`USGS API error: ${resp.status}`);
    return resp.json();
}

// ===== Parse USGS Data =====
function parseUSGSData(data) {
    const result = {
        waterTemp: null,
        streamflow: null,
        gageHeight: null,
        siteName: '',
        dateTime: ''
    };

    if (!data.value || !data.value.timeSeries) return result;

    const series = data.value.timeSeries;
    result.siteName = series[0]?.sourceInfo?.siteName || 'Unknown Site';

    series.forEach(ts => {
        const paramCode = ts.variable?.variableCode?.[0]?.value;
        const values = ts.values?.[0]?.value;
        if (!values || values.length === 0) return;
        
        const latest = values[values.length - 1];
        const val = parseFloat(latest.value);
        
        if (paramCode === '00010') {
            // Water temp in Celsius, convert to Fahrenheit
            result.waterTemp = Math.round(val * 9/5 + 32);
            result.dateTime = latest.dateTime;
        } else if (paramCode === '00060') {
            result.streamflow = val;
            if (!result.dateTime) result.dateTime = latest.dateTime;
        } else if (paramCode === '00065') {
            result.gageHeight = val;
            if (!result.dateTime) result.dateTime = latest.dateTime;
        }
    });

    return result;
}

// ===== Update SVG Animations Based on Data =====
function updateThermometerSVG(tempF) {
    if (tempF === null) return;
    // Map temp range: 32°F -> minimal fill, 100°F -> full fill
    const minTemp = 32, maxTemp = 100;
    const pct = Math.max(0, Math.min(1, (tempF - minTemp) / (maxTemp - minTemp)));
    
    const bulbCenterY = 230; // Center of bulb
    const minY = 30;  // top of tube area
    const maxTubeY = 200; // bottom of visible tube
    
    // Calculate where the top of the fill should be
    const fillTopY = maxTubeY - (pct * (maxTubeY - minY));
    // Height extends from fillTopY down to just above bulb center
    const fillHeight = bulbCenterY - fillTopY - 25; // -25 to connect smoothly with bulb
    
    const tubeFill = document.getElementById('therm-tube-fill');
    if (tubeFill) {
        // Update the base values for animation
        const animRange = 5;
        tubeFill.setAttribute('y', fillTopY);
        tubeFill.setAttribute('height', fillHeight);
        
        // Update animations
        const yAnim = tubeFill.querySelector('animate[attributeName="y"]');
        const hAnim = tubeFill.querySelector('animate[attributeName="height"]');
        if (yAnim) {
            yAnim.setAttribute('values', `${fillTopY + animRange};${fillTopY};${fillTopY + animRange}`);
        }
        if (hAnim) {
            hAnim.setAttribute('values', `${fillHeight - animRange};${fillHeight};${fillHeight - animRange}`);
        }
    }
    
    // Color based on temperature
    const thermGrad = document.getElementById('therm-fill');
    if (thermGrad && tempF > 70) {
        thermGrad.querySelector('stop').setAttribute('stop-color', '#ef4444');
        thermGrad.querySelectorAll('stop')[1].setAttribute('stop-color', '#f87171');
    } else if (thermGrad && tempF > 55) {
        thermGrad.querySelector('stop').setAttribute('stop-color', '#f59e0b');
        thermGrad.querySelectorAll('stop')[1].setAttribute('stop-color', '#fbbf24');
    }
}

function updateStreamflowSVG(flow) {
    if (flow === null) return;
    // Adjust wave speed based on flow rate
    const wave1 = document.querySelector('#wave1 animateTransform');
    const wave2 = document.querySelector('#wave2 animateTransform');
    
    let speed;
    if (flow > 10000) speed = 1;
    else if (flow > 5000) speed = 2;
    else if (flow > 1000) speed = 3;
    else speed = 5;
    
    if (wave1) wave1.setAttribute('dur', `${speed}s`);
    if (wave2) wave2.setAttribute('dur', `${speed * 1.3}s`);
    
    // Adjust water level based on flow
    const pct = Math.min(1, flow / 15000);
    const waterY = 240 - (pct * 130);
    const wave1El = document.getElementById('wave1');
    const wave2El = document.getElementById('wave2');
    if (wave1El) {
        const d = `M-200,${waterY} Q-150,${waterY-20} -100,${waterY} Q-50,${waterY+20} 0,${waterY} Q50,${waterY-20} 100,${waterY} Q150,${waterY+20} 200,${waterY} Q250,${waterY-20} 300,${waterY} Q350,${waterY+20} 400,${waterY} L400,280 L-200,280 Z`;
        wave1El.setAttribute('d', d);
    }
    if (wave2El) {
        const d2 = `M-200,${waterY+15} Q-150,${waterY} -100,${waterY+15} Q-50,${waterY+30} 0,${waterY+15} Q50,${waterY} 100,${waterY+15} Q150,${waterY+30} 200,${waterY+15} Q250,${waterY} 300,${waterY+15} Q350,${waterY+30} 400,${waterY+15} L400,280 L-200,280 Z`;
        wave2El.setAttribute('d', d2);
    }
    
    // Update arrow positions (right-pointing arrows)
    const arrows = document.querySelectorAll('#streamflow-svg polygon');
    const arrowY = waterY + 10;
    if (arrows.length >= 3) {
        arrows[0].setAttribute('points', `75,${arrowY} 55,${arrowY-10} 55,${arrowY+10}`);
        arrows[1].setAttribute('points', `110,${arrowY} 90,${arrowY-10} 90,${arrowY+10}`);
        arrows[2].setAttribute('points', `145,${arrowY} 125,${arrowY-10} 125,${arrowY+10}`);
    }
}

function updateGageHeightSVG(height) {
    if (height === null) return;
    // Scale marks: 0ft=y240, 2ft=y200, 4ft=y160, 6ft=y120, 8ft=y80
    // Each foot = 20 pixels, formula: y = 240 - (height * 20)
    const maxHeight = 8; // Max visible on scale
    const clampedHeight = Math.max(0, Math.min(maxHeight, height));
    
    const scaleBottom = 240; // 0 ft mark
    const pixelsPerFoot = 20;
    const waterTopY = scaleBottom - (clampedHeight * pixelsPerFoot);
    
    const containerTop = 62;
    const containerBottom = 258;
    const fillY = waterTopY;
    const fillHeight = containerBottom - waterTopY;
    
    const gageFill = document.getElementById('gage-fill');
    const gageFloat = document.getElementById('gage-float');
    
    if (gageFill) {
        const animRange = 6;
        gageFill.setAttribute('y', fillY);
        gageFill.setAttribute('height', fillHeight);
        
        const yAnim = gageFill.querySelector('animate[attributeName="y"]');
        const hAnim = gageFill.querySelector('animate[attributeName="height"]');
        if (yAnim) {
            yAnim.setAttribute('values', `${fillY + animRange};${fillY};${fillY + animRange}`);
        }
        if (hAnim) {
            hAnim.setAttribute('values', `${fillHeight - animRange};${fillHeight};${fillHeight - animRange}`);
        }
    }
    
    if (gageFloat) {
        const floatY = fillY;
        gageFloat.setAttribute('cy', floatY);
        const floatAnim = gageFloat.querySelector('animate');
        if (floatAnim) {
            floatAnim.setAttribute('values', `${floatY + 6};${floatY};${floatY + 6}`);
        }
    }
}

// ===== UI Update Functions =====
function updateCurrentWeather(data) {
    const current = data.current;
    const daily = data.daily;
    
    // Temperature
    document.getElementById('temp-value').textContent = Math.round(current.temperature_2m);
    
    // Condition
    const code = current.weather_code;
    document.getElementById('weather-condition').textContent = weatherDescriptions[code] || 'Unknown';
    
    // Weather Icon SVG
    const svgEl = document.getElementById('weather-svg');
    svgEl.innerHTML = getWeatherSVG(code, current.is_day === 1);
    
    // Sunrise/Sunset
    if (daily.sunrise && daily.sunrise[0]) {
        const sr = new Date(daily.sunrise[0]);
        document.getElementById('sunrise').textContent = formatTime12(sr);
    }
    if (daily.sunset && daily.sunset[0]) {
        const ss = new Date(daily.sunset[0]);
        document.getElementById('sunset').textContent = formatTime12(ss);
    }
    
    // Current time
    const now = new Date();
    document.getElementById('weather-time').textContent = formatTime12Full(now);
    
    // Weather Details
    document.getElementById('feels-like').textContent = Math.round(current.apparent_temperature);
    document.getElementById('humidity').textContent = Math.round(current.relative_humidity_2m);
    document.getElementById('humidity-bar').style.width = current.relative_humidity_2m + '%';
    document.getElementById('wind-speed').textContent = Math.round(current.wind_speed_10m);
    document.getElementById('wind-gusts').textContent = Math.round(current.wind_gusts_10m);
    document.getElementById('pressure').textContent = Math.round(current.pressure_msl);
    document.getElementById('uv-index').textContent = Math.round(current.uv_index);
    
    const cloudCover = Math.round(current.cloud_cover);
    document.getElementById('cloud-cover').textContent = cloudCover;
    document.getElementById('cloud-cover-bar').style.width = cloudCover + '%';
    
    // Rain chance - from hourly data for current hour
    let rainChance = '--';
    if (data.hourly?.precipitation_probability) {
        const now = new Date();
        const hourIdx = data.hourly.time.findIndex(t => new Date(t) >= now);
        const idx = Math.max(0, hourIdx);
        rainChance = data.hourly.precipitation_probability[idx] ?? 0;
    }
    document.getElementById('rain-chance').textContent = typeof rainChance === 'number' ? Math.round(rainChance) : rainChance;
    if (typeof rainChance === 'number') {
        document.getElementById('rain-chance-bar').style.width = Math.round(rainChance) + '%';
    }
    
    // UV dots
    updateUVDots(current.uv_index);
}

function updateUVDots(uvIndex) {
    const dots = document.querySelectorAll('.uv-dot');
    const val = Math.round(uvIndex);
    dots.forEach((dot, i) => {
        dot.className = 'uv-dot';
        if (i < val) {
            if (val <= 2) dot.classList.add('active');
            else if (val <= 5) dot.classList.add('moderate');
            else dot.classList.add('high');
        }
    });
}

function updateHourlyForecast(data) {
    const container = document.getElementById('forecast-list');
    container.innerHTML = '';
    
    const hourly = data.hourly;
    if (!hourly) return;
    
    const now = new Date();
    const currentHourIndex = hourly.time.findIndex(t => new Date(t) >= now);
    const startIndex = Math.max(0, currentHourIndex);
    
    for (let i = startIndex; i < Math.min(startIndex + 24, hourly.time.length); i++) {
        const time = new Date(hourly.time[i]);
        const temp = Math.round(hourly.temperature_2m[i]);
        const code = hourly.weather_code[i];
        const rain = hourly.precipitation_probability?.[i] ?? 0;
        
        const item = document.createElement('div');
        item.className = 'forecast-item';
        item.innerHTML = `
            <span class="forecast-time">${formatTimeHour(time)}</span>
            <span class="forecast-icon">${getForecastIcon(code)}</span>
            <span class="forecast-temp">${temp}°</span>
            <span class="forecast-rain">${rain}%</span>
        `;
        container.appendChild(item);
    }
}

function updateRiverDisplay(riverData) {
    // Water Temp
    if (riverData.waterTemp !== null) {
        document.getElementById('water-temp-value').textContent = riverData.waterTemp;
        updateThermometerSVG(riverData.waterTemp);
    }
    
    // Streamflow
    if (riverData.streamflow !== null) {
        document.getElementById('streamflow-value').textContent = 
            riverData.streamflow >= 1000 
                ? Number(riverData.streamflow).toLocaleString() 
                : riverData.streamflow;
        updateStreamflowSVG(riverData.streamflow);
    }
    
    // Gage Height
    if (riverData.gageHeight !== null) {
        document.getElementById('gage-height-value').textContent = riverData.gageHeight.toFixed(2);
        updateGageHeightSVG(riverData.gageHeight);
    }
    
    // Site name & time
    document.getElementById('river-site-name').textContent = riverData.siteName;
    if (riverData.dateTime) {
        const dt = new Date(riverData.dateTime);
        document.getElementById('river-data-time').textContent = `Data from: ${formatTime12Full(dt)}`;
    }
}

// ===== Time Formatting =====
function formatTime12(date) {
    let h = date.getHours();
    const m = date.getMinutes().toString().padStart(2, '0');
    const period = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m}`;
}

function formatTime12Full(date) {
    let h = date.getHours();
    const m = date.getMinutes().toString().padStart(2, '0');
    const period = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h.toString().padStart(2, '0')}:${m} ${period}`;
}

function formatTimeHour(date) {
    let h = date.getHours();
    const period = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:00 ${period}`;
}

// ===== Main Data Fetch =====
async function fetchAllData() {
    try {
        // Get location
        const loc = await getUserLocation();
        
        // Fetch weather and river data in parallel
        const [weatherData, usgsData] = await Promise.all([
            fetchWeather(loc.lat, loc.lon),
            fetchRiverData()
        ]);
        
        // Update location name (non-blocking)
        reverseGeocode(loc.lat, loc.lon).then(name => {
            document.getElementById('location-name').textContent = name;
        });
        
        // Update weather UI
        updateCurrentWeather(weatherData);
        updateHourlyForecast(weatherData);
        
        // Update river UI
        const riverData = parseUSGSData(usgsData);
        updateRiverDisplay(riverData);
        
        // Update footer - start countdown
        nextUpdateTime = Date.now() + UPDATE_INTERVAL_MS;
        startCountdown();
        
        console.log('Dashboard updated at', new Date().toLocaleTimeString());
        
    } catch (err) {
        console.error('Error fetching data:', err);
        // Show error to user gracefully
        if (err.code === 1) {
            document.getElementById('location-name').textContent = 'Location access denied';
        }
    }
}

// ===== Auto-refresh =====
function startAutoRefresh() {
    // Initial fetch
    fetchAllData();
    
    // Schedule updates
    if (updateTimer) clearInterval(updateTimer);
    updateTimer = setInterval(fetchAllData, UPDATE_INTERVAL_MS);
}

// ===== Countdown Timer =====
function startCountdown() {
    if (countdownTimer) clearTimeout(countdownTimer);
    
    function updateCountdown() {
        if (!nextUpdateTime) return;
        
        const now = Date.now();
        const remaining = Math.max(0, nextUpdateTime - now);
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        
        document.getElementById('next-update').textContent = 
            `Next update in: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Schedule next update at the exact next second boundary
        if (remaining > 0) {
            const msUntilNextSecond = 1000 - (now % 1000);
            countdownTimer = setTimeout(updateCountdown, msUntilNextSecond);
        }
    }
    
    updateCountdown();
}

// ===== Update clock every minute =====
function startClock() {
    setInterval(() => {
        const now = new Date();
        document.getElementById('weather-time').textContent = formatTime12Full(now);
    }, 60000);
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    startAutoRefresh();
    startClock();
});
