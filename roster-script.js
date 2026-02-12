// roster-script.js - ТОЛЬКО СВАЙПЫ НА МОБИЛЬНЫХ, список полностью убран

document.addEventListener('DOMContentLoaded', function() {
    // ========== ПРОВЕРКА НА МОБИЛЬНОЕ УСТРОЙСТВО ==========
    function isMobile() {
        return window.innerWidth <= 1000;
    }

    // Данные игроков
    const players = [
        {
            nick: 'wh1testxr',
            name: 'Виталий Столяров',
            role: 'КАПИТАН',
            bio: 'Капитан команды. Тактический лидер и второй AWP.',
            photo: 'images/Whitestar.webp',
            config: 'configs/wh1testxr_config.cfg',
            faceit: 'https://www.faceit.com/ru/players/wh1testxr'
        },
        {
            nick: 'malce-',
            name: 'Илья Мальцев',
            role: 'СНАЙПЕР',
            bio: 'Основной AWP\'ер команды. Быстрая реакция и нестандартные позиции.',
            photo: 'images/malce.webp',
            config: 'configs/malce_config.cfg',
            faceit: 'https://www.faceit.com/ru/players/malce-'
        },
        {
            nick: 'oston',
            name: 'Владислав Мезин',
            role: 'ЛЮРКЕР',
            bio: 'Игрок поддержки. Создает пространство для тиммейтов и закрывает важные направления.',
            photo: 'images/Oston.webp',
            config: 'configs/oston_config.cfg',
            faceit: 'https://www.faceit.com/ru/players/oston'
        },
        {
            nick: 'setqa',
            name: 'Виктор Королев',
            role: 'РИФЛЕР',
            bio: 'Универсал с отличной стрельбой и игровым интеллектом.',
            photo: 'images/Setqa.webp',
            config: 'configs/setqa_config.cfg',
            faceit: 'https://www.faceit.com/ru/players/setqa'
        },
        {
            nick: 'Sip1z',
            name: 'Теодор Карманов',
            role: 'РИФЛЕР',
            bio: 'Ведущий рифлер команды. Известен своей агрессивной игрой на входах и стабильно высоким уроном.',
            photo: 'images/Sip1z.webp',
            config: 'configs/sip1z_config.cfg',
            faceit: 'https://www.faceit.com/ru/players/Sip1z'
        }
    ];

    // Элементы DOM
    const playerPhoto = document.getElementById('p-img');
    const playerRole = document.getElementById('p-role');
    const playerNick = document.getElementById('p-nick');
    const playerBio = document.getElementById('p-bio');
    
    // Текущий выбранный игрок
    let currentIndex = 0;
    let startTouchX = 0;
    let endTouchX = 0;
    
    // Функция обновления контента
    function updatePlayerContent(index) {
        const player = players[index];
        
        // Обновляем фото
        if (playerPhoto) {
            playerPhoto.src = player.photo;
            playerPhoto.alt = `Фото ${player.nick}`;
        }
        
        // Обновляем текстовую информацию
        if (playerRole) playerRole.textContent = player.role;
        
        if (playerNick) {
            // Получаем текущие ссылки
            const configLink = document.querySelector('.config-download');
            const faceitLink = document.querySelector('.faceit-link');
            
            // Сохраняем HTML иконок
            const configHTML = configLink ? configLink.outerHTML : '';
            const faceitHTML = faceitLink ? faceitLink.outerHTML : '';
            
            // Обновляем ник с иконками
            playerNick.innerHTML = `${player.nick} ${configHTML} ${faceitHTML}`;
        }
        
        if (playerBio) playerBio.textContent = player.bio;
        
        // Обновляем ссылки напрямую
        const configLink = document.querySelector('.config-download');
        const faceitLink = document.querySelector('.faceit-link');
        
        if (configLink) {
            configLink.href = player.config;
            configLink.download = `${player.nick}_config.cfg`;
        }
        
        if (faceitLink) {
            faceitLink.href = player.faceit;
        }
        
        // Обновляем активный класс в списке (только для десктопа)
        if (!isMobile()) {
            const playerNavItems = document.querySelectorAll('.player-nav-item');
            playerNavItems.forEach((item, i) => {
                if (i === index) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }
    }
    
    // ========== СВАЙПЫ ДЛЯ МОБИЛЬНЫХ ==========
    const detailsColumn = document.querySelector('.player-details-column');
    
    if (detailsColumn) {
        
        // Начало касания
        detailsColumn.addEventListener('touchstart', function(e) {
            if (!isMobile()) return;
            startTouchX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        // Конец касания
        detailsColumn.addEventListener('touchend', function(e) {
            if (!isMobile()) return;
            endTouchX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        // Обработка свайпа
        function handleSwipe() {
            const minSwipeDistance = 50;
            const swipeDistance = endTouchX - startTouchX;
            
            if (Math.abs(swipeDistance) < minSwipeDistance) return;
            
            if (swipeDistance > 0) {
                // Свайп вправо - предыдущий игрок
                currentIndex = (currentIndex - 1 + players.length) % players.length;
                updatePlayerContent(currentIndex);
                showSwipeFeedback('right');
            } else {
                // Свайп влево - следующий игрок
                currentIndex = (currentIndex + 1) % players.length;
                updatePlayerContent(currentIndex);
                showSwipeFeedback('left');
            }
        }
        
        // Визуальная обратная связь
        function showSwipeFeedback(direction) {
            const feedback = document.createElement('div');
            feedback.className = 'swipe-feedback';
            feedback.textContent = direction === 'left' ? '→' : '←';
            feedback.style.cssText = `
                position: absolute;
                top: 50%;
                ${direction === 'left' ? 'right: 20px;' : 'left: 20px;'}
                transform: translateY(-50%);
                background: rgba(118, 255, 3, 0.25);
                color: #76ff03;
                font-size: 2.2rem;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 2px solid #76ff03;
                animation: swipeFade 0.4s ease forwards;
                z-index: 100;
                pointer-events: none;
                backdrop-filter: blur(2px);
                font-weight: bold;
                box-shadow: 0 0 20px rgba(118, 255, 3, 0.3);
            `;
            
            detailsColumn.appendChild(feedback);
            
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            }, 400);
        }
    }
    
    // Добавляем анимацию для свайпа
    const style = document.createElement('style');
    style.textContent = `
        @keyframes swipeFade {
            0% { opacity: 0; transform: translateY(-50%) scale(0.5); }
            50% { opacity: 1; transform: translateY(-50%) scale(1.1); }
            100% { opacity: 0; transform: translateY(-50%) scale(1.5); }
        }
    `;
    document.head.appendChild(style);
    
    // На десктопе оставляем клики по списку
    if (!isMobile()) {
        const playerNavItems = document.querySelectorAll('.player-nav-item');
        playerNavItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                currentIndex = index;
                updatePlayerContent(currentIndex);
            });
        });
    }
    
    // Начальное обновление контента
    updatePlayerContent(0);
});

