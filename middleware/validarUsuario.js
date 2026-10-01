//Para validar los campos obligatorios al crear un usuario (postUsuario)
function validarCrearUsuario(req, res, next) {
    const { nombre, email, password } = req.body;

    // Para verificar que se enviaron todos los datos
    if (!nombre || !email || !password) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Los campos nombre, email y password son obligatorios'
        });
    }

    const nombreLimpio = nombre.trim();
    const emailLimpio = email.trim();
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (nombreLimpio.length < 3) {
        return res.status(400).json({
            ok: false,
            mensaje: 'El nombre debe tener al menos 3 caracteres'
        });
    }

    if (!regexEmail.test(emailLimpio)) {
        return res.status(400).json({
            ok: false,
            mensaje: 'El formato del correo electrónico no es válido'
        });
    }

    req.body.nombre = nombreLimpio;
    req.body.email = emailLimpio;

    next();
}

//Paravalidar campos al actualizar usuario (updateUsuario)
function validarActualizarUsuario(req, res, next) {
    const { nombre, email } = req.body;

    // Para verificar que se envio al menos un dato
    if (nombre === undefined && email === undefined) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se enviaron datos para actualizar'
        });
    }

    // Para validar nombre si se ingreso nombre
    if (nombre !== undefined) {
        const nombreLimpio = nombre.trim();
        if (nombreLimpio.length < 3) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El nombre debe tener al menos 3 caracteres'
            });
        }
        req.body.nombre = nombreLimpio;
    }

    // Para validar email si se ingreso email
    if (email !== undefined) {
        const emailLimpio = email.trim();
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regexEmail.test(emailLimpio)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El formato del correo electrónico no es válido'
            });
        }
        req.body.email = emailLimpio;
    }
    next();
}

module.exports = {
    validarCrearUsuario,
    validarActualizarUsuario
};