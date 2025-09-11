import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import Questionnaire from './components/Questionnaire';
import ProfileManager from './components/ProfileManager';
<<<<<<< HEAD
import NeethiLogo from './assets/Neethi_saarathi_logo.png';
import ProfileGif from './assets/ProfileGif.gif';
import Plus from './assets/Plus.gif';
import EditPencil from './assets/EditPencil.gif';
import Cloud from './assets/Cloud.gif';
import Copy from './assets/Copy.gif';
import CopyLink from './assets/CopyLink.gif';
import Globe from './assets/Globe.gif';
import Law from './assets/Law.gif';
import MenReview from './assets/MenReview.gif';
import WomenReview from './assets/WomenReview.gif';
import Museum from './assets/Museum.gif';
import Privacy from './assets/Privacy.gif';
import Search from './assets/Search.gif';
import Service from './assets/Service.gif';
import Share from './assets/Share.gif';
import AI from './assets/AI.gif';
import Multimedia from './assets/Multimedia.gif';
import HeaderLaw from './assets/HeaderLaw.gif';
import Download from './assets/Download.gif';
// Custom hook for responsive styles
const useResponsiveStyles = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  const responsiveStyles = {
    // General styles for main layout
    pageWrapper: {
      minHeight: '100vh',
      position: 'relative',
      overflowX: 'hidden',
    },
    main: {
      maxWidth: isMobile ? '100%' : 1152,
      margin: '0 auto 48px',
      padding: isMobile ? '0 16px' : '0 24px',
    },
    // Header styles
    headerContent: {
      position: 'relative',
      maxWidth: 1280,
      margin: '0 auto',
      padding: isMobile ? '24px 16px' : '32px 24px',
      textAlign: 'center',
      color: '#fff',
    },
    logoRow: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: isMobile ? 8 : 24,
      marginBottom: 16,
    },
    logoImg: {
      width: isMobile ? 120 : 170,
      height: isMobile ? 120 : 170,
      borderRadius: '0',
      objectFit: 'contain',
      background: 'transparent',
      boxShadow: 'none',
    },
    logoText: { textAlign: 'center' },
    brand: {
      fontSize: isMobile ? 48 : 60,
      fontWeight: 900,
      margin: 0,
      letterSpacing: -2,
    },
    subBrand: {
      color: '#fed7aa',
      fontSize: isMobile ? 14 : 18,
      fontWeight: 700,
      letterSpacing: isMobile ? 2 : 4,
    },
    tagline: {
      fontSize: isMobile ? 16 : 24,
      fontWeight: 500,
      height: isMobile ? 24 : 32,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 16px',
      textAlign: 'center',
    },
    headerButtons: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'center',
      gap: '16px',
      marginTop: '16px',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    headerButton: {
      padding: '12px 24px',
      borderRadius: '25px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.3s ease-in-out',
      boxShadow: '0 4px 15px rgba(249, 115, 22, 0.4)',
      border: 'none',
      color: 'white',
      textAlign: 'center',
    },
    profileComplete: {
      display: 'flex',
      background: 'rgba(255,255,255,0.2)',
      backdropFilter: 'blur(10px)',
      padding: '12px 20px',
      borderRadius: '25px',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      fontWeight: '500',
      textAlign: 'center',
    },
    // Hero styles
    hero: { padding: isMobile ? '40px 16px' : '80px 24px' },
    heroTitle: {
      fontSize: isMobile ? 36 : 48,
      fontWeight: 900,
      margin: '0 0 16px',
      textAlign: 'center',
    },
    heroSub: {
      fontSize: isMobile ? 24 : 36,
      fontWeight: 700,
      color: '#374151',
      marginBottom: isMobile ? 16 : 24,
      letterSpacing: -1,
    },
    heroDesc: {
      fontSize: isMobile ? 16 : 20,
      color: '#374151',
      maxWidth: 1024,
      margin: isMobile ? '0 auto 8px' : '0 auto 16px',
      fontWeight: 500,
    },
    heroDesc2: {
      fontSize: isMobile ? 14 : 18,
      color: '#4b5563',
      maxWidth: 1024,
      margin: '0 auto 48px',
    },
    stats: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,minmax(0,1fr))',
      gap: isMobile ? 16 : 32,
      maxWidth: 768,
      margin: isMobile ? '24px auto 0' : '48px auto 0',
    },
    // Query card styles
    queryCard: {
      maxWidth: 1152,
      margin: '0 auto 48px',
      padding: isMobile ? '24px' : 40,
      borderRadius: 24,
      background: 'rgba(255,255,255,.7)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,.4)',
      boxShadow: '0 25px 50px -12px rgba(0,0,0,.15)',
    },
    queryHeader: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: 'center',
      gap: 16,
      justifyContent: 'center',
      marginBottom: isMobile ? 16 : 32,
      textAlign: 'center',
    },
    queryIcon: {
      width: 64,
      height: 64,
      background: 'linear-gradient(135deg,#f97316,#dc2626)',
      borderRadius: 12,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 10px 15px -3px rgba(0,0,0,.1)',
      color: '#fff',
    },
    queryTitle: { fontSize: isMobile ? 28 : 36, fontWeight: 900, color: '#dc2626', margin: 0 },
    querySub: { fontSize: isMobile ? 16 : 20, color: '#4b5563', margin: 0 },
    textareaWrap: { position: 'relative', marginBottom: 32 },
    textarea: {
      width: '100%',
      padding: isMobile ? 16 : 32,
      borderRadius: 16,
      fontSize: isMobile ? 16 : 18,
      lineHeight: 1.6,
      resize: 'vertical',
      border: 'none',
      outline: 'none',
      background: 'linear-gradient(135deg,rgba(255,255,255,.9) 0%,rgba(255,247,237,.9) 100%)',
      boxShadow: 'inset 0 2px 4px 0 rgba(0,0,0,.06)',
    },
    button: {
      padding: isMobile ? '16px 32px' : '24px 64px',
      borderRadius: 16,
      fontSize: isMobile ? 16 : 20,
      fontWeight: 700,
      border: 'none',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      boxShadow: '0 10px 30px rgba(249,115,22,.4)',
      transition: 'transform .3s',
      width: isMobile ? '100%' : 'auto',
      justifyContent: 'center',
      textAlign: 'center',
    },
    // Response card styles
    responseCard: {
      padding: isMobile ? '24px' : 40,
      borderRadius: 24,
      background: 'rgba(255,255,255,.7)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,.4)',
      boxShadow: '0 25px 50px -12px rgba(0,0,0,.15)',
      animation: 'slideInFromBottom .8s ease-out',
    },
    responseHeader: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: 'center',
      gap: 16,
      justifyContent: 'center',
      marginBottom: 32,
      textAlign: 'center',
    },
    responseTitle: {
      fontSize: isMobile ? 28 : 36,
      fontWeight: 900,
      color: '#16a34a',
      margin: 0,
    },
    responseSub: {
      fontSize: isMobile ? 16 : 20,
      color: '#4b5563',
      margin: 0,
    },
    responseBody: {
      padding: isMobile ? 16 : 32,
      borderRadius: 16,
      background: 'linear-gradient(135deg,rgba(255,255,255,.9) 0%,rgba(240,253,244,.9) 100%)',
      boxShadow: 'inset 0 2px 4px 0 rgba(0,0,0,.06)',
    },
    actionRow: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'center',
      gap: 16,
      marginTop: 32,
    },
    actionBtn: {
      padding: '12px 24px',
      borderRadius: 12,
      fontWeight: 600,
      fontSize: 16,
      border: 'none',
      color: '#fff',
      background: 'linear-gradient(135deg,#3b82f6 0%,#2563eb 100%)',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,.1)',
    },
    // Features & Testimonials
    secTitle: {
      fontSize: isMobile ? 36 : 48,
      fontWeight: 900,
      textAlign: 'center',
      marginBottom: 8,
      background: 'linear-gradient(135deg,#ea580c,#16a34a)',
      WebkitBackgroundClip: 'text',
      color: 'transparent',
    },
    secSub: {
      fontSize: isMobile ? 24 : 30,
      fontWeight: 700,
      textAlign: 'center',
      color: '#374151',
      marginBottom: isMobile ? 16 : 24,
    },
    featureGrid: {
      maxWidth: 1280,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit,minmax(300px,1fr))',
      gap: 40,
    },
    testimonialGrid: {
      maxWidth: 1280,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit,minmax(320px,1fr))',
      gap: 32,
    },
    // Footer styles
    footerContent: {
      position: 'relative',
      maxWidth: 1280,
      margin: '0 auto',
      padding: isMobile ? '48px 16px 0' : '64px 24px 0',
      color: '#fff',
      textAlign: 'center',
    },
    footerImg: {
      width: isMobile ? 120 : 180,
      height: isMobile ? 120 : 180,
      objectFit: 'contain',
      background: 'transparent',
      borderRadius: 0,
      boxShadow: 'none',
    },
    footerBrand: {
      fontSize: isMobile ? 28 : 36,
      fontWeight: 900,
      margin: '0 0 4px',
    },
    footerSub: {
      fontSize: isMobile ? 18 : 24,
      color: '#fed7aa',
      margin: '0 0 32px',
    },
    footerGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit,minmax(240px,1fr))',
      gap: isMobile ? 24 : 48,
      marginBottom: isMobile ? 24 : 48,
    },
    footerStats: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'center',
      gap: isMobile ? 16 : 48,
      margin: isMobile ? '24px 0' : '48px 0',
      flexWrap: 'wrap',
    },
  };

  return responsiveStyles;
};
=======
>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e

