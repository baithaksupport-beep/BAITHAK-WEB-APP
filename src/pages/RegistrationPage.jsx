import React, { useState, useEffect } from 'react';
import { ArrowLeft, UploadCloud, Search, CheckCircle2, Loader2, User, FileText, Sparkles, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';

// Mock Student Database for Lookup Verification
const VSSUT_STUDENTS = {
  "2502100012": { name: "Soumya Patnaik", branch: "Metallurgical and Materials Engineering" },
  "2502100010": { name: "Akshit Bindhani", branch: "Metallurgical and Materials Engineering" },
  "2202090003": { name: "Sai Swarup Mohanty", branch: "Mechanical Engineering" },
  "2202090004": { name: "Pragyan Paramita Jena", branch: "Electrical Engineering" }
};

const RANDOM_NAMES = [
  "Soumya Patnaik", "Akshit Bindhani", "Siddharth Gudla", 
  "", "Lipika Priyadarshini", "Ashutosh Tripathy",
  "Siddharth Sekhar Panda", "Jyotirmayee Barik"
];

const RANDOM_BRANCHES = [
  "Computer Science & Engineering", "Information Technology", 
  "Electronics & TC Engineering", "Electrical Engineering", 
  "Mechanical Engineering", "Civil Engineering"
];

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
  const [step, setStep] = useState(1); // 1: Verification, 2: Profile Customization, 3: Success
  const [verifyMethod, setVerifyMethod] = useState('card'); // 'card' | 'number'
  
  // Verification states
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [regNumber, setRegNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  
  // Student details fetched
  const [studentDetails, setStudentDetails] = useState(null);
  
  // Profile settings
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [usernameError, setUsernameError] = useState('');

  // Handle registration card file upload simulation
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setVerifyError('');

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Transition to OCR scanning state
          setIsUploading(false);
          setIsScanning(true);
          
          setTimeout(() => {
            setIsScanning(false);
            // Auto fetch mock student info
            setStudentDetails({
              name: "Sourav Kumar Pradhan",
              branch: "Computer Science & Engineering"
            });
            setStep(2);
          }, 1500); // 1.5s scan time
          
          return 100;
        }
        return prev + 10;
      });
    }, 120);
  };

  // Handle registration number lookup verification
  const handleLookupVerify = (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(regNumber)) {
      setVerifyError('Registration number must be exactly 10 digits.');
      return;
    }

    setVerifyError('');
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      
      let fetchedDetails = VSSUT_STUDENTS[regNumber];
      
      // If not in predefined mock DB, generate a realistic student dynamically
      if (!fetchedDetails) {
        // Hash based on regNumber to keep it deterministic for the session
        const nameIndex = parseInt(regNumber) % RANDOM_NAMES.length;
        const branchIndex = parseInt(regNumber) % RANDOM_BRANCHES.length;
        fetchedDetails = {
          name: RANDOM_NAMES[nameIndex],
          branch: RANDOM_BRANCHES[branchIndex]
        };
      }
      
      setStudentDetails(fetchedDetails);
    }, 1200);
  };

  // Pre-fill display name once student details are fetched
  useEffect(() => {
    if (studentDetails) {
      setDisplayName(studentDetails.name);
      // Auto-suggest a username from their name (lowercase, no spaces, clean)
      const cleanName = studentDetails.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_+|_+$/g, '');
      setUsername(cleanName);
    }
  }, [studentDetails]);

  // Validate Username input on change
  const handleUsernameChange = (val) => {
    // Strip '@' if typed
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

  const handleProfileComplete = (e) => {
    e.preventDefault();
    if (usernameError || !username) {
      return;
    }
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-bg-dark text-on-surface font-body hero-grid flex flex-col items-center justify-start py-12 px-6 selection:bg-accent-yellow selection:text-bg-dark">
      {/* Back Button (Only for steps 1 and 2) */}
      {step < 3 && (
        <button 
          onClick={step === 2 ? () => { setStep(1); setStudentDetails(null); } : onBack}
          className="fixed top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-xs font-semibold text-on-surface-variant hover:text-accent-yellow transition-colors cursor-pointer group z-50 bg-surface-dark/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform " />
          <span>{step === 2 ? "Back" : "Back to Home"}</span>
        </button>
      )}
           
          

      {/* Main Glass Card Container */}
      <div className="w-full max-w-md bg-[#0A1228]/85 border border-white/10 backdrop-blur-2xl rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.65)] overflow-hidden transition-all duration-500 mt-[50px] md:mt-30 hover:shadow-[0_25px_60px_rgba(255,186,9,0.35)]">

        <div className="p-8 md:p-10 ">
          
          {/* STEP 1: ENROLLMENT VERIFICATION */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-left space-y-2">
                <h1 className="text-xl md:text-xl font-heading font-bold text-on-surface">Verify your enrollment in Veer Surendra Sai University of Technology</h1>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Baithak is exclusive to Veer Surendra Sai University of Technology students. Choose a method below to verify your enrollment.
                </p>
              </div>

              {/* Method Switch Tabs */}
              <div className="flex p-1 bg-bg-dark/60 rounded-xl border border-white/5">
                <button
                  type="button"
                  onClick={() => { setVerifyMethod('card'); setVerifyError(''); }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    verifyMethod === 'card'
                      ? 'bg-accent-yellow text-bg-dark font-bold shadow-md shadow-accent-yellow/10'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Registration Card
                </button>
                <button
                  type="button"
                  onClick={() => { setVerifyMethod('number'); setVerifyError(''); }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    verifyMethod === 'number'
                      ? 'bg-accent-yellow text-bg-dark font-bold shadow-md shadow-accent-yellow/10'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Registration Number
                </button>
              </div>

              {/* Option A: Registration Card Upload */}
              {verifyMethod === 'card' && (
                <div className="space-y-6 mt-6">
                  {!isUploading && !isScanning ? (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 hover:border-accent-yellow/40 bg-bg-dark/30 hover:bg-accent-yellow/5 rounded-2xl p-8 cursor-pointer transition-all duration-300 group">
                      <div className="w-12 h-12 bg-white/5 group-hover:bg-accent-yellow/10 group-hover:text-accent-yellow border border-white/5 rounded-full flex items-center justify-center text-on-surface-variant transition-colors mb-4">
                        <UploadCloud size={24} />
                      </div>
                      <span className="text-sm font-semibold text-on-surface mb-1">Upload Registration Card</span>
                      <span className="text-[10px] text-on-surface-variant/70 text-center max-w-[240px]">
                        Select or drag a photo/PDF of your VSSUT registration card.
                      </span>
                      <input 
                        type="file" 
                        accept="image/*,application/pdf" 
                        className="hidden" 
                        onChange={handleFileUpload}
                      />
                    </label>
                  ) : isUploading ? (
                    /* Mock Upload Progress State */
                    <div className="border border-white/10 bg-bg-dark/30 rounded-2xl p-8 flex flex-col items-center justify-center space-y-4">
                      <Loader2 className="animate-spin text-accent-yellow" size={28} />
                      <div className="text-center">
                        <p className="text-sm font-semibold text-on-surface">Uploading enrollment card...</p>
                        <p className="text-[10px] text-on-surface-variant mt-1">{uploadProgress}% completed</p>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-accent-yellow h-1.5 rounded-full transition-all duration-150" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    /* OCR Scanning Simulation State */
                    <div className="border border-accent-yellow/20 bg-accent-yellow/5 rounded-2xl p-8 flex flex-col items-center justify-center space-y-4 animate-pulse">
                      <FileText className="text-accent-yellow animate-bounce" size={28} />
                      <div className="text-center">
                        <p className="text-sm font-semibold text-accent-yellow">Scanning Registration Card...</p>
                        <p className="text-[10px] text-on-surface-variant mt-1">Extracting candidate name & academic branch</p>
                      </div>
                    </div>
                  )}

                  <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-start gap-3 text-left">
                    <AlertCircle size={14} className="text-accent-yellow shrink-0 mt-0.5" />
                    <p className="text-[10px] leading-relaxed text-on-surface-variant">
                      OCR scanner automatically parses details from your card. Make sure the text on the registration card is clear and legible.
                    </p>
                  </div>
                </div>
              )}

              {/* Option B: Registration Number Lookup */}
              {verifyMethod === 'number' && (
                <form onSubmit={handleLookupVerify} className="space-y-6 mt-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-accent-yellow uppercase tracking-wider block text-left">
                      Enter your Registration Number
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        maxLength={10}
                        placeholder="e.g. 2202090001"
                        value={regNumber}
                        onChange={(e) => setRegNumber(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-bg-dark/40 border border-white/10 focus:border-accent-yellow/40 rounded-xl py-3.5 px-4 text-sm outline-none transition-all placeholder:text-on-surface-variant/40"
                        required
                        disabled={isVerifying}
                      />
                    </div>
                  </div>

                  {verifyError && (
                    <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/10 rounded-xl px-4 py-3 flex gap-2 text-left items-center">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>{verifyError}</span>
                    </div>
                  )}

                  {!studentDetails ? (
                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="w-full py-3.5 text-xs font-bold cursor-pointer"
                      disabled={isVerifying || regNumber.length !== 10}
                    >
                      {isVerifying ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="animate-spin" size={14} /> Verifying registration number...
                        </span>
                      ) : (
                        "Verify Enrollment"
                      )}
                    </Button>
                  ) : (
                    /* Display Fetched Student Details */
                    <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-2xl p-5 text-left space-y-4 animate-fade-in">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                          <CheckCircle2 size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Candidate Found</p>
                          <p className="text-sm font-semibold text-on-surface mt-0.5">{studentDetails.name}</p>
                        </div>
                      </div>

                      <div className="h-[1px] bg-white/5"></div>

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-[10px] text-on-surface-variant/50 uppercase font-bold">Branch</span>
                          <p className="font-semibold text-on-surface-variant/90 mt-0.5">{studentDetails.branch}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-on-surface-variant/50 uppercase font-bold">College</span>
                          <p className="font-semibold text-on-surface-variant/90 mt-0.5">VSSUT, Burla</p>
                        </div>
                      </div>

                      <Button 
                        type="button"
                        onClick={() => setStep(2)}
                        variant="primary" 
                        className="w-full py-3 text-xs font-bold cursor-pointer mt-2"
                      >
                        Proceed to Profile Setup
                      </Button>
                    </div>
                  )}

                  
                </form>
              )}
            </div>
          )}

          {/* STEP 2: PROFILE CUSTOMIZATION */}
          {step === 2 && (
            <form onSubmit={handleProfileComplete} className="space-y-6">
              <div className="text-left space-y-2">
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-on-surface">Setup your Profile</h1>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Customize your identity inside Baithak. Choose a unique username and an avatar representing you.
                </p>
              </div>

              {/* Readonly verified banner */}
              <div className="border border-white/5 bg-white/5 rounded-2xl p-4 flex items-center justify-between text-left">
                <div>
                  <p className="text-[9px] text-accent-yellow font-bold uppercase tracking-wider">Verified Identity</p>
                  <p className="text-sm font-semibold text-on-surface mt-0.5">{studentDetails?.name}</p>
                  <p className="text-[10px] text-on-surface-variant/80 mt-0.5">{studentDetails?.branch}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-accent-yellow/10 text-accent-yellow flex items-center justify-center shrink-0">
                  <CheckCircle2 size={18} />
                </div>
              </div>

              {/* Username Input */}
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-bold text-accent-yellow uppercase tracking-wider block">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant/60 font-semibold font-mono">@</span>
                  <input
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    className={`w-full bg-bg-dark/40 border focus:border-accent-yellow/40 rounded-xl px-4 py-3.5 pl-8 text-sm outline-none transition-all placeholder:text-on-surface-variant/40 ${
                      usernameError ? 'border-red-400' : username ? 'border-emerald-500/40' : 'border-white/10'
                    }`}
                    required
                  />
                  {username && !usernameError && (
                    <CheckCircle2 size={16} className="text-emerald-400 absolute right-4 top-1/2 -translate-y-1/2" />
                  )}
                </div>
                {usernameError ? (
                  <p className="text-[10px] text-red-400 mt-1">{usernameError}</p>
                ) : (
                  <p className="text-[9px] text-on-surface-variant/50 mt-1">This will be your unique campus handle.</p>
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
                    className="w-full bg-bg-dark/40 border border-white/10 focus:border-accent-yellow/40 rounded-xl px-4 py-3.5 pl-10 text-sm outline-none transition-all placeholder:text-on-surface-variant/40"
                    required
                  />
                  <User size={16} className="text-on-surface-variant/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Avatar Selector */}
              <div className="space-y-3 text-left">
                <label className="text-[10px] font-bold text-accent-yellow uppercase tracking-wider block">
                  Select Campus Avatar
                </label>
                <div className="grid grid-cols-6 gap-3">
                  {AVATARS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setSelectedAvatar(av)}
                      className={`relative aspect-square rounded-full bg-gradient-to-tr ${av.grad} flex items-center justify-center text-lg md:text-xl shadow-lg border-2 cursor-pointer transition-all hover:scale-105 duration-200 ${
                        selectedAvatar.id === av.id
                          ? 'border-accent-yellow ring-4 ring-accent-yellow/20 scale-105'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <span>{av.symbol}</span>
                      {selectedAvatar.id === av.id && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent-yellow text-bg-dark rounded-full flex items-center justify-center text-[9px] font-bold shadow-md">
                          ✓
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
              {/* Confetti simulation icon */}
              <div className="relative w-20 h-20 mx-auto">
              
                <div className="w-20 h-20 bg-green-500 border border-green-500 text-white rounded-full flex items-center justify-center  select-none ">
                  <CheckCircle2 size={40} />
                </div>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl font-heading font-bold text-on-surface">Registration Completed!</h1>
                <p className="text-sm text-accent-yellow font-bold font-mono">Welcome to the Circle, @{username}</p>
                <p className="text-xs text-on-surface-variant leading-relaxed max-w-sm mx-auto">
                  Your VSSUT community profile is verified. You have earned your starter bonus of <span className="text-accent-yellow font-bold">+100 Honour Points</span>.
                </p>
              </div>

              {/* Student Summary Card */}
              <div className="border border-white/5 bg-white/5 rounded-2xl p-5 max-w-xs mx-auto flex items-center gap-4 text-left">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${selectedAvatar.grad} flex items-center justify-center text-xl shrink-0 shadow-md`}>
                  <span>{selectedAvatar.symbol}</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-on-surface">{displayName}</p>
                  <p className="text-[10px] text-on-surface-variant/80 mt-0.5">{studentDetails?.branch}</p>
                  <span className="inline-block px-2 py-0.5 rounded-full bg-accent-yellow/10 border border-accent-yellow/20 text-accent-yellow text-[8px] font-bold uppercase mt-1">
                    VSSUT Student
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
    </div>
  );
};

export default RegistrationPage;
