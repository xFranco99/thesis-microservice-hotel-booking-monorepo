import axios from "axios";
import { useState } from "react";

function AiRagTable() {
  const [selectedFile, setSelectedFile] = useState<File>();

  async function handleSubmit() {
    if (!selectedFile) {
      alert("Please select a file before uploading.");
      return;
    }

    const apiBaseUrl = import.meta.env.VITE_AI_SERVICE_BASE_URL;
    const url = `${apiBaseUrl}/api/v1/ai/upload-rag-file`;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading file. Please retry later or contact support.");
    }
  }

  return (
    <div
      style={{
        maxHeight: "70vh",
        overflow: "auto",
        border: "1px solid black",
        borderRadius: "7px",
        boxShadow: "5px 10px",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "10px",
          padding: "10px",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <div className="mb-3">
          <h2 className="modal-title">RAG manager</h2>
          <br></br>
          <br></br>
          <label className="form-label">Update the RAG file</label>
          <input
            className="form-control"
            type="file"
            id="formFile"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setSelectedFile(e.target.files[0]);
              }
            }}
          />
          <br></br>
          <button className="btn btn-outline-primary" onClick={handleSubmit}>Update</button>
        </div>
      </div>
    </div>
  );
}

export default AiRagTable;
