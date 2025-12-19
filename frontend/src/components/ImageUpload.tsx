

function ImageUpload({label}: {label?: string}) {
  

  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">
        {label ? label : "Profile Image"}
      </label>
      <input
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
        id="file_input"
        type="file"
        accept="image/*"
      />
    </div>
  );
}

export default ImageUpload;