export default function App() {
  const [q, setQ] = useState('');
  const [ans, setAns] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState([]);
  const [typing, setTyping] = useState('');
  const [sessionId, setSessionId] = useState<string>('');
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  const [profileLoading, setProfileLoading] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState(false);
  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const [showQuestionnaireModal, setShowQuestionnaireModal] = useState(false);
  const [showProfileManager, setShowProfileManager] = useState(false);
  const [profile, setProfile] = useState<any>(null);
<<<<<<< HEAD

  // Use the custom hook to get responsive styles
  const responsiveStyles = useResponsiveStyles();

  /* ----------  User Profile Management ---------- */
=======
  
  /* ----------  User Profile Management ---------- */
>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e
  const generateSessionId = () => {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  };

  const getSessionId = () => {
    let sessionId = localStorage.getItem('neethisaarathi_session_id');
    if (!sessionId) {
      sessionId = generateSessionId();
      localStorage.setItem('neethisaarathi_session_id', sessionId);
    }
    return sessionId;
  };

  const checkProfileExists = async (sessionId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/user/profile/exists?session_id=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        return data.exists;
      }
    } catch (error) {
      console.error('Error checking profile:', error);
    }
    return false;
  };

  const saveProfile = async (profileData: any) => {
    try {
      const response = await fetch('http://localhost:8000/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, ...profileData })
      });
      return response.ok;
    } catch (error) {
      console.error('Error saving profile:', error);
      return false;
    }
  };

<<<<<<< HEAD
  /* ----------  initialisation & canvas animation ---------- */
  useEffect(() => {
    setMounted(true);

=======
  /* ----------  initialisation & canvas animation ---------- */
  useEffect(() => {
    setMounted(true);

    // Initialize session and check profile
>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e
    const initializeUser = async () => {
      const id = getSessionId();
      setSessionId(id);

      try {
        const response = await fetch(`http://localhost:8000/api/user/profile/exists?session_id=${id}`);
        if (response.ok) {
          const data = await response.json();
<<<<<<< HEAD
=======
          // ✅ Set hasProfile based on existence only, not completeness
>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e
          setHasProfile(data.exists);
        }
      } catch (error) {
        console.error('Error checking profile:', error);
<<<<<<< HEAD
        setHasProfile(false);
      } finally {
=======
        // ✅ Even if there's an error, don't get stuck loading
        setHasProfile(false);
      } finally {
        // ✅ Always set loading to false, no matter what
>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e
        setProfileLoading(false);
      }
    };

    initializeUser();

    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      color: Math.random() > 0.5 ? '#f97316' : '#22c55e'
    }));
    setParticles(newParticles);

    const text = "आपका विश्वसनीय कानूनी साथी | Your Trusted Legal Companion";
    let idx = 0;
    const timer = setInterval(() => {
      if (idx <= text.length) {
        setTyping(text.slice(0, idx++));
      } else {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;
        if (p.y > canvas.height) p.y = 0;
        if (p.y < 0) p.y = canvas.height;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }, [particles]);

<<<<<<< HEAD
  /* ----------  API call ---------- */
=======
  /* ----------  API call ---------- */
>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e
  const ask = async () => {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const { data } = await axios.post('/api/agent', {
        question: q,
<<<<<<< HEAD
        session_id: sessionId
      });
      setAns(data.answer);
    } catch (err) {
      setAns('❌  ' + (err.response?.data?.error || err.message));
=======
        session_id: sessionId // Send session ID for personalization
      });
      setAns(data.answer);
    } catch (err) {
      setAns('❌  ' + (err.response?.data?.error || err.message));
>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!ans) return;
<<<<<<< HEAD

    try {
      await navigator.clipboard.writeText(ans);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
=======
    
    try {
      await navigator.clipboard.writeText(ans);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e
      const textArea = document.createElement('textarea');
      textArea.value = ans;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleProfileUpdate = async (updates: any) => {
    try {
      const response = await fetch('http://localhost:8000/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, ...updates })
      });

      if (response.ok) {
        const result = await response.json();
        setProfile(result.profile);
        return true;
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
    return false;
  };

  const handleProfileComplete = () => {
    setHasProfile(true);
  };

  if (!mounted || profileLoading) {
    return (
<<<<<<< HEAD
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom right, #fef7ec, #ffffff, #f0fdf4)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 64,
            height: 64,
            border: '4px solid #f97316',
            borderTop: '4px solid #22c55e',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px',
          }} />
          <p style={{ color: '#6b7280', fontWeight: '500' }}>Loading your personalized experience...</p>
=======
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-green-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your personalized experience...</p>
>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e
        </div>
      </div>
    );
  }

<<<<<<< HEAD
  /* ----------  JSX ---------- */
=======
  /* ----------  JSX ---------- */
>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e
  return (
    <>
      <style>{`
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: linear-gradient(to bottom,#fee6d5,#d5fee6); }
        ::-webkit-scrollbar-thumb { background: linear-gradient(to bottom,#f59e0b,#10b981); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: linear-gradient(to bottom,#d97706,#059669); }
      `}</style>

<<<<<<< HEAD
      <div style={responsiveStyles.pageWrapper}>
        <canvas ref={canvasRef} style={styles.canvas} />
        <div style={styles.gradientBg} />
=======
      <div style={styles.pageWrapper}>
        {/* animated canvas background */}
        <canvas ref={canvasRef} style={styles.canvas} />

        {/* gradient background */}
        <div style={styles.gradientBg} />

        {/* floating geometric shapes */}
>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e
        <div style={styles.geometries}>
          <svg viewBox="0 0 100 100" style={styles.hexagon} fill="url(#grad1)">
            <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" />
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
            </defs>
          </svg>
<<<<<<< HEAD
=======

>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e
          <svg viewBox="0 0 100 100" style={styles.diamond} fill="url(#grad2)">
            <path d="M50,10 L90,50 L50,90 L10,50 Z" />
            <defs>
              <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
          </svg>
        </div>
<<<<<<< HEAD
        <>
          <header style={styles.header}>
            <div style={styles.headerWave} />
            <div style={responsiveStyles.headerContent}>
              <div style={responsiveStyles.logoRow}>
                <div style={responsiveStyles.logoWrap}>
                  <img
                    src={NeethiLogo}
                    alt="Neethi Saarathi Logo"
                    style={responsiveStyles.logoImg}
                  />
                </div>
=======

        {/* ----------  MAIN APP CONTENT ---------- */}
        <>
          {/* ----------  HEADER ---------- */}
          <header style={styles.header}>
            <div style={styles.headerWave} />
            <div style={styles.headerContent}>
              <div style={styles.logoRow}>
                <div style={styles.logoWrap}>
                </div>

>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e
                <div style={styles.logoText}>
                  <h1 style={styles.brand}>
                    <span style={styles.brandPart1}>नीति</span>
                    <span style={styles.brandPart2}>सारथी</span>
                  </h1>
                  <div style={styles.dividerRow}>
                    <span style={styles.divider} />
<<<<<<< HEAD
                    <span style={responsiveStyles.subBrand}>NEETHI SAARATHI</span>
=======
                    <span style={styles.subBrand}>NEETHI SAARATHI</span>
>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e
                    <span style={styles.divider} />
                  </div>
                </div>
              </div>
<<<<<<< HEAD
              <p style={responsiveStyles.tagline}>
                {typing}
                <span style={styles.cursor} />
              </p>
              <div style={responsiveStyles.headerButtons}>
                <button
                  onClick={() => setShowProfileManager(true)}
                  style={{
                    ...responsiveStyles.headerButton,
                    background: 'linear-gradient(135deg, #f97316 0%, #22c55e 100%)',
=======

              <button
                onClick={() => setShowQuestionnaireModal(true)}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease-in-out'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.6)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.4)';
                }}
              >
                <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: '16px', height: '16px' }}>
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                </svg>
                Enhance Experience
              </button>

              <p style={styles.tagline}>
                {typing}
                <span style={styles.cursor} />
              </p>

              {/* Profile Completion Prompt */}
              {!hasProfile && (
                <div style={{
                  background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '25px',
                  marginTop: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)',
                  transition: 'all 0.3s ease-in-out'
                }}
                onClick={() => setShowQuestionnaireModal(true)}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.6)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(245, 158, 11, 0.4)';
                }}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: '16px', height: '16px' }}>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Complete your profile for personalized assistance
                </div>
              )}

              {/* ADD THIS IN YOUR HEADER SECTION */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '16px',
                marginTop: '16px',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => setShowProfileManager(true)}
                  style={{
                    background: 'linear-gradient(135deg, #f97316 0%, #22c55e 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease-in-out',
                    boxShadow: '0 4px 15px rgba(249, 115, 22, 0.4)'
>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(249, 115, 22, 0.6)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(249, 115, 22, 0.4)';
                  }}
                >
