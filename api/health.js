const { dbPath } = require('../server/db');

module.exports = (_req, res) => {
    res.status(200).json({
        ok: true,
        source: dbPath
    });
};
