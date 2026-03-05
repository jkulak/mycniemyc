document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('main-content');
    const locationInput = document.getElementById('location-input');
    const verdictTextEl = document.getElementById('main-verdict');
    const verdictReasonEl = document.getElementById('verdict-reason');
    const forecastGridEl = document.getElementById('forecast-grid');

    const infoTrigger = document.getElementById('info-trigger');
    const infoModal = document.getElementById('info-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');

    // const changeLocBtn = document.getElementById('change-location-btn'); // Removed
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const locationModal = document.getElementById('location-modal');
    const closeLocModalBtn = document.getElementById('close-location-modal-btn');
    const manualLocInput = document.getElementById('manual-location-input');
    const searchLocBtn = document.getElementById('search-location-btn');
    const langToggleBtn = document.getElementById('lang-toggle-btn');
    const searchLocBtnDefaultContent = searchLocBtn ? searchLocBtn.innerHTML : '';

    // Global state cache for language switching without reload
    let currentLat = null;
    let currentLon = null;
    let currentDailyData = null;
    let lastFocusedElement = null;

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
        updateThemeToggleA11y();
    });

    // Modals interactions
    function openModal(modalEl, triggerEl, preferredFocusEl) {
        lastFocusedElement = triggerEl || document.activeElement;
        modalEl.classList.remove('hidden');
        const firstFocusable = preferredFocusEl || modalEl.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            setTimeout(() => firstFocusable.focus(), 50);
        }
    }

    function closeModal(modalEl) {
        modalEl.classList.add('hidden');
        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }
        lastFocusedElement = null;
    }

    function setLocationValue(city, region) {
        if (!locationInput) return;
        // Strip "Województwo " prefix if present (case-insensitive)
        const cleanRegion = region ? region.replace(/województwo\s+/i, '') : '';
        locationInput.value = cleanRegion ? `${city || ''}, ${cleanRegion}` : (city || '');
    }

    locationInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = locationInput.value.trim();
            if (query.length >= 2) {
                searchCity(query);
                locationInput.blur();
            }
        }
    });

    locationInput.addEventListener('focus', () => {
        locationInput.select();
    });
    closeLocModalBtn.addEventListener('click', () => closeModal(locationModal));
    closeModalBtn.addEventListener('click', () => closeModal(infoModal));
    if (infoTrigger) {
        infoTrigger.addEventListener('click', () => openModal(infoModal, infoTrigger, closeModalBtn));
    }

    [infoModal, locationModal].forEach((overlay) => {
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                closeModal(overlay);
            }
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;
        if (!locationModal.classList.contains('hidden')) {
            closeModal(locationModal);
            return;
        }
        if (!infoModal.classList.contains('hidden')) {
            closeModal(infoModal);
        }
    });

    searchLocBtn.addEventListener('click', () => {
        const query = manualLocInput.value.trim();
        if (query.length >= 2) {
            searchCity(query);
        }
    });

    manualLocInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchLocBtn.click();
        }
    });

    // --- słownik tłumaczeń (i18n) ---
    const translations = {
        pl: {
            title: "Czy warto umyć auto?",
            loader_title: "Pobieranie lokalizacji i pogody...",
            loader_desc: "Wpisz konkretną lokalizację",
            locating: "Lokalizowanie...",
            change_location: "Zmień lokalizację",
            change_language: "Zmień język",
            toggle_theme: "Przełącz motyw",
            switch_to_light: "Przełącz na jasny motyw",
            switch_to_dark: "Przełącz na ciemny motyw",
            forecast_title: "Prognoza na najbliższe 7 dni",
            verdict_title: "Na podstawie prognozy proponujemy:",
            made_by: "GiHub",
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
            use_my_location: "Użyj mojej lokalizacji",
            enter_city_manually: "Wpisz miasto ręcznie",
            affects_result: "Wpływa na wynik",
            info_about_page: "Informacje o stronie",
            search_loading: "Szukam...",
            verdict_no: "🙅🏻‍♂️ Nie myć",
            verdict_no_reason: "Lepiej przełóż to na później. Prognozujemy opady:",
            verdict_and: "oraz",
            verdict_yes: "🧼 Myć",
            verdict_yes_reason: "Świetne wieści! Przez najbliższe 3 dni spodziewany jest całkowity brak opadów."
        },
        en: {
            title: "To Wash or Not To Wash?",
            loader_title: "Fetching location and weather...",
            loader_desc: "Enter your specific location",
            locating: "Locating...",
            change_location: "Change location",
            change_language: "Change language",
            toggle_theme: "Toggle theme",
            switch_to_light: "Switch to light mode",
            switch_to_dark: "Switch to dark mode",
            forecast_title: "7-day forecast",
            verdict_title: "Based on the forecast, we suggest:",
            made_by: "GitHub",
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
            use_my_location: "Use my location",
            enter_city_manually: "Enter city manually",
            affects_result: "Affects result",
            info_about_page: "About this page",
            search_loading: "Searching...",
            verdict_no: "🙅🏻‍♂️ Don't wash",
            verdict_no_reason: "Better put it off for later. We forecast precipitation:",
            verdict_and: "and",
            verdict_yes: "🧼 Wash",
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

        // Re-resolve location name in new language if we have coordinates
        if (currentLat !== null && currentLon !== null) {
            resolveLocationName(currentLat, currentLon);
        }

        // Re-render the weather processing if we have cached daily data
        if (currentDailyData !== null) {
            processWeatherData(currentDailyData);
        }
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

        document.querySelectorAll('[data-i18n-aria]').forEach(el => {
            el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
        });

        if (langToggleBtn) langToggleBtn.setAttribute('aria-label', t('change_language'));
        if (infoTrigger) infoTrigger.setAttribute('aria-label', t('info_about_page'));
        updateThemeToggleA11y();
    }

    // Start application logic
    initApp();

    function initApp() {
        translateUI(); // Translate static HTML at boot
        showInitialChoicePanel();
    }

    function updateThemeToggleA11y() {
        if (!themeToggleBtn) return;
        const goesToLightMode = !document.body.classList.contains('light-mode');
        const label = goesToLightMode ? t('switch_to_light') : t('switch_to_dark');
        themeToggleBtn.setAttribute('aria-label', label);
        themeToggleBtn.setAttribute('title', label);
    }

    function requestUserGeolocation() {
        if (!("geolocation" in navigator)) {
            showManualLocationPrompt();
            return;
        }

        showLoading();
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
    }

    function showInitialChoicePanel() {
        loader.classList.remove('hidden');
        mainContent.classList.add('hidden');
        loader.innerHTML = `
            <div class="weather-fly-animation">
                <i class="bi bi-sun"></i>
                <i class="bi bi-cloud-sun"></i>
                <i class="bi bi-cloud"></i>
                <i class="bi bi-cloud-rain"></i>
            </div>
            <h2>${t('loader_title')}</h2>
            <p>${t('loader_desc')}</p>
            
            <div class="loader-actions">
                <div class="location-wrapper input-with-icon landing-input-group">
                    <i class="bi bi-geo-alt location-icon" aria-hidden="true"></i>
                    <input type="text" id="landing-location-input" class="text-input location-input" placeholder="${t('search_placeholder')}" aria-label="${t('search_placeholder')}">
                </div>
                
                <div class="divider-text">${t('verdict_and') === 'oraz' ? 'lub' : 'or'}</div>

                <button class="action-btn secondary-btn" id="use-geolocation-btn">
                    <i class="bi bi-crosshair"></i> ${t('use_my_location')}
                </button>
            </div>
        `;

        const useGeolocationBtn = document.getElementById('use-geolocation-btn');
        const landingInput = document.getElementById('landing-location-input');

        if (useGeolocationBtn) {
            useGeolocationBtn.addEventListener('click', requestUserGeolocation);
        }

        if (landingInput) {
            landingInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = landingInput.value.trim();
                    if (query.length >= 2) {
                        searchCity(query);
                    }
                }
            });
            setTimeout(() => landingInput.focus(), 100);
        }
    }

    function showManualLocationPrompt(message = t('prompt_manual_msg')) {
        loader.innerHTML = `
            <i class="bi bi-geo-alt-fill spin-icon loader-icon--error" aria-hidden="true"></i>
            <h2>${t('prompt_manual_title')}</h2>
            <p>${message}</p>
            <div class="loader-actions">
                <div class="location-wrapper input-with-icon landing-input-group">
                    <i class="bi bi-geo-alt location-icon" aria-hidden="true"></i>
                    <input type="text" id="manual-prompt-input" class="text-input location-input" placeholder="${t('search_placeholder')}" aria-label="${t('search_placeholder')}">
                </div>
            </div>
        `;
        
        const manualInput = document.getElementById('manual-prompt-input');
        if (manualInput) {
            manualInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = manualInput.value.trim();
                    if (query.length >= 2) {
                        searchCity(query);
                    }
                }
            });
            // Auto-focus input
            setTimeout(() => manualInput.focus(), 100);
        }
    }

    function showLoading() {
        loader.classList.remove('hidden');
        mainContent.classList.add('hidden');
        loader.innerHTML = `
            <div class="weather-fly-animation">
                <i class="bi bi-sun"></i>
                <i class="bi bi-cloud-sun"></i>
                <i class="bi bi-cloud"></i>
                <i class="bi bi-cloud-rain"></i>
            </div>
            <h2>${t('loading_title')}</h2>
            <p>${t('loading_desc')}</p>
        `;
    }

    async function searchCity(query) {
        showLoading();
        setSearchButtonLoading(true);
        try {
            // Geocoding using Open-Meteo
            const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=${currentLang}&format=json`);
            const data = await res.json();

            if (data.results && data.results.length > 0) {
                const city = data.results[0];
                setLocationValue(city.name, city.admin1 || city.country || '');
                closeModal(locationModal);
                fetchWeatherData(city.latitude, city.longitude);
            } else {
                throw new Error("City not found");
            }
        } catch (e) {
            console.error(e);
            showManualLocationPrompt(t('err_notfound'));
        } finally {
            setSearchButtonLoading(false);
        }
    }

    function setSearchButtonLoading(isLoading) {
        if (!searchLocBtn) return;
        searchLocBtn.disabled = isLoading;
        if (isLoading) {
            searchLocBtn.innerHTML = `<span class="spinner" aria-hidden="true"></span><span class="sr-only">${t('search_loading')}</span>`;
            searchLocBtn.setAttribute('aria-label', t('search_loading'));
            return;
        }
        searchLocBtn.innerHTML = searchLocBtnDefaultContent;
        searchLocBtn.removeAttribute('aria-label');
    }

    async function resolveLocationName(lat, lon) {
        try {
            const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=${currentLang}`);
            const data = await res.json();
            const cityPart = data.city || data.locality || data.principalSubdivision || t('satellite_view');
            const regionPart = (data.city || data.locality) ? (data.principalSubdivision || data.countryName || '') : '';
            setLocationValue(cityPart, regionPart);
        } catch (e) {
            setLocationValue(t('current_loc'), '');
        }
    }

    async function fetchWeatherData(lat, lon) {
        currentLat = lat;
        currentLon = lon;
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
                <i class="bi bi-x-circle-fill spin-icon loader-icon--error" aria-hidden="true"></i>
                <h2>${t('err_conn')}</h2>
                <button class="action-btn loader-refresh-btn" onclick="location.reload()">${t('refresh_btn')}</button>
            `;
        }
    }

    function processWeatherData(daily) {
        // Zabezpieczenie przed brakiem danych
        if (!daily || !daily.time) {
            showManualLocationPrompt(t('err_server'));
            return;
        }

        currentDailyData = daily;

        const { time, weathercode, temperature_2m_max, temperature_2m_min, precipitation_sum } = daily;

        let shouldWash = true;
        let rainReason = [];

        // Algorytm: Sprawdzamy dzisiaj + 2 kolejne dni (3 dni)
        // Jeśli precipitation_sum[i] > 0, decydujemy nie myć.
        // Precipitation sum podane jest w milimetrach (mm).
        for (let i = 0; i < 3 && i < time.length; i++) {
            if (precipitation_sum[i] > 0) {
                shouldWash = false;
                const d = new Date(time[i]);
                let dayName = d.toLocaleDateString(currentLang === 'pl' ? 'pl-PL' : 'en-US', { weekday: 'long' });
                // Zamień pierwszą literę na wielką
                // dayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);

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
            const inAlgorithmClass = i < 3 ? ' in-algorithm' : '';
            card.className = 'forecast-card' + (precip[i] > 0 ? ' is-raining' : '') + inAlgorithmClass;

            const iconClass = getWeatherIcon(codes[i]);

            // Minimalistyczne ładowanie temperatury - średnia albo min/max
            card.innerHTML = `
                <div class="fc-day">${dayName}</div>
                ${i < 3 ? `<span class="fc-algorithm-badge" title="${t('affects_result')}" aria-label="${t('affects_result')}"><i class="bi bi-eye-fill" aria-hidden="true"></i></span>` : ''}
                <div class="fc-icon"><i class="${iconClass}"></i></div>
                <div class="fc-precip"><i class="bi bi-droplet"></i> ${precip[i]} mm</div>
                                <div class="fc-temp"><span class="fc-temp-max">${Math.round(tMax[i])}°</span> <span class="fc-temp-min">${Math.round(tMin[i])}°</span></div>
            `;
            forecastGridEl.appendChild(card);
        }
    }

    // WMO weather interpretation codes
    // Mapowanie na ikony Bootstrap icons
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
