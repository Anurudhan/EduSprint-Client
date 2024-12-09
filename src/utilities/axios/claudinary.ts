import axios from "axios";

export const uploadToCloudinary = async (ImageFile:File|string|undefined):Promise<string>=>{
    if(ImageFile == undefined) return ""
    const formData = new FormData();
    formData.append('file',ImageFile);
    formData.append('upload_preset','EduSprint');
    try {
        const {data} = await axios.post('https://api.cloudinary.com/v1_1/dgbjmp4ad/image/upload',formData,{withCredentials:false})
        console.log(data);
        return data.secure_url
    } catch (error) {
        console.log(error)
        return ""
    }
}

export const uploadVideoToCloudinary = async (
    videoFile: File | string | undefined,
    onProgress: (progress: number) => void // Progress callback
  ): Promise<string | undefined> => {
    if (!videoFile) return undefined;
  
    const formData = new FormData();
    formData.append("file", videoFile);
    formData.append("upload_preset", "EduSprint");
  
    try {
      const { data } = await axios.post(
        "https://api.cloudinary.com/v1_1/dgbjmp4ad/video/upload",
        formData,
        {
          withCredentials: false,
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(progress); 
          },
        }
      );
  
      console.log(data);
      return data.secure_url;
    } catch (error) {
      console.error("Video upload failed:", error);
      return undefined;
    }
  };