import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import './LandingPage.css';

/* ── Dashboard link helper ── */
function getDashboardLink(role) {
  switch (role) {
    case 'superadmin': return '/admin/dashboard';
    case 'guru':       return '/guru/dashboard';
    case 'siswa':      return '/siswa/dashboard';
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

const TESTIMONIALS = [
  {
    av: { bg: 'linear-gradient(135deg,#34D399,#059669)', color: '#000', init: 'RA' },
    name: 'Rizky Ananda', role: 'Siswa · XI RPL 1 · SMKN 3 Bandung',
    q: '"Sebelum ada SKL IDN, project saya cuma tersimpan di laptop dan tidak ada yang tahu. Sekarang sudah dilihat 1.200+ orang dan dapat feedback dari guru yang sangat membantu!"',
    tag: { label: '📱 Android Dev', bg: 'rgba(52,211,153,.1)', color: 'var(--lp-green)', border: '1px solid rgba(52,211,153,.2)' },
  },
  {
    av: { bg: 'linear-gradient(135deg,#FBBF24,#B45309)', color: '#000', init: 'BW' },
    name: 'Bu Wulandari, S.Pd', role: 'Guru TKJ · SMKN 1 Surabaya',
    q: '"Sebagai guru, saya sangat terbantu. Antrian review jelas, bisa kasih feedback langsung, dan orang tua murid bisa pantau sendiri perkembangan anaknya. Luar biasa!"',
    tag: { label: '👩‍🏫 Guru Reviewer', bg: 'rgba(251,191,36,.1)', color: 'var(--lp-amber)', border: '1px solid rgba(251,191,36,.2)' },
  },
  {
    av: { bg: 'linear-gradient(135deg,#7C6EFA,#4338CA)', color: '#fff', init: 'HS' },
    name: 'Pak Hendra Santoso', role: 'Orang Tua · Putra di X MM',
    q: '"Saya bisa lihat project anak saya kapan saja dan tahu sudah sejauh mana progresnya. Bangga sekali lihat karya anak di-approve guru dan bisa dilihat publik."',
    tag: { label: '👨‍👩‍👧 Orang Tua', bg: 'rgba(124,110,250,.1)', color: 'var(--lp-p2)', border: '1px solid rgba(124,110,250,.2)' },
  },
  {
    av: { bg: 'linear-gradient(135deg,#22D3EE,#0891B2)', color: '#000', init: 'DN' },
    name: 'Dian Nurcahya', role: 'Siswa · XI TKI · SMKN 5 Jakarta',
    q: '"Project IoT Hidroponik saya akhirnya bisa dilihat banyak orang! Prosesnya mudah banget — tinggal upload, tunggu review guru, dan langsung tampil di showcase."',
    tag: { label: '🔌 IoT Developer', bg: 'rgba(34,211,238,.1)', color: 'var(--lp-cyan)', border: '1px solid rgba(34,211,238,.2)' },
  },
  {
    av: { bg: 'linear-gradient(135deg,#E879F9,#9333EA)', color: '#fff', init: 'FS' },
    name: 'Fira Salsabila', role: 'Siswa · XII TKJ · SMKN 2 Malang',
    q: '"Platform ini yang paling mudah dan keren tampilannya. Saya bisa edit project saya kapanpun, dan feedback guru langsung muncul dengan notifikasi. Top banget!"',
    tag: { label: '🌐 Web Developer', bg: 'rgba(232,121,249,.1)', color: 'var(--lp-pink)', border: '1px solid rgba(232,121,249,.2)' },
  },
  {
    av: { bg: 'linear-gradient(135deg,#FB7185,#BE123C)', color: '#fff', init: 'AP' },
    name: 'Pak Agus Prasetyo', role: 'Kepala Sekolah · SMKN 7 Yogyakarta',
    q: '"SKL IDN menjadi bukti nyata kualitas lulusan kami. Calon perusahaan bisa langsung melihat karya siswa sebelum rekrutmen. Ini revolusi portofolio siswa SMK!"',
    tag: { label: '🏫 Kepala Sekolah', bg: 'rgba(251,113,133,.1)', color: 'var(--lp-rose)', border: '1px solid rgba(251,113,133,.2)' },
  },
];

/* ══════════════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════════════ */
export function LandingPage() {
  const { user } = useAuthStore();
  const [navScrolled, setNavScrolled] = useState(false);
  const reveal = useReveal();
  const catGridRef = useCatBars();

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
          SKL<em>IDN</em>
        </Link>

        <div className="nav-pill">
          <button className="on" onClick={() => scrollTo('hero')}>Beranda</button>
          <button onClick={() => scrollTo('categories')}>Kategori</button>
          <button onClick={() => scrollTo('how')}>Cara Kerja</button>
          <button onClick={() => scrollTo('testimonials')}>Testimoni</button>
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
          SKL IDN adalah platform di mana siswa <strong>upload project teknologi</strong> mereka — Android, Website, Robotika, Game, &amp; IoT — dan mendapat validasi resmi dari guru.
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
            <CountUp target={2400} suffix="+" duration={2000} className="hstat-n" />
            <div className="hstat-l">Total Project</div>
          </div>
          <div className="hstat">
            <CountUp target={890} suffix="" duration={1800} className="hstat-n" />
            <div className="hstat-l">Siswa Aktif</div>
          </div>
          <div className="hstat">
            <CountUp target={150} suffix="" duration={1600} className="hstat-n" />
            <div className="hstat-l">Sekolah Bergabung</div>
          </div>
          <div className="hstat">
            <CountUp target={94} suffix="%" duration={2200} className="hstat-n" />
            <div className="hstat-l">Approval Rate</div>
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

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section className="lp-social" id="testimonials">
        <div className="social-header lp-reveal" ref={reveal}>
          <div className="section-eyebrow center">Testimoni</div>
          <h2>Kata Mereka<br />yang Sudah Merasakan.</h2>
        </div>
        <div className="testi-grid lp-reveal" ref={reveal}>
          {TESTIMONIALS.map((t, i) => (
            <div className="tcard" key={i}>
              <div className="tcard-top">
                <div className="tcard-av" style={{ background: t.av.bg, color: t.av.color }}>{t.av.init}</div>
                <div>
                  <div className="tcard-name">{t.name}</div>
                  <div className="tcard-role">{t.role}</div>
                </div>
                <div className="tcard-stars">★★★★★</div>
              </div>
              <p className="tcard-q">{t.q}</p>
              <span className="tcard-tag" style={{ background: t.tag.bg, color: t.tag.color, border: t.tag.border }}>{t.tag.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ CTA FINAL ═══════ */}
      <section className="lp-cta-section">
        <div className="cta-bg" />
        <div className="cta-grid-line" />
        <div className="cta-inner lp-reveal" ref={reveal}>
          <div className="cta-eyebrow">🇮🇩 Untuk Siswa Indonesia</div>
          <h2>
            Mulai Tampilkan<br />
            <span className="h1-grad">Karyamu Hari Ini.</span>
          </h2>
          <p className="cta-p">Bergabung bersama 890+ siswa yang sudah membuktikan kemampuan mereka. Gratis, mudah, dan langsung berdampak.</p>
          <div className="cta-btns">
            <Link to="/register" className="cta-main" onClick={ripple}>⚡ Daftar Gratis Sekarang</Link>
            <button className="cta-sec" onClick={() => scrollTo('categories')}>Lihat Demo Platform →</button>
          </div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="lp-footer">
        <div className="foot-top">
          <div className="foot-brand">
            <Link to="/" className="lp-logo">
              <div className="logo-mark">⚡</div>
              SKL<em>IDN</em>
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
            <a href="#" onClick={(e) => e.preventDefault()}>Tentang SKL IDN</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Panduan Upload</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Kebijakan Privasi</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Hubungi Kami</a>
          </div>
        </div>
        <div className="foot-bottom">
          <div className="foot-copy">© 2025 SKL IDN. Dibuat dengan ❤️ untuk siswa Indonesia 🇮🇩</div>
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
