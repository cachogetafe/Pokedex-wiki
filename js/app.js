document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initGlobalSearch();
    renderHome();
    renderPokedex();
    renderMoves();
    renderAbilities();
    renderItems();
    renderTypes();
    renderGames();
    renderTCG();
    renderGuides();

    document.getElementById('audio-toggle').addEventListener('click', () => {
        soundManager.enabled = !soundManager.enabled;
        soundManager.playClick();
    });
});

function initNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            soundManager.playClick();
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const targetView = tab.getAttribute('data-target');
            document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
            document.getElementById(`view-${targetView}`).classList.add('active');
        });
    });
}

function initGlobalSearch() {
    const searchInput = document.getElementById('global-search');
    const clearBtn = document.getElementById('clear-search');
    const dropdown = document.getElementById('search-results-dropdown');

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) { dropdown.classList.add('hidden'); clearBtn.classList.add('hidden'); return; }
        clearBtn.classList.remove('hidden');
        let results = [];
        POKEDEX_DATA.pokemon.forEach(p => { if (p.name.toLowerCase().includes(query)) results.push({ title: p.name, type: 'Pokémon', id: p.id }); });
        
        if (results.length > 0) {
            dropdown.innerHTML = results.map(r => `<div class="search-result-item" onclick="showPokemonDetail(${r.id})"><span>${r.title}</span><span class="pokemon-id">${r.type}</span></div>`).join('');
            dropdown.classList.remove('hidden');
        } else {
            dropdown.innerHTML = `<div class="search-result-item">No se encontraron registros</div>`;
            dropdown.classList.remove('hidden');
        }
    });

    clearBtn.addEventListener('click', () => { searchInput.value = ''; dropdown.classList.add('hidden'); clearBtn.classList.add('hidden'); });
}

function renderHome() {
    document.getElementById('featured-pokemon').innerHTML = POKEDEX_DATA.pokemon.filter(p => p.featured).map(p => createCard(p)).join('');
    document.getElementById('recent-added-list').innerHTML = POKEDEX_DATA.pokemon.filter(p => p.recent).map(p => `<li><a href="#" onclick="showPokemonDetail(${p.id}); return false;">${p.name} (#${String(p.id).padStart(3, '0')})</a></li>`).join('');
    document.getElementById('latest-guides').innerHTML = POKEDEX_DATA.guides.map(g => `<div class="wiki-card" style="text-align: left;"><h4>${g.title}</h4><p style="font-size:0.85rem; color:#8b949e;">${g.excerpt}</p></div>`).join('');
}

function renderPokedex() {
    document.getElementById('pokedex-grid').innerHTML = POKEDEX_DATA.pokemon.map(p => createCard(p)).join('');
}

function createCard(p) {
    const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`;
    return `<div class="wiki-card" onclick="showPokemonDetail(${p.id})"><span class="pokemon-id">#${String(p.id).padStart(3, '0')}</span><img src="${imgUrl}" alt="${p.name}"><h4>${p.name}</h4><p style="font-size:0.8rem; color:var(--accent-blue);">${p.typesList.join(' / ')}</p></div>`;
}

function showPokemonDetail(id) {
    soundManager.playSuccess();
    const p = POKEDEX_DATA.pokemon.find(item => item.id === id);
    if (!p) return;
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById('view-pokemon-detail').classList.add('active');
    document.getElementById('search-results-dropdown').classList.add('hidden');

    const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`;
    document.getElementById('pokemon-detail-content').innerHTML = `
        <div class="detail-img-container"><img src="${imgUrl}" alt="${p.name}"><p style="text-align:center; margin-top:10px; color:var(--accent-blue);">Categoría: ${p.category}</p></div>
        <div class="detail-info">
            <span class="pokemon-id">Nº Nacional #${String(p.id).padStart(3, '0')}</span>
            <h2>${p.name}</h2>
            <p style="margin: 10px 0; font-style: italic;">"${p.description}"</p>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; font-size:0.9rem;">
                <div><strong>Tipos:</strong> ${p.typesList.join(', ')}</div>
                <div><strong>Altura:</strong> ${p.height}</div>
                <div><strong>Peso:</strong> ${p.weight}</div>
                <div><strong>Habilidad:</strong> ${p.abilities.join(', ')}</div>
            </div>
            <h3 style="margin-top:20px; font-size:1rem;">Estadísticas Base</h3>
            <div class="stats-container">
                ${renderStatBar('HP', p.stats.hp)}${renderStatBar('Ataque', p.stats.atk)}${renderStatBar('Defensa', p.stats.def)}
            </div>
        </div>`;
    document.getElementById('back-to-pokedex').onclick = () => {
        soundManager.playClick();
        document.getElementById('view-pokemon-detail').classList.remove('active');
        document.getElementById('view-pokedex').classList.add('active');
    };
}

function renderStatBar(label, val) {
    return `<div class="stat-bar-wrapper"><span style="width:70px;">${label} (${val})</span><div class="stat-bar"><div class="stat-fill" style="width:${Math.min(100,(val/150)*100)}%;"></div></div></div>`;
}

function renderMoves() {
    document.querySelector('#moves-table tbody').innerHTML = POKEDEX_DATA.moves.map(m => `<tr><td><strong>${m.name}</strong></td><td>${m.type}</td><td>${m.category}</td><td>${m.power}</td><td>${m.acc}%</td><td>${m.pp}</td><td>${m.effect}</td></tr>`).join('');
}
function renderAbilities() {
    document.getElementById('abilities-grid').innerHTML = POKEDEX_DATA.abilities.map(a => `<div class="wiki-card" style="text-align:left;"><h4>${a.name}</h4><p style="font-size:0.85rem; color:#8b949e;">${a.desc}</p></div>`).join('');
}
function renderItems() {
    document.getElementById('items-grid').innerHTML = POKEDEX_DATA.items.map(i => `<div class="wiki-card" style="text-align:left;"><span class="pokemon-id">${i.category}</span><h4>${i.name}</h4><p style="font-size:0.85rem; color:#8b949e;">${i.desc}</p></div>`).join('');
}
function renderTypes() {
    document.getElementById('types-container').innerHTML = POKEDEX_DATA.types.map(t => `<div class="wiki-card" style="text-align:left;"><h4 style="color:var(--accent-red);">${t.name}</h4><p style="font-size:0.85rem;"><strong>Fuerte:</strong> ${t.strongVs.join(', ')}</p><p style="font-size:0.85rem;"><strong>Débil:</strong> ${t.weakVs.join(', ')}</p></div>`).join('');
}
function renderGames() {
    document.getElementById('games-container').innerHTML = POKEDEX_DATA.games.map(g => `<div class="wiki-card" style="text-align:left;"><span class="pokemon-id">${g.gen} • ${g.platform}</span><h4>${g.title}</h4></div>`).join('');
}
function renderTCG() {
    document.getElementById('tcg-container').innerHTML = POKEDEX_DATA.tcg.map(c => `<div class="wiki-card"><span class="pokemon-id">${c.expansion}</span><h4>${c.name}</h4><p style="font-size:0.8rem; color:#f59e0b;">${c.rarity}</p></div>`).join('');
}
function renderGuides() {
    document.getElementById('guides-container').innerHTML = POKEDEX_DATA.guides.map(g => `<div class="wiki-card" style="text-align:left;"><h3>${g.title}</h3><p style="font-size:0.9rem; color:#8b949e;">${g.excerpt}</p></div>`).join('');
}