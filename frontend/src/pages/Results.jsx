import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Results() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [animatedScores, setAnimatedScores] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/rank-candidates");
        const data = await res.json();
        setCandidates(data.ranked_candidates);
        setTimeout(() => {
          const scores = {};
          data.ranked_candidates.forEach((c, i) => { scores[i] = c.score; });
          setAnimatedScores(scores);
        }, 200);
      } catch {
        setError(true);
      }
      setLoading(false);
    };
    fetchResults();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 80) return "score-high";
    if (score >= 60) return "score-mid";
    return "score-low";
  };

  const getRankLabel = (index) => {
    if (index === 0) return { label: "Top Match", cls: "rank-gold" };
    if (index === 1) return { label: "2nd", cls: "rank-silver" };
    if (index === 2) return { label: "3rd", cls: "rank-bronze" };
    return { label: `#${index + 1}`, cls: "rank-default" };
  };

  return (
    <div className="results-root">
      <header className="results-header">
        <div className="results-header-left">
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
          <div className="results-header-title">
            <span className="logo-icon">&#11042;</span>
            <span className="logo-text">TalentIQ</span>
          </div>
        </div>
        {!loading && !error && (
          <div className="meta-chip">
            <span className="meta-dot" />
            {candidates.length} candidates ranked
          </div>
        )}
      </header>
      <div className="results-body">
        <div className="results-title-row">
          <div>
            <h1 className="results-title">Candidate Rankings</h1>
            <p className="results-subtitle">Sorted by semantic match score</p>
          </div>
        </div>
        {loading && (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p className="loading-text">Analyzing candidates with AI</p>
            <p className="loading-hint">Semantic matching across all resumes</p>
          </div>
        )}
        {error && (
          <div className="error-state">
            <div className="error-icon">!</div>
            <h3>Could not fetch results</h3>
            <p>Make sure the backend is running at localhost:8000</p>
            <button className="action-btn" style={{ width: "auto", margin: "0 auto" }} onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </button>
          </div>
        )}
        {!loading && !error && (
          <>
            {candidates.length > 0 && (
              <div className="spotlight-card">
                <div className="spotlight-badge">Top Match</div>
                <div className="spotlight-body">
                  <div className="spotlight-left">
                    <div className="candidate-avatar">{candidates[0].filename?.charAt(0).toUpperCase() || "?"}</div>
                    <div>
                      <h2 className="spotlight-name">{candidates[0].filename}</h2>
                      <p className="spotlight-exp">{candidates[0].experience} years experience</p>
                    </div>
                  </div>
                  <div className="spotlight-score-wrap">
                    <div className={`spotlight-score ${getScoreColor(candidates[0].score)}`}>{candidates[0].score}%</div>
                    <span className="spotlight-score-label">Match Score</span>
                  </div>
                </div>
                <div className="spotlight-skills">
                  {candidates[0].skills?.slice(0, 8).map((s, i) => (
                    <span key={i} className="skill-tag skill-tag--spotlight">{s}</span>
                  ))}
                </div>
                {candidates[0].summary && (
                  <p className="spotlight-summary">{candidates[0].summary}</p>
                )}
              </div>
            )}
            <div className="candidates-grid">
              {candidates.map((c, index) => {
                const { label, cls } = getRankLabel(index);
                return (
                  <div key={index} className={`candidate-card ${index === 0 ? "candidate-card--top" : ""}`}>
                    <div className="candidate-card-header">
                      <div className={`rank-badge ${cls}`}>{label}</div>
                      <div className="candidate-avatar candidate-avatar--sm">
                        {c.filename?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div className="candidate-info">
                        <h3 className="candidate-name">{c.filename}</h3>
                        <span className="candidate-exp">{c.experience} yrs exp</span>
                      </div>
                      <div className={`candidate-score ${getScoreColor(c.score)}`}>{c.score}%</div>
                    </div>
                    <div className="score-bar-wrap">
                      <div className="score-bar-bg">
                        <div
                          className={`score-bar-fill ${getScoreColor(c.score)}`}
                          style={{ width: animatedScores[index] !== undefined ? `${animatedScores[index]}%` : "0%" }}
                        />
                      </div>
                      <span className="score-bar-label">{c.score}% match</span>
                    </div>
                    <div className="skills-row">
                      {c.skills?.slice(0, 5).map((s, i) => (
                        <span key={i} className="skill-tag">{s}</span>
                      ))}
                      {c.skills?.length > 5 && (
                        <span className="skill-tag skill-tag--more">+{c.skills.length - 5}</span>
                      )}
                    </div>
                    {index < 5 && c.summary && (
                      <p className="candidate-summary">{c.summary}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
