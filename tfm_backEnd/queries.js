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


const usuarios = function(request, response) {

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

const usuarioPorId = function(request, response) {
    try {

        // 1. Creación de la consulta a ejecutar en la base de datos
        var qryStr = "SELECT id, nombre, email FROM usuario WHERE id =" + request.params.id;

        // 2. Ejecución de consulta
        pool.query(qryStr, function(error, results) {
            // 3. Verificación de resultado de consulta, si hay error se devuelve el error y el mensaje
            if (error) {
                const _response = {
                    status: false,
                    error: error,
                    mensaje: error.message
                };
                response.send(_response);
            } else {
                // 4. Si no hay  error se comprueba si hay resultados para el parametro proporcionado
                if (results.rows.length > 0) {
                    // 5. Si hay resultados se devuelve la información correspondiente
                    response.status(200).json({
                        status: true,
                        resultado: results.rows[0]
                    });
                } else {
                    // 6. Si no hay resultados se devuelve mensaje informando
                    response.status(200).json({
                        status: true,
                        mensaje: "No existen resultados para el parámetro proporcionado"
                    });
                }
            }
        })
    } catch (err) {
        // 7. En caso de error se devuelve error y mensaje
        const _response = {
            status: false,
            error: err,
            mensaje: "Error en el servicio"
        };
        response.send(_response);
    }
}

const getUserByName = function(request, response) {

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

const insertarComentario = function(request, response) {
    try {
        // 1. Obtención de parametros recibidos
        const usuario_id = request.body.usuario_id;
        const comentario = request.body.comentario;
        const fecha = new Date().toLocaleString('es-EC', {
            timeZone: 'America/Guayaquil'
        });

        // 2. Creación de la sentencia a ejecutarse en la base de datos
        pool.query('INSERT INTO comentarios (usuario_id, comentario, fecha) VALUES ($1, $2, $3)', [usuario_id, comentario, fecha], function(error, results) {
            // 3. Verificación de resultado de inserción, si hay error se devuelve el error y el mensaje
            if (error) {
                const _response = {
                    status: false,
                    error: error,
                    mensaje: error.message
                };
                response.send(_response);
            } else {
                // 4. Si no hay  error se devuelve mensaje informativo de guardado exitoso
                response.status(200).json({
                    status: true,
                    mensaje: "Comentario guardado exitosamente"
                });
            }
        });
    } catch (err) {
        // 5. En caso de error se devuelve error y mensaje
        const _response = {
            status: false,
            error: err,
            mensaje: "Error en el servicio"
        };
        response.send(_response);
    }
}


const obtenerTodosComentarios = function(request, response) {
    console.log('LLega a obtener comentarios de IP:'+ request.connection.remoteAddress);

    try {
        pool.query('SELECT * FROM comentarios ORDER BY id ASC', function(error, results) {
            if (error) {
                const _response = {
                    status: false,
                    error: error,
                    mensaje: error.message
                };
                response.send(_response);
            } else {
                // 5. Si hay resultados se devuelve la información correspondiente
                response.status(200).json({
                    status: true,
                    comentarios: results.rows
                });
            }
        });
    } catch (err) {
        // 5. En caso de error se devuelve error y mensaje
        const _response = {
            status: false,
            error: err,
            mensaje: "Error en el servicio"
        };
        response.send(_response);
    }
}


const obtenerDatosPago = function(request, response) {

    try {
        // 1. Creación de la consulta a ejecutar en la base de datos
        var qryStr = 'SELECT tipo, proveedor, numero ' +
            'FROM datospago where user_id = $1';

        // 2. Ejecución de consulta
        pool.query(qryStr, [request.params.usuario_id],
            function(error, results) {
                // 3. Verificación de resultado de consulta, si hay error
                //    se devuelve el error y el mensaje
                if (error) {
                    const _response = {
                        status: false,
                        error: error,
                        mensaje: error.message
                    };
                    response.send(_response);
                } else {
                    // 4. Se devuelve la información correspondiente
                    response.status(200).json({
                        status: true,
                        comentarios: results.rows
                    });
                }
            });
    } catch (err) {
        // 5. En caso de error se devuelve error y mensaje
        const _response = {
            status: false,
            error: err,
            mensaje: "Error en el servicio"
        };
        response.send(_response);
    }
}

const login = function(request, response) {

    console.log('Llega al login');

    try {

        const fecha_inicio_login = new Date().toLocaleString('es-EC', {
            timeZone: 'America/Guayaquil'
        });

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

        pool.query('SELECT * FROM usuario WHERE email = $1', [request.body.email], function(error, results) {

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
                    if (!passwordIsValid) return res.status(401).send({ autenticado: false, token: null });

                    console.log(moment().format('[Inicia] h:mm:ss SSS'));

                    var duracion = moment.duration(request.body.duracion, 'hours');

                    console.log(moment().format('[finaliza] h:mm:ss SSS'));

                    var token = jwt.sign({ id: _user.id }, config.secret, {
                        expiresIn: duracion.asSeconds()
                    });

                    //return response.status(200).json(results.rows);
                    response.status(200).send({ autenticado: true, token: token });
                } else {
                    const _response = {
                        autenticado: false,
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

const registro = function(request, response) {

    console.log('Llega al registro');

    try {

        var emailExpression = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

        var validEmail = emailExpression.test(request.body.email);

        if(validEmail) {
            var passwordHasheado = bcrypt.hashSync(request.body.password, 8);
            
            pool.query('INSERT INTO usuario(nombre, email, password) VALUES ($1, $2, $3)', 
                        [request.body.nombre, request.body.email, passwordHasheado], function(error, result) {
                if (error) {
                    const _response = {
                        status: false,
                        error: error,
                        mensaje: error.message
                    };
                    response.send(_response);
                } else {
                    console.log(result);
                    response.status(200).json({
                        status: true,
                        mensaje: "Usuario creado exitosamente"
                    });
                }

            });
            
        }else {
            response.status(200).json({
                status: false,
                mensaje: "Email inválido"
            });         
        }

    } catch (err) {
        // 5. En caso de error se devuelve error y mensaje
        const _response = {
            status: false,
            error: err,
            mensaje: "Error en el servicio"
        };
        response.send(_response);
    }
}


var genstr = function(len, chr) {
    var result = "";
    for (i = 0; i <= len; i++) {
        result = result + chr;
    }

    return result;
}

module.exports = {
    usuarios,
    usuarioPorId,
    getUserByName,
    obtenerTodosComentarios,
    insertarComentario,
    obtenerDatosPago,
    login,
    registro
}