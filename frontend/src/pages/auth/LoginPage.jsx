import { useState, useCallback } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/api/endpoints';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { useGoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import './LoginPage.css';

/* ── Role config ── */
const LOGIN_CONFIG = {
  label: 'EMAIL / ID / NISN',
  ph: 'Masukkan Email, NIP, atau NIS',
  ico: '🔐',
  hint: <>Masukkan kredensial Anda untuk mengakses dashboard.</>,
};

/* ── Dashboard routing ── */
function getDashboardPath(role) {
  switch (role) {
    case 'superadmin': return '/admin/dashboard';
    case 'guru':       return '/guru/dashboard';
    case 'siswa':      return '/siswa/dashboard';
    default:           return '/';
  }
}

/* ══════════════════════════════════════════════
   LOGIN PAGE COMPONENT
   ══════════════════════════════════════════════ */
export function LoginPage() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [honeypot, setHoneypot] = useState(''); // Anti-bot Honeypot

  const [errMsg, setErrMsg] = useState('');
  const [okMsg, setOkMsg] = useState('');
  const [idErr, setIdErr] = useState(false);
  const [pwErr, setPwErr] = useState(false);

  const rd = LOGIN_CONFIG;

  /* Clear messages */
  const clearMsgs = useCallback(() => {
    setErrMsg(''); setOkMsg(''); setIdErr(false); setPwErr(false);
  }, []);

  /* Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMsgs();

    // Bot detection via Honeypot
    if (honeypot) {
      setErrMsg('Kredensial tidak valid. Periksa kembali dan coba lagi.');
      return;
    }

    let bad = false;
    if (!identity.trim()) { setIdErr(true); bad = true; }
    if (!password)         { setPwErr(true); bad = true; }
    if (bad) {
      setErrMsg('Mohon isi semua kolom yang diperlukan.');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.getCsrfCookie();
      const response = await authApi.login({ email: identity.trim(), password });
      const { user, access_token, message } = response.data;
      
      // Update global store
      setAuth(user, access_token);
      
      toast.success(message || 'Login berhasil');
      
      // Navigate immediately using window.location for a clean state
      window.location.href = getDashboardPath(user.role);
    } catch (error) {
      const msg = error.response?.data?.message || 'Kredensial tidak valid. Periksa kembali dan coba lagi.';
      setErrMsg(msg);
      setIdErr(true);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  /* Google Success Handler */
  const handleGoogleLoginSuccess = async (tokenResponse) => {
    setIsLoading(true);
    clearMsgs();
    try {
      await authApi.getCsrfCookie();
      // With useGoogleLogin, we get an access_token, not a GSI credential string by default
      // Unless we use 'auth-code' flow. Let's use the simplest flow.
      const response = await authApi.googleLogin({ 
        token: tokenResponse.access_token 
      });
      
      const { user, access_token, message } = response.data;
      
      if (access_token) {
        setAuth(user, access_token);
        toast.success(message || 'Login berhasil');
        window.location.href = getDashboardPath(user.role);
      } else {
        setOkMsg(message);
        toast.success(message, { duration: 6000 });
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Gagal login dengan Google.';
      setErrMsg(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  /* Custom Google Login Hook */
  const loginWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: () => {
      toast.error('Google Login Gagal');
      setErrMsg('Login Google gagal. Silakan coba lagi.');
    },
    // This flow is more robust for local development
    flow: 'implicit', 
  });

  return (
    <div className="login-page">
      <div className="login-noise" />

      {/* ═══════════ LEFT PANEL ═══════════ */}
      <div className="panel-left">
        <div className="login-aurora">
          <div className="login-blob lb1" />
          <div className="login-blob lb2" />
          <div className="login-blob lb3" />
        </div>
        <div className="login-lgrid" />

        <div className="pl-inner">
          <Link to="/" className="login-logo">
            <div className="logo-mark">⚡</div>
            <div className="logo-text">SKL<span>IDN</span></div>
          </Link>

          <div className="pl-hero">
            <div className="pl-badge">
              <div className="pdot" />
              Platform Showcase Siswa #1
            </div>
            <h1 className="pl-h1">
              Selamat<br />Datang,<br /><span className="gr">Inovator Muda.</span>
            </h1>
            <p className="pl-p">Masuk untuk mengelola project, memantau review guru, dan menampilkan karya terbaikmu kepada dunia.</p>

            <div className="cards-wrap">
              <div className="fcard">
                <div className="fcard-ico" style={{ background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.18)' }}>📱</div>
                <div className="fcard-body">
                  <div className="fcard-name">Smart Attendance App</div>
                  <div className="fcard-sub">Rizky · XI RPL 1</div>
                </div>
                <span className="chip chip-g"><span className="chip-dot" />Approved</span>
              </div>
              <div className="fcard">
                <div className="fcard-ico" style={{ background: 'rgba(245,158,11,.1)', border: '1px solid rgba(245,158,11,.18)' }}>🎮</div>
                <div className="fcard-body">
                  <div className="fcard-name">Nusantara Quest</div>
                  <div className="fcard-sub">Bagas · X MM</div>
                </div>
                <span className="chip chip-a"><span className="chip-dot" />Pending</span>
              </div>
              <div className="fcard">
                <div className="fcard-ico" style={{ background: 'rgba(6,182,212,.1)', border: '1px solid rgba(6,182,212,.18)' }}>🔌</div>
                <div className="fcard-body">
                  <div className="fcard-name">Hidroponik Otomatis</div>
                  <div className="fcard-sub">Dian · XI TKI</div>
                </div>
                <span className="chip chip-c"><span className="chip-dot" />Review</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════ RIGHT PANEL ═══════════ */}
      <div className="panel-right">
        <div className="form-wrap">
          <div className="flex justify-end p-4 absolute top-0 right-0">
            <ThemeToggle />
          </div>
          <div className="fh">
            <div className="fh-title">Masuk ke SKL IDN</div>
            <p className="fh-sub">Masukkan kredensial Anda untuk melanjutkan ke dashboard.</p>
          </div>

          <div className="hint-pill">
            <span className="hint-pill-ico">{rd.ico}</span>
            <span>{rd.hint}</span>
          </div>

          {errMsg && (
            <div className="login-msg msg-err show">⚠️ <span>{errMsg}</span></div>
          )}
          {okMsg && (
            <div className="login-msg msg-ok show">✅ <span>{okMsg}</span></div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <input 
              type="text" 
              name="honeypot" 
              style={{ display: 'none' }} 
              tabIndex="-1" 
              autoComplete="off" 
              value={honeypot} 
              onChange={(e) => setHoneypot(e.target.value)} 
            />

            <div className="login-field">
              <label className="flabel" htmlFor="fid">{rd.label}</label>
              <div className="finput-wrap">
                <span className="ficon">✉</span>
                <input
                  className={`finput${idErr ? ' has-err' : ''}`}
                  id="fid"
                  type="text"
                  placeholder={rd.ph}
                  autoComplete="username"
                  spellCheck={false}
                  value={identity}
                  onChange={(e) => { setIdentity(e.target.value); setIdErr(false); }}
                />
              </div>
            </div>

            <div className="login-field">
              <label className="flabel" htmlFor="fpw">PASSWORD</label>
              <div className="finput-wrap">
                <span className="ficon">🔒</span>
                <input
                  className={`finput${pwErr ? ' has-err' : ''}`}
                  id="fpw"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Masukkan password kamu"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setPwErr(false); }}
                />
                <button
                  type="button"
                  className="eyebtn"
                  onClick={() => setShowPw(!showPw)}
                >
                  {showPw ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="opt-row">
              <label className="chk-wrap">
                <input
                  className="chk"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span className="chk-lbl">Ingat saya</span>
              </label>
              <a className="forgot" href="#" onClick={(e) => e.preventDefault()}>Lupa password?</a>
            </div>

            <button
              type="submit"
              className={`btn-go${isLoading ? ' loading' : ''}`}
              disabled={isLoading}
            >
              <div className="login-spin" />
              <span className="btn-txt">⚡&nbsp; Masuk Sekarang</span>
            </button>

            <div className="flex items-center gap-4 my-6 opacity-40">
              <div className="h-[1px] flex-1 bg-foreground" />
              <span className="text-[10px] font-bold tracking-widest uppercase">Atau</span>
              <div className="h-[1px] flex-1 bg-foreground" />
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => loginWithGoogle()}
                className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-bold text-slate-700 dark:text-white shadow-sm"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                Masuk dengan Google
              </button>
            </div>
          </form>

          <p className="reg">Belum punya akun? <Link to="/register">Daftar Gratis →</Link></p>
        </div>
      </div>
    </div>
  );
}

