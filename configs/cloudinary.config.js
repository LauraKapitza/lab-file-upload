const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET 
})

const storage = new CloudinaryStorage({
  //cloudinary: cloudinary
  cloudinary,
  params: { // see: https://cloudinary.com/documentation/image_upload_api_reference#optional_parameters
    folder: 'Lab-File-Upload',
    allowedFormats:['jpg', 'png'],
    public_id: (req, file) => file.originalname
  }
});

const uploadCloud = multer({storage}) //storage: storage
module.exports = uploadCloud;