const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

const db = require('./queries')

app.use(bodyParser.json({
    limit: '50mb',
    extended: true
}));
app.use(
    bodyParser.urlencoded({
        limit: '50mb',
        extended: true
    })
);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

app.get('/', function(request, response) {
    response.json({ info: 'Servicios Web Rest Vulnerables' })
});


app.get('/rest/usuarios', db.usuarios);
app.get('/rest/usuario/:id', db.usuarioPorId);
app.post('/rest/usuario/userByName', db.getUserByName);
app.get('/rest/obtenerTodosComentarios', db.obtenerTodosComentarios);
app.post('/rest/insertarComentario', db.insertarComentario);

app.get('/rest/usuario/obtenerDatosPago/:usuario_id', db.obtenerDatosPago);
app.post('/rest/usuario/login', db.login);
app.post('/rest/registro', db.registro);

app.listen(port, 'localhost', function() {

});