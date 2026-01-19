
import React, { useState, useEffect } from 'react';
import { Exam, ExamResult } from '../types';

interface ExamSessionProps {
  exam: Exam;
  onFinish: (result: ExamResult) => void;
  onCancel: () => void;
}

const ExamSession: React.FC<ExamSessionProps> = ({ exam, onFinish, onCancel }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(exam.duration * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSelect = (optionIdx: number) => {
    setAnswers(prev => ({ ...prev, [exam.questions[currentIdx].id]: optionIdx }));
  };

  const handleSubmit = () => {
    let score = 0;
    exam.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        score += 1;
      }
    });
    onFinish({
      score,
      totalQuestions: exam.questions.length,
      answers
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const question = exam.questions[currentIdx];
  const isLast = currentIdx === exam.questions.length - 1;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-12">
      {/* Sticky Top Bar - Responsive Height */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-8 sticky top-14 md:top-20 bg-[#003d3d] py-3 md:py-4 z-40 border-b border-[#006666] gap-3">
        <div className="text-center sm:text-left">
          <h2 className="text-sm md:text-xl font-bold text-white line-clamp-1">{exam.title}</h2>
          <p className="text-teal-400 text-[10px] md:text-sm uppercase font-bold tracking-widest">Câu {currentIdx + 1} / {exam.questions.length}</p>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <div className={`text-xl md:text-2xl font-mono font-bold ${timeLeft < 300 ? 'text-red-400 animate-pulse' : 'text-teal-300'}`}>
            {formatTime(timeLeft)}
          </div>
          <button 
            onClick={handleSubmit}
            className="px-4 md:px-6 py-1.5 md:py-2 bg-red-600 hover:bg-red-500 text-white font-black rounded-lg text-xs md:text-sm uppercase tracking-tighter"
          >
            Nộp bài
          </button>
        </div>
      </div>

      <div className="bg-[#004d4d]/20 border border-[#006666] p-5 md:p-8 rounded-2xl md:rounded-3xl mb-6 md:mb-8 shadow-xl">
        <p className="text-base md:text-xl text-white font-medium mb-6 md:mb-8 leading-relaxed">
          {question.text}
        </p>

        <div className="grid grid-cols-1 gap-3 md:gap-4">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`p-4 md:p-5 text-left rounded-xl md:rounded-2xl border transition-all flex items-center gap-3 md:gap-4 group ${
                answers[question.id] === idx 
                ? 'bg-teal-500/20 border-teal-400 text-white shadow-[0_0_15px_rgba(45,212,191,0.2)]' 
                : 'bg-white/5 border-transparent hover:border-teal-600 text-slate-300'
              }`}
            >
              <div className={`w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full flex items-center justify-center font-black text-sm md:text-base ${
                answers[question.id] === idx ? 'bg-teal-500 text-[#003d3d]' : 'bg-teal-900/50 text-teal-400'
              }`}>
                {String.fromCharCode(65 + idx)}
              </div>
              <span className="text-sm md:text-base font-medium">{option}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center gap-2">
        <button
          disabled={currentIdx === 0}
          onClick={() => setCurrentIdx(prev => prev - 1)}
          className="flex-1 sm:flex-none px-4 md:px-6 py-3 rounded-xl bg-[#004d4d] text-white disabled:opacity-30 font-bold text-xs md:text-sm hover:bg-[#005a5a] transition-all"
        >
          ← Câu trước
        </button>
        
        {isLast ? (
          <button
            onClick={handleSubmit}
            className="flex-1 sm:flex-none px-6 md:px-8 py-3 rounded-xl bg-teal-500 text-[#003d3d] font-black text-xs md:text-sm hover:bg-teal-400 transition-all shadow-lg uppercase"
          >
            NỘP BÀI THI
          </button>
        ) : (
          <button
            onClick={() => setCurrentIdx(prev => prev + 1)}
            className="flex-1 sm:flex-none px-4 md:px-6 py-3 rounded-xl bg-teal-600 text-white font-bold text-xs md:text-sm hover:bg-teal-500 transition-all"
          >
            Tiếp theo →
          </button>
        )}
      </div>
      
      {/* Question Palette - Mobile Friendly Wrap */}
      <div className="mt-8 md:mt-12 flex flex-wrap gap-2 justify-center max-h-[150px] overflow-y-auto p-2 custom-scrollbar">
        {exam.questions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIdx(idx)}
            className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center font-bold text-[10px] md:text-xs border transition-all ${
              currentIdx === idx ? 'border-teal-400 scale-110 shadow-lg ring-1 ring-teal-400' : 'border-transparent'
            } ${
              answers[q.id] !== undefined ? 'bg-teal-600 text-white' : 'bg-teal-900/30 text-teal-700'
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExamSession;
