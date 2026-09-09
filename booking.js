document.addEventListener('DOMContentLoaded', () => {
    const services = [
        { id: 'trial', price: 49, duration: { ru: '60 мин', de: '60 Min.' }, name: { ru: 'Первичная консультация + пробное занятие', de: 'Erstberatung + Probestunde' } },
        { id: 'consultation', price: 30, duration: { ru: '30 мин', de: '30 Min.' }, name: { ru: 'Первичная консультация специалиста', de: 'Erstberatung beim Spezialisten' } },
        { id: 'yumeiho-basic', price: 80, duration: { ru: '60 мин', de: '60 Min.' }, name: { ru: 'Сеанс Юмейхо (базовый)', de: 'Yumeiho-Sitzung (Basis)' } },
        { id: 'biomechanics', price: 60, duration: { ru: '45 мин', de: '45 Min.' }, name: { ru: 'Функциональная биомеханика тела', de: 'Funktionale Koerperbiomechanik' } },
        { id: 'complex', price: 120, duration: { ru: '90 мин', de: '90 Min.' }, name: { ru: 'Комплексный сеанс', de: 'Kombisitzung' } },
        { id: 'course', price: 700, duration: { ru: '10 x 60 мин', de: '10 x 60 Min.' }, name: { ru: 'Курс лечения (10 сеансов Юмейхо)', de: 'Behandlungskurs (10 Yumeiho-Sitzungen)' } }
    ];

    const translations = {
        ru: {
            back: 'Назад к услугам',
            kicker: 'Онлайн-запись',
            title: 'Выберите услугу и время',
            intro: 'После выбора времени вы перейдете на защищенную страницу Stripe для оплаты.',
            serviceLegend: 'Услуга',
            timeLegend: 'Дата и время',
            dateLabel: 'Дата приема',
            timeLabel: 'Время',
            dateWindow: 'Запись доступна на месяц вперед.',
            noTimes: 'На эту дату все время занято',
            clientLegend: 'Ваши данные',
            nameLabel: 'Имя и фамилия',
            namePlaceholder: 'Имя Фамилия',
            phoneLabel: 'Телефон',
            phonePlaceholder: '+49 ___ ___ __ __',
            disclaimer: 'Оплата проходит на стороне Stripe. Данные бронирования будут переданы нам после успешной оплаты.',
            summaryLabel: 'Итого',
            summaryDuration: 'Длительность',
            summaryTime: 'Время',
            summaryPrice: 'К оплате',
            payButton: 'Перейти к оплате',
            loading: 'Создаем оплату...',
            summaryNote: 'Если нужного времени нет, напишите нам в WhatsApp.',
            chooseSlot: 'Выберите время',
            noDates: 'Нет доступных дат в ближайший месяц',
            error: 'Не удалось перейти к оплате. Попробуйте еще раз или свяжитесь с нами.',
            success: 'Оплата прошла успешно. Мы получили бронирование и свяжемся с вами.',
            cancelled: 'Оплата отменена. Вы можете выбрать другое время и попробовать снова.'
        },
        de: {
            back: 'Zurueck zu den Leistungen',
            kicker: 'Online-Buchung',
            title: 'Leistung und Zeit waehlen',
            intro: 'Nach der Auswahl werden Sie zur sicheren Stripe-Zahlung weitergeleitet.',
            serviceLegend: 'Leistung',
            timeLegend: 'Datum und Uhrzeit',
            dateLabel: 'Termin-Datum',
            timeLabel: 'Uhrzeit',
            dateWindow: 'Buchungen sind bis zu einem Monat im Voraus moeglich.',
            noTimes: 'An diesem Datum sind alle Zeiten belegt',
            clientLegend: 'Ihre Daten',
            nameLabel: 'Vor- und Nachname',
            namePlaceholder: 'Vorname Nachname',
            phoneLabel: 'Telefon',
            phonePlaceholder: '+49 ___ ___ __ __',
            disclaimer: 'Die Zahlung erfolgt ueber Stripe. Die Buchungsdaten werden nach erfolgreicher Zahlung uebermittelt.',
            summaryLabel: 'Summe',
            summaryDuration: 'Dauer',
            summaryTime: 'Zeit',
            summaryPrice: 'Zu zahlen',
            payButton: 'Zur Zahlung',
            loading: 'Zahlung wird erstellt...',
            summaryNote: 'Wenn keine passende Zeit dabei ist, schreiben Sie uns bitte per WhatsApp.',
            chooseSlot: 'Zeit waehlen',
            noDates: 'Keine verfuegbaren Termine im naechsten Monat',
            error: 'Die Zahlung konnte nicht gestartet werden. Bitte versuchen Sie es erneut oder kontaktieren Sie uns.',
            success: 'Die Zahlung war erfolgreich. Wir haben Ihre Buchung erhalten und melden uns bei Ihnen.',
            cancelled: 'Die Zahlung wurde abgebrochen. Sie koennen eine andere Zeit waehlen und es erneut versuchen.'
        }
    };

    const params = new URLSearchParams(window.location.search);
    const serviceOptions = document.getElementById('service-options');
    const dateWheel = document.getElementById('date-wheel');
    const timeWheel = document.getElementById('time-wheel');
    const form = document.getElementById('checkout-form');
    const button = document.getElementById('checkout-button');
    const statusBox = document.getElementById('payment-status');
    const langButtons = document.querySelectorAll('.lang-btn');

    let currentLanguage = translations[localStorage.getItem('siteLanguage')] ? localStorage.getItem('siteLanguage') : 'ru';
    let selectedServiceId = services.some((service) => service.id === params.get('service')) ? params.get('service') : 'trial';
    let selectedSlot = null;
    let selectedDate = null;
    let selectedTime = 9;
    let unavailableTimes = new Set();
    let availabilityRequestId = 0;

    const timeOptions = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
    const wheelItemHeight = 50;
    const wheelScrollTimers = new WeakMap();
    const blockedDateRanges = [
        { start: '2026-08-23', end: '2026-09-03' },
        { start: '2026-10-15', end: '2026-10-28' }
    ];

    const toDateKey = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const addDays = (date, days) => {
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + days);
        return nextDate;
    };

    const fromDateKey = (value) => {
        const [year, month, day] = value.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    const startOfDay = (date) => {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        return start;
    };

    const isWeekend = (date) => date.getDay() === 0 || date.getDay() === 6;

    const isBlockedDate = (date) => {
        const dateKey = toDateKey(date);
        return blockedDateRanges.some((range) => dateKey >= range.start && dateKey <= range.end);
    };

    const isUnavailableDate = (date) => isWeekend(date) || isBlockedDate(date);

    const nextAvailableDate = (date) => {
        let nextDate = startOfDay(date);
        while (isUnavailableDate(nextDate)) {
            nextDate = addDays(nextDate, 1);
        }
        return nextDate;
    };

    const minBookingDate = startOfDay(addDays(new Date(), 1));
    const maxBookingDate = startOfDay(addDays(new Date(), 30));

    const formatDateTime = (date) => new Intl.DateTimeFormat(currentLanguage === 'de' ? 'de-DE' : 'ru-RU', {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);

    const formatDateLabel = (date) => new Intl.DateTimeFormat(currentLanguage === 'de' ? 'de-DE' : 'ru-RU', {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit'
    }).format(date);

    const formatTimeLabel = (hour) => `${String(hour).padStart(2, '0')}:00`;

    const getAvailableTimesForSelectedDate = () => timeOptions.filter((hour) => {
        if (!selectedDate) {
            return false;
        }

        const slot = new Date(selectedDate);
        slot.setHours(hour, 0, 0, 0);
        return !unavailableTimes.has(slot.toISOString());
    });

    const generateDateOptions = () => {
        const dates = [];
        let cursor = new Date(minBookingDate);
        while (cursor <= maxBookingDate) {
            if (!isUnavailableDate(cursor)) {
                dates.push(new Date(cursor));
            }
            cursor = addDays(cursor, 1);
        }
        return dates;
    };

    const clampBookingDate = (date) => {
        let nextDate = nextAvailableDate(date);
        if (nextDate < minBookingDate) {
            nextDate = nextAvailableDate(minBookingDate);
        }
        if (nextDate > maxBookingDate) {
            return null;
        }
        return nextDate;
    };

    const syncSelectedSlot = () => {
        selectedDate = selectedDate ? clampBookingDate(selectedDate) : null;
        if (!selectedDate) {
            selectedSlot = null;
            return;
        }
        const availableTimes = getAvailableTimesForSelectedDate();
        if (!availableTimes.includes(selectedTime)) {
            selectedTime = availableTimes[0];
        }
        if (!selectedTime) {
            selectedSlot = null;
            return;
        }
        selectedSlot = new Date(selectedDate);
        selectedSlot.setHours(selectedTime, 0, 0, 0);
    };

    const scrollWheelToIndex = (wheel, index, behavior = 'smooth') => {
        wheel.scrollTo({
            top: index * wheelItemHeight,
            behavior
        });
    };

    const updateWheelSelection = (wheel, selectedValue) => {
        wheel.querySelectorAll('.wheel-item').forEach((item) => {
            item.classList.toggle('is-selected', item.dataset.value === selectedValue);
            item.setAttribute('aria-selected', item.dataset.value === selectedValue ? 'true' : 'false');
        });
    };

    const renderServices = () => {
        serviceOptions.innerHTML = services.map((service) => `
            <label class="service-option ${service.id === selectedServiceId ? 'is-selected' : ''}">
                <input type="radio" name="service" value="${service.id}" ${service.id === selectedServiceId ? 'checked' : ''}>
                <span>
                    <strong>${service.name[currentLanguage]}</strong>
                    <small>${service.duration[currentLanguage]}</small>
                </span>
                <b>${service.price}€</b>
            </label>
        `).join('');
    };

    const renderWheels = (behavior = 'auto') => {
        const dateOptions = generateDateOptions();
        if (dateOptions.length === 0) {
            dateWheel.innerHTML = `<div class="wheel-empty">${translations[currentLanguage].noDates}</div>`;
            timeWheel.innerHTML = '<div class="wheel-empty">-</div>';
            selectedDate = null;
            selectedSlot = null;
            updateSummary();
            return;
        }

        if (!selectedDate) {
            selectedDate = dateOptions[0];
            syncSelectedSlot();
        }

        const selectedDateKey = toDateKey(selectedDate);
        const selectedTimeKey = String(selectedTime);
        const availableTimes = getAvailableTimesForSelectedDate();
        const dateIndex = Math.max(0, dateOptions.findIndex((date) => toDateKey(date) === selectedDateKey));
        const timeIndex = Math.max(0, availableTimes.findIndex((hour) => hour === selectedTime));

        dateWheel.innerHTML = dateOptions.map((date) => {
            const value = toDateKey(date);
            return `<button type="button" class="wheel-item" role="option" data-value="${value}">${formatDateLabel(date)}</button>`;
        }).join('');

        timeWheel.innerHTML = availableTimes.length > 0 ? availableTimes.map((hour) => (
            `<button type="button" class="wheel-item" role="option" data-value="${hour}">${formatTimeLabel(hour)}</button>`
        )).join('') : `<div class="wheel-empty">${translations[currentLanguage].noTimes}</div>`;

        updateWheelSelection(dateWheel, selectedDateKey);
        updateWheelSelection(timeWheel, selectedTimeKey);
        scrollWheelToIndex(dateWheel, dateIndex, behavior);
        if (availableTimes.length > 0) {
            scrollWheelToIndex(timeWheel, timeIndex, behavior);
        }
    };

    const loadAvailability = async (behavior = 'auto') => {
        if (!selectedDate) {
            unavailableTimes = new Set();
            renderWheels(behavior);
            return;
        }

        const requestId = ++availabilityRequestId;
        try {
            const response = await fetch(`/api/availability?date=${encodeURIComponent(toDateKey(selectedDate))}`);
            if (!response.ok) {
                throw new Error('Availability request failed');
            }
            const data = await response.json();
            if (requestId !== availabilityRequestId) {
                return;
            }
            unavailableTimes = new Set(data.unavailableTimes || []);
        } catch (error) {
            console.error(error);
            unavailableTimes = new Set();
        }

        syncSelectedSlot();
        renderWheels(behavior);
        updateSummary();
    };

    const updateSummary = () => {
        const service = services.find((item) => item.id === selectedServiceId) || services[0];
        document.getElementById('summary-service').textContent = service.name[currentLanguage];
        document.getElementById('summary-duration').textContent = service.duration[currentLanguage];
        document.getElementById('summary-price').textContent = `${service.price}€`;
        document.getElementById('summary-time').textContent = selectedSlot ? formatDateTime(selectedSlot) : translations[currentLanguage].chooseSlot;
    };

    const applyLanguage = (language) => {
        currentLanguage = language;
        document.documentElement.lang = language;
        document.querySelectorAll('[data-i18n]').forEach((element) => {
            element.textContent = translations[language][element.dataset.i18n];
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
            element.setAttribute('placeholder', translations[language][element.dataset.i18nPlaceholder]);
        });
        langButtons.forEach((langButton) => langButton.classList.toggle('is-active', langButton.dataset.lang === language));
        localStorage.setItem('siteLanguage', language);
        renderServices();
        loadAvailability('auto');
        updateSummary();
    };

    const showPaymentStatus = () => {
        const paymentStatus = params.get('payment');
        if (!paymentStatus) {
            return;
        }

        const key = paymentStatus === 'success' ? 'success' : 'cancelled';
        statusBox.hidden = false;
        statusBox.className = `payment-status ${paymentStatus === 'success' ? 'is-success' : 'is-warning'}`;
        statusBox.textContent = translations[currentLanguage][key];
    };

    serviceOptions.addEventListener('change', (event) => {
        selectedServiceId = event.target.value;
        renderServices();
        updateSummary();
    });

    const selectWheelItem = (wheel, item) => {
        if (!item) {
            return;
        }

        if (wheel === dateWheel) {
            selectedDate = fromDateKey(item.dataset.value);
            updateWheelSelection(dateWheel, item.dataset.value);
            loadAvailability();
        } else {
            selectedTime = Number(item.dataset.value);
            updateWheelSelection(timeWheel, item.dataset.value);
            syncSelectedSlot();
            updateSummary();
        }
    };

    const settleWheel = (wheel) => {
        const index = Math.round(wheel.scrollTop / wheelItemHeight);
        const items = wheel.querySelectorAll('.wheel-item');
        if (items.length === 0) {
            return;
        }
        const clampedIndex = Math.max(0, Math.min(items.length - 1, index));
        scrollWheelToIndex(wheel, clampedIndex);
        selectWheelItem(wheel, items[clampedIndex]);
    };

    const handleWheelScroll = (wheel) => {
        clearTimeout(wheelScrollTimers.get(wheel));
        wheelScrollTimers.set(wheel, setTimeout(() => settleWheel(wheel), 90));
    };

    [dateWheel, timeWheel].forEach((wheel) => {
        wheel.addEventListener('scroll', () => handleWheelScroll(wheel), { passive: true });
        wheel.addEventListener('click', (event) => {
            const item = event.target.closest('.wheel-item');
            if (!item) {
                return;
            }
            const items = [...wheel.querySelectorAll('.wheel-item')];
            scrollWheelToIndex(wheel, items.indexOf(item));
            selectWheelItem(wheel, item);
        });
        wheel.addEventListener('keydown', (event) => {
            if (!['ArrowDown', 'ArrowUp'].includes(event.key)) {
                return;
            }
            event.preventDefault();
            const direction = event.key === 'ArrowDown' ? 1 : -1;
            const items = [...wheel.querySelectorAll('.wheel-item')];
            if (items.length === 0) {
                return;
            }
            const currentIndex = Math.round(wheel.scrollTop / wheelItemHeight);
            const nextIndex = Math.max(0, Math.min(items.length - 1, currentIndex + direction));
            scrollWheelToIndex(wheel, nextIndex);
            selectWheelItem(wheel, items[nextIndex]);
        });
    });

    langButtons.forEach((langButton) => {
        langButton.addEventListener('click', () => {
            applyLanguage(langButton.dataset.lang);
            showPaymentStatus();
        });
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const service = services.find((item) => item.id === selectedServiceId) || services[0];
        if (!selectedSlot) {
            statusBox.hidden = false;
            statusBox.className = 'payment-status is-warning';
            statusBox.textContent = translations[currentLanguage].noDates;
            return;
        }

        const originalHtml = button.innerHTML;
        button.disabled = true;
        button.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> ${translations[currentLanguage].loading}`;
        statusBox.hidden = true;

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    serviceId: service.id,
                    serviceName: service.name[currentLanguage],
                    appointmentStart: selectedSlot.toISOString(),
                    name: document.getElementById('clientName').value.trim(),
                    phone: document.getElementById('clientPhone').value.trim()
                })
            });

            const data = await response.json();
            if (!response.ok || !data.checkoutUrl) {
                throw new Error(data.message || 'Checkout failed');
            }

            window.location.assign(data.checkoutUrl);
        } catch (error) {
            console.error(error);
            statusBox.hidden = false;
            statusBox.className = 'payment-status is-error';
            statusBox.textContent = translations[currentLanguage].error;
            button.disabled = false;
            button.innerHTML = originalHtml;
        }
    });

    selectedDate = generateDateOptions()[0] || null;
    syncSelectedSlot();
    applyLanguage(currentLanguage);
    showPaymentStatus();
});
