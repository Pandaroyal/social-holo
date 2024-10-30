import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    let format = 'png'; // Default format
    console.log("in config file -> ",file);
    console.log("in config file buffer -> ",file.buffer);
    // Determine format based on the file type
    const mimetype = file.mimetype;
    if (mimetype.includes('png')) {
      format = 'png';
    } else if (mimetype.includes('jpg') || mimetype.includes('jpeg')) {
      format = 'jpg';
    } 
    return {
      folder: 'social_holo', // Specify the Cloudinary folder
      format: format,
      public_id: file.originalname.split('.')[0], // Optional file naming
    }
  },
});

export { storage };
