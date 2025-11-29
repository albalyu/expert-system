import React from 'react';
import '../Card/Card.scss'; // Reuse styles

const Options = ({ fact, onAnswer }) => {
  if (!fact) return null;

  if (fact.type === 'boolean') {
    return (
      <div className="options-grid">
        <button className="primary" onClick={() => onAnswer(fact.id, true)}>Да (Yes)</button>
        <button className="secondary" onClick={() => onAnswer(fact.id, false)}>Нет (No)</button>
      </div>
    );
  }

  if (fact.type === 'enum' && fact.options) {
    return (
      <div className="options-grid">
        {fact.options.map(opt => (
          <button key={opt} className="secondary" onClick={() => onAnswer(fact.id, opt)}>
            {opt}
          </button>
        ))}
      </div>
    );
  }

  return <div>Unknown input type</div>;
};

export default Options;
