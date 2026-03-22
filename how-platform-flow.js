class HowPlatformFlow extends HTMLElement {
    connectedCallback() {
        if (this.shadowRoot) return;

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
            <style>
                :host {
                    display: block;
                    color: var(--text-main, #0f172a);
                    font-family: inherit;
                }
                *, *::before, *::after {
                    box-sizing: border-box;
                }
                svg {
                    display: block;
                    max-width: 100%;
                }
                .flow-card {
                    padding: 16px;
                    border-radius: var(--radius-xl, 32px);
                    background: rgba(255, 255, 255, 0.7);
                    border: 1px solid rgba(255, 255, 255, 0.72);
                    box-shadow: var(--shadow-sm, 0 8px 24px rgba(15, 23, 42, 0.04));
                    backdrop-filter: blur(16px);
                }
                .flow-container {
                    display: grid;
                    grid-template-columns: minmax(250px, 0.75fr) minmax(0, 1.25fr);
                    gap: 32px;
                    align-items: center;
                }
                .flow-demo {
                    position: relative;
                    padding: 0;
                    border-radius: calc(var(--radius-xl, 32px) - 6px);
                    overflow: visible;
                    background:
                        radial-gradient(circle at top right, rgba(96, 165, 250, 0.16), transparent 40%),
                        linear-gradient(200deg, rgba(15, 23, 42, 0.04), rgba(255, 255, 255, 0.6));
                    border: 1px solid rgba(37, 99, 235, 0.08);
                    width: 100%;
                    transform: scale(1.05);
                    transform-origin: left center;
                    z-index: 10;
                }
                .flow-demo::before {
                    content: "";
                    position: absolute;
                    inset: auto 10% -20% -10%;
                    height: 120px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(37, 99, 235, 0.12), transparent 70%);
                    filter: blur(20px);
                    pointer-events: none;
                }
                .flow-demo-svg {
                    width: 100%;
                    height: auto;
                    filter: drop-shadow(0 15px 30px rgba(15, 23, 42, 0.06));
                }
                .flow-steps {
                    display: grid;
                    gap: 8px;
                }
                .flow-step {
                    position: relative;
                    display: grid;
                    grid-template-columns: auto 1fr;
                    gap: 12px;
                    align-items: start;
                    padding: 12px 14px;
                    border-radius: 18px;
                    border: 1px solid rgba(15, 23, 42, 0.08);
                    background: rgba(255, 255, 255, 0.66);
                    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.65);
                    transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
                    opacity: 0.5;
                }
                .flow-step.is-active {
                    opacity: 1;
                    transform: translateX(-6px);
                    border-color: rgba(37, 99, 235, 0.25);
                    background: rgba(255, 255, 255, 1);
                    box-shadow: inset 0 1px 0 #fff, 0 12px 24px rgba(37, 99, 235, 0.08);
                }
                .step-dot {
                    width: 32px;
                    height: 32px;
                    border-radius: 10px;
                    display: grid;
                    place-items: center;
                    font-size: 13px;
                    font-weight: 800;
                    color: var(--accent, #2563eb);
                    background: rgba(37, 99, 235, 0.08);
                    border: 1px solid rgba(37, 99, 235, 0.12);
                    transition: all 0.4s ease;
                }
                .flow-step.is-active .step-dot {
                    background: #2563eb;
                    color: #ffffff;
                }
                .flow-step h4 {
                    margin: 0 0 4px;
                    font-size: 16px;
                    font-weight: 700;
                }
                .card-text {
                    margin: 0;
                    color: #526076;
                    font-size: 13px;
                    line-height: 1.4;
                    word-wrap: break-word;
                }

                /* SVG Анимации */
                .panel {
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
                    transform: translateY(16px) scale(0.98);
                }
                .panel.is-active {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
                .interactive-elem {
                    transition: all 0.2s ease;
                    transform-box: fill-box;
                    transform-origin: center;
                }
                .interactive-elem.is-pressed {
                    transform: scale(0.94);
                }
                /* Динамические заливки при клике */
                .interactive-elem.is-selected rect.bg-rect {
                    fill: rgba(37, 99, 235, 0.12) !important;
                    stroke: #2563EB;
                    stroke-width: 2px;
                }
                .ripple-circle {
                    opacity: 0;
                    transform-box: fill-box;
                    transform-origin: center;
                }
                .ripple-circle.is-animating {
                    animation: rippleBurst 0.6s ease-out forwards;
                }
                @keyframes rippleBurst {
                    0% { opacity: 0.8; transform: scale(0.2); stroke-width: 4px; }
                    100% { opacity: 0; transform: scale(2.5); stroke-width: 0px; }
                }
                #main-cursor {
                    transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
                }

                @media (prefers-reduced-motion: reduce) {
                    .flow-step,
                    .step-dot,
                    .panel,
                    .interactive-elem,
                    .ripple-circle,
                    #main-cursor {
                        transition: none !important;
                        animation: none !important;
                        transform: none !important;
                    }
                }

                @media (max-width: 900px) {
                    .flow-card,
                    .flow-step {
                        backdrop-filter: none;
                    }
                    .flow-container { grid-template-columns: 1fr; }
                    .flow-steps { 
                        grid-template-columns: repeat(2, minmax(0, 1fr)); 
                        order: 2;
                    }
                    .flow-demo { 
                        order: 1; 
                        margin-bottom: 24px; 
                        transform: scale(1); 
                        transform-origin: center center;
                        width: 100%;
                    }
                }
                @media (max-width: 820px) {
                    .flow-card { padding: 24px 20px; }
                    .flow-steps { grid-template-columns: 1fr; }
                }
            </style>

            <div class="flow-card">
                <div class="flow-container">
                    
                    <div class="flow-steps">
                        <div class="flow-step">
                            <div class="step-dot">01</div>
                            <div class="flow-step-copy">
                                <h4>Пройди профтест</h4>
                                <p class="card-text">Ответь на короткие вопросы, чтобы определить свои интересы и сильные стороны.</p>
                            </div>
                        </div>
                        <div class="flow-step">
                            <div class="step-dot">02</div>
                            <div class="flow-step-copy">
                                <h4>Сравни направления</h4>
                                <p class="card-text">Посмотри различия в проходных баллах, бюджетных местах и содержании программ.</p>
                            </div>
                        </div>
                        <div class="flow-step">
                            <div class="step-dot">03</div>
                            <div class="flow-step-copy">
                                <h4>Получи рекомендации</h4>
                                <p class="card-text">Платформа покажет близкие направления, которые ты мог не рассматривать.</p>
                            </div>
                        </div>
                        <div class="flow-step">
                            <div class="step-dot">04</div>
                            <div class="flow-step-copy">
                                <h4>Сохрани лучшие варианты</h4>
                                <p class="card-text">Добавь интересные направления в избранное и собери свой план поступления.</p>
                            </div>
                        </div>
                    </div>

                    <div class="flow-demo" aria-hidden="true">
                        <svg class="flow-demo-svg" viewBox="0 0 600 380" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="flowShell" x1="58" y1="48" x2="618" y2="374" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="white" stop-opacity="0.98" />
                                    <stop offset="1" stop-color="#E8F0FE" stop-opacity="0.96" />
                                </linearGradient>
                                <linearGradient id="flowButton" x1="0" y1="0" x2="1" y2="1">
                                    <stop stop-color="#2563EB" />
                                    <stop offset="1" stop-color="#60A5FA" />
                                </linearGradient>
                                <linearGradient id="flowCard" x1="0" y1="0" x2="1" y2="1">
                                    <stop stop-color="#0F172A" stop-opacity="0.96" />
                                    <stop offset="1" stop-color="#1E3A8A" stop-opacity="0.92" />
                                </linearGradient>
                            </defs>
                            
                            <rect x="0" y="0" width="600" height="380" rx="30" fill="url(#flowShell)" stroke="rgba(15,23,42,0.08)" stroke-width="2" />
                            <rect x="0" y="0" width="600" height="40" rx="30" fill="rgba(15,23,42,0.04)" />
                            <circle cx="30" cy="20" r="5" fill="rgba(15,23,42,0.18)" />
                            <circle cx="50" cy="20" r="5" fill="rgba(15,23,42,0.12)" />
                            <circle cx="70" cy="20" r="5" fill="rgba(15,23,42,0.12)" />

                            <g id="panel-1" class="panel">
                                <text x="300" y="80" text-anchor="middle" fill="#0F172A" font-size="20" font-weight="800">Профтест: Твои интересы</text>
                                
                                <!-- Realistic Test Widget Miniature -->
                                <g transform="translate(150, 110)">
                                    <rect x="0" y="0" width="300" height="170" rx="16" fill="white" stroke="rgba(15,23,42,0.08)" />
                                    <!-- Progress bar -->
                                    <rect x="20" y="20" width="260" height="4" rx="2" fill="rgba(15,23,42,0.06)" />
                                    <rect x="20" y="20" width="100" height="4" rx="2" fill="#2563EB" />
                                    <text x="280" y="15" text-anchor="end" fill="#526076" font-size="10" font-weight="700">1/3</text>
                                    
                                    <!-- Question text -->
                                    <text x="20" y="45" fill="#0F172A" font-size="15" font-weight="800" font-family="'ALS Sector', 'Outfit', sans-serif">Что тебе ближе?</text>
                                    
                                    <!-- Option 1 -->
                                    <g id="p1-opt1" class="interactive-elem" style="transform-origin: 150px 75px;">
                                        <rect class="bg-rect" x="20" y="60" width="260" height="36" rx="8" fill="rgba(15,23,42,0.03)" stroke="rgba(15,23,42,0.08)" />
                                        <circle cx="40" cy="78" r="6" fill="white" stroke="rgba(15,23,42,0.15)" stroke-width="2" />
                                        <text x="56" y="82" fill="#0F172A" font-size="12" font-weight="600">Аналитика и графики</text>
                                    </g>

                                    <!-- Option 2 -->
                                    <g id="p1-opt2" class="interactive-elem" style="transform-origin: 150px 120px;">
                                        <rect class="bg-rect" x="20" y="105" width="260" height="36" rx="8" fill="rgba(15,23,42,0.03)" stroke="rgba(15,23,42,0.08)" />
                                        <circle id="p1-check" cx="40" cy="123" r="6" fill="white" stroke="rgba(15,23,42,0.15)" stroke-width="2" />
                                        <text x="56" y="127" fill="#0F172A" font-size="12" font-weight="600">Код и архитектура</text>
                                    </g>
                                </g>
                                
                                <g id="p1-btn" class="interactive-elem" style="transform-origin: 300px 320px;">
                                    <rect class="bg-rect" x="230" y="300" width="140" height="42" rx="21" fill="url(#flowButton)" />
                                    <text x="300" y="326" text-anchor="middle" fill="white" font-size="14" font-weight="700">Ответить</text>
                                </g>
                            </g>

                            <g id="panel-2" class="panel">
                                <text x="300" y="80" text-anchor="middle" fill="#0F172A" font-size="20" font-weight="800">Сравнение направлений</text>

                                <!-- Realistic Compare Card 1 -->
                                <g id="p2-card1" class="interactive-elem" style="transform-origin: 170px 220px;">
                                    <rect class="bg-rect" x="40" y="110" width="250" height="210" rx="16" fill="white" stroke="rgba(15,23,42,0.08)" />
                                    <!-- Badge & Title -->
                                    <rect x="56" y="126" width="56" height="20" rx="10" fill="#002C5B" />
                                    <text x="84" y="140" text-anchor="middle" fill="white" font-size="10" font-weight="800">09.02.07/01</text>
                                    <text x="56" y="165" fill="#0F172A" font-size="13" font-weight="800">Инф. системы и прогр.</text>
                                    
                                    <!-- Mini Data Grid -->
                                    <rect x="56" y="180" width="105" height="42" rx="8" fill="rgba(37,99,235,0.08)" />
                                    <text x="66" y="196" fill="#2563EB" font-size="9" font-weight="700">Бюджет</text>
                                    <text x="66" y="212" fill="#002C5B" font-size="16" font-weight="800">25</text>

                                    <rect x="169" y="180" width="105" height="42" rx="8" fill="rgba(15,23,42,0.02)" />
                                    <text x="179" y="196" fill="#526076" font-size="9" font-weight="700">Платно</text>
                                    <text x="179" y="212" fill="#0F172A" font-size="16" font-weight="800">35</text>
                                    
                                    <!-- Mini Matrix/Chart -->
                                    <text x="56" y="240" fill="#0F172A" font-size="11" font-weight="700">Часы по блокам</text>
                                    <!-- Blue bar -->
                                    <rect x="56" y="250" width="218" height="6" rx="3" fill="rgba(15,23,42,0.05)" />
                                    <rect x="56" y="250" width="120" height="6" rx="3" fill="#2563EB" />
                                    <text x="56" y="270" fill="#526076" font-size="10" font-weight="600">Код</text>
                                    <!-- Pink bar -->
                                    <rect x="56" y="280" width="218" height="6" rx="3" fill="rgba(15,23,42,0.05)" />
                                    <rect x="56" y="280" width="80" height="6" rx="3" fill="#002C5B" />
                                    <text x="56" y="300" fill="#526076" font-size="10" font-weight="600">Математика</text>
                                </g>

                                <!-- Realistic Compare Card 2 -->
                                <g id="p2-card2" class="interactive-elem" style="transform-origin: 430px 220px;">
                                    <rect class="bg-rect" x="310" y="110" width="250" height="210" rx="16" fill="white" stroke="rgba(15,23,42,0.08)" />
                                    <!-- Badge & Title -->
                                    <rect x="326" y="126" width="56" height="20" rx="10" fill="#002C5B" />
                                    <text x="354" y="140" text-anchor="middle" fill="white" font-size="10" font-weight="800">09.02.06</text>
                                    <text x="326" y="165" fill="#0F172A" font-size="13" font-weight="800">Сетевое и системное адм.</text>
                                    
                                    <!-- Mini Data Grid -->
                                    <rect x="326" y="180" width="105" height="42" rx="8" fill="rgba(37,99,235,0.08)" />
                                    <text x="336" y="196" fill="#2563EB" font-size="9" font-weight="700">Бюджет</text>
                                    <text x="336" y="212" fill="#002C5B" font-size="16" font-weight="800">10</text>

                                    <rect x="439" y="180" width="105" height="42" rx="8" fill="rgba(15,23,42,0.02)" />
                                    <text x="449" y="196" fill="#526076" font-size="9" font-weight="700">Платно</text>
                                    <text x="449" y="212" fill="#0F172A" font-size="16" font-weight="800">10</text>
                                    
                                    <!-- Mini Matrix/Chart -->
                                    <text x="326" y="240" fill="#0F172A" font-size="11" font-weight="700">Часы по блокам</text>
                                    <!-- Blue bar -->
                                    <rect x="326" y="250" width="218" height="6" rx="3" fill="rgba(15,23,42,0.05)" />
                                    <rect x="326" y="250" width="170" height="6" rx="3" fill="#2563EB" />
                                    <text x="326" y="270" fill="#526076" font-size="10" font-weight="600">Код</text>
                                    <!-- Pink bar -->
                                    <rect x="326" y="280" width="218" height="6" rx="3" fill="rgba(15,23,42,0.05)" />
                                    <rect x="326" y="280" width="50" height="6" rx="3" fill="#002C5B" />
                                    <text x="326" y="300" fill="#526076" font-size="10" font-weight="600">Математика</text>
                                </g>
                            </g>

                            <g id="panel-3" class="panel">
                                <text x="300" y="80" text-anchor="middle" fill="#0F172A" font-size="20" font-weight="800">Подобранные направления</text>
                                <text x="300" y="105" text-anchor="middle" fill="#526076" font-size="13">Ваш персональный топ</text>

                                <!-- Recommended Item 1 -->
                                <g id="p3-rec1" class="interactive-elem" style="transform-origin: 300px 155px;">
                                    <rect class="bg-rect" x="90" y="130" width="420" height="56" rx="14" fill="white" stroke="rgba(37,99,235,0.4)" stroke-width="2" />
                                    <circle cx="125" cy="158" r="14" fill="rgba(37,99,235,0.1)" />
                                    <path d="M120 158 l4 4 l6 -8" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" />
                                    <text x="150" y="153" fill="#0F172A" font-size="14" font-weight="800">Системы радиосвязи</text>
                                    <text x="150" y="170" fill="#526076" font-size="11" font-weight="600">ТСР, мобильная связь, телерадио</text>
                                    
                                    <!-- Percentage -->
                                    <rect x="430" y="145" width="50" height="26" rx="8" fill="#dcfce7" />
                                    <text x="455" y="162" text-anchor="middle" fill="#166534" font-size="12" font-weight="800">95%</text>
                                </g>

                                <!-- Recommended Item 2 -->
                                <g id="p3-rec2" class="interactive-elem" style="transform-origin: 300px 225px;">
                                    <rect class="bg-rect" x="90" y="200" width="420" height="56" rx="14" fill="white" stroke="rgba(15,23,42,0.06)" />
                                    <circle cx="125" cy="228" r="14" fill="rgba(15,23,42,0.04)" />
                                    <circle cx="125" cy="228" r="4" fill="#526076" />
                                    <text x="150" y="223" fill="#0F172A" font-size="14" font-weight="800">Сетевое и системное адм.</text>
                                    <text x="150" y="240" fill="#526076" font-size="11" font-weight="600">Сети, Linux, инфраструктура</text>
                                    
                                    <!-- Percentage -->
                                    <rect x="430" y="215" width="50" height="26" rx="8" fill="#fef08a" />
                                    <text x="455" y="232" text-anchor="middle" fill="#854d0e" font-size="12" font-weight="800">82%</text>
                                </g>

                                <!-- Recommended Item 3 -->
                                <g id="p3-rec3" class="interactive-elem" style="transform-origin: 300px 295px;">
                                    <rect class="bg-rect" x="90" y="270" width="420" height="56" rx="14" fill="white" stroke="rgba(15,23,42,0.06)" />
                                    <circle cx="125" cy="298" r="14" fill="rgba(15,23,42,0.04)" />
                                    <circle cx="125" cy="298" r="4" fill="#526076" />
                                    <text x="150" y="293" fill="#0F172A" font-size="14" font-weight="800">Разработка электронных устр.</text>
                                    <text x="150" y="310" fill="#526076" font-size="11" font-weight="600">embedded, схемотехника, отладка</text>
                                    
                                    <!-- Percentage -->
                                    <rect x="430" y="285" width="50" height="26" rx="8" fill="#f3f4f6" />
                                    <text x="455" y="302" text-anchor="middle" fill="#4b5563" font-size="12" font-weight="800">76%</text>
                                </g>
                            </g>

                            <g id="panel-4" class="panel">
                                <text x="300" y="90" text-anchor="middle" fill="#0F172A" font-size="20" font-weight="800">Финальный выбор</text>
                                <text x="300" y="115" text-anchor="middle" fill="#526076" font-size="13">Твои сохранённые варианты</text>

                                <!-- Hero Card -->
                                <g id="p4-final" class="interactive-elem" style="transform-origin: 300px 200px;">
                                    <!-- Deep blue premium background -->
                                    <rect class="bg-rect" x="120" y="140" width="360" height="150" rx="20" fill="url(#flowCard)" />
                                    
                                    <rect x="260" y="160" width="80" height="24" rx="12" fill="rgba(255,255,255,0.15)" />
                                    <text x="300" y="176" text-anchor="middle" fill="white" font-size="10" font-weight="800">Избранное</text>
                                    
                                    <text x="300" y="215" text-anchor="middle" fill="white" font-size="24" font-weight="800" font-family="'ALS Sector', 'Outfit', sans-serif">11.02.18</text>
                                    <text x="300" y="245" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="13" font-weight="600">ТСР</text>
                                    
                                    <!-- Little star / heart icon -->
                                    <path d="M140 160 L145 160 L145 165 Z" fill="#60A5FA" />
                                    <circle cx="450" cy="270" r="2" fill="white" opacity="0.4" />
                                    <circle cx="150" cy="250" r="3" fill="white" opacity="0.2" />
                                </g>

                                <g id="p4-btn" class="interactive-elem" style="transform-origin: 300px 330px;">
                                    <rect class="bg-rect" x="200" y="310" width="200" height="46" rx="23" fill="#2563EB" />
                                    <text x="300" y="338" text-anchor="middle" fill="white" font-size="14" font-weight="800">Перейти к поступлению</text>
                                </g>
                            </g>

                            <circle id="master-ripple" class="ripple-circle" cx="0" cy="0" r="24" fill="none" stroke="#2563EB" />
                            <g id="main-cursor" transform="translate(340, 450)">
                                <path d="M0 0L0 28L7 21L13 36L19 33L13 18L24 18L0 0Z" fill="white" stroke="#0F172A" stroke-width="2.2" />
                            </g>
                        </svg>
                    </div>

                </div>
            </div>
        `;

        this.isPlaying = true;

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.runTimeline();
                    this.observer.disconnect();
                }
            });
        }, { threshold: 0.1 });

        this.observer.observe(this);
    }

    disconnectedCallback() {
        this.isPlaying = false;
    }

    async runTimeline() {
        const root = this.shadowRoot;
        const cursor = root.querySelector('#main-cursor');
        const ripple = root.querySelector('#master-ripple');
        const panels = root.querySelectorAll('.panel');
        const steps = root.querySelectorAll('.flow-step');

        const sleep = ms => new Promise(res => setTimeout(res, ms));

        const moveCursor = async (x, y) => {
            cursor.style.transform = `translate(${x}px, ${y}px)`;
            await sleep(650); // Чуть ускорил перемещение
        };

        const clickCursor = async (x, y, { ripple: withRipple = true } = {}) => {
            cursor.style.transform = `translate(${x}px, ${y}px) scale(0.85)`;
            await sleep(150);

            if (withRipple) {
                ripple.setAttribute('transform', `translate(${x}, ${y})`);
                ripple.classList.remove('is-animating');
                void ripple.offsetWidth;
                ripple.classList.add('is-animating');
            }

            cursor.style.transform = `translate(${x}px, ${y}px) scale(1)`;
            await sleep(150);
        };

        const setStage = (index) => {
            panels.forEach((p, i) => p.classList.toggle('is-active', i === index));
            steps.forEach((s, i) => s.classList.toggle('is-active', i === index));
        };

        while (this.isPlaying) {
            cursor.style.transition = 'none';
            cursor.style.transform = `translate(300px, 420px)`;
            await sleep(50);
            cursor.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease';

            // === ШАГ 1: ПРОФТЕСТ ===
            setStage(0);
            await sleep(400);

            // Клик на вариант 2 (Код и архитектура)
            await moveCursor(300, 233);
            await clickCursor(300, 233, { ripple: false });
            const p1Opt2 = root.querySelector('#p1-opt2');
            const p1Check = root.querySelector('#p1-check');
            if (p1Opt2 && p1Check) {
                p1Opt2.classList.add('is-pressed', 'is-selected');
                p1Check.setAttribute('fill', '#2563EB');
                p1Check.setAttribute('stroke', '#2563EB');
                await sleep(200);
                p1Opt2.classList.remove('is-pressed');
            }
            await sleep(300);

            // Клик на кнопку "Ответить"
            await moveCursor(300, 321);
            await clickCursor(300, 321);
            const p1Btn = root.querySelector('#p1-btn');
            if (p1Btn) {
                p1Btn.classList.add('is-pressed');
                await sleep(200);
                p1Btn.classList.remove('is-pressed');
            }

            // Сброс состояния шага 1 для следующего цикла
            setTimeout(() => {
                if (p1Opt2 && p1Check) {
                    p1Opt2.classList.remove('is-selected');
                    p1Check.setAttribute('fill', 'white');
                    p1Check.setAttribute('stroke', 'rgba(15,23,42,0.15)');
                }
            }, 500);

            // === ШАГ 2: СРАВНЕНИЕ ===
            setStage(1);
            await sleep(500);

            // Клик на карточку "ФИИТ"
            await moveCursor(165, 215);
            await clickCursor(165, 215);
            const p2Card1 = root.querySelector('#p2-card1');
            if (p2Card1) {
                p2Card1.classList.add('is-pressed', 'is-selected');
                await sleep(250);
                p2Card1.classList.remove('is-pressed');
                await sleep(600);
                p2Card1.classList.remove('is-selected');
            }

            // === ШАГ 3: РЕКОМЕНДАЦИИ ===
            setStage(2);
            await sleep(500);

            // Клик на первую рекомендацию
            await moveCursor(300, 158);
            await clickCursor(300, 158);
            const p3Rec1 = root.querySelector('#p3-rec1');
            if (p3Rec1) {
                p3Rec1.classList.add('is-pressed', 'is-selected');
                await sleep(250);
                p3Rec1.classList.remove('is-pressed');
                await sleep(600);
                p3Rec1.classList.remove('is-selected');
            }

            // === ШАГ 4: ФИНАЛЬНЫЙ ВЫБОР ===
            setStage(3);
            await sleep(500);

            // Клик на кнопку "Перейти к поступлению"
            await moveCursor(300, 333);
            await clickCursor(300, 333);
            const p4Btn = root.querySelector('#p4-btn');
            if (p4Btn) {
                p4Btn.classList.add('is-pressed');
                await sleep(200);
                p4Btn.classList.remove('is-pressed');
            }

            // Пауза перед рестартом
            await sleep(2500);

            cursor.style.opacity = '0';
            await sleep(500);
            cursor.style.opacity = '1';
        }
    }
}

if (!customElements.get('how-platform-flow')) {
    customElements.define('how-platform-flow', HowPlatformFlow);
}
