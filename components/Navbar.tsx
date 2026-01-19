
import React from 'react';

interface NavbarProps {
  onHome: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onHome }) => {
  return (
    <nav className="sticky top-0 z-50 bg-[#004444] border-b border-[#005555] shadow-2xl px-4 md:px-6 py-2 md:py-3 flex items-center justify-between">
      <div 
        className="flex items-center gap-2 md:gap-4 cursor-pointer group shrink-0" 
        onClick={onHome}
      >
        <div className="relative w-10 h-10 md:w-14 md:h-14 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-[#BF953F] via-[#FCF6BA] to-[#B38728] rounded-xl md:rounded-2xl rotate-3 group-hover:rotate-6 transition-transform opacity-20 blur-sm"></div>
          <div className="relative w-9 h-9 md:w-12 md:h-12 bg-gradient-to-br from-[#003d3d] to-[#002d2d] rounded-lg md:rounded-xl flex items-center justify-center shadow-inner border border-[#BF953F]/30 group-hover:scale-105 transition-transform overflow-hidden">
            <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-9 md:h-9 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#BF953F" />
                  <stop offset="50%" stopColor="#FCF6BA" />
                  <stop offset="100%" stopColor="#B38728" />
                </linearGradient>
              </defs>
              <path 
                fill="url(#goldGradient)" 
                d="M12,3L1,9l11,6l9-4.91V17h2V9L12,3z M5,13.18v2.56c0,0,2.18,2.26,7,2.26s7-2.26,7-2.26v-2.56c-2.09,1.14-4.52,1.76-7,1.76 S7.09,14.32,5,13.18z"
              />
              <path 
                fill="url(#goldGradient)" 
                d="M19,10c0,0,1.5-1.5,1.5-3.5S19,3,19,3s-1.5,1.5-1.5,3.5S19,10,19,10z" 
                className="animate-pulse"
              />
            </svg>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-lg md:text-2xl font-black tracking-[-0.05em] bg-clip-text text-transparent bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]">
            VANHAI
          </span>
          <span className="text-[7px] md:text-[10px] font-bold tracking-[0.2em] md:tracking-[0.35em] text-teal-400 uppercase leading-tight">
            EDUCATION
          </span>
        </div>
      </div>

      <h1 className="hidden lg:block text-sm md:text-xl lg:text-2xl font-black tracking-[0.1em] text-center flex-1 mx-2 bg-clip-text text-transparent bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] drop-shadow-lg uppercase line-clamp-1">
        ĐỀ THI THỬ TN THPT MÔN HÓA HỌC- 2026
      </h1>

      <div className="flex gap-2 md:gap-4 items-center shrink-0">
        <button 
          onClick={onHome}
          className="bg-clip-text text-transparent bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] hover:scale-110 transition-all font-black text-[10px] md:text-sm uppercase tracking-widest whitespace-nowrap"
        >
          Trang Chủ
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
