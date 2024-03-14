import { useState } from "react";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [textToEncode, setTextToEncode] = useState();
  const [encodedImgUrl, setEncodedImgUrl] = useState(null);

  const handleEncode = (e) => {
    if (!selectedFile) {
      alert(`No File selected. Please select an image.`);
      return;
    }
    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validImageTypes.includes(selectedFile.type)) {
      alert(`Invalid file type. Please select an image (JPEG, PNG, or GIF).`);
      return;
    }
    alert(`Hiding the message '${textToEncode}' in ${selectedFile.name}`);

    // Display the encoded image
    const encodedImg = selectedFile;
    const reader = new FileReader();
    reader.readAsDataURL(encodedImg);
    // Update image URL state
    reader.onloadend = () => setEncodedImgUrl(reader.result);
  };

  return (
    <div>
      <div>
        <div>
          <label>Image: </label>
          <input type="file" id="fileInput" onChange={(e) => setSelectedFile(e.target.files[0])} />
        </div>
        <div>
          <label>Text to encode: </label>
          <input type="text" id="textInput" value={textToEncode} onChange={(e) => setTextToEncode(e.target.value)} />
        </div>
      </div>
      <div>
        <button onClick={handleEncode}>Encode</button>
      </div>
      <div>{encodedImgUrl && <img src={encodedImgUrl} alt="Encoded Image" />}</div>
    </div>
  );
};

export default FileUpload;
