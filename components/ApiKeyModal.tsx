import React, { useState } from 'react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onSave: (key: string) => void;
  onClose: () => void;
  isMandatory: boolean;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onSave, onClose, isMandatory }) => {
  const [inputValue, setInputValue] = useState(localStorage.getItem('gemini_api_key') || '');

  if (!isOpen) return null;

  const handleSave = () => {
    if (inputValue.trim()) {
      onSave(inputValue.trim());
    } else {
      alert("Vui lòng nhập API Key để tiếp tục.");
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#004d4d] border-2 border-[#D4AF37]/50 rounded-[2.5rem] p-8 md:p-12 max-w-lg w-full shadow-2xl relative animate-in zoom-in-95 duration-300">
        {!isMandatory && (
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-[#D4AF37] hover:rotate-90 transition-transform font-black text-xl"
          >
            ✕
          </button>
        )}

        <h3 className="text-2xl md:text-3xl font-black text-[#D4AF37] mb-10 uppercase tracking-widest text-center">
          CẤU HÌNH API KEY
        </h3>

        <div className="space-y-8 text-slate-200">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] opacity-80 ml-2">GOOGLE GEMINI API KEY</label>
            <input 
              type="password"
              placeholder="Nhập API Key của bạn tại đây..."
              className="w-full bg-[#003d3d] border-2 border-[#006666] focus:border-[#D4AF37] rounded-2xl p-4 text-white outline-none transition-all placeholder:text-teal-800"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>

          <button 
            onClick={handleSave}
            className="w-full py-5 bg-gradient-to-r from-[#BF953F] to-[#B38728] text-[#003d3d] font-black rounded-2xl hover:scale-[1.02] transition-all shadow-xl uppercase tracking-widest"
          >
            LƯU CẤU HÌNH
          </button>
          
          <p className="text-[10px] text-teal-500 text-center uppercase font-bold tracking-tighter opacity-60">
            * API KEY ĐƯỢC LƯU AN TOÀN TRONG TRÌNH DUYỆT CỦA BẠN
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;