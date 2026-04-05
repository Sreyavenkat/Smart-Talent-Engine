import { useEffect, useState } from "react";

export default function Results() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/rank-candidates");
        const data = await res.json();

        setCandidates(data.ranked_candidates);
      } catch (error) {
        console.error("Error fetching results", error);
      }

      setLoading(false);
    };

    fetchResults();
  }, []);

  return (
    <div className="results-container">
      <h1>Ranked Candidates</h1>

      {loading ? (
        <p>Loading results...</p>
      ) : (
        <div className="results-grid">
          {candidates.map((c, index) => (
            <div key={index} className="result-card">
              <h2>{c.filename}</h2>

              <div className="score">{c.score}%</div>

              <p><strong>Experience:</strong> {c.experience} years</p>

              <p><strong>Skills:</strong></p>
              <div className="skills">
                {c.skills.slice(0, 6).map((skill, i) => (
                  <span key={i}>{skill}</span>
                ))}
              </div>

              <p className="summary">{c.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}