import ImageKit from "imagekit";
import dotenv from "dotenv";
dotenv.config()

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

 async function uploadfile(file, filename){
    const response = await imagekit.upload({
        file: file.buffer, 
        fileName: filename, 
        folder: "ai-based-caption", 
    });
    return response;

}

export default uploadfile;