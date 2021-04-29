const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const conection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");
//Database

conection
    .authenticate()
    .then(() =>{
        console.log("Conexão com o Banco de Dados feita com sucesso!");
    })
    .catch((msgErro) =>{
        console.log(msgErro);
    })

//Estou dizendo ao Express usar o EJS como View engine
app.set("view engine", "ejs");

//Estou dizendo ao Express usar arquivos estáticos com css, js, na pasta public
app.use(express.static("public"));

//Body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Rotas
app.get("/", (requisicao, resposta) => {
    //findAll é o metódo que faz o papel do 'SELECT'
    Pergunta.findAll({ raw: true, order: [ ['id', 'DESC'] ] }).then(perguntas =>{
        resposta.render("index", {
            perguntas: perguntas
        });
    });
});

app.get("/pergunta/:id", (requisicao, resposta) =>{
    let id = requisicao.params.id;
    Pergunta.findOne({
        where: {id: id}
    }).then((pergunta) =>{
        if(pergunta != undefined){//Pergunta foi achada

            //Pegando todas as respostas dessa pergunta
            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order:[ ['id', 'DESC'] ]
            }).then(respostas =>{
                resposta.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                });//A resosta  é a renderização da página da pergunta
            });

        }else{//Pergunta não encontrada
            resposta.redirect("/");//Redireciona para a página home
        }
    });
});

app.get("/perguntar", (requisicao, resposta) =>{
    resposta.render("perguntar");
});

//POST porque vai receber dados do formulário 'POST'
app.post("/salvarpergunta", (requisicao, resposta) =>{
    let titulo = requisicao.body.titulo;
    let descricao = requisicao.body.descricao;
     Pergunta.create({
        title: titulo,
        description: descricao
     }).then(() =>{
         resposta.redirect("/");
     });
    
});

app.post("/responder", (requisicao, resposta) =>{
    let corpo = requisicao.body.corpo;
    let perguntaId = requisicao.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() =>{
        resposta.redirect("/pergunta/"+perguntaId);
    });
});

//Servidor
app.listen(4000, () =>{
    console.log("Servidor iniciado com sucesso!");
});