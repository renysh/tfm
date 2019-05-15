const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

const db = require('./queries')

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method, token"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
});


app.get('/users', db.getUsers);
app.get('/users/:id', db.getUserById);
app.post('/userByName', db.getUserByName);
app.get('/comentarios', db.getComentarios);

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})
