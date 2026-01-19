
import React, { useState, useEffect } from 'react';

interface HeroProps {
  onStart: () => void;
}

interface ExamFolder {
  id: string;
  name: string;
  icon: string;
}

interface DeclaredFile {
  id: string;
  name: string;
  examLink: string;
  answerLink: string;
  guideLink: string;
  password?: string;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  const [showFolders, setShowFolders] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  
  const [selectedFolder, setSelectedFolder] = useState<ExamFolder | null>(null);
  const [portView, setPortView] = useState<'selection' | 'student' | 'admin-login' | 'admin-dashboard'>('selection');
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState(false);
  
  const [counts, setCounts] = useState({
    kho: 1245,
    luyenDe: 3562,
    huongDan: 890
  });

  // Dữ liệu mặc định để không bị trống khi mở trình duyệt mới
  const defaultData: Record<string, DeclaredFile[]> = {
    'dt2026': [
      {
        id: 'default-1',
        name: 'ĐỀ THI THỬ SỞ HÀ TĨNH - LẦN 2',
        examLink: 'https://drive.google.com/file/d/1VCOzlAo0YAykCBrpGmFTvepVzweV4M_1/view',
        answerLink: 'https://drive.google.com/file/d/1VCOzlAo0YAykCBrpGmFTvepVzweV4M_1/view',
        guideLink: 'https://drive.google.com/file/d/1VCOzlAo0YAykCBrpGmFTvepVzweV4M_1/view'
      },
      {
        id: 'default-2',
        name: 'ĐỀ THI THỬ SỞ VĨNH PHÚC - LẦN 1',
        examLink: 'https://drive.google.com/file/d/1VCOzlAo0YAykCBrpGmFTvepVzweV4M_1/view',
        answerLink: 'https://drive.google.com/file/d/1VCOzlAo0YAykCBrpGmFTvepVzweV4M_1/view',
        guideLink: 'https://drive.google.com/file/d/1VCOzlAo0YAykCBrpGmFTvepVzweV4M_1/view'
      }
    ],
    'dmh': [
      {
        id: 'default-3',
        name: 'BÀI GIẢI CHI TIẾT ĐỀ MINH HỌA 2025',
        examLink: '#',
        answerLink: '#',
        guideLink: '#'
      }
    ]
  };

  const [declaredFiles, setDeclaredFiles] = useState<Record<string, DeclaredFile[]>>(() => {
    const saved = localStorage.getItem('vanhai_declared_files');
    // Nếu có dữ liệu đã lưu thì dùng, nếu không thì dùng dữ liệu mặc định
    return saved ? JSON.parse(saved) : defaultData;
  });

  const [formName, setFormName] = useState('');
  const [formExamLink, setFormExamLink] = useState('');
  const [formAnswerLink, setFormAnswerLink] = useState('');
  const [formGuideLink, setFormGuideLink] = useState('');
  const [formFilePassword, setFormFilePassword] = useState('');

  const [unlockedFiles, setUnlockedFiles] = useState<Set<string>>(new Set());
  const [studentPasswordInput, setStudentPasswordInput] = useState<Record<string, string>>({});
  
  // State cho tính năng đồng bộ
  const [syncCode, setSyncCode] = useState('');