<<<<<<< HEAD
                  <img
                    src={ProfileGif}
                    alt="Profile"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginRight: 10,
                      background: 'Transparent',
                    }}
                  />
                  {hasProfile ? 'Manage Profile' : 'Profile'}
                </button>
                <div
                  style={{
                    ...responsiveStyles.headerButton,
                    background: !hasProfile
                      ? 'linear-gradient(135deg, #f59e0b, #ea580c)'
                      : 'transparent',
                    color: !hasProfile ? 'white' : 'inherit',
                    padding: !hasProfile ? '12px 24px' : '0',
                    boxShadow: !hasProfile ? '0 4px 15px rgba(245, 158, 11, 0.4)' : 'none',
                    cursor: hasProfile ? 'default' : 'pointer',
                  }}
                  onClick={() => {
                    if (!hasProfile) {
                      setShowQuestionnaireModal(true);
                    }
                  }}
                  onMouseOver={(e) => {
                    if (!hasProfile) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.6)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!hasProfile) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(245, 158, 11, 0.4)';
                    }
                  }}
                >
                  {hasProfile ? (
                    <div style={responsiveStyles.profileComplete}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: '#22c55e',
                        animation: 'pulse 2s infinite',
                      }} />
                      <span style={{ fontSize: '14px', fontWeight: '500' }}>
                        Profile Complete ✓
                      </span>
                    </div>
                  ) : (
                    <>
                      <img
                          src={Plus}
                          alt="Plus Logo"
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            marginRight: 10,
                            background: 'Transparent',
                          }}
                        />
                      Complete your profile for personalized assistance
                    </>
                  )}
                </div>
              </div>
=======
                  <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: '16px', height: '16px' }}>
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  {hasProfile ? 'Manage Profile' : 'Create Profile'}
                </button>

                {/* Profile Status Indicator */}
                <div style={{
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  padding: '12px 20px',
                  borderRadius: '25px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: hasProfile ? '#22c55e' : '#f59e0b',
                    animation: hasProfile ? 'pulse 2s infinite' : 'none'
                  }} />
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>
                    {hasProfile ? 'Profile Complete ✓' : 'Profile Incomplete'}
                  </span>
                </div>
              </div>

              {/* Profile Indicator */}
              <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium">Profile Complete ✓</span>
              </div>
>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e
            </div>
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={styles.bottomWave}>
              <path d="M0,50 Q150,100 300,50 T600,50 T900,50 T1200,50 L1200,120 L0,120 Z" fill="#fff" />
            </svg>
          </header>

<<<<<<< HEAD
          <section ref={heroRef} style={responsiveStyles.hero}>
            <div style={styles.heroCard}>
              <div style={styles.heroIcon}>
                <img
                  src={HeaderLaw}
                  alt="Header Law"
                  style={{ width:85, height: 85, verticalAlign: 'middle', marginRight: 8 }}
                />
              </div>
              <h2 style={responsiveStyles.heroTitle}>
=======
          {/* ----------  HERO ---------- */}
          <section ref={heroRef} style={styles.hero}>
            <div style={styles.heroCard}>
              <div style={styles.heroIcon}>
                <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 48, height: 48 }}>
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              </div>

              <h2 style={styles.heroTitle}>
>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e
                <span style={styles.heroTitle1}>आपका डिजिटल</span>
                <br />
                <span style={styles.heroTitle2}>न्यायिक सहायक</span>
              </h2>
<<<<<<< HEAD
              <h3 style={{ ...responsiveStyles.heroSub, textAlign: 'center' }}>Your Digital Legal Assistant</h3>
              <p style={{ ...responsiveStyles.heroDesc, textAlign: 'center' }}>
                <span style={{ color: '#f97316', fontWeight: 'bold' }}>भारतीय कानून</span>, <span style={{ color: '#22c55e', fontWeight: 'bold' }}>अधिकार</span>, या <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>सरकारी योजनाओं</span> के बारे में कोई भी प्रश्न पूछें
              </p>
              <p style={{ ...responsiveStyles.heroDesc2, textAlign: 'center' }}>
                Ask any question about <span style={{ color: '#ea580c', fontWeight: 600 }}>Indian laws</span>, <span style={{ color: '#16a34a', fontWeight: 600 }}>rights</span>, or <span style={{ color: '#2563eb', fontWeight: 600 }}>government schemes</span>
              </p>
              <div style={responsiveStyles.stats}>
