// Скрипт для главной страницы

const API_KEY = 'f8648ced-7c72-4038-b5c6-e3181c5e2bb3';
const PLAYER_NICKNAME = 'wh1testxr'; 

async function loadTournamentMatches() {
    const grid = document.getElementById('faceit-matches');
    
    if (!grid) return;
    
    grid.style.display = 'flex';
    grid.style.flexWrap = 'wrap';
    grid.style.gap = '20px';
    grid.style.justifyContent = 'center';

    try {
        const pRes = await fetch(`https://open.faceit.com/data/v4/players?nickname=${PLAYER_NICKNAME}`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        const pData = await pRes.json();
        const pID = pData.player_id;

        const hRes = await fetch(`https://open.faceit.com/data/v4/players/${pID}/history?game=cs2&limit=50`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        const hData = await hRes.json();
        const tourneyMatches = hData.items.filter(m => m.competition_type === 'championship');
        
        if (tourneyMatches.length === 0) {
            grid.innerHTML = '<div style="color: var(--text-muted); padding: 20px;">Турнирных игр не найдено.</div>';
            return;
        }

        grid.innerHTML = '';

        for (const item of tourneyMatches.slice(0, 3)) {
            try {
                const statsRes = await fetch(`https://open.faceit.com/data/v4/matches/${item.match_id}/stats`, {
                    headers: { 'Authorization': `Bearer ${API_KEY}` }
                });
                const statsData = await statsRes.json();
                
                if (!statsData.rounds || statsData.rounds.length === 0) continue;

                const round = statsData.rounds[0];
                const teams = round.teams;

                let ourTeamIndex = teams[0].players.some(p => p.player_id === pID) ? 0 : 1;
                let enemyTeamIndex = ourTeamIndex === 0 ? 1 : 0;

                const ourTeam = teams[ourTeamIndex];
                const enemyTeam = teams[enemyTeamIndex];

                const formatName = (name) => name.split(' ')[0].slice(0, 10);
                const ourNameDisplay = formatName(ourTeam.team_stats.Team);
                const enemyNameDisplay = formatName(enemyTeam.team_stats.Team);

                const scoreUs = ourTeam.team_stats["Final Score"];
                const scoreThem = enemyTeam.team_stats["Final Score"];
                
                const win = parseInt(scoreUs) > parseInt(scoreThem);

                const card = document.createElement('div');
                card.className = 'match-card';
                card.style.minWidth = '280px';
                card.style.padding = '20px';
                
                card.innerHTML = `
                    <div class="match-meta" style="margin-bottom: 15px; display: flex; justify-content: space-between; font-size: 0.75rem; text-transform: uppercase; color: #666;">
                        <span>Завершено</span>
                        <span style="color: var(--accent-primary)">${round.round_stats.Map.replace('de_', '')}</span>
                    </div>
                    <div class="match-teams" style="display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                        <span style="flex: 1; text-align: right; font-weight: 700; color: #fff;">${ourNameDisplay}</span>
                        <span class="score ${win ? 'win' : 'loss'}" style="background: #1a1a1a; padding: 5px 12px; border-radius: 4px; font-family: monospace; font-size: 1.2rem;">
                            ${scoreUs}:${scoreThem}
                        </span>
                        <span style="flex: 1; text-align: left; font-weight: 700; color: #888;">${enemyNameDisplay}</span>
                    </div>
                    <div style="margin-top: 15px; text-align: center; font-size: 0.7rem; color: #444; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
                        ${item.competition_name}
                    </div>
                `;
                grid.appendChild(card);
            } catch (e) {
                console.error("Ошибка парсинга:", e);
            }
        }
        
        // Если нет турнирных матчей, показываем последние матчи
        if (grid.children.length === 0) {
            await showLastMatches(pID, grid);
        }
        
    } catch (error) {
        console.error('Критическая ошибка:', error);
        grid.innerHTML = `
            <div style="color: var(--text-muted); padding: 20px; text-align: center; grid-column: 1 / -1;">
                Ошибка загрузки матчей. Попробуйте обновить страницу.
            </div>
        `;
    }
}

// Показать последние матчи если нет турнирных
async function showLastMatches(playerId, container) {
    try {
        const hRes = await fetch(`https://open.faceit.com/data/v4/players/${playerId}/history?game=cs2&limit=3`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        const hData = await hRes.json();
        
        container.innerHTML = '';
        
        hData.items.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'match-card';
            card.style.minWidth = '280px';
            card.style.padding = '20px';
            
            const status = item.status === 'finished' ? 'Завершен' : 'В процессе';
            const map = 'N/A';
            
            card.innerHTML = `
                <div class="match-meta" style="margin-bottom: 15px; display: flex; justify-content: space-between; font-size: 0.75rem; text-transform: uppercase; color: #666;">
                    <span>${status}</span>
                    <span style="color: var(--accent-primary)">${map}</span>
                </div>
                <div class="match-teams" style="display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                    <span style="flex: 1; text-align: right; font-weight: 700; color: #fff;">CapLag</span>
                    <span class="score" style="background: #1a1a1a; padding: 5px 12px; border-radius: 4px; font-family: monospace; font-size: 1.2rem; color: var(--accent-primary);">
                        -
                    </span>
                    <span style="flex: 1; text-align: left; font-weight: 700; color: #888;">Соперник</span>
                </div>
                <div style="margin-top: 15px; text-align: center; font-size: 0.7rem; color: #444; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
                    ${item.competition_name || 'FACEIT MATCH'}
                </div>
            `;
            container.appendChild(card);
        });
        
    } catch (error) {
        showDemoMatches(container);
    }
}

// Показать демо матчи если все остальное не работает
function showDemoMatches(container) {
    container.innerHTML = '';
    
    const demoMatches = [
        {
            competition_name: 'FACEIT PRO LEAGUE',
            score: '16:12',
            map: 'MIRAGE',
            opponent: 'TEAM ALPHA',
            result: 'win'
        },
        {
            competition_name: 'ESL CHALLENGER',
            score: '14:16',
            map: 'INFERNO',
            opponent: 'TEAM BETA',
            result: 'loss'
        },
        {
            competition_name: 'REGIONAL CUP',
            score: '16:10',
            map: 'ANCIENT',
            opponent: 'TEAM GAMMA',
            result: 'win'
        }
    ];
    
    demoMatches.forEach(match => {
        const isWin = match.result === 'win';
        
        const card = document.createElement('div');
        card.className = 'match-card';
        card.style.minWidth = '280px';
        card.style.padding = '20px';
        
        card.innerHTML = `
            <div class="match-meta" style="margin-bottom: 15px; display: flex; justify-content: space-between; font-size: 0.75rem; text-transform: uppercase; color: #666;">
                <span>Завершено</span>
                <span style="color: var(--accent-primary)">${match.map}</span>
            </div>
            <div class="match-teams" style="display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                <span style="flex: 1; text-align: right; font-weight: 700; color: ${isWin ? 'var(--accent-primary)' : '#fff'};">CAPLAG</span>
                <span class="score ${isWin ? '' : 'loss'}" style="background: #1a1a1a; padding: 5px 12px; border-radius: 4px; font-family: monospace; font-size: 1.2rem;">
                    ${match.score}
                </span>
                <span style="flex: 1; text-align: left; font-weight: 700; color: #888;">${match.opponent}</span>
            </div>
            <div style="margin-top: 15px; text-align: center; font-size: 0.7rem; color: #444; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
                ${match.competition_name}
            </div>
        `;
        container.appendChild(card);
    });
}

// Загружаем матчи после загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('faceit-matches')) {
        loadTournamentMatches();
    }
}); 