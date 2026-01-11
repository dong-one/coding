const menuData = [
    {
        name: '순두부찌개',
        category: 'korean',
        description: '칼칼하고 부드러운 국물로 속을 따뜻하게.',
        tags: ['따뜻함', '국물', '든든함']
    },
    {
        name: '비빔밥',
        category: 'korean',
        description: '다채로운 채소와 고소한 고추장의 조합.',
        tags: ['신선함', '균형', '깔끔함']
    },
    {
        name: '스테이크 샐러드',
        category: 'western',
        description: '담백한 단백질과 산뜻한 채소.',
        tags: ['라이트', '단백질', '프레시']
    },
    {
        name: '크림 파스타',
        category: 'western',
        description: '부드러운 크림과 알덴테 면의 조화.',
        tags: ['부드러움', '고소함', '만족감']
    },
    {
        name: '연어 덮밥',
        category: 'japanese',
        description: '기름진 연어와 간장의 균형.',
        tags: ['감칠맛', '부드러움', '고급감']
    },
    {
        name: '돈코츠 라멘',
        category: 'japanese',
        description: '진한 육수와 탄력 있는 면발.',
        tags: ['진한맛', '국물', '포만감']
    },
    {
        name: '마파두부',
        category: 'chinese',
        description: '매콤한 향신과 부드러운 두부.',
        tags: ['매콤함', '향신료', '밥도둑']
    },
    {
        name: '꿔바로우',
        category: 'chinese',
        description: '바삭함과 새콤달콤함을 한 번에.',
        tags: ['바삭함', '새콤달콤', '기분전환']
    },
    {
        name: '떡볶이 플래터',
        category: 'street',
        description: '매콤달콤 소스에 어묵과 튀김까지.',
        tags: ['매콤달콤', '간편함', '스트릿']
    },
    {
        name: '김밥 & 유부우동',
        category: 'street',
        description: '가볍지만 든든한 조합.',
        tags: ['가벼움', '분식', '따뜻함']
    },
    {
        name: '수플레 팬케이크',
        category: 'dessert',
        description: '포근한 식감과 달콤한 향.',
        tags: ['달콤함', '포근함', '티타임']
    },
    {
        name: '말차 라떼 & 티라미수',
        category: 'dessert',
        description: '쌉싸름함과 달콤함의 밸런스.',
        tags: ['디저트', '여유', '감성']
    }
];

const categoryLabels = {
    all: '전체',
    korean: '한식',
    japanese: '일식',
    chinese: '중식',
    western: '양식',
    street: '분식',
    dessert: '디저트'
};

const menuTitle = document.getElementById('menu-title');
const menuDesc = document.getElementById('menu-desc');
const menuTags = document.getElementById('menu-tags');
const timeSlot = document.getElementById('time-slot');
const recommendBtn = document.getElementById('recommend-btn');
const rerollBtn = document.getElementById('reroll-btn');
const saveBtn = document.getElementById('save-btn');
const clearBtn = document.getElementById('clear-btn');
const categoryButtons = document.getElementById('category-buttons');
const menuGrid = document.getElementById('menu-grid');
const savedList = document.getElementById('saved-list');
const ladderOpenBtn = document.getElementById('ladder-open');
const ladderModal = document.getElementById('ladder-modal');
const ladderCloseBtn = document.getElementById('ladder-close');
const ladderTitle = document.getElementById('ladder-title');
const ladderDesc = document.getElementById('ladder-desc');
const ladderTop = document.getElementById('ladder-top');
const ladderBottom = document.getElementById('ladder-bottom');
const ladderCanvas = document.getElementById('ladder-canvas');
const ladderRerollBtn = document.getElementById('ladder-reroll');
const ladderResult = document.getElementById('ladder-result');
const resultModal = document.getElementById('result-modal');
const resultCloseBtn = document.getElementById('result-close');
const resultImage = document.getElementById('result-image');
const resultName = document.getElementById('result-name');
const resultCategory = document.getElementById('result-category');
const partnerForm = document.getElementById('partner-form');
const partnerStatus = document.getElementById('partner-status');

let activeCategory = 'all';
let savedMenus = [];
let ladderState = null;
let ladderAnimationId = null;

function getTimeSlot() {
    const hour = new Date().getHours();
    if (hour < 11) return '아침';
    if (hour < 15) return '점심';
    if (hour < 19) return '저녁';
    return '야식';
}