=======
              <h3 style={styles.heroSub}>Your Digital Legal Assistant</h3>

              <p style={styles.heroDesc}>
                <span style={{ color: '#f97316', fontWeight: 'bold' }}>भारतीय कानून</span>, <span style={{ color: '#22c55e', fontWeight: 'bold' }}>अधिकार</span>, या <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>सरकारी योजनाओं</span> के बारे में कोई भी प्रश्न पूछें
              </p>
              <p style={styles.heroDesc2}>
                Ask any question about <span style={{ color: '#ea580c', fontWeight: 600 }}>Indian laws</span>, <span style={{ color: '#16a34a', fontWeight: 600 }}>rights</span>, or <span style={{ color: '#2563eb', fontWeight: 600 }}>government schemes</span>
              </p>

              <div style={styles.stats}>
>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e
                <div style={styles.stat}><div style={styles.statNum}>10,000+</div><div style={styles.statLabel}>कानूनी प्रश्न | Legal Queries</div></div>
                <div style={styles.stat}><div style={styles.statNum}>24/7</div><div style={styles.statLabel}>सहायता | Support</div></div>
                <div style={styles.stat}><div style={styles.statNum}>100%</div><div style={styles.statLabel}>गोपनीयता | Privacy</div></div>
              </div>
            </div>
          </section>

<<<<<<< HEAD
          <main style={responsiveStyles.main}>
            <div style={responsiveStyles.queryCard}>
              <div style={responsiveStyles.queryHeader}>
                <div style={responsiveStyles.queryIcon}>
                  <img
                    src={EditPencil}
                    alt="EditPencil Logo"
                    style={{
                      width: 45,
                      height: 45,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginRight: 8,
                      background: 'Transparent'
                    }}
                  />
                </div>
                <div>
                  <h2 style={responsiveStyles.queryTitle}>अपना प्रश्न पूछें</h2>
                  <p style={responsiveStyles.querySub}>Ask Your Question</p>
                </div>
              </div>
              <div style={responsiveStyles.textareaWrap}>
                <textarea
                  rows={responsiveStyles.isMobile ? 6 : 8}
                  style={responsiveStyles.textarea}
=======
          {/* ----------  QUERY CARD ---------- */}
          <main style={styles.main}>
            <div style={styles.queryCard}>
              <div style={styles.queryHeader}>
                <div style={styles.queryIcon}>
                  <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 32, height: 32 }}>
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </div>
                <div>
                  <h2 style={styles.queryTitle}>अपना प्रश्न पूछें</h2>
                  <p style={styles.querySub}>Ask Your Question</p>
                </div>
              </div>

              <div style={styles.textareaWrap}>
                <textarea
                  rows={8}
                  style={styles.textarea}
>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e
                  placeholder="उदाहरण: यदि मेरा मकान मालिक मेरी जमानत राशि रखता है तो मेरे अधिकार क्या हैं?&#10;&#10;Example: What are my rights if my landlord keeps my security deposit?&#10;&#10;💡 विस्तार से बताएं | Please provide details for better assistance"
                  value={q}
                  onChange={e => setQ(e.target.value)}
                />
                <span style={styles.charCount}>{q.length}/1000</span>
              </div>
<<<<<<< HEAD
=======

>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={ask}
                  disabled={loading || !q.trim()}
                  style={{
<<<<<<< HEAD
                    ...responsiveStyles.button,
=======
                    ...styles.button,
>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e
                    background: loading
                      ? 'linear-gradient(135deg,#9ca3af 0%,#6b7280 100%)'
                      : 'linear-gradient(135deg,#f97316 0%,#ea580c 50%,#22c55e 100%)',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? (
                    <>
                      <div style={styles.spinner} />
                      विचार कर रहे हैं... | Processing...
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 24, height: 24 }}>
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                      <span style={{ marginLeft: 8 }}>प्रश्न भेजें | Submit Question</span>
                    </>
                  )}
                </button>
              </div>
            </div>
<<<<<<< HEAD
            {ans && (
              <div style={responsiveStyles.responseCard}>
                <div style={responsiveStyles.responseHeader}>
=======

            {/* ----------  RESPONSE CARD ---------- */}
            {ans && (
              <div style={styles.responseCard}>
                <div style={styles.responseHeader}>
>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e
                  <div style={styles.responseIcon}>
                    <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 32, height: 32 }}>
                      <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
<<<<<<< HEAD
                    <h2 style={responsiveStyles.responseTitle}>कानूनी सलाह</h2>
                    <p style={responsiveStyles.responseSub}>Legal Advice</p>
                  </div>
                </div>
                <div style={responsiveStyles.responseBody}>
                  <ReactMarkdown>{ans}</ReactMarkdown>
                </div>
                <div style={responsiveStyles.actionRow}>
                  <button
                    onClick={copyToClipboard}
                    style={{
                      ...responsiveStyles.actionBtn,
                      background: isCopied
                        ? 'linear-gradient(135deg,#22c55e 0%,#16a34a 100%)'
                        : 'linear-gradient(135deg,#3b82f6 0%,#2563eb 100%)'
                    }}
                    disabled={isCopied}
                  > 
                    <img
                      src={Copy}
                      alt="Copy icon"
                      style={{
                        width: 24,
                        height: 24,
                        marginRight: 8,
                        verticalAlign: 'middle',
                        borderRadius: 6,
                        background: 'Transparent'
                      }}
                    />
                    {isCopied ? 'Copied!' : 'Copy Answer'}
                  </button>
                  <button style={responsiveStyles.actionBtn}><img
                      src={Download}
                      alt="Download icon"
                      style={{
                        width: 24,
                        height: 24,
                        marginRight: 8,
                        verticalAlign: 'middle',
                        borderRadius: 6,
                        background: 'Transparent'
                      }} />
                    Download PDF</button>
                  <button style={responsiveStyles.actionBtn}>
                    <img
                      src={CopyLink}
                      alt="CopyLink icon"
                      style={{
                        width: 24,
                        height: 24,
                        marginRight: 8,
                        verticalAlign: 'middle',
                        borderRadius: 6,
                        background: 'Transparent'
                      }}
                    />Share Link</button>
=======
                    <h2 style={styles.responseTitle}>कानूनी सलाह</h2>
                    <p style={styles.responseSub}>Legal Advice</p>
                  </div>
                </div>

                <div style={styles.responseBody}>
                  <ReactMarkdown>
                    {ans}
                  </ReactMarkdown>
                </div>

                <div style={styles.actionRow}>
                  <button 
                    onClick={copyToClipboard}
                    style={{
                      ...styles.actionBtn,
                      background: isCopied 
                        ? 'linear-gradient(135deg,#22c55e 0%,#16a34a 100%)' 
                        : 'linear-gradient(135deg,#3b82f6 0%,#2563eb 100%)'
                    }}
                    disabled={isCopied}
                  >
                    {isCopied ? '✅ Copied!' : '📋 Copy Answer'}
                  </button>
                  <button style={styles.actionBtn}>📄 Download PDF</button>
                  <button style={styles.actionBtn}>🔗 Share Link</button>
>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e
                </div>
              </div>
            )}
          </main>
<<<<<<< HEAD
          {showQuestionnaireModal && (
            <div style={styles.modalOverlay}>
              <div style={styles.modalContent}>
                <button
                  onClick={() => setShowQuestionnaireModal(false)}
                  style={styles.modalCloseBtn}
=======

          {/* ----------  QUESTIONNAIRE MODAL ---------- */}
          {showQuestionnaireModal && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #fffbeb 0%, #ecfdf5 100%)',
                borderRadius: '24px',
                padding: '0',
                maxWidth: '90vw',
                maxHeight: '90vh',
                overflow: 'auto',
                position: 'relative'
              }}>
                <button
                  onClick={() => setShowQuestionnaireModal(false)}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    fontSize: '20px',
                    cursor: 'pointer',
                    zIndex: 1001
                  }}
