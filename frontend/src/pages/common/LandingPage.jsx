import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import './LandingPage.css';

/* ── Dashboard link helper ── */
function getDashboardLink(role) {
  switch (role) {
    case 'superadmin': return '/admin/dashboard';
    case 'guru':       return '/guru/dashboard';
    case 'siswa':      return '/siswa/dashboard';
    case 'idn':        return '/idn/dashboard';
    case 'kepala_sekolah': return '/idn/dashboard';
    default:           return '/';
  }
}

/* ══════════════════════════════════════════════════════════════
   HOOKS
   ══════════════════════════════════════════════════════════════ */

/** Animated counter — triggers once visible */
function CountUp({ target, suffix = '', duration = 2000, className }) {
  const [display, setDisplay] = useState('0' + suffix);
  const ref = useRef(null);
  const ran = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !ran.current) {
        ran.current = true;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
          setDisplay(Math.round(ease * target) + suffix);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, suffix, duration]);

  return <div className={className} ref={ref}>{display}</div>;
}

/** Scroll reveal — adds .in class on intersection */
function useReveal() {
  const items = useRef([]);
  const register = useCallback((el) => {
    if (el && !items.current.includes(el)) items.current.push(el);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          e.target.style.transitionDelay = `${i * 0.08}s`;
          e.target.classList.add('in');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    items.current.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return register;
}

/** Category bar animation */
function useCatBars() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.querySelectorAll('.cat-bar').forEach((bar) => {
          bar.classList.add('animated');
        });
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ══════════════════════════════════════════════════════════════
   DATA
   ══════════════════════════════════════════════════════════════ */

const MARQUEE_ITEMS = [
  '⚡ Kotlin','🌐 React.js','🤖 Arduino','🎮 Unity','🔌 ESP32',
  '📱 Flutter','🧠 TensorFlow','🛠 Node.js','🗄 PostgreSQL','🐍 Python',
  '🎯 C#','🔧 STM32','💡 Raspberry Pi','⚙ Laravel','🌊 Vue.js',
];

const CATEGORIES = [
  { emoji: '📱', name: 'Android App', n: '342 project', w: '.85', cls: 'c-android' },
  { emoji: '🌐', name: 'Website',     n: '289 project', w: '.72', cls: 'c-web' },
  { emoji: '🤖', name: 'Robotika',    n: '198 project', w: '.50', cls: 'c-robot' },
  { emoji: '🎮', name: 'Game Dev',    n: '154 project', w: '.38', cls: 'c-game' },
  { emoji: '🔌', name: 'IoT',         n: '117 project', w: '.29', cls: 'c-iot' },
];

const STEPS = [
  { emoji: '📝', idx: 1, h: 'Daftar & Buat Akun',  p: 'Daftar gratis dengan email sekolah atau kode unik yang diberikan guru.' },
  { emoji: '📤', idx: 2, h: 'Upload Project',       p: 'Isi detail project, unggah file atau link demo, dan pilih kategori yang sesuai.' },
  { emoji: '👩‍🏫', idx: 3, h: 'Guru Review',          p: 'Guru memeriksa project dan memberikan feedback atau persetujuan langsung di platform.' },
  { emoji: '🏆', idx: 4, h: 'Project Bersinar',     p: 'Project yang disetujui tampil di showcase publik dan bisa dilihat semua orang.' },
];

const DUMMY_LOMBA = [
  { id: 'd1', nama_lomba: 'LKS Nasional Web Tech', tingkat: 'nasional', status_hasil: 'juara', juara_ke: 1, kategori: 'Website', lokasi: 'Jakarta', tanggal_mulai: '2025-10-12', tim: [{ nama_tim: 'IDN Web', peserta: [{nama: 'Budi'}, {nama: 'Andi'}] }], pendamping: 'Pak Purnomo' },
  { id: 'd2', nama_lomba: 'Hackathon IoT Nusantara', tingkat: 'nasional', status_hasil: 'juara', juara_ke: 2, kategori: 'IoT', lokasi: 'Bandung', tanggal_mulai: '2025-11-05', tim: [{ nama_tim: 'Smart IoT', peserta: [{nama: 'Siti'}, {nama: 'Rina'}] }], pendamping: 'Bu Sari' },
  { id: 'd3', nama_lomba: 'Lomba Robotika Pelajar', tingkat: 'provinsi', status_hasil: 'juara', juara_ke: 3, kategori: 'Robotika', lokasi: 'Surabaya', tanggal_mulai: '2025-08-20', tim: [{ nama_tim: 'RoboIDN', peserta: [{nama: 'Doni'}, {nama: 'Eka'}] }], pendamping: 'Pak Joko' },
  { id: 'd4', nama_lomba: 'Olimpiade Jaringan', tingkat: 'nasional', status_hasil: 'finalis', juara_ke: null, kategori: 'Networking', lokasi: 'Online', tanggal_mulai: '2025-09-15', tim: [{ nama_tim: 'NetOps', peserta: [{nama: 'Fajar'}, {nama: 'Gilang'}] }], pendamping: 'Bu Rina' },
  { id: 'd5', nama_lomba: 'Game Dev Challenge', tingkat: 'internasional', status_hasil: 'juara', juara_ke: 1, kategori: 'Game Dev', lokasi: 'Online', tanggal_mulai: '2025-12-01', tim: [{ nama_tim: 'PixWiz', peserta: [{nama: 'Hani'}, {nama: 'Indra'}] }], pendamping: 'Pak Agus' },
  { id: 'd6', nama_lomba: 'Mobile App Contest', tingkat: 'provinsi', status_hasil: 'juara', juara_ke: 2, kategori: 'Android App', lokasi: 'Semarang', tanggal_mulai: '2025-07-10', tim: [{ nama_tim: 'AppCraft', peserta: [{nama: 'Joni'}, {nama: 'Kiki'}] }], pendamping: 'Pak Eko' },
];

/* ── Lomba Showcase Card Components ── */

function ShowcaseCardContent({ lomba }) {
  const [imgErr, setImgErr] = useState(false);
  const fotoUrl = lomba.foto?.[0];
  const juaraColors = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' };
  const hasMedal = lomba.tingkat === 'nasional' && lomba.status_hasil === 'juara' && lomba.juara_ke <= 3;

  return (
    <div className="s-card">
      {lomba.juara_ke && (
        <div className="s-card-ribbon" style={{
          background: hasMedal ? juaraColors[lomba.juara_ke] : 'var(--grad-2, #6366f1)',
          boxShadow: hasMedal ? `0 0 20px ${juaraColors[lomba.juara_ke]}66` : 'none',
        }}>
          {hasMedal ? '🏅 Juara ' + lomba.juara_ke : lomba.juara_ke}
        </div>
      )}
      <div className="s-card-img-wrap">
        {fotoUrl && !imgErr ? (
          <a href={fotoUrl} data-fancybox="gallery" data-caption={lomba.nama_lomba} className="block w-full h-full">
            <img
              src={fotoUrl}
              alt={lomba.nama_lomba}
              className="s-card-img cursor-pointer"
              loading="lazy"
              onError={() => setImgErr(true)}
            />
          </a>
        ) : (
          <div className="s-card-img-placeholder">🏆</div>
        )}
        <div className="s-card-img-overlay" />
      </div>
      <div className="s-card-body">
        <div className="s-card-badges">
          <span className="s-badge s-badge-level">{lomba.tingkat}</span>
          <span className="s-badge s-badge-cat">{lomba.kategori}</span>
        </div>
        <h4 className="s-card-title">{lomba.nama_lomba}</h4>
        <div className="s-card-meta">
          <span className="s-meta-item">📍 {lomba.lokasi || 'Online'}</span>
          <span className="s-meta-item">📅 {lomba.tanggal_mulai}</span>
        </div>
        {lomba.tim?.length > 0 && (
          <div className="s-card-teams">
            {lomba.tim.slice(0, 2).map((t, ti) => (
              <div key={ti} className="s-card-team">
                <div className="s-team-name">{t.nama_tim}</div>
                <div className="s-team-members">
                  {t.peserta?.slice(0, 3).map((p, pi) => (
                    <span key={pi} className="s-member">{p.nama}{pi < Math.min(t.peserta.length, 3) - 1 ? ',' : ''}</span>
                  ))}
                  {t.peserta?.length > 3 && <span className="s-member-more">+{t.peserta.length - 3}</span>}
                </div>
              </div>
            ))}
            {lomba.tim.length > 2 && <div className="s-card-more-teams">+{lomba.tim.length - 2} tim lainnya</div>}
          </div>
        )}
        {lomba.pendamping && <div className="s-card-pendamping">👩‍🏫 {lomba.pendamping}</div>}
      </div>
    </div>
  );
}

function ShowcaseCard({ lomba, idx }) {
  return (
    <div className="showcase-card showcase-fade-in" style={{ '--idx': idx, animationDelay: `${idx * 0.1}s` }}>
      <ShowcaseCardContent lomba={lomba} />
    </div>
  );
}

function LombaCarousel({ lombaShowcase, ripple, onShowAll, showingAll }) {
  const [cur, setCur] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = lombaShowcase.length;

  useEffect(() => {
    if (paused || total <= 4) return;
    const timer = setInterval(() => {
      setCur((prev) => (prev + 1) % total);
    }, 4000);
    return () => clearInterval(timer);
  }, [paused, total]);

  const goNext = () => setCur((prev) => (prev + 1) % total);
  const goPrev = () => setCur((prev) => (prev - 1 + total) % total);

  const visible = [];
  for (let i = -1; i <= 2; i++) {
    visible.push(lombaShowcase[(cur + i + total) % total]);
  }

  return (
    <>
      <div className="showcase-carousel"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}>
        <button className="showcase-nav showcase-prev" onClick={goPrev} aria-label="Sebelumnya">‹</button>
        <div className="showcase-carousel-track">
          {visible.map((lomba, i) => {
            let cls = 'showcase-carousel-card';
            if (i === 1) cls += ' showcase-card-active';
            else if (i === 0) cls += ' showcase-card-prev';
            else cls += ' showcase-card-next';
            return (
              <div key={lomba.id} className={cls}
                style={{ '--pos': i - 1, '--z': i === 1 ? 3 : Math.abs(i - 1) === 1 ? 2 : 1 }}>
                <div className="showcase-card-inner">
                  <ShowcaseCardContent lomba={lomba} />
                </div>
              </div>
            );
          })}
        </div>
        <button className="showcase-nav showcase-next" onClick={goNext} aria-label="Selanjutnya">›</button>
      </div>
      <div className="showcase-dots">
        {lombaShowcase.map((_, i) => (
          <button key={i}
            className={`showcase-dot${i === cur ? ' active' : ''}`}
            onClick={() => setCur(i)}
            aria-label={`Slide ${i + 1}`} />
        ))}
      </div>
      <div className="showcase-footer-cta">
        <button className="cta-main btn-showcase-all" onClick={(e) => { ripple(e); onShowAll(); }}>
          {showingAll ? 'Tutup Daftar Lomba' : '🏆 Lihat Semua Lomba'}
        </button>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════════════ */
export function LandingPage() {
  const { user } = useAuthStore();
  const [navScrolled, setNavScrolled] = useState(false);
  const [idnStats, setIdnStats] = useState(null);
  const reveal = useReveal();
  const catGridRef = useCatBars();

  const [lombaShowcase, setLombaShowcase] = useState([]);
  const [showAllLomba, setShowAllLomba] = useState(false);

  // Fetch IDN stats & lomba showcase
  useEffect(() => {
    import('@/api/axios').then(({ default: api }) => {
      api.get('/public/idn-stats').then(({ data }) => setIdnStats(data)).catch(() => {});
      api.get('/public/lomba-showcase').then(({ data }) => setLombaShowcase(data)).catch(() => {});
    });
  }, []);

  // Initialize Fancybox
  useEffect(() => {
    Fancybox.bind("[data-fancybox]", {
      // Optional options
    });
    return () => {
      Fancybox.destroy();
    };
  }, []);

  // Nav scroll background
  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Smooth scroll
  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Ripple on CTA click
  const ripple = useCallback((e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const span = document.createElement('span');
    Object.assign(span.style, {
      position: 'absolute', borderRadius: '50%',
      width: '0', height: '0',
      left: `${e.clientX - rect.left}px`,
      top: `${e.clientY - rect.top}px`,
      background: 'rgba(255,255,255,.25)',
      transform: 'translate(-50%,-50%)',
      animation: 'lp-ripple .6s ease-out forwards',
      pointerEvents: 'none',
    });
    btn.appendChild(span);
    setTimeout(() => span.remove(), 700);
  }, []);

  return (
    <div className="landing-page">
      <div className="lp-noise" />

      {/* ═══════ NAV ═══════ */}
      <nav className={`lp-nav${navScrolled ? ' scrolled' : ''}`}>
        <Link to="/" className="lp-logo">
          <div className="logo-mark">⚡</div>
          <div className="flex flex-col">
            <span>IPSA</span>
            <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-slate-400/80 leading-none">IDN Pamijahan Super Apps</span>
          </div>
        </Link>

        <div className="nav-pill">
          <button className="on" onClick={() => scrollTo('hero')}>Beranda</button>
          <button onClick={() => scrollTo('lomba-showcase')}>Prestasi</button>
          <button onClick={() => scrollTo('categories')}>Kategori</button>
          <button onClick={() => scrollTo('how')}>Cara Kerja</button>
          <button onClick={() => scrollTo('testimonials')}>IDN Hebat</button>
        </div>

        <div className="nav-r">
          <ThemeToggle />
          {user ? (
            <Link to={getDashboardLink(user.role)} className="btn-nav btn-signup">
              Dashboard →
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-nav btn-login">Masuk</Link>
              <Link to="/register" className="btn-nav btn-signup">Daftar Gratis →</Link>
            </>
          )}
        </div>
      </nav>

      {/* ═══════ HERO ═══════ */}
      <section className="lp-hero" id="hero">
        <div className="aurora"><div className="a1" /><div className="a2" /><div className="a3" /></div>
        <div className="hero-grid" />

        <div className="hero-eyebrow">
          <div className="pulse-dot" />
          Platform #1 Showcase Project Siswa Indonesia
        </div>

        <h1>
          <span className="h1-line">Karya Siswa</span>
          <span className="h1-line h1-grad">Bersinar Nyata.</span>
        </h1>

        <p className="hero-sub">
          IPSA adalah platform di mana siswa <strong>upload project teknologi</strong> mereka — Android, Website, Robotika, Game, &amp; IoT — dan mendapat validasi resmi dari guru.
        </p>

        <div className="hero-cta">
          <Link to="/register" className="cta-main" onClick={ripple}>
            ⚡ Upload Project Sekarang
          </Link>
          <button className="cta-sec" onClick={() => scrollTo('categories')}>
            🔭 Jelajahi Showcase
          </button>
        </div>

        <div className="hero-stats">
          <div className="hstat">
            <CountUp target={idnStats?.total_students ?? 0} suffix="+" duration={2000} className="hstat-n" />
            <div className="hstat-l">Siswa yang sudah melaksanakan</div>
          </div>
          <div className="hstat">
            <CountUp target={idnStats?.total_schools ?? 0} suffix="" duration={1800} className="hstat-n" />
            <div className="hstat-l">Sekolah Dikunjungi</div>
          </div>
          <div className="hstat">
            <CountUp target={idnStats?.total_audience ?? 0} suffix="+" duration={1600} className="hstat-n" />
            <div className="hstat-l">Total Audience</div>
          </div>
          <div className="hstat">
            <CountUp target={idnStats?.total_teams ?? 0} suffix="" duration={2200} className="hstat-n" />
            <div className="hstat-l">Tim Pengajar</div>
          </div>
        </div>
      </section>

      {/* ═══════ MARQUEE ═══════ */}
      <div className="marquee-wrap">
        <div className="marquee-label">Teknologi yang digunakan siswa</div>
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <div className="m-item" key={i}>{item}</div>
          ))}
        </div>
      </div>

      {/* ═══════ FEATURES ═══════ */}
      <section className="lp-features">
        <div className="features-grid">

          {/* Visual cards */}
          <div className="feat-visual lp-reveal" ref={reveal}>
            <div className="feat-card-stack">

              {/* Main project card */}
              <div className="feat-card fc-main">
                <div className="fc-header">
                  <div className="fc-dots">
                    <div className="fc-dot" style={{ background: '#FF5F57' }} />
                    <div className="fc-dot" style={{ background: '#FFBD2E' }} />
                    <div className="fc-dot" style={{ background: '#28CA41' }} />
                  </div>
                  <div className="fc-filename">smart-attendance.apk</div>
                </div>
                <div className="fc-content">
                  <div className="fc-row">
                    <div className="fc-img" style={{ background: 'linear-gradient(135deg,#0F2010,#1E3A1E)' }}>📱</div>
                    <div className="fc-info">
                      <div className="name">Smart Attendance App</div>
                      <div className="sub">XI RPL 1 · Android</div>
                    </div>
                    <span className="status-badge sb-ok"><span className="sb-dot" />Disetujui</span>
                  </div>
                  <div className="fc-divider" />
                  <div className="fc-desc">Absensi siswa berbasis face recognition menggunakan TensorFlow Lite &amp; Firebase.</div>
                  <div className="fc-tags">
                    <span className="fc-tag">Kotlin</span>
                    <span className="fc-tag">TensorFlow</span>
                    <span className="fc-tag">Firebase</span>
                  </div>
                  <div className="fc-footer">
                    <div className="fc-author">
                      <div className="fc-avatar" style={{ background: 'linear-gradient(135deg,#34D399,#059669)' }}>RA</div>
                      <span className="fc-author-name">Rizky Ananda</span>
                    </div>
                    <div className="fc-meta">
                      <span>👁 1.2k</span><span>❤️ 87</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Side — guru review queue */}
              <div className="feat-card fc-side">
                <div className="fc-header">
                  <div className="fc-dots">
                    <div className="fc-dot" style={{ background: '#FF5F57' }} />
                    <div className="fc-dot" style={{ background: '#FFBD2E' }} />
                    <div className="fc-dot" style={{ background: '#28CA41' }} />
                  </div>
                  <div className="fc-filename">review-panel</div>
                </div>
                <div className="fc-content">
                  <div className="fc-queue-label">Antrian Review Guru</div>
                  <div className="fc-queue-list">
                    <div className="fc-queue-item">
                      <span>📱</span>
                      <div className="fc-queue-item-info">
                        <div className="fc-queue-item-name">Smart Attendance</div>
                        <div className="fc-queue-item-sub">Rizky · XI RPL</div>
                      </div>
                      <span className="status-badge sb-ok" style={{ fontSize: 9 }}>✓</span>
                    </div>
                    <div className="fc-queue-item">
                      <span>🌐</span>
                      <div className="fc-queue-item-info">
                        <div className="fc-queue-item-name">EduMarket</div>
                        <div className="fc-queue-item-sub">Fira · XII TKJ</div>
                      </div>
                      <span className="status-badge sb-rev" style={{ fontSize: 9 }}>⟳</span>
                    </div>
                    <div className="fc-queue-item">
                      <span>🎮</span>
                      <div className="fc-queue-item-info">
                        <div className="fc-queue-item-name">Nusantara Quest</div>
                        <div className="fc-queue-item-sub">Bagas · X MM</div>
                      </div>
                      <span className="status-badge sb-pend" style={{ fontSize: 9 }}>⏳</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom mini card */}
               <Link to="/pantau" className="feat-card fc-bot group/bot">
                 <div className="fc-content">
                   <div className="fc-mini-row">
                     <div className="fc-mini-icon">👨‍👩‍👧</div>
                     <div className="fc-mini-text text-left">
                       <div className="fc-mini-title group-hover/bot:text-indigo-500 transition-colors">Laporan Orang Tua</div>
                       <div className="fc-mini-sub">Pantau progres anak realtime</div>
                     </div>
                     <div className="fc-mini-arrow group-hover/bot:translate-x-1 transition-transform">↗</div>
                   </div>
                 </div>
               </Link>

            </div>
          </div>

          {/* Text content */}
          <div className="feat-text lp-reveal" ref={reveal}>
            <div className="section-eyebrow">Fitur Unggulan</div>
            <h2>Ekosistem<br />Lengkap untuk<br />Setiap Peran.</h2>
            <p className="feat-p">Dari upload project hingga validasi guru dan pemantauan orang tua — semua terhubung dalam satu platform yang dirancang khusus untuk dunia pendidikan vokasi Indonesia.</p>
            <div className="feat-items">
              <div className="fi">
                <div className="fi-icon">📤</div>
                <div className="fi-text">
                  <h4>Upload &amp; Kelola Project</h4>
                  <p>Siswa bisa upload, edit, dan menghapus project kapan saja. Lengkap dengan file, link repo, dan screenshot demo.</p>
                </div>
              </div>
              <div className="fi">
                <div className="fi-icon">✅</div>
                <div className="fi-text">
                  <h4>Review &amp; Validasi Guru</h4>
                  <p>Guru mereview setiap project dan memberikan approval, feedback revisi, atau penolakan dengan alasan jelas.</p>
                </div>
              </div>
              <div className="fi">
                <div className="fi-icon">👁</div>
                <div className="fi-text">
                  <h4>Monitoring Orang Tua</h4>
                  <p>Orang tua dapat memantau semua project dan status review anak secara realtime tanpa perlu bertanya langsung.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════ CATEGORIES ═══════ */}
      <section className="lp-categories" id="categories">
        <div className="cats-header lp-reveal" ref={reveal}>
          <div className="section-eyebrow center">5 Kategori Project</div>
          <h2>Semua Bidang<br />Teknologi Ada di Sini.</h2>
          <p className="cats-sub">Dari Android hingga IoT, setiap siswa punya ruang untuk berkarya sesuai minat dan bakatnya.</p>
        </div>
        <div className="cats-grid lp-reveal" ref={(el) => { reveal(el); catGridRef.current = el; }}>
          {CATEGORIES.map((c) => (
            <div className={`cat ${c.cls}`} key={c.cls}>
              <span className="cat-emoji">{c.emoji}</span>
              <div className="cat-name">{c.name}</div>
              <div className="cat-n">{c.n}</div>
              <div className="cat-prog">
                <div className="cat-bar" style={{ width: `${parseFloat(c.w) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="lp-how" id="how">
        <div className="how-inner">
          <div className="how-header lp-reveal" ref={reveal}>
            <div className="section-eyebrow center">Cara Kerja</div>
            <h2>Mulai dalam<br />4 Langkah Mudah.</h2>
            <p className="how-sub">Proses yang dirancang sesederhana mungkin agar siswa bisa fokus pada karyanya, bukan urusan teknis.</p>
          </div>
          <div className="steps lp-reveal" ref={reveal}>
            {STEPS.map((s) => (
              <div className="step-item" key={s.idx}>
                <div className="step-num">
                  <div className="step-idx">{s.idx}</div>
                  {s.emoji}
                </div>
                <h3 className="step-h">{s.h}</h3>
                <p className="step-p">{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ IDN IMPACT ═══════ */}
      <section className="lp-social" id="testimonials">
        <div className="social-header lp-reveal" ref={reveal}>
          <div className="section-eyebrow center">IDN Hebat</div>
          <h2>IDN HEBAT</h2>
        </div>
        <div className="impact-grid lp-reveal" ref={reveal}>
          <div className="impact-card ic-students">
            <div className="ic-icon">👨‍🎓</div>
            <div className="ic-n"><CountUp target={idnStats?.total_students ?? 0} suffix="" duration={2000} className="" /></div>
            <div className="ic-l">Siswa yang sudah melaksanakan</div>
            <div className="ic-p">Terdaftar aktif dalam program IDN Hebat</div>
          </div>
          <div className="impact-card ic-schools">
            <div className="ic-icon">🏫</div>
            <div className="ic-n"><CountUp target={idnStats?.total_schools ?? 0} suffix="" duration={1800} className="" /></div>
            <div className="ic-l">Sekolah Dikunjungi</div>
            <div className="ic-p">Tersebar di berbagai kota di Indonesia</div>
          </div>
          <div className="impact-card ic-audience">
            <div className="ic-icon">👥</div>
            <div className="ic-n"><CountUp target={idnStats?.total_audience ?? 0} suffix="+" duration={2200} className="" /></div>
            <div className="ic-l">Total Audience</div>
            <div className="ic-p">Siswa yang telah merasakan manfaat program</div>
          </div>
          <div className="impact-card ic-teams">
            <div className="ic-icon">🚀</div>
            <div className="ic-n"><CountUp target={idnStats?.total_teams ?? 0} suffix="" duration={1600} className="" /></div>
            <div className="ic-l">Tim Pengajar</div>
            <div className="ic-p">Tenaga pengajar yang berdedikasi tinggi</div>
          </div>
          <div className="impact-card ic-lomba">
            <div className="ic-icon">🏆</div>
            <div className="ic-n"><CountUp target={idnStats?.total_lomba ?? 0} suffix="" duration={1800} className="" /></div>
            <div className="ic-l">Total Lomba</div>
            <div className="ic-p">Lomba yang telah dilaksanakan</div>
          </div>
        </div>
      </section>

      {/* ═══════ LOMBA SHOWCASE ═══════ */}
      <section className="lp-lomba-showcase" id="lomba-showcase">
        <div className="showcase-bg" />
        <div className="showcase-inner">
          <div className="showcase-header lp-reveal" ref={reveal}>
            <div className="section-eyebrow center">Prestasi Siswa</div>
            <h2>
              Jejak Juara<br />
              <span className="h1-grad">Siswa IDN.</span>
            </h2>
            <p className="showcase-sub">Setiap lomba adalah cerita perjuangan. Berikut karya dan prestasi terbaru siswa IDN Pamijahan.</p>
          </div>

          {lombaShowcase.length > 0 ? (
            lombaShowcase.length <= 4 ? (
              <div className="lomba-showcase-grid">
                <div className="showcase-card-grid">
                  {lombaShowcase.map((lomba, i) => (
                    <ShowcaseCard key={lomba.id} lomba={lomba} idx={i} />
                  ))}
                </div>
                <div className="showcase-footer-cta">
                  <button className="cta-main btn-showcase-all" onClick={(e) => { ripple(e); setShowAllLomba(!showAllLomba); }}>
                    {showAllLomba ? 'Tutup Daftar Lomba' : '🏆 Lihat Semua Lomba'}
                  </button>
                </div>
              </div>
            ) : (
              <LombaCarousel lombaShowcase={lombaShowcase} ripple={ripple} onShowAll={() => setShowAllLomba(!showAllLomba)} showingAll={showAllLomba} />
            )
          ) : (
            <div className="showcase-empty lp-reveal" ref={reveal}>
              <div className="showcase-empty-icon">🏆</div>
              <h3>Belum Ada Data Lomba Asli</h3>
              <p>Data prestasi siswa akan tampil di sini setelah lomba dicatat. Berikut adalah data dummy:</p>
              <div className="mt-6">
                <button className="cta-main" onClick={(e) => { ripple(e); setShowAllLomba(!showAllLomba); }}>
                  {showAllLomba ? 'Tutup Daftar Lomba' : '🏆 Lihat Semua Lomba (Dummy)'}
                </button>
              </div>
            </div>
          )}

          {showAllLomba && (
            <div className="mt-12 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {DUMMY_LOMBA.map((lomba, i) => (
                  <ShowcaseCard key={lomba.id} lomba={lomba} idx={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="lp-footer">
        <div className="foot-top">
          <div className="foot-brand">
            <Link to="/" className="lp-logo">
              <div className="logo-mark">⚡</div>
              <div className="flex flex-col">
                <span>IPSA</span>
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-400/60 leading-none">IDN Pamijahan Super Apps</span>
              </div>
            </Link>
            <p className="foot-desc">Platform showcase project teknologi siswa SMK Indonesia. Upload, validasi, dan buktikan kemampuanmu kepada dunia.</p>
          </div>
          <div className="foot-col">
            <h5>Platform</h5>
            <button onClick={() => scrollTo('hero')}>Showcase Project</button>
            <button onClick={() => scrollTo('hero')}>Upload Project</button>
            <button onClick={() => scrollTo('categories')}>Kategori</button>
            <button onClick={() => scrollTo('hero')}>Leaderboard</button>
          </div>
          <div className="foot-col">
            <h5>Pengguna</h5>
             <Link to="/register">Untuk Siswa</Link>
             <Link to="/pantau">Untuk Orang Tua</Link>
            <Link to="/login">Login Area</Link>
          </div>
          <div className="foot-col">
            <h5>Lainnya</h5>
            <a href="#" onClick={(e) => e.preventDefault()}>Tentang IPSA</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Panduan Upload</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Kebijakan Privasi</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Hubungi Kami</a>
          </div>
        </div>
        <div className="foot-bottom">
          <div className="foot-copy">© 2025 IPSA. Dibuat dengan ❤️ untuk siswa Indonesia 🇮🇩</div>
          <div className="foot-badges">
            <span className="foot-badge">v1.0.0</span>
            <span className="foot-badge">MIT License</span>
            <span className="foot-badge">Made in ID</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
