import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function Landing() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.4 + 0.1,
    }));
    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${p.opacity})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="landing-root">
      <canvas ref={canvasRef} className="landing-canvas" />
      <nav className="landing-nav">
        <div className="nav-logo">
          <span className="logo-icon">&#11042;</span>
          <span className="logo-text">TalentIQ</span>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          
        </div>
      </nav>
      <section className="hero">
        <div className="hero-badge">
          <span className="badge-dot" />
          Smart Talent Selection Engine
        </div>
        <h1 className="hero-title">
          Hire the <span className="gradient-text">right talent</span>,<br />
          not the right keywords
        </h1>
        <p className="hero-subtitle">
          Stop rejecting qualified candidates because their resume says "led" instead of "managed".
          TalentIQ understands intent, ranking candidates by actual fit, not terminology tricks.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => navigate("/dashboard")}>
            Start Ranking Candidates
          </button>
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-num">10x</span>
            <span className="stat-label">faster shortlisting</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-num">94%</span>
            <span className="stat-label">match accuracy</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-num">1000+</span>
            <span className="stat-label">resumes per batch</span>
          </div>
        </div>
      </section>
      <section className="features-section" id="features">
        <p className="section-eyebrow">Capabilities</p>
        <h2 className="section-title">Everything a modern recruiter needs</h2>
        <div className="features-grid">
          <div className="feature-card feature-card--accent">
            <div className="feature-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>Multi-Format Ingestion</h3>
            <p>Upload PDF, DOCX, or image resumes in bulk. Handles two-column layouts, sidebars, and tables without corrupting structure.</p>
            <div className="feature-tags"><span>PDF</span><span>DOCX</span><span>JPG/PNG</span></div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>Semantic Understanding</h3>
            <p>Goes beyond keyword matching to understand the actual meaning and intent of experience. Directed equals Led equals Managed.</p>
            <div className="feature-tags"><span>NLP</span><span>Embeddings</span></div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Ranked Shortlist</h3>
            <p>Get a ranked list with a 0-100% compatibility score and a 2-sentence AI-generated fit summary for top matches.</p>
            <div className="feature-tags"><span>Scoring</span><span>AI Summaries</span></div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>JD Intelligence</h3>
            <p>Paste any job description and TalentIQ extracts required skills, experience depth, and implicit signals automatically.</p>
            <div className="feature-tags"><span>Auto-parse</span><span>JD Analysis</span></div>
          </div>
        </div>
      </section>
      <section className="cta-banner">
        <div className="cta-content">
          <h2>Ready to find your next great hire?</h2>
          <p>Upload your first batch of resumes free. No credit card required.</p>
          <button className="btn-primary btn-large" onClick={() => navigate("/dashboard")}>
            Open Dashboard
          </button>
        </div>
        <div className="cta-glow" />
      </section>
      <footer className="landing-footer">
        <span style={{ fontSize: "13px", opacity: 0.5 }}>TalentIQ</span>
      </footer>
    </div>
  );
}
