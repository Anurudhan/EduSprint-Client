import React from "react";
import { Upload } from "lucide-react";

const ThumbnailUpload: React.FC<{
  onUpload: (file: File) => void;
  thumbnailPreview: string | null;
}> = ({ onUpload, thumbnailPreview }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Thumbnail</label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
        <div className="space-y-1 text-center">
          {thumbnailPreview ? (
            <img
              src={thumbnailPreview}
              alt="Thumbnail preview"
              className="mx-auto h-32 w-32 object-cover rounded"
            />
          ) : (
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
          )}
          <div className="flex text-sm text-gray-600">
            <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
              <span>Upload a file</span>
              <input
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onUpload(file);
                  }
                }}
              />
            </label>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>
    </div>
  );
};

export default ThumbnailUpload;
