import React from 'react';
import '../Card/Card.scss';

const Result = ({ issue, explanation, onReset }) => {
  if (!issue) return (
    <div className="result-view">
        <h3 className="result-view__title">Diagnostic Completed</h3>
        <p>The system could not identify a specific issue based on the answers provided.</p>
        <button className="primary" onClick={onReset}>Start Over</button>
    </div>
  );

  return (
    <div className="result-view">
      <h3 className="result-view__title">{issue.title}</h3>
      <p className="result-view__desc">{issue.description}</p>
      
      <div className="result-view__rec">
        <strong>Recommendation:</strong>
        {issue.recommendation}
      </div>
      
      {explanation && (
          <div className="result-view__explanation">
            Reasoning: {explanation}
          </div>
      )}

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button className="primary" onClick={onReset}>Diagnose Another Issue</button>
      </div>
    </div>
  );
};

export default Result;
