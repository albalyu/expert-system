import React from 'react';
import './Card.scss';

const Card = ({ children, title, onBack, showBack }) => {
  return (
    <div className="expert-card">
      <div className="expert-card__header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <h2>{title || "Expert System"}</h2>
             {showBack && (
                 <button 
                    onClick={onBack}
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', background: 'transparent', border: '1px solid #555' }}
                 >
                    Back to Menu
                 </button>
             )}
        </div>
       
      </div>
      <div className="expert-card__body">
        {children}
      </div>
    </div>
  );
};

export default Card;
