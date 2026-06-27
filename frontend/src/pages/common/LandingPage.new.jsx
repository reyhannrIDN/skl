import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { 
  GraduationCap, 
  Search,
  ShieldCheck, 
  Zap,
  CheckCircle2,
  Award,
  ChevronRight,
  School,
  ArrowRight,
  Sparkles,
  Lock,
  Clock,
  CheckCheck,
  Bell,
  ExternalLink,
  Scroll
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export function LandingPage() {
  const { user } = useAuthStore();
  const [searchNisn, setSearchNisn] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'superadmin': return '/admin/dashboard';
      case 'guru': return '/guru/dashboard';
      case 'siswa': return '/siswa/dashboard';
      default: return '/login';
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchNisn.trim()) {
      toast.error('Masukkan NISN/ID Siswa');
      return;
    }
    setIsSearching(true);
    setSearchResult(null);
    
    setTimeout(() => {
      setIsSearching(false);
      setSearchResult({
        name: "Muhamad Bintang Rizky",
        nisn: searchNisn,
        kelas: "XII Rekayasa Perangkat Lunak 1",
        status: "LULUS",
        tanggal: "13 Maret 2026"
      });
      setTimeout(() => {
        document.getElementById('hasil-kelulusan')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    }, 1500);
  };

  return (
    <div className="dark min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col font-sans relative overflow-x-hidden">
      
      {/* Premium Animated Background Effects */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        {/* Gradient orbs - subtle and elegant */}
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-blue-500/20 via-blue-400/10 to-transparent rounded-full blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-amber-500/15 via-amber-400/5 to-transparent rounded-full blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-15%] left-[10%] w-[500px] h-[500px] bg-gradient-to-br from-purple-500/15 via-purple-400/5 to-transparent rounded-full blur-3xl opacity-25 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-[5%] right-[5%] w-[400px] h-[400px] bg-gradient-to-br from-cyan-500/10 via-cyan-400/5 to-transparent rounded-full blur-3xl opacity-20"></div>
        
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-grid-pattern"></div>
        
        {/* Radial gradient for depth */}
        <div className="absolute inset-0 bg-radial-gradient opacity-40"></div>
      </div>

      {/* =============== PREMIUM STICKY NAVBAR =============== */}
      <nav className="w-full sticky top-0 z-50 border-b border-slate-800/50 bg-gradient-to-b from-slate-950/95 via-slate-900/90 to-slate-950/85 backdrop-blur-xl">
        <div className="container mx-auto px-4 lg:px-8 h-[72px] flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 via-cyan-400 to-amber-400 shadow-lg shadow-blue-500/30 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10 group-hover:from-white/40 group-hover:to-white/20 transition-all duration-300"></div>
              <GraduationCap className="w-6 h-6 text-white relative z-10 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-serif font-bold text-lg tracking-tight text-white group-hover:text-blue-300 transition-colors">IPSA</span>
              <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-blue-200/60">IDN Pamijahan Super Apps</span>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a href="#informasi" className="relative text-slate-300 hover:text-white transition-colors group">
                Informasi
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#pengumuman" className="relative text-slate-300 hover:text-white transition-colors group">
                Pengumuman
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#" className="relative text-slate-300 hover:text-white transition-colors group">
                Panduan
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>
            {user ? (
               <Button asChild className="rounded-lg px-6 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/40 transition-all font-semibold border-0">
                 <Link to={getDashboardLink()}>
                   Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                 </Link>
               </Button>
            ) : (
              <Button asChild className="rounded-lg px-6 h-10 bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/40 transition-all font-semibold">
                <Link to="/login">Login Admin</Link>
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* =============== MAIN CONTENT =============== */}
      <main className="flex-1 flex flex-col items-center relative">
        
        {/* =============== HERO SECTION =============== */}
        <section className="w-full pt-24 pb-32 flex flex-col items-center justify-center text-center px-4 relative">
          
          {/* Badge */}
          <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-full backdrop-blur-sm hover:border-blue-500/60 transition-all cursor-default group">
              <Sparkles className="w-4 h-4 text-blue-400 group-hover:animate-spin transition-transform" />
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">Platform Verifikasi Terpercaya</span>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white max-w-5xl leading-[1.05] mb-8 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-100 tracking-tight">
            IDN Pamijahan Super Apps <br className="hidden md:block"/>
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-amber-400 bg-clip-text text-transparent">Sekolah IDN</span>
              <span className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-blue-400/50 via-cyan-400 to-blue-400/50 blur-sm mx-auto w-3/4"></span>
            </span>
          </h1>
          
          {/* Subheading */}
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-16 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-200 leading-relaxed font-light">
            Platform verifikasi kelulusan digital yang modern, transparan, dan terpercaya. 
            <span className="block mt-3 text-slate-200 font-medium">Teknologi blockchain untuk autentikasi dokumen resmi sekolah.</span>
          </p>

          {/* Premium Search Card */}
          <div className="w-full max-w-2xl animate-in fade-in zoom-in-95 duration-1000 delay-300 relative z-10" id="cek-kelulusan">
            <div className="relative">
              {/* Glow effect background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/40 via-cyan-500/30 to-blue-500/40 rounded-2xl blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
              
              {/* Search card */}
              <form onSubmit={handleSearch} className="relative bg-gradient-to-br from-slate-800/60 via-slate-900/50 to-slate-950/60 border border-slate-700/50 backdrop-blur-xl rounded-2xl p-3 group hover:border-slate-600/80 transition-all duration-500 shadow-2xl shadow-blue-500/10">
                <div className="flex items-center gap-3 px-6 py-1">
                  <Search className="w-5 h-5 text-blue-400/70 group-hover:text-blue-400 transition-colors" />
                  <Input 
                    type="text" 
                    placeholder="Cari hasil kelulusan dengan NISN atau ID Siswa..." 
                    className="flex-1 border-0 bg-transparent h-16 text-base text-white focus-visible:ring-0 px-2 placeholder:text-slate-500 disabled:opacity-50 font-medium"
                    value={searchNisn}
                    onChange={(e) => setSearchNisn(e.target.value)}
                    disabled={isSearching}
                  />
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="h-14 px-8 rounded-xl text-base font-bold bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white ml-2 shrink-0 transition-all shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 disabled:opacity-70 border-0" 
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Mencari...
                      </span>
                    ) : (
                      <>
                        Cek Kelulusan
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* Helper text */}
            <p className="text-xs text-slate-400 mt-4 text-center">
              ✓ Verifikasi instan &nbsp; • &nbsp; Aman & Terpercaya &nbsp; • &nbsp; Resmi dari Sekolah
            </p>
          </div>

          {/* Result Card - WOW Section */}
          {searchResult && (
            <div id="hasil-kelulusan" className="w-full max-w-3xl mt-20 animate-in slide-in-from-bottom-12 fade-in duration-700 relative z-10">
              <div className="relative group">
                {/* Glowing border */}
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/60 via-cyan-500/30 to-emerald-500/60 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Result card */}
                <div className="relative bg-gradient-to-br from-slate-800/70 via-slate-900/60 to-slate-950/70 border border-slate-700/60 rounded-2xl p-1 overflow-hidden">
                  <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-10 md:p-12 text-left relative overflow-hidden backdrop-blur-sm">
                    
                    {/* Success gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-40 pointer-events-none"></div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-8 right-8 px-5 py-2 bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 rounded-full text-sm font-bold tracking-widest shadow-lg shadow-emerald-500/20 animate-pulse flex items-center gap-2 group/badge hover:border-emerald-500/70 transition-colors">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>{searchResult.status}</span>
                      <CheckCheck className="w-4 h-4" />
                    </div>

                    {/* Header */}
                    <div className="mb-10 relative z-10">
                      <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">✓ Hasil Verifikasi Resmi</h3>
                      <div className="h-1.5 w-16 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full shadow-lg shadow-emerald-500/40"></div>
                    </div>
                    
                    {/* Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 relative z-10 mb-12">
                      <div className="group/item">
                        <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Nama Lengkap</p>
                        <p className="text-2xl font-serif font-bold text-white">{searchResult.name}</p>
                      </div>
                      <div className="group/item">
                        <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">NISN / ID</p>
                        <p className="text-xl font-mono font-semibold text-cyan-300 tracking-wider">{searchResult.nisn}</p>
                      </div>
                      <div className="group/item md:col-span-2">
                        <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Program Keahlian</p>
                        <p className="text-lg text-slate-200 leading-relaxed">{searchResult.kelas}</p>
                      </div>
                      <div className="group/item md:col-span-2">
                        <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Tanggal Pengumuman</p>
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-emerald-400" />
                          <p className="text-lg text-slate-200">{searchResult.tanggal}</p>
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent my-8"></div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                      <Button asChild className="flex-1 h-12 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/40 transition-all border-0">
                        <Link to="/login" className="flex items-center justify-center gap-2">
                          <Lock className="w-4 h-4" />
                          Lihat Dokumen SKL Resmi
                        </Link>
                      </Button>
                      <Button asChild className="h-12 px-6 rounded-xl bg-white/5 border border-slate-600 text-slate-200 font-semibold hover:bg-white/10 hover:border-slate-500 transition-all">
                        <a href="#" className="flex items-center justify-center gap-2">
                          <ExternalLink className="w-4 h-4" />
                          Download PDF
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* =============== FEATURES SECTION =============== */}
        <section id="informasi" className="w-full py-40 px-4 relative z-10">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Keunggulan Platform</h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">Teknologi terdepan untuk verifikasi kelulusan digital yang aman, cepat, dan terpercaya.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  icon: <CheckCircle2 className="w-7 h-7 text-blue-400" />, 
                  title: "Transparan & Terverifikasi", 
                  desc: "Kelulusan resmi langsung dari sekolah dengan timestamp digital dan tanda tangan elektronik yang aman.",
                  badge: "Terpercaya",
                  color: "from-blue-500/20 to-cyan-500/10"
                },
                { 
                  icon: <Zap className="w-7 h-7 text-amber-400" />, 
                  title: "Proses Instan", 
                  desc: "Hasil dapat diperoleh dalam hitungan detik tanpa antrian panjang atau proses administratif yang rumit.",
                  badge: "Cepat",
                  color: "from-amber-500/20 to-orange-500/10"
                },
                { 
                  icon: <ShieldCheck className="w-7 h-7 text-emerald-400" />, 
                  title: "Keamanan Berlapis", 
                  desc: "Data sensitif dilindungi dengan enkripsi tingkat bank dan standar keamanan internasional ISO 27001.",
                  badge: "Aman",
                  color: "from-emerald-500/20 to-cyan-500/10"
                }
              ].map((feature, idx) => (
                <div key={idx} className="group relative">
                  <div className="relative overflow-hidden rounded-2xl h-full">
                    {/* Glow on hover */}
                    <div className={`absolute -inset-1 bg-gradient-to-br ${feature.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    
                    {/* Card */}
                    <div className="relative bg-gradient-to-br from-slate-800/50 via-slate-900/50 to-slate-950/50 border border-slate-700/50 group-hover:border-slate-600/80 p-10 h-full flex flex-col rounded-2xl backdrop-blur-sm transition-all duration-300">
                      {/* Badge */}
                      <div className="inline-flex items-center gap-2 mb-6 w-fit">
                        <span className={`px-3 py-1 bg-gradient-to-r ${feature.color} border border-slate-600/50 text-slate-100 text-xs font-bold rounded-full tracking-wider uppercase`}>
                          {feature.badge}
                        </span>
                      </div>

                      {/* Icon */}
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} border border-slate-600/50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300`}>
                        {feature.icon}
                      </div>

                      {/* Title & Desc */}
                      <h3 className="text-2xl font-serif font-bold text-white mb-4">{feature.title}</h3>
                      <p className="text-slate-300 leading-relaxed flex-1 text-[15px]">{feature.desc}</p>

                      {/* Arrow */}
                      <div className="mt-6 flex items-center text-blue-400 font-semibold text-sm group-hover:translate-x-2 transition-transform">
                        Pelajari lebih lanjut <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =============== ANNOUNCEMENT SECTION =============== */}
        <section id="pengumuman" className="w-full py-40 px-4 relative z-10">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center justify-between mb-16">
               <div>
                 <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">Pengumuman Terbaru</h2>
                 <p className="text-slate-400">Informasi penting seputar kelulusan dan pendaftaran.</p>
               </div>
               <Button variant="ghost" className="text-blue-400 font-semibold hover:text-blue-300 hover:bg-transparent pr-0 group border-0">
                 Lihat Semua 
                 <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
               </Button>
            </div>
            
            <div className="space-y-6">
              {[
                {
                  date: { day: 15, month: "Jun" },
                  title: "Pengambilan Ijazah dan Transkrip Nilai",
                  desc: "Bagi siswa yang telah dinyatakan LULUS, pengambilan ijazah asli dapat dilakukan di ruang Tata Usaha mulai tanggal 15 Juni dengan membawa persyaratan lengkap dan tanda pengenal resmi.",
                  icon: <Award className="w-6 h-6 text-blue-400" />
                },
                {
                  date: { day: 10, month: "Jun" },
                  title: "Batas Akhir Revisi Project Akhir",
                  desc: "Perhatian bagi seluruh siswa tingkat akhir, batas akhir pengiriman perbaikan project sesuai catatan guru pembimbing ditutup pada pukul 23:59 WIB. Pastikan repository Anda sudah final.",
                  icon: <Clock className="w-6 h-6 text-amber-400" />
                }
              ].map((announcement, idx) => (
                <div key={idx} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-2xl">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative bg-gradient-to-br from-slate-800/50 via-slate-900/50 to-slate-950/50 border border-slate-700/50 group-hover:border-slate-600/80 p-8 flex flex-col sm:flex-row gap-8 items-start sm:items-center transition-all duration-300 backdrop-blur-sm rounded-2xl">
                      {/* Date */}
                      <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/30 shadow-lg shadow-blue-500/10 p-6 rounded-2xl text-center min-w-[140px] group-hover:border-blue-500/60 transition-all">
                        <span className="block text-4xl font-black font-serif text-blue-300">{announcement.date.day}</span>
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2 block">{announcement.date.month}</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="mt-1">{announcement.icon}</div>
                          <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">{announcement.title}</h3>
                        </div>
                        <p className="text-slate-400 line-clamp-2 leading-relaxed text-[15px]">{announcement.desc}</p>
                      </div>

                      <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =============== CTA SECTION =============== */}
        <section className="w-full py-40 px-4 relative z-10">
          <div className="container mx-auto max-w-4xl">
            <div className="relative overflow-hidden rounded-3xl">
              {/* Background effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-cyan-500/20 to-blue-500/30"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent"></div>

              <div className="relative bg-gradient-to-br from-slate-800/70 via-slate-900/60 to-slate-950/70 border border-slate-700/50 backdrop-blur-sm p-12 md:p-16 text-center rounded-3xl">
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Mulai Verifikasi Kelulusan Anda</h2>
                <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10">Proses cepat, aman, dan resmi. Dapatkan dokumen verifikasi digital Anda dalam hitungan detik.</p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="h-14 px-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold hover:shadow-lg hover:shadow-blue-500/40 transition-all border-0">
                    <a href="#cek-kelulusan">Cek Kelulusan Sekarang</a>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="h-14 px-10 rounded-xl font-bold border-slate-600 text-white bg-white/5 hover:bg-white/10 hover:border-slate-500 transition-all">
                    <a href="#pengumuman" className="flex items-center justify-center gap-2">
                      <Bell className="w-5 h-5" />
                      Lihat Pengumuman
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =============== FOOTER =============== */}
      <footer className="w-full border-t border-slate-800/50 bg-gradient-to-b from-slate-950/80 to-slate-950 backdrop-blur-xl pt-20 pb-8 px-4 z-10 relative mt-auto">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-cyan-400 to-amber-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <School className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-serif font-bold text-xl text-white">IPSA</span>
                  <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-400/60 mt-0.5">IDN Pamijahan Super Apps</div>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed max-w-xs mb-8 text-[15px]">
                Platform verifikasi kelulusan digital modern yang membangun kepercayaan antara sekolah dan siswa melalui teknologi blockchain.
              </p>
              <div className="flex gap-4">
                {[
                  { icon: "f", label: "Facebook" },
                  { icon: "𝕏", label: "Twitter" },
                  { icon: "in", label: "LinkedIn" }
                ].map((social, idx) => (
                  <a key={idx} href="#" className="w-10 h-10 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 flex items-center justify-center text-blue-400 hover:text-blue-300 transition-all font-semibold text-sm border border-blue-500/20 hover:border-blue-500/40">
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-sm">Tautan Cepat</h4>
              <ul className="space-y-3">
                {["Portal Utama", "E-Learning", "PPDB", "Login Admin"].map((link, idx) => (
                  <li key={idx}>
                    <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors text-sm font-medium group flex items-center gap-1">
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-sm">Hubungi Kami</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5">📍</span> 
                  <span>Jl. Pendidikan No. 123<br/>Kota Pelajar, Indonesia</span>
                </li>
                <li className="flex items-center gap-3">
                  <span>✉️</span> 
                  <a href="mailto:info@sekolah.idn" className="hover:text-blue-400 transition-colors">info@sekolah.idn</a>
                </li>
                <li className="flex items-center gap-3">
                  <span>📱</span>
                  <a href="tel:+62214567890" className="hover:text-blue-400 transition-colors">+62 (21) 4567 890</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent my-12"></div>

          {/* Bottom */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400 font-medium">
            <p>© 2026 IPSA. Semua hak dilindungi. Dikembangkan dengan passion untuk pendidikan Indonesia.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-blue-400 transition-colors">Kebijakan Privasi</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Syarat & Ketentuan</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Hubungi Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
