import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [files, setFiles] = useState([]);
  const [jd, setJd] = useState("");
  const [uploadDone, setUploadDone] = useState(false);
  const [jdDone, setJdDone] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submittingJd, setSubmittingJd] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
    setUploadDone(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
    setUploadDone(false);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setUploadDone(false);
  };

  const uploadResumes = async () => {
    setUploading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("uploaded_files", file));
    await fetch("http://127.0.0.1:8000/upload-resumes", { method: "POST", body: formData });
    setUploading(false);
    setUploadDone(true);
  };

  const uploadJD = async () => {
    setSubmittingJd(true);
    await fetch("http://127.0.0.1:8000/upload-jd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jd }),
    });
    setSubmittingJd(false);
    setJdDone(true);
  };

  const goToResults = () => navigate("/results");

  const getFileIcon = (name) => {
    const ext = name.split(".").pop().toLowerCase();
    if (ext === "pdf") return "PDF";
    if (["doc", "docx"].includes(ext)) return "DOC";
    if (["jpg", "jpeg", "png"].includes(ext)) return "IMG";
    return "FILE";
  };

  const bothReady = uploadDone && jdDone;

  return (
    <div className="dash-root dash-root--nosidebar">
      <main className="dash-main dash-main--nosidebar">
        <header className="dash-header">
          <div className="dash-header-logo">
            <span className="logo-icon">&#11042;</span>
            <span className="logo-text">TalentIQ</span>
          </div>
          
        </header>

        <div className="dash-grid">
          {/* Resume Upload Card */}
          <div className="dash-card">
            <div className="card-header">
              <div className="card-icon card-icon--blue">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                  <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                  <line x1="12" y1="12" x2="12" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="9" y1="15" x2="15" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <h2 className="card-title">Upload Resumes</h2>
                <p className="card-subtitle">PDF, DOCX, JPG, PNG supported</p>
              </div>
              {files.length > 0 && <span className="card-badge">{files.length}</span>}
            </div>

            <div
              className={`dropzone ${dragging ? "dropzone--active" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input").click()}
            >
              <input
                id="file-input"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <div className="dropzone-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <p className="dropzone-text">{dragging ? "Drop files here" : "Drag and drop or click to browse"}</p>
              <p className="dropzone-hint">Bulk upload supported</p>
            </div>

            {files.length > 0 && (
              <div className="file-list">
                {files.map((file, i) => (
                  <div key={i} className="file-item">
                    <span className="file-type-badge">{getFileIcon(file.name)}</span>
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">{(file.size / 1024).toFixed(0)} KB</span>
                    <button className="file-remove" onClick={() => removeFile(i)}>x</button>
                  </div>
                ))}
              </div>
            )}

            <button
              className={`action-btn ${uploadDone ? "action-btn--success" : ""}`}
              onClick={uploadResumes}
              disabled={files.length === 0 || uploading}
            >
              {uploading ? "Uploading..." : uploadDone ? "Uploaded" : "Upload Resumes"}
            </button>
          </div>

          {/* JD Card */}
          <div className="dash-card">
            <div className="card-header">
              <div className="card-icon card-icon--purple">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h2 className="card-title">Job Description</h2>
                <p className="card-subtitle">Paste the full JD for semantic matching</p>
              </div>
              {jdDone && <span className="card-badge card-badge--purple">Ready</span>}
            </div>

            <textarea
              className="jd-textarea"
              placeholder="Paste the full job description here..."
              value={jd}
              onChange={(e) => { setJd(e.target.value); setJdDone(false); }}
            />

            <div className="jd-footer">
              <span className="jd-charcount">{jd.length} characters</span>
              <button
                className={`action-btn ${jdDone ? "action-btn--success" : ""}`}
                onClick={uploadJD}
                disabled={!jd.trim() || submittingJd}
                style={{ width: "auto", marginTop: 0 }}
              >
                {submittingJd ? "Submitting..." : jdDone ? "Submitted" : "Submit JD"}
              </button>
            </div>
          </div>
        </div>

        {/* Run Analysis banner — only shows after BOTH buttons clicked */}
        {bothReady && (
          <div className="ready-banner">
            <div className="ready-left">
              <span className="ready-dot" />
              <span>
                <strong>{files.length} resume{files.length > 1 ? "s" : ""}</strong> and JD ready — AI ranking takes ~10 seconds
              </span>
            </div>
            <button className="rank-btn rank-btn--banner" onClick={goToResults}>
              Run Analysis
            </button>
          </div>
        )}

        {/* Step hints when not ready yet */}
        {!bothReady && (
          <div className="steps-hint">
            <div className={`step-hint-item ${uploadDone ? "step-hint-item--done" : ""}`}>
              <span className="step-hint-num">{uploadDone ? "✓" : "1"}</span>
              Upload your resumes
            </div>
            <div className="step-hint-arrow">→</div>
            <div className={`step-hint-item ${jdDone ? "step-hint-item--done" : ""}`}>
              <span className="step-hint-num">{jdDone ? "✓" : "2"}</span>
              Submit the job description
            </div>
            <div className="step-hint-arrow">→</div>
            <div className="step-hint-item step-hint-item--locked">
              <span className="step-hint-num">3</span>
              Run Analysis
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
