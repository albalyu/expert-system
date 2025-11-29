import React, { useState, useEffect } from 'react';
import Card from './components/Card/Card';
import Options from './components/Options/Options';
import Result from './components/Result/Result';
import knowledgeBase from './data/knowledgeBase.json';
import { determineNextStep } from './utils/inferenceEngine';

function App() {
  const [knownFacts, setKnownFacts] = useState({});
  const [history, setHistory] = useState([]); // Stack of [factId]
  const [step, setStep] = useState(null);

  // Run inference whenever facts change
  useEffect(() => {
    const nextStep = determineNextStep(knownFacts, knowledgeBase);
    setStep(nextStep);
  }, [knownFacts]);

  const handleAnswer = (factId, value) => {
    setKnownFacts(prev => ({ ...prev, [factId]: value }));
    setHistory(prev => [...prev, factId]);
  };

  const handleReset = () => {
    setKnownFacts({});
    setHistory([]);
  };

  const handleBack = () => {
    if (history.length === 0) return;
    
    const newHistory = [...history];
    const lastFactId = newHistory.pop();
    
    const newFacts = { ...knownFacts };
    delete newFacts[lastFactId];
    
    setKnownFacts(newFacts);
    setHistory(newHistory);
  };

  if (!step) return <div>Loading...</div>;

  return (
    <div className="app-container">
      {step.type === 'question' && (
        <Card 
            title="Diagnostic Question" 
            showBack={history.length > 0} 
            onBack={handleReset} // Or handleBack if we want step-back
        >
          <p>{step.data.question}</p>
          <Options fact={step.data} onAnswer={handleAnswer} />
          
          {history.length > 0 && (
            <div style={{ marginTop: '2rem', fontSize: '0.9em', opacity: 0.6 }}>
                <button onClick={handleBack} style={{ background: 'none', border: 'none', color: 'inherit', textDecoration: 'underline', padding: 0 }}>
                    &larr; Previous Question
                </button>
            </div>
          )}
        </Card>
      )}

      {step.type === 'issue' && (
        <Card title="Issue Identified" showBack={false} onBack={handleReset}>
          <Result 
            issue={step.data} 
            explanation={step.explanation} 
            onReset={handleReset} 
          />
        </Card>
      )}

      {step.type === 'no_result' && (
        <Card title="Result" showBack={false} onBack={handleReset}>
          <Result 
            issue={null} 
            onReset={handleReset} 
          />
        </Card>
      )}
    </div>
  );
}

export default App;
