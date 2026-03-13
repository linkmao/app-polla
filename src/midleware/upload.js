const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // La ruta es relativa a la ubicación de este archivo
        cb(null, path.join(__dirname, '../public/img/flags'))
    },
    filename: function (req, file, cb) {
        // Sanitizamos el nombre original y añadimos un timestamp para evitar duplicados
        const fileExtension = path.extname(file.originalname);
        const fileName = file.originalname
            .split(fileExtension)[0]
            .replace(/\s+/g, '-')
            .toLowerCase();
        cb(null, `${fileName}-${Date.now()}${fileExtension}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Solo se permiten formatos .png, .jpg y .jpeg'));
        }
    }
});

module.exports = upload;
