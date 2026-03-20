document.addEventListener('DOMContentLoaded', () => {
    const translations = {
        ru: {
            documentLang: 'ru',
            title: 'YumeihoWellness | Центр здоровой спины и суставов',
            metaDescription: 'Лечение спины и суставов без лекарств и операций в Германии (NRW). Метод функциональной биомеханики тела, 15+ лет опыта.',
            mobileToggleAria: 'Открыть меню',
            navAbout: 'О нас',
            navServices: 'Услуги',
            navAddress: 'Адрес',
            navPrices: 'Прайс',
            navContacts: 'Контакты',
            call: 'Звонок',
            callTitle: 'Обычный звонок',
            whatsappTitle: 'Написать в WhatsApp',
            bookShort: 'Записаться',
            badge: 'Инновационный подход',
            heroTitle: 'Центр здоровой спины и суставов',
            heroSubtitle: 'Восстановление без лекарств и операций',
            heroText: 'Вернем свободу движений с помощью проверенного метода функциональной биомеханики тела и юмейхо. Мы устраняем причину боли, а не её симптомы.',
            heroCta: 'Записаться на консультацию',
            heroMore: 'Узнать подробнее',
            card1Title: 'Без боли',
            card1Text: 'Безопасная методика',
            card2Text: 'Довольных пациентов',
            servicesTitle: 'Что мы умеем',
            servicesSubtitle: 'Комплексный подход к восстановлению здоровья позвоночника и суставов.',
            services: [
                ['Грыжи и протрузии', 'Безопасное устранение компрессии нервных корешков без хирургического вмешательства.'],
                ['Сколиоз и осанка', 'Коррекция искривлений позвоночника и формирование правильного двигательного стереотипа.'],
                ['Боли в спине и шее', 'Снятие мышечных спазмов и восстановление нормального кровообращения.'],
                ['Остеохондроз', 'Остановка дегенеративных процессов и восстановление питания межпозвонковых дисков.'],
                ['Реабилитация', 'Эффективное восстановление после травм, операций и длительных заболеваний.'],
                ['Суставы', 'Устранение артрозов, артритов и восстановление подвижности крупных суставов.']
            ],
            aboutTitle: 'Почему выбирают нас?',
            aboutText: 'Мы гордимся нашими результатами и доверием сотен пациентов. Наш подход основан на глубоком понимании биомеханики тела и многолетнем практическом опыте.',
            aboutPoint1: 'Индивидуальный план востоновления для каждого пациента.',
            aboutPoint2: 'Работа с причиной заболевания, а не с симптомами.',
            stats: ['Лет опыта работы', 'Довольных пациентов', 'Центр в Бохуме', 'Операционных вмешательств'],
            pricesTitle: 'Прайс-лист',
            pricesSubtitle: 'Прозрачные цены на наши услуги. Инвестируйте в свое здоровье сегодня.',
            offerTitle: 'Специальное предложение!',
            offerText: 'Первичная консультация + пробное занятие',
            offerButton: 'Записаться',
            tableHeaders: ['Услуга', 'Длительность', 'Стоимость'],
            pricingRows: [
                ['Первичная консультация специалиста', '30 мин', '30€'],
                ['Сеанс Юмейхо (базовый)', '60 мин', '80€'],
                ['Функциональная биомеханика тела (индивидуальное занятие)', '45 мин', '60€'],
                ['Комплексный сеанс (Юмейхо + Функциональная биомеханика тела)', '90 мин', '120€'],
                ['Курс лечения (10 сеансов Юмейхо)', '10 × 60 мин', '700€ <span class="discount">-12%</span>']
            ],
            locationTitle: 'Наш адрес',
            locationSubtitle: 'Ждем вас по адресу: Gerther str.42, 44805 Bochum.',
            locationHours: 'Пн-Пт: 09:00 - 20:00',
            contactTitle: 'Начните жизнь без боли',
            contactText: 'Оставьте заявку, и наш специалист свяжется с вами в течение 15 минут для уточнения деталей и ответа на ваши вопросы.',
            contactLead: 'Связаться с нами:',
            formTitle: 'Запишитесь на консультацию по выгодной цене',
            firstNameLabel: 'Имя',
            firstNamePlaceholder: 'Имя',
            lastNameLabel: 'Фамилия',
            lastNamePlaceholder: 'Фамилия',
            phoneLabel: 'Номер телефона',
            phonePlaceholder: '+49 ___ ___ __ __',
            formSubmit: 'Оставить заявку',
            formDisclaimer: 'Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности.',
            footerDesc: 'Современный центр лечения спины и суставов. Ваш путь к здоровью без операций и медикаментов.',
            footerNavTitle: 'Навигация',
            footerHome: 'Главная',
            footerAbout: 'О нас',
            footerServices: 'Услуги',
            footerPrices: 'Цены',
            footerDocsTitle: 'Документы',
            footerPrivacy: 'Политика конфиденциальности',
            footerTerms: 'Условия использования',
            footerImpressum: 'Impressum',
            footerContactsTitle: 'Контакты',
            footerLocation: 'NRW, Germany',
            footerCall: 'Телефонный звонок',
            footerWhatsapp: 'Написать в WhatsApp',
            footerRights: '© 2026 YumeihoWellness. Все права защищены.',
            formLoading: 'Отправляем...',
            formSuccess: 'Заявка отправлена!',
            formError: 'Ошибка отправки'
        },
        de: {
            documentLang: 'de',
            title: 'YumeihoWellness | Zentrum fuer einen gesunden Ruecken und Gelenke',
            metaDescription: 'Ruecken- und Gelenkbehandlung ohne Medikamente und Operationen in Deutschland (NRW). Methode der funktionalen Koerperbiomechanik, mehr als 15 Jahre Erfahrung.',
            mobileToggleAria: 'Menue oeffnen',
            navAbout: 'Ueber uns',
            navServices: 'Leistungen',
            navAddress: 'Adresse',
            navPrices: 'Preise',
            navContacts: 'Kontakt',
            call: 'Anrufen',
            callTitle: 'Telefonischer Anruf',
            whatsappTitle: 'In WhatsApp schreiben',
            bookShort: 'Buchen',
            badge: 'Innovativer Ansatz',
            heroTitle: 'Zentrum fuer einen gesunden Ruecken und Gelenke',
            heroSubtitle: 'Regeneration ohne Medikamente und Operationen',
            heroText: 'Wir geben Ihnen Bewegungsfreiheit mit einer bewaehrten Methode der funktionalen Koerperbiomechanik und Yumeiho zurueck. Wir behandeln die Ursache des Schmerzes und nicht nur die Symptome.',
            heroCta: 'Beratung buchen',
            heroMore: 'Mehr erfahren',
            card1Title: 'Ohne Schmerzen',
            card1Text: 'Sichere Methode',
            card2Text: 'Zufriedene Patienten',
            servicesTitle: 'Was wir behandeln',
            servicesSubtitle: 'Ein ganzheitlicher Ansatz zur Regeneration von Wirbelsaeule und Gelenken.',
            services: [
                ['Bandscheibenvorfaelle und Protrusionen', 'Schonende Entlastung der Nervenwurzeln ohne chirurgischen Eingriff.'],
                ['Skoliose und Haltung', 'Korrektur von Wirbelsaeulenfehlstellungen und Aufbau eines gesunden Bewegungsmusters.'],
                ['Ruecken- und Nackenschmerzen', 'Loesung von Muskelspannungen und Wiederherstellung einer normalen Durchblutung.'],
                ['Osteochondrose', 'Verlangsamung degenerativer Prozesse und bessere Versorgung der Bandscheiben.'],
                ['Rehabilitation', 'Wirksame Erholung nach Verletzungen, Operationen und langwierigen Beschwerden.'],
                ['Gelenke', 'Linderung bei Arthrose, Arthritis und Wiederherstellung der Beweglichkeit grosser Gelenke.']
            ],
            aboutTitle: 'Warum entscheiden sich Patienten fuer uns?',
            aboutText: 'Wir sind stolz auf unsere Ergebnisse und das Vertrauen hunderter Patienten. Unser Ansatz basiert auf einem tiefen Verstaendnis der Koerperbiomechanik und langjaehriger Praxiserfahrung.',
            aboutPoint1: 'Individueller Regenerationsplan fuer jeden Patienten.',
            aboutPoint2: 'Wir arbeiten an der Ursache der Beschwerden, nicht nur an den Symptomen.',
            stats: ['Jahre Berufserfahrung', 'Zufriedene Patienten', 'Standort in Bochum', 'Operative Eingriffe'],
            pricesTitle: 'Preisliste',
            pricesSubtitle: 'Transparente Preise fuer unsere Leistungen. Investieren Sie schon heute in Ihre Gesundheit.',
            offerTitle: 'Sonderangebot!',
            offerText: 'Erstberatung + Probestunde',
            offerButton: 'Buchen',
            tableHeaders: ['Leistung', 'Dauer', 'Preis'],
            pricingRows: [
                ['Erstberatung beim Spezialisten', '30 Min.', '30€'],
                ['Yumeiho-Sitzung (Basis)', '60 Min.', '80€'],
                ['Funktionale Koerperbiomechanik (Einzelsitzung)', '45 Min.', '60€'],
                ['Kombisitzung (Yumeiho + Funktionale Koerperbiomechanik)', '90 Min.', '120€'],
                ['Behandlungskurs (10 Yumeiho-Sitzungen)', '10 × 60 Min.', '700€ <span class="discount">-12%</span>']
            ],
            locationTitle: 'Unser Standort',
            locationSubtitle: 'Wir freuen uns auf Ihren Besuch in der Gerther Str. 42, 44805 Bochum.',
            locationHours: 'Mo-Fr: 09:00 - 20:00',
            contactTitle: 'Starten Sie ein Leben ohne Schmerzen',
            contactText: 'Senden Sie uns eine Anfrage, und unser Spezialist meldet sich innerhalb von 15 Minuten bei Ihnen, um alle Details zu klaeren und Ihre Fragen zu beantworten.',
            contactLead: 'Kontaktieren Sie uns:',
            formTitle: 'Vereinbaren Sie Ihre Beratung zum attraktiven Preis',
            firstNameLabel: 'Vorname',
            firstNamePlaceholder: 'Vorname',
            lastNameLabel: 'Nachname',
            lastNamePlaceholder: 'Nachname',
            phoneLabel: 'Telefonnummer',
            phonePlaceholder: '+49 ___ ___ __ __',
            formSubmit: 'Anfrage senden',
            formDisclaimer: 'Mit dem Klick auf den Button stimmen Sie unserer Datenschutzerklaerung zu.',
            footerDesc: 'Modernes Zentrum fuer Ruecken- und Gelenkbehandlung. Ihr Weg zu mehr Gesundheit ohne Operationen und Medikamente.',
            footerNavTitle: 'Navigation',
            footerHome: 'Startseite',
            footerAbout: 'Ueber uns',
            footerServices: 'Leistungen',
            footerPrices: 'Preise',
            footerDocsTitle: 'Rechtliches',
            footerPrivacy: 'Datenschutz',
            footerTerms: 'Nutzungsbedingungen',
            footerImpressum: 'Impressum',
            footerContactsTitle: 'Kontakt',
            footerLocation: 'NRW, Deutschland',
            footerCall: 'Telefonischer Kontakt',
            footerWhatsapp: 'In WhatsApp schreiben',
            footerRights: '© 2026 YumeihoWellness. Alle Rechte vorbehalten.',
            formLoading: 'Wird gesendet...',
            formSuccess: 'Anfrage gesendet!',
            formError: 'Fehler beim Senden'
        }
    };

    const header = document.getElementById('header');
    const mobileToggle = document.getElementById('mobile-toggle');
    const nav = document.getElementById('nav');
    const icon = mobileToggle.querySelector('i');
    const navLinks = document.querySelectorAll('.nav-link');
    const langButtons = document.querySelectorAll('.lang-btn');
    const metaDescription = document.querySelector('meta[name="description"]');
    const bookingForm = document.getElementById('booking-form');

    const setText = (selector, value) => {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = value;
        }
    };

    const setHtml = (selector, value) => {
        const element = document.querySelector(selector);
        if (element) {
            element.innerHTML = value;
        }
    };

    const setAttr = (selector, attr, value) => {
        const element = document.querySelector(selector);
        if (element) {
            element.setAttribute(attr, value);
        }
    };

    const setTextsFromNodeList = (selector, values) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            if (values[index] !== undefined) {
                element.textContent = values[index];
            }
        });
    };

    let currentLanguage = translations[localStorage.getItem('siteLanguage')] ? localStorage.getItem('siteLanguage') : (navigator.language && navigator.language.toLowerCase().startsWith('de') ? 'de' : 'ru');

    const applyLanguage = (language) => {
        const t = translations[language] || translations.ru;
        currentLanguage = language;

        document.documentElement.lang = t.documentLang;
        document.title = t.title;
        metaDescription.setAttribute('content', t.metaDescription);
        mobileToggle.setAttribute('aria-label', t.mobileToggleAria);

        setTextsFromNodeList('.nav-link', [t.navAbout, t.navServices, t.navAddress, t.navPrices, t.navContacts]);

        const mobileActionButtons = nav.querySelectorAll('.header-actions.mobile-only a');
        if (mobileActionButtons.length === 3) {
            mobileActionButtons[0].innerHTML = '<i class="fa-solid fa-phone"></i>';
            mobileActionButtons[0].setAttribute('title', t.callTitle);
            mobileActionButtons[0].setAttribute('aria-label', t.call);
            mobileActionButtons[1].innerHTML = '<i class="fa-brands fa-whatsapp"></i>';
            mobileActionButtons[1].setAttribute('title', t.whatsappTitle);
            mobileActionButtons[1].setAttribute('aria-label', 'WhatsApp');
            mobileActionButtons[2].textContent = t.bookShort;
        }

        const desktopActionButtons = document.querySelectorAll('.header-actions.desktop-only a');
        if (desktopActionButtons.length === 3) {
            desktopActionButtons[0].innerHTML = '<i class="fa-solid fa-phone"></i>';
            desktopActionButtons[0].setAttribute('title', t.callTitle);
            desktopActionButtons[0].setAttribute('aria-label', t.call);
            desktopActionButtons[1].innerHTML = '<i class="fa-brands fa-whatsapp"></i>';
            desktopActionButtons[1].setAttribute('title', t.whatsappTitle);
            desktopActionButtons[1].setAttribute('aria-label', 'WhatsApp');
            desktopActionButtons[2].textContent = t.bookShort;
        }

        setText('.badge', t.badge);
        setText('.hero-title', t.heroTitle);
        setText('.hero-subtitle', t.heroSubtitle);
        setText('.hero-text', t.heroText);

        const heroButtons = document.querySelectorAll('.hero-buttons a');
        if (heroButtons.length === 2) {
            heroButtons[0].innerHTML = `${t.heroCta} <i class="fa-solid fa-arrow-right"></i>`;
            heroButtons[1].textContent = t.heroMore;
        }

        setText('.floating-card.card-1 strong', t.card1Title);
        setText('.floating-card.card-1 span', t.card1Text);
        setText('.floating-card.card-2 span', t.card2Text);

        setText('#services .section-title', t.servicesTitle);
        setText('#services .section-subtitle', t.servicesSubtitle);

        const serviceCards = document.querySelectorAll('.services-grid .service-card');
        serviceCards.forEach((card, index) => {
            const [title, description] = t.services[index] || [];
            if (title) {
                card.querySelector('.service-title').textContent = title;
            }
            if (description) {
                card.querySelector('.service-desc').textContent = description;
            }
        });

        setText('#about .section-title', t.aboutTitle);
        setText('.about-text', t.aboutText);
        const aboutItems = document.querySelectorAll('.about-list li');
        if (aboutItems.length === 2) {
            aboutItems[0].innerHTML = `<i class="fa-solid fa-circle-check"></i> ${t.aboutPoint1}`;
            aboutItems[1].innerHTML = `<i class="fa-solid fa-circle-check"></i> ${t.aboutPoint2}`;
        }

        setTextsFromNodeList('.stat-label', t.stats);

        setText('#prices .section-title', t.pricesTitle);
        setText('#prices .section-subtitle', t.pricesSubtitle);
        setText('.offer-text h3', t.offerTitle);
        setText('.offer-text p', t.offerText);
        setText('.special-offer .btn-offer-pulse', t.offerButton);

        const priceHeaders = document.querySelectorAll('.pricing-table thead th');
        priceHeaders.forEach((headerCell, index) => {
            headerCell.textContent = t.tableHeaders[index];
        });

        const priceRows = document.querySelectorAll('.pricing-table tbody tr');
        priceRows.forEach((row, index) => {
            const cells = row.querySelectorAll('td');
            const translatedRow = t.pricingRows[index];
            if (!translatedRow || cells.length !== 3) {
                return;
            }

            cells[0].textContent = translatedRow[0];
            cells[1].textContent = translatedRow[1];
            cells[2].innerHTML = translatedRow[2];

            cells[0].dataset.label = t.tableHeaders[0];
            cells[1].dataset.label = t.tableHeaders[1];
            cells[2].dataset.label = t.tableHeaders[2];
        });

        setText('#clinics .section-title', t.locationTitle);
        setText('#clinics .section-subtitle', t.locationSubtitle);
        setText('.location-info p:last-child', `${document.documentElement.lang === 'de' ? '' : ''}${t.locationHours}`);

        setText('.contact-info h2', t.contactTitle);
        setText('.contact-info > p', t.contactText);
        setText('.method-item span', t.contactLead);

        const contactButtons = document.querySelectorAll('.contact-methods a');
        if (contactButtons.length === 2) {
            contactButtons[0].innerHTML = '<i class="fa-solid fa-phone"></i>';
            contactButtons[0].setAttribute('title', t.callTitle);
            contactButtons[0].setAttribute('aria-label', t.call);
            contactButtons[1].innerHTML = '<i class="fa-brands fa-whatsapp"></i>';
            contactButtons[1].setAttribute('title', t.whatsappTitle);
            contactButtons[1].setAttribute('aria-label', 'WhatsApp');
        }

        setText('.form-title', t.formTitle);
        setText('label[for="firstName"]', t.firstNameLabel);
        setText('label[for="lastName"]', t.lastNameLabel);
        setText('label[for="phone"]', t.phoneLabel);
        setAttr('#firstName', 'placeholder', t.firstNamePlaceholder);
        setAttr('#lastName', 'placeholder', t.lastNamePlaceholder);
        setAttr('#phone', 'placeholder', t.phonePlaceholder);
        setText('#booking-form button[type="submit"]', t.formSubmit);
        setText('.form-disclaimer', t.formDisclaimer);

        setText('.footer-desc', t.footerDesc);

        const footerColumns = document.querySelectorAll('.footer-col h4');
        if (footerColumns.length === 3) {
            footerColumns[0].textContent = t.footerNavTitle;
            footerColumns[1].textContent = t.footerDocsTitle;
            footerColumns[2].textContent = t.footerContactsTitle;
        }

        const footerNavLinks = document.querySelectorAll('.footer-col:nth-child(2) .footer-links a');
        footerNavLinks.forEach((link, index) => {
            const labels = [t.footerHome, t.footerAbout, t.footerServices, t.footerPrices];
            if (labels[index]) {
                link.textContent = labels[index];
            }
        });

        const footerDocLinks = document.querySelectorAll('.footer-col:nth-child(3) .footer-links a');
        footerDocLinks.forEach((link, index) => {
            const labels = [t.footerPrivacy, t.footerTerms, t.footerImpressum];
            if (labels[index]) {
                link.textContent = labels[index];
            }
        });

        const footerContactItems = document.querySelectorAll('.contact-list li');
        if (footerContactItems.length === 3) {
            footerContactItems[0].innerHTML = `<i class="fa-solid fa-location-dot"></i> ${t.footerLocation}`;
            footerContactItems[1].innerHTML = `<i class="fa-solid fa-phone"></i> <a href="tel:+4915237241232" style="text-decoration: underline;">${t.footerCall}</a>`;
            footerContactItems[2].innerHTML = `<i class="fa-brands fa-whatsapp" style="color: #25D366;"></i> <a href="https://wa.me/4915237241232" style="text-decoration: underline;">${t.footerWhatsapp}</a>`;
        }

        setText('.footer-bottom p', t.footerRights);

        langButtons.forEach((button) => {
            button.classList.toggle('is-active', button.dataset.lang === language);
        });

        localStorage.setItem('siteLanguage', language);
    };

    langButtons.forEach((button) => {
        button.addEventListener('click', () => {
            applyLanguage(button.dataset.lang);
        });
    });

    mobileToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        if (nav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
            document.body.style.overflow = 'hidden';
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
            document.body.style.overflow = '';
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
                document.body.style.overflow = '';
            }
        });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = bookingForm.querySelector('button[type="submit"]');
            const t = translations[currentLanguage];

            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const name = `${firstName} ${lastName}`.trim();
            const phone = document.getElementById('phone').value;

            btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> ${t.formLoading}`;
            btn.disabled = true;

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, phone })
                });

                if (response.ok) {
                    btn.innerHTML = `<i class="fa-solid fa-check"></i> ${t.formSuccess}`;
                    btn.style.backgroundColor = 'var(--secondary)';
                    btn.style.color = 'white';
                    bookingForm.reset();
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                btn.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${t.formError}`;
                btn.style.backgroundColor = '#ef4444';
                btn.style.color = 'white';
            } finally {
                setTimeout(() => {
                    btn.innerHTML = translations[currentLanguage].formSubmit;
                    btn.disabled = false;
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                }, 3000);
            }
        });
    }

    const sections = document.querySelectorAll('section, .hero');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - header.offsetHeight - 100)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    applyLanguage(currentLanguage);
});
