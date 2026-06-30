const categories = [
  {
    title: 'Places',
    icon: '۞',
    summary: 'Sacred cities, capitals, ports, and crossroads that shaped Islamic civilization.',
    details:
      'Explore locations such as Makkah, Madinah, Damascus, Baghdad, Cairo, Córdoba, Istanbul, Timbuktu, and Samarqand through concise historical profiles.'
  },
  {
    title: 'Scholars',
    icon: '✦',
    summary: 'Biographies of jurists, theologians, scientists, historians, poets, and teachers.',
    details:
      'Discover scholars and polymaths whose work advanced religious learning, language, medicine, mathematics, astronomy, philosophy, and literature.'
  },
  {
    title: 'Centers of Knowledge',
    icon: '◈',
    summary: 'Libraries, madrasas, mosques, observatories, and manuscript cultures.',
    details:
      'Learn how institutions of learning connected teachers, students, patrons, translators, and book markets across the Islamic world.'
  },
  {
    title: 'Trade Routes',
    icon: '◇',
    summary: 'Overland and maritime routes that moved goods, ideas, languages, and art.',
    details:
      'Follow caravan paths, Indian Ocean networks, Saharan routes, and Mediterranean links through concise contextual learning panels.'
  },
  {
    title: 'Events',
    icon: '✧',
    summary: 'Major turning points in Islamic history presented as clear educational notes.',
    details:
      'Read short, approachable panels on migrations, dynastic transitions, intellectual movements, cultural achievements, and regional milestones.'
  }
];

const featuredTimelines = [
  {
    title: 'Early Makkah',
    period: 'Before 622 CE',
    text: 'The earliest setting of the Qur\'anic revelation, where faith, community, commerce, and moral reform emerged in a sacred Arabian city.'
  },
  {
    title: 'Madinah',
    period: '622–632 CE',
    text: 'A formative period of community building, worship, treaties, social organization, and the Prophet Muhammad\'s ﷺ leadership.'
  },
  {
    title: 'Rashidun Period',
    period: '632–661 CE',
    text: 'The first caliphs guided a rapidly expanding community while preserving revelation, governance, justice, and public responsibility.'
  },
  {
    title: 'Umayyad Period',
    period: '661–750 CE',
    text: 'An era of imperial administration, Arabic public culture, monumental architecture, and expansion from Iberia to Central Asia.'
  },
  {
    title: 'Abbasid Period',
    period: '750–1258 CE',
    text: 'Baghdad became a symbol of scholarship, translation, literature, science, law, theology, and cosmopolitan urban life.'
  },
  {
    title: 'Andalusia',
    period: '711–1492 CE',
    text: 'Muslim Iberia fostered distinctive cities, gardens, libraries, poetry, philosophy, architecture, and exchange across the western Mediterranean.'
  },
  {
    title: 'Ottoman Period',
    period: '1299–1922 CE',
    text: 'A long-lasting empire linked three continents through institutions, architecture, scholarship, trade, and imperial administration.'
  }
];

let selectedPanel = { type: 'timeline', ...featuredTimelines[0] };

function cardButton(className, html, onClick) {
  const button = document.createElement('button');
  button.className = className;
  button.type = 'button';
  button.innerHTML = html;
  button.addEventListener('click', onClick);
  return button;
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' };
    return entities[character];
  });
}

function matchesQuery(item, query) {
  return Object.values(item).join(' ').toLowerCase().includes(query);
}

function renderPanel() {
  const panel = document.querySelector('[data-info-panel]');
  const period = selectedPanel.period
    ? `<span class="period-pill">${escapeHtml(selectedPanel.period)}</span>`
    : '';

  panel.innerHTML = `
    <p class="panel-label">Selected insight</p>
    <h2>${escapeHtml(selectedPanel.title)}</h2>
    ${period}
    <p>${escapeHtml(selectedPanel.details ?? selectedPanel.text)}</p>
  `;
}

function renderCards() {
  const query = document.querySelector('#history-search').value.trim().toLowerCase();
  const categoriesRoot = document.querySelector('[data-category-grid]');
  const timelineRoot = document.querySelector('[data-timeline-grid]');
  const emptyState = document.querySelector('[data-empty-state]');

  const categoryResults = query ? categories.filter((item) => matchesQuery(item, query)) : categories;
  const timelineResults = query ? featuredTimelines.filter((item) => matchesQuery(item, query)) : featuredTimelines;

  categoriesRoot.replaceChildren();
  timelineRoot.replaceChildren();

  categoryResults.forEach((category) => {
    categoriesRoot.append(
      cardButton(
        'glass-card category-card',
        `<span class="card-icon" aria-hidden="true">${escapeHtml(category.icon)}</span>
         <h3>${escapeHtml(category.title)}</h3>
         <p>${escapeHtml(category.summary)}</p>`,
        () => {
          selectedPanel = { type: 'category', ...category };
          renderPanel();
        }
      )
    );
  });

  timelineResults.forEach((item) => {
    timelineRoot.append(
      cardButton(
        'glass-card timeline-card',
        `<span class="period-pill">${escapeHtml(item.period)}</span>
         <h3>${escapeHtml(item.title)}</h3>
         <p>${escapeHtml(item.text)}</p>`,
        () => {
          selectedPanel = { type: 'timeline', ...item };
          renderPanel();
        }
      )
    );
  });

  emptyState.hidden = categoryResults.length > 0 || timelineResults.length > 0;
}

function renderApp() {
  document.querySelector('#root').innerHTML = `
    <main class="app-shell">
      <section class="hero-section" aria-labelledby="app-title">
        <div>
          <div class="hero-kicker">Elegant Islamic History Companion</div>
          <h1 id="app-title">Atlas of Islam</h1>
          <p class="subtitle">Explore Islamic history through places, scholars, centers of knowledge, trade routes, and major events.</p>
          <label class="search-card" for="history-search">
            <span>Search the atlas</span>
            <input id="history-search" type="search" placeholder="Search eras, places, scholars, routes..." autocomplete="off" />
          </label>
        </div>
      </section>

      <section class="content-grid" aria-label="Atlas content">
        <div class="section-block">
          <div class="section-heading">
            <p>Browse by theme</p>
            <h2>Categories</h2>
          </div>
          <div class="card-grid category-grid" data-category-grid></div>
        </div>

        <aside class="info-panel" aria-live="polite" data-info-panel></aside>
      </section>

      <section class="section-block timeline-section" aria-labelledby="timeline-title">
        <div class="section-heading">
          <p>Featured learning path</p>
          <h2 id="timeline-title">Timeline Cards</h2>
        </div>
        <div class="card-grid timeline-grid" data-timeline-grid></div>
        <p class="empty-state" data-empty-state hidden>No matching cards yet. Try a broader search.</p>
      </section>
    </main>
  `;

  document.querySelector('#history-search').addEventListener('input', renderCards);
  renderPanel();
  renderCards();
}

renderApp();
