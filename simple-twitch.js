// Файл: simple-twitch.js
const TEAM_CHANNELS = [
    { username: 'fcs_rk', name: 'FCS', isLive: true },
    // Добавь остальных
];

async function checkStreamStatus(username) {
    try {
        // Используем публичный API (лимит 30 запросов в минуту)
        const response = await fetch(`https://decapi.me/twitch/uptime/${username}`);
        const text = await response.text();
        return text !== `${username} is offline`;
    } catch {
        return false;
    }
}

async function updateAllStreams() {
    const container = document.getElementById('streams-container');
    
    // Проверяем статус для каждого
    const statuses = await Promise.all(
        TEAM_CHANNELS.map(async (channel) => ({
            ...channel,
            isLive: await checkStreamStatus(channel.username)
        }))
    );
    
    // Показываем
    const liveChannels = statuses.filter(c => c.isLive);
    const offlineChannels = statuses.filter(c => !c.isLive);
    
    let html = '';
    
    // LIVE стримы
    if (liveChannels.length > 0) {
        html += liveChannels.map(channel => `
            <div class="stream-card live">
                <div class="stream-live-badge">LIVE</div>
                <a href="https://twitch.tv/${channel.username}" target="_blank" rel="noopener noreferrer">
                    <div class="stream-thumbnail">
                        <div style="background: linear-gradient(45deg, #9146FF, #000); height: 100%;"></div>
                    </div>
                    <div class="stream-info">
                        <div class="streamer-name">${channel.name}</div>
                        <div class="stream-title">Стримит прямо сейчас!</div>
                        <div class="stream-stats">
                            <span class="stream-viewers">
                                <i class="fas fa-eye"></i> LIVE
                            </span>
                            <span class="stream-game">CS2</span>
                        </div>
                    </div>
                </a>
            </div>
        `).join('');
    }
    
    // Оффлайн каналы
    html += offlineChannels.map(channel => `
        <div class="stream-card">
            <a href="https://twitch.tv/${channel.username}" target="_blank" rel="noopener noreferrer">
                <div class="stream-thumbnail">
                    <div style="background: #1a1a1a; height: 100%; display: flex; align-items: center; justify-content: center;">
                        <i class="fab fa-twitch" style="font-size: 3rem; color: #333;"></i>
                    </div>
                </div>
                <div class="stream-info">
                    <div class="streamer-name">${channel.name}</div>
                    <div class="stream-title">Оффлайн</div>
                    <div class="stream-stats">
                        <span style="color: var(--text-muted);">
                            <i class="far fa-clock"></i> Не в сети
                        </span>
                        <button class="follow-btn" onclick="followChannel('${channel.username}')">
                            <i class="fas fa-plus"></i> Подписаться
                        </button>
                    </div>
                </div>
            </a>
        </div>
    `).join('');
    
    container.innerHTML = html || `
        <div class="stream-offline">
            <i class="fas fa-tv"></i>
            <p>Подпишитесь на наши каналы чтобы не пропустить стримы!</p>
        </div>
    `;
}

function followChannel(username) {
    window.open(`https://twitch.tv/${username}?subscribe=true`, '_blank');
}

// Обновление каждые 5 минут
setInterval(updateAllStreams, 300000);
updateAllStreams();