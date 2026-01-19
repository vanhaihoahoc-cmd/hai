
import React, { useState } from 'react';
import { Exam, ExamResult } from '../types';
import { explainQuestion } from '../services/geminiService';

interface ResultViewProps {
  exam: Exam;
  result: ExamResult;
  onRetry: () => void;
  onHome: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ exam, result, onRetry, onHome }) => {
  const [explanation, setExplanation] = useState<Record<string, string>>({});
  const [loadingExpl, setLoadingExpl] = useState<Record<string, boolean>>({});

  const handleExplain = async (questionIdx: number) => {
    const q = exam.questions[questionIdx];
    const userAns = result.answers[q.id] !== undefined ? q.options[result.answers[q.id]] : "Chưa trả lời";
    const correctAns = q.options[q.correctAnswer];
    
    setLoadingExpl(prev => ({ ...prev, [q.id]: true }));
    const response = await explainQuestion(q.text, q.options, correctAns, userAns);
    setExplanation(prev => ({ ...prev, [q.id]: response }));
    setLoadingExpl(prev => ({ ...prev, [q.id]: false }));
  };

  const percentage = (result.score / result.totalQuestions) * 100;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-[#004d4d]/30 border border-[#006666] rounded-3xl p-8 mb-12 text-center">
        <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]">
          Hoàn thành bài thi!
        </h2>
        <div className="flex justify-center items-center gap-8 my-8">
          <div className="w-32 h-32 rounded-full border-8 border-[#D4AF37] flex items-center justify-center text-3xl font-bold text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            {Math.round(percentage)}%
          </div>
          <div className="text-left">
            <p className="text-4xl font-bold text-white">{result.score}/{result.totalQuestions}</p>
            <p className="text-slate-400">Số câu đúng</p>
          </div>
        </div>
        <div className="flex gap-4 justify-center">
          <button onClick={onRetry} className="px-6 py-3 bg-[#D4AF37] hover:bg-[#FCF6BA] text-[#003d3d] font-bold rounded-xl transition-all shadow-md">Làm lại</button>
          <button onClick={onHome} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all">Về trang chủ</button>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-[#D4AF37] mb-6">Chi tiết bài làm</h3>
      <div className="space-y-6">
        {exam.questions.map((q, idx) => {
          const isCorrect = result.answers[q.id] === q.correctAnswer;
          return (
            <div key={q.id} className="bg-[#004d4d]/20 border border-[#006666] rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <p className="text-lg text-white font-medium flex-1">
                  <span className="text-[#D4AF37] mr-2">Câu {idx + 1}:</span> {q.text}
                </p>
                <div className={`px-3 py-1 rounded-lg text-xs font-bold ${isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {isCorrect ? 'Đúng' : 'Sai'}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {q.options.map((opt, optIdx) => (
                  <div 
                    key={optIdx} 
                    className={`p-3 rounded-xl text-sm border ${
                      optIdx === q.correctAnswer 
                        ? 'border-green-500 bg-green-500/10 text-green-300' 
                        : optIdx === result.answers[q.id] 
                          ? 'border-red-500 bg-red-500/10 text-red-300'
                          : 'border-transparent bg-white/5 text-slate-400'
                    }`}
                  >
                    <span className="font-bold mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                    {opt}
                  </div>
                ))}
              </div>

              {explanation[q.id] ? (
                <div className="mt-4 p-5 bg-teal-900/40 border border-teal-600 rounded-xl text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                  <div className="flex items-center gap-2 mb-2 text-[#D4AF37] font-bold uppercase tracking-wider text-xs">
                    🤖 Giải thích từ AI
                  </div>
                  {explanation[q.id]}
                </div>
              ) : (
                <button 
                  onClick={() => handleExplain(idx)}
                  disabled={loadingExpl[q.id]}
                  className="mt-2 text-teal-400 hover:text-[#D4AF37] text-sm font-bold flex items-center gap-2 disabled:opacity-50"
                >
                  {loadingExpl[q.id] ? '⏳ Đang phân tích...' : 'Giải thích chi tiết với AI'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultView;
