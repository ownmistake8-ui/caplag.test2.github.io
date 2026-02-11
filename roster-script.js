// Данные игроков
const players = {
    wh1testxr: {
        nick: "wh1testxr",
        role: "КАПИТАН",
        bio: "Ведущий рифлер команды. Известен своей агрессивной игрой на входах и стабильно высоким уроном. Играет за CapLag с основания организации.",
        img: "images/Whitestar.webp",
        config: "configs/wh1testxr_config.cfg",
        faceit: "https://www.faceit.com/ru/players/wh1testxr"
    },
    malce: {
        nick: "malce-",
        role: "СНАЙПЕР",
        bio: "Основной снайпер команды. Хладнокровный и точный, способен решить раунд одним выстрелом. Обладает отличным позиционированием.",
        img: "images/malce.webp",
        config: "configs/malce_config.cfg",
        faceit: "https://www.faceit.com/ru/players/maIce-"
    },
    oston: {
        nick: "oston",
        role: "РИФЛЕР",
        bio: "Игрок поддержки, отвечающий за флешки, смоуки и командную игру. Надежная опора для своих партнеров по команде.",
        img: "images/Oston.webp",
        config: "configs/oston_config.cfg",
        faceit: "https://www.faceit.com/ru/players/oston"
    },
    setqa: {
        nick: "setqa",
        role: "ЛЮРКЕР",
        bio: "Мастер неожиданных действий и флангов. Часто находит важные фраги благодаря своему позиционированию и терпению.",
        img: "images/Setqa.webp",
        config: "configs/setqa_config.cfg",
        faceit: "https://www.faceit.com/ru/players/setqa"
    },
    Sip1z: {
        nick: "Sip1z",
        role: "РИФЛЕР",
        bio: "Опора команды по стрельбе. Неожиданные мувы и тактики - основа Sip1z.",
        img: "images/Sip1z.webp",
        config: "configs/Sip1z_config.cfg",
        faceit: "https://www.faceit.com/ru/players/Sip1z"
    }
};

function showPlayer(id) {
    const data = players[id];
    
    // Активный пункт меню
    document.querySelectorAll('.player-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    document.querySelectorAll('.player-nav-item').forEach(item => {
        if (item.querySelector('.p-nav-nick').textContent === data.nick) {
            item.classList.add('active');
        }
    });

    // Обновляем информацию
    document.getElementById('p-nick').innerHTML = data.nick + `
        <a href="${data.config}" class="config-download" download="${data.nick}_config.cfg">
            <i class="fas fa-cog config-icon"></i>
            <span class="config-tooltip">Скачать конфиг</span>
        </a>
        <a href="${data.faceit}" class="faceit-link" target="_blank">
            <span class="faceit-text-icon">F</span>
            <span class="faceit-tooltip">Faceit профиль</span>
        </a>`;
    
    document.getElementById('p-role').textContent = data.role.toUpperCase();
    document.getElementById('p-bio').textContent = data.bio;
    
    // Обновляем фото
    const imgEl = document.getElementById('p-img');
    if (imgEl && data.img) {
        imgEl.src = data.img;
        imgEl.alt = "Фото игрока " + data.nick;
    }
}

// Загружаем первого игрока
document.addEventListener('DOMContentLoaded', function() {
    showPlayer('wh1testxr');
    
    // Обработчики для пунктов меню
    document.querySelectorAll('.player-nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const nick = this.querySelector('.p-nav-nick').textContent;
            const playerId = Object.keys(players).find(id => players[id].nick === nick);
            if (playerId) {
                showPlayer(playerId);
            }
        });
    });
});