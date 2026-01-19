import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ExamList from './components/ExamList';
import ExamSession from './components/ExamSession';
import ResultView from './components/ResultView';
import { View, Exam, ExamResult } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [lastResult, setLastResult] = useState<ExamResult | null>(null);
  
  const handleStartLuyenDe = () => setView('exam-list');
  const handleSelectExam = (exam: Exam) => {
    setSelectedExam(exam);
    setView('exam-session');
  };
  const handleFinishExam = (result: ExamResult) => {
    setLastResult(result);
    setView('result');
  };
  const handleRetry = () => setView('exam-session');
  const handleGoHome = () => {
    setView('home');
    setSelectedExam(null);
    setLastResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#002d2d]">
      <Navbar onHome={handleGoHome} />
      
      <main className="flex-1 overflow-y-auto">
        {view === 'home' && <Hero onStart={handleStartLuyenDe} />}
        
        {view === 'exam-list' && (
          <ExamList onSelect={handleSelectExam} />
        )}
        
        {view === 'exam-session' && selectedExam && (
          <ExamSession 
            exam={selectedExam} 
            onFinish={handleFinishExam}
            onCancel={handleGoHome}
          />
        )}

        {view === 'result' && selectedExam && lastResult && (
          <ResultView 
            exam={selectedExam}
            result={lastResult}
            onRetry={handleRetry}
            onHome={handleGoHome}
          />
        )}
      </main>

      <footer className="bg-[#002d2d] py-8 px-6 border-t border-[#004444] text-center">
        <p className="text-slate-500 text-sm">
          © 2024 VANHAI EDUCATION. Nền tảng luyện thi chất lượng cao tích hợp AI.
        </p>
      </footer>
    </div>
  );
};

export default App;