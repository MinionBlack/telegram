document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.querySelector('.message-input');
    const messagesContainer = document.querySelector('.messages-container');
    const menuIcon = document.querySelector('.menu-icon');
    const settingsSidebar = document.getElementById('settingsSidebar');
    const closeSettings = document.getElementById('closeSettings');
    
    // Создаем оверлей для затемнения фона
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    // Открытие меню настроек
    menuIcon.addEventListener('click', function() {
        settingsSidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Запрещаем прокрутку основного контента
    });

    // Закрытие меню настроек
    function closeSettingsMenu() {
        settingsSidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeSettings.addEventListener('click', closeSettingsMenu);
    overlay.addEventListener('click', closeSettingsMenu);

    // Загрузка данных пользователя
    function loadUserProfile() {
        fetch('get_user_profile.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('profileName').textContent = data.username;
                    document.getElementById('profileEmail').textContent = data.email;
                    // Обновляем инициалы в аватаре
                    const initials = data.username.split(' ')
                        .map(word => word[0])
                        .join('')
                        .toUpperCase();
                    document.querySelector('.avatar-text').textContent = initials;
                    
                    // Применяем сохраненный язык
                    if (data.language) {
                        changeLanguage(data.language);
                    }
                }
            })
            .catch(error => console.error('Error loading profile:', error));
    }

    // Обработка выхода из аккаунта
    document.querySelector('.settings-item.logout').addEventListener('click', function() {
        fetch('logout.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = 'index.html';
                }
            })
            .catch(error => console.error('Error logging out:', error));
    });

    // Отправка сообщения
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && this.value.trim()) {
            const message = this.value.trim();
            sendMessage(message);
            this.value = '';
        }
    });

    function sendMessage(text) {
        const messageHTML = `
            <div class="message sent">
                <div class="message-content">
                    <p>${text}</p>
                    <span class="message-time">${getCurrentTime()}</span>
                </div>
            </div>
        `;
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function getCurrentTime() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        
        return `${hours}:${minutes} ${ampm}`;
    }

    // Загружаем профиль пользователя при загрузке страницы
    loadUserProfile();

    let currentLang = localStorage.getItem('language') || 'en';

    // Функция для изменения языка
    function changeLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('language', lang);
        
        // Сохраняем язык на сервере
        fetch('save_language.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ language: lang })
        }).catch(error => console.error('Error saving language:', error));
        
        // Обновляем все тексты на странице
        document.querySelector('.settings-header h2').textContent = translations[lang].settings;
        document.querySelector('.search-input').placeholder = translations[lang].search;
        document.querySelector('.message-input').placeholder = translations[lang].writeMessage;
        document.querySelector('.online-status').textContent = translations[lang].online;
        
        // Обновляем тексты в меню настроек
        document.querySelectorAll('.settings-item').forEach(item => {
            const text = item.querySelector('span');
            if (text) {
                switch(text.textContent.toLowerCase()) {
                    case 'notifications':
                    case 'уведомления':
                    case 'powiadomienia':
                    case '通知':
                        text.textContent = translations[lang].notifications;
                        break;
                    case 'privacy and security':
                    case 'конфиденциальность':
                    case 'prywatność i bezpieczeństwo':
                    case '隐私与安全':
                        text.textContent = translations[lang].privacySecurity;
                        break;
                    case 'appearance':
                    case 'внешний вид':
                    case 'wygląd':
                    case '外观':
                        text.textContent = translations[lang].appearance;
                        break;
                    case 'language':
                    case 'язык':
                    case 'język':
                    case '语言':
                        text.textContent = translations[lang].language;
                        break;
                    case 'log out':
                    case 'выйти':
                    case 'wyloguj się':
                    case '退出登录':
                        text.textContent = translations[lang].logout;
                        break;
                }
            }
        });

        // Обновляем индикатор выбранного языка
        document.querySelectorAll('.language-option').forEach(option => {
            const isSelected = option.dataset.lang === lang;
            option.setAttribute('data-selected', isSelected);
            option.querySelector('.selected-lang').style.display = isSelected ? 'block' : 'none';
        });
    }

    // Добавьте обработчики для выбора языка
    document.querySelectorAll('.language-option').forEach(option => {
        option.addEventListener('click', function() {
            const newLang = this.dataset.lang;
            changeLanguage(newLang);
        });
    });

    // Применяем сохраненный язык при загрузке
    changeLanguage(currentLang);
}); 