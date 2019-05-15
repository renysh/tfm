
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'tfm',
    password: 'root',
    port: 5432,
})

const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getUserById = (request, response) => {
    //const id = parseIt(request.params.id)

    var qryStr = "SELECT id, name, email FROM users WHERE id =" + request.params.id;

    console.log(qryStr);

    pool.query(qryStr, (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getUserByName = (request, response) => {
    //const id = parseIt(request.params.id)

    console.log(request);

    var qryStr = "SELECT id, name, email FROM users WHERE name ='" + request.body.name+"'";

    console.log(qryStr);

    pool.query(qryStr, (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getComentarios = (request, response) => {
    pool.query('SELECT * FROM comentarios ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}


module.exports = {
    getUsers,
    getUserById,
    getUserByName,
    getComentarios
}