>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e
                >
                  ×
                </button>
                <Questionnaire
                  sessionId={sessionId}
                  onComplete={() => {
                    setHasProfile(true);
                    setShowQuestionnaireModal(false);
                  }}
                  onSave={saveProfile}
                />
              </div>
            </div>
          )}
<<<<<<< HEAD
          {showProfileManager && (
            <div style={styles.modalOverlay}>
              <div style={styles.modalContent}>
                <button
                  onClick={() => setShowProfileManager(false)}
                  style={styles.modalCloseBtn}
=======

          {/* ----------  PROFILE MANAGER MODAL ---------- */}
          {showProfileManager && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #fffbeb 0%, #ecfdf5 100%)',
                borderRadius: '24px',
                padding: '0',
                maxWidth: '90vw',
                maxHeight: '90vh',
                overflow: 'auto',
                position: 'relative'
              }}>
                <button
                  onClick={() => setShowProfileManager(false)}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    fontSize: '20px',
                    cursor: 'pointer',
                    zIndex: 1001
                  }}
>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e
                >
                  ×
                </button>
                <ProfileManager
                  sessionId={sessionId}
                  onUpdate={handleProfileUpdate}
                />
              </div>
            </div>
          )}
<<<<<<< HEAD
          <section style={styles.features}>
            <h2 style={responsiveStyles.secTitle}>प्रमुख विशेषताएं</h2>
            <p style={responsiveStyles.secSub}>Premium Features</p>
            <div style={responsiveStyles.featureGrid}>
              {[
                { gif: Law, title: 'व्यापक कानूनी डेटाबेस', titleEn: 'Comprehensive Legal Database', desc: '50,000+ भारतीय कानून, नियम और मिसाल', descEn: '50,000+ Indian laws, rules and precedents', grad: 'linear-gradient(135deg,#f97316 0%,#dc2626 100%)' },
                { gif: Privacy, title: 'पूर्ण गोपनीयता सुरक्षा', titleEn: 'Complete Privacy Protection', desc: 'एंड-टू-एंड एन्क्रिप्शन और डेटा सुरक्षा', descEn: 'End-to-end encryption and data security', grad: 'linear-gradient(135deg,#3b82f6 0%,#4338ca 100%)' },
                { gif: AI, title: 'तत्काल AI सहायता', titleEn: 'Instant AI Assistance', desc: '3 सेकंड में सटीक कानूनी जवाब', descEn: 'Accurate legal answers in 3 seconds', grad: 'linear-gradient(135deg,#22c55e 0%,#0d9488 100%)' },
                { gif: Multimedia, title: 'मल्टी-प्लेटफॉर्म एक्सेस', titleEn: 'Multi-Platform Access', desc: 'वेब, मोबाइल, और व्हाट्सऐप पर उपलब्ध', descEn: 'Available on Web, Mobile, and WhatsApp', grad: 'linear-gradient(135deg,#a855f7 0%,#db2777 100%)' },
                { gif: Museum, title: 'सुप्रीम कोर्ट डेटा', titleEn: 'Supreme Court Database', desc: 'नवीनतम निर्णय और संविधान संशोधन', descEn: 'Latest judgments and constitutional amendments', grad: 'linear-gradient(135deg,#eab308 0%,#ea580c 100%)' },
                { gif: Globe, title: '15+ भाषा समर्थन', titleEn: '15+ Language Support', desc: 'हिंदी, अंग्रेजी और क्षेत्रीय भाषाओं में', descEn: 'Hindi, English and regional languages', grad: 'linear-gradient(135deg,#6366f1 0%,#a855f7 100%)' }
              ].map((f, i) => (  
                <div key={i} style={styles.featureCard}>
                  <div style={{ ...styles.featureIcon, background: f.grad }}>
                    <img
                      src={f.gif}
                      alt={f.titleEn}
                      style={{
                        width: 48,
                        height: 48,
                        objectFit: 'contain',
                        borderRadius: 12,
                        background: 'transparent'
                      }}
                    />
                  </div>
=======

          {/* ----------  FEATURES ---------- */}
          <section style={styles.features}>
            <h2 style={styles.secTitle}>प्रमुख विशेषताएं</h2>
            <p style={styles.secSub}>Premium Features</p>
            <div style={styles.featureGrid}>
              {[
                { icon: '⚖️', title: 'व्यापक कानूनी डेटाबेस', titleEn: 'Comprehensive Legal Database', desc: '50,000+ भारतीय कानून, नियम और मिसाल', descEn: '50,000+ Indian laws, rules and precedents', grad: 'linear-gradient(135deg,#f97316 0%,#dc2626 100%)' },
                { icon: '🔒', title: 'पूर्ण गोपनीयता सुरक्षा', titleEn: 'Complete Privacy Protection', desc: 'एंड-टू-एंड एन्क्रिप्शन और डेटा सुरक्षा', descEn: 'End-to-end encryption and data security', grad: 'linear-gradient(135deg,#3b82f6 0%,#4338ca 100%)' },
                { icon: '⚡', title: 'तत्काल AI सहायता', titleEn: 'Instant AI Assistance', desc: '3 सेकंड में सटीक कानूनी जवाब', descEn: 'Accurate legal answers in 3 seconds', grad: 'linear-gradient(135deg,#22c55e 0%,#0d9488 100%)' },
                { icon: '📱', title: 'मल्टी-प्लेटफॉर्म एक्सेस', titleEn: 'Multi-Platform Access', desc: 'वेब, मोबाइल, और व्हाट्सऐप पर उपलब्ध', descEn: 'Available on Web, Mobile, and WhatsApp', grad: 'linear-gradient(135deg,#a855f7 0%,#db2777 100%)' },
                { icon: '🏛️', title: 'सुप्रीम कोर्ट डेटा', titleEn: 'Supreme Court Database', desc: 'नवीनतम निर्णय और संविधान संशोधन', descEn: 'Latest judgments and constitutional amendments', grad: 'linear-gradient(135deg,#eab308 0%,#ea580c 100%)' },
                { icon: '🌐', title: '15+ भाषा समर्थन', titleEn: '15+ Language Support', desc: 'हिंदी, अंग्रेजी और क्षेत्रीय भाषाओं में', descEn: 'Hindi, English and regional languages', grad: 'linear-gradient(135deg,#6366f1 0%,#a855f7 100%)' }
              ].map((f, i) => (
                <div key={i} style={styles.featureCard}>
                  <div style={{ ...styles.featureIcon, background: f.grad }}>{f.icon}</div>
>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e
                  <h3 style={styles.featureTitle}>{f.title}</h3>
                  <h4 style={styles.featureTitleEn}>{f.titleEn}</h4>
                  <p style={styles.featureDesc}>{f.desc}</p>
                  <p style={styles.featureDescEn}>{f.descEn}</p>
                </div>
              ))}
            </div>
          </section>

<<<<<<< HEAD
          <section style={styles.testimonials}>
            <h2 style={responsiveStyles.secTitle}>उपयोगकर्ता प्रतिक्रिया</h2>
            <p style={responsiveStyles.secSub}>User Testimonials</p>
            <div style={responsiveStyles.testimonialGrid}>
              {[
                { name: 'राज कुमार शर्मा', nameEn: 'Raj Kumar Sharma', role: 'बिजनेसमैन | Businessman', text: 'NeethiSaarathi ने मेरे GST संबंधी सभी सवालों का तुरंत जवाब दिया। बहुत ही उपयोगी सेवा है।', textEn: 'NeethiSaarathi instantly answered all my GST-related questions. Very useful service.', avatar: MenReview },
                { name: 'प्रिया पटेल', nameEn: 'Priya Patel', role: 'गृहिणी | Homemaker', text: 'घरेलू कानूनी समस्याओं के लिए यह बहुत अच्छा प्लेटफॉर्म है। सभी जानकारी हिंदी में मिलती है।', textEn: 'Great platform for household legal issues. All information available in Hindi.', avatar: WomenReview },
                { name: 'अमित सिंह', nameEn: 'Amit Singh', role: 'वकील | Lawyer', text: 'मैं खुद एक वकील हूं, लेकिन यह टूल त्वरित रिसर्च के लिए बहुत उपयोगी है।', textEn: 'I\'m a lawyer myself, but this tool is very useful for quick research.', avatar: MenReview }
              ].map((t, i) => (
                <div key={i} style={styles.testimonialCard}>
                  <div style={styles.testimonialAvatar}>
                    <img
                      src={t.avatar}
                      alt={t.nameEn}
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        background: 'Transparent',
                      }}
                    />
                  </div>
=======
          {/* ----------  TESTIMONIALS ---------- */}
          <section style={styles.testimonials}>
            <h2 style={styles.secTitle}>उपयोगकर्ता प्रतिक्रिया</h2>
            <p style={styles.secSub}>User Testimonials</p>
            <div style={styles.testimonialGrid}>
              {[
                { name: 'राज कुमार शर्मा', nameEn: 'Raj Kumar Sharma', role: 'बिजनेसमैन | Businessman', text: 'NeethiSaarathi ने मेरे GST संबंधी सभी सवालों का तुरंत जवाब दिया। बहुत ही उपयोगी सेवा है।', textEn: 'NeethiSaarathi instantly answered all my GST-related questions. Very useful service.', avatar: '👨‍💼' },
                { name: 'प्रिया पटेल', nameEn: 'Priya Patel', role: 'गृहिणी | Homemaker', text: 'घरेलू कानूनी समस्याओं के लिए यह बहुत अच्छा प्लेटफॉर्म है। सभी जानकारी हिंदी में मिलती है।', textEn: 'Great platform for household legal issues. All information available in Hindi.', avatar: '👩‍🦱' },
                { name: 'अमित सिंह', nameEn: 'Amit Singh', role: 'वकील | Lawyer', text: 'मैं खुद एक वकील हूं, लेकिन यह टूल त्वरित रिसर्च के लिए बहुत उपयोगी है।', textEn: 'I\'m a lawyer myself, but this tool is very useful for quick research.', avatar: '👨‍⚖️' }
              ].map((t, i) => (
                <div key={i} style={styles.testimonialCard}>
                  <div style={styles.testimonialAvatar}>{t.avatar}</div>
>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e
                  <div>
                    <h4 style={styles.testimonialName}>{t.name}</h4>
                    <p style={styles.testimonialNameEn}>{t.nameEn}</p>
                    <p style={styles.testimonialRole}>{t.role}</p>
                  </div>
                  <div style={{ marginTop: 12 }}>⭐⭐⭐⭐⭐</div>
                  <blockquote style={styles.testimonialText}>"{t.text}"</blockquote>
                  <p style={styles.testimonialTextEn}>"{t.textEn}"</p>
                </div>
              ))}
            </div>
          </section>

<<<<<<< HEAD
          <footer style={styles.footer}>
            <div style={styles.footerWave} />
            <div style={responsiveStyles.footerContent}>
              <div>
                <img
                  src={NeethiLogo}
                  alt="Neethi Saarathi Logo"
                  style={responsiveStyles.footerImg}
                />
              </div>
              <h3 style={responsiveStyles.footerBrand}>नीति<span style={{ color: '#fff' }}>सारथी</span></h3>
              <p style={responsiveStyles.footerSub}>NeethiSaarathi</p>
              <div style={responsiveStyles.footerGrid}>
                <div>
                  <h4> 
                    <img
                      src={Museum}
                      alt="footer Museum Logo"
                      style={{ width: 32, height: 32, verticalAlign: 'middle', marginRight: 8 }}
                    />
                    <span style={{ textDecoration: 'underline' }}>Legal Services</span></h4>
                  <p>Constitutional Law</p><p>Criminal Law</p><p>Civil Rights</p><p>Family Law</p>
                </div>
                <div>
                    <h4>
                    <img
                      src={Search}
                      alt="footer Search Logo"
                      style={{ width: 32, height: 32, verticalAlign: 'middle', marginRight: 8 }}
                    />
                    <span style={{ textDecoration: 'underline' }}>Platform</span>
                    </h4>
                  <p>Web Application</p><p>Mobile App</p><p>WhatsApp Bot</p><p>API Access</p>
                </div>
                <div>
                  <h4>
                    <img
                      src={Service}
                      alt="footer Service Logo"
                      style={{ width: 32, height: 32, verticalAlign: 'middle', marginRight: 8 }}
                    />
                    <span style={{ textDecoration: 'underline' }}>Services</span></h4>
                  <p>24/7 Support</p><p>Legal Experts</p><p>Community Forum</p><p>Documentation</p>
                </div>
              </div>
              <div style={responsiveStyles.footerStats}>
                <div><div style={styles.footerStatNum}>1M+</div><div>प्रश्न हल | Questions Solved</div></div>
                <div><div style={styles.footerStatNum}>50K+</div><div>खुश उपयोगकर्ता | Happy Users</div></div>
                <div><div style={styles.footerStatNum}>99.9%</div><div>सटीकता | Accuracy Rate</div></div>
              </div>
              <div style={styles.footerBottom}>
                <p>© 2025 NeethiSaarathi | नीतिसारथी - All Rights Reserved</p>
                <p style={{ fontWeight: 'bold', color: '#fbbf24' }}>सत्यमेव जयते | Truth Alone Triumphs</p>
                <p>🇮🇳 Proudly Made in India 🇮🇳</p>
              </div>
            </div>
            <div style={styles.footerBar} />
          </footer>
        </>
=======
            {/* ----------  FOOTER ---------- */}
            <footer style={styles.footer}>
              <div style={styles.footerWave} />
              <div style={styles.footerContent}>
                <div style={styles.footerLogo}>
                  <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 48, height: 48, color: '#fff' }}>
                    <path fillRule="evenodd" d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5zm-1 9a1 1 0 112 0v2a1 1 0 11-2 0v-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 style={styles.footerBrand}>नीति<span style={{ color: '#fff' }}>सारथी</span></h3>
                <p style={styles.footerSub}>NeethiSaarathi</p>

                <div style={styles.footerGrid}>
                  <div>
                    <h4>🏛️ कानूनी सेवाएं</h4>
                    <p>Constitutional Law</p><p>Criminal Law</p><p>Civil Rights</p><p>Family Law</p>
                  </div>
                  <div>
                    <h4>📱 प्लेटफॉर्म</h4>
                    <p>Web Application</p><p>Mobile App</p><p>WhatsApp Bot</p><p>API Access</p>
                  </div>
                  <div>
                    <h4>🤝 सहायता</h4>
                    <p>24/7 Support</p><p>Legal Experts</p><p>Community Forum</p><p>Documentation</p>
                  </div>
                </div>

                <div style={styles.footerStats}>
                  <div><div style={styles.footerStatNum}>1M+</div><div>प्रश्न हल | Questions Solved</div></div>
                  <div><div style={styles.footerStatNum}>50K+</div><div>खुश उपयोगकर्ता | Happy Users</div></div>
                  <div><div style={styles.footerStatNum}>99.9%</div><div>सटीकता | Accuracy Rate</div></div>
                </div>

                <div style={styles.footerBottom}>
                  <p>© 2025 NeethiSaarathi | नीतिसारथी - All Rights Reserved</p>
                  <p style={{ fontWeight: 'bold', color: '#fbbf24' }}>सत्यमेव जयते | Truth Alone Triumphs</p>
                  <p>🇮🇳 Proudly Made in India 🇮🇳</p>
                </div>
              </div>
              <div style={styles.footerBar} />
            </footer>
          </>

        {/* ----------  GLOBAL STYLES ---------- */}
>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e
        <style>{`
          body {
            margin: 0;
            font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
            background: #fef7ec;
            overflow-x: hidden;
            scroll-behavior: smooth;
          }
          * {
            box-sizing: border-box;
          }
          pre {
            font-family: inherit;
          }
        `}</style>
      </div>
    </>
  );
}

