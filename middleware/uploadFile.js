const multer = require('multer');
const path = require('path');

function uploadFile() {
    const storage = multer.diskStorage({
        destination: './public/uploads',
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
        }
    });

    const typeFilter = (req, file, cb) => {
        const extensionesPermitidas = ['.jpg', '.jpeg', '.png', '.webp'];
        const extension = path.extname(file.originalname).toLowerCase();

        if (extensionesPermitidas.includes(extension)) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten imágenes (jpg, jpeg, png, webp)'));
        }
    };

    const upload = multer({ 
        storage: storage, 
        limits: { fileSize: 2 * 1024 * 1024 },  // Límite de 2MB
        fileFilter: typeFilter 
    }).single('avatar');
    
    return upload;
};

module.exports = { uploadFile };