const { getLegacyPrograms } = require('../../server/db');

module.exports = (_req, res) => {
    res.status(200).json({
        programs: getLegacyPrograms()
    });
};
