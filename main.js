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

    for (let i = 0; i < gameCount; i++) {
        const { winningNumbers, bonusNumber } = generateLottoNumbers();
        displayGame(winningNumbers, bonusNumber);
    }
});

manualBtn.addEventListener('click', () => {
    openManualModal();
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
    const allNumbers = Array.from({ length: 45 }, (_, i) => i + 1);
    const remainingNumbers = allNumbers.filter(n => !selectedNumbers.has(n));
    const bonusNumber = remainingNumbers[Math.floor(Math.random() * remainingNumbers.length)];

    numbersContainer.innerHTML = ''; // Clear previous results
    displayGame(winningNumbers, bonusNumber);
    manualModal.style.display = 'none';
});


// --- Functions ---

function generateLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < 7) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }

    const numbersArray = Array.from(numbers);
    const bonusNumber = numbersArray.pop();
    const winningNumbers = numbersArray.sort((a, b) => a - b);

    return { winningNumbers, bonusNumber };
}

function displayGame(winningNumbers, bonusNumber) {
    const gameDiv = document.createElement('div');
    gameDiv.classList.add('lotto-game');

    winningNumbers.forEach(number => {
        const numberDiv = createNumberDiv(number);
        gameDiv.appendChild(numberDiv);
    });

    const bonusDiv = createNumberDiv(bonusNumber);
    bonusDiv.style.backgroundColor = '#f44336'; // Bonus number color
    gameDiv.appendChild(bonusDiv);

    numbersContainer.appendChild(gameDiv);
}

function createNumberDiv(number) {
    const numberDiv = document.createElement('div');
    numberDiv.classList.add('number');
    numberDiv.textContent = number;
    applyNumberColor(numberDiv, number);
    return numberDiv;
}

function applyNumberColor(element, number) {
    if (number <= 10) {
        element.style.backgroundColor = '#fbc400';
    } else if (number <= 20) {
        element.style.backgroundColor = '#69c8f2';
    } else if (number <= 30) {
        element.style.backgroundColor = '#ff7272';
    } else if (number <= 40) {
        element.style.backgroundColor = '#aaa';
    } else {
        element.style.backgroundColor = '#b0d840';
    }
}


function openManualModal() {
    manualModal.style.display = 'flex';
    manualNumbersGrid.innerHTML = '';
    selectedNumbers.clear();

    for (let i = 1; i <= 45; i++) {
        const numberDiv = document.createElement('div');
        numberDiv.classList.add('manual-number');
        numberDiv.textContent = i;
        numberDiv.dataset.number = i;

        numberDiv.addEventListener('click', () => {
            const num = parseInt(numberDiv.dataset.number, 10);
            if (selectedNumbers.has(num)) {
                selectedNumbers.delete(num);
                numberDiv.classList.remove('selected');
            } else {
                if (selectedNumbers.size < 6) {
                    selectedNumbers.add(num);
                    numberDiv.classList.add('selected');
                } else {
                    alert('You can only select up to 6 numbers.');
                }
            }
        });
        manualNumbersGrid.appendChild(numberDiv);
    }
}


// --- Theme Switcher ---

themeSwitch.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
});

// Check for preferred color scheme
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
    themeSwitch.checked = true;
}
