import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [files, setFiles] = useState([]);
  const [jd, setJd] = useState("");
  const [uploadDone, setUploadDone] = useState(false);
  const [jdDone, setJdDone] = useState(false);
  const [dragging, setDragging] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
    setUploadDone(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadResumes = async () => {
    const formData = new FormData();
    files.forEach((file) => formData.append("uploaded_files", file));
    await fetch("http://127.0.0.1:8000/upload-resumes", { method: "POST", body: formData });
    setUploadDone(true);
  };

  const uploadJD = async () => {
    await fetch("http://127.0.0.1:8000/upload-jd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jd }),
    });
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

  return (
    <div className="dash-root">
      <aside className="dash-sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">&#11042;</span>
          <span className="logo-text">TalentIQ</span>
        </div>
        <nav className="sidebar-nav">
          <a className="sidebar-link sidebar-link--active" href="#">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            Dashboard
          </a>
          <a className="sidebar-link" href="#" onClick={(e) => { e.preventDefault(); goToResults(); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Results
          </a>
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-status">
            <span className={`status-dot ${files.length > 0 ? "status-dot--green" : ""}`} />
            {files.length > 0 ? `${files.length} resume${files.length > 1 ? "s" : ""} loaded` : "No files yet"}
          </div>
        </div>
      </aside>
      <main className="dash-main">
        <header className="dash-header">
          <div>
            <h1 className="dash-heading">New Analysis</h1>
            <p className="dash-subheading">Upload resumes and a job description to begin ranking</p>
          </div>
          <button
            className={`rank-btn ${files.length > 0 && jd.trim() ? "rank-btn--ready" : ""}`}
            onClick={goToResults}
            disabled={files.length === 0 || !jd.trim()}
          >
            Rank Candidates
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </header>
        <div className="dash-grid">
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
              disabled={files.length === 0}
            >
              {uploadDone ? "Uploaded" : "Upload Resumes"}
            </button>
          </div>
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
              {jd.trim() && <span className="card-badge card-badge--purple">Ready</span>}
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
                disabled={!jd.trim()}
                style={{ width: "auto", marginTop: 0 }}
              >
                {jdDone ? "Submitted" : "Submit JD"}
              </button>
            </div>
          </div>
        </div>
        {files.length > 0 && jd.trim() && (
          <div className="ready-banner">
            <div className="ready-left">
              <span className="ready-dot" />
              <span><strong>{files.length} resume{files.length > 1 ? "s" : ""}</strong> and JD ready</span>
            </div>
            <button className="rank-btn rank-btn--banner" onClick={goToResults}>
              Run Analysis
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