// ... (keep all your existing style objects exactly as they are) ...

<<<<<<< HEAD
/* ----------  CSS-IN-JS / OBJECT STYLES ---------- */
const styles = {
  // Styles that do not change based on screen size
=======
/* ----------  CSS-IN-JS / OBJECT STYLES ---------- */
const styles = {
  pageWrapper: { minHeight: '100vh', position: 'relative', overflowX: 'hidden' },
>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e
  canvas: { position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: -1 },
  gradientBg: {
    position: 'fixed',
    inset: 0,
    zIndex: -2,
    background: `
      radial-gradient(circle at 20% 80%, rgba(249, 115, 22, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(251, 191, 36, 0.1) 0%, transparent 50%),
      linear-gradient(135deg, #fef7ec 0%, #ffffff 25%, #f0fdf4 50%, #ffffff 75%, #fef7ec 100%)`
  },
  geometries: {
    position: 'fixed',
    inset: 0,
    pointerEvents: 'none',
    overflow: 'hidden',
    zIndex: -1
  },
  hexagon: {
    position: 'absolute',
    top: '25%',
    left: '25%',
    width: 256,
    height: 256,
    opacity: 0.05,
    animation: 'spin 12s linear infinite'
  },
  diamond: {
    position: 'absolute',
    top: '33%',
    right: '25%',
    width: 192,
    height: 192,
    opacity: 0.1,
    animation: 'float 8s ease-in-out infinite'
  },
<<<<<<< HEAD
=======

  /* header */
>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e
  header: { position: 'relative', overflow: 'hidden' },
  headerWave: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(90deg,#ea580c 0%,#c2410c 50%,#16a34a 100%)'
  },
<<<<<<< HEAD
  logoText: { textAlign: 'center' },
=======
  headerContent: {
    position: 'relative',
    maxWidth: 1280,
    margin: '0 auto',
    padding: '32px 24px',
    textAlign: 'center',
    color: '#fff'
  },
  logoRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginBottom: 16 },
  logoWrap: { position: 'relative' },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: 'linear-gradient(135deg,#fbbf24,#ea580c,#dc2626)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,.2)',
    color: '#fff'
  },
  ping: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 12,
    height: 12,
    borderRadius: '50%',
    background: '#22c55e',
    animation: 'ping 1s cubic-bezier(0,0,.2,1) infinite'
  },
  logoText: { textAlign: 'center' },
  brand: { fontSize: 60, fontWeight: 900, margin: 0, letterSpacing: -2 },
