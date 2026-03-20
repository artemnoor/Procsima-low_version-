(function () {
    const STORAGE_KEY = 'proftest_session_v2';
    const TOTAL_QUESTIONS = 7;
    const QUESTION_SEQUENCE = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'];
    const COMPARE_STORAGE_KEY = 'nps-compare-programs';

    const SCORE_KEYS = [
        'software',
        'data',
        'infrastructure',
        'telecom',
        'electronics',
        'automation',
        'robotics',
        'design',
        'math',
        'hands',
        'service',
        'process',
        'creative',
        'communication',
        'integration',
        'security'
    ];

    const dimensionMeta = {
        software: { label: 'Разработка цифровых продуктов', short: 'Разработка' },
        data: { label: 'Данные и базы данных', short: 'Данные' },
        infrastructure: { label: 'Сети и инфраструктура', short: 'Инфраструктура' },
        telecom: { label: 'Связь и телеком', short: 'Телеком' },
        electronics: { label: 'Электроника и устройства', short: 'Электроника' },
        automation: { label: 'Автоматизация процессов', short: 'Автоматизация' },
        robotics: { label: 'Роботы и мехатроника', short: 'Роботы' },
        design: { label: 'Дизайн и визуальная среда', short: 'Дизайн' },
        math: { label: 'Математика и аналитика', short: 'Математика' },
        hands: { label: 'Практическая работа руками', short: 'Практика' },
        service: { label: 'Диагностика и сопровождение', short: 'Сопровождение' },
        process: { label: 'Стабильность процессов', short: 'Процессы' },
        creative: { label: 'Создание нового', short: 'Создание' },
        communication: { label: 'Коммуникация и работа с людьми', short: 'Коммуникация' },
        integration: { label: 'Сборка сложных систем в целое', short: 'Интеграция' },
        security: { label: 'Надёжность и защита', short: 'Защита' }
    };

    const TOP_DIMENSION_ORDER = [
        'software',
        'data',
        'infrastructure',
        'integration',
        'telecom',
        'electronics',
        'automation',
        'robotics',
        'design',
        'math',
        'hands',
        'service',
        'process',
        'security',
        'creative',
        'communication'
    ];

    const q1Effects = {
        software: { software: 1.35, data: 0.35, creative: 0.15 },
        infrastructure: { infrastructure: 1.25, service: 0.55, security: 0.35, integration: 0.2 },
        electronics: { electronics: 1.25, hands: 0.7, math: 0.35, integration: 0.2 },
        automation: { automation: 1.1, robotics: 0.5, process: 0.8, hands: 0.35, integration: 0.15 },
        design: { design: 1.35, creative: 0.85, communication: 0.4 }
    };

    const q2Effects = {
        app_release: { software: 2.2, data: 0.5, creative: 0.2 },
        network_access: { infrastructure: 2.1, security: 1.1, service: 0.8, integration: 0.3 },
        device_fault: { electronics: 2.2, hands: 1.1, service: 0.8, integration: 0.4 },
        line_stop: { automation: 2.1, robotics: 0.8, process: 1.2, hands: 0.5, integration: 0.4 },
        visual_deadline: { design: 2.1, creative: 1.1, communication: 0.8 }
    };

    const questions = {
        q3: {
            id: 'q3',
            eyebrow: 'Формирование профиля',
            title: 'Что для тебя выглядит как сильный результат работы?',
            description: 'Выбери тот итог, который действительно ощущается для тебя самым ценным.',
            options: [
                { id: 'ship', label: 'Запущенный сервис, приложение или цифровая функция.', effects: { software: 3, data: 1, creative: 1 } },
                { id: 'stable', label: 'Стабильная инфраструктура, где всё работает без сбоев.', effects: { infrastructure: 3, service: 1, security: 1, integration: 1 } },
                { id: 'device', label: 'Собранное устройство или модуль, который реально заработал.', effects: { electronics: 3, hands: 2, integration: 1 } },
                { id: 'process', label: 'Процесс, линия или система управления, которая идёт ровно.', effects: { automation: 3, process: 2, robotics: 1 } },
                { id: 'visual', label: 'Визуально сильное решение, которым удобно пользоваться.', effects: { design: 3, creative: 2, communication: 1 } }
            ]
        },
        q4: {
            id: 'q4',
            eyebrow: 'Учебный профиль',
            title: 'Какие предметы тебе было бы интереснее всего проходить несколько семестров?',
            description: 'Нужно выбрать не полезное, а тот блок предметов, на котором тебе было бы проще держать интерес.',
            options: [
                { id: 'code-data', label: 'Программирование, веб, архитектура приложений и базы данных.', effects: { software: 3, data: 2, math: 1 } },
                { id: 'infra-security', label: 'Сети, серверы, администрирование, безопасность и доступы.', effects: { infrastructure: 3, security: 2, service: 1, integration: 1 } },
                { id: 'electronics-embedded', label: 'Схемотехника, электроника, микроконтроллеры, измерения.', effects: { electronics: 3, hands: 1, math: 1, integration: 1 } },
                { id: 'automation-robotics', label: 'ПЛК, датчики, приводы, мехатроника, роботизированные системы.', effects: { automation: 3, robotics: 2, process: 1, hands: 1 } },
                { id: 'design-project', label: 'Рисунок, композиция, интерфейсы, материалы и проектирование среды.', effects: { design: 3, creative: 2, communication: 1 } }
            ]
        },
        q5: {
            id: 'q5',
            eyebrow: 'Практика',
            title: 'Где тебе было бы интереснее проходить практику?',
            description: 'Представь обычный рабочий день и выбери среду, в которой тебе хотелось бы оказаться.',
            options: [
                { id: 'product-team', label: 'В команде, где делают сайты, сервисы, приложения или внутренние продукты.', effects: { software: 3, data: 1, creative: 1 } },
                { id: 'it-department', label: 'В ИТ-отделе, серверной или там, где держат инфраструктуру в рабочем состоянии.', effects: { infrastructure: 3, service: 1, security: 1 } },
                { id: 'electronics-lab', label: 'В лаборатории, сервисном центре или рядом с платами, приборами и пайкой.', effects: { electronics: 3, hands: 2, service: 1 } },
                { id: 'production-floor', label: 'На производстве, рядом с линиями, ПЛК, приводами или роботизированным оборудованием.', effects: { automation: 3, robotics: 2, process: 1, hands: 1 } },
                { id: 'design-bureau', label: 'В дизайн-студии, интерьерном бюро или проектной среде с визуальными задачами.', effects: { design: 3, creative: 2, communication: 1 } }
            ]
        },
        q6: {
            id: 'q6',
            eyebrow: 'Тип задач',
            title: 'Какая задача звучит для тебя самой привлекательной?',
            description: 'Выбери задачу, за которую тебе действительно хотелось бы отвечать самому.',
            options: [
                { id: 'build-feature', label: 'Сделать новый модуль приложения или цифрового сервиса.', effects: { software: 3, creative: 1 } },
                { id: 'data-model', label: 'Продумать структуру базы данных, связи и тяжёлые запросы.', effects: { data: 3, software: 1, math: 1 } },
                { id: 'infra-setup', label: 'Настроить сеть, серверы, учётные записи, доступы и резервирование.', effects: { infrastructure: 3, security: 1, service: 1 } },
                { id: 'device-design', label: 'Спроектировать электронный модуль, схему или embedded-устройство.', effects: { electronics: 3, integration: 1, creative: 1, math: 1 } },
                { id: 'process-control', label: 'Настроить ПЛК, датчики, контроллеры или логику работы линии.', effects: { automation: 3, process: 2, robotics: 1, integration: 1 } },
                { id: 'visual-concept', label: 'Собрать визуальную концепцию, интерфейс, упаковку или предметную среду.', effects: { design: 3, creative: 2, communication: 1 } }
            ]
        },
        q7: {
            id: 'q7',
            eyebrow: 'Финальное уточнение',
            title: 'Если выбрать один главный тип ответственности, что тебе ближе?',
            description: 'Это последний вопрос, который помогает развести похожие направления внутри одного общего интереса.',
            options: [
                { id: 'digital-product', label: 'Запускать и развивать цифровой продукт или сервис.', effects: { software: 3, data: 1, creative: 1 } },
                { id: 'admin-stability', label: 'Держать серверы, доступы и инфраструктуру в стабильном состоянии.', effects: { infrastructure: 3, service: 2, security: 2 } },
                { id: 'integrate-systems', label: 'Собирать в одну рабочую среду компьютеры, сеть, железо и программную часть.', effects: { integration: 3, infrastructure: 1, electronics: 1, software: 1 } },
                { id: 'radio-signal', label: 'Отвечать за качество сигнала, радиоканалы, мобильную или вещательную связь.', effects: { telecom: 3, infrastructure: 1, hands: 1, service: 1 } },
                { id: 'repair-electronics', label: 'Находить неисправность и возвращать электронные устройства в строй.', effects: { electronics: 2, service: 2, hands: 2 } },
                { id: 'embedded-devices', label: 'Проектировать электронные модули и встраиваемые системы.', effects: { electronics: 2, integration: 2, creative: 1, math: 1 } },
                { id: 'robot-process', label: 'Настраивать линии, ПЛК, приводы и роботизированные узлы.', effects: { automation: 2, robotics: 2, process: 2, hands: 1 } },
                { id: 'visual-direction', label: 'Делать визуальные решения для людей: интерфейсы, предметы или среду.', effects: { design: 3, creative: 2, communication: 1 } }
            ]
        }
    };

    const BLOCK_EFFECTS = {
        'Программирование и разработка ПО': { software: 3.2, data: 1.2, creative: 0.4, math: 0.4 },
        'Системы, сети, БД и информационная безопасность': { infrastructure: 2.7, data: 1.3, security: 1.2, service: 0.9, integration: 0.7 },
        'Электроника, схемотехника и embedded': { electronics: 3.1, hands: 1.6, math: 0.9, integration: 0.9, automation: 0.4 },
        'Автоматизация, мехатроника и робототехника': { automation: 2.9, robotics: 1.8, process: 1.6, hands: 1.0, integration: 0.8 },
        'Связь, радиосистемы и телеком': { telecom: 3.2, infrastructure: 1.3, hands: 0.9, service: 0.5, security: 0.3 },
        'Дизайн и художественно-проектный блок': { design: 3.3, creative: 2.0, communication: 0.9 },
        'Математика и аналитическая база': { math: 2.8, data: 1.1, software: 0.4, electronics: 0.3 },
        'Общая инженерная подготовка': { electronics: 0.8, automation: 0.7, integration: 0.6, math: 0.8, hands: 0.4 },
        'Практика, производственные модули и выпуск': { hands: 1.6, service: 1.3, process: 0.6, communication: 0.3 },
        'Управление, экономика, право и качество': { communication: 1.0, process: 0.8, creative: 0.2 },
        'Общеобразовательная база': { math: 0.6, communication: 0.2 },
        'Языки и гуманитарный контекст': { communication: 1.0, creative: 0.2 }
    };

    const KEYWORD_EFFECTS = [
        { pattern: /баз[аы]\s+данн|субд|sql|nosql|данных/u, effects: { data: 1.8, software: 0.4 } },
        { pattern: /программ|python|java|c\+\+|javascript|веб|web|api|прилож/u, effects: { software: 1.6, creative: 0.2 } },
        { pattern: /сет|сервер|linux|windows|администр|доступ|инфраструкт/u, effects: { infrastructure: 1.6, service: 0.7, security: 0.4 } },
        { pattern: /безопас|защит|уязвим/u, effects: { security: 1.7, infrastructure: 0.4 } },
        { pattern: /радио|связ|телеком|антенн|сигнал|вещани|мобильн/u, effects: { telecom: 1.9, infrastructure: 0.3, service: 0.2 } },
        { pattern: /электрон|схем|микроконтрол|плат|пая|измер|embedded|встра/u, effects: { electronics: 1.9, hands: 0.7, math: 0.4, integration: 0.5 } },
        { pattern: /робот|мехатрон|манипулятор|чпу/u, effects: { robotics: 1.9, automation: 0.9, hands: 0.5 } },
        { pattern: /автомат|плк|scada|датчик|контроллер|кип/u, effects: { automation: 1.8, process: 0.9, integration: 0.5 } },
        { pattern: /дизайн|рисунк|живопис|цвет|интерьер|упаковк|фирмен|компози|интерфейс/u, effects: { design: 1.9, creative: 1.0, communication: 0.5 } },
        { pattern: /ремонт|диагност|обслужив|монтаж|налад/u, effects: { service: 1.4, hands: 1.1, electronics: 0.4 } },
        { pattern: /проект|архитектур|интеграц/u, effects: { integration: 1.1, creative: 0.2 } },
        { pattern: /эконом|управл|организац|команд/u, effects: { communication: 0.7, process: 0.5 } }
    ];

    const PROGRAM_HINTS = [
        { pattern: /компьютерные системы и комплексы|кафедра тэ/u, effects: { integration: 4.8, infrastructure: 2.2, electronics: 1.8, software: 1.4 } },
        { pattern: /сетевое и системное администрирование|кафедра тса/u, effects: { infrastructure: 4.2, service: 2.2, security: 1.5 } },
        { pattern: /радиосвяз|мобильной связи|телерадиовещания|кафедра тср/u, effects: { telecom: 4.6, infrastructure: 1.2, hands: 0.8 } },
        { pattern: /монтаж, техническое обслуживание и ремонт|кафедра тмо/u, effects: { electronics: 2.4, service: 3.2, hands: 2.1 } },
        { pattern: /разработка электронных устройств|кафедра тус/u, effects: { electronics: 3.0, integration: 1.8, creative: 0.8, math: 0.6 } },
        { pattern: /автоматические системы управления|кафедра ту/u, effects: { automation: 4.2, process: 3.0, integration: 1.0 } },
        { pattern: /мехатроника и робототехника|кафедра тмр/u, effects: { robotics: 4.2, automation: 2.0, hands: 1.0 } },
        { pattern: /дизайн|кафедра тд/u, effects: { design: 4.4, creative: 2.0, communication: 0.9 } },
        { pattern: /кафедра тип/u, effects: { software: 3.0, creative: 0.8 } },
        { pattern: /кафедра тбд/u, effects: { data: 3.2, software: 1.2, infrastructure: 0.8, security: 0.5 } }
    ];

    const ANSWER_PROGRAM_BONUSES = {
        q5: {
            'product-team': { '09.02.07/01': 5, '09.02.07/02': 3 },
            'it-department': { '09.02.06': 5, '09.02.01/00': 4 },
            'electronics-lab': { '11.02.16': 5, '11.02.17': 5 },
            'production-floor': { '27.02.04': 5, '15.02.10': 5 },
            'design-bureau': { '54.02.01': 7 }
        },
        q6: {
            'build-feature': { '09.02.07/01': 10, '09.02.07/02': 4 },
            'data-model': { '09.02.07/02': 10, '09.02.07/01': 4 },
            'infra-setup': { '09.02.06': 10, '09.02.01/00': 4, '11.02.18': 3 },
            'device-design': { '11.02.17': 10, '09.02.01/00': 6, '11.02.16': 2 },
            'process-control': { '27.02.04': 8, '15.02.10': 8 },
            'visual-concept': { '54.02.01': 10 }
        },
        q7: {
            'digital-product': { '09.02.07/01': 14, '09.02.07/02': 8 },
            'admin-stability': { '09.02.06': 14, '09.02.07/02': 6, '09.02.01/00': 4 },
            'integrate-systems': { '09.02.01/00': 18, '09.02.06': 6, '11.02.17': 4 },
            'radio-signal': { '11.02.18': 18 },
            'repair-electronics': { '11.02.16': 18 },
            'embedded-devices': { '11.02.17': 18, '09.02.01/00': 5 },
            'robot-process': { '27.02.04': 10, '15.02.10': 10 },
            'visual-direction': { '54.02.01': 18 }
        }
    };

    const SECONDARY_BLOCKS = new Set([
        'Общеобразовательная база',
        'Языки и гуманитарный контекст',
        'Практика, производственные модули и выпуск'
    ]);

    let bootstrapCache = null;

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function emptyScores() {
        return SCORE_KEYS.reduce((acc, key) => {
            acc[key] = 0;
            return acc;
        }, {});
    }

    function applyEffects(target, effects, multiplier) {
        Object.entries(effects || {}).forEach(([key, value]) => {
            target[key] = (target[key] || 0) + (value * (multiplier || 1));
        });
    }

    function normalizeText(value) {
        return String(value || '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function formatBlockName(value) {
        const normalized = normalizeText(value);
        const labels = {
            'Программирование и разработка ПО': 'Программирование и ПО',
            'Системы, сети, БД и информационная безопасность': 'Сети, системы и ИБ',
            'Электроника, схемотехника и embedded': 'Электроника и embedded-системы',
            'Автоматизация, мехатроника и робототехника': 'Автоматизация и робототехника',
            'Связь, радиосистемы и телеком': 'Связь и телеком',
            'Дизайн и художественно-проектный блок': 'Дизайн и проектирование',
            'Математика и аналитическая база': 'Математика и аналитика',
            'Общая инженерная подготовка': 'Инженерная база',
            'Практика, производственные модули и выпуск': 'Практика и производственные модули',
            'Управление, экономика, право и качество': 'Управление и качество',
            'Общеобразовательная база': 'Общая подготовка',
            'Языки и гуманитарный контекст': 'Языки и гуманитарный блок'
        };
        return labels[normalized] || normalized;
    }

    function createSession() {
        return {
            version: 2,
            answers: {},
            sequence: QUESTION_SEQUENCE.slice(),
            currentIndex: 0
        };
    }

    function loadSession() {
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                return createSession();
            }

            const parsed = JSON.parse(raw);
            if (parsed.version !== 2) {
                return createSession();
            }

            return {
                version: 2,
                answers: parsed.answers || {},
                sequence: QUESTION_SEQUENCE.slice(),
                currentIndex: Number.isFinite(parsed.currentIndex) ? parsed.currentIndex : 0
            };
        } catch (_error) {
            return createSession();
        }
    }

    function saveSession(session) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }

    function ensureSession() {
        const session = loadSession();
        saveSession(session);
        return session;
    }

    function resetSession() {
        const session = createSession();
        saveSession(session);
        return session;
    }

    function getSavedQ1() {
        const session = ensureSession();
        return session.answers.q1 ? clone(session.answers.q1.allocations) : null;
    }

    function getSavedQ2() {
        const session = ensureSession();
        return session.answers.q2 ? session.answers.q2.order.slice() : null;
    }

    function truncateAfter(session, index) {
        const allowed = new Set(session.sequence.slice(0, index + 1));
        Object.keys(session.answers).forEach((questionId) => {
            if (!allowed.has(questionId)) {
                delete session.answers[questionId];
            }
        });
        session.currentIndex = Math.min(session.currentIndex, index + 1);
    }

    function saveQ1(allocations) {
        const session = createSession();
        session.answers.q1 = { allocations: clone(allocations) };
        session.currentIndex = 1;
        saveSession(session);
        return session;
    }

    function saveQ2(order) {
        const session = ensureSession();
        session.answers.q2 = { order: order.slice() };
        truncateAfter(session, 1);
        session.currentIndex = 2;
        saveSession(session);
        return session;
    }

    function saveSingleChoice(questionId, optionId) {
        const session = ensureSession();
        const index = session.sequence.indexOf(questionId);
        if (index === -1) {
            return session;
        }

        truncateAfter(session, index);
        session.answers[questionId] = { optionId };
        session.currentIndex = Math.min(session.sequence.length, index + 1);
        saveSession(session);
        return session;
    }

    function questionRoute(questionId) {
        return `${questionId}.html`;
    }

    function introRoute() {
        return '../index.html';
    }

    function resultRoute() {
        return '../result.html';
    }

    function currentQuestionRoute(session) {
        const currentId = session.sequence[session.currentIndex];
        return currentId ? questionRoute(currentId) : resultRoute();
    }

    function getQuestionDefinition(questionId) {
        return questions[questionId] || null;
    }

    function optionMap(question) {
        return Object.fromEntries((question.options || []).map((option) => [option.id, option]));
    }

    function computeDimensionScores(answerMap, questionIds) {
        const answers = answerMap || {};
        const ids = Array.isArray(questionIds) && questionIds.length ? questionIds.slice() : Object.keys(answers);
        const scores = emptyScores();

        ids.forEach((questionId) => {
            const answer = answers[questionId];
            if (!answer) {
                return;
            }

            if (questionId === 'q1') {
                Object.entries(answer.allocations || {}).forEach(([key, value]) => {
                    applyEffects(scores, q1Effects[key], (Number(value) || 0) / 20);
                });
                return;
            }

            if (questionId === 'q2') {
                (answer.order || []).forEach((crisisKey, index) => {
                    const weight = Math.max(1, 5 - index);
                    applyEffects(scores, q2Effects[crisisKey], weight);
                });
                return;
            }

            const question = getQuestionDefinition(questionId);
            if (!question) {
                return;
            }

            const option = optionMap(question)[answer.optionId];
            if (!option) {
                return;
            }

            applyEffects(scores, option.effects, 1);
        });

        return scores;
    }

    function getTopDimensions(scores, count) {
        return TOP_DIMENSION_ORDER
            .map((key) => ({ key, value: scores[key] || 0 }))
            .sort((left, right) => {
                if (right.value !== left.value) {
                    return right.value - left.value;
                }
                return TOP_DIMENSION_ORDER.indexOf(left.key) - TOP_DIMENSION_ORDER.indexOf(right.key);
            })
            .slice(0, count || 3)
            .filter((item) => item.value > 0);
    }

    function getQuestionPageState(questionId) {
        const session = ensureSession();
        const sequence = session.sequence;
        const index = sequence.indexOf(questionId);

        if (index === -1) {
            return { redirect: currentQuestionRoute(session) };
        }

        if (index > session.currentIndex) {
            return { redirect: currentQuestionRoute(session) };
        }

        const answeredBefore = sequence.slice(0, index).filter((id) => Boolean(session.answers[id]));
        saveSession(session);

        return {
            session,
            questionId,
            question: getQuestionDefinition(questionId),
            answer: session.answers[questionId] || null,
            step: index + 1,
            total: TOTAL_QUESTIONS,
            topClusters: getTopDimensions(computeDimensionScores(session.answers, answeredBefore), 3).map((item) => item.key),
            previousRoute: index > 0 ? questionRoute(sequence[index - 1]) : introRoute()
        };
    }

    function getNextRoute(session) {
        const finalQuestionId = session.sequence[TOTAL_QUESTIONS - 1];
        if (finalQuestionId && session.answers[finalQuestionId]) {
            return resultRoute();
        }
        return currentQuestionRoute(session);
    }

    function getNextQuestionRoute(session) {
        return getNextRoute(session);
    }

    function getResultsBasis() {
        const session = ensureSession();
        const finalQuestionId = session.sequence[TOTAL_QUESTIONS - 1];
        if (!finalQuestionId || !session.answers[finalQuestionId]) {
            return null;
        }

        const scores = computeDimensionScores(session.answers, session.sequence.slice(0, TOTAL_QUESTIONS));
        return {
            session,
            scores,
            topDimensions: getTopDimensions(scores, 5)
        };
    }

    async function fetchBootstrapData() {
        if (bootstrapCache) {
            return bootstrapCache;
        }

        const response = await window.fetch('/api/bootstrap', { cache: 'no-store' });
        if (!response.ok) {
            throw new Error('BOOTSTRAP_FETCH_FAILED');
        }

        bootstrapCache = await response.json();
        return bootstrapCache;
    }

    function groupBlockHours(program) {
        const totals = new Map();
        (program['предметы'] || []).forEach((subject) => {
            const block = normalizeText(subject['блок_предмета']) || 'Без блока';
            const hours = Number(subject['количество_часов_у_предмета']) || 0;
            totals.set(block, (totals.get(block) || 0) + hours);
        });
        return [...totals.entries()].map(([name, hours]) => ({ name, hours }));
    }

    function applyKeywordVector(text, vector, multiplier) {
        const normalized = normalizeText(text).toLowerCase();
        if (!normalized) {
            return;
        }

        KEYWORD_EFFECTS.forEach((rule) => {
            if (rule.pattern.test(normalized)) {
                applyEffects(vector, rule.effects, multiplier);
            }
        });
    }

    function buildProgramVector(program) {
        const vector = emptyScores();
        const blockHours = groupBlockHours(program);
        const totalHours = blockHours.reduce((sum, item) => sum + item.hours, 0) || 1;

        blockHours.forEach((block) => {
            const effects = BLOCK_EFFECTS[block.name] || {};
            applyEffects(vector, effects, (block.hours / totalHours) * 10);
        });

        (program['предметы'] || []).forEach((subject) => {
            const hours = Number(subject['количество_часов_у_предмета']) || 0;
            const multiplier = Math.max(0.35, Math.min(1.6, hours / 180));
            applyKeywordVector(subject['предмет'], vector, multiplier);
        });

        [
            program['кто_это'],
            ...(program['чему_учат'] || []),
            ...(program['где_можно_работать'] || []).slice(0, 4)
        ].forEach((chunk) => {
            applyKeywordVector(chunk, vector, 0.7);
        });

        const programHintText = [
            program['наименование_специальности'],
            program['кафедра'],
            program['кто_это']
        ].map((chunk) => normalizeText(chunk).toLowerCase()).join(' ');

        PROGRAM_HINTS.forEach((rule) => {
            if (rule.pattern.test(programHintText)) {
                applyEffects(vector, rule.effects, 1);
            }
        });

        return {
            vector,
            blockHours
        };
    }

    function vectorMagnitude(vector) {
        return Math.sqrt(SCORE_KEYS.reduce((sum, key) => sum + Math.pow(vector[key] || 0, 2), 0));
    }

    function cosineSimilarity(left, right) {
        const leftMagnitude = vectorMagnitude(left);
        const rightMagnitude = vectorMagnitude(right);
        if (!leftMagnitude || !rightMagnitude) {
            return 0;
        }

        const dot = SCORE_KEYS.reduce((sum, key) => sum + ((left[key] || 0) * (right[key] || 0)), 0);
        return dot / (leftMagnitude * rightMagnitude);
    }

    function getTopUserKeys(userScores, count) {
        return getTopDimensions(userScores, count).map((item) => item.key);
    }

    function getDimensionReasons(userScores, programVector) {
        const topKeys = getTopUserKeys(userScores, 3);
        const sorted = topKeys
            .map((key) => ({
                key,
                value: (userScores[key] || 0) * (programVector[key] || 0)
            }))
            .filter((item) => item.value > 0)
            .sort((left, right) => right.value - left.value)
            .slice(0, 2);

        return sorted.map((item) => dimensionMeta[item.key].label);
    }

    function buildSubjectVector(subject) {
        const vector = emptyScores();
        const block = normalizeText(subject['блок_предмета']);
        applyEffects(vector, BLOCK_EFFECTS[block] || {}, 0.6);
        applyKeywordVector(subject['предмет'], vector, 1);
        return vector;
    }

    function subjectRelevance(subject, userScores) {
        const vector = buildSubjectVector(subject);
        return SCORE_KEYS.reduce((sum, key) => sum + ((vector[key] || 0) * (userScores[key] || 0)), 0);
    }

    function getSubjectHighlights(program, userScores) {
        const subjects = (program['предметы'] || [])
            .filter((subject) => !SECONDARY_BLOCKS.has(normalizeText(subject['блок_предмета'])))
            .map((subject) => ({
                name: normalizeText(subject['предмет']),
                relevance: subjectRelevance(subject, userScores)
            }))
            .filter((subject) => subject.name)
            .sort((left, right) => right.relevance - left.relevance);

        const seen = new Set();
        return subjects.filter((subject) => {
            if (seen.has(subject.name)) {
                return false;
            }
            seen.add(subject.name);
            return true;
        }).slice(0, 3).map((subject) => subject.name);
    }

    function getBlockHighlights(blockHours, userScores) {
        const ranked = blockHours
            .map((block) => {
                const vector = emptyScores();
                applyEffects(vector, BLOCK_EFFECTS[block.name] || {}, 1);
                const relevance = SCORE_KEYS.reduce((sum, key) => sum + ((vector[key] || 0) * (userScores[key] || 0)), 0);
                return {
                    ...block,
                    relevance
                };
            })
            .sort((left, right) => {
                if (SECONDARY_BLOCKS.has(left.name) !== SECONDARY_BLOCKS.has(right.name)) {
                    return SECONDARY_BLOCKS.has(left.name) ? 1 : -1;
                }
                if (right.relevance !== left.relevance) {
                    return right.relevance - left.relevance;
                }
                return right.hours - left.hours;
            });

        return ranked.slice(0, 2);
    }

    function buildProgramMatch(program, userScores) {
        const signature = buildProgramVector(program);
        const similarity = cosineSimilarity(userScores, signature.vector);
        const topKeys = getTopUserKeys(userScores, 4);
        const directedBonus = topKeys.reduce((sum, key, index) => {
            const weight = Math.max(1, 4 - index);
            return sum + ((signature.vector[key] || 0) * weight);
        }, 0);

        const blockHighlights = getBlockHighlights(signature.blockHours, userScores);
        const score = (similarity * 100) + directedBonus;
        const dimensionReasons = getDimensionReasons(userScores, signature.vector);
        const subjects = getSubjectHighlights(program, userScores);

        const reasons = [];
        if (dimensionReasons.length) {
            reasons.push(`По ответам у тебя сильнее всего совпали ${dimensionReasons.join(', ')}.`);
        }
        if (blockHighlights.length) {
            reasons.push(`В учебном плане выделяются ${blockHighlights.map((block) => `«${formatBlockName(block.name)}» (${block.hours} ч.)`).join(' и ')}.`);
        }
        if (subjects.length) {
            reasons.push(`Среди предметов тебе могут быть ближе: ${subjects.join(', ')}.`);
        }

        return {
            program,
            score,
            blockHighlights,
            subjects,
            reasons,
            signature
        };
    }

    function getAnswerProgramBonus(programCode, session) {
        return Object.entries(session.answers || {}).reduce((sum, [questionId, answer]) => {
            const optionId = answer && answer.optionId;
            if (!optionId) {
                return sum;
            }
            const questionBonuses = ANSWER_PROGRAM_BONUSES[questionId];
            if (!questionBonuses || !questionBonuses[optionId]) {
                return sum;
            }
            return sum + (questionBonuses[optionId][programCode] || 0);
        }, 0);
    }

    function buildPool(ranking) {
        const topScore = ranking[0] ? ranking[0].score : 1;
        return ranking.map((item, index) => {
            const fitPercent = index === 0
                ? 100
                : Math.max(52, Math.min(99, Math.round((item.score / topScore) * 100)));

            return {
                code: item.program['код'],
                title: item.program['наименование_специальности'],
                department: item.program['кафедра'],
                summary: item.program['краткое_описание'] || item.program['кто_это'],
                detailUrl: item.program.detail_url,
                fitPercent,
                reasons: item.reasons,
                blockHighlights: item.blockHighlights,
                subjects: item.subjects,
                learnItems: (item.program['чему_учат'] || []).slice(0, 2),
                workItems: (item.program['где_можно_работать'] || []).slice(0, 2)
            };
        });
    }

    function getConfidence(ranking) {
        const first = ranking[0];
        const second = ranking[1];
        const gap = first && second ? first.score - second.score : 100;

        if (gap >= 18) {
            return 'Высокая';
        }
        if (gap >= 9) {
            return 'Хорошая';
        }
        return 'Смешанная';
    }

    async function getResultsData() {
        const basis = getResultsBasis();
        if (!basis) {
            return null;
        }

        const payload = await fetchBootstrapData();
        const programs = Array.isArray(payload.programs) ? payload.programs : [];
        const ranking = programs
            .map((program) => {
                const match = buildProgramMatch(program, basis.scores);
                const answerBonus = getAnswerProgramBonus(program['код'], basis.session);
                return {
                    ...match,
                    score: match.score + answerBonus
                };
            })
            .sort((left, right) => right.score - left.score);

        const pool = buildPool(ranking.slice(0, 4));

        return {
            session: basis.session,
            scores: basis.scores,
            confidence: getConfidence(ranking),
            topDimensions: basis.topDimensions.map((item) => ({
                key: item.key,
                label: dimensionMeta[item.key].label,
                short: dimensionMeta[item.key].short,
                value: item.value
            })),
            primary: pool[0] || null,
            pool,
            ranking
        };
    }

    function writePoolToCompare(pool) {
        const compareItems = (pool || []).slice(0, 3).map((item) => ({
            code: item.code,
            title: item.title,
            department: item.department,
            description: item.summary,
            detailUrl: item.detailUrl
        }));

        window.localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareItems));
        window.dispatchEvent(new CustomEvent('nps:compare-updated', { detail: { count: compareItems.length } }));
        if (typeof window.updateHeaderComparePill === 'function') {
            window.updateHeaderComparePill();
        }
        return compareItems;
    }

    window.ProftestEngine = {
        STORAGE_KEY,
        TOTAL_QUESTIONS,
        questions,
        dimensionMeta,
        resetSession,
        ensureSession,
        saveQ1,
        saveQ2,
        saveSingleChoice,
        getSavedQ1,
        getSavedQ2,
        getQuestionPageState,
        getNextQuestionRoute,
        questionRoute,
        introRoute,
        resultRoute,
        getNextRoute,
        getResultsBasis,
        getResultsData,
        computeDimensionScores,
        writePoolToCompare
    };
})();
