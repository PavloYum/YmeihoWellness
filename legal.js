document.addEventListener('DOMContentLoaded', () => {
    const legalCard = document.querySelector('[data-legal-page]');
    if (!legalCard) {
        return;
    }

    const page = legalCard.dataset.legalPage;
    const langButtons = document.querySelectorAll('.lang-btn');
    const homeLink = document.getElementById('legal-home-link');
    const footerLinks = document.querySelectorAll('.legal-footer-links a');
    const metaDescription = document.querySelector('meta[name="description"]');

    const translations = {
        datenschutz: {
            ru: {
                lang: 'ru',
                title: 'Datenschutzerklaerung | YumeihoWellness',
                meta: 'Политика конфиденциальности YumeihoWellness в соответствии с GDPR/DSGVO для сайта в Германии.',
                home: 'На главную',
                footer: ['Главная', 'Политика конфиденциальности', 'Условия использования', 'Impressum'],
                rights: '© 2026 YumeihoWellness. Все права защищены.',
                content: `
                    <div class="legal-kicker"><i class="fa-solid fa-shield-halved"></i> Datenschutz</div>
                    <h1 class="legal-title">Политика конфиденциальности</h1>
                    <p class="legal-updated">Актуально на 20.03.2026</p>
                    <p class="legal-lead">Эта страница описывает, какие персональные данные обрабатываются при посещении сайта YumeihoWellness и при отправке заявки через форму записи. Политика ориентирована на требования GDPR/DSGVO и немецкой практики для сайтов услуг.</p>
                    <div class="legal-actions">
                        <a href="impressum.html" class="btn btn-primary btn-sm">Открыть Impressum</a>
                        <a href="nutzungsbedingungen.html" class="btn btn-secondary btn-sm">Условия использования</a>
                    </div>
                    <section class="legal-section"><h2>1. Ответственный за обработку данных</h2><p>Pavel Boyko<br>YumeihoWellness<br>Gerther Str. 42<br>44805 Bochum<br>Deutschland</p><p>Телефон: <a href="tel:+4915237241232">+49 1523 7241232</a><br>E-Mail: <a href="mailto:info@yumeihowellness.com">info@yumeihowellness.com</a></p></section>
                    <section class="legal-section"><h2>2. Какие данные обрабатываются при посещении сайта</h2><p>При открытии сайта технически обрабатываются данные, которые браузер передает автоматически: IP-адрес, дата и время запроса, URL, referrer, user-agent, технические сведения о браузере и ответе сервера.</p><p>Эта обработка необходима для безопасной и стабильной работы сайта, защиты от злоупотреблений и корректной доставки контента.</p><ul class="legal-list"><li>Правовое основание: Art. 6 Abs. 1 lit. f DSGVO</li><li>Законный интерес: безопасная и бесперебойная работа сайта</li></ul></section>
                    <section class="legal-section"><h2>3. Форма записи и обращение через сайт</h2><p>Если вы отправляете заявку через форму записи, обрабатываются введенные вами данные, в частности имя, фамилия и номер телефона. Данные используются для связи с вами по вашему запросу и для согласования консультации.</p><ul class="legal-list"><li>Правовое основание: Art. 6 Abs. 1 lit. b DSGVO, если обращение связано с подготовкой консультации или услуги</li><li>Дополнительно может применяться Art. 6 Abs. 1 lit. f DSGVO для обработки запросов и защиты от злоупотреблений</li></ul><p>Данные из формы не используются для автоматизированного профилирования и не продаются третьим лицам.</p></section>
                    <section class="legal-section"><h2>4. Получатели данных и используемые сервисы</h2><p>Для работы сайта и обработки запросов могут привлекаться технические поставщики услуг:</p><ul class="legal-list"><li><strong>Cloudflare</strong> для доставки сайта и проксирования трафика через Cloudflare Tunnel</li><li><strong>Хостинг/сервер</strong>, на котором размещен сайт и backend приложения</li><li><strong>Google Maps</strong> при использовании встроенной карты на странице адреса</li></ul><p>При обращении к встроенной карте Google может получать ваш IP-адрес и иные технические данные. Передача данных в третьи страны, в том числе за пределы ЕС/ЕЭЗ, не исключается. Для таких случаев используются договорные и организационные меры, предусмотренные соответствующими поставщиками.</p></section>
                    <section class="legal-section"><h2>5. Cookies и технические технологии</h2><p>По умолчанию сайт не использует отдельные маркетинговые или аналитические cookies. Однако технически необходимые cookies или аналогичные механизмы могут применяться инфраструктурными сервисами безопасности и доставки контента, если это необходимо для защиты и стабильной работы сайта.</p></section>
                    <section class="legal-section"><h2>6. Срок хранения</h2><p>Технические серверные данные хранятся только столько, сколько требуется для обеспечения безопасности и работы сайта. Данные из формы записи хранятся до обработки обращения и далее только в пределах сроков, которые необходимы для исполнения обязательств, документирования коммуникации или соблюдения требований закона.</p></section>
                    <section class="legal-section"><h2>7. Ваши права</h2><p>Вы имеете право на доступ к данным, исправление, удаление, ограничение обработки, переносимость данных и возражение против обработки в пределах, предусмотренных Art. 15-21 DSGVO. Кроме того, вы имеете право подать жалобу в компетентный орган по защите данных, например в <a href="https://www.ldi.nrw.de/" target="_blank" rel="noopener noreferrer">LDI Nordrhein-Westfalen</a>.</p></section>
                    <section class="legal-section"><h2>8. Связь по вопросам конфиденциальности</h2><p>По вопросам обработки персональных данных можно написать на <a href="mailto:info@yumeihowellness.com">info@yumeihowellness.com</a> или связаться по телефону <a href="tel:+4915237241232">+49 1523 7241232</a>.</p><p class="legal-note">Если структура сайта, используемые сервисы или способы приема заявок изменятся, эта политика должна быть обновлена.</p></section>
                `
            },
            de: {
                lang: 'de',
                title: 'Datenschutz | YumeihoWellness',
                meta: 'Datenschutzerklaerung von YumeihoWellness gemaess DSGVO fuer den Standort Deutschland.',
                home: 'Zur Startseite',
                footer: ['Startseite', 'Datenschutz', 'Nutzungsbedingungen', 'Impressum'],
                rights: '© 2026 YumeihoWellness. Alle Rechte vorbehalten.',
                content: `
                    <div class="legal-kicker"><i class="fa-solid fa-shield-halved"></i> Datenschutz</div>
                    <h1 class="legal-title">Datenschutzerklaerung</h1>
                    <p class="legal-updated">Stand: 20.03.2026</p>
                    <p class="legal-lead">Auf dieser Seite wird beschrieben, welche personenbezogenen Daten bei dem Besuch der Website YumeihoWellness und bei dem Versand einer Anfrage ueber das Kontaktformular verarbeitet werden. Die Hinweise orientieren sich an der DSGVO und an der deutschen Praxis fuer Webseiten mit Dienstleistungsangeboten.</p>
                    <div class="legal-actions">
                        <a href="impressum.html" class="btn btn-primary btn-sm">Impressum</a>
                        <a href="nutzungsbedingungen.html" class="btn btn-secondary btn-sm">Nutzungsbedingungen</a>
                    </div>
                    <section class="legal-section"><h2>1. Verantwortlicher</h2><p>Pavel Boyko<br>YumeihoWellness<br>Gerther Str. 42<br>44805 Bochum<br>Deutschland</p><p>Telefon: <a href="tel:+4915237241232">+49 1523 7241232</a><br>E-Mail: <a href="mailto:info@yumeihowellness.com">info@yumeihowellness.com</a></p></section>
                    <section class="legal-section"><h2>2. Verarbeitung beim Besuch der Website</h2><p>Beim Aufruf der Website werden technisch notwendige Daten verarbeitet, die Ihr Browser automatisch uebermittelt. Dazu gehoeren insbesondere IP-Adresse, Datum und Uhrzeit des Abrufs, URL, Referrer, User-Agent sowie technische Informationen zur Anfrage und Serverantwort.</p><p>Diese Verarbeitung ist erforderlich, um die Website sicher, stabil und missbrauchsresistent bereitzustellen.</p><ul class="legal-list"><li>Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO</li><li>Berechtigtes Interesse: sichere und stoerungsfreie Bereitstellung der Website</li></ul></section>
                    <section class="legal-section"><h2>3. Kontaktformular und Anfragen</h2><p>Wenn Sie eine Anfrage ueber das Formular absenden, werden die von Ihnen eingegebenen Daten verarbeitet, insbesondere Vorname, Nachname und Telefonnummer. Diese Daten werden verwendet, um Sie auf Ihren Wunsch hin zu kontaktieren und einen Beratungstermin abzustimmen.</p><ul class="legal-list"><li>Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO, soweit die Anfrage auf die Anbahnung einer Leistung gerichtet ist</li><li>Zusaetzlich kann Art. 6 Abs. 1 lit. f DSGVO einschlaegig sein, um Anfragen zu bearbeiten und Missbrauch zu verhindern</li></ul><p>Eine automatisierte Entscheidungsfindung oder Profilbildung findet nicht statt. Die Daten werden nicht verkauft.</p></section>
                    <section class="legal-section"><h2>4. Empfaenger und eingesetzte Dienste</h2><p>Fuer den Betrieb der Website und die Bearbeitung von Anfragen koennen technische Dienstleister eingesetzt werden:</p><ul class="legal-list"><li><strong>Cloudflare</strong> fuer die Bereitstellung der Website und die Weiterleitung des Datenverkehrs ueber Cloudflare Tunnel</li><li><strong>Hosting/Server</strong> fuer den Betrieb des Frontends und des Backends</li><li><strong>Google Maps</strong> bei der Nutzung der eingebetteten Kartenansicht</li></ul><p>Beim Aufruf der eingebetteten Karte kann Google insbesondere die IP-Adresse und weitere technische Daten erhalten. Eine Datenuebermittlung in Drittstaaten ausserhalb der EU/des EWR ist dabei nicht ausgeschlossen. Soweit erforderlich, stuetzt sich die Einbindung auf die von den Anbietern bereitgestellten vertraglichen und organisatorischen Garantien.</p></section>
                    <section class="legal-section"><h2>5. Cookies und technische Technologien</h2><p>Die Website setzt standardmaessig keine gesonderten Marketing- oder Analyse-Cookies ein. Technisch notwendige Cookies oder vergleichbare Mechanismen koennen jedoch durch Sicherheits- und Auslieferungsdienste eingesetzt werden, soweit dies fuer den sicheren Betrieb erforderlich ist.</p></section>
                    <section class="legal-section"><h2>6. Speicherdauer</h2><p>Technische Serverdaten werden nur so lange gespeichert, wie dies fuer Sicherheit und Betrieb der Website erforderlich ist. Daten aus dem Formular werden bis zur Bearbeitung der Anfrage und anschliessend nur solange gespeichert, wie dies zur Dokumentation, Vertragserfuellung oder zur Erfuellung gesetzlicher Pflichten notwendig ist.</p></section>
                    <section class="legal-section"><h2>7. Ihre Rechte</h2><p>Sie haben nach Massgabe der Art. 15 bis 21 DSGVO das Recht auf Auskunft, Berichtigung, Loeschung, Einschraenkung der Verarbeitung, Datenuebertragbarkeit sowie Widerspruch gegen die Verarbeitung. Darueber hinaus besteht ein Beschwerderecht bei einer zustaendigen Datenschutzaufsichtsbehoerde, zum Beispiel bei der <a href="https://www.ldi.nrw.de/" target="_blank" rel="noopener noreferrer">LDI Nordrhein-Westfalen</a>.</p></section>
                    <section class="legal-section"><h2>8. Kontakt zum Datenschutz</h2><p>Fragen zum Datenschutz koennen an <a href="mailto:info@yumeihowellness.com">info@yumeihowellness.com</a> oder telefonisch unter <a href="tel:+4915237241232">+49 1523 7241232</a> gestellt werden.</p><p class="legal-note">Wenn sich die Struktur der Website, eingesetzte Dienste oder die Art der Anfrageannahme aendern, sollte diese Datenschutzerklaerung aktualisiert werden.</p></section>
                `
            }
        },
        terms: {
            ru: {
                lang: 'ru',
                title: 'Nutzungsbedingungen | YumeihoWellness',
                meta: 'Условия использования сайта YumeihoWellness.',
                home: 'На главную',
                footer: ['Главная', 'Политика конфиденциальности', 'Условия использования', 'Impressum'],
                rights: '© 2026 YumeihoWellness. Все права защищены.',
                content: `
                    <div class="legal-kicker"><i class="fa-solid fa-file-contract"></i> Nutzungsbedingungen</div>
                    <h1 class="legal-title">Условия использования сайта</h1>
                    <p class="legal-updated">Актуально на 20.03.2026</p>
                    <p class="legal-lead">Эти условия регулируют использование сайта YumeihoWellness. Они описывают назначение сайта, ограничения ответственности и правила использования размещенной информации.</p>
                    <div class="legal-actions">
                        <a href="datenschutz.html" class="btn btn-primary btn-sm">Политика конфиденциальности</a>
                        <a href="impressum.html" class="btn btn-secondary btn-sm">Impressum</a>
                    </div>
                    <section class="legal-section"><h2>1. Назначение сайта</h2><p>Сайт предоставляет информацию об услугах YumeihoWellness, условиях записи, адресе приема и вариантах связи. Использование сайта носит информационный характер.</p></section>
                    <section class="legal-section"><h2>2. Отсутствие экстренной и неотложной помощи</h2><p>Информация на сайте не заменяет экстренную медицинскую помощь, индивидуальную врачебную диагностику и лечение. При острых состояниях необходимо обращаться в службу неотложной помощи или к соответствующему медицинскому специалисту.</p></section>
                    <section class="legal-section"><h2>3. Запрос записи через форму</h2><p>Отправка формы записи или заявки на сайте сама по себе не означает автоматического заключения договора или гарантированного времени приема. Запись считается согласованной после подтверждения со стороны YumeihoWellness.</p></section>
                    <section class="legal-section"><h2>4. Ответственность за содержание сайта</h2><p>Собственное содержимое сайта создается с разумной тщательностью и регулярно обновляется. Несмотря на это, не гарантируется абсолютная полнота, актуальность и отсутствие ошибок во всех информационных материалах.</p><p>Обязательная ответственность по действующему законодательству Германии остается неизменной.</p></section>
                    <section class="legal-section"><h2>5. Внешние ссылки</h2><p>Сайт может содержать ссылки на внешние ресурсы, например карты, социальные сети или мессенджеры. На содержание сторонних сайтов после размещения ссылки оператор сайта влияния не имеет. За содержимое внешних страниц отвечают их соответствующие владельцы.</p></section>
                    <section class="legal-section"><h2>6. Авторские права</h2><p>Тексты, дизайн, изображения и иные материалы сайта защищены авторским правом, если иное не указано отдельно. Использование, копирование или распространение материалов за пределами, допускаемыми законом, требует предварительного согласия правообладателя.</p></section>
                    <section class="legal-section"><h2>7. Применимое право</h2><p>К использованию сайта применяется право Федеративной Республики Германия в той мере, в какой это допустимо по закону.</p></section>
                    <section class="legal-section"><h2>8. Контакт</h2><p>По вопросам использования сайта: <a href="mailto:info@yumeihowellness.com">info@yumeihowellness.com</a> или <a href="tel:+4915237241232">+49 1523 7241232</a>.</p></section>
                `
            },
            de: {
                lang: 'de',
                title: 'Nutzungsbedingungen | YumeihoWellness',
                meta: 'Nutzungsbedingungen fuer die Website YumeihoWellness.',
                home: 'Zur Startseite',
                footer: ['Startseite', 'Datenschutz', 'Nutzungsbedingungen', 'Impressum'],
                rights: '© 2026 YumeihoWellness. Alle Rechte vorbehalten.',
                content: `
                    <div class="legal-kicker"><i class="fa-solid fa-file-contract"></i> Nutzungsbedingungen</div>
                    <h1 class="legal-title">Nutzungsbedingungen</h1>
                    <p class="legal-updated">Stand: 20.03.2026</p>
                    <p class="legal-lead">Diese Bedingungen regeln die Nutzung der Website YumeihoWellness. Sie beschreiben den Zweck der Website, Haftungsgrenzen und die Regeln fuer die Verwendung der bereitgestellten Informationen.</p>
                    <div class="legal-actions">
                        <a href="datenschutz.html" class="btn btn-primary btn-sm">Datenschutz</a>
                        <a href="impressum.html" class="btn btn-secondary btn-sm">Impressum</a>
                    </div>
                    <section class="legal-section"><h2>1. Zweck der Website</h2><p>Die Website stellt Informationen ueber Leistungen von YumeihoWellness, Terminmoeglichkeiten, den Standort und Kontaktwege bereit. Die Nutzung der Website dient ausschliesslich der Information.</p></section>
                    <section class="legal-section"><h2>2. Keine Notfall- oder Akutversorgung</h2><p>Die Inhalte dieser Website ersetzen weder eine Notfallversorgung noch eine individuelle aerztliche Diagnose oder Behandlung. Bei akuten Beschwerden ist unverzueglich der Notruf oder ein geeigneter medizinischer Ansprechpartner zu kontaktieren.</p></section>
                    <section class="legal-section"><h2>3. Termin- und Kontaktanfragen</h2><p>Das Absenden eines Formulars oder einer Anfrage ueber die Website begruendet noch keinen automatischen Vertrag und keinen garantiert verbindlichen Termin. Ein Termin gilt erst nach ausdruecklicher Bestaetigung durch YumeihoWellness als vereinbart.</p></section>
                    <section class="legal-section"><h2>4. Haftung fuer Inhalte</h2><p>Eigene Inhalte der Website werden mit angemessener Sorgfalt erstellt und regelmaessig gepflegt. Eine vollstaendige Gewaehr fuer Richtigkeit, Vollstaendigkeit und jederzeitige Aktualitaet aller Informationen kann jedoch, soweit gesetzlich zulaessig, nicht uebernommen werden.</p><p>Gesetzlich zwingende Haftungsregeln bleiben hiervon unberuehrt.</p></section>
                    <section class="legal-section"><h2>5. Externe Links</h2><p>Die Website kann Links zu externen Angeboten enthalten, etwa zu Karten, sozialen Netzwerken oder Messengern. Auf die Inhalte verlinkter Seiten besteht nach der Verlinkung kein Einfluss. Fuer diese Inhalte sind ausschliesslich die jeweiligen Betreiber verantwortlich.</p></section>
                    <section class="legal-section"><h2>6. Urheberrecht</h2><p>Texte, Gestaltung, Bilder und sonstige Inhalte dieser Website sind urheberrechtlich geschuetzt, soweit nicht anders angegeben. Jede Nutzung ausserhalb der gesetzlich erlaubten Grenzen bedarf der vorherigen Zustimmung des jeweiligen Rechteinhabers.</p></section>
                    <section class="legal-section"><h2>7. Anwendbares Recht</h2><p>Fuer die Nutzung dieser Website gilt, soweit gesetzlich zulaessig, das Recht der Bundesrepublik Deutschland.</p></section>
                    <section class="legal-section"><h2>8. Kontakt</h2><p>Fragen zur Nutzung der Website koennen an <a href="mailto:info@yumeihowellness.com">info@yumeihowellness.com</a> oder telefonisch an <a href="tel:+4915237241232">+49 1523 7241232</a> gerichtet werden.</p></section>
                `
            }
        },
        impressum: {
            ru: {
                lang: 'ru',
                title: 'Impressum | YumeihoWellness',
                meta: 'Impressum YumeihoWellness в соответствии с требованиями законодательства Германии.',
                home: 'На главную',
                footer: ['Главная', 'Политика конфиденциальности', 'Условия использования', 'Impressum'],
                rights: '© 2026 YumeihoWellness. Все права защищены.',
                content: `
                    <div class="legal-kicker"><i class="fa-solid fa-scale-balanced"></i> Impressum</div>
                    <h1 class="legal-title">Impressum</h1>
                    <p class="legal-updated">Актуально на 20.03.2026</p>
                    <p class="legal-lead">Обязательная информация об операторе сайта в соответствии с требованиями немецкого законодательства для коммерческого онлайн-присутствия в Германии.</p>
                    <div class="legal-actions">
                        <a href="datenschutz.html" class="btn btn-primary btn-sm">Политика конфиденциальности</a>
                        <a href="nutzungsbedingungen.html" class="btn btn-secondary btn-sm">Условия использования</a>
                    </div>
                    <section class="legal-section"><h2>Сведения в соответствии с § 5 DDG</h2><p>Pavel Boyko<br>YumeihoWellness<br>Gerther Str. 42<br>44805 Bochum<br>Deutschland</p></section>
                    <section class="legal-section"><h2>Контакт</h2><p>Телефон: <a href="tel:+4915237241232">+49 1523 7241232</a><br>E-Mail: <a href="mailto:info@yumeihowellness.com">info@yumeihowellness.com</a></p></section>
                    <section class="legal-section"><h2>Ответственный за содержание по § 18 Abs. 2 MStV</h2><p>Pavel Boyko<br>Gerther Str. 42<br>44805 Bochum<br>Deutschland</p></section>
                    <section class="legal-section"><h2>Примечание о профессиональной классификации</h2><p>Этот сайт информирует об услугах в сфере движения, wellness и консультирования. Если для отдельных видов деятельности требуются дополнительные профессиональные или разрешительные сведения, их необходимо отдельно дополнить применительно к фактической модели работы.</p></section>
                    <section class="legal-section"><h2>Ответственность за контент</h2><p>Содержимое сайта подготовлено с максимально возможной тщательностью. Однако гарантия точности, полноты и актуальности информации в пределах, допустимых законом, не предоставляется.</p></section>
                    <section class="legal-section"><h2>Ответственность за ссылки</h2><p>Сайт содержит ссылки на внешние сайты третьих лиц. После размещения ссылки влияние на их содержание отсутствует. За содержимое таких страниц отвечают соответствующие операторы.</p></section>
                    <section class="legal-section"><h2>Авторское право</h2><p>Материалы и произведения, созданные владельцем сайта, подпадают под действие немецкого авторского права. Любое использование за пределами допустимого законом требует предварительного согласия правообладателя.</p></section>
                `
            },
            de: {
                lang: 'de',
                title: 'Impressum | YumeihoWellness',
                meta: 'Impressum von YumeihoWellness gemaess deutschem Recht.',
                home: 'Zur Startseite',
                footer: ['Startseite', 'Datenschutz', 'Nutzungsbedingungen', 'Impressum'],
                rights: '© 2026 YumeihoWellness. Alle Rechte vorbehalten.',
                content: `
                    <div class="legal-kicker"><i class="fa-solid fa-scale-balanced"></i> Impressum</div>
                    <h1 class="legal-title">Impressum</h1>
                    <p class="legal-updated">Stand: 20.03.2026</p>
                    <p class="legal-lead">Anbieterkennzeichnung fuer diese Website gemaess den Informationspflichten nach deutschem Recht, insbesondere fuer einen kommerziellen Online-Auftritt in Deutschland.</p>
                    <div class="legal-actions">
                        <a href="datenschutz.html" class="btn btn-primary btn-sm">Datenschutz</a>
                        <a href="nutzungsbedingungen.html" class="btn btn-secondary btn-sm">Nutzungsbedingungen</a>
                    </div>
                    <section class="legal-section"><h2>Angaben gemaess § 5 DDG</h2><p>Pavel Boyko<br>YumeihoWellness<br>Gerther Str. 42<br>44805 Bochum<br>Deutschland</p></section>
                    <section class="legal-section"><h2>Kontakt</h2><p>Telefon: <a href="tel:+4915237241232">+49 1523 7241232</a><br>E-Mail: <a href="mailto:info@yumeihowellness.com">info@yumeihowellness.com</a></p></section>
                    <section class="legal-section"><h2>Verantwortlich fuer den Inhalt nach § 18 Abs. 2 MStV</h2><p>Pavel Boyko<br>Gerther Str. 42<br>44805 Bochum<br>Deutschland</p></section>
                    <section class="legal-section"><h2>Hinweis zur beruflichen Einordnung</h2><p>Diese Website informiert ueber Leistungen im Bereich Bewegung, Wellness und Beratung. Soweit fuer einzelne Taetigkeiten zusaetzliche berufsrechtliche oder erlaubnisrechtliche Angaben erforderlich sind, muessen diese fuer den konkreten Geschaeftsbetrieb gesondert ergaenzt werden.</p></section>
                    <section class="legal-section"><h2>Haftung fuer Inhalte</h2><p>Die Inhalte dieser Website wurden mit groesstmoeglicher Sorgfalt erstellt. Fuer die Richtigkeit, Vollstaendigkeit und Aktualitaet der Inhalte kann jedoch keine Gewaehr uebernommen werden, soweit gesetzlich zulaessig.</p></section>
                    <section class="legal-section"><h2>Haftung fuer Links</h2><p>Diese Website enthaelt Links zu externen Webseiten Dritter. Auf deren Inhalte besteht kein Einfluss. Fuer die Inhalte der verlinkten Seiten sind ausschliesslich deren Betreiber verantwortlich.</p></section>
                    <section class="legal-section"><h2>Urheberrecht</h2><p>Die durch den Seitenbetreiber erstellten Inhalte und Werke auf dieser Website unterliegen dem deutschen Urheberrecht. Jede Verwertung ausserhalb der Grenzen des Urheberrechts bedarf der vorherigen Zustimmung des jeweiligen Rechteinhabers.</p></section>
                `
            }
        }
    };

    const applyLanguage = (language) => {
        const pageTranslations = translations[page]?.[language];
        if (!pageTranslations) {
            return;
        }

        document.documentElement.lang = pageTranslations.lang;
        document.title = pageTranslations.title;

        if (metaDescription) {
            metaDescription.setAttribute('content', pageTranslations.meta);
        }

        legalCard.innerHTML = pageTranslations.content;

        if (homeLink) {
            homeLink.textContent = pageTranslations.home;
        }

        footerLinks.forEach((link, index) => {
            if (pageTranslations.footer[index]) {
                link.textContent = pageTranslations.footer[index];
            }
        });

        const rights = document.querySelector('.footer-bottom p');
        if (rights) {
            rights.textContent = pageTranslations.rights;
        }

        langButtons.forEach((button) => {
            button.classList.toggle('is-active', button.dataset.lang === language);
        });

        localStorage.setItem('siteLanguage', language);
    };

    const storedLanguage = localStorage.getItem('siteLanguage');
    const initialLanguage = translations[page]?.[storedLanguage] ? storedLanguage : (document.documentElement.lang === 'de' ? 'de' : 'ru');

    langButtons.forEach((button) => {
        button.addEventListener('click', () => {
            applyLanguage(button.dataset.lang);
        });
    });

    applyLanguage(initialLanguage);
});