function filterMenus() {
    if (activeCategory === 'all') {
        return menuData;
    }
    return menuData.filter((menu) => menu.category === activeCategory);
}

function pickRandomMenu() {
    const pool = filterMenus();
    if (pool.length === 0) {
        return null;
    }
    const index = Math.floor(Math.random() * pool.length);
    return pool[index];
}

function renderTags(tags) {
    menuTags.innerHTML = '';
    tags.forEach((tag) => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = tag;
        menuTags.appendChild(span);
    });
}

function updateHero(menu) {
    if (!menu) {
        menuTitle.textContent = '추천할 메뉴가 없습니다.';
        menuDesc.textContent = '다른 카테고리를 선택해보세요.';
        menuTags.innerHTML = '';
        return;
    }
    menuTitle.textContent = menu.name;
    menuDesc.textContent = menu.description;
    renderTags(menu.tags);
}

function renderGrid() {
    const pool = filterMenus();
    menuGrid.innerHTML = '';
    pool.forEach((menu) => {
        const card = document.createElement('article');
        card.className = 'menu-card';
        card.innerHTML = `
            <h4>${menu.name}</h4>
            <p>${menu.description}</p>
            <div class="tag-row">
                ${menu.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
            </div>
        `;
        card.addEventListener('click', () => updateHero(menu));
        menuGrid.appendChild(card);
    });
}

function renderSaved() {
    savedList.innerHTML = '';
    if (savedMenus.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'empty-state';
        empty.textContent = '아직 저장된 메뉴가 없습니다.';
        savedList.appendChild(empty);
        return;
    }
    savedMenus.forEach((menu) => {
        const item = document.createElement('div');
        item.className = 'saved-item';
        item.innerHTML = `
            <div>
                <strong>${menu.name}</strong>
                <span>${menu.description}</span>
            </div>
            <div class="tag-row">
                ${menu.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
            </div>
        `;
        savedList.appendChild(item);
    });
}

function getCategoryLabel(category) {
    return categoryLabels[category] || '전체';
}

function getCategoryAccent(category) {
    const accents = {
        korean: '#ff6b2d',
        japanese: '#0d8bff',
        chinese: '#ff8a1a',
        western: '#1c1a16',
        street: '#4c7cff',
        dessert: '#ff4f9a',
        all: '#0d8bff'
    };
    return accents[category] || '#0d8bff';
}

