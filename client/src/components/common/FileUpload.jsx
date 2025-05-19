import { useDropzone } from "react-dropzone";

function FileUpload({ onDrop, accept, label, file }) {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
  });

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 p-4 rounded cursor-pointer hover:bg-gray-50"
      >
        <input {...getInputProps()} />
        <p className="text-center text-gray-500">
          {file ? file.name : "Drag & drop or click to upload"}
        </p>
      </div>
    </div>
  );
}

export default FileUpload;
