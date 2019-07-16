var config = require('./config');
var moment = require('moment');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');


const Pool = require('pg').Pool
const pool = new Pool({
    user: config.userBD,
    host: config.hostBD,
    database: config.databaseName,
    password: config.passwordBD,
    port: config.postBDNumber,
})


const getUsers = function (request, response) {

    try {
        pool.query('SELECT * FROM users ORDER BY id ASC', function (error, results) {
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

        pool.query(qryStr, function (error, results) {
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
        pool.query(qryStr, function (error, results) {
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

        pool.query('INSERT INTO comentarios (nombre, calificacion, comentario) VALUES ($1, $2, $3)', [nombre, calificacion, comentario], function (error, results) {
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
        pool.query('SELECT * FROM comentarios ORDER BY id ASC', function (error, results) {
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


const getDatosPago = function (request, response) {

    try {
        pool.query('SELECT tipo, proveedor, numero '
            + 'FROM datospago where user_id = $1', [request.params.userId], function (error, results) {
                if (error) {
                    const _response = {
                        error: error,
                        message: error.message
                    };
                    response.send(_response);
                } else {
                    /*var r = /([a-z]+)+$/
                    var s = 'aaaaaaaaaaaaaa!'
    
                    console.log('Running regular expression... please wait')
                    console.time('benchmark')
    
                    r.test(s)
    
                    console.timeEnd('benchmark')*/
                    response.status(200).json(results.rows)
                }
            });
    } catch (err) {
        response.send(err);
    }
}

const login = function (request, response) {

    console.log('Llega al login');

    try {

        /*for (i = 20000000; i <= 100000000; i = i + 20000000) {
            console.log("COUNT: " + i);
            var str = '-' + genstr(i, '1')
            //console.log(str);
            console.log("LENGTH: " + str.length);
            var start = process.hrtime();
            moment.duration(str, 'minutes');

            var end = process.hrtime(start);
            console.log(end);
        }*/

        //var hashedPassword = bcrypt.hashSync(request.body.password, 8);
        //console.log(hashedPassword);
        //console.log(request.body.email);

        pool.query('SELECT * FROM users WHERE email = $1', [request.body.email], function (error, results) {

            if (error) {
                const _response = {
                    auth: false,
                    error: error,
                    message: error.message
                };
                return response.send(_response);
            } else {
                if (results.rowCount > 0) {
                    //Si hay el usuario en la BD
                    var _user = results.rows[0];
                    var passwordIsValid = bcrypt.compareSync(request.body.password, _user.password);
                    console.log(passwordIsValid);
                    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

                    var duracion = moment.duration(request.body.duracion, 'hours');

                    //console.log(duracion.asSeconds());

                    var token = jwt.sign({ id: _user.id }, config.secret, {
                        expiresIn: 84000
                    });

                    //return response.status(200).json(results.rows);
                    response.status(200).send({ auth: true, token: token });
                } else {
                    const _response = {
                        auth: false,
                        message: 'Login incorrecto'
                    };
                    return response.send(_response);
                }
                //var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

                /*var r = /([a-z]+)+$/
                var s = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!'

                console.log('Running regular expression... please wait')
                console.time('benchmark')

                r.test(s)

                console.timeEnd('benchmark')*/
            }
        });

        /*console.log('antes de calcular el duration');
        var _retorno = moment.duration(100);
        console.log('luego de calcular el duration');

        for (i = 20000000; i <= 100000000; i = i + 20000000) {
            console.log("COUNT: " + i);
            var str = '-' + genstr(i, '1')
            //console.log(str);
            console.log("LENGTH: " + str.length);
            var start = process.hrtime();
            moment.duration(str)

            var end = process.hrtime(start);
            console.log(end);
        }

        response.send(_retorno);*/
    } catch (err) {
        response.send(err);
    }

}

const registro = function (request, response) {

    console.log('Llega al registro');

    try {

        var emailExpression = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

        var validEmail = emailExpression.test(request.body.email);

        const _response = {
            respuesta: validEmail
        };
        return response.send(_response);

    } catch (err) {
        response.send(err);
    }

}


var genstr = function (len, chr) {
    var result = "";
    for (i = 0; i <= len; i++) {
        result = result + chr;
    }

    return result;
}

module.exports = {
    getUsers,
    getUserById,
    getUserByName,
    getComentarios,
    insertComentario,
    getDatosPago,
    login,
    registro
}