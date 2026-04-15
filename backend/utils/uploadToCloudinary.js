// backend/utils/uploadToCloudinary.js
const cloudinary = require('./cloudinary');
const fs = require('fs');

async function uploadToCloudinary(localPath) {
  try {
    const result = await cloudinary.uploader.upload(localPath, {
      folder: 'products',
      use_filename: true,
      unique_filename: false,
      overwrite: false
    });
    // Remove local file after upload
    fs.unlinkSync(localPath);
    return result.secure_url;
  } catch (err) {
    throw err;
  }
}

module.exports = uploadToCloudinary;
