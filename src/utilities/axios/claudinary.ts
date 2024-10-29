import axios from "axios";

export const uploadToCloudinary = async (ImageFile:File|string|undefined):Promise<string|undefined>=>{
    if(ImageFile == undefined) return undefined
    const formData = new FormData();
    formData.append('file',ImageFile);
    formData.append('upload_preset','EduSprint');
    try {
        const {data} = await axios.post('https://api.cloudinary.com/v1_1/dgbjmp4ad/image/upload',formData,{withCredentials:false})
        console.log(data);
        return data.secure_url
    } catch (error) {
        console.log(error)
        return undefined
    }
}