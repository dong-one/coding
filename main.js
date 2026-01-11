const generateBtn = document.getElementById('generate-btn');
const numbersContainer = document.getElementById('numbers');
const themeSwitch = document.getElementById('checkbox');
const gameCountSelect = document.getElementById('game-count');
const manualBtn = document.getElementById('manual-btn');
const manualModal = document.getElementById('manual-modal');
const closeBtn = document.querySelector('.close-btn');
const manualNumbersGrid = document.getElementById('manual-numbers');
const manualSelectBtn = document.getElementById('manual-select-btn');
const langEnBtn = document.getElementById('lang-en');
const langKoBtn = document.getElementById('lang-ko');

let selectedNumbers = new Set();

const translations = {
    en: {
        title: 'Lotto Number Generator',
        gameCountLabel: 'Number of Games:',
        generateButton: 'Generate Numbers',
        manualButton: 'Manual Selection',
        manualModalTitle: 'Select 6 Numbers',
        manualConfirmButton: 'Confirm Selection',
        manualSelectionTitle: 'Your Manual Selection',
        alertSelect6Numbers: 'Please select exactly 6 numbers.',
        alertMax6Numbers: 'You can only select up to 6 numbers.',
        lottoNumbersTitle: 'Lotto Numbers'
    },
    ko: {
        title: '로또 번호 생성기',
        gameCountLabel: '게임 수:',
        generateButton: '번호 생성',
        manualButton: '수동 선택',
        manualModalTitle: '6개의 번호를 선택하세요',
        manualConfirmButton: '선택 완료',
        manualSelectionTitle: '내 수동 선택',
        alertSelect6Numbers: '6개의 번호를 선택해주세요.',
        alertMax6Numbers: '최대 6개까지 선택할 수 있습니다.',
        lottoNumbersTitle: '로또 번호'
    }
};

function switchLanguage(lang) {
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.getAttribute('data-lang');
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
    document.documentElement.lang = lang;
}

// --- Event Listeners ---

langEnBtn.addEventListener('click', () => switchLanguage('en'));
langKoBtn.addEventListener('click', () => switchLanguage('ko'));

generateBtn.addEventListener('click', () => {
    const gameCount = parseInt(gameCountSelect.value, 10);
    numbersContainer.innerHTML = ''; // Clear previous results

    let allGamesHTML = '';
    for (let i = 0; i < gameCount; i++) {
        const { winningNumbers, bonusNumber } = generateLottoNumbers();
        allGamesHTML += createGameHTML(winningNumbers, bonusNumber);
    }
    numbersContainer.innerHTML = allGamesHTML;
});

manualBtn.addEventListener('click', () => {
    manualModal.style.display = 'block';
    renderManualNumbersGrid();
});

closeBtn.addEventListener('click', () => {
    manualModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target == manualModal) {
        manualModal.style.display = 'none';
    }
});

manualSelectBtn.addEventListener('click', () => {
    const lang = document.documentElement.lang;
    if (selectedNumbers.size !== 6) {
        alert(translations[lang].alertSelect6Numbers);
        return;
    }
    const winningNumbers = Array.from(selectedNumbers).sort((a, b) => a - b);
    const { bonusNumber } = generateLottoNumbers(new Set(winningNumbers));

    numbersContainer.innerHTML = ''; // Clear previous results
    displayGame(winningNumbers, bonusNumber, translations[lang].manualSelectionTitle);
    manualModal.style.display = 'none';
});

themeSwitch.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
});


// --- Functions ---

function generateLottoNumbers(exclude = new Set()) {
    const numbers = new Set();
    while (numbers.size < 6) {
        const num = Math.floor(Math.random() * 45) + 1;
        if (!exclude.has(num)) {
            numbers.add(num);
        }
    }

    let bonusNumber;
    do {
        bonusNumber = Math.floor(Math.random() * 45) + 1;
    } while (numbers.has(bonusNumber) || exclude.has(bonusNumber));

    return {
        winningNumbers: Array.from(numbers).sort((a, b) => a - b),
        bonusNumber: bonusNumber
    };
}

function displayGame(winningNumbers, bonusNumber, title) {
    const lang = document.documentElement.lang;
    const gameTitle = title || translations[lang].lottoNumbersTitle;
    numbersContainer.innerHTML += createGameHTML(winningNumbers, bonusNumber, gameTitle);
}

function createGameHTML(winningNumbers, bonusNumber, title) {
    const lang = document.documentElement.lang;
    const gameTitle = title || translations[lang].lottoNumbersTitle;
    const gameHTML = `
        <div class="game">
            <h3>${gameTitle}</h3>
            <div class="winning-numbers">
                ${winningNumbers.map(num => `<span class="number">${num}</span>`).join('')}
                <span class="plus-sign">+</span>
                <span class="number bonus">${bonusNumber}</span>
            </div>
        </div>
    `;
    return gameHTML;
}

function renderManualNumbersGrid() {
    manualNumbersGrid.innerHTML = '';
    selectedNumbers.clear();
    for (let i = 1; i <= 45; i++) {
        const numberCell = document.createElement('div');
        numberCell.classList.add('manual-number');
        numberCell.textContent = i;
        numberCell.dataset.number = i;

        numberCell.addEventListener('click', () => {
            const num = parseInt(numberCell.dataset.number, 10);
            const lang = document.documentElement.lang;
            if (selectedNumbers.has(num)) {
                selectedNumbers.delete(num);
                numberCell.classList.remove('selected');
            } else {
                if (selectedNumbers.size < 6) {
                    selectedNumbers.add(num);
                    numberCell.classList.add('selected');
                } else {
                    alert(translations[lang].alertMax6Numbers);
                }
            }
        });
        manualNumbersGrid.appendChild(numberCell);
    }
}

// Set initial language
switchLanguage('en');
