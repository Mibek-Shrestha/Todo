const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const allowedFileTypes = ['image/png', 'image/jpg', 'image/jpg']
        const comingFileType = file.mimetype
        if (!allowedFileTypes.includes(comingFileType)) {
            cb(new Error("This fileType is not accepted"))

        } else {
            cb(null, './uploads')//cb(error,success)
        }

    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + " " + file.originalname)
    }
})

module.exports = {
    multer,
    storage
}