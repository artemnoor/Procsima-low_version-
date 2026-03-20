const { getBootstrapData } = require('../server/db');

module.exports = (_req, res) => {
    res.status(200).json(getBootstrapData());
};
