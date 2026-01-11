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

let activeCategory = 'all';
let savedMenus = [];

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

timeSlot.textContent = getTimeSlot();
renderGrid();
handleRecommend();
renderSaved();
