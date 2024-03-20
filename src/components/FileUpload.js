import { useState, useRef } from "react";

const encodeImg = (imageFile, textToEncode) => {
  const reader = new FileReader();
  reader.readAsDataURL(imageFile);
  reader.onloadend = () => {
    const imageUrl = reader.result;
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const width = img.width;
      const height = img.height;
      canvas.width = width;
      canvas.height = height;

      context.drawImage(img, 0, 0);

      // Get image data and extract individual pixel RGB codes
      const imageData = context.getImageData(0, 0, width, height);
      const data = imageData.data;
      const pixelRgbArray = [];

      const octalTextArray = textToOctal(textToEncode);

      for (let i = 0; i < data.length; i += 4) {
        const rgb = {
          r: data[i],
          g: data[i + 1],
          b: data[i + 2],
        };
        pixelRgbArray.push(rgb);
      }
      console.log(pixelRgbArray);

      console.log(octalTextArray);
    };
  };
};

function textToOctal(text) {
  const octalArray = [];
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i).toString(8); // Convert character code to octal string
    octalArray.push(charCode.padStart(3, "0")); // Pad with leading zeros, push to array
  }
  return octalArray;
}

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

    // Display the encoded image Update image URL state
    // reader.onloadend = () => setEncodedImgUrl(reader.result);
    encodeImg(selectedFile, textToEncode);
  };

  return (
    <>
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
    </>
  );
};

export default FileUpload;