>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e
  brandPart1: { background: 'linear-gradient(90deg,#fbbf24,#f59e0b)', WebkitBackgroundClip: 'text', color: 'transparent' },
  brandPart2: { background: 'linear-gradient(90deg,#fff,#e5e7eb)', WebkitBackgroundClip: 'text', color: 'transparent', marginLeft: 8 },
  dividerRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 8 },
  divider: { height: 4, width: 64, background: 'linear-gradient(90deg,transparent,#fbbf24)', borderRadius: 9999 },
<<<<<<< HEAD
=======
  subBrand: { color: '#fed7aa', fontSize: 18, fontWeight: 700, letterSpacing: 4 },
  tagline: { fontSize: 24, fontWeight: 500, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' },
>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e
  cursor: { width: 2, height: 24, background: '#fbbf24', marginLeft: 4, animation: 'pulse 2s cubic-bezier(.4,0,.6,1) infinite' },
  bottomWave: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 32,
    display: 'block'
  },
<<<<<<< HEAD
=======

  /* hero */
  hero: { padding: '80px 24px' },
>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e
  heroCard: {
    maxWidth: 1152,
    margin: '0 auto',
    position: 'relative'
  },
  heroIcon: {
    width: 96,
    height: 96,
    margin: '0 auto 32px',
    background: 'linear-gradient(135deg,#f97316,#fbbf24,#22c55e)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,.25)',
    color: '#fff'
  },
<<<<<<< HEAD
  heroTitle1: { background: 'linear-gradient(135deg,#ea580c,#dc2626)', WebkitBackgroundClip: 'text', color: 'transparent' },
  heroTitle2: { background: 'linear-gradient(135deg,#16a34a,#0f766e)', WebkitBackgroundClip: 'text', color: 'transparent' },
  stat: { textAlign: 'center' },
  statNum: { fontSize: 36, fontWeight: 900, background: 'linear-gradient(135deg,#ea580c,#16a34a)', WebkitBackgroundClip: 'text', color: 'transparent' },
  statLabel: { fontSize: 14, color: '#4b5563', fontWeight: 500 },
  charCount: { position: 'absolute', bottom: 16, right: 24, fontSize: 14, color: '#6b7280' },
=======
  heroTitle: { fontSize: 48, fontWeight: 900, margin: '0 0 24px', textAlign: 'center' },
  heroTitle1: { background: 'linear-gradient(135deg,#ea580c,#dc2626)', WebkitBackgroundClip: 'text', color: 'transparent' },
  heroTitle2: { background: 'linear-gradient(135deg,#16a34a,#0f766e)', WebkitBackgroundClip: 'text', color: 'transparent' },
  heroSub: { fontSize: 36, fontWeight: 700, color: '#374151', marginBottom: 24, letterSpacing: -1 },
  heroDesc: { fontSize: 20, color: '#374151', maxWidth: 1024, margin: '0 auto 16px', fontWeight: 500 },
  heroDesc2: { fontSize: 18, color: '#4b5563', maxWidth: 1024, margin: '0 auto 48px' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 32, maxWidth: 768, margin: '48px auto 0' },
  stat: { textAlign: 'center' },
  statNum: { fontSize: 36, fontWeight: 900, background: 'linear-gradient(135deg,#ea580c,#16a34a)', WebkitBackgroundClip: 'text', color: 'transparent' },
  statLabel: { fontSize: 14, color: '#4b5563', fontWeight: 500 },

  /* query */
  main: { maxWidth: 1152, margin: '0 auto 48px', padding: '0 24px' },
  queryCard: {
    position: 'relative',
    maxWidth: 1152,
    margin: '0 auto 48px',
    padding: 40,
    borderRadius: 24,
    background: 'rgba(255,255,255,.7)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,.4)',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,.15)'
  },
  queryHeader: { display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center', marginBottom: 32 },
  queryIcon: {
    width: 64,
    height: 64,
    background: 'linear-gradient(135deg,#f97316,#dc2626)',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,.1)',
    color: '#fff'
  },
  queryTitle: { fontSize: 36, fontWeight: 900, color: '#dc2626', margin: 0 },
  querySub: { fontSize: 20, color: '#4b5563', margin: 0 },
  textareaWrap: { position: 'relative', marginBottom: 32 },
  textarea: {
    width: '100%',
    padding: 32,
    borderRadius: 16,
    fontSize: 18,
    lineHeight: 1.6,
    resize: 'vertical',
    border: 'none',
    outline: 'none',
    background: 'linear-gradient(135deg,rgba(255,255,255,.9) 0%,rgba(255,247,237,.9) 100%)',
    boxShadow: 'inset 0 2px 4px 0 rgba(0,0,0,.06)'
  },
  charCount: { position: 'absolute', bottom: 16, right: 24, fontSize: 14, color: '#6b7280' },
  button: {
    padding: '24px 64px',
    borderRadius: 16,
    fontSize: 20,
    fontWeight: 700,
    border: 'none',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    boxShadow: '0 10px 30px rgba(249,115,22,.4)',
    transition: 'transform .3s'
  },
