// FilePreview.js
import React from "react";

function FilePreview({ url, filename }) {
  const isPDF = filename.toLowerCase().endsWith(".pdf");
  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(filename.toLowerCase());
  console.log("Rendering FilePreview:", url, filename);

  if (isPDF) {
    return (
      <div style={{ border: "1px ", padding: "0.5rem" }}>
        <div><strong>{filename}</strong></div>
        <iframe
          src={url}
          title={filename}
          style={{ width: "100%", height: "300px", border: "none" }}
        ></iframe>
      </div>
    );
  }

  if (isImage) {
    return (
      <div style={{ border: "1px", padding: "0.5rem" }}>
        <div><strong>{filename}</strong></div>
        <img
          src={url}
          alt={filename}
          style={{ maxWidth: "100%", maxHeight: "300px", objectFit: "contain" }}
        />
      </div>
    );
  }

  return (
    <div>
      <a href={url} target="_blank" rel="noopener noreferrer">
        {filename}
      </a>
    </div>
  );
}

export default FilePreview;