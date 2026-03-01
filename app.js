document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('main-content');
    const locationNameEl = document.getElementById('location-name');
    const verdictTextEl = document.getElementById('main-verdict');
    const verdictReasonEl = document.getElementById('verdict-reason');
    const forecastGridEl = document.getElementById('forecast-grid');

    const infoTrigger = document.getElementById('info-trigger');
    const infoModal = document.getElementById('info-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');

    const changeLocBtn = document.getElementById('change-location-btn');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const locationModal = document.getElementById('location-modal');
    const closeLocModalBtn = document.getElementById('close-location-modal-btn');
    const manualLocInput = document.getElementById('manual-location-input');
    const searchLocBtn = document.getElementById('search-location-btn');
    const langToggleBtn = document.getElementById('lang-toggle-btn');

    // Theme initialization
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeToggleBtn.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
    }

    // Theme toggle
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        if (document.body.classList.contains('light-mode')) {
            themeToggleBtn.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
            localStorage.setItem('theme', 'light');
        } else {
            themeToggleBtn.innerHTML = '<i class="bi bi-brightness-high"></i>';
            localStorage.setItem('theme', 'dark');
        }
    });

    // Modals interactions
    infoTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        infoModal.classList.remove('hidden');
    });
    closeModalBtn.addEventListener('click', () => infoModal.classList.add('hidden'));

    changeLocBtn.addEventListener('click', () => {
        locationModal.classList.remove('hidden');
        setTimeout(() => manualLocInput.focus(), 100);
    });
    closeLocModalBtn.addEventListener('click', () => locationModal.classList.add('hidden'));

    searchLocBtn.addEventListener('click', () => {
        const query = manualLocInput.value.trim();
        if (query.length >= 2) {
            searchCity(query);
            locationModal.classList.add('hidden');
        }
    });

    manualLocInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchLocBtn.click();
        }
    });

    // --- Słownik tłumaczeń (i18n) ---
    const translations = {
        pl: {
            title: "Czy warto umyć auto?",
            loader_title: "Pobieranie lokalizacji i pogody...",
            loader_desc: "Zezwól na lokalizację, abyśmy mogli doradzić, czy myć powóz.",
            locating: "Lokalizowanie...",
            change_location: "Zmień lokalizację",
            toggle_theme: "Przełącz motyw",
            forecast_title: "Prognoza na najbliższe 7 dni",
            verdict_title: "Na podstawie prognozy, proponujemy:",
            made_by: "Realizacja",
            data_from: "Dane polegają na",
            about_title: "O Stronie",
            about_p1: "Myć nie myć to bardzo prosty mechanizm dla kierowców.",
            about_p2: "Aplikacja sprawdza prognozę opadów używając darmowego interfejsu <strong>Open-Meteo API</strong> na dzisiaj i najbliższe 2 dni dla Twojej dokładnej lokalizacji. Jeżeli spodziewane są jakiekolwiek opady np. deszczu, śniegu lub mżawki, bezlitosny algorytm pokaże wielkim drukiem by wstrzymać się z myciem. W przeciwnym razie śmiało - auto będzie darmowo czyste na minimum 3 dni z dzisiejszym włącznie!",
            about_close: "Zrozumiano, zamknij",
            search_title: "Gdzie cię szukać?",
            search_desc: "Wpisz miasto (np. Warszawa lub małą wieś), w okolicach na które rzucimy okiem pogodowym.",
            search_placeholder: "np. Kraków...",
            search_cancel: "Anuluj",
            err_conn: "Błąd połączenia z Open-Meteo",
            refresh_btn: "Odśwież stronę",
            err_server: "Błędny odczyt z serwera pogody.",
            err_notfound: "Nie znaleźliśmy takiej miejscowości. Spróbuj podać większe miasto w pobliżu.",
            prompt_manual_msg: "Pobierzemy prognozę podając manualnie.",
            prompt_manual_title: "Zlokalizujmy Cię manualnie",
            prompt_manual_btn: "Wpisz miasto",
            loading_title: "Analiza chmur...",
            loading_desc: "Pobieranie dokładnej prognozy.",
            current_loc: "Obecna lokalizacja",
            satellite_view: "Podgląd satelitarny",
            day_today: "Dzisiaj",
            day_tomorrow: "Jutro",
            day_today_short: "Dziś",
            verdict_no: "NIE MYĆ!",
            verdict_no_reason: "Lepiej przełóż to na później. Prognozujemy opady:",
            verdict_and: "oraz",
            verdict_yes: "MYĆ!",
            verdict_yes_reason: "Świetne wieści! Przez najbliższe 3 dni spodziewany jest całkowity brak opadów."
        },
        en: {
            title: "To Wash or Not To Wash?",
            loader_title: "Fetching location and weather...",
            loader_desc: "Allow location access so we can advise if you should wash your car.",
            locating: "Locating...",
            change_location: "Change location",
            toggle_theme: "Toggle theme",
            forecast_title: "7-Day Forecast",
            verdict_title: "Based on the forecast, we suggest:",
            made_by: "Made by",
            data_from: "Data relies on",
            about_title: "About",
            about_p1: "To Wash or Not To Wash is a very simple tool for drivers.",
            about_p2: "The app checks the precipitation forecast using the free <strong>Open-Meteo API</strong> for today and the next 2 days for your exact location. If any precipitation like rain, snow, or drizzle is expected, the ruthless algorithm will show a huge sign to hold off on washing. Otherwise, go ahead - your car will be naturally clean for at least 3 days including today!",
            about_close: "Understood, close",
            search_title: "Where are you?",
            search_desc: "Enter a city (e.g., London or a small village) around which we will keep a weather eye out.",
            search_placeholder: "e.g., New York...",
            search_cancel: "Cancel",
            err_conn: "Connection error with Open-Meteo",
            refresh_btn: "Refresh page",
            err_server: "Bad response from weather server.",
            err_notfound: "We didn't find such a place. Try typing a larger nearby city.",
            prompt_manual_msg: "We'll fetch the forecast if you enter it manually.",
            prompt_manual_title: "Let's locate you manually",
            prompt_manual_btn: "Enter city",
            loading_title: "Analyzing clouds...",
            loading_desc: "Fetching precise forecast.",
            current_loc: "Current location",
            satellite_view: "Satellite view",
            day_today: "Today",
            day_tomorrow: "Tomorrow",
            day_today_short: "Today",
            verdict_no: "DO NOT WASH!",
            verdict_no_reason: "Better put it off for later. We forecast precipitation:",
            verdict_and: "and",
            verdict_yes: "WASH!",
            verdict_yes_reason: "Great news! Total lack of precipitation is expected over the next 3 days."
        }
    };

    // Detect language
    const browserLang = (navigator.language || navigator.userLanguage).toLowerCase();

    // Check localStorage for saved lang override
    const savedLang = localStorage.getItem('language');

    // Check domain for default lang
    const hostname = window.location.hostname;
    let defaultLang = 'pl'; // fallback
    if (hostname.includes('washornot.today')) {
        defaultLang = 'en';
    } else if (hostname.includes('mycniemyc.pl')) {
        defaultLang = 'pl';
    } else {
        defaultLang = browserLang.startsWith('pl') ? 'pl' : 'en';
    }

    let currentLang = savedLang ? savedLang : defaultLang;

    // Initialize language toggle button
    langToggleBtn.textContent = currentLang === 'pl' ? 'EN' : 'PL';

    // Handle manual language toggle
    langToggleBtn.addEventListener('click', () => {
        currentLang = currentLang === 'pl' ? 'en' : 'pl';
        localStorage.setItem('language', currentLang);
        langToggleBtn.textContent = currentLang === 'pl' ? 'EN' : 'PL';

        translateUI();

        // Re-resolve location name in new language if it's available
        const currentLocText = locationNameEl.textContent;
        // Re-run the weather process if we already have daily data cached
        // For simplicity, we can just reload the page or re-fetch. 
        // Reloading is the cleanest way to ensure all dynamic data (dates/cities) refreshes correctly immediately.
        location.reload();
    });

    function t(key) {
        return translations[currentLang][key] || key;
    }

    function translateUI() {
        // Standard elements 
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[currentLang][key]) {
                el.innerHTML = translations[currentLang][key]; // innerHTML allow for nested tags if any like <strong>
            }
        });

        // title, placeholders, etc. attributes
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
        });

        document.querySelectorAll('[data-i18n-ph]').forEach(el => {
            el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph')));
        });
    }

    // Start application logic
    initApp();

    function initApp() {
        translateUI(); // Translate static HTML at boot
        // Try to get geocoded position from browser
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchWeatherData(position.coords.latitude, position.coords.longitude);
                    resolveLocationName(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.warn("Geolocation denied or error:", error);
                    showManualLocationPrompt();
                },
                { timeout: 10000, maximumAge: 600000 }
            );
        } else {
            showManualLocationPrompt();
        }
    }

    function showManualLocationPrompt(message = t('prompt_manual_msg')) {
        loader.innerHTML = `
            <i class="bi bi-geo-alt-fill spin-icon" style="color:#ef4444; animation:none; transform:scale(1);"></i>
            <h2>${t('prompt_manual_title')}</h2>
            <p>${message}</p>
            <button class="action-btn" id="initial-manual-btn" style="margin-top:15px;"><i class="bi bi-search"></i> ${t('prompt_manual_btn')}</button>
        `;
        document.getElementById('initial-manual-btn').addEventListener('click', () => {
            locationModal.classList.remove('hidden');
            setTimeout(() => manualLocInput.focus(), 100);
        });
    }

    function showLoading() {
        loader.classList.remove('hidden');
        mainContent.classList.add('hidden');
        loader.innerHTML = `
            <i class="bi bi-cloud-arrow-down-fill spin-icon"></i>
            <h2>${t('loading_title')}</h2>
            <p>${t('loading_desc')}</p>
        `;
    }

    async function searchCity(query) {
        showLoading();
        try {
            // Geocoding using Open-Meteo
            const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=pl&format=json`);
            const data = await res.json();

            if (data.results && data.results.length > 0) {
                const city = data.results[0];
                locationNameEl.textContent = `${city.name}, ${city.admin1 || city.country}`;
                fetchWeatherData(city.latitude, city.longitude);
            } else {
                throw new Error("City not found");
            }
        } catch (e) {
            console.error(e);
            showManualLocationPrompt(t('err_notfound'));
        }
    }

    async function resolveLocationName(lat, lon) {
        // Reverse geocoding (using bigdatacloud free api for simplicity, no key needed)
        try {
            const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=${currentLang}`);
            const data = await res.json();
            // Czasem zwraca pustą nazwę jeśli wieś, wtedy weź locality lub country
            locationNameEl.textContent = data.city || data.locality || data.principalSubdivision || t('satellite_view');
        } catch (e) {
            locationNameEl.textContent = t('current_loc');
        }
    }

    async function fetchWeatherData(lat, lon) {
        try {
            // daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
            const res = await fetch(url);

            if (!res.ok) throw new Error("API return error");
            const data = await res.json();

            processWeatherData(data.daily);
        } catch (e) {
            console.error(e);
            loader.innerHTML = `
                <i class="bi bi-x-circle-fill spin-icon" style="color:#ef4444; animation:none; transform:scale(1);"></i>
                <h2>${t('err_conn')}</h2>
                <button class="action-btn" onclick="location.reload()" style="margin-top:20px;">${t('refresh_btn')}</button>
            `;
        }
    }

    function processWeatherData(daily) {
        // Zabezpieczenie przed brakiem danych
        if (!daily || !daily.time) {
            showManualLocationPrompt(t('err_server'));
            return;
        }

        const { time, weathercode, temperature_2m_max, temperature_2m_min, precipitation_sum } = daily;

        let shouldWash = true;
        let rainReason = [];

        // Algorytm: Sprawdzamy dzisiaj + 2 kolejne dni (3 dni)
        // Jeśli precipitation_sum[i] > 0, decydujemy NIE MYĆ.
        // Precipitation sum podane jest w milimetrach (mm).
        for (let i = 0; i < 3 && i < time.length; i++) {
            if (precipitation_sum[i] > 0) {
                shouldWash = false;
                const d = new Date(time[i]);
                let dayName = d.toLocaleDateString(currentLang === 'pl' ? 'pl-PL' : 'en-US', { weekday: 'long' });
                // Zamien pierwsza litere na wielka
                dayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);

                let dayLabel = dayName;
                if (i === 0) dayLabel = t('day_today');
                if (i === 1) dayLabel = t('day_tomorrow');

                rainReason.push(`${dayLabel} (${precipitation_sum[i]} mm)`);
            }
        }

        renderVerdict(shouldWash, rainReason);
        renderForecastCards(time, weathercode, temperature_2m_max, temperature_2m_min, precipitation_sum);

        loader.classList.add('hidden');
        mainContent.classList.remove('hidden');
    }

    function renderVerdict(shouldWash, rainReason) {
        verdictTextEl.classList.remove('wash', 'no-wash');

        if (!shouldWash) {
            verdictTextEl.textContent = t('verdict_no');
            verdictTextEl.classList.add('no-wash');
            verdictReasonEl.innerHTML = `${t('verdict_no_reason')} <br> <strong>${rainReason.join(` ${t('verdict_and')} `)}</strong>.`;
        } else {
            verdictTextEl.textContent = t('verdict_yes');
            verdictTextEl.classList.add('wash');
            verdictReasonEl.textContent = t('verdict_yes_reason');
        }
    }

    function renderForecastCards(times, codes, tMax, tMin, precip) {
        forecastGridEl.innerHTML = '';
        const limit = Math.min(7, times.length); // Pokazujemy do 7 dni

        const dzisiajStr = new Date().toISOString().split('T')[0];

        for (let i = 0; i < limit; i++) {
            const dateObj = new Date(times[i]);
            let dayName = dateObj.toLocaleDateString(currentLang === 'pl' ? 'pl-PL' : 'en-US', { weekday: 'short' });

            // Poprawki estetyczne
            if (times[i] === dzisiajStr) {
                dayName = t('day_today_short');
            }

            const card = document.createElement('div');
            card.className = 'forecast-card' + (precip[i] > 0 ? ' is-raining' : '');

            const iconClass = getWeatherIcon(codes[i]);

            // Minimalistyczne ładowanie temperatury - średnia albo min/max
            card.innerHTML = `
                <div class="fc-day">${dayName}</div>
                <div class="fc-icon"><i class="${iconClass}"></i></div>
                <div class="fc-precip"><i class="bi bi-droplet"></i> ${precip[i]} mm</div>
                <div class="fc-temp">${Math.round(tMin[i])}° - ${Math.round(tMax[i])}°</div>
            `;
            forecastGridEl.appendChild(card);
        }
    }

    // WMO Weather interpretation codes
    // Mapowanie na ikony Bootstrap Icons
    function getWeatherIcon(code) {
        if (code === 0) return 'bi bi-sun';
        if (code === 1 || code === 2) return 'bi bi-cloud-sun';
        if (code === 3) return 'bi bi-clouds';
        if (code >= 45 && code <= 48) return 'bi bi-cloud-haze2'; // Mgła
        if (code >= 51 && code <= 55) return 'bi bi-cloud-drizzle'; // Mżawka
        if (code >= 56 && code <= 57) return 'bi bi-cloud-sleet'; // Marznąca mżawka
        if (code >= 61 && code <= 65) return 'bi bi-cloud-rain'; // Deszcz
        if (code >= 66 && code <= 67) return 'bi bi-cloud-sleet'; // Marznący deszcz
        if (code >= 71 && code <= 77) return 'bi bi-cloud-snow'; // Śnieg
        if (code >= 80 && code <= 82) return 'bi bi-cloud-rain-heavy'; // Ulewy
        if (code >= 85 && code <= 86) return 'bi bi-cloud-snow'; // Zamiecie
        if (code >= 95) return 'bi bi-cloud-lightning'; // Burza
        return 'bi bi-cloud'; // Fallback
    }
});