>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e
  spinner: {
    width: 28,
    height: 28,
    border: '3px solid #fff',
    borderTop: '3px solid transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
<<<<<<< HEAD
=======

  /* response */
  responseCard: {
    position: 'relative',
    padding: 40,
    borderRadius: 24,
    background: 'rgba(255,255,255,.7)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,.4)',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,.15)',
    animation: 'slideInFromBottom .8s ease-out'
  },
  responseHeader: { display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center', marginBottom: 32 },
>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e
  responseIcon: {
    width: 64,
    height: 64,
    background: 'linear-gradient(135deg,#22c55e,#0d9488)',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff'
  },
<<<<<<< HEAD
  features: { padding: '80px 24px', background: 'linear-gradient(135deg,#fffbeb 0%,#fef3c7 50%,#ecfdf5 100%)' },
=======
  responseTitle: { fontSize: 36, fontWeight: 900, color: '#16a34a', margin: 0 },
  responseSub: { fontSize: 20, color: '#4b5563', margin: 0 },
  responseBody: {
    position: 'relative',
    padding: 32,
    borderRadius: 16,
    background: 'linear-gradient(135deg,rgba(255,255,255,.9) 0%,rgba(240,253,244,.9) 100%)',
    boxShadow: 'inset 0 2px 4px 0 rgba(0,0,0,.06)'
  },
  responseText: { whiteSpace: 'pre-wrap', fontSize: 18, lineHeight: 1.75, color: '#1f2937' },
  actionRow: { display: 'flex', justifyContent: 'center', gap: 16, marginTop: 32 },
  actionBtn: {
    padding: '12px 24px',
    borderRadius: 12,
    fontWeight: 600,
    fontSize: 16,
    border: 'none',
    color: '#fff',
    background: 'linear-gradient(135deg,#3b82f6 0%,#2563eb 100%)',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,.1)'
  },

  /* features */
  features: { padding: '80px 24px', background: 'linear-gradient(135deg,#fffbeb 0%,#fef3c7 50%,#ecfdf5 100%)' },
  secTitle: { fontSize: 48, fontWeight: 900, textAlign: 'center', marginBottom: 8, background: 'linear-gradient(135deg,#ea580c,#16a34a)', WebkitBackgroundClip: 'text', color: 'transparent' },
  secSub: { fontSize: 30, fontWeight: 700, textAlign: 'center', color: '#374151', marginBottom: 24 },
  featureGrid: { maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 40 },
>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e
  featureCard: {
    padding: 32,
    borderRadius: 24,
    background: 'rgba(255,255,255,.8)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,.4)',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,.1)',
    transition: 'transform .5s',
    ':hover': { transform: 'scale(1.05) translateY(-16px)' }
  },
  featureIcon: {
    width: 80,
    height: 80,
    margin: '0 auto 24px',
    borderRadius: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 36,
    color: '#fff'
  },
  featureTitle: { fontSize: 24, fontWeight: 700, color: '#1f2937', margin: '0 0 4px' },
  featureTitleEn: { fontSize: 20, fontWeight: 600, color: '#4b5563', margin: '0 0 12px' },
  featureDesc: { color: '#374151', fontWeight: 500, margin: '0 0 8px' },
  featureDescEn: { color: '#6b7280', fontSize: 14 },
<<<<<<< HEAD
  testimonials: { padding: '80px 24px', background: '#fffbeb' },
=======

  /* testimonials */
  testimonials: { padding: '80px 24px', background: '#fffbeb' },
  testimonialGrid: { maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 32 },
>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e
  testimonialCard: {
    padding: 32,
    borderRadius: 24,
    background: 'rgba(255,255,255,.8)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,.4)',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,.1)'
  },
  testimonialAvatar: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    background: 'linear-gradient(135deg,#f97316,#22c55e)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 32,
    margin: '0 auto 16px'
  },
  testimonialName: { fontSize: 20, fontWeight: 700, color: '#1f2937', margin: 0 },
  testimonialNameEn: { fontSize: 16, color: '#4b5563', margin: 0 },
  testimonialRole: { fontSize: 14, color: '#6b7280', margin: 0 },
  testimonialText: { fontStyle: 'italic', marginTop: 16, color: '#374151', lineHeight: 1.6 },
  testimonialTextEn: { fontSize: 14, color: '#6b7280' },
<<<<<<< HEAD
=======

  /* footer */
>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e
  footer: { position: 'relative', overflow: 'hidden' },
  footerWave: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(90deg,#ea580c 0%,#c2410c 50%,#16a34a 100%)'
  },
<<<<<<< HEAD
  footerBottom: { borderTop: '1px solid #f97316', paddingTop: 32 },
  footerBar: { height: 6, background: 'linear-gradient(90deg,#fbbf24,#f97316,#22c55e,#3b82f6)' },
  footerStatNum: { fontSize: 32, fontWeight: 900, color: '#fbbf24' },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modalContent: {
    background: 'linear-gradient(135deg, #fffbeb 0%, #ecfdf5 100%)',
    borderRadius: '24px',
    padding: '0',
    maxWidth: '90vw',
    maxHeight: '90vh',
    overflow: 'auto',
    position: 'relative',
  },
  modalCloseBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    fontSize: '20px',
    cursor: 'pointer',
    zIndex: 1001,
  },
};

/* ----------  KEYFRAMES ---------- */
=======
  footerContent: {
    position: 'relative',
    maxWidth: 1280,
    margin: '0 auto',
    padding: '64px 24px 0',
    color: '#fff',
    textAlign: 'center'
  },
  footerLogo: { width: 96, height: 96, margin: '0 auto 32px', borderRadius: '50%', background: 'linear-gradient(135deg,#fbbf24,#ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  footerBrand: { fontSize: 36, fontWeight: 900, margin: '0 0 4px' },
  footerSub: { fontSize: 24, color: '#fed7aa', margin: '0 0 48px' },
  footerGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 48, marginBottom: 48 },
  footerStats: { display: 'flex', justifyContent: 'center', gap: 48, margin: '48px 0', flexWrap: 'wrap' },
  footerStatNum: { fontSize: 32, fontWeight: 900, color: '#fbbf24' },
  footerBottom: { borderTop: '1px solid #f97316', paddingTop: 32 },
  footerBar: { height: 6, background: 'linear-gradient(90deg,#fbbf24,#f97316,#22c55e,#3b82f6)' }
};

/* ----------  KEYFRAMES ---------- */
>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e
const css = `
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes float {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-30px); }
}
@keyframes ping {
  75%,100% { transform: scale(2); opacity: 0; }
}
@keyframes slideInFromBottom {
  from { opacity: 0; transform: translateY(100px); }
  to { opacity: 1; transform: translateY(0); }
}
`;
document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);