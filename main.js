const gamesContainer = document.getElementById('games');
const gameCountSelect = document.getElementById('game-count');
const langEnBtn = document.getElementById('lang-en');
const langKoBtn = document.getElementById('lang-ko');
const themeLightBtn = document.getElementById('theme-light');
const themeDarkBtn = document.getElementById('theme-dark');

const modal = document.getElementById('manual-modal');
const modalTitle = document.getElementById('modal-title');
const modalClose = document.getElementById('modal-close');
const modalConfirm = document.getElementById('modal-confirm');
const modalCancel = document.getElementById('modal-cancel');
const numberGrid = document.getElementById('number-grid');

const NUMBER_COUNT = 6;
const MAX_NUMBER = 45;

const translations = {
    en: {
        title: 'Lotto Number Studio',
        subtitle: 'Design your picks with fast auto draws or precise manual selection.',
        language: 'Language',
        theme: 'Theme',
        lightMode: 'Light',
        darkMode: 'Dark',
        gameCountLabel: 'Game Count',
        gameTitle: 'Game',
        auto: 'Auto',
        manual: 'Manual',
        modalTitle: 'Select 6 Numbers',
        confirm: 'Confirm',
        cancel: 'Cancel',
        empty: 'No numbers yet',
        alertSelect6: 'Please select exactly 6 numbers.',
        alertMax6: 'You can only select up to 6 numbers.'
    },
    ko: {
        title: '로또 번호 스튜디오',
        subtitle: '자동 추첨 또는 수동 선택으로 번호를 만들어 보세요.',
        language: '언어',
        theme: '테마',
        lightMode: '라이트',
        darkMode: '다크',
        gameCountLabel: '게임 수',
        gameTitle: '게임',
        auto: '자동',
        manual: '수동',
        modalTitle: '6개의 번호를 선택하세요',
        confirm: '확인',
        cancel: '취소',
        empty: '번호가 없습니다',
        alertSelect6: '6개 숫자를 선택해주세요.',
        alertMax6: '최대 6개까지 선택할 수 있습니다.'
    }
};

let currentLanguage = 'en';
let currentTheme = 'light';
let currentGameIndex = null;
let selectedNumbers = new Set();
let gamePicks = [];

function t(key) {
    return translations[currentLanguage][key] || key;
}

function applyLanguage() {
    document.documentElement.lang = currentLanguage;
    document.querySelectorAll('[data-i18n]').forEach((node) => {
        const key = node.getAttribute('data-i18n');
        node.textContent = t(key);
    });
    renderGames();
}

function applyTheme() {
    document.body.classList.toggle('theme-dark', currentTheme === 'dark');
    document.body.classList.toggle('theme-light', currentTheme === 'light');
}

function setActiveButton(group, active) {
    group.forEach((btn) => btn.classList.toggle('is-active', btn === active));
}

function getGameCount() {
    return parseInt(gameCountSelect.value, 10);
}

function ensurePicksSize() {
    const count = getGameCount();
    if (gamePicks.length > count) {
        gamePicks = gamePicks.slice(0, count);
        return;
    }
    while (gamePicks.length < count) {
        gamePicks.push(null);
    }
}

function generateAutoPick() {
    const nums = new Set();
    while (nums.size < NUMBER_COUNT) {
        nums.add(Math.floor(Math.random() * MAX_NUMBER) + 1);
    }
    return [...nums].sort((a, b) => a - b);
}

function renderNumbers(container, nums) {
    container.innerHTML = '';
    if (!nums || nums.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'empty-state';
        empty.textContent = t('empty');
        container.appendChild(empty);
        return;
    }
    nums.forEach((num) => {
        const ball = document.createElement('span');
        ball.className = 'ball';
        ball.textContent = num;
        container.appendChild(ball);
    });
}

function createGameCard(index) {
    const card = document.createElement('div');
    card.className = 'game-card';

    const title = document.createElement('h3');
    title.textContent = `${t('gameTitle')} ${index + 1}`;

    const numbers = document.createElement('div');
    numbers.className = 'ball-row';
    renderNumbers(numbers, gamePicks[index]);

    const buttons = document.createElement('div');
    buttons.className = 'game-actions';

    const autoBtn = document.createElement('button');
    autoBtn.className = 'btn primary';
    autoBtn.textContent = t('auto');
    autoBtn.addEventListener('click', () => {
        gamePicks[index] = generateAutoPick();
        renderNumbers(numbers, gamePicks[index]);
    });

    const manualBtn = document.createElement('button');
    manualBtn.className = 'btn ghost';
    manualBtn.textContent = t('manual');
    manualBtn.addEventListener('click', () => openManualModal(index));

    buttons.append(autoBtn, manualBtn);
    card.append(title, numbers, buttons);

    return card;
}

function renderGames() {
    ensurePicksSize();
    gamesContainer.innerHTML = '';
    const count = getGameCount();
    for (let i = 0; i < count; i++) {
        gamesContainer.appendChild(createGameCard(i));
    }
}

function openManualModal(index) {
    currentGameIndex = index;
    selectedNumbers = new Set(gamePicks[index] || []);
    modalTitle.textContent = t('modalTitle');
    buildNumberGrid();
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
}

function closeManualModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    currentGameIndex = null;
}

function buildNumberGrid() {
    numberGrid.innerHTML = '';
    for (let i = 1; i <= MAX_NUMBER; i++) {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'number-chip';
        item.textContent = i;
        if (selectedNumbers.has(i)) {
            item.classList.add('selected');
        }
        item.addEventListener('click', () => {
            if (selectedNumbers.has(i)) {
                selectedNumbers.delete(i);
                item.classList.remove('selected');
                return;
            }
            if (selectedNumbers.size >= NUMBER_COUNT) {
                alert(t('alertMax6'));
                return;
            }
            selectedNumbers.add(i);
            item.classList.add('selected');
        });
        numberGrid.appendChild(item);
    }
}

function confirmManualSelection() {
    if (selectedNumbers.size !== NUMBER_COUNT) {
        alert(t('alertSelect6'));
        return;
    }
    gamePicks[currentGameIndex] = [...selectedNumbers].sort((a, b) => a - b);
    renderGames();
    closeManualModal();
}

langEnBtn.addEventListener('click', () => {
    currentLanguage = 'en';
    setActiveButton([langEnBtn, langKoBtn], langEnBtn);
    applyLanguage();
});

langKoBtn.addEventListener('click', () => {
    currentLanguage = 'ko';
    setActiveButton([langEnBtn, langKoBtn], langKoBtn);
    applyLanguage();
});

themeLightBtn.addEventListener('click', () => {
    currentTheme = 'light';
    setActiveButton([themeLightBtn, themeDarkBtn], themeLightBtn);
    applyTheme();
});

themeDarkBtn.addEventListener('click', () => {
    currentTheme = 'dark';
    setActiveButton([themeLightBtn, themeDarkBtn], themeDarkBtn);
    applyTheme();
});

gameCountSelect.addEventListener('change', () => {
    ensurePicksSize();
    renderGames();
});

modalClose.addEventListener('click', closeManualModal);
modalCancel.addEventListener('click', closeManualModal);
modalConfirm.addEventListener('click', confirmManualSelection);
modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeManualModal();
    }
});

applyTheme();
applyLanguage();
renderGames();
