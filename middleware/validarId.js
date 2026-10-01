function validarId(req, res, next) {
    const { id } = req.params;

    if (!id || isNaN(id) || parseInt(id) <= 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Id de usuario inválido'
        });
    }
    next();
}

module.exports = { validarId };