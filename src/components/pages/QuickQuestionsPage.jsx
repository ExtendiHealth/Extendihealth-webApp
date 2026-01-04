import React, { useState } from 'react';
import { useResponsive } from '../../hooks';
import { Header } from '../layout';
import { Button } from '../ui';

const QuickQuestionsPage = ({ onBack, onContinue }) => {
  const { isDesktop } = useResponsive();
  const [answers, setAnswers] = useState({
    chestPain: null,
    fever: null,
    travel: null,
  });

  const questions = [
    { id: 'chestPain', text: 'Any chest pain or trouble breathing?' },
    { id: 'fever', text: 'High fever (over 38.5°C)?' },
    { id: 'travel', text: 'Recent travel or known exposure?' },
  ];

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const allAnswered = Object.values(answers).every(a => a !== null);

  return (
    <div className={`${isDesktop ? 'p-6 lg:p-8' : 'min-h-screen bg-gray-50'}`}>
      <div className={`${isDesktop ? 'max-w-2xl mx-auto' : ''}`}>
        {!isDesktop && <Header title="Quick Questions" onBack={onBack} />}
        
        <div className={`${isDesktop ? '' : 'p-6'}`}>
          <h2 className="text-xl font-bold text-gray-900 mb-6">A Few Quick Questions</h2>

          <div className="space-y-6">
            {questions.map((q) => (
              <div key={q.id} className="space-y-3">
                <p className="font-medium text-gray-900">• {q.text}</p>
                <div className="flex gap-6 pl-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={q.id}
                      checked={answers[q.id] === true}
                      onChange={() => handleAnswer(q.id, true)}
                      className="w-4 h-4 text-cyan-500 focus:ring-cyan-500"
                    />
                    <span className="text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={q.id}
                      checked={answers[q.id] === false}
                      onChange={() => handleAnswer(q.id, false)}
                      className="w-4 h-4 text-cyan-500 focus:ring-cyan-500"
                    />
                    <span className="text-gray-700">No</span>
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Button 
              size="lg" 
              onClick={() => onContinue(answers)}
              disabled={!allAnswered}
              className="w-full"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// AI PRE-DIAGNOSIS PAGE
// ============================================================================


export default QuickQuestionsPage;
