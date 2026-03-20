const path = require('path');
const express = require('express');
const { dbPath, getBootstrapData, getLegacyPrograms, getLegacyProgramBySlug } = require('./db');

const app = express();
const rootDir = path.join(__dirname, '..');
const port = Number(process.env.PORT || 4310);

app.use(express.json());
app.get('/favicon.ico', (_req, res) => {
    res.redirect(302, '/favicon.svg');
});
app.use(express.static(rootDir, {
    extensions: ['html'],
    etag: true,
    maxAge: '7d',
    setHeaders: (res, filePath) => {
        if (path.extname(filePath).toLowerCase() === '.html') {
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
        }
    }
}));

app.get('/api/health', (_req, res) => {
    res.json({
        ok: true,
        source: dbPath
    });
});

app.get('/api/bootstrap', (_req, res) => {
    res.json(getBootstrapData());
});

app.get('/api/programs', (_req, res) => {
    res.json({
        programs: getLegacyPrograms()
    });
});

app.get('/api/programs/:slug', (req, res) => {
    const program = getLegacyProgramBySlug(req.params.slug);
    if (!program) {
        res.status(404).json({
            error: 'PROGRAM_NOT_FOUND'
        });
        return;
    }

    res.json({
        program
    });
});

app.get('/', (_req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(path.join(rootDir, 'index.html'));
});

app.listen(port, () => {
    console.log(`Admissions site server is running on http://localhost:${port}`);
    console.log(`JSON source: ${dbPath}`);
});
