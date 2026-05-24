import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, UploadCloud, CheckCircle2, Loader2, User, FileText, Sparkles, AlertCircle, Key, Settings, Camera, Check, Globe } from 'lucide-react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

// Predefined modern SVG gradient avatars
const AVATARS = [
  { id: 1, grad: "from-[#8A2387] via-[#E94057] to-[#F27121]", symbol: "💻" },
  { id: 2, grad: "from-[#11998e] to-[#38ef7d]", symbol: "🌱" },
  { id: 3, grad: "from-[#FFB75E] to-[#ED8F03]", symbol: "⚡" },
  { id: 4, grad: "from-[#00F2FE] to-[#4FACFE]", symbol: "☄️" },
  { id: 5, grad: "from-[#fc00ff] to-[#00dbde]", symbol: "🔮" },
  { id: 6, grad: "from-[#FF416C] to-[#FF4B2B]", symbol: "🔥" }
];

const RegistrationPage = ({ onBack }) => {
  const [step, setStep] = useState(1); // 1: Card Upload & Scan, 2: Profile Customization, 3: Success
  
  // Gemini API configuration states
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    return localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
  });


  // Upload/Scan states
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState('');
  const [scanProgress, setScanProgress] = useState(0);
  const [scanError, setScanError] = useState('');

  // Extracted details (editable after scan)
  const [extractedDetails, setExtractedDetails] = useState({
    name: '',
    registrationNumber: '',
    branch: '',
    college: ''
  });

  // Profile setup states
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [customAvatarUrl, setCustomAvatarUrl] = useState(null);
  const [usernameError, setUsernameError] = useState('');

  // Warning Modal for Non-VSSUT college
  const [showWarningModal, setShowWarningModal] = useState(false);

  // File inputs refs
  const idCardInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  // Save API key locally
  const handleSaveApiKey = (key) => {
    setGeminiApiKey(key);
    localStorage.setItem('gemini_api_key', key);
    setShowApiSettings(false);
  };

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle college proof upload and trigger scan
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setScanError('');
    
    // Create image preview url
    const objectUrl = URL.createObjectURL(file);
    setFilePreview(objectUrl);

    // Auto trigger scanning
    triggerScan(file);
  };

  const triggerScan = async (file) => {
    setIsScanning(true);
    setScanProgress(10);
    setScanStatus('Initializing Gemini AI scanner...');

    // If an API Key is available, try the real Gemini scan!
    if (geminiApiKey.trim()) {
      try {
        setScanProgress(30);
        setScanStatus('Converting document to image payload...');
        const base64Data = await fileToBase64(file);

        setScanProgress(50);
        setScanStatus('Analyzing credentials with Gemini 2.5 Flash...');
        
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `You are an AI assistant verifying college registration cards or student IDs.
Analyze this image and extract:
1. Student's Full Name (e.g. Soumya Patnaik)
2. Student's Registration / Roll / ID Number (e.g. 2202090001)
3. Branch / Course / Department (e.g. Computer Science, Mechanical Engineering, Metallurgical and Materials Engineering, etc.)
4. College / University Name (e.g. Veer Surendra Sai University of Technology, IIT Kharagpur, etc.)

Respond strictly in this JSON format and nothing else. Do not wrap in markdown blocks, just raw JSON:
{
  "name": "...",
  "registrationNumber": "...",
  "branch": "...",
  "college": "..."
}`
                    },
                    {
                      inlineData: {
                        mimeType: file.type || 'image/jpeg',
                        data: base64Data
                      }
                    }
                  ]
                }
              ]
            })
          }
        );

        setScanProgress(80);
        setScanStatus('Parsing Gemini extraction response...');

        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        
        // Clean markdown syntax if Gemini wrapped it
        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);

        setExtractedDetails({
          name: parsed.name || 'Unknown Candidate',
          registrationNumber: parsed.registrationNumber || 'Unknown Reg No',
          branch: parsed.branch || 'Unknown Branch',
          college: parsed.college || 'Unknown College'
        });

        setScanProgress(100);
        setIsScanning(false);
      } catch (err) {
        console.error('Gemini Scan Failed:', err);
        setScanError('Failed to parse ID card with Gemini API. Falling back to manual verification/demo.');
        setIsScanning(false);
        // Fallback to demo mode
        runSimulatedScan(file);
      }
    } else {
      // Fallback to simulated scan
      runSimulatedScan(file);
    }
  };

  const runSimulatedScan = (file) => {
    setIsScanning(true);
    let currentProgress = 10;
    
    const interval = setInterval(() => {
      currentProgress += 15;
      if (currentProgress >= 95) {
        clearInterval(interval);
        
        setTimeout(() => {
          setIsScanning(false);
          setScanProgress(100);

          const fileName = file?.name?.toLowerCase() || '';
          const isVSSUT = fileName.includes('vssut') || fileName.includes('veer') || fileName.includes('sai') || fileName.includes('burla');

          if (isVSSUT) {
            setExtractedDetails({
              name: 'Soumya Patnaik',
              registrationNumber: '2202090001',
              branch: 'Metallurgical and Materials Engineering',
              college: 'Veer Surendra Sai University of Technology (VSSUT)'
            });
          } else {
            setExtractedDetails({
              name: 'Rohan Sharma',
              registrationNumber: '22CS30045',
              branch: 'Computer Science and Engineering',
              college: 'Indian Institute of Technology, Kharagpur'
            });
          }
        }, 800);
      }

      setScanProgress(Math.min(currentProgress, 95));
      if (currentProgress < 40) {
        setScanStatus('Simulating AI Scan: Initializing OCR...');
      } else if (currentProgress < 70) {
        setScanStatus('Simulating AI Scan: Detecting text nodes...');
      } else {
        setScanStatus('Simulating AI Scan: Extracting candidate data...');
      }
    }, 300);
  };

  // Pre-fill display name once details are ready
  useEffect(() => {
    if (extractedDetails.name) {
      setDisplayName(extractedDetails.name);
      const cleanName = extractedDetails.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_+|_+$/g, '');
      setUsername(cleanName);
    }
  }, [extractedDetails]);

  // Handle local avatar photo upload
  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setCustomAvatarUrl(objectUrl);
    setSelectedAvatar({ id: 99, grad: '', symbol: '👤', custom: true, url: objectUrl });
  };

  // Validate Username input on change
  const handleUsernameChange = (val) => {
    const cleanVal = val.startsWith('@') ? val.slice(1) : val;
    setUsername(cleanVal);

    if (cleanVal.trim() === '') {
      setUsernameError('Username is required.');
    } else if (/[A-Z]/.test(cleanVal)) {
      setUsernameError('Username must be lowercase only.');
    } else if (/\s/.test(cleanVal)) {
      setUsernameError('Username cannot contain spaces.');
    } else if (!/^[a-z0-9_]+$/.test(cleanVal)) {
      setUsernameError('Only lowercase letters, numbers, and underscores are allowed.');
    } else if (cleanVal.length < 3) {
      setUsernameError('Username must be at least 3 characters.');
    } else {
      setUsernameError('');
    }
  };

  // Edit fields handler
  const handleExtractedChange = (field, val) => {
    setExtractedDetails(prev => ({
      ...prev,
      [field]: val
    }));
  };

  // Handle Form Submission
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (usernameError || !username) return;

    // Check college name
    const collegeLower = extractedDetails.college.toLowerCase();
    const isVSSUT = collegeLower.includes('vssut') || 
                    collegeLower.includes('veer surendra sai') || 
                    collegeLower.includes('surendra sai university');

    if (isVSSUT) {
      setStep(3);
    } else {
      // Show Non-VSSUT College Modal/Warning
      setShowWarningModal(true);
    }
  };

  // Reset page states
  const handleReset = () => {
    setStep(1);
    setSelectedFile(null);
    setFilePreview(null);
    setExtractedDetails({
      name: '',
      registrationNumber: '',
      branch: '',
      college: ''
    });
    setCustomAvatarUrl(null);
    setSelectedAvatar(AVATARS[0]);
    setUsername('');
    setDisplayName('');
  };

  return (
    <div className="min-h-screen bg-bg-dark text-on-surface font-body hero-grid flex flex-col items-center justify-start py-12 px-6 selection:bg-accent-yellow selection:text-bg-dark">
      
      {/* Back Button */}
      {step < 3 && (
        <button 
          onClick={step === 2 ? handleReset : onBack}
          className="fixed top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-xs font-semibold text-on-surface-variant hover:text-accent-yellow transition-colors cursor-pointer group z-50 bg-surface-dark/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>{step === 2 ? "Back" : "Back to Home"}</span>
        </button>
      )}

      {/* Developer API Settings Button */}
      {step === 1 && (
        <button
          onClick={() => setShowApiSettings(!showApiSettings)}
          className="fixed top-6 right-6 md:top-8 md:right-8 flex items-center gap-2 text-xs font-semibold text-on-surface-variant hover:text-accent-yellow transition-colors cursor-pointer z-50 bg-surface-dark/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg"
        >
          <Settings size={14} />
          <span>Gemini Settings</span>
        </button>
      )}

      {/* API Key Modal Panel */}
      {showApiSettings && (
        <div className="fixed inset-0 z-[100] bg-bg-dark/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm glass-card p-6 rounded-2xl border border-white/10 relative">
           
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="w-full max-w-md bg-[#0A1228]/85 border border-white/10 backdrop-blur-2xl rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.65)] overflow-hidden transition-all duration-500 mt-[50px] md:mt-24 hover:shadow-[0_25px_60px_rgba(255,186,9,0.25)]">
        <div className="p-8 md:p-10">

          {/* STEP 1: UPLOAD & GEMINI SCAN */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-left space-y-2">
                <span className="text-[10px] font-bold text-accent-yellow uppercase tracking-widest bg-accent-yellow/10 border border-accent-yellow/20 px-3 py-1 rounded-full">
                  Step 1 of 2
                </span>
                <h1 className="text-xl md:text-2xl font-heading font-bold text-on-surface pt-2">
                  Verify Student Enrollment
                </h1>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Upload your student ID card or academic registration receipt. Gemini AI will automatically extract your college credentials.
                </p>
              </div>


              {/* Upload Section */}
              {!selectedFile && (
                <div className="space-y-4">
                  <label 
                    onClick={() => idCardInputRef.current?.click()}
                    className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 hover:border-accent-yellow/40 bg-bg-dark/30 hover:bg-accent-yellow/5 rounded-2xl p-8 cursor-pointer transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-white/5 group-hover:bg-accent-yellow/10 group-hover:text-accent-yellow border border-white/5 rounded-full flex items-center justify-center text-on-surface-variant transition-colors mb-4">
                      <UploadCloud size={24} />
                    </div>
                    <span className="text-sm font-semibold text-on-surface mb-1">
                      Upload College Proof
                    </span>
                    <span className="text-[10px] text-on-surface-variant/70 text-center max-w-[240px]">
                      Drop or select a JPEG/PNG image of your ID card or registration sheet.
                    </span>
                  </label>
                  <input 
                    ref={idCardInputRef}
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                </div>
              )}

              {/* Scanning State */}
              {selectedFile && isScanning && (
                <div className="border border-accent-yellow/20 bg-accent-yellow/5 rounded-2xl p-8 flex flex-col items-center justify-center space-y-4 animate-fade-in relative overflow-hidden">
                  
                  {/* Laser Scan line animation */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-accent-yellow shadow-[0_0_12px_#FFBA09] animate-bounce w-full z-10" style={{ animationDuration: '3s' }}></div>
                  
                  <FileText className="text-accent-yellow animate-pulse" size={32} />
                  
                  <div className="text-center space-y-1">
                    <p className="text-sm font-semibold text-accent-yellow">{scanStatus}</p>
                    <p className="text-[10px] text-on-surface-variant">Analyzing image structures...</p>
                  </div>

                  <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                    <div 
                      className="bg-accent-yellow h-1 rounded-full transition-all duration-300"
                      style={{ width: `${scanProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Scan Error Message */}
              {scanError && (
                <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/15 rounded-xl px-4 py-3 flex gap-2 text-left items-center">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{scanError}</span>
                </div>
              )}

              {/* Results Preview (Once extracted) */}
              {selectedFile && !isScanning && extractedDetails.name && (
                <div className="space-y-4 animate-fade-in text-left">
                  
                  <div className="relative aspect-video w-full rounded-2xl border border-white/10 overflow-hidden bg-bg-dark/65 flex items-center justify-center mb-4">
                    <img 
                      src={filePreview} 
                      alt="College Proof Preview" 
                      className="w-full h-full object-contain opacity-60" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/90 via-transparent to-transparent"></div>
                    <span className="absolute bottom-3 left-4 text-[10px] bg-accent-yellow/10 border border-accent-yellow/20 text-accent-yellow px-2 py-0.5 rounded font-mono font-semibold">
                      Uploaded Proof Document
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-accent-yellow uppercase tracking-wider">
                    Extracted Card Metadata
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[9px] text-on-surface-variant/60 font-bold uppercase">Full Name</label>
                      <input
                        type="text"
                        value={extractedDetails.name}
                        onChange={(e) => handleExtractedChange('name', e.target.value)}
                        className="w-full bg-bg-dark/40 border border-white/10 focus:border-accent-yellow/40 rounded-xl py-2 px-3 text-xs outline-none transition-all text-on-surface"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] text-on-surface-variant/60 font-bold uppercase">Registration No.</label>
                        <input
                          type="text"
                          value={extractedDetails.registrationNumber}
                          onChange={(e) => handleExtractedChange('registrationNumber', e.target.value)}
                          className="w-full bg-bg-dark/40 border border-white/10 focus:border-accent-yellow/40 rounded-xl py-2 px-3 text-xs outline-none transition-all text-on-surface"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-on-surface-variant/60 font-bold uppercase">Academic Branch</label>
                        <input
                          type="text"
                          value={extractedDetails.branch}
                          onChange={(e) => handleExtractedChange('branch', e.target.value)}
                          className="w-full bg-bg-dark/40 border border-white/10 focus:border-accent-yellow/40 rounded-xl py-2 px-3 text-xs outline-none transition-all text-on-surface"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] text-on-surface-variant/60 font-bold uppercase">College / University</label>
                      <input
                        type="text"
                        value={extractedDetails.college}
                        onChange={(e) => handleExtractedChange('college', e.target.value)}
                        className="w-full bg-bg-dark/40 border border-white/10 focus:border-accent-yellow/40 rounded-xl py-2 px-3 text-xs outline-none transition-all text-on-surface"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button 
                      onClick={handleReset} 
                      variant="glass" 
                      className="flex-1 py-3 text-xs font-bold"
                    >
                      Reupload
                    </Button>
                    <Button 
                      onClick={() => setStep(2)} 
                      variant="primary" 
                      className="flex-1 py-3 text-xs font-bold"
                    >
                      Confirm Details
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: PROFILE SETUP */}
          {step === 2 && (
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              <div className="text-left space-y-2">
                <span className="text-[10px] font-bold text-accent-yellow uppercase tracking-widest bg-accent-yellow/10 border border-accent-yellow/20 px-3 py-1 rounded-full">
                  Step 2 of 2
                </span>
                <h1 className="text-xl md:text-2xl font-heading font-bold text-on-surface pt-2">
                  Create Campus Profile
                </h1>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Establish your unique identity on the platform. Other users will see your username and chosen avatar.
                </p>
              </div>

              {/* Verified Badge */}
              <div className="border border-white/5 bg-white/5 rounded-2xl p-4 flex items-center justify-between text-left">
                <div className="space-y-0.5">
                  <p className="text-[8px] text-accent-yellow font-bold uppercase tracking-wider flex items-center gap-1">
                    <Globe size={10} /> Verified Enrollment
                  </p>
                  <p className="text-xs font-bold text-on-surface">{extractedDetails.name}</p>
                  <p className="text-[10px] text-on-surface-variant/80">{extractedDetails.branch}</p>
                  <p className="text-[9px] text-on-surface-variant/50 italic">{extractedDetails.college}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-accent-yellow/10 text-accent-yellow flex items-center justify-center shrink-0">
                  <CheckCircle2 size={16} />
                </div>
              </div>

              {/* Username Input */}
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-bold text-accent-yellow uppercase tracking-wider block">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant/50 font-semibold font-mono">@</span>
                  <input
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    className={`w-full bg-bg-dark/40 border focus:border-accent-yellow/40 rounded-xl px-4 py-3 pl-8 text-xs outline-none transition-all placeholder:text-on-surface-variant/30 ${
                      usernameError ? 'border-red-400' : username ? 'border-emerald-500/40' : 'border-white/10'
                    }`}
                    required
                  />
                  {username && !usernameError && (
                    <CheckCircle2 size={14} className="text-emerald-400 absolute right-4 top-1/2 -translate-y-1/2" />
                  )}
                </div>
                {usernameError ? (
                  <p className="text-[10px] text-red-400 mt-1">{usernameError}</p>
                ) : (
                  <p className="text-[9px] text-on-surface-variant/50 mt-1">Only lowercase letters, numbers, and underscores are allowed.</p>
                )}
              </div>

              {/* Display Name Input */}
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-bold text-accent-yellow uppercase tracking-wider block">
                  Display Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Amit Patel"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-bg-dark/40 border border-white/10 focus:border-accent-yellow/40 rounded-xl px-4 py-3 pl-10 text-xs outline-none transition-all placeholder:text-on-surface-variant/30 text-on-surface"
                    required
                  />
                  <User size={14} className="text-on-surface-variant/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Avatar Grid with Custom Photo Upload option */}
              <div className="space-y-3 text-left">
                <label className="text-[10px] font-bold text-accent-yellow uppercase tracking-wider block">
                  Select Avatar
                </label>
                <div className="grid grid-cols-4 gap-3">
                  
                  {/* Custom Avatar Upload Button */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className={`relative aspect-square w-full rounded-full border-2 border-dashed bg-bg-dark/30 hover:bg-accent-yellow/5 flex flex-col items-center justify-center text-xs cursor-pointer transition-all duration-300 ${
                        selectedAvatar.custom
                          ? 'border-accent-yellow ring-4 ring-accent-yellow/20'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      {customAvatarUrl ? (
                        <img 
                          src={customAvatarUrl} 
                          alt="Custom Avatar" 
                          className="w-full h-full rounded-full object-cover" 
                        />
                      ) : (
                        <>
                          <Camera size={16} className="text-on-surface-variant/70 mb-1" />
                          <span className="text-[8px] text-on-surface-variant/80 font-bold text-center">Upload Photo</span>
                        </>
                      )}
                    </button>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarFileChange}
                    />
                  </div>

                  {/* Preset Avatars */}
                  {AVATARS.slice(0, 3).map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setSelectedAvatar(av)}
                      className={`relative aspect-square rounded-full bg-gradient-to-tr ${av.grad} flex items-center justify-center text-lg shadow-lg border-2 cursor-pointer transition-all hover:scale-105 duration-200 ${
                        selectedAvatar.id === av.id
                          ? 'border-accent-yellow ring-4 ring-accent-yellow/20 scale-105'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <span>{av.symbol}</span>
                      {selectedAvatar.id === av.id && (
                        <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 bg-accent-yellow text-bg-dark rounded-full flex items-center justify-center text-[9px] font-bold shadow-md">
                          <Check size={10} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Complete button */}
              <Button 
                type="submit" 
                variant="primary" 
                className="w-full py-3.5 text-xs font-bold cursor-pointer mt-4"
                disabled={!!usernameError || !username}
              >
                Complete Registration
              </Button>
            </form>
          )}

          {/* STEP 3: SUCCESS */}
          {step === 3 && (
            <div className="space-y-8 text-center py-6 animate-fade-in">
              <div className="relative w-20 h-20 mx-auto">
                <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 size={40} />
                </div>
              </div>

              <div className="space-y-3">
                <h1 className="text-2xl font-heading font-bold text-on-surface">Registration Completed!</h1>
                <p className="text-xs text-accent-yellow font-bold font-mono">Welcome to the Circle, @{username}</p>
                <p className="text-xs text-on-surface-variant leading-relaxed max-w-xs mx-auto">
                  Your student community profile has been verified successfully. You have earned your starter bonus of <span className="text-accent-yellow font-bold">+100 Honour Points</span>.
                </p>
              </div>

              {/* Profile Badge Preview */}
              <div className="border border-white/5 bg-white/5 rounded-2xl p-5 max-w-xs mx-auto flex items-center gap-4 text-left">
                {selectedAvatar.custom ? (
                  <img 
                    src={selectedAvatar.url} 
                    alt="Verified Avatar" 
                    className="w-12 h-12 rounded-full object-cover shrink-0 border border-white/10 shadow-md" 
                  />
                ) : (
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${selectedAvatar.grad} flex items-center justify-center text-xl shrink-0 shadow-md`}>
                    <span>{selectedAvatar.symbol}</span>
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold text-on-surface">{displayName}</p>
                  <p className="text-[10px] text-on-surface-variant/80 mt-0.5">{extractedDetails.branch}</p>
                  <span className="inline-block px-2 py-0.5 rounded-full bg-accent-yellow/10 border border-accent-yellow/20 text-accent-yellow text-[8px] font-bold uppercase mt-1">
                    {extractedDetails.college.toLowerCase().includes('vssut') ? 'VSSUT Student' : 'Campus Partner'}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  onClick={onBack}
                  variant="primary" 
                  className="w-full max-w-xs py-3.5 text-xs font-bold cursor-pointer hover:shadow-[0_0_35px_rgba(255,186,9,0.35)]"
                >
                  Enter Dashboard
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Non-VSSUT College Modal Warning */}
      <Modal
        isOpen={showWarningModal}
        onClose={() => setShowWarningModal(false)}
        title="College Notice"
      >
        <div className="text-left space-y-5">
          <div className="flex items-start gap-3 bg-accent-yellow/10 border border-accent-yellow/20 rounded-2xl p-4">
            <AlertCircle className="text-accent-yellow shrink-0 mt-0.5" size={18} />
            <div className="space-y-1">
              <p className="text-xs font-bold text-accent-yellow uppercase tracking-wider">Beta Phase Scaling Notice</p>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Since this is the testing version of Baithak, for now we are only scaling it in Veer Surendra Sai University of Technology. However, you will be able to comment and upvote to the discussions going on in your particular branch. We will be evolving our product to each and every college of India for which your assistance will be highly admirable. Kindly provide your college name below.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => {
                window.open('https://forms.gle/mock-baithak-feedback', '_blank');
              }}
              variant="primary"
              className="w-full py-3 text-xs font-bold text-center flex items-center justify-center gap-2"
            >
              Provide College Name (Google Form)
            </Button>
            
            <Button
              onClick={() => {
                setShowWarningModal(false);
                setStep(3); // Proceed to success & dashboard
              }}
              variant="glass"
              className="w-full py-3 text-xs font-bold text-center border-white/10 hover:bg-white/5"
            >
              Continue to Dashboard
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default RegistrationPage;
