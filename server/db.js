const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const dataPath = resolveSchemaPath();
const imagesDir = path.join(rootDir, 'images');

const TRAITS = [
    { key: 'engineering', title: 'инженерный фундамент' },
    { key: 'systems', title: 'системное мышление' },
    { key: 'software', title: 'разработка' },
    { key: 'data', title: 'работа с данными' },
    { key: 'security', title: 'безопасность' },
    { key: 'business', title: 'цифровые продукты' },
    { key: 'infrastructure', title: 'инфраструктура' }
];

const BLOCK_TRAIT_WEIGHTS = {
    'Математика и аналитическая база': { engineering: 1.2, data: 1.2, systems: 0.5 },
    'Общая инженерная подготовка': { engineering: 1.5, systems: 0.5 },
    'Программирование и разработка ПО': { software: 1.8, data: 0.6, business: 0.4 },
    'Системы, сети, БД и информационная безопасность': { systems: 1.2, infrastructure: 1.3, security: 1.1, data: 0.5 },
    'Электроника, схемотехника и embedded': { engineering: 1.6, systems: 0.8, infrastructure: 0.4 },
    'Автоматизация, мехатроника и робототехника': { engineering: 1.7, systems: 1.0, infrastructure: 0.5 },
    'Связь, радиосистемы и телеком': { infrastructure: 1.8, systems: 1.1, engineering: 0.7, security: 0.4 },
    'Дизайн и художественно-проектный блок': { business: 1.6, software: 0.4 },
    'Управление, экономика, право и качество': { business: 1.6, systems: 0.5 },
    'Практика, производственные модули и выпуск': { systems: 0.4, business: 0.4 },
    'Общеобразовательная база': { engineering: 0.2, systems: 0.2 },
    'Языки и гуманитарный контекст': { business: 0.5, systems: 0.2 }
};

let cache = null;
let imageIndexCache = null;

function resolveSchemaPath() {
    const explicitName = process.env.BMSTU_SCHEMA_FILE || 'bmstu_final_schema_20260320_005704.json';
    const explicitPath = path.join(rootDir, explicitName);
    if (fs.existsSync(explicitPath)) {
        return explicitPath;
    }

    const files = fs.readdirSync(rootDir)
        .filter((name) => /^bmstu_final_schema.*\.json$/i.test(name))
        .map((name) => {
            const fullPath = path.join(rootDir, name);
            return {
                fullPath,
                name,
                mtimeMs: fs.statSync(fullPath).mtimeMs
            };
        })
        .sort((a, b) => b.mtimeMs - a.mtimeMs);

    if (!files.length) {
        throw new Error('Schema JSON file was not found in the project root');
    }

    return files[0].fullPath;
}

function transliterate(value) {
    const map = {
        а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y',
        к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f',
        х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya'
    };

    return String(value)
        .split('')
        .map((char) => {
            const lower = char.toLowerCase();
            const mapped = map[lower];
            if (!mapped) {
                return char;
            }
            return char === lower ? mapped : mapped.toUpperCase();
        })
        .join('');
}

function slugify(value) {
    return transliterate(value)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function extractSlug(program) {
    const pageUrl = program['ссылка_на_страницу_направления'];
    if (pageUrl) {
        try {
            const pathname = new URL(pageUrl).pathname.split('/').filter(Boolean);
            const externalSlug = pathname[pathname.length - 1];
            if (externalSlug) {
                return externalSlug;
            }
        } catch (_error) {
            // fall through to title/code slug generation
        }
    }

    return slugify(program['наименование_специальности'] || program['код']);
}

function normalizeText(value) {
    return String(value || '')
        .replace(/\s+/g, ' ')
        .trim();
}

function normalizeImageLookupKey(value) {
    return normalizeText(
        String(value || '')
            .replace(/\.[a-z0-9]+$/i, '')
            .replace(/\([^)]*\)/g, ' ')
    ).toLowerCase();
}

function getImageIndex() {
    if (!fs.existsSync(imagesDir)) {
        imageIndexCache = {
            mtimeMs: null,
            files: []
        };
        return [];
    }

    const stat = fs.statSync(imagesDir);
    if (imageIndexCache && imageIndexCache.mtimeMs === stat.mtimeMs) {
        return imageIndexCache.files;
    }

    const files = fs.readdirSync(imagesDir)
        .filter((fileName) => /\.(png|jpe?g|webp|gif|avif|svg)$/i.test(fileName))
        .map((fileName) => ({
            fileName,
            exactKey: normalizeText(path.parse(fileName).name).toLowerCase(),
            relaxedKey: normalizeImageLookupKey(fileName)
        }));

    imageIndexCache = {
        mtimeMs: stat.mtimeMs,
        files
    };

    return files;
}

