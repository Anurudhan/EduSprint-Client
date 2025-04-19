// import React, { useState, useRef } from "react";
// import { Upload, Camera, Image, AlertCircle, Check } from "lucide-react";



// const ThumbnailUpload: React.FC<{
//   onUpload: (file: File) => void;
//   thumbnailPreview: string | null;
//   error?: string;
// }> = ({ onUpload, thumbnailPreview, error }) => {
//   const [dragActive, setDragActive] = useState<boolean>(false);
//   const [fileError, setFileError] = useState<string>("");
//   const [fileName, setFileName] = useState<string>("");
//   const inputRef = useRef<HTMLInputElement>(null);

//   const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   };

//   const validateFile = (file: File): boolean => {
//     // Check file type
//     const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
//     if (!validTypes.includes(file.type)) {
//       setFileError("Please upload a valid image file (JPEG, PNG, GIF, or WEBP)");
//       return false;
//     }

//     // Check file size (10MB max)
//     const maxSize = 10 * 1024 * 1024; // 10MB in bytes
//     if (file.size > maxSize) {
//       setFileError("File size must be less than 10MB");
//       return false;
//     }

//     setFileError("");
//     return true;
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);

//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       const file = e.dataTransfer.files[0];
//       if (validateFile(file)) {
//         setFileName(file.name);
//         onUpload(file);
//       }
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     e.preventDefault();

//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       if (validateFile(file)) {
//         setFileName(file.name);
//         onUpload(file);
//       }
//     }
//   };

//   const handleButtonClick = () => {
//     inputRef.current?.click();
//   };

//   const displayError = fileError || error;

//   return (
//     <div className="space-y-4">
//       <div className="flex justify-between items-center">
//         <label className="block text-sm font-semibold text-gray-800">
//           Course Thumbnail <span className="text-red-500">*</span>
//         </label>
//         {thumbnailPreview && !displayError && (
//           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//             <Check size={14} className="mr-1" />
//             Thumbnail Uploaded
//           </span>
//         )}
//       </div>

//       <div
//         className={`relative border-2 rounded-lg transition duration-200 ${
//           dragActive
//             ? "border-blue-500 bg-blue-50"
//             : displayError
//             ? "border-red-300 border-dashed"
//             : thumbnailPreview
//             ? "border-green-300"
//             : "border-gray-300 border-dashed"
//         }`}
//         onDragEnter={handleDrag}
//         onDragLeave={handleDrag}
//         onDragOver={handleDrag}
//         onDrop={handleDrop}
//       >
//         <input
//           ref={inputRef}
//           type="file"
//           className="sr-only"
//           accept="image/png, image/jpeg, image/gif, image/webp"
//           onChange={handleChange}
//           id="thumbnail-upload"
//         />

//         <div className="space-y-2 p-6">
//           {thumbnailPreview ? (
//             <div className="flex flex-col items-center">
//               <div className="relative w-full max-w-md mx-auto">
//                 <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden shadow-md">
//                   <img
//                     src={thumbnailPreview}
//                     alt="Course thumbnail preview"
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <div className="mt-4 text-center">
//                   <p className="text-sm text-gray-500 truncate max-w-xs mx-auto">
//                     {fileName || "Thumbnail uploaded successfully"}
//                   </p>
//                   <button
//                     type="button"
//                     onClick={handleButtonClick}
//                     className="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                   >
//                     <Camera className="h-4 w-4 mr-2" />
//                     Replace Image
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="flex flex-col items-center py-8">
//               <div className={`rounded-full p-3 ${dragActive ? "bg-blue-100" : "bg-gray-100"}`}>
//                 <Image className={`h-8 w-8 ${dragActive ? "text-blue-600" : "text-gray-400"}`} />
//               </div>

//               <div className="mt-4 text-center">
//                 <p className="text-sm font-medium text-gray-900">
//                   {dragActive ? "Drop your image here" : "Drag & drop your course thumbnail here"}
//                 </p>
//                 <p className="text-xs text-gray-500 mt-1">
//                   PNG, JPG, GIF, or WEBP (Max 10MB)
//                 </p>
//                 <div className="mt-4">
//                   <button
//                     type="button"
//                     onClick={handleButtonClick}
//                     className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                   >
//                     <Upload className="h-4 w-4 mr-2" />
//                     Browse Files
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {displayError && (
//         <div className="rounded-md bg-red-50 p-4">
//           <div className="flex">
//             <div className="flex-shrink-0">
//               <AlertCircle className="h-5 w-5 text-red-400" />
//             </div>
//             <div className="ml-3">
//               <h3 className="text-sm font-medium text-red-800">
//                 Error with thumbnail
//               </h3>
//               <div className="mt-2 text-sm text-red-700">
//                 <p>{displayError}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="text-xs text-gray-500">
//         <p>
//           A high-quality thumbnail helps your course stand out and attract students. Recommended size:
//           1280×720 pixels (16:9 ratio).
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ThumbnailUpload;


import React, { useRef, useState } from "react";

interface ThumbnailUploadProps {
  onUpload: (file: File) => void;
  thumbnailPreview: string | null;
  error?: string;
}

const ThumbnailUpload = ({ onUpload, thumbnailPreview, error }: ThumbnailUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Course Thumbnail*</h3>
      
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
          isDragging ? "border-blue-500 bg-blue-50" : error ? "border-red-500 bg-red-50" : "border-gray-300 hover:bg-gray-50"
        }`}
      >
        {thumbnailPreview ? (
          <div className="w-full">
            <div className="relative w-full h-48 mx-auto overflow-hidden rounded-md">
              <img 
                src={thumbnailPreview} 
                alt="Course thumbnail" 
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm text-center mt-2 text-gray-500">Click or drag to replace</p>
          </div>
        ) : (
          <>
            <div className="text-4xl mb-3">📷</div>
            <p className="text-gray-600 mb-2">Drag and drop an image or click to browse</p>
            <p className="text-sm text-gray-500">Recommended size: 1280x720 pixels (16:9)</p>
          </>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default ThumbnailUpload;