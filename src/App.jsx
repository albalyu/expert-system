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
  const [selectedScenario, setSelectedScenario] = useState(null);

  // Run inference whenever facts change or scenario changes
  useEffect(() => {
    if (!selectedScenario) {
      setStep(null);
      return;
    }

    // Filter rules based on the selected scenario ID (e.g., "S1" -> 1)
    const scenarioIdNum = parseInt(selectedScenario.id.replace('S', ''), 10);
    
    const filteredKb = {
      ...knowledgeBase,
      rules: knowledgeBase.rules.filter(r => r.scenario === scenarioIdNum)
    };

    const nextStep = determineNextStep(knownFacts, filteredKb);
    setStep(nextStep);
  }, [knownFacts, selectedScenario]);

  const handleScenarioSelect = (scenario) => {
    setSelectedScenario(scenario);
    setKnownFacts({});
    setHistory([]);
  };

  const handleAnswer = (factId, value) => {
    setKnownFacts(prev => ({ ...prev, [factId]: value }));
    setHistory(prev => [...prev, factId]);
  };

  const handleReset = () => {
    setKnownFacts({});
    setHistory([]);
    // We intentionally keep the selectedScenario to just restart the current diagnostic.
    // If user wants to change scenario, they use the "Back to Menu" button.
  };

  const handleBackToMenu = () => {
    setSelectedScenario(null);
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

  // 1. Scenario Selection Screen
  if (!selectedScenario) {
    return (
      <div className="app-container">
        <Card title="Выберите тип проблемы (Select Issue Type)" showBack={false}>
          <div className="options-grid scenarios">
            {knowledgeBase.testScenarios.map(scenario => (
              <button 
                key={scenario.id} 
                className="secondary" 
                onClick={() => handleScenarioSelect(scenario)}
              >
                <span style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', fontSize: '0.9em' }}>{scenario.name}</span>
                <span style={{ fontSize: '0.75em', opacity: 0.8, lineHeight: '1.3' }}>{scenario.description}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (!step) return <div>Loading...</div>;

  // 2. Diagnostic Screen
  return (
    <div className="app-container">
      {step.type === 'question' && (
        <Card 
            title={selectedScenario.name}
            showBack={true} 
            onBack={handleBackToMenu} // Header button now goes back to menu
        >
          <p>{step.data.question}</p>
          <Options fact={step.data} onAnswer={handleAnswer} />
          
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.9em', opacity: 0.6 }}>
            {history.length > 0 ? (
                <button onClick={handleBack} style={{ background: 'none', border: 'none', color: 'inherit', textDecoration: 'underline', padding: 0 }}>
                    &larr; Previous Question
                </button>
            ) : (
                <span></span>
            )}
            
            <button onClick={handleReset} style={{ background: 'none', border: 'none', color: 'inherit', textDecoration: 'underline', padding: 0 }}>
                Restart Scenario
            </button>
          </div>
        </Card>
      )}

      {step.type === 'issue' && (
        <Card title="Issue Identified" showBack={true} onBack={handleBackToMenu}>
          <Result 
            issue={step.data} 
            explanation={step.explanation} 
            onReset={handleBackToMenu} 
          />
        </Card>
      )}

      {step.type === 'no_result' && (
        <Card title="Result" showBack={true} onBack={handleBackToMenu}>
          <Result 
            issue={null} 
            onReset={handleBackToMenu} 
          />
        </Card>
      )}
    </div>
  );
}

export default App;