function toPublicAssetPath(relativePath) {
    return encodeURI(String(relativePath || '').replace(/\\/g, '/'));
}

function resolveProgramImage(program) {
    const imageFiles = getImageIndex();
    const title = normalizeText(program['наименование_специальности']);
    const departmentCode = normalizeText(program['кафедра']);
    const titleKey = normalizeText(title).toLowerCase();
    const titleWithDepartmentKey = normalizeText(`${title} ${departmentCode}`).toLowerCase();
    const relaxedTitleKey = normalizeImageLookupKey(title);
    const relaxedTitleWithDepartmentKey = normalizeImageLookupKey(`${title} ${departmentCode}`);

    const byExact = imageFiles.find((item) => item.exactKey === titleWithDepartmentKey)
        || imageFiles.find((item) => item.exactKey === titleKey);
    if (byExact) {
        return toPublicAssetPath(path.posix.join('images', byExact.fileName));
    }

    const byRelaxed = imageFiles.find((item) => item.relaxedKey === relaxedTitleWithDepartmentKey)
        || imageFiles.find((item) => item.relaxedKey === relaxedTitleKey)
        || imageFiles.find((item) => item.relaxedKey.startsWith(relaxedTitleKey))
        || imageFiles.find((item) => relaxedTitleKey.startsWith(item.relaxedKey));
    if (byRelaxed) {
        return toPublicAssetPath(path.posix.join('images', byRelaxed.fileName));
    }

    const rawImagePath = normalizeText(program['картинка_для_кафедры']);
    if (rawImagePath && fs.existsSync(path.join(rootDir, rawImagePath))) {
        return toPublicAssetPath(rawImagePath);
    }

    const fallbackImage = imageFiles.find((item) => item.fileName.toLowerCase() === 'компьютерные системы и комплексы.png')
        || imageFiles[0];
    return fallbackImage ? toPublicAssetPath(path.posix.join('images', fallbackImage.fileName)) : null;
}

function buildShortDescription(value) {
    const text = normalizeText(value);
    if (!text) {
        return 'Описание направления будет добавлено позже.';
    }

    const firstSentence = text.match(/^(.{1,220}?[.!?])(\s|$)/);
    if (firstSentence) {
        return firstSentence[1].trim();
    }

    if (text.length <= 220) {
        return text;
    }

    return `${text.slice(0, 217).trimEnd()}...`;
}

function normalizeDepartmentName(value) {
    const text = normalizeText(value);
    if (!text) {
        return 'Кафедра уточняется';
    }

    if (/^[A-ZА-Я0-9-]{2,8}$/u.test(text)) {
        return `Кафедра ${text}`;
    }

    return text;
}