  useEffect(() => {
    localStorage.setItem('vanhai_declared_files', JSON.stringify(declaredFiles));
  }, [declaredFiles]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounts(prev => ({
        kho: prev.kho + Math.floor(Math.random() * 5) - 2,
        luyenDe: prev.luyenDe + Math.floor(Math.random() * 7) - 3,
        huongDan: prev.huongDan + Math.floor(Math.random() * 3) - 1
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const examFolders: ExamFolder[] = [
    { id: 'dt2026', name: "Đề thi thử 2026", icon: "📁" },
    { id: 'dmh', name: "BÀI GIẢI CHI TIẾT", icon: "📂" }, 
    { id: 'toc', name: "Tổng Ôn Cấp Tốc", icon: "🗂️" },
    { id: 'tlh', name: "Tài Liệu Hóa Học", icon: "🧪" }
  ];

  const handleAdminLogin = () => {
    if (adminPass === 'admin123') {
      setPortView('admin-dashboard');
      setAdminError(false);
    } else {
      setAdminError(true);
    }
  };

  const handleAddFile = () => {
    if (!selectedFolder || !formName) return;
    const newFile: DeclaredFile = {
      id: Date.now().toString(),
      name: formName,
      examLink: formExamLink,
      answerLink: formAnswerLink,
      guideLink: formGuideLink,
      password: formFilePassword
    };
    setDeclaredFiles(prev => ({
      ...prev,
      [selectedFolder.id]: [...(prev[selectedFolder.id] || []), newFile]
    }));
    setFormName(''); setFormExamLink(''); setFormAnswerLink(''); setFormGuideLink(''); setFormFilePassword('');
    alert('Khai báo tài liệu thành công!');
  };

  const handleDeleteFile = (id: string) => {
    if (!selectedFolder) return;
    setDeclaredFiles(prev => ({
      ...prev,
      [selectedFolder.id]: prev[selectedFolder.id].filter(f => f.id !== id)
    }));
  };

  const handleExportSync = () => {
    const code = btoa(JSON.stringify(declaredFiles));
    setSyncCode(code);
    alert('Đã tạo mã đồng bộ! Vui lòng sao chép văn bản trong ô Đồng bộ.');
  };

  const handleImportSync = () => {
    try {
      if (!syncCode) return;
      const decoded = JSON.parse(atob(syncCode));
      setDeclaredFiles(decoded);
      alert('Đồng bộ dữ liệu thành công!');
    } catch (e) {
      alert('Mã đồng bộ không hợp lệ!');
    }
  };

  const handleUnlockFile = (file: DeclaredFile) => {
    const input = studentPasswordInput[file.id] || '';
    if (input === file.password) {
      setUnlockedFiles(prev => new Set(prev).add(file.id));
    } else {
      alert('Mật khẩu tài liệu không chính xác!');
    }
  };

  const handleFolderClick = (folder: ExamFolder) => {
    setSelectedFolder(folder);
    setPortView('selection');
    setAdminPass('');
    setAdminError(false);
    setUnlockedFiles(new Set());
    setStudentPasswordInput({});
  };

  const handleLuyenDeClick = () => {
    window.open("https://script.google.com/macros/s/AKfycbwpXBigG-9gdK3Jj23pP4o5_8GMnP-Ak3THOKF1XJr1I7-80hrGuhvqsQUVDevJ_ynw/exec", "_blank");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-20 text-center">
      <h2 className="text-4xl sm:text-6xl md:text-8xl font-black mb-4 md:mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] drop-shadow-2xl uppercase tracking-tighter">
        VANHAI EDUCATION
      </h2>
      <p className="text-lg md:text-3xl text-teal-200 font-bold mb-8 md:mb-10 tracking-tight">
        🚀 Đồng hành tri thức – Định hướng tương lai 🚀
      </p>
      <div className="max-w-7xl mx-auto text-slate-300 text-sm md:text-xl font-medium mb-12 px-2">
        <p className="md:whitespace-nowrap">Giúp học sinh THPT học đúng trọng tâm – phát triển tư duy – tự tin chinh phục kỳ thi.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 mb-16 md:mb-24">
        <button onClick={() => setShowWelcomeModal(true)} className="w-full sm:w-auto px-6 md:px-12 py-4 md:py-5 bg-gradient-to-r from-[#005a5a] to-[#004d4d] border-2 border-[#D4AF37]/60 hover:from-[#006666] hover:to-[#005a5a] text-[#D4AF37] font-black text-sm md:text-xl rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] transform hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
          <span className="relative z-10 flex items-center justify-center gap-2 uppercase tracking-tighter px-4">CHÀO MỪNG ĐẾN VỚI VANHAI EDUCATION</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-6 lg:gap-8 max-w-6xl mx-auto">
        <div onClick={() => setShowFolders(true)} className="cursor-pointer h-full">
          <FeatureCard icon="📚" title="KHO TÀI LIỆU PHONG PHÚ" desc="Cập nhật mới nhất theo cấu trúc Bộ Giáo dục & Đào tạo." visitors={counts.kho} />
        </div>
        <div onClick={handleLuyenDeClick} className="cursor-pointer h-full">
          <FeatureCard icon="🌏" title="ĐỀ THI THỬ TN THPT MÔN HÓA HỌC- 2026" subtitle="Đề thi thử TN PTTH trên toàn quốc" desc="Làm bài trực tuyến tại hệ thống khảo thí quốc gia của VANHAI." visitors={counts.luyenDe} />
        </div>
        <div onClick={() => setShowGuideModal(true)} className="cursor-pointer h-full">
          <FeatureCard icon="🤖" title="CẨM NANG SỬ DỤNG" desc="Cẩm nang hướng dẫn sử dụng Kho tài liệu và Luyện đề thông minh 24/7." visitors={counts.huongDan} />
        </div>
      </div>

      {showFolders && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-[#002d2d]/95 backdrop-blur-xl animate-in fade-in duration-300 overflow-y-auto py-10">
          <div className="max-w-4xl w-full bg-[#004d4d] border border-[#D4AF37]/30 rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative max-h-[90vh] flex flex-col">
            <button onClick={() => { setShowFolders(false); setSelectedFolder(null); }} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-teal-900/50 text-[#D4AF37] hover:rotate-90 transition-all font-black">✕</button>

            {!selectedFolder ? (
              <div className="w-full text-center overflow-y-auto">
                <h3 className="text-3xl font-black text-[#D4AF37] mb-2 uppercase tracking-tight">KHO TÀI LIỆU</h3>
                <p className="text-teal-300 mb-10 text-sm">Chọn thư mục tài liệu</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6">
                  {examFolders.map((folder) => (
                    <div key={folder.id} onClick={() => handleFolderClick(folder)} className="flex items-center gap-5 p-6 bg-[#003d3d] border-2 border-[#006666] rounded-3xl hover:border-[#D4AF37] hover:bg-[#004d4d] transition-all group cursor-pointer text-left shadow-lg transform hover:-translate-y-1">
                      <span className="text-5xl group-hover:scale-110 transition-transform drop-shadow-lg">{folder.icon}</span>
                      <div>
                        <p className="text-white font-black text-xl leading-tight mb-1">{folder.name}</p>
                        <p className="text-teal-500 text-[10px] uppercase font-black tracking-widest">Hệ thống kho lưu trữ</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between mb-8 border-b border-[#D4AF37]/20 pb-4">
                  <button onClick={() => setPortView('selection')} className="text-teal-400 hover:text-[#D4AF37] text-sm font-black uppercase flex items-center gap-2">← Quay lại</button>
                  <h3 className="text-xl md:text-2xl font-black text-[#D4AF37] uppercase text-right tracking-tighter">{selectedFolder.name}</h3>
                </div>

                {portView === 'selection' && (
                  <div className="flex-1 flex flex-col justify-center gap-6 animate-in zoom-in-95">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-2xl mx-auto">
                      <button onClick={() => setPortView('student')} className="p-10 bg-gradient-to-br from-teal-800 to-teal-900 border-2 border-teal-500/30 rounded-[2.5rem] hover:border-[#D4AF37] transition-all group shadow-xl">
                        <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🎓</div>
                        <p className="text-xl font-black text-white uppercase tracking-tighter">CỔNG HỌC SINH</p>
                        <p className="text-teal-400 text-xs font-bold uppercase mt-1">Truy cập tài liệu</p>
                      </button>
                      <button onClick={() => setPortView('admin-login')} className="p-10 bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-500/30 rounded-[2.5rem] hover:border-[#D4AF37] transition-all group shadow-xl">
                        <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🔐</div>
                        <p className="text-xl font-black text-white uppercase tracking-tighter">CỔNG QUẢN TRỊ</p>
                        <p className="text-slate-400 text-xs font-bold uppercase mt-1">Dành cho cán bộ</p>
                      </button>
                    </div>
                  </div>
                )}

                {portView === 'admin-login' && (
                  <div className="max-w-md mx-auto w-full py-12 animate-in slide-in-from-bottom-4 text-center">
                    <h4 className="text-2xl font-black text-white mb-8 uppercase tracking-widest">Xác thực quyền hạn</h4>
                    <div className="space-y-6">
                      <input type="password" placeholder="Mật khẩu Admin" className="w-full p-5 bg-[#003d3d] border-2 border-[#006666] rounded-2xl text-white outline-none focus:border-[#D4AF37] transition-all text-center font-mono text-xl tracking-widest" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()} />
                      {adminError && <p className="text-red-400 text-xs font-bold">Mật khẩu không chính xác!</p>}
                      <button onClick={handleAdminLogin} className="w-full py-5 bg-[#D4AF37] text-[#003d3d] font-black rounded-2xl hover:bg-[#FCF6BA] transition-all shadow-xl uppercase tracking-widest">Đăng Nhập</button>
                    </div>
                  </div>
                )}

                {portView === 'admin-dashboard' && (
                  <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in">
                    <div className="bg-[#003d3d] p-6 rounded-3xl border border-[#006666] mb-8">
                      <h4 className="text-lg font-black text-white mb-6 uppercase tracking-wider flex items-center gap-2"><span className="text-[#D4AF37]">✚</span> Khai báo tài liệu mới</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input value={formName} onChange={e => setFormName(e.target.value)} placeholder="TÊN TÀI LIỆU" className="p-4 bg-black/20 border border-teal-800 rounded-xl text-white outline-none focus:border-[#D4AF37]" />
                        <input value={formExamLink} onChange={e => setFormExamLink(e.target.value)} placeholder="LINK ĐỀ" className="p-4 bg-black/20 border border-teal-800 rounded-xl text-white outline-none focus:border-[#D4AF37]" />
                        <input value={formAnswerLink} onChange={e => setFormAnswerLink(e.target.value)} placeholder="LINK ĐÁP ÁN" className="p-4 bg-black/20 border border-teal-800 rounded-xl text-white outline-none focus:border-[#D4AF37]" />
                        <input value={formGuideLink} onChange={e => setFormGuideLink(e.target.value)} placeholder="LINK HƯỚNG DẪN GIẢI CHI TIẾT" className="p-4 bg-black/20 border border-teal-800 rounded-xl text-white outline-none focus:border-[#D4AF37]" />
                        <input value={formFilePassword} onChange={e => setFormFilePassword(e.target.value)} placeholder="MẬT KHẨU TÀI LIỆU (NẾU CÓ)" className="p-4 bg-black/20 border border-teal-800 rounded-xl text-white outline-none focus:border-[#D4AF37] col-span-full" />
                      </div>
                      <button onClick={handleAddFile} className="mt-6 w-full py-4 bg-teal-600 hover:bg-teal-500 text-white font-black rounded-xl transition-all shadow-lg uppercase tracking-widest">Xác nhận khai báo</button>
                    </div>

                    <div className="bg-[#003d3d]/50 p-6 rounded-3xl border border-dashed border-[#D4AF37]/40 mb-8">
                      <h4 className="text-lg font-black text-[#D4AF37] mb-4 uppercase tracking-wider">Hệ thống đồng bộ dữ liệu liên trình duyệt</h4>
                      <p className="text-teal-400 text-[10px] mb-4 uppercase font-bold">* Dùng tính năng này để mang dữ liệu sang máy tính hoặc trình duyệt khác</p>
                      <textarea value={syncCode} onChange={e => setSyncCode(e.target.value)} placeholder="Dán mã đồng bộ vào đây để khôi phục..." className="w-full h-20 p-4 bg-black/40 border border-teal-800 rounded-xl text-teal-200 outline-none focus:border-[#D4AF37] text-[10px] font-mono mb-4" />
                      <div className="grid grid-cols-2 gap-4">
                        <button onClick={handleExportSync} className="py-3 bg-[#D4AF37] text-[#003d3d] font-black rounded-xl hover:bg-[#FCF6BA] transition-all uppercase text-xs">Xuất mã đồng bộ</button>
                        <button onClick={handleImportSync} className="py-3 bg-teal-700 text-white font-black rounded-xl hover:bg-teal-600 transition-all uppercase text-xs">Áp dụng mã đồng bộ</button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                      <h4 className="text-xs font-black text-teal-400 mb-4 uppercase tracking-[0.2em]">Danh sách tài liệu</h4>
                      <div className="space-y-3">
                        {(declaredFiles[selectedFolder.id] || []).map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-4 bg-black/20 border border-[#006666] rounded-2xl group text-left">
                            <div>
                              <p className="text-white font-bold">{file.name}</p>
                              <div className="flex gap-2">
                                <p className="text-teal-600 text-[10px] uppercase font-black truncate max-w-xs">{file.examLink}</p>
                                {file.password && <span className="text-yellow-500 text-[10px] font-black uppercase">🔑 {file.password}</span>}
                              </div>
                            </div>
                            <button onClick={() => handleDeleteFile(file.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all">🗑</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {portView === 'student' && (
                  <div className="flex-1 overflow-y-auto custom-scrollbar animate-in slide-in-from-right-4 pr-2">
                    <h4 className="text-2xl font-black text-white mb-8 uppercase text-center">CỔNG HỌC SINH XEM ĐỀ</h4>
                    <div className="grid grid-cols-1 gap-4 pb-6">
                      {(declaredFiles[selectedFolder.id] || []).map((file) => (
                        <div key={file.id} className="bg-[#003d3d]/80 border border-[#006666] p-6 rounded-3xl hover:border-[#D4AF37] transition-all shadow-xl text-left">
                          <h5 className="text-xl font-black text-white mb-6 flex items-center gap-3"><span className="text-2xl">📄</span> {file.name}</h5>
                          {file.password && !unlockedFiles.has(file.id) ? (
                            <div className="bg-black/20 p-6 rounded-2xl border border-yellow-600/30 text-center">
                              <p className="text-yellow-500 text-xs font-black uppercase mb-4">Tài liệu này yêu cầu mật khẩu riêng</p>
                              <div className="flex flex-col sm:flex-row gap-2">
                                <input type="password" placeholder="Nhập mật khẩu tài liệu" className="flex-1 p-3 bg-teal-900/40 border border-teal-700 rounded-xl text-white outline-none focus:border-yellow-500 text-center" value={studentPasswordInput[file.id] || ''} onChange={(e) => setStudentPasswordInput(prev => ({...prev, [file.id]: e.target.value}))} onKeyDown={(e) => e.key === 'Enter' && handleUnlockFile(file)} />
                                <button onClick={() => handleUnlockFile(file)} className="px-6 py-3 bg-yellow-600 text-black font-black rounded-xl hover:bg-yellow-500 transition-all uppercase text-xs">MỞ KHÓA</button>
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <a href={file.examLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 p-3 bg-teal-900/50 text-teal-300 border border-teal-500/30 rounded-xl font-bold text-xs hover:bg-teal-700 hover:text-white transition-all uppercase">📥 Link Đề</a>
                              <a href={file.answerLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 p-3 bg-blue-900/30 text-blue-300 border border-blue-500/30 rounded-xl font-bold text-xs hover:bg-blue-700 hover:text-white transition-all uppercase">✅ Link Đáp án</a>
                              <a href={file.guideLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 p-3 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 rounded-xl font-bold text-xs hover:bg-[#D4AF37] hover:text-[#003d3d] transition-all uppercase text-center">💡 Giải chi tiết</a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {showGuideModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center px-4 bg-black/95 backdrop-blur-xl overflow-y-auto py-10">
          <div className="max-w-4xl w-full bg-[#004d4d] border border-[#D4AF37]/30 rounded-[2.5rem] p-6 md:p-10 shadow-[0_0_60px_rgba(212,175,55,0.15)] relative text-left max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => setShowGuideModal(false)} className="sticky top-0 self-end float-right -mt-2 -mr-2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-[#D4AF37] text-[#003d3d] z-20 font-black shadow-lg hover:rotate-90 transition-all">✕</button>
            <h3 className="text-2xl md:text-4xl font-black text-white mb-10 uppercase tracking-widest border-b-4 border-[#D4AF37] pb-4 inline-block">CẨM NANG SỬ DỤNG</h3>
            <div className="space-y-12">
              <section className="bg-teal-900/20 p-6 md:p-8 rounded-[2rem] border border-teal-500/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-[#D4AF37] rounded-2xl flex items-center justify-center text-2xl font-black text-[#003d3d] shadow-lg">1</div>
                  <h4 className="text-xl md:text-2xl font-black text-[#D4AF37] uppercase tracking-tight">KHO TÀI LIỆU PHONG PHÚ</h4>
                </div>
                <div className="space-y-6 md:pl-16">
                  <div>
                    <p className="text-white font-black text-lg mb-3">Làm sao để truy cập?</p>
                    <ul className="text-slate-300 space-y-3 text-sm md:text-base ml-4">
                      <li>• Nhấn vào thẻ <b className="text-[#D4AF37]">KHO TÀI LIỆU PHONG PHÚ</b> tại trang chủ.</li>
                      <li>• Lựa chọn <b className="text-white">thư mục chuyên biệt</b> phù hợp với nhu cầu.</li>
                      <li>• Chọn <b className="text-[#D4AF37]">"CỔNG HỌC SINH"</b> để xem tài liệu công khai.</li>
                    </ul>
                  </div>
                </div>
              </section>
              <section className="bg-teal-900/20 p-6 md:p-8 rounded-[2rem] border border-teal-500/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center text-2xl font-black text-[#003d3d] shadow-lg">2</div>
                  <h4 className="text-xl md:text-2xl font-black text-teal-400 uppercase tracking-tight">ĐỀ THI THỬ TN THPT MÔN HÓA HỌC- 2026</h4>
                </div>
                <div className="space-y-6 md:pl-16">
                  <p className="text-white font-black text-lg mb-3">Quy trình làm bài:</p>
                  <ol className="text-slate-300 space-y-4 text-sm md:text-base ml-4 list-decimal">
                    <li>Nhấn <b className="text-white uppercase">ĐỀ THI THỬ TN THPT MÔN HÓA HỌC- 2026</b> để vào danh sách đề thi.</li>
                    <li>Tại cổng Học Sinh: ghi <b className="text-teal-300">họ tên, lớp</b>. Mật khẩu:<b className="text-[#D4AF37]">HS1234</b></li>
                    <li>Sau khi nộp bài, hệ thống sẽ <b className="text-green-400">chấm điểm tức thì</b>.</li>
                    <li className="bg-[#D4AF37]/10 p-4 rounded-xl border border-[#D4AF37]/20">Thí sinh muốn xem lời giải chi tiết liên hệ zalo:<b className="text-[#D4AF37] text-lg">0937648777</b></li>
                  </ol>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {showWelcomeModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 bg-black/95 backdrop-blur-md overflow-y-auto py-10">
          <div className="max-w-4xl w-full bg-[#004d4d] border border-[#D4AF37]/30 rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative flex flex-col items-center max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowWelcomeModal(false)} className="sticky top-0 self-end -mt-2 -mr-2 w-10 h-10 flex items-center justify-center rounded-full bg-[#D4AF37] text-[#003d3d] hover:rotate-90 transition-all z-20 font-black shadow-lg mb-4">✕</button>
            <div className="w-full text-center py-10">
              <h3 className="text-2xl font-black text-[#D4AF37] mb-8 uppercase tracking-widest">TRUY CẬP HỆ THỐNG</h3>
              <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto">
                <a href="https://drive.google.com/file/d/1VCOzlAo0YAykCBrpGmFTvepVzweV4M_1/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="flex-1 p-10 bg-[#003d3d] border border-[#006666] rounded-3xl hover:border-[#D4AF37] transition-all group shadow-xl"><div className="text-6xl mb-4">🎓</div><p className="text-lg font-black text-white uppercase mb-1">CỔNG HỌC SINH</p><p className="text-teal-400 text-[10px] font-black uppercase">Tài liệu miễn phí</p></a>
                <div onClick={handleLuyenDeClick} className="flex-1 p-10 bg-[#003d3d] border border-[#006666] rounded-3xl hover:border-[#D4AF37] transition-all group shadow-xl cursor-pointer"><div className="text-6xl mb-4">🌏</div><p className="text-lg font-black text-white uppercase mb-1">ĐỀ THI THỬ TN THPT</p><p className="text-teal-300 text-[10px] font-black uppercase">Vào hệ thống thi chính thức</p></div>
                <div onClick={() => { setShowFolders(true); setShowWelcomeModal(false); }} className="flex-1 p-10 bg-[#003d3d] border border-[#006666] rounded-3xl hover:border-[#D4AF37] transition-all group shadow-xl cursor-pointer"><div className="text-6xl mb-4">📂</div><p className="text-lg font-black text-white uppercase mb-1">KHO TÀI LIỆU</p><p className="text-[#D4AF37] text-[10px] font-black uppercase">Hệ thống thư mục</p></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FeatureCard: React.FC<{icon: string, title: string, subtitle?: string, desc: string, visitors?: number}> = ({ icon, title, subtitle, desc, visitors }) => {
  return (
    <div className="p-6 md:p-8 h-full bg-[#004d4d]/60 border border-teal-500/20 rounded-[2.5rem] shadow-[0_15px_35px_rgba(0,0,0,0.5)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.7)] hover:-translate-y-3 transition-all duration-500 group flex flex-col items-center min-h-[400px] md:min-h-[440px] relative overflow-hidden backdrop-blur-md border-t-teal-400/20">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      {visitors !== undefined && (
        <div className="mb-4 px-3 py-1 bg-black/40 border border-teal-500/30 rounded-full flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-[10px] md:text-xs font-bold text-teal-300 uppercase tracking-wider">Số thí sinh đăng nhập: <span className="text-white">{visitors.toLocaleString()}</span></span>
        </div>
      )}
      <div className="text-5xl md:text-7xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-700 drop-shadow-[0_5px_15px_rgba(0,0,0,0.4)]">{icon}</div>
      <h3 className="text-lg md:text-xl font-black text-[#D4AF37] mb-2 uppercase tracking-tight text-center leading-tight group-hover:text-[#FCF6BA] transition-colors drop-shadow-md">{title}</h3>
      {subtitle && <p className="text-[10px] md:text-xs font-black text-teal-300 mb-4 px-2 italic text-center uppercase tracking-widest">{subtitle}</p>}
      <p className="text-slate-300 text-xs md:text-sm leading-relaxed mb-8 px-4 text-center font-medium opacity-80 group-hover:opacity-100 transition-opacity duration-300">{desc}</p>
      <div className="mt-auto px-8 py-3 bg-[#003d3d] border border-teal-500/30 text-[#D4AF37] rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] shadow-xl group-hover:bg-[#D4AF37] group-hover:text-[#003d3d] transition-all duration-300 transform active:scale-95">KHÁM PHÁ</div>
    </div>
  );
};

export default Hero;
