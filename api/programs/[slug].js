const { getLegacyProgramBySlug } = require('../../server/db');

module.exports = (req, res) => {
    const slug = req.query && req.query.slug;
    const program = getLegacyProgramBySlug(slug);

    if (!program) {
        res.status(404).json({
            error: 'PROGRAM_NOT_FOUND'
        });
        return;
    }

    res.status(200).json({
        program
    });
};
