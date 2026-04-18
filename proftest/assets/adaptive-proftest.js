(function () {
    const STORAGE_KEY = 'proxima_proftest_v6';
    const TOTAL_STEPS = 7;
    const COMPARE_STORAGE_KEY = 'nps-compare-programs';

    const categories = [
        { key: 'automation', block: 'Автоматизация, мехатроника и робототехника', short: 'Автоматизация' },
        { key: 'design', block: 'Дизайн и художественно-проектный блок', short: 'Дизайн' },
        { key: 'math', block: 'Математика и аналитическая база', short: 'Математика' },
        { key: 'engineering', block: 'Общая инженерная подготовка', short: 'Инженерия' },
        { key: 'general', block: 'Общеобразовательная база', short: 'Общая база' },
        { key: 'practice', block: 'Практика, производственные модули и выпуск', short: 'Практика' },
        { key: 'software', block: 'Программирование и разработка ПО', short: 'ПО' },
        { key: 'telecom', block: 'Связь, радиосистемы и телеком', short: 'Связь' },
        { key: 'infrastructure', block: 'Системы, сети, БД и информационная безопасность', short: 'Инфраструктура' },
        { key: 'management', block: 'Управление, экономика, право и качество', short: 'Управление' },
        { key: 'electronics', block: 'Электроника, схемотехника и встраиваемые системы', short: 'Электроника' },
        { key: 'humanities', block: 'Языки и гуманитарный контекст', short: 'Языки' }
    ];

    const blockToKey = Object.fromEntries(categories.map((category) => [category.block, category.key]));

    const themeOrder = ['software', 'infrastructure', 'electronics', 'automation', 'telecom', 'design'];
    const themeCatalog = {
        software: {
            key: 'software',
            label: 'Создание цифровых продуктов',
            short: 'Цифровые продукты',
            note: 'Код, интерфейсы, логика сервиса, данные и то, как цифровой продукт работает целиком.',
            seedEffects: { software: 6, math: 2, practice: 1, infrastructure: 1, management: 1 },
            tracks: [
                {
                    key: 'software-product',
                    headline: 'Продуктовая разработка',
                    directionLabel: 'Программная инженерия',
                    categoryEffects: { software: 8, math: 2, practice: 1, management: 1 },
                    keywords: ['программ', 'разработ', 'прилож', 'сервис', 'интерфейс', 'модул', 'web'],
                    prompts: {
                        deepen: {
                            label: 'Собирать приложение, интерфейс и логику цифрового продукта.',
                            note: 'Ближе создавать новое поведение сервиса, чем держать только инфраструктурный контур.'
                        },
                        practice: {
                            label: 'Работать в продуктовой команде, где запускают новые функции и сценарии.',
                            note: 'Живее среда, где постоянно появляется новый функционал и его нужно доводить до рабочего состояния.'
                        },
                        semester: {
                            label: 'Несколько семестров держать интерес на программировании, архитектуре и разработке модулей.',
                            note: 'Это тот учебный блок, который не хочется бросить после первой сложности.'
                        },
                        project: {
                            label: 'Защищать сервис, приложение или цифровой инструмент, который реально можно показать.',
                            note: 'Итогом хочется видеть законченный цифровой продукт, а не только внутреннюю настройку.'
                        }
                    }
                },
                {
                    key: 'software-data',
                    headline: 'Системная логика и данные',
                    directionLabel: 'Разработка и данные',
                    categoryEffects: { software: 5, infrastructure: 2, math: 3, management: 1, practice: 1 },
                    keywords: ['данн', 'баз', 'sql', 'запрос', 'систем', 'сервер', 'алгорит'],
                    prompts: {
                        deepen: {
                            label: 'Разбираться в структуре данных, системной логике и backend-контуре.',
                            note: 'Ближе смысловая и архитектурная часть системы, чем внешний слой интерфейса.'
                        },
                        practice: {
                            label: 'Работать там, где нужно продумывать данные, связи и внутреннюю логику системы.',
                            note: 'Интереснее собирать устойчивую внутреннюю структуру, чем только внешний пользовательский слой.'
                        },
                        semester: {
                            label: 'Держать интерес на базах данных, системном программировании и математической базе.',
                            note: 'Длинная учебная траектория здесь держится на логике, связях и точности.'
                        },
                        project: {
                            label: 'Защищать систему с продуманной логикой, данными и внутренними связями.',
                            note: 'Итог ценен, когда видно, как всё собрано под капотом.'
                        }
                    }
                }
            ]
        },
        infrastructure: {
            key: 'infrastructure',
            label: 'Системная среда и администрирование',
            short: 'Инфраструктура',
            note: 'Сети, серверы, доступы, стабильность среды, вычислительные комплексы и поддержка работы систем.',
            seedEffects: { infrastructure: 6, practice: 2, software: 2, management: 1, general: 1 },
            tracks: [
                {
                    key: 'infra-admin',
                    headline: 'Сетевое и системное администрирование',
                    directionLabel: 'ИТ-инфраструктура',
                    categoryEffects: { infrastructure: 8, practice: 2, software: 1, management: 1, humanities: 1 },
                    keywords: ['сет', 'сервер', 'администр', 'безопас', 'доступ', 'операцион', 'инфраструкт'],
                    prompts: {
                        deepen: {
                            label: 'Держать рабочую среду: сети, серверы, доступы и стабильность сервисов.',
                            note: 'Ближе поддерживать устойчивую ИТ-среду, чем писать основной продуктовый код.'
                        },
                        practice: {
                            label: 'Работать в ИТ-отделе, серверной или системной команде, где всё должно держаться стабильно.',
                            note: 'Нравится среда, где отвечаешь за надёжность и доступность, а не за одну отдельную функцию.'
                        },
                        semester: {
                            label: 'Несколько семестров держать интерес на сетях, администрировании и защите среды.',
                            note: 'Этот учебный ритм кажется живым, потому что он про устойчивость и реальную эксплуатацию.'
                        },
                        project: {
                            label: 'Защищать инфраструктурный контур, сетевую схему или рабочую системную среду.',
                            note: 'Итоговая работа ценна, когда из неё видно, что всё настроено и реально работает.'
                        }
                    }
                },
                {
                    key: 'infra-complexes',
                    headline: 'Компьютерные системы и комплексы',
                    directionLabel: 'Компьютерные системы',
                    categoryEffects: { infrastructure: 6, engineering: 2, electronics: 1, practice: 2, management: 1 },
                    keywords: ['компьютерн', 'комплекс', 'вычисл', 'аппарат', 'систем', 'обслужив'],
                    prompts: {
                        deepen: {
                            label: 'Собирать вычислительную среду как систему: оборудование, конфигурацию и её работу в целом.',
                            note: 'Ближе не только сеть, а весь вычислительный контур и то, как его поддерживать.'
                        },
                        practice: {
                            label: 'Работать там, где нужно собирать, настраивать и держать в строю компьютерные комплексы.',
                            note: 'Интереснее возиться с целой системой и её конфигурацией, чем только с кодом или одним устройством.'
                        },
                        semester: {
                            label: 'Держать интерес на вычислительных системах, обслуживании комплексов и инженерной базе.',
                            note: 'Эта траектория держится на понимании техники как единой рабочей среды.'
                        },
                        project: {
                            label: 'Защищать проект по вычислительной системе, комплексу или инженерной конфигурации.',
                            note: 'Хочется показывать не отдельный кусок, а работающую собранную систему.'
                        }
                    }
                }
            ]
        },
        electronics: {
            key: 'electronics',
            label: 'Электроника и устройства',
            short: 'Электроника',
            note: 'Схемы, модули, embedded-логика, пайка, измерения, диагностика и аппаратная часть.',
            seedEffects: { electronics: 6, engineering: 2, practice: 2, math: 1, general: 1 },
            tracks: [
                {
                    key: 'electronics-dev',
                    headline: 'Электронные устройства и embedded',
                    directionLabel: 'Электроника и embedded',
                    categoryEffects: { electronics: 8, engineering: 2, math: 1, practice: 1 },
                    keywords: ['электрон', 'схем', 'микроконтрол', 'встраив', 'устрой', 'модул', 'измер'],
                    prompts: {
                        deepen: {
                            label: 'Проектировать электронный модуль, схему или встраиваемое устройство.',
                            note: 'Ближе именно разработка и логика устройства, чем последующее обслуживание готовой техники.'
                        },
                        practice: {
                            label: 'Работать в лаборатории, рядом с платами, макетами, измерениями и сборкой.',
                            note: 'Живее среда, где можно руками проверять железо и видеть результат сразу.'
                        },
                        semester: {
                            label: 'Несколько семестров держать интерес на схемотехнике, электронике и embedded-модулях.',
                            note: 'Это похоже не на разовый интерес, а на длинную учебную траекторию.'
                        },
                        project: {
                            label: 'Защищать электронное устройство или встраиваемую систему, которую можно включить и проверить.',
                            note: 'Итог хочется видеть как реальный рабочий модуль.'
                        }
                    }
                },
                {
                    key: 'electronics-service',
                    headline: 'Диагностика и обслуживание электроники',
                    directionLabel: 'Техническое обслуживание электроники',
                    categoryEffects: { electronics: 6, practice: 3, engineering: 1, management: 1, general: 1 },
                    keywords: ['ремонт', 'обслужив', 'монтаж', 'диагност', 'прибор', 'налад', 'технич'],
                    prompts: {
                        deepen: {
                            label: 'Находить неисправность, диагностировать и возвращать электронную технику в рабочее состояние.',
                            note: 'Ближе обслуживание и оживление устройств, чем разработка с нуля.'
                        },
                        practice: {
                            label: 'Работать в сервисной, монтажной или диагностической среде, где техника должна быстро вернуться в строй.',
                            note: 'Интереснее разбираться, что пошло не так, и доводить устройство до рабочего состояния.'
                        },
                        semester: {
                            label: 'Держать интерес на диагностике, наладке, монтаже и практических электронных модулях.',
                            note: 'Учебная мотивация здесь держится на понятной работе руками и видимом результате.'
                        },
                        project: {
                            label: 'Защищать проект по диагностике, ремонту или техническому обслуживанию электронного узла.',
                            note: 'Итог ценен, когда можно показать, как техника снова заработала.'
                        }
                    }
                }
            ]
        },
        automation: {
            key: 'automation',
            label: 'Автоматизация и мехатронные системы',
            short: 'Автоматизация',
            note: 'Процессы, датчики, ПЛК, приводы, мехатроника, роботы и связка железа с управлением.',
            seedEffects: { automation: 6, practice: 2, electronics: 1, engineering: 1, math: 1, management: 1 },
            tracks: [
                {
                    key: 'automation-control',
                    headline: 'Автоматизация процессов',
                    directionLabel: 'Автоматизация процессов',
                    categoryEffects: { automation: 8, practice: 2, electronics: 1, math: 1, management: 1 },
                    keywords: ['автомат', 'управлен', 'плк', 'датчик', 'процесс', 'контрол', 'линия'],
                    prompts: {
                        deepen: {
                            label: 'Настраивать логику процесса: датчики, ПЛК, контроллеры и управление.',
                            note: 'Ближе устойчивый технологический процесс, чем одно отдельное устройство.'
                        },
                        practice: {
                            label: 'Работать рядом с участком автоматизации или производственной линией, где всё держится на логике управления.',
                            note: 'Живее среда, где нужно увязать датчики, процесс и рабочий результат.'
                        },
                        semester: {
                            label: 'Несколько семестров держать интерес на автоматике, ПЛК, датчиках и логике процессов.',
                            note: 'Это тот учебный контур, который хочется тянуть не на усилии, а с интересом.'
                        },
                        project: {
                            label: 'Защищать систему автоматизации процесса или стенд управления.',
                            note: 'Итог ценен, когда видно, как логика реально управляет процессом.'
                        }
                    }
                },
                {
                    key: 'automation-robotics',
                    headline: 'Мехатроника и робототехника',
                    directionLabel: 'Мехатроника и робототехника',
                    categoryEffects: { automation: 6, electronics: 2, engineering: 2, practice: 2, math: 1 },
                    keywords: ['мехатрон', 'робот', 'привод', 'манипулятор', 'узел', 'движен'],
                    prompts: {
                        deepen: {
                            label: 'Собирать мехатронный узел, приводную систему или роботизированный модуль.',
                            note: 'Ближе то, что двигается и взаимодействует, чем только логика процесса без физического узла.'
                        },
                        practice: {
                            label: 'Работать там, где есть приводы, мехатронные узлы, роботы и движение.',
                            note: 'Интереснее связка механики, электроники и управления в одном объекте.'
                        },
                        semester: {
                            label: 'Держать интерес на мехатронике, приводах, робототехнических системах и практике по узлам.',
                            note: 'Учёба держится на том, что видно движение, сборку и управление сразу.'
                        },
                        project: {
                            label: 'Защищать роботизированный или мехатронный стенд с реальным движением.',
                            note: 'Итог хочется показывать как физический управляемый объект.'
                        }
                    }
                }
            ]
        },
        telecom: {
            key: 'telecom',
            label: 'Связь и телеком',
            short: 'Связь',
            note: 'Каналы связи, радиосистемы, телеком-оборудование, передача сигнала и инфраструктура связи.',
            seedEffects: { telecom: 6, infrastructure: 2, electronics: 1, math: 1, practice: 1 },
            tracks: [
                {
                    key: 'telecom-signal',
                    headline: 'Радиосистемы и передача сигнала',
                    directionLabel: 'Связь и радиосистемы',
                    categoryEffects: { telecom: 8, math: 1, electronics: 1, practice: 1 },
                    keywords: ['радио', 'связ', 'сигнал', 'антенн', 'частот', 'телеради', 'канал'],
                    prompts: {
                        deepen: {
                            label: 'Разбираться в сигнале, радиоканале и качестве передачи.',
                            note: 'Ближе сама природа связи и канала, чем общая ИТ-инфраструктура.'
                        },
                        practice: {
                            label: 'Работать в среде, где важны радиосистемы, сигнал и качество передачи.',
                            note: 'Интереснее мир связи как отдельной технической системы.'
                        },
                        semester: {
                            label: 'Держать интерес на телекоме, радиосистемах, каналах связи и предметах про сигнал.',
                            note: 'Учебный ритм здесь строится на понимании самой среды передачи.'
                        },
                        project: {
                            label: 'Защищать схему связи, радиосистему или контур передачи сигнала.',
                            note: 'Итог хочется видеть как рабочую систему передачи.'
                        }
                    }
                },
                {
                    key: 'telecom-network',
                    headline: 'Телеком-инфраструктура',
                    directionLabel: 'Телеком-инфраструктура',
                    categoryEffects: { telecom: 6, infrastructure: 3, practice: 1, electronics: 1, management: 1 },
                    keywords: ['телеком', 'оборудован', 'линия', 'коммутац', 'канал', 'инфраструктур', 'мобильн'],
                    prompts: {
                        deepen: {
                            label: 'Собирать и поддерживать оборудование связи, каналы и инфраструктурный контур.',
                            note: 'Ближе системная сторона связи и оборудования, чем чистая физика сигнала.'
                        },
                        practice: {
                            label: 'Работать там, где поднимают оборудование связи, каналы и сетевую телеком-среду.',
                            note: 'Интереснее собирать рабочий телеком-контур, чем разбирать отдельный теоретический сигнал.'
                        },
                        semester: {
                            label: 'Держать интерес на оборудовании связи, телеком-инфраструктуре и практике по каналам.',
                            note: 'Эта траектория держится на связке техники, среды и эксплуатации.'
                        },
                        project: {
                            label: 'Защищать инфраструктурный телеком-контур или схему связи с оборудованием.',
                            note: 'Итог важен как собранная рабочая среда связи.'
                        }
                    }
                }
            ]
        },
        design: {
            key: 'design',
            label: 'Дизайн и проектная среда',
            short: 'Дизайн',
            note: 'Композиция, визуальная подача, среда, объект, материалы и проектное мышление.',
            seedEffects: { design: 6, humanities: 3, practice: 1, management: 1, general: 1 },
            tracks: [
                {
                    key: 'design-visual',
                    headline: 'Визуальный дизайн',
                    directionLabel: 'Дизайн и проектирование',
                    categoryEffects: { design: 8, humanities: 2, management: 1, practice: 1 },
                    keywords: ['дизайн', 'график', 'компози', 'визуал', 'интерфейс', 'айдентик'],
                    prompts: {
                        deepen: {
                            label: 'Собирать визуальную систему, образ проекта и выразительную подачу.',
                            note: 'Ближе язык формы и визуальная логика, чем тяжёлый технический контур.'
                        },
                        practice: {
                            label: 'Работать в студии или проектной группе, где много визуальных задач и подачи.',
                            note: 'Живее среда, где нужно придумывать образ и объяснять его людям.'
                        },
                        semester: {
                            label: 'Несколько семестров держать интерес на композиции, графике, подаче и гуманитарном контексте.',
                            note: 'Это тот учебный блок, который ощущается живым надолго.'
                        },
                        project: {
                            label: 'Защищать визуальный проект, концепт или систему подачи как свою работу.',
                            note: 'Итог хочется видеть как цельную визуальную историю.'
                        }
                    }
                },
                {
                    key: 'design-space',
                    headline: 'Среда и предметные решения',
                    directionLabel: 'Проектная среда',
                    categoryEffects: { design: 6, practice: 2, humanities: 2, management: 1, engineering: 1 },
                    keywords: ['сред', 'предмет', 'материал', 'простран', 'проектир', 'объект'],
                    prompts: {
                        deepen: {
                            label: 'Проектировать среду, предметное решение и то, как человек с ним взаимодействует.',
                            note: 'Ближе объект, пространство и сценарий использования, чем только визуальная графика.'
                        },
                        practice: {
                            label: 'Работать в проектной среде, где важны форма, материал и реальное использование.',
                            note: 'Интереснее дизайн, который живёт в вещи или пространстве, а не только в картинке.'
                        },
                        semester: {
                            label: 'Держать интерес на проектировании среды, материалах, практике и объяснении решения.',
                            note: 'Учёба здесь держится на связке формы, функции и пользовательского опыта.'
                        },
                        project: {
                            label: 'Защищать предметно-пространственный или средовой проект как законченную концепцию.',
                            note: 'Итог хочется показывать через форму, задачу и опыт взаимодействия.'
                        }
                    }
                }
            ]
        }
    };

    const allTracks = themeOrder.flatMap((themeKey) => {
        return themeCatalog[themeKey].tracks.map((track) => ({
            ...track,
            themeKey,
            themeLabel: themeCatalog[themeKey].label,
            themeShort: themeCatalog[themeKey].short
        }));
    });

    const trackMap = Object.fromEntries(allTracks.map((track) => [track.key, track]));
    const themeBoostTemplate = Object.fromEntries(themeOrder.map((themeKey) => [themeKey, 0]));
    const trackBoostTemplate = Object.fromEntries(allTracks.map((track) => [track.key, 0]));

    const state = {
        current: 0,
        answers: new Array(TOTAL_STEPS).fill(null),
        programs: []
    };

    const categoryStrip = document.getElementById('category-strip');
    const progressFill = document.getElementById('progress-fill');
    const questionKicker = document.getElementById('question-kicker');
    const questionCount = document.getElementById('question-count');
    const questionTitle = document.getElementById('question-title');
    const questionDescription = document.getElementById('question-description');
    const optionsRoot = document.getElementById('options');
    const backButton = document.getElementById('back-btn');
    const nextButton = document.getElementById('next-btn');
    const statusBox = document.getElementById('status');
    const testGrid = document.getElementById('test-grid');
    const testSurface = document.getElementById('test-surface');
    const resultRoot = document.getElementById('result');

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function normalizeText(value) {
        return String(value || '').toLowerCase().replace(/ё/g, 'е');
    }

    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    function emptyCategoryScore() {
        return Object.fromEntries(categories.map((category) => [category.key, 0]));
    }

    function emptyThemeBoosts() {
        return { ...themeBoostTemplate };
    }

    function emptyTrackBoosts() {
        return { ...trackBoostTemplate };
    }

    function addNumericEffects(target, effects, multiplier = 1) {
        Object.entries(effects || {}).forEach(([key, value]) => {
            target[key] = (target[key] || 0) + (value * multiplier);
        });
    }

    function scaleEffects(effects, multiplier) {
        return Object.fromEntries(
            Object.entries(effects || {}).map(([key, value]) => [key, value * multiplier])
        );
    }

    function normalizeScore(score) {
        const total = Object.values(score).reduce((sum, value) => sum + value, 0) || 1;
        return Object.fromEntries(
            categories.map((category) => [
                category.key,
                Math.round(((score[category.key] || 0) / total) * 1000) / 10
            ])
        );
    }

    function overlapProfiles(left, right) {
        return Math.round(categories.reduce((sum, category) => {
            return sum + Math.min(left[category.key] || 0, right[category.key] || 0);
        }, 0));
    }

    function formatList(items) {
        if (!items.length) {
            return '';
        }
        if (items.length === 1) {
            return items[0];
        }
        if (items.length === 2) {
            return `${items[0]} и ${items[1]}`;
        }
        return `${items.slice(0, -1).join(', ')} и ${items[items.length - 1]}`;
    }

    function toArray(value) {
        return Array.isArray(value) ? value : [];
    }

    function getSubjectHours(subject) {
        return Number(
            subject['количество_часов']
            ?? subject['количество_часов_у_предмета']
            ?? subject.hours
            ?? 0
        ) || 0;
    }

    function getSubjectName(subject) {
        return String(
            subject['название_предмета']
            ?? subject.name
            ?? ''
        ).trim();
    }

    function getSubjectBlock(subject, fallbackBlock = '') {
        return String(
            subject['блок']
            ?? subject['блок_предмета']
            ?? subject.block
            ?? fallbackBlock
            ?? ''
        ).trim();
    }

    function getProgramSubjects(program) {
        const direct = toArray(program['предметы']);
        if (direct.length) {
            return direct;
        }

        const blockGroups = toArray(program['блоки_предметов']);
        if (!blockGroups.length) {
            return [];
        }

        return blockGroups.flatMap((group) => {
            const fallbackBlock = String(group['название'] || group.name || '').trim();
            return toArray(group['предметы']).map((subject) => ({
                ...subject,
                блок: getSubjectBlock(subject, fallbackBlock)
            }));
        });
    }

    function getTheme(themeKey) {
        return themeCatalog[themeKey] || null;
    }

    function getTrack(trackKey) {
        return trackMap[trackKey] || null;
    }

    function getPrimaryThemeKey() {
        return state.answers[0]?.themeKey || null;
    }

    function getSecondaryThemeKey() {
        return state.answers[1]?.themeKey || null;
    }

    function getPrimaryTrackKey() {
        return state.answers[2]?.trackKey || null;
    }

    function getSecondaryTrackKey() {
        return state.answers[3]?.trackKey || null;
    }

    function getTrackProfile(track) {
        return normalizeScore(track.categoryEffects || {});
    }

    function getThemeTrackBoosts(themeKey, value) {
        const theme = getTheme(themeKey);
        if (!theme) {
            return {};
        }
        return Object.fromEntries(theme.tracks.map((track) => [track.key, value]));
    }

    function buildSnapshot() {
        const categoryScore = emptyCategoryScore();
        const themeBoosts = emptyThemeBoosts();
        const trackBoosts = emptyTrackBoosts();

        state.answers.forEach((answer) => {
            if (!answer) {
                return;
            }
            addNumericEffects(categoryScore, answer.categoryEffects);
            addNumericEffects(themeBoosts, answer.themeBoosts);
            addNumericEffects(trackBoosts, answer.trackBoosts);
        });

        return {
            profile: normalizeScore(categoryScore),
            categoryScore,
            themeBoosts,
            trackBoosts
        };
    }

    function rankTracks(snapshot = buildSnapshot()) {
        return allTracks
            .map((track) => {
                const trackProfile = getTrackProfile(track);
                const overlap = overlapProfiles(snapshot.profile, trackProfile);
                const directBoost = (snapshot.trackBoosts[track.key] || 0) * 16;
                const themeBoost = (snapshot.themeBoosts[track.themeKey] || 0) * 10;
                const score = overlap + directBoost + themeBoost;

                return {
                    track,
                    trackProfile,
                    overlap,
                    score
                };
            })
            .sort((left, right) => {
                if (right.score !== left.score) {
                    return right.score - left.score;
                }
                return right.overlap - left.overlap;
            });
    }

    function getCandidateTracks(limit = 4, snapshot = buildSnapshot()) {
        const ranking = rankTracks(snapshot);
        const picks = [];
        const themeCounts = {};

        ranking.forEach((item) => {
            if (picks.length >= limit) {
                return;
            }

            const count = themeCounts[item.track.themeKey] || 0;
            if (count >= 2) {
                return;
            }

            picks.push(item);
            themeCounts[item.track.themeKey] = count + 1;
        });

        return picks;
    }

    function buildThemeSelectionQuestion(stepIndex, variant) {
        const primaryThemeKey = getPrimaryThemeKey();
        const options = themeOrder
            .filter((themeKey) => variant === 'primary' || themeKey !== primaryThemeKey)
            .map((themeKey) => {
                const theme = getTheme(themeKey);
                const isPrimary = variant === 'primary';
                return {
                    id: `${variant}-theme-${themeKey}`,
                    themeKey,
                    label: theme.label,
                    note: theme.note,
                    categoryEffects: scaleEffects(theme.seedEffects, isPrimary ? 0.9 : 0.62),
                    themeBoosts: { [themeKey]: isPrimary ? 1.4 : 1 },
                    trackBoosts: getThemeTrackBoosts(themeKey, isPrimary ? 0.2 : 0.15)
                };
            });

        return {
            id: `${variant}-theme`,
            kicker: variant === 'primary' ? 'Широкая тема' : 'Соседний вектор',
            title: variant === 'primary'
                ? 'Какая тема сейчас ближе всего?'
                : 'Что ещё рядом с этим интересом и тоже не хочется потерять?',
            description: variant === 'primary'
                ? 'Сначала выбираем не специальность, а общее поле интереса. Нам важно понять, куда тебя тянет без деталей.'
                : 'Второй вектор нужен, чтобы тест не закрывал тебя слишком рано в одном сценарии и мог честно развести близкие варианты.',
            options
        };
    }

    function buildTrackSelectionQuestion(stepIndex, themeKey, variant) {
        const theme = getTheme(themeKey);
        const options = toArray(theme?.tracks).map((track) => {
            return {
                id: `${variant}-track-${track.key}`,
                themeKey,
                trackKey: track.key,
                label: track.prompts.deepen.label,
                note: track.prompts.deepen.note,
                categoryEffects: scaleEffects(track.categoryEffects, variant === 'primary' ? 0.9 : 0.82),
                themeBoosts: { [themeKey]: variant === 'primary' ? 0.6 : 0.45 },
                trackBoosts: { [track.key]: variant === 'primary' ? 1.2 : 1 }
            };
        });

        return {
            id: `${variant}-track-question`,
            kicker: variant === 'primary' ? 'Углубление 1' : 'Углубление 2',
            title: variant === 'primary'
                ? `Если сузить тему «${theme?.short || '...' }», что внутри неё выглядит ближе?`
                : `А внутри темы «${theme?.short || '...' }» что всё ещё кажется близким?`,
            description: variant === 'primary'
                ? 'Сейчас сужаем главный интерес до более понятной рабочей ветки. Это не окончательный выбор специальности, а уточнение опоры.'
                : 'Теперь сузим второй вектор, чтобы дальше сравнивать уже не абстрактные темы, а реальные траектории внутри них.',
            options
        };
    }

    function buildAdaptivePromptQuestion(stepIndex, promptKey, kicker, title, description) {
        const snapshot = buildSnapshot();
        const candidates = getCandidateTracks(4, snapshot);
        const multiplier = promptKey === 'project' ? 1.02 : promptKey === 'semester' ? 0.98 : 0.95;
        const options = candidates.map((item) => {
            const track = item.track;
            const prompt = track.prompts[promptKey];
            return {
                id: `${promptKey}-${track.key}`,
                themeKey: track.themeKey,
                trackKey: track.key,
                label: prompt.label,
                note: prompt.note,
                categoryEffects: scaleEffects(track.categoryEffects, multiplier),
                themeBoosts: { [track.themeKey]: 0.35 },
                trackBoosts: { [track.key]: 0.85 }
            };
        });

        return {
            id: `${promptKey}-question`,
            kicker,
            title,
            description,
            options
        };
    }

    function getQuestion(stepIndex) {
        switch (stepIndex) {
            case 0:
                return buildThemeSelectionQuestion(stepIndex, 'primary');
            case 1:
                return buildThemeSelectionQuestion(stepIndex, 'secondary');
            case 2:
                return buildTrackSelectionQuestion(stepIndex, getPrimaryThemeKey(), 'primary');
            case 3:
                return buildTrackSelectionQuestion(stepIndex, getSecondaryThemeKey(), 'secondary');
            case 4:
                return buildAdaptivePromptQuestion(
                    stepIndex,
                    'practice',
                    'Рабочая среда',
                    'В какой среде тебе было бы легче включиться в работу?',
                    'Теперь тест не держится только за два первых выбора. Он собирает несколько возможных траекторий и смотрит, где тебе реально хотелось бы оказаться.'
                );
            case 5:
                return buildAdaptivePromptQuestion(
                    stepIndex,
                    'semester',
                    'Учебный ритм',
                    'На каком наборе предметов интерес не рассыпется через пару семестров?',
                    'Здесь проверяем не абстрактную симпатию, а именно ту учебную нагрузку, которую будет реально легче тянуть несколько семестров подряд.'
                );
            case 6:
            default:
                return buildAdaptivePromptQuestion(
                    stepIndex,
                    'project',
                    'Итоговый проект',
                    'Какой итоговый результат хотелось бы защищать как свою работу?',
                    'Финальный вопрос фиксирует не мечту вообще, а тот результат, который тебе было бы приятно довести до конца и показать как свой.'
                );
        }
    }

    function getStepStatus() {
        if (state.current === 0) {
            return 'Начинаем широко: сначала просто нащупываем общее поле интереса, без привязки к названию специальности.';
        }

        if (state.current === 1) {
            const primaryTheme = getTheme(getPrimaryThemeKey());
            return primaryTheme
                ? `Первая опора уже есть: ${primaryTheme.label}. Теперь добавим соседний вектор, чтобы сравнение дальше было честнее.`
                : '';
        }

        if (state.current === 2) {
            const primaryTheme = getTheme(getPrimaryThemeKey());
            return primaryTheme
                ? `Главная широкая тема определилась: ${primaryTheme.short}. Теперь сузим её до более понятной рабочей ветки.`
                : '';
        }

        if (state.current === 3) {
            const secondaryTheme = getTheme(getSecondaryThemeKey());
            const primaryTrack = getTrack(getPrimaryTrackKey());
            return secondaryTheme && primaryTrack
                ? `Главный вектор уже появился: ${primaryTrack.headline}. Теперь сужаем соседнюю тему, чтобы дальше сравнивать не абстракции, а реальные траектории.`
                : '';
        }

        const candidates = getCandidateTracks(3).map((item) => item.track.headline);
        return candidates.length
            ? `Сейчас тест держит в фокусе несколько возможных траекторий: ${formatList(candidates)}.`
            : '';
    }

    function saveState() {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
            current: state.current,
            answerIds: state.answers.map((answer) => (answer ? answer.id : null))
        }));
    }

    function restoreState() {
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                return;
            }

            const parsed = JSON.parse(raw);
            state.current = clamp(Number(parsed.current) || 0, 0, TOTAL_STEPS - 1);

            if (Array.isArray(parsed.answerIds)) {
                state.answers = new Array(TOTAL_STEPS).fill(null);
                parsed.answerIds.forEach((answerId, index) => {
                    if (!answerId || index >= TOTAL_STEPS) {
                        return;
                    }
                    const question = getQuestion(index);
                    const option = toArray(question.options).find((item) => item.id === answerId);
                    if (option) {
                        state.answers[index] = option;
                    }
                });

                const lastAnswered = state.answers.reduce((max, answer, index) => {
                    return answer ? index : max;
                }, -1);
                const furthestStep = lastAnswered === -1 ? 0 : Math.min(TOTAL_STEPS - 1, lastAnswered + 1);
                state.current = Math.min(state.current, furthestStep);
            }
        } catch (_error) {
            window.localStorage.removeItem(STORAGE_KEY);
        }
    }

    function setStatus(message) {
        statusBox.textContent = message || '';
        statusBox.classList.toggle('is-visible', Boolean(message));
    }

    function renderCategoryStrip() {
        categoryStrip.innerHTML = themeOrder.map((themeKey) => {
            return `<span class="category-pill">${escapeHtml(themeCatalog[themeKey].short)}</span>`;
        }).join('');
    }

    function renderQuestion() {
        const question = getQuestion(state.current);
        const selected = state.answers[state.current];
        const step = state.current + 1;

        setStatus(getStepStatus());
        testGrid.classList.toggle('is-focused', state.current > 0);
        progressFill.style.width = `${(step / TOTAL_STEPS) * 100}%`;
        questionKicker.textContent = question.kicker;
        questionCount.textContent = `${step} / ${TOTAL_STEPS}`;
        questionTitle.textContent = question.title;
        questionDescription.textContent = question.description;

        optionsRoot.innerHTML = question.options.map((option, index) => {
            const isSelected = selected && selected.id === option.id;
            return `
                <button class="option ${isSelected ? 'is-selected' : ''}" type="button" data-option-index="${index}">
                    <span class="option-index">${index + 1}</span>
                    <span>
                        <span class="option-label">${escapeHtml(option.label)}</span>
                        <span class="option-note">${escapeHtml(option.note)}</span>
                    </span>
                    <span class="option-check" aria-hidden="true"></span>
                </button>
            `;
        }).join('');

        function syncSelection(selectedId) {
            optionsRoot.querySelectorAll('.option').forEach((button, index) => {
                const option = question.options[index];
                button.classList.toggle('is-selected', Boolean(option && option.id === selectedId));
            });
            nextButton.disabled = !selectedId;
        }

        optionsRoot.querySelectorAll('.option').forEach((button) => {
            button.addEventListener('click', () => {
                const option = question.options[Number(button.dataset.optionIndex)];
                state.answers[state.current] = option;
                for (let index = state.current + 1; index < TOTAL_STEPS; index += 1) {
                    state.answers[index] = null;
                }
                saveState();
                syncSelection(option.id);
            });
        });

        backButton.disabled = state.current === 0;
        syncSelection(selected ? selected.id : null);
        nextButton.textContent = state.current === TOTAL_STEPS - 1 ? 'Показать результат' : 'Далее';
    }

    function buildProgramProfile(program) {
        const score = emptyCategoryScore();
        getProgramSubjects(program).forEach((subject) => {
            const block = getSubjectBlock(subject);
            const key = blockToKey[block];
            const hours = getSubjectHours(subject);
            if (key && hours > 0) {
                score[key] += hours;
            }
        });
        return normalizeScore(score);
    }

    function getTopSharedCategories(profile, programProfile, count = 4) {
        return categories
            .map((category) => ({
                ...category,
                value: Math.min(profile[category.key] || 0, programProfile[category.key] || 0)
            }))
            .filter((category) => category.value > 0)
            .sort((left, right) => right.value - left.value)
            .slice(0, count);
    }

    function buildKeywordWeights(trackRanking) {
        const weights = {};
        trackRanking.slice(0, 4).forEach((item, index) => {
            const factor = [1.35, 1.1, 0.9, 0.75][index] || 0.6;
            item.track.keywords.forEach((keyword) => {
                weights[keyword] = (weights[keyword] || 0) + factor;
            });
        });
        return weights;
    }

    function scoreKeywordMatch(text, keywordWeights) {
        const haystack = normalizeText(text);
        let totalWeight = 0;
        let matchedWeight = 0;
        const matchedKeywords = [];

        Object.entries(keywordWeights || {}).forEach(([keyword, weight]) => {
            totalWeight += weight;
            if (haystack.includes(keyword)) {
                matchedWeight += weight;
                matchedKeywords.push(keyword);
            }
        });

        return {
            score: totalWeight ? Math.round((matchedWeight / totalWeight) * 100) : 0,
            matchedKeywords
        };
    }

    function getProgramText(program) {
        const chunks = [
            program['наименование_специальности'],
            program['квалификация'],
            program['кто_это'],
            ...(toArray(program['чему_учат'])),
            ...(toArray(program['где_можно_работать'])),
            ...getProgramSubjects(program).map((subject) => getSubjectName(subject))
        ];

        return chunks.filter(Boolean).join(' ');
    }

    function getTrackAlignment(programProfile, trackRanking) {
        const topTracks = trackRanking.slice(0, 4);
        const totalWeight = topTracks.reduce((sum, item) => sum + item.score, 0) || 1;
        const weightedScore = topTracks.reduce((sum, item) => {
            return sum + (overlapProfiles(programProfile, item.trackProfile) * item.score);
        }, 0);

        return Math.round(weightedScore / totalWeight);
    }

    function getClosestTrack(programProfile, trackRanking) {
        return trackRanking
            .slice(0, 4)
            .map((item) => ({
                ...item,
                programOverlap: overlapProfiles(programProfile, item.trackProfile)
            }))
            .sort((left, right) => right.programOverlap - left.programOverlap)[0] || null;
    }

    function getSubjectHighlights(program, keywordWeights, profile, programProfile) {
        return getProgramSubjects(program)
            .map((subject) => {
                const name = getSubjectName(subject);
                const hours = getSubjectHours(subject);
                const block = getSubjectBlock(subject);
                const key = blockToKey[block];
                const blockRelevance = key ? Math.min(profile[key] || 0, programProfile[key] || 0) : 0;
                const textMatch = scoreKeywordMatch(name, keywordWeights).score;
                let score = (textMatch * 0.7) + (blockRelevance * 1.1) + Math.min(hours, 144) / 4;

                if ((key === 'general' || key === 'humanities') && textMatch === 0) {
                    score -= 8;
                }

                return {
                    name,
                    score
                };
            })
            .filter((subject) => subject.name)
            .sort((left, right) => right.score - left.score)
            .slice(0, 3)
            .map((subject) => subject.name);
    }

    function getConfidenceLabel(trackRanking, matches) {
        const topTrack = trackRanking[0];
        const secondTrack = trackRanking[1];
        const topMatch = matches[0];
        const secondMatch = matches[1];
        const trackGap = topTrack && secondTrack ? topTrack.score - secondTrack.score : 99;
        const programGap = topMatch && secondMatch ? topMatch.fitPercent - secondMatch.fitPercent : 99;

        if (trackGap >= 14 && programGap >= 10) {
            return 'Высокая';
        }
        if (trackGap >= 7 && programGap >= 5) {
            return 'Хорошая';
        }
        return 'Смешанная';
    }

    function getConfidenceCopy(trackRanking, matches) {
        const label = getConfidenceLabel(trackRanking, matches);
        const first = trackRanking[0]?.track;
        const second = trackRanking[1]?.track;

        if (!first) {
            return 'Профиль пока собрался мягко, поэтому рекомендации лучше смотреть как верхнюю подборку, а не как жёсткий приговор.';
        }

        if (label === 'Высокая') {
            return `Профиль собрался уверенно: сильнее всего тянет к траектории «${first.headline}».`;
        }

        if (label === 'Хорошая') {
            return second
                ? `Основной вектор уже виден: впереди «${first.headline}», рядом держится «${second.headline}».`
                : `Основной вектор уже виден: впереди «${first.headline}».`;
        }

        return second
            ? `Пока рядом идут два близких вектора: «${first.headline}» и «${second.headline}».`
            : `Пока профиль остаётся гибким, поэтому рекомендации лучше читать как несколько близких сценариев.`;
    }

    function getDirectionLabel(trackRanking) {
        const topTrack = trackRanking[0]?.track;
        return topTrack ? topTrack.directionLabel : 'Индивидуальная траектория';
    }

    function buildProgramMatches(snapshot) {
        const trackRanking = rankTracks(snapshot);
        const keywordWeights = buildKeywordWeights(trackRanking);

        return state.programs
            .map((program) => {
                const programProfile = buildProgramProfile(program);
                const blockScore = overlapProfiles(snapshot.profile, programProfile);
                const trackAlignment = getTrackAlignment(programProfile, trackRanking);
                const keywordScore = scoreKeywordMatch(getProgramText(program), keywordWeights).score;
                const fitPercent = Math.round(clamp(
                    (blockScore * 0.58) + (trackAlignment * 0.24) + (keywordScore * 0.18),
                    18,
                    96
                ));
                const shared = getTopSharedCategories(snapshot.profile, programProfile, 4);
                const subjects = getSubjectHighlights(program, keywordWeights, snapshot.profile, programProfile);
                const closestTrack = getClosestTrack(programProfile, trackRanking);

                return {
                    program,
                    fitPercent,
                    blockScore,
                    trackAlignment,
                    keywordScore,
                    programProfile,
                    shared,
                    subjects,
                    closestTrack
                };
            })
            .sort((left, right) => {
                if (right.fitPercent !== left.fitPercent) {
                    return right.fitPercent - left.fitPercent;
                }
                return right.blockScore - left.blockScore;
            });
    }

    function renderBars(profile) {
        return categories
            .map((category) => ({ ...category, value: profile[category.key] || 0 }))
            .sort((left, right) => right.value - left.value)
            .map((category) => `
                <div class="bar-row">
                    <div class="bar-label">${escapeHtml(category.block)}</div>
                    <div class="bar-track"><div class="bar-fill" style="width:${category.value}%"></div></div>
                    <div class="bar-value">${category.value.toFixed(1)}%</div>
                </div>
            `).join('');
    }

    function renderPrograms(matches) {
        if (!matches.length) {
            return `
                <article class="recommendation is-primary">
                    <h3 class="recommendation-title">Программы пока не загружены</h3>
                    <p class="recommendation-meta">Тест можно пройти, но подбор по учебным планам сейчас недоступен.</p>
                </article>
            `;
        }

        return matches.slice(0, 3).map((item, index) => {
            const program = item.program;
            const title = program['наименование_специальности'] || 'Программа обучения';
            const code = program['код'] || '';
            const department = program['кафедра'] || 'Кафедра не указана';
            const blockLabels = item.shared.map((category) => category.short);
            const blockSummary = blockLabels.length
                ? `Лучше всего совпадают блоки учебного плана: ${blockLabels.join(', ')}.`
                : 'Сильнее всего совпадает общий учебный профиль программы.';
            const subjectSummary = item.subjects.length
                ? `Ближайшие предметы: ${item.subjects.join(', ')}.`
                : (item.closestTrack
                    ? `Ближайшая траектория: ${item.closestTrack.track.headline}.`
                    : '');
            const sharedTags = item.shared.map((category) => {
                return `<span class="shared-tag">${escapeHtml(category.short)}</span>`;
            }).join('');

            return `
                <article class="recommendation ${index === 0 ? 'is-primary' : ''}">
                    ${index === 0 ? '<div class="recommendation-badge">Основная рекомендация</div>' : ''}
                    <div class="recommendation-top">
                        <div class="recommendation-code">${escapeHtml(code)}</div>
                    </div>
                    <h3 class="recommendation-title">${escapeHtml(title)}</h3>
                    <p class="recommendation-meta">${escapeHtml(title)} | ${escapeHtml(department)}</p>

                    <div class="recommendation-shared">
                        <p class="recommendation-text">${escapeHtml(blockSummary)}</p>
                        ${subjectSummary ? `<p class="recommendation-text recommendation-subjects">${escapeHtml(subjectSummary)}</p>` : ''}
                        <div class="shared-tags">${sharedTags || '<span class="shared-tag">Общий профиль</span>'}</div>
                    </div>

                    <div class="accuracy">
                        <div class="accuracy-head">
                            <span class="accuracy-label">Точность соответствия</span>
                            <span class="accuracy-value">${item.fitPercent}%</span>
                        </div>
                        <div class="accuracy-bar">
                            <div class="accuracy-fill" style="width: 0%" data-width="${item.fitPercent}%"></div>
                        </div>
                    </div>
                </article>
            `;
        }).join('');
    }

    function writeResultToCompare(matches) {
        const compareItems = matches.slice(0, 3).map((item) => ({
            code: item.program['код'],
            title: item.program['наименование_специальности'],
            department: item.program['кафедра'],
            description: item.program['краткое_описание'] || item.program['кто_это'],
            detailUrl: item.program.detail_url || item.program['ссылка_на_страницу_направления']
        }));

        window.localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareItems));
        window.dispatchEvent(new CustomEvent('nps:compare-updated', { detail: { count: compareItems.length } }));
        if (typeof window.updateHeaderComparePill === 'function') {
            window.updateHeaderComparePill();
        }
    }

    function resetTest() {
        window.localStorage.removeItem(STORAGE_KEY);
        state.current = 0;
        state.answers = new Array(TOTAL_STEPS).fill(null);
        resultRoot.classList.remove('is-visible');
        resultRoot.innerHTML = '';
        document.body.classList.remove('result-mode');
        testSurface.classList.remove('is-result-mode');
        testGrid.style.display = '';
        renderQuestion();
    }

    function showResult() {
        const snapshot = buildSnapshot();
        const trackRanking = rankTracks(snapshot);
        const matches = buildProgramMatches(snapshot);
        const primary = matches[0];
        const primaryProgram = primary ? primary.program : null;
        const directionLabel = getDirectionLabel(trackRanking);
        const targetDepartment = primaryProgram
            ? `${primaryProgram['наименование_специальности'] || ''}${primaryProgram['кафедра'] ? ` | ${primaryProgram['кафедра']}` : ''}`
            : 'Нет данных по программам';
        const confidenceCopy = getConfidenceCopy(trackRanking, matches);

        testGrid.style.display = 'none';
        document.body.classList.add('result-mode');
        testSurface.classList.add('is-result-mode');
        resultRoot.classList.add('is-visible');
        progressFill.style.width = '100%';
        writeResultToCompare(matches);
        window.scrollTo({ top: 0, behavior: 'auto' });

        resultRoot.innerHTML = `
            <div class="final-result">
                <div class="final-head">
                    <div class="final-kicker">Ваш результат</div>
                    <h2 class="final-title">Рекомендованные программы</h2>
                    <p class="final-lead">Система сопоставила ваш профиль с учебными планами программ и подобрала наиболее релевантные варианты.</p>
                </div>

                <div class="result-direction">
                    <div>
                        <div class="direction-label">Оптимальное направление</div>
                        <div class="direction-name">${escapeHtml(directionLabel)}</div>
                    </div>
                    <div>
                        <div class="direction-label">Целевая кафедра</div>
                        <div class="department-name">${escapeHtml(targetDepartment)}</div>
                        <div class="direction-subnote">${escapeHtml(confidenceCopy)}</div>
                    </div>
                </div>

                <div class="result-programs">${renderPrograms(matches)}</div>

                <div class="final-actions">
                    <a class="btn btn-primary" href="../compare.html">Сравнить программы →</a>
                    <button class="final-why" type="button" id="restart-btn">Пройти заново</button>
                </div>

                <section class="profile-panel">
                    <h2 class="section-title">Процентное соотношение категорий</h2>
                    <div class="bars">${renderBars(snapshot.profile)}</div>
                </section>
            </div>
        `;

        requestAnimationFrame(() => {
            resultRoot.querySelectorAll('.accuracy-fill').forEach((fill) => {
                fill.style.width = fill.dataset.width;
            });
        });

        document.getElementById('restart-btn').addEventListener('click', resetTest);
    }

    async function loadPrograms() {
        try {
            const response = await fetch('/api/bootstrap', { cache: 'no-store' });
            if (!response.ok) {
                throw new Error('BOOTSTRAP_FAILED');
            }
            const payload = await response.json();
            state.programs = Array.isArray(payload.programs) ? payload.programs : [];
        } catch (_error) {
            state.programs = [];
            setStatus('Не удалось загрузить программы. Тест можно пройти, но подбор по учебным планам будет недоступен.');
        }
    }

    backButton.addEventListener('click', () => {
        if (state.current === 0) {
            return;
        }
        state.current -= 1;
        saveState();
        renderQuestion();
    });

    nextButton.addEventListener('click', () => {
        if (!state.answers[state.current]) {
            return;
        }

        if (state.current === TOTAL_STEPS - 1) {
            saveState();
            showResult();
            return;
        }

        state.current += 1;
        saveState();
        renderQuestion();
    });

    window.addEventListener('scroll', () => {
        const topbar = document.getElementById('topbar');
        if (window.scrollY > 10) {
            topbar.classList.add('scrolled');
        } else {
            topbar.classList.remove('scrolled');
        }
    });

    renderCategoryStrip();
    restoreState();
    loadPrograms().finally(() => {
        renderQuestion();
    });
})();
