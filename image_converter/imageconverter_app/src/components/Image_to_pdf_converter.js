import React from "react";
import jsPDF from "jspdf";

/* Image data should be in this format only "data:image/jpeg;base64,/9j/4AAQSkZJRg...", // Base64-encoded image data */

function ImageToPDFConverter({ images }) {
  const handleDownload = () => {
    const doc = new jsPDF();

    images.forEach((image, index) => {
      if (index !== 0) {
        doc.addPage();
      }
      doc.addImage(image, "JPEG", 10, 10, 190, 0);
    });

    doc.save("images.pdf");
  };

  return (
    <div>
      <button onClick={handleDownload}>Download PDF</button>
    </div>
  );
}

export default ImageToPDFConverter;