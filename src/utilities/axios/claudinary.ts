import axios from "axios";

export const uploadToCloudinary = async (ImageFile: File | string | undefined): Promise<string> => {
  if (ImageFile == undefined) return "";
  const formData = new FormData();
  formData.append('file', ImageFile);
  formData.append('upload_preset', 'EduSprint');
  try {
    const { data } = await axios.post('https://api.cloudinary.com/v1_1/dgbjmp4ad/image/upload', formData, { withCredentials: false });
    console.log(data);
    return data.secure_url;
  } catch (error) {
    console.log(error);
    return "";
  }
};

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
          // Check if progressEvent.total exists and is not zero to avoid division by zero
          if (progressEvent.total && progressEvent.total > 0) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(progress);
          } else {
            // If total is undefined or zero, we can't calculate accurate progress
            // Just use loaded bytes as a fallback indicator
            onProgress(Math.round(progressEvent.loaded / 1024)); // Convert to KB as a simple progress indicator
          }
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

const extractPublicIdFromUrl = (url: string): string => {
  try {
    // Parse the URL to extract the public ID
    const urlParts = url.split('/');
    const fileNameWithExtension = urlParts[urlParts.length - 1];
    
    // Get the filename without extension
    const fileName = fileNameWithExtension.split('.')[0];
    
    // Construct the folder path (if any) + filename
    const uploadIndex = urlParts.indexOf('upload');
    if (uploadIndex !== -1 && uploadIndex < urlParts.length - 2) {
      // If there are folders after "upload" and before the filename
      const folderPath = urlParts.slice(uploadIndex + 1, urlParts.length - 1).join('/');
      return folderPath ? `${folderPath}/${fileName}` : fileName;
    }
    
    return fileName;
  } catch (error) {
    console.error("Error extracting public ID:", error);
    throw new Error("Invalid Cloudinary URL format");
  }
};

/**
 * Deletes a file from Cloudinary using its URL
 * @param url The Cloudinary URL of the file to delete
 * @returns A promise that resolves when deletion is complete
 */
export const deleteFromCloudinary = async (url: string): Promise<boolean> => {
  if (!url || !url.includes('cloudinary.com')) {
    console.warn("Not a valid Cloudinary URL:", url);
    return false;
  }

  try {
    const publicId = extractPublicIdFromUrl(url);
    const isImage = url.includes('/image/upload/');
    
    // Configure the delete request
    await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}/course/cloudinary/delete`, {
      publicId,
      resourceType: isImage ? 'image' : 'video',
      timestamp: Math.round(new Date().getTime() / 1000),
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
      apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY
    });
    
    console.log(`Successfully deleted ${isImage ? 'image' : 'video'} from Cloudinary:`, publicId);
    return true;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return false;
  }
};