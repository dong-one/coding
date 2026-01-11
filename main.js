const generateBtn = document.getElementById('generate-btn');
const numbersContainer = document.getElementById('numbers');
const themeSwitch = document.getElementById('checkbox');
const gameCountSelect = document.getElementById('game-count');
const manualBtn = document.getElementById('manual-btn');
const langEnBtn = document.getElementById('lang-en');
const langKoBtn = document.getElementById('lang-ko');
const manualModalTemplate = document.getElementById('manual-modal'); // The template modal
// No longer need individual constants for modal elements as they will be dynamic

let manualSelections = []; // Array to store selected numbers for each game (each element is a Set)
let activeManualModals = []; // Array to store references to active modal instances

const translations = {
    en: {
        title: 'Lotto Number Generator',
        gameCountLabel: 'Number of Games:',
        generateButton: 'Generate Numbers',
        manualButton: 'Manual Selection',
        manualModalTitle: 'Select 6 Numbers', // Base title
        manualModalTitleGame: 'Select 6 Numbers for Game ', // Title for individual games
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

    // Update titles of any currently open manual selection modals
    activeManualModals.forEach((modal, index) => {
        const modalTitleElement = modal.modalInstance.querySelector('h2');
        if (modalTitleElement) {
            modalTitleElement.textContent = translations[lang].manualModalTitleGame + (index + 1);
        }
    });

    // If no manual modals are open, ensure the base modal title is correct (though it's a template)
    if (activeManualModals.length === 0) {
        const baseModalTitleElement = manualModalTemplate.querySelector('h2');
        if (baseModalTitleElement) {
            baseModalTitleElement.textContent = translations[lang].manualModalTitle;
        }
    }
    document.documentElement.lang = lang;
}

function createManualModal(gameIndex, totalGames) {
    const lang = document.documentElement.lang;
    const modalInstance = manualModalTemplate.cloneNode(true);
    modalInstance.id = `manual-modal-${gameIndex}`;
    modalInstance.style.display = 'none'; // Ensure it's hidden initially

    const modalContent = modalInstance.querySelector('.modal-content');
    const closeBtn = modalContent.querySelector('.close-btn');
    const modalTitleElement = modalContent.querySelector('h2');
    const manualNumbersGrid = modalContent.querySelector('.manual-numbers-grid');
    const manualSelectBtn = modalContent.querySelector('#manual-select-btn');

    modalTitleElement.textContent = translations[lang].manualModalTitleGame + (gameIndex + 1);
    manualSelectBtn.dataset.gameIndex = gameIndex; // Store game index on the button

    // Attach event listeners for this specific modal instance
    closeBtn.addEventListener('click', () => closeManualModal(modalInstance));
    modalInstance.addEventListener('click', (event) => {
        if (event.target === modalInstance) {
            closeManualModal(modalInstance);
        }
    });
    manualSelectBtn.addEventListener('click', () => confirmManualSelection(modalInstance, gameIndex, totalGames));

    document.body.appendChild(modalInstance); // Add to DOM

    return { modalInstance, manualNumbersGrid, manualSelectBtn };
}

function renderManualNumbersGrid(gridElement, gameIndex) {
    gridElement.innerHTML = '';
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
        gridElement.appendChild(numberCell);
    }
}

function confirmManualSelection(modalElement, gameIndex, totalGames) {
    const lang = document.documentElement.lang;
    const currentSelectedNumbers = manualSelections[gameIndex];

    if (currentSelectedNumbers.size !== 6) {
        alert(translations[lang].alertSelect6Numbers);
        return;
    }

    modalElement.style.display = 'none'; // Hide current modal

    // If there are more games to select for, open the next modal
    if (gameIndex < totalGames - 1) {
        const nextModal = activeManualModals[gameIndex + 1];
        if (nextModal) {
            nextModal.modalInstance.style.display = 'flex';
            renderManualNumbersGrid(nextModal.manualNumbersGrid, gameIndex + 1);
            // Ensure the next modal's title is updated on language change
            const nextModalTitleElement = nextModal.modalInstance.querySelector('h2');
            nextModalTitleElement.textContent = translations[lang].manualModalTitleGame + (gameIndex + 2);
        }
    } else {
        // All games have been manually selected
        displayAllManualGames();
        cleanupManualModals(); // Remove all generated modals from DOM
    }
}

function closeManualModal(modalElement) {
    modalElement.style.display = 'none';
    // Optionally remove from DOM immediately or keep it for reuse
    // For now, let's keep it until all selections are done
}

function cleanupManualModals() {
    activeManualModals.forEach(modalObj => {
        modalObj.modalInstance.remove();
    });
    activeManualModals = [];
}

// --- Event Listeners ---

langEnBtn.addEventListener('click', () => switchLanguage('en'));
langKoBtn.addEventListener('click', () => switchLanguage('ko'));

generateBtn.addEventListener('click', () => {
    generateAutoGames();
});

manualBtn.addEventListener('click', () => {
    const gameCount = parseInt(gameCountSelect.value, 10);
    manualSelections = Array.from({ length: gameCount }, () => new Set()); // Initialize for all games
    numbersContainer.innerHTML = ''; // Clear previous results
    cleanupManualModals(); // Clean up previous modals before creating new ones

    activeManualModals = []; // Reset active modals
    for (let i = 0; i < gameCount; i++) {
        const { modalInstance, manualNumbersGrid, manualSelectBtn } = createManualModal(i, gameCount);
        activeManualModals.push({ modalInstance, manualNumbersGrid, manualSelectBtn });
    }

    if (activeManualModals.length > 0) {
        const firstModal = activeManualModals[0];
        firstModal.modalInstance.style.display = 'flex';
        renderManualNumbersGrid(firstModal.manualNumbersGrid, 0);
    }
});

gameCountSelect.addEventListener('change', () => {
    generateAutoGames();
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

function generateAutoGames() {
    const gameCount = parseInt(gameCountSelect.value, 10);
    numbersContainer.innerHTML = ''; // Clear previous results
    manualSelections = []; // Clear manual selections when generating new ones
    cleanupManualModals(); // Clean up any lingering manual modals

    let allGamesHTML = '';
    for (let i = 0; i < gameCount; i++) {
        const { winningNumbers, bonusNumber } = generateLottoNumbers();
        allGamesHTML += createGameHTML(winningNumbers, bonusNumber);
    }
    numbersContainer.innerHTML = allGamesHTML;
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

// Set initial language
switchLanguage('en');
