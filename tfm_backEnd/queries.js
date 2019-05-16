
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'tfm',
    password: 'root',
    port: 5432,
})

const getUsers = function (request, response) {

    try {
        pool.query('SELECT * FROM users ORDER BY id ASC', function(error, results) {
            if (error) {
                const _response = {
                    error: error,
                    message: error.message
                };
                response.send(_response);
            } else {
                response.status(200).json(results.rows);
            }
        });
    } catch (err) {
        response.send(err);
    }
}

const getUserById = function (request, response) {
    //const id = parseIt(request.params.id)

    try {
        var qryStr = "SELECT id, name, email FROM users WHERE id =" + request.params.id;

        console.log(qryStr);

        pool.query(qryStr, function(error, results) {
            if (error) {
                const _response = {
                    error: error,
                    message: error.message
                };
                console.log(_response);
                response.send(_response);
                //throw error;
            } else {
                response.status(200).json(results.rows);
            }

        })
    } catch (err) {
        response.send(err);
    }

}

const getUserByName = function (request, response) {

    try {
        var qryStr = "SELECT id, name, email FROM users WHERE name ='" + request.body.name + "'";
        console.log(qryStr);
        pool.query(qryStr, function(error, results) {
            if (error) {
                const _response = {
                    error: error,
                    message: error.message
                };
                response.send(_response);
            } else {
                response.status(200).json(results.rows)
            }

        })
    } catch (err) {
        response.send(err);
    }
}

const insertComentario = function (request, response) {

    try {
        const nombre = request.body.nombre;
        const calificacion = request.body.calificacion;
        const comentario = request.body.comentario;

        pool.query('INSERT INTO comentarios (nombre, calificacion, comentario) VALUES ($1, $2, $3)', [nombre, calificacion, comentario], function(error, results) {
            if (error) {
                const _response = {
                    error: error,
                    message: error.message
                };
                response.send(_response);
            } else {
                response.status(201).send('Comentario guardado exitosamente');
            }
        });
    } catch (err) {
        response.send(err);
    }
}


const getComentarios = function (request, response) {

    try {
        pool.query('SELECT * FROM comentarios ORDER BY id ASC', function(error, results) {
            if (error) {
                const _response = {
                    error: error,
                    message: error.message
                };
                response.send(_response);
            } else {
                response.status(200).json(results.rows)
            }
        });
    } catch (err) {
        response.send(err);
    }
}


module.exports = {
    getUsers: getUsers,
    getUserById: getUserById,
    getUserByName: getUserByName,
    getComentarios: getComentarios,
    insertComentario: insertComentario
}