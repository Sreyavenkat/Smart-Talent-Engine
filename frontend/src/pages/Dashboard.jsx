import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [files, setFiles] = useState([]);
  const [jd, setJd] = useState("");
  const navigate = useNavigate();

  // handle file select
  const handleFileChange = (e) => {
  setFiles((prevFiles) => [
    ...prevFiles,
    ...Array.from(e.target.files)
  ]);
};

  // upload resumes
  const uploadResumes = async () => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("uploaded_files", file);
    });

    await fetch("http://127.0.0.1:8000/upload-resumes", {
      method: "POST",
      body: formData,
    });

    alert("Resumes uploaded!");
  };

  // upload JD
  const uploadJD = async () => {
    await fetch("http://127.0.0.1:8000/upload-jd", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jd }),
    });

    alert("JD uploaded!");
  };

  // go to results
  const goToResults = () => {
    navigate("/results");
  };

  return (
    <div className="dashboard-container">
      <h1 className="dash-title">Dashboard</h1>

      <div className="cards">
        
        {/* Upload Section */}
        <div className="card">
          <h2>Upload Resumes</h2>
          <input type="file" multiple onChange={handleFileChange} />
          
          <ul>
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>

          <button onClick={uploadResumes}>Upload</button>
        </div>

        {/* JD Section */}
        <div className="card">
          <h2>Job Description</h2>
          <textarea
            placeholder="Paste job description here..."
            value={jd}
            onChange={(e) => setJd(e.target.value)}
          />

          <button onClick={uploadJD}>Submit JD</button>
        </div>

      </div>

      {/* Rank Button */}
      <button className="rank-btn" onClick={goToResults}>
        Rank Candidates →
      </button>
    </div>
  );
}