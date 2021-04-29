const Sequilize = require("sequelize");

const connection = new Sequilize('guiaperguntas', 'root', 'libriano25',{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;