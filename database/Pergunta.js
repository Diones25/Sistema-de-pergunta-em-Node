const Sequelize = require("sequelize");
const conection = require("./database");

const Pergunta = conection.define('perguntas', {
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },

    description:{
        type: Sequelize.TEXT,
        ALLOWnULL: false
    }
});

Pergunta.sync({force: false}).then(() =>{});
module.exports = Pergunta;