function parseHours(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeScores(entries) {
    const budgetOnly = Array.isArray(entries) ? entries : [];
    return budgetOnly
        .map((item) => ({
            'год': Number(item['год']),
            'бюджет': Number(item['значение']),
            'платное': null
        }))
        .filter((item) => Number.isFinite(item['год']) && Number.isFinite(item['бюджет']))
        .sort((a, b) => a['год'] - b['год']);
}

function normalizeSubjects(program) {
    return (Array.isArray(program['предметы']) ? program['предметы'] : [])
        .map((subject) => ({
            'предмет': normalizeText(subject['название_предмета']),
            'блок_предмета': normalizeText(subject['блок']) || 'Без блока',
            'количество_часов_у_предмета': parseHours(subject['количество_часов']),
            'кафедра_преподающая_предмет': null,
            'ссылка_на_информацию_о_предмете': program['ссылка_на_рабочую_программу'] || program['ссылка_на_учебный_план'] || '#'
        }))
        .filter((subject) => subject['предмет']);
}

function normalizeBlockDescriptions(program) {
    return (Array.isArray(program['блоки_предметов']) ? program['блоки_предметов'] : [])
        .map((block, index) => ({
            title: normalizeText(block['название']),
            description: normalizeText(block['описание']),
            sort_order: index + 1
        }))
        .filter((block) => block.title);
}

function extractCareerRoles(program) {
    const lines = Array.isArray(program['где_можно_работать']) ? program['где_можно_работать'] : [];
    const roles = [];

    lines.forEach((line) => {
        const text = normalizeText(line);
        if (!text) {
            return;
        }

        const split = text.split(/\s+[—-]\s+/u);
        const rolePart = split.length > 1 ? split.slice(1).join(' - ') : split[0];

        rolePart
            .split(/,\s*/u)
            .map((item) => normalizeText(item))
            .filter(Boolean)
            .forEach((role) => {
                if (!roles.includes(role)) {
                    roles.push(role);
                }
            });
    });

    return roles.slice(0, 6);
}

function buildSections(program, careers) {
    const learnItems = (Array.isArray(program['чему_учат']) ? program['чему_учат'] : [])
        .map((item, index) => ({
            title: `Навык ${index + 1}`,
            description: normalizeText(item),
            sort_order: index + 1
        }))
        .filter((item) => item.description);

    const careerItems = (Array.isArray(program['где_можно_работать']) ? program['где_можно_работать'] : [])
        .map((item, index) => ({
            title: careers[index] || `Вариант ${index + 1}`,
            description: normalizeText(item),
            sort_order: index + 1
        }))
        .filter((item) => item.description);

    const blockItems = normalizeBlockDescriptions(program);

    return [
        {
            section_key: 'who_is_it',
            title: 'Кто это?',
            body: normalizeText(program['кто_это']),
            items: []
        },
        {
            section_key: 'what_you_learn_intro',
            title: 'Чему учат?',
            body: 'Основные направления подготовки собраны по тематическим блокам.',
            items: blockItems
        },
        {
            section_key: 'skills_intro',
            title: 'Какие навыки получает выпускник?',
            body: 'Во время обучения студенты проходят как фундаментальные, так и прикладные модули.',
            items: learnItems
        },
        {
            section_key: 'career_intro',
            title: 'Где можно работать?',
            body: 'После выпуска можно развиваться в нескольких практических треках.',
            items: careerItems
        }
    ];
}

function inferEducationLevel(program) {
    const duration = normalizeText(program['срок_обучения']).toLowerCase();
    if (duration.includes('9кл') || duration.includes('9 кл')) {
        return 'СПО';
    }
    return 'СПО';
}

function buildProgramProfiles(programs) {
    return programs.reduce((acc, program) => {
        const scores = {
            engineering: 1,
            systems: 1,
            software: 1,
            data: 1,
            security: 1,
            business: 1,
            infrastructure: 1
        };

        const subjects = Array.isArray(program['предметы']) ? program['предметы'] : [];
        const totalHours = subjects.reduce((sum, item) => sum + parseHours(item['количество_часов']), 0) || 1;

        subjects.forEach((subject) => {
            const blockName = normalizeText(subject['блок']);
            const hours = parseHours(subject['количество_часов']);
            const weight = hours / totalHours;
            const traitWeights = BLOCK_TRAIT_WEIGHTS[blockName] || {};

            Object.entries(traitWeights).forEach(([trait, traitWeight]) => {
                scores[trait] += weight * traitWeight * 8;
            });

            const subjectName = normalizeText(subject['название_предмета']).toLowerCase();
            if (subjectName.includes('баз данных')) scores.data += 0.5;
            if (subjectName.includes('безопас')) scores.security += 0.7;
            if (subjectName.includes('сет')) scores.infrastructure += 0.6;
            if (subjectName.includes('программ')) scores.software += 0.7;
            if (subjectName.includes('робот') || subjectName.includes('автомат')) scores.engineering += 0.6;
        });

        Object.keys(scores).forEach((trait) => {
            scores[trait] = Math.max(1, Math.min(5, Math.round(scores[trait])));
        });

        acc[program['код']] = scores;
        return acc;
    }, {});
}

function getTraitLabels() {
    return TRAITS.reduce((acc, trait) => {
        acc[trait.key] = trait.title;
        return acc;
    }, {});
}

function buildDocuments(program) {
    const documents = [];

    if (program['ссылка_на_рабочую_программу']) {
        documents.push({
            type: 'program-description',
            title: 'Рабочая программа',
            url: program['ссылка_на_рабочую_программу'],
            description: `Рабочая программа направления «${program['наименование_специальности']}».`,
            version_label: 'актуальная',
            published_at: null,
            is_primary: 1
        });
    }

    if (program['ссылка_на_учебный_план']) {
        documents.push({
            type: 'curriculum',
            title: 'Учебный план',
            url: program['ссылка_на_учебный_план'],
            description: `Учебный план направления «${program['наименование_специальности']}».`,
            version_label: 'актуальная',
            published_at: null,
            is_primary: 0
        });
    }

    if (program['ссылка_на_страницу_направления']) {
        documents.push({
            type: 'program-page',
            title: 'Внешняя страница направления',
            url: program['ссылка_на_страницу_направления'],
            description: 'Официальная страница направления на сайте.',
            version_label: null,
            published_at: null,
            is_primary: 0
        });
    }

    return documents;
}

function buildAliases(program, slug) {
    const aliases = new Set([slug]);
    const titleSlug = slugify(program['наименование_специальности']);
    const codeSlug = slugify(program['код']);
    const codeCompactSlug = slugify(String(program['код']).replace(/[/.]+/g, '-'));

    [titleSlug, codeSlug, codeCompactSlug].filter(Boolean).forEach((value) => aliases.add(value));
    return [...aliases];
}

function toLegacyProgram(program) {
    const slug = extractSlug(program);
    const department = normalizeDepartmentName(program['кафедра']);
    const hero = normalizeText(program['кто_это']);
    const shortDescription = buildShortDescription(hero);
    const careers = extractCareerRoles(program);
    const documents = buildDocuments(program);
    const programImage = resolveProgramImage(program);

    return {
        'код': normalizeText(program['код']),
        slug,
        aliases: buildAliases(program, slug),
        'наименование_специальности': normalizeText(program['наименование_специальности']),
        'квалификация': normalizeText(program['квалификация']),
        'кафедра': department,
        'уровень_образования': inferEducationLevel(program),
        'форма_обучения': normalizeText(program['форма_обучения']),
        'нормативный_срок_обучения': normalizeText(program['срок_обучения']),
        'краткое_описание': shortDescription,
        'hero_description': hero || shortDescription,
        'карьерные_роли': careers,
        'количество_бюджетных_мест': Number(program['количество_бюджетных_мест']) || 0,
        'количество_платных_мест': Number(program['количество_платных_мест']) || 0,
        'проходной_балл_аттестата_по_прошлым_годам': normalizeScores(program['динамика_проходного_бюджет']),
        'стоимость_обучения_в_год_руб': Number(program['стоимость_в_год']) || null,
        'кто_это': hero || shortDescription,
        'чему_учат': Array.isArray(program['чему_учат']) ? program['чему_учат'].map((item) => normalizeText(item)).filter(Boolean) : [],
        'где_можно_работать': Array.isArray(program['где_можно_работать']) ? program['где_можно_работать'].map((item) => normalizeText(item)).filter(Boolean) : [],
        'предметы': normalizeSubjects(program),
        'описание_основной_профессиональной_образовательной_программы': program['ссылка_на_рабочую_программу'] || '#',
        'ссылка_на_учебный_план': program['ссылка_на_учебный_план'] || '#',
        'ссылка_на_страницу_направления': program['ссылка_на_страницу_направления'] || '#',
        'картинка_для_кафедры': programImage,
        detail_url: `old.html?slug=${encodeURIComponent(slug)}`,
        detail_sections: buildSections(program, careers),
        documents
    };
}

function loadPrograms() {
    const stat = fs.statSync(dataPath);
    if (cache && cache.mtimeMs === stat.mtimeMs) {
        return cache;
    }

    const raw = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const programs = Array.isArray(raw) ? raw.map(toLegacyProgram) : [];
    const bySlug = new Map();

    programs.forEach((program) => {
        program.aliases.forEach((alias) => {
            bySlug.set(alias, program);
        });
    });

    cache = {
        mtimeMs: stat.mtimeMs,
        programs,
        bySlug,
        profiles: buildProgramProfiles(raw),
        traitLabels: getTraitLabels()
    };

    return cache;
}

function getLegacyPrograms() {
    return loadPrograms().programs.map((program) => {
        const { aliases, ...publicProgram } = program;
        return publicProgram;
    });
}

function getLegacyProgramBySlug(slug) {
    const program = loadPrograms().bySlug.get(slug);
    if (!program) {
        return null;
    }

    const { aliases, ...publicProgram } = program;
    return publicProgram;
}

function getBootstrapData() {
    const loaded = loadPrograms();
    return {
        programs: loaded.programs.map((program) => {
            const { aliases, ...publicProgram } = program;
            return publicProgram;
        }),
        profiles: loaded.profiles,
        traitLabels: loaded.traitLabels
    };
}

module.exports = {
    dbPath: dataPath,
    getBootstrapData,
    getLegacyPrograms,
    getLegacyProgramBySlug
};