function buildMenuImage(menu) {
    const accent = getCategoryAccent(menu.category);
    const label = menu.name;
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="720" height="520">
            <defs>
                <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#fff5e8"/>
                    <stop offset="55%" stop-color="${accent}" stop-opacity="0.2"/>
                    <stop offset="100%" stop-color="#f3efe7"/>
                </linearGradient>
                <linearGradient id="plate" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#ffffff"/>
                    <stop offset="100%" stop-color="#f3efe7"/>
                </linearGradient>
            </defs>
            <rect width="100%" height="100%" rx="36" fill="url(#bg)"/>
            <circle cx="360" cy="290" r="160" fill="url(#plate)" stroke="#e2dbd3" stroke-width="6"/>
            <circle cx="360" cy="290" r="120" fill="#ffffff" stroke="#f0e7de" stroke-width="4"/>
            <path d="M250 250c30-40 120-60 190-30" fill="none" stroke="${accent}" stroke-width="10" stroke-linecap="round"/>
            <path d="M280 330c40 30 140 40 190 5" fill="none" stroke="#ff9d1a" stroke-width="8" stroke-linecap="round"/>
            <text x="360" y="120" text-anchor="middle" font-size="28" font-family="Space Grotesk, Segoe UI, sans-serif" fill="#1c1a16" font-weight="700">${label}</text>
            <text x="360" y="160" text-anchor="middle" font-size="16" font-family="Space Grotesk, Segoe UI, sans-serif" fill="#6a635e">오늘의 선택</text>
        </svg>
    `;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function shuffleArray(items) {
    for (let i = items.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
}

function getLadderItems() {
    const pool = filterMenus();
    if (pool.length <= 1) {
        return { items: pool, limited: false, total: pool.length };
    }
    const maxItems = activeCategory === 'all' ? 6 : pool.length;
    let items = pool;
    let limited = false;
    if (pool.length > maxItems) {
        items = shuffleArray([...pool]).slice(0, maxItems);
        limited = true;
    }
    return { items, limited, total: pool.length };
}

function buildLadderState(items) {
    const columns = items.length;
    const rows = Math.max(8, columns * 4);
    const rungs = Array.from({ length: rows }, () => Array(columns - 1).fill(false));
    for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < columns - 1; col += 1) {
            if (col > 0 && rungs[row][col - 1]) {
                continue;
            }
            if (Math.random() < 0.35) {
                rungs[row][col] = true;
            }
        }
    }
    const mapping = Array.from({ length: columns }, (_, start) => {
        let col = start;
        for (let row = 0; row < rows; row += 1) {
            if (rungs[row][col]) {
                col += 1;
            } else if (col > 0 && rungs[row][col - 1]) {
                col -= 1;
            }
        }
        return col;
    });
    return {
        columns,
        rows,
        rungs,
        mapping,
        items,
        activeIndex: null,
        metrics: null
    };
}

function resizeLadderCanvas() {
    if (!ladderState) return;
    const { rows, columns } = ladderState;
    const rowGap = 16;
    const topMargin = 16;
    const bottomMargin = 16;
    const height = topMargin + rowGap * (rows - 1) + bottomMargin;
    ladderCanvas.style.height = `${height}px`;
    const width = ladderCanvas.clientWidth;
    const dpr = window.devicePixelRatio || 1;
    ladderCanvas.width = Math.max(1, Math.floor(width * dpr));
    ladderCanvas.height = Math.max(1, Math.floor(height * dpr));
    const ctx = ladderCanvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ladderState.metrics = {
        rowGap,
        topMargin,
        bottomMargin,
        width,
        height,
        columnGap: columns > 1 ? width / (columns - 1) : 0
    };
}

function stopLadderAnimation() {
    if (ladderAnimationId) {
        cancelAnimationFrame(ladderAnimationId);
        ladderAnimationId = null;
    }
}

function drawLadderBase() {
    if (!ladderState) return null;
    resizeLadderCanvas();
    const { columns, rows, rungs, metrics } = ladderState;
    if (!metrics || columns < 2) return null;
    const { width, height, columnGap, topMargin, rowGap } = metrics;
    const ctx = ladderCanvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);
    ctx.lineCap = 'round';

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(28, 26, 22, 0.25)';
    for (let col = 0; col < columns; col += 1) {
        const x = columnGap * col;
        ctx.beginPath();
        ctx.moveTo(x, topMargin);
        ctx.lineTo(x, topMargin + rowGap * (rows - 1));
        ctx.stroke();
    }

    for (let row = 0; row < rows; row += 1) {
        const y = topMargin + rowGap * row;
        for (let col = 0; col < columns - 1; col += 1) {
            if (!rungs[row][col]) continue;
            const x = columnGap * col;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + columnGap, y);
            ctx.stroke();
        }
    }
    return ctx;
}

function buildPathSegments(startIndex) {
    if (!ladderState || !ladderState.metrics) return null;
    const { rows, rungs, metrics } = ladderState;
    const { columnGap, topMargin, rowGap } = metrics;
    let col = startIndex;
    let x = columnGap * col;
    let y = topMargin;
    const segments = [];
    for (let row = 0; row < rows; row += 1) {
        const yPos = topMargin + rowGap * row;
        if (y !== yPos) {
            segments.push({ x1: x, y1: y, x2: x, y2: yPos });
            y = yPos;
        }
        if (rungs[row][col]) {
            const nextX = x + columnGap;
            segments.push({ x1: x, y1: y, x2: nextX, y2: y });
            col += 1;
            x = nextX;
        } else if (col > 0 && rungs[row][col - 1]) {
            const nextX = x - columnGap;
            segments.push({ x1: x, y1: y, x2: nextX, y2: y });
            col -= 1;
            x = nextX;
        }
    }
    return { segments, endColumn: col };
}

function drawLadderPath(segments, drawLength) {
    const ctx = drawLadderBase();
    if (!ctx || !segments) return;
    ctx.strokeStyle = '#0d8bff';
    ctx.lineWidth = 3;
    let remaining = drawLength;
    ctx.beginPath();
    segments.forEach((seg) => {
        if (remaining <= 0) return;
        const dx = seg.x2 - seg.x1;
        const dy = seg.y2 - seg.y1;
        const segLength = Math.hypot(dx, dy);
        const ratio = Math.min(1, remaining / segLength);
        const x = seg.x1 + dx * ratio;
        const y = seg.y1 + dy * ratio;
        ctx.moveTo(seg.x1, seg.y1);
        ctx.lineTo(x, y);
        remaining -= segLength;
    });
    ctx.stroke();
}

function drawLadder(activeIndex = null) {
    if (activeIndex === null) {
        drawLadderBase();
        return;
    }
    const path = buildPathSegments(activeIndex);
    if (!path) return;
    const totalLength = path.segments.reduce((sum, seg) => sum + Math.hypot(seg.x2 - seg.x1, seg.y2 - seg.y1), 0);
    drawLadderPath(path.segments, totalLength);
}

function animateLadder(startIndex, onComplete) {
    stopLadderAnimation();
    const path = buildPathSegments(startIndex);
    if (!path) return;
    const totalLength = path.segments.reduce((sum, seg) => sum + Math.hypot(seg.x2 - seg.x1, seg.y2 - seg.y1), 0);
    const duration = Math.min(3300, Math.max(1350, totalLength * 3));
    const startTime = performance.now();

    const step = (now) => {
        const progress = Math.min(1, (now - startTime) / duration);
        drawLadderPath(path.segments, totalLength * progress);
        if (progress < 1) {
            ladderAnimationId = requestAnimationFrame(step);
        } else {
            ladderAnimationId = null;
            if (onComplete) onComplete(path.endColumn);
        }
    };
    ladderAnimationId = requestAnimationFrame(step);
}

function renderLadder() {
    stopLadderAnimation();
    const { items, limited, total } = getLadderItems();
    if (items.length < 2) {
        ladderTitle.textContent = `${getCategoryLabel(activeCategory)} 사다리 게임`;
        ladderDesc.textContent = '해당 카테고리에 메뉴가 충분하지 않습니다.';
        ladderTop.innerHTML = '';
        ladderBottom.innerHTML = '';
        ladderResult.textContent = '다른 카테고리를 선택해 주세요.';
        ladderResult.classList.remove('is-reveal');
        ladderCanvas.style.height = '0px';
        ladderState = null;
        return;
    }

    ladderTitle.textContent = `${getCategoryLabel(activeCategory)} 사다리 게임`;
    ladderDesc.textContent = limited
        ? `전체 메뉴 ${total}개 중 ${items.length}개로 사다리를 만들었습니다.`
        : '시작 지점을 눌러 메뉴 결과를 확인하세요.';

    ladderState = buildLadderState(items);
    ladderTop.style.setProperty('--ladder-columns', ladderState.columns);
    ladderBottom.style.setProperty('--ladder-columns', ladderState.columns);

    ladderTop.innerHTML = '';
    ladderBottom.innerHTML = '';
    ladderResult.textContent = '결과가 여기에 표시됩니다.';
    ladderResult.classList.remove('is-reveal');

    items.forEach((menu, index) => {
        const button = document.createElement('button');
        button.className = 'ladder-start';
        button.dataset.index = index;
        button.textContent = `선택 ${index + 1}`;
        ladderTop.appendChild(button);

        const end = document.createElement('div');
        end.className = 'ladder-end';
        end.dataset.index = index;
        end.textContent = menu.name;
        ladderBottom.appendChild(end);
    });

    requestAnimationFrame(() => drawLadder(null));
}

function clearResultEffects() {
    ladderResult.classList.remove('is-reveal');
    ladderBottom.querySelectorAll('.ladder-end').forEach((end) => {
        end.classList.remove('is-reveal');
    });
}

function revealResult(startIndex, resultMenu, endIndex) {
    ladderResult.textContent = `선택 ${startIndex + 1} 결과: ${resultMenu.name}`;
    ladderResult.classList.remove('is-reveal');
    void ladderResult.offsetWidth;
    ladderResult.classList.add('is-reveal');
    const targetEnd = ladderBottom.querySelector(`.ladder-end[data-index="${endIndex}"]`);
    if (targetEnd) {
        targetEnd.classList.remove('is-reveal');
        void targetEnd.offsetWidth;
        targetEnd.classList.add('is-reveal');
    }
}

function setResultModalOpen(isOpen) {
    resultModal.classList.toggle('is-open', isOpen);
    resultModal.setAttribute('aria-hidden', String(!isOpen));
    if (isOpen) {
        const confetti = resultModal.querySelectorAll('.celebration span');
        confetti.forEach((piece) => {
            piece.style.animation = 'none';
        });
        void resultModal.offsetWidth;
        confetti.forEach((piece) => {
            piece.style.animation = '';
        });
    }
}

function openResultModal(menu) {
    resultName.textContent = menu.name;
    resultCategory.textContent = getCategoryLabel(menu.category);
    resultImage.src = buildMenuImage(menu);
    setResultModalOpen(true);
}

function setModalOpen(isOpen) {
    ladderModal.classList.toggle('is-open', isOpen);
    ladderModal.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (isOpen) {
        renderLadder();
    } else {
        stopLadderAnimation();
    }
}

function handleRecommend() {
    const menu = pickRandomMenu();
    updateHero(menu);
}

function setActiveCategory(button) {
    categoryButtons.querySelectorAll('.chip').forEach((btn) => {
        btn.classList.toggle('is-active', btn === button);
    });
    activeCategory = button.dataset.category;
    renderGrid();
    handleRecommend();
    if (ladderModal.classList.contains('is-open')) {
        renderLadder();
    }
}

recommendBtn.addEventListener('click', handleRecommend);
rerollBtn.addEventListener('click', handleRecommend);
saveBtn.addEventListener('click', () => {
    const current = menuTitle.textContent;
    const menu = menuData.find((item) => item.name === current);
    if (!menu) return;
    if (!savedMenus.some((item) => item.name === menu.name)) {
        savedMenus.unshift(menu);
        renderSaved();
    }
});
clearBtn.addEventListener('click', () => {
    savedMenus = [];
    renderSaved();
});
categoryButtons.addEventListener('click', (event) => {
    const button = event.target.closest('.chip');
    if (!button) return;
    setActiveCategory(button);
});

ladderOpenBtn.addEventListener('click', () => {
    setModalOpen(true);
});

ladderCloseBtn.addEventListener('click', () => {
    setModalOpen(false);
});

ladderModal.addEventListener('click', (event) => {
    if (event.target.dataset.close) {
        setModalOpen(false);
    }
});

resultModal.addEventListener('click', (event) => {
    if (event.target.dataset.close) {
        setResultModalOpen(false);
    }
});

resultCloseBtn.addEventListener('click', () => {
    setResultModalOpen(false);
});

partnerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    partnerStatus.textContent = '전송 중...';
    partnerStatus.classList.remove('is-error');
    const formData = new FormData(partnerForm);
    try {
        const response = await fetch(partnerForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                Accept: 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('submit failed');
        }
        partnerForm.reset();
        partnerStatus.textContent = '제휴 문의가 전송되었습니다. 감사합니다!';
    } catch (error) {
        partnerStatus.textContent = '전송에 실패했습니다. 잠시 후 다시 시도해 주세요.';
        partnerStatus.classList.add('is-error');
    }
});

ladderRerollBtn.addEventListener('click', () => {
    renderLadder();
});

ladderTop.addEventListener('click', (event) => {
    const button = event.target.closest('.ladder-start');
    if (!button || !ladderState) return;
    stopLadderAnimation();
    clearResultEffects();
    const index = Number(button.dataset.index);
    ladderState.activeIndex = index;
    ladderTop.querySelectorAll('.ladder-start').forEach((btn) => {
        btn.classList.toggle('is-active', btn === button);
        btn.disabled = true;
    });
    const resultIndex = ladderState.mapping[index];
    const resultMenu = ladderState.items[resultIndex];
    animateLadder(index, () => {
        if (!ladderState || ladderState.activeIndex !== index) return;
        ladderTop.querySelectorAll('.ladder-start').forEach((btn) => {
            btn.disabled = false;
        });
        revealResult(index, resultMenu, resultIndex);
        setTimeout(() => {
            openResultModal(resultMenu);
        }, 250);
    });
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && ladderModal.classList.contains('is-open')) {
        setModalOpen(false);
    }
    if (event.key === 'Escape' && resultModal.classList.contains('is-open')) {
        setResultModalOpen(false);
    }
});

window.addEventListener('resize', () => {
    if (ladderModal.classList.contains('is-open')) {
        if (!ladderAnimationId) {
            drawLadder(ladderState ? ladderState.activeIndex : null);
        }
    }
});

timeSlot.textContent = getTimeSlot();
renderGrid();
handleRecommend();
renderSaved();
