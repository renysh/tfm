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

    try {

         // 1. Creación de la consulta a ejecutar en la base de datos
         // se consulta si existe usuario con email proporcionado
         var qryStr = 'SELECT * FROM usuario WHERE email = $1';

         // 2. Ejecución de consulta
        pool.query(qryStr, [request.body.email], function(error, results) {
             // 3. Verificación de resultado de consulta, si hay error
             //    se devuelve el error y el mensaje
            if (error) {
                const _response = {
                    autenticado: false,
                    error: error,
                    mensaje: error.message
                };
                return response.send(_response);
            } else {
                // 4. Comprobar si existe usuario con email proporcionado
                if (results.rowCount > 0) {
                    // 5. Si hay el usuario en la BD validamos password proporcionado con password almacenado
                    var _user = results.rows[0];
                    var passwordIsValid = bcrypt.compareSync(request.body.password, _user.password);
                    // 6. Si no coinciden passwords retorna información de autenticación errónea
                    if (!passwordIsValid) {
                        return res.status(401).send(
                            { autenticado: false, mensaje:'Credenciales incorrectas' }
                        );
                    }

                    // 7. Si validación de email y password es correcta
                    // se calcula duración de token en base a parametro proporcionado en horas
                    // *** para efetos didacticos de imprime duracion de cálculo de duración y tamaño de 
                    // caracteres de parámetro duración
                    console.log('Numero caracteres duracion:'+request.body.duracion.length);
                    var start = process.hrtime();
                    var duracion = moment.duration(request.body.duracion, 'minutes');
                    var end = process.hrtime(start);

                    console.info('Tiempo ejecución (hr): %ds %dms', end[0], end[1] / 1000000);

                    // 8. Se genera token correspondiente a autenticación exitosa con secreto
                    // tomado de configuración
                    var token = jwt.sign({ id: _user.id }, config.secret, {
                        expiresIn: duracion.asSeconds()
                    });
                    // 9. Se devuelve información de autenticación exitosa
                    response.status(200).send({ 
                        autenticado: true, 
                        token: token, 
                        mensaje:'Autenticación exitosa'}
                    );
                } else {
                    // 10. Si no existe usuario con email proporcionado, retorna 
                    //  información de autenticación errónea
                    const _response = {
                        autenticado: false,
                        mensaje: 'Login incorrecto'
                    };
                    return response.send(_response);
                }
            }
        });

    } catch (err) {
        // 11. En caso de error se devuelve error y mensaje
        const _response = {
            status: false,
            error: err,
            mensaje: "Error en el servicio"
        };
        response.send(_response);
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