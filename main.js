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
const manualModalTitleElement = manualModal.querySelector('h2'); // Get the h2 element in the modal
const currentGameIndexInput = document.getElementById('current-game-index');

let manualSelections = []; // Array to store selected numbers for each game (each element is a Set)

const translations = {
    en: {
        title: 'Lotto Number Generator',
        gameCountLabel: 'Number of Games:',
        generateButton: 'Generate Numbers',
        manualButton: 'Manual Selection',
        manualModalTitle: 'Select 6 Numbers',
        manualModalTitleGame: 'Select 6 Numbers for Game ',
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
        manualModalTitleGame: '게임 번호 선택 ',
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
    // Update modal title if it's open and showing a game-specific title
    if (manualModal.style.display === 'flex' && currentGameIndexInput.value !== '-1') {
        const lang = document.documentElement.lang;
        const gameIndex = parseInt(currentGameIndexInput.value) + 1;
        manualModalTitleElement.textContent = translations[lang].manualModalTitleGame + gameIndex;
    } else {
        manualModalTitleElement.textContent = translations[document.documentElement.lang].manualModalTitle;
    }
    document.documentElement.lang = lang;
}

function openManualSelectionModalForGame(gameIndex) {
    const lang = document.documentElement.lang;
    currentGameIndexInput.value = gameIndex;
    manualModalTitleElement.textContent = translations[lang].manualModalTitleGame + (gameIndex + 1);
    manualModal.style.display = 'flex';
    renderManualNumbersGrid(gameIndex);
}

// --- Event Listeners ---

langEnBtn.addEventListener('click', () => switchLanguage('en'));
langKoBtn.addEventListener('click', () => switchLanguage('ko'));

generateBtn.addEventListener('click', () => {
    const gameCount = parseInt(gameCountSelect.value, 10);
    numbersContainer.innerHTML = ''; // Clear previous results
    manualSelections = []; // Clear manual selections when generating new ones

    let allGamesHTML = '';
    for (let i = 0; i < gameCount; i++) {
        const { winningNumbers, bonusNumber } = generateLottoNumbers();
        allGamesHTML += createGameHTML(winningNumbers, bonusNumber);
    }
    numbersContainer.innerHTML = allGamesHTML;
});

manualBtn.addEventListener('click', () => {
    const gameCount = parseInt(gameCountSelect.value, 10);
    manualSelections = Array.from({ length: gameCount }, () => new Set()); // Initialize for all games
    numbersContainer.innerHTML = ''; // Clear previous results
    openManualSelectionModalForGame(0); // Start with the first game
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
    const currentGameIndex = parseInt(currentGameIndexInput.value);
    const currentSelectedNumbers = manualSelections[currentGameIndex];

    if (currentSelectedNumbers.size !== 6) {
        alert(translations[lang].alertSelect6Numbers);
        return;
    }

    // If there are more games to select for, open the modal for the next game
    if (currentGameIndex < manualSelections.length - 1) {
        openManualSelectionModalForGame(currentGameIndex + 1);
    } else {
        // All games have been manually selected
        manualModal.style.display = 'none';
        displayAllManualGames();
    }
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

function displayAllManualGames() {
    numbersContainer.innerHTML = ''; // Clear previous results
    const lang = document.documentElement.lang;
    manualSelections.forEach((selectedSet, index) => {
        const winningNumbers = Array.from(selectedSet).sort((a, b) => a - b);
        // For manual selections, generate a bonus number that isn't among the selected 6
        let bonusNumber;
        do {
            bonusNumber = Math.floor(Math.random() * 45) + 1;
        } while (selectedSet.has(bonusNumber));

        displayGame(winningNumbers, bonusNumber, translations[lang].manualSelectionTitle + ` ${index + 1}`);
    });
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

function renderManualNumbersGrid(gameIndex) {
    manualNumbersGrid.innerHTML = '';
    const currentSelectedNumbers = manualSelections[gameIndex]; // Get the Set for the current game

    for (let i = 1; i <= 45; i++) {
        const numberCell = document.createElement('div');
        numberCell.classList.add('manual-number');
        numberCell.textContent = i;
        numberCell.dataset.number = i;

        if (currentSelectedNumbers.has(i)) {
            numberCell.classList.add('selected');
        }

        numberCell.addEventListener('click', () => {
            const num = parseInt(numberCell.dataset.number, 10);
            const lang = document.documentElement.lang;
            if (currentSelectedNumbers.has(num)) {
                currentSelectedNumbers.delete(num);
                numberCell.classList.remove('selected');
            } else {
                if (currentSelectedNumbers.size < 6) {
                    currentSelectedNumbers.add(num);
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
