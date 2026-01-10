const generateBtn = document.getElementById('generate-btn');
const numbersContainer = document.getElementById('numbers');
const themeSwitch = document.getElementById('checkbox');

generateBtn.addEventListener('click', () => {
    const numbers = new Set();
    while (numbers.size < 7) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }

    const numbersArray = Array.from(numbers);
    const bonusNumber = numbersArray.pop();
    const winningNumbers = numbersArray.sort((a, b) => a - b);

    displayNumbers(winningNumbers, bonusNumber);
});

function displayNumbers(winningNumbers, bonusNumber) {
    numbersContainer.innerHTML = '';

    winningNumbers.forEach(number => {
        const numberDiv = createNumberDiv(number);
        numbersContainer.appendChild(numberDiv);
    });

    const bonusDiv = createNumberDiv(bonusNumber);
    bonusDiv.style.backgroundColor = '#f44336'; // Bonus number color
    numbersContainer.appendChild(bonusDiv);
}

function createNumberDiv(number) {
    const numberDiv = document.createElement('div');
    numberDiv.classList.add('number');
    numberDiv.textContent = number;

    if (number <= 10) {
        numberDiv.style.backgroundColor = '#fbc400';
    } else if (number <= 20) {
        numberDiv.style.backgroundColor = '#69c8f2';
    } else if (number <= 30) {
        numberDiv.style.backgroundColor = '#ff7272';
    } else if (number <= 40) {
        numberDiv.style.backgroundColor = '#aaa';
    } else {
        numberDiv.style.backgroundColor = '#b0d840';
    }

    return numberDiv;
}

themeSwitch.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
});

// Check for preferred color scheme
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
    themeSwitch.checked = true;
}
