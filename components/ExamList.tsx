import React from 'react';
import { MOCK_EXAMS } from '../constants';
import { Exam } from '../types';

interface ExamListProps {
  onSelect: (exam: Exam) => void;
}

const ExamList: React.FC<ExamListProps> = ({ onSelect }) => {
  const handleOfficialSystemClick = () => {
    window.open("https://script.google.com/macros/s/AKfycbwpXBigG-9gdK3Jj23pP4o5_8GMnP-Ak3THOKF1XJr1I7-80hrGuhvqsQUVDevJ_ynw/exec", "_blank");
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] uppercase tracking-widest">
        DANH SÁCH ĐỀ THI
      </h2>
      
      {/* Official System Link Button */}
      <div className="mb-12 p-8 bg-gradient-to-br from-[#004d4d] to-[#003d3d] border-2 border-[#D4AF37] rounded-3xl shadow-2xl text-center">
        <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">HỆ THỐNG THI TRẮC NGHIỆM CHÍNH THỨC</h3>
        <p className="text-teal-200 mb-8 text-sm md:text-base font-medium">
          Truy cập nền tảng khảo thí quốc gia của VANHAI EDUCATION để làm các bài thi chuẩn hóa theo cấu trúc mới nhất.
        </p>
        <button 
          onClick={handleOfficialSystemClick}
          className="px-10 py-4 bg-[#D4AF37] hover:bg-[#FCF6BA] text-[#003d3d] font-black rounded-2xl transition-all shadow-xl uppercase tracking-widest transform hover:-translate-y-1"
        >
          VÀO HỆ THỐNG THI CHÍNH THỨC
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_EXAMS.map((exam) => (
          <div 
            key={exam.id}
            className="bg-[#004d4d]/30 border border-[#006666] p-6 rounded-2xl flex flex-col justify-between hover:border-[#D4AF37] transition-all cursor-pointer group"
            onClick={() => onSelect(exam)}
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-teal-900/50 text-teal-300 rounded-full text-xs font-bold uppercase">
                  {exam.subject}
                </span>
                <span className="text-slate-400 text-sm flex items-center gap-1">
                  ⏱️ {exam.duration} phút
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors">
                {exam.title}
              </h3>
              <p className="text-slate-400 text-sm">
                Tổng cộng {exam.questions.length} câu hỏi trắc nghiệm khách quan.
              </p>
            </div>
            
            <button className="mt-6 w-full py-3 bg-[#005a5a] group-hover:bg-[#D4AF37] group-hover:text-[#003d3d] text-white font-bold rounded-xl transition-colors uppercase tracking-widest text-xs">
              Làm Bài
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamList;