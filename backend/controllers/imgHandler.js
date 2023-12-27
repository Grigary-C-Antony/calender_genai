const axios = require("axios");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary");
const crypto = require("crypto");

cloudinary.v2.config({
  cloud_name: "dylo5tos2",
  api_key: "338368585138337",
  api_secret: "rtoKnP0Om4GiEeIAJWJn7fT_Qls",
  secure: true,
});

const downloadImage = async (url, localPath) => {
  try {
    const response = await axios({
      method: "GET",
      url: url,
      responseType: "stream",
    });

    // Ensure that the localPath directory exists
    const directory = path.dirname(localPath);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    // Pipe the image data to a local file
    const writer = fs.createWriteStream(localPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (error) {
    console.error("Error downloading image:", error.message);
    throw error;
  }
};
const imageUploader = async (url, uuid) => {
  let result = await cloudinary.v2.uploader.upload(
    url,
    { public_id: uuid, folder: "generated_images" }
    // function (error, result) {
    //   console.log(result);
    // }
  );
  //   console.log(result);
  return result;
};
module.exports = { downloadImage, imageUploader };
