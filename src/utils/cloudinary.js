import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // upload the file on cloudinary

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // file has been uploaded succesfully
    // console.log("File is uploaded on cloudinary", response);
    // fs.unlink(localFilePath);
    if (fs.existsSync(localFilePath)) {
      await fs.promises.unlink(localFilePath);
    }
    return response;
  } catch (error) {
    console.error("Cloudinary error", error.message);
    if (fs.existsSync(localFilePath)) {
      await fs.promises.unlink(localFilePath);
    }
    return null;
  }
};

const deleteOnCloudinary = async (public_id) => {
  try {
    const response = await cloudinary.uploader.destroy(public_id, {
      resource_type: "image",
    });
    // console.log(response);
    return response;
  } catch (error) {
    console.error("Error while deleting the file on cloudinary", error.message);
    return null;
  }
};

export { uploadOnCloudinary, deleteOnCloudinary };
