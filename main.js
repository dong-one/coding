const generateBtn = document.getElementById('generate-btn');
const numbersContainer = document.getElementById('numbers');
const themeSwitch = document.getElementById('checkbox');
const gameCountSelect = document.getElementById('game-count');
const manualBtn = document.getElementById('manual-btn');
const manualModal = document.getElementById('manual-modal');
const closeBtn = document.querySelector('.close-btn');
const manualNumbersGrid = document.getElementById('manual-numbers');
const manualSelectBtn = document.getElementById('manual-select-btn');

let selectedNumbers = new Set();

// --- Event Listeners ---

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
    if (selectedNumbers.size !== 6) {
        alert('Please select exactly 6 numbers.');
        return;
    }
    const winningNumbers = Array.from(selectedNumbers).sort((a, b) => a - b);
    const { bonusNumber } = generateLottoNumbers(new Set(winningNumbers));

    numbersContainer.innerHTML = ''; // Clear previous results
    displayGame(winningNumbers, bonusNumber, 'Your Manual Selection');
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

function displayGame(winningNumbers, bonusNumber, title = 'Lotto Numbers') {
    numbersContainer.innerHTML += createGameHTML(winningNumbers, bonusNumber, title);
}

function createGameHTML(winningNumbers, bonusNumber, title = 'Lotto Numbers') {
    const gameHTML = `
        <div class="game">
            <h3>${title}</h3>
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
            if (selectedNumbers.has(num)) {
                selectedNumbers.delete(num);
                numberCell.classList.remove('selected');
            } else {
                if (selectedNumbers.size < 6) {
                    selectedNumbers.add(num);
                    numberCell.classList.add('selected');
                } else {
                    alert('You can only select up to 6 numbers.');
                }
            }
        });
        manualNumbersGrid.appendChild(numberCell);
    }
}
