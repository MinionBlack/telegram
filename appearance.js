document.addEventListener('DOMContentLoaded', function() {
    const appearanceModal = document.getElementById('appearanceModal');
    const closeAppearance = document.getElementById('closeAppearance');
    const appearanceButton = document.querySelector('.settings-item i.fa-palette').parentElement;
    
    // Загружаем сохраненные настройки
    const settings = loadAppearanceSettings();
    applyAppearanceSettings(settings);

    // Открытие модального окна
    appearanceButton.addEventListener('click', () => {
        appearanceModal.classList.add('active');
    });

    // Закрытие модального окна
    closeAppearance.addEventListener('click', () => {
        appearanceModal.classList.remove('active');
    });

    // Обработка выбора темы
    document.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.dataset.theme;
            document.documentElement.className = `theme-${theme}`;
            saveAppearanceSettings({ theme });
            updateActiveOptions('.theme-option', option);
        });
    });

    // Обработка выбора размера сообщений
    document.querySelectorAll('.size-option').forEach(option => {
        option.addEventListener('click', () => {
            const size = option.dataset.size;
            document.querySelector('.messages-container').className = 
                `messages-container message-size-${size}`;
            saveAppearanceSettings({ messageSize: size });
            updateActiveOptions('.size-option', option);
        });
    });

    // Обработка выбора цвета фона
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', () => {
            const color = option.dataset.color;
            document.querySelector('.messages-container').style.backgroundColor = color;
            saveAppearanceSettings({ backgroundColor: color });
            updateActiveOptions('.color-option', option);
        });
    });

    // Обработка выбора фонового изображения
    document.querySelectorAll('.image-option').forEach(option => {
        option.addEventListener('click', () => {
            const image = option.dataset.image;
            document.querySelector('.messages-container').style.backgroundImage = 
                `url('backgrounds/${image}')`;
            saveAppearanceSettings({ backgroundImage: image });
            updateActiveOptions('.image-option', option);
        });
    });

    function updateActiveOptions(selector, activeOption) {
        document.querySelectorAll(selector).forEach(opt => {
            opt.classList.remove('active');
        });
        activeOption.classList.add('active');
    }

    function saveAppearanceSettings(newSettings) {
        const currentSettings = loadAppearanceSettings();
        const settings = { ...currentSettings, ...newSettings };
        localStorage.setItem('appearanceSettings', JSON.stringify(settings));
        
        // Сохраняем на сервере
        fetch('save_appearance.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(settings)
        }).catch(error => console.error('Error saving appearance:', error));
    }

    function loadAppearanceSettings() {
        const defaultSettings = {
            theme: 'light',
            messageSize: 'medium',
            backgroundColor: '#e6ebee',
            backgroundImage: null
        };
        
        const savedSettings = localStorage.getItem('appearanceSettings');
        return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    }

    function applyAppearanceSettings(settings) {
        // Применяем тему ко всему документу
        document.documentElement.className = `theme-${settings.theme}`;
        
        // Применяем размер сообщений
        document.querySelector('.messages-container').className = 
            `messages-container message-size-${settings.messageSize}`;
        
        // Применяем фон
        const messagesContainer = document.querySelector('.messages-container');
        if (settings.backgroundImage) {
            messagesContainer.style.backgroundImage = `url('backgrounds/${settings.backgroundImage}')`;
            messagesContainer.style.backgroundColor = '';
        } else {
            messagesContainer.style.backgroundImage = '';
            messagesContainer.style.backgroundColor = settings.backgroundColor;
        }

        // Отмечаем активные опции
        document.querySelector(`.theme-option[data-theme="${settings.theme}"]`)?.classList.add('active');
        document.querySelector(`.size-option[data-size="${settings.messageSize}"]`)?.classList.add('active');
        document.querySelector(`.color-option[data-color="${settings.backgroundColor}"]`)?.classList.add('active');
        if (settings.backgroundImage) {
            document.querySelector(`.image-option[data-image="${settings.backgroundImage}"]`)?.classList.add('active');
        }
    }
}); 