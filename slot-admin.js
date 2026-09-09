document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('admin-date');
    const tokenInput = document.getElementById('admin-token');
    const saveTokenButton = document.getElementById('save-token');
    const slotsContainer = document.getElementById('admin-slots');
    const saveButton = document.getElementById('save-blocks');
    const refreshBookingsButton = document.getElementById('refresh-bookings');
    const bookingsContainer = document.getElementById('admin-bookings');
    const statusBox = document.getElementById('admin-status');
    const timeOptions = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
    const selectedBlocks = new Set();
    const tokenStorageKey = 'yumeihoAdminToken';

    const toDateInputValue = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const appointmentIso = (hour) => {
        const [year, month, day] = dateInput.value.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        date.setHours(hour, 0, 0, 0);
        return date.toISOString();
    };

    const showStatus = (message, type = 'is-success') => {
        statusBox.hidden = false;
        statusBox.className = `payment-status ${type}`;
        statusBox.textContent = message;
    };

    const formatDateTime = (value) => {
        const date = new Date(value);
        return new Intl.DateTimeFormat('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const sourceLabel = (source) => {
        if (source === 'telegram_bot') {
            return 'Telegram bot';
        }
        if (source === 'website') {
            return 'Сайт';
        }
        return source || 'Не указан';
    };

    const renderSlots = () => {
        slotsContainer.innerHTML = timeOptions.map((hour) => {
            const value = appointmentIso(hour);
            const isBlocked = selectedBlocks.has(value);
            return `
                <button type="button" class="admin-slot ${isBlocked ? 'is-blocked' : ''}" data-hour="${hour}">
                    <strong>${String(hour).padStart(2, '0')}:00</strong>
                    <span>${isBlocked ? 'Заблокировано' : 'Открыто'}</span>
                </button>
            `;
        }).join('');
    };

    const loadBlocks = async () => {
        selectedBlocks.clear();
        statusBox.hidden = true;

        const token = tokenInput.value.trim();
        if (!token) {
            renderSlots();
            showStatus('Введите код администратора и нажмите «Запомнить».', 'is-warning');
            return;
        }

        try {
            const response = await fetch(`/api/admin/blocks?date=${encodeURIComponent(dateInput.value)}`, {
                headers: {
                    'X-Admin-Token': token
                }
            });
            if (response.status === 403) {
                throw new Error('forbidden');
            }
            if (!response.ok) {
                throw new Error('Cannot load blocks');
            }
            const data = await response.json();
            (data.blockedTimes || []).forEach((time) => selectedBlocks.add(time));
            renderSlots();
        } catch (error) {
            console.error(error);
            renderSlots();
            showStatus(
                error.message === 'forbidden'
                    ? 'Код администратора не принят. Введите актуальный код и нажмите «Запомнить».'
                    : 'Не удалось загрузить блокировки.',
                'is-error'
            );
        }
    };

    const loadBookings = async () => {
        const token = tokenInput.value.trim();
        if (!token) {
            bookingsContainer.innerHTML = '<p class="admin-empty">Введите код администратора, чтобы загрузить записи.</p>';
            return;
        }

        bookingsContainer.innerHTML = '<p class="admin-empty">Загружаем записи...</p>';
        try {
            const response = await fetch('/api/admin/bookings', {
                headers: {
                    'X-Admin-Token': token
                }
            });
            if (response.status === 403) {
                throw new Error('forbidden');
            }
            if (!response.ok) {
                throw new Error('Cannot load bookings');
            }
            const bookings = await response.json();
            if (!bookings.length) {
                bookingsContainer.innerHTML = '<p class="admin-empty">Будущих записей пока нет.</p>';
                return;
            }
            bookingsContainer.innerHTML = bookings.map((booking) => `
                <article class="admin-booking">
                    <div>
                        <strong>${formatDateTime(booking.appointmentStart)}</strong>
                        <span>${booking.serviceName}</span>
                    </div>
                    <div>
                        <strong>${booking.clientName}</strong>
                        <span>${booking.clientPhone || 'Телефон не указан'}</span>
                    </div>
                    <div>
                        <strong>${sourceLabel(booking.source)}</strong>
                        <span>${booking.paymentStatus || booking.status}</span>
                    </div>
                </article>
            `).join('');
        } catch (error) {
            console.error(error);
            bookingsContainer.innerHTML = `
                <p class="admin-empty is-error-text">
                    ${error.message === 'forbidden'
                        ? 'Код администратора не принят. Введите актуальный код и нажмите «Запомнить».'
                        : 'Не удалось загрузить записи.'}
                </p>
            `;
        }
    };

    slotsContainer.addEventListener('click', (event) => {
        const slot = event.target.closest('.admin-slot');
        if (!slot) {
            return;
        }

        const value = appointmentIso(Number(slot.dataset.hour));
        if (selectedBlocks.has(value)) {
            selectedBlocks.delete(value);
        } else {
            selectedBlocks.add(value);
        }
        renderSlots();
    });

    saveButton.addEventListener('click', async () => {
        saveButton.disabled = true;
        showStatus('Сохраняем...', 'is-warning');

        try {
            const response = await fetch('/api/admin/blocks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Admin-Token': tokenInput.value.trim()
                },
                body: JSON.stringify({
                    date: dateInput.value,
                    blockedTimes: [...selectedBlocks].sort()
                })
            });
            if (response.status === 403) {
                throw new Error('forbidden');
            }
            if (!response.ok) {
                throw new Error('Cannot save blocks');
            }
            showStatus('Сохранено.');
            loadBookings();
        } catch (error) {
            console.error(error);
            showStatus(
                error.message === 'forbidden'
                    ? 'Код администратора не принят. Введите актуальный код и нажмите «Запомнить».'
                    : 'Не удалось сохранить.',
                'is-error'
            );
        } finally {
            saveButton.disabled = false;
        }
    });

    saveTokenButton.addEventListener('click', () => {
        localStorage.setItem(tokenStorageKey, tokenInput.value.trim());
        showStatus('Код сохранен в этом браузере.');
        loadBlocks();
        loadBookings();
    });

    dateInput.addEventListener('change', loadBlocks);
    refreshBookingsButton.addEventListener('click', loadBookings);
    tokenInput.value = localStorage.getItem(tokenStorageKey) || '';
    dateInput.value = toDateInputValue(new Date());
    loadBlocks();
    loadBookings();
});
