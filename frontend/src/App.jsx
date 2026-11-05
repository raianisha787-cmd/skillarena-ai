import React, { useState, useEffect } from 'react';
import { 
  FALLBACK_USER, 
  FALLBACK_ASSESSMENTS, 
  FALLBACK_AI_DIAGNOSIS, 
  FALLBACK_CAMPUS_ANALYTICS,
  fetchAssessments,
  fetchAIDiagnosis,
  fetchCampusAnalytics
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'arena' | 'test_runner' | 'ai_roadmap' | 'campus_analytics' | 'deployment'
  const [user, setUser] = useState(FALLBACK_USER);
  const [userRole, setUserRole] = useState('STUDENT'); // 'STUDENT' | 'TPO'
  const [targetRole, setTargetRole] = useState("Full-Stack Software Engineer");
  const [assessments, setAssessments] = useState(FALLBACK_ASSESSMENTS);
  const [aiReport, setAiReport] = useState(FALLBACK_AI_DIAGNOSIS);
  const [campusData, setCampusData] = useState(FALLBACK_CAMPUS_ANALYTICS);

  // Backend connection status
  const [backendStatus, setBackendStatus] = useState('CHECKING'); // 'CONNECTED' | 'OFFLINE_FALLBACK' | 'CHECKING'

  // Active Test Runner state
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(900);
  const [testResult, setTestResult] = useState(null);
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Search / filter assessments
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('ALL');

  useEffect(() => {
    // Check backend health
    checkBackendHealth();
    // Load assessments & AI diagnosis
    fetchAssessments().then(data => setAssessments(data));
    fetchAIDiagnosis(user.id, targetRole).then(data => setAiReport(data));
    fetchCampusAnalytics().then(data => setCampusData(data));
  }, [targetRole]);

  const checkBackendHealth = async () => {
    try {
      const aiRes = await fetch('http://localhost:8000/api/ai/health', { signal: AbortSignal.timeout(1500) });
      if (aiRes.ok) {
        setBackendStatus('CONNECTED');
        return;
      }
    } catch (e) {}

    try {
      const res = await fetch('http://localhost:8080/api/assessments', { signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        setBackendStatus('CONNECTED');
        return;
      }
    } catch (e) {}

    setBackendStatus('OFFLINE_FALLBACK');
  };

  // Test countdown timer
  useEffect(() => {
    let timer;
    if (activeTab === 'test_runner' && !isTestSubmitted && timeLeftSeconds > 0) {
      timer = setInterval(() => {
        setTimeLeftSeconds(prev => {
          if (prev <= 1) {
            handleCompleteAssessment();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeTab, isTestSubmitted, timeLeftSeconds]);

  const handleStartAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setTimeLeftSeconds((assessment.durationMinutes || 15) * 60);
    setTestResult(null);
    setIsTestSubmitted(false);
    setShowReviewModal(false);
    setActiveTab('test_runner');
  };

  const handleSelectOption = (questionId, optionId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleCompleteAssessment = () => {
    if (!selectedAssessment) return;
    
    let correct = 0;
    const questions = selectedAssessment.questions || [];
    questions.forEach(q => {
      const chosen = selectedAnswers[q.id];
      const correctOpt = q.options.find(opt => opt.id === q.correctOptionId || opt.isCorrect);
      if (correctOpt && chosen === correctOpt.id) {
        correct++;
      }
    });

    const total = questions.length;
    const percentage = Math.round((correct / (total || 1)) * 100);
    const passed = percentage >= (selectedAssessment.passingPercentage || 60);
    const campusPercentile = Math.min(99.0, Math.round(percentage * 0.95 + 4));

    const result = {
      assessmentTitle: selectedAssessment.title,
      totalQuestions: total,
      correctCount: correct,
      scoreObtained: correct * 10,
      totalPossible: total * 10,
      percentage: percentage,
      campusPercentile: campusPercentile,
      passed: passed
    };

    setTestResult(result);
    setIsTestSubmitted(true);

    // Update student readiness score dynamically
    setUser(prev => ({
      ...prev,
      currentReadinessScore: Math.round((prev.currentReadinessScore * 0.6 + percentage * 0.4) * 10) / 10,
      campusPercentile: campusPercentile
    }));
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handlePrintReport = () => {
    window.print();
  };

  const filteredAssessments = assessments.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (test.description && test.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDiff = filterDifficulty === 'ALL' || test.difficulty === filterDifficulty;
    return matchesSearch && matchesDiff;
  });

  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-100 flex flex-col font-sans">
      {/* TOP NOTIFICATION / CLOUD STATUS BAR */}
      <div className="bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-slate-900 border-b border-blue-500/20 px-4 py-2 text-xs flex flex-wrap items-center justify-between text-blue-200">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-white">SkillArena AI Cloud Architecture:</span>
          <span className="hidden sm:inline text-blue-300">Vercel (React) ⚡ Render/Railway (Spring Boot + Python AI) ⚡ Cloud MySQL</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700/60 font-mono text-[11px]">
            <span className={`w-2 h-2 rounded-full ${backendStatus === 'CONNECTED' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
            <span>{backendStatus === 'CONNECTED' ? 'API: Live Connected' : 'Mode: Self-Contained Demo'}</span>
          </div>
          
          <button 
            onClick={() => setActiveTab('deployment')}
            className="text-white hover:text-blue-300 underline font-medium cursor-pointer"
          >
            Cloud Deployment Guide &rarr;
          </button>
        </div>
      </div>

      {/* PRIMARY HEADER */}
      <header className="border-b border-slate-800 bg-[#0F1420]/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-extrabold text-lg">
              SA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  SkillArena AI
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  CAMPUS v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Intelligent Skill Assessment & Personalized Learning</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'arena', label: 'Assessment Arena', icon: '⚡' },
              { id: 'ai_roadmap', label: 'AI Diagnostic & Roadmap', icon: '🎯' },
              { id: 'campus_analytics', label: 'Campus TPO Insights', icon: '🏛️' },
              { id: 'deployment', label: 'Cloud Architecture', icon: '🌐' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  activeTab === item.id 
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-inner' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Role Switcher & User Profile Pill */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-800/80 p-1 rounded-lg border border-slate-700/60 flex text-xs">
              <button
                onClick={() => { setUserRole('STUDENT'); setActiveTab('dashboard'); }}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  userRole === 'STUDENT' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Student View
              </button>
              <button
                onClick={() => { setUserRole('TPO'); setActiveTab('campus_analytics'); }}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  userRole === 'TPO' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                TPO / Dean View
              </button>
            </div>

            <div className="hidden lg:flex items-center gap-2.5 pl-3 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                {userRole === 'STUDENT' ? 'AR' : 'PN'}
              </div>
              <div className="text-left text-xs">
                <div className="font-semibold text-slate-200">
                  {userRole === 'STUDENT' ? 'Anisha Rai' : 'Dr. Priya Nair'}
                </div>
                <div className="text-[10px] text-slate-500">
                  {userRole === 'STUDENT' ? 'CSE &bull; 2026 Batch' : 'TPO Placement Head'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE NAV STRIP */}
      <div className="md:hidden flex overflow-x-auto border-b border-slate-800 bg-slate-900/60 px-2 py-2 gap-2 text-xs">
        <button onClick={() => setActiveTab('dashboard')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}>📊 Dashboard</button>
        <button onClick={() => setActiveTab('arena')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'arena' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}>⚡ Arena</button>
        <button onClick={() => setActiveTab('ai_roadmap')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'ai_roadmap' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}>🎯 AI Roadmap</button>
        <button onClick={() => setActiveTab('campus_analytics')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'campus_analytics' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}>🏛️ Campus TPO</button>
        <button onClick={() => setActiveTab('deployment')} className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'deployment' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}>🌐 Cloud Setup</button>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ========================================================================= */}
        {/* TAB 1: STUDENT DASHBOARD */}
        {/* ========================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Hero Welcome & Target Role Selector */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900/30 via-slate-900 to-indigo-950/40 border border-slate-800 p-6 sm:p-8">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold mb-3">
                    Campus Placement Season 2026 Ready
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Welcome back, {user.name} 👋
                  </h1>
                  <p className="text-sm text-slate-400 mt-1 max-w-xl">
                    Your SkillArena AI cognitive profile compares your assessment scores with Tier-1 engineering benchmarks and synthesizes your weekly remedial curriculum.
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setActiveTab('arena')}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-600/20"
                    >
                      <span>⚡ Take Campus Assessment</span>
                    </button>
                    <button
                      onClick={handlePrintReport}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <span>🖨️ Print Readiness Report</span>
                    </button>
                  </div>
                </div>
                
                <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 min-w-[260px]">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Target Industry Track
                  </label>
                  <select 
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
                  >
                    <option value="Full-Stack Software Engineer">Full-Stack Software Engineer</option>
                    <option value="AI/ML & Data Engineer">AI/ML & Data Engineer</option>
                    <option value="Cloud & DevOps Engineer">Cloud & DevOps Engineer</option>
                  </select>
                  <div className="text-[11px] text-blue-400 mt-2 flex items-center justify-between">
                    <span>Active Benchmark:</span>
                    <span className="font-semibold text-slate-300">FAANG/Tier-1 Standards</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metric Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 hover:border-blue-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Placement Readiness</span>
                  <span className="text-lg">🎯</span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white">{user.currentReadinessScore}%</span>
                  <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">+4.2%</span>
                </div>
                <div className="mt-3 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-1000" style={{ width: `${user.currentReadinessScore}%` }}></div>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">Target threshold: 75% for Tier-1 recruitment</p>
              </div>

              <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 hover:border-indigo-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Campus Percentile</span>
                  <span className="text-lg">🏆</span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-indigo-400">{user.campusPercentile}th</span>
                  <span className="text-xs font-medium text-slate-400">percentile</span>
                </div>
                <p className="text-xs text-slate-400 mt-3">
                  Ranked in top <span className="text-white font-semibold">{Math.max(1, 100 - Math.round(user.campusPercentile))}%</span> of CSE 2026 cohort (395 peers)
                </p>
              </div>

              <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 hover:border-emerald-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Interview Clearance Odds</span>
                  <span className="text-lg">📈</span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-emerald-400">{aiReport.placement_probability_pct}%</span>
                  <span className="text-xs font-semibold text-emerald-500 uppercase">High Prob</span>
                </div>
                <p className="text-xs text-slate-400 mt-3">
                  Predicted via Logistic Regression model trained on campus placement trends
                </p>
              </div>

              <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 hover:border-amber-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Active Sprint Gap</span>
                  <span className="text-lg">⚠️</span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-xl font-bold text-amber-400 truncate">
                    {aiReport.critical_gaps[0] || 'DevOps & Docker'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Critical deficit: <span className="text-rose-400 font-semibold">-22 pts</span> from target standard
                </p>
                <button 
                  onClick={() => setActiveTab('ai_roadmap')}
                  className="mt-3 w-full py-1 text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded font-medium transition-colors cursor-pointer"
                >
                  Start Remedial Module &rarr;
                </button>
              </div>
            </div>

            {/* Diagnostic Radar / Domain Breakdown Table & Available Challenges */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Domain Skill Matrix */}
              <div className="lg:col-span-2 bg-[#111827] border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-bold text-white">Skill Domain Diagnostic Breakdown</h2>
                    <p className="text-xs text-slate-400">Comparing your proficiency vs required {targetRole} benchmark</p>
                  </div>
                  <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700">
                    6 Domains Evaluated
                  </span>
                </div>

                <div className="space-y-4">
                  {aiReport.domain_breakdown.map((item, idx) => (
                    <div key={idx} className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            item.urgency === 'CRITICAL' ? 'bg-rose-500' : (item.urgency === 'MODERATE' ? 'bg-amber-500' : 'bg-emerald-500')
                          }`}></span>
                          <span className="text-sm font-semibold text-slate-200">{item.domain}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-slate-400">
                            Current: <strong className="text-white">{item.current_score}%</strong> / Target: {item.benchmark_target}%
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            item.urgency === 'CRITICAL' 
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                              : (item.urgency === 'MODERATE' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30')
                          }`}>
                            {item.urgency === 'LOW' ? 'STRENGTH' : item.urgency}
                          </span>
                        </div>
                      </div>

                      {/* Dual Progress Bar */}
                      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden relative">
                        <div 
                          className={`h-full rounded-full transition-all duration-700 ${
                            item.urgency === 'CRITICAL' ? 'bg-rose-500' : (item.urgency === 'MODERATE' ? 'bg-amber-500' : 'bg-blue-500')
                          }`} 
                          style={{ width: `${item.current_score}%` }}
                        ></div>
                        {/* Target marker line */}
                        <div 
                          className="absolute top-0 bottom-0 w-0.5 bg-white/70"
                          style={{ left: `${item.benchmark_target}%` }}
                          title={`Target Benchmark: ${item.benchmark_target}%`}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions & Live Campus Arena Card */}
              <div className="space-y-6">
                <div className="bg-gradient-to-b from-[#161F33] to-[#111827] border border-blue-500/30 rounded-2xl p-6 shadow-xl shadow-blue-900/10">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-blue-400 tracking-wider mb-2">
                    <span>⚡ Campus Challenge Arena</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Take New Skill Assessment</h3>
                  <p className="text-xs text-slate-300 mb-5 leading-relaxed">
                    Test your Java, Spring Boot, MySQL, and algorithm skills under live timed campus placement test conditions.
                  </p>

                  <div className="space-y-3">
                    {assessments.slice(0, 2).map(test => (
                      <div key={test.id} className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl hover:border-blue-500/50 transition-colors">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-200 mb-1">
                          <span className="truncate max-w-[180px]">{test.title}</span>
                          <span className="text-blue-400">{test.durationMinutes} mins</span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center justify-between mt-2">
                          <span>{test.totalMarks} Marks &bull; {test.difficulty}</span>
                          <button
                            onClick={() => handleStartAssessment(test)}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-3 py-1 rounded text-xs transition-colors cursor-pointer"
                          >
                            Launch &rarr;
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setActiveTab('arena')}
                    className="w-full mt-4 text-center text-xs font-medium text-blue-400 hover:text-blue-300 py-1.5 border border-dashed border-blue-500/40 rounded-lg hover:border-blue-400 transition-colors cursor-pointer"
                  >
                    View All Campus Challenges &rarr;
                  </button>
                </div>

                {/* AI Personalized Roadmap Preview Card */}
                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-white">4-Week Remedial Path</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      AI GENERATED
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    Prioritizing your largest deficit: <strong className="text-slate-200">Containerization & Docker</strong>
                  </p>

                  <div className="border-l-2 border-purple-500 pl-3 space-y-3">
                    {aiReport.personalized_roadmap.slice(0, 2).map((m, i) => (
                      <div key={i}>
                        <div className="text-xs font-bold text-slate-200">{m.milestone_title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{m.focus_objectives[0]}</div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setActiveTab('ai_roadmap')}
                    className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Explore Complete Roadmap &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ASSESSMENT ARENA */}
        {/* ========================================================================= */}
        {activeTab === 'arena' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <h1 className="text-2xl font-bold text-white">Campus Assessment Arena</h1>
                <p className="text-sm text-slate-400 mt-1">
                  Proctored benchmark assessments designed to evaluate software engineering, data systems, and algorithmic mastery.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  placeholder="Search assessments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                >
                  <option value="ALL">All Difficulties</option>
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredAssessments.map(test => (
                <div key={test.id} className="bg-[#111827] border border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 transition-all shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                        {test.domain || 'Software Engineering'}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        ⏱️ {test.durationMinutes} mins
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">{test.title}</h3>
                    <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                      {test.description}
                    </p>

                    <div className="grid grid-cols-3 gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 text-center mb-6">
                      <div>
                        <div className="text-[10px] text-slate-500 font-semibold uppercase">Difficulty</div>
                        <div className="text-xs font-bold text-slate-200 mt-0.5">{test.difficulty}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 font-semibold uppercase">Total Marks</div>
                        <div className="text-xs font-bold text-slate-200 mt-0.5">{test.totalMarks} pts</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 font-semibold uppercase">Pass Threshold</div>
                        <div className="text-xs font-bold text-emerald-400 mt-0.5">{test.passingPercentage}%</div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartAssessment(test)}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Start Timed Assessment</span>
                    <span>&rarr;</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: LIVE TEST RUNNER */}
        {/* ========================================================================= */}
        {activeTab === 'test_runner' && selectedAssessment && (
          <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
            {/* Header with Live Countdown */}
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Campus Challenge</span>
                <h2 className="text-xl font-bold text-white">{selectedAssessment.title}</h2>
              </div>
              
              <div className="flex items-center gap-4">
                <div className={`px-4 py-2 rounded-xl font-mono text-lg font-bold border flex items-center gap-2 ${
                  timeLeftSeconds < 120 
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse' 
                    : 'bg-slate-800 text-blue-400 border-slate-700'
                }`}>
                  <span>⏱️</span>
                  <span>{formatTimer(timeLeftSeconds)}</span>
                </div>

                {!isTestSubmitted && (
                  <button
                    onClick={handleCompleteAssessment}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer shadow-lg shadow-emerald-600/20"
                  >
                    Submit Assessment
                  </button>
                )}
              </div>
            </div>

            {/* Test Content: Question & Options */}
            {!isTestSubmitted ? (
              <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
                {/* Question progress pill */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase">
                    Question {currentQuestionIndex + 1} of {selectedAssessment.questions.length}
                  </span>
                  <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">
                    Points: {selectedAssessment.questions[currentQuestionIndex].points || 10} pts
                  </span>
                </div>

                {/* Question Text */}
                <h3 className="text-lg sm:text-xl font-semibold text-white leading-relaxed">
                  {selectedAssessment.questions[currentQuestionIndex].questionText}
                </h3>

                {/* Optional Code Snippet */}
                {selectedAssessment.questions[currentQuestionIndex].codeSnippet && (
                  <pre className="bg-slate-950 p-4 rounded-xl font-mono text-sm text-blue-300 border border-slate-800 overflow-x-auto">
                    <code>{selectedAssessment.questions[currentQuestionIndex].codeSnippet}</code>
                  </pre>
                )}

                {/* Options List */}
                <div className="space-y-3 pt-2">
                  {selectedAssessment.questions[currentQuestionIndex].options.map((option) => {
                    const isSelected = selectedAnswers[selectedAssessment.questions[currentQuestionIndex].id] === option.id;
                    return (
                      <div
                        key={option.id}
                        onClick={() => handleSelectOption(selectedAssessment.questions[currentQuestionIndex].id, option.id)}
                        className={`p-4 rounded-xl border text-sm transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                            isSelected ? 'border-blue-400 bg-blue-500 text-white font-bold' : 'border-slate-600'
                          }`}>
                            {isSelected && '✓'}
                          </div>
                          <span>{option.optionText}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                  <button
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    &larr; Previous
                  </button>

                  <div className="flex gap-2">
                    {selectedAssessment.questions.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                          idx === currentQuestionIndex
                            ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                            : (selectedAnswers[selectedAssessment.questions[idx].id]
                                ? 'bg-slate-700 text-emerald-400'
                                : 'bg-slate-800 text-slate-400')
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>

                  {currentQuestionIndex < selectedAssessment.questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Next &rarr;
                    </button>
                  ) : (
                    <button
                      onClick={handleCompleteAssessment}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Finish Test &rarr;
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Test Evaluation Result Modal / Card */
              <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-3xl mx-auto">
                  {testResult.passed ? '🎉' : '📊'}
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white">Assessment Evaluated!</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Your answers were graded and analyzed by SkillArena AI's evaluation engine.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto bg-slate-900 p-5 rounded-2xl border border-slate-800">
                  <div>
                    <div className="text-[11px] text-slate-500 uppercase font-semibold">Score</div>
                    <div className="text-2xl font-extrabold text-white mt-1">{testResult.percentage}%</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 uppercase font-semibold">Correct</div>
                    <div className="text-2xl font-extrabold text-emerald-400 mt-1">{testResult.correctCount}/{testResult.totalQuestions}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 uppercase font-semibold">Percentile</div>
                    <div className="text-2xl font-extrabold text-indigo-400 mt-1">{testResult.campusPercentile}th</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 uppercase font-semibold">Status</div>
                    <div className={`text-sm font-extrabold mt-2 px-2 py-0.5 rounded ${
                      testResult.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {testResult.passed ? 'PASSED' : 'NEEDS REVISION'}
                    </div>
                  </div>
                </div>

                {/* Review Answers Toggle */}
                {showReviewModal && (
                  <div className="mt-6 text-left border-t border-slate-800 pt-6 space-y-4 max-w-2xl mx-auto">
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <span>📖</span>
                      <span>Detailed Answer Review & Architecture Rationales</span>
                    </h4>

                    {selectedAssessment.questions.map((q, qIdx) => {
                      const userChoice = selectedAnswers[q.id];
                      const correctOpt = q.options.find(opt => opt.id === q.correctOptionId || opt.isCorrect);
                      const isCorrect = correctOpt && userChoice === correctOpt.id;

                      return (
                        <div key={q.id} className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-2">
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span className="text-slate-400">Q{qIdx + 1}: {q.subSkill}</span>
                            <span className={isCorrect ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                              {isCorrect ? '✓ Correct (+10 pts)' : '✗ Incorrect (0 pts)'}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-white">{q.questionText}</p>
                          <div className="text-xs text-slate-300">
                            <strong>Correct Answer:</strong> {correctOpt ? correctOpt.optionText : 'Refer to lesson notes'}
                          </div>
                          <div className="text-xs text-blue-300 bg-blue-950/40 p-2.5 rounded-lg border border-blue-900/40">
                            💡 <strong>Evaluation Note:</strong> {q.explanation || 'Tested against industry hiring standard benchmarks.'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <button
                    onClick={() => setShowReviewModal(!showReviewModal)}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
                  >
                    {showReviewModal ? 'Hide Answers' : 'Review Questions & Rationales'}
                  </button>

                  <button
                    onClick={() => setActiveTab('ai_roadmap')}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer shadow-lg shadow-blue-600/20"
                  >
                    View AI Remedial Roadmap &rarr;
                  </button>

                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl text-sm transition-colors cursor-pointer border border-slate-800"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: AI DIAGNOSTIC & PERSONALIZED LEARNING ROADMAP */}
        {/* ========================================================================= */}
        {activeTab === 'ai_roadmap' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header info */}
            <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold mb-2">
                  Python AI Engine &bull; Adaptive Synthesis
                </div>
                <h1 className="text-2xl font-bold text-white">AI Skill Gap Analysis & 4-Week Roadmap</h1>
                <p className="text-sm text-slate-400 mt-1">
                  Tailored specifically for <strong className="text-blue-400">{targetRole}</strong> placement criteria.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-2 rounded-xl">
                <span className="text-xs text-slate-400 pl-2">Role Model:</span>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
                >
                  <option value="Full-Stack Software Engineer">Full-Stack Software Engineer</option>
                  <option value="AI/ML & Data Engineer">AI/ML & Data Engineer</option>
                  <option value="Cloud & DevOps Engineer">Cloud & DevOps Engineer</option>
                </select>
              </div>
            </div>

            {/* AI Summary Banner */}
            <div className="bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900 border border-purple-500/30 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Diagnostic Summary</h3>
                  <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                    Based on your latest campus attempts, you demonstrate strong foundations in <strong className="text-emerald-400">Data Structures & SQL Optimization</strong>, but have a <strong className="text-rose-400">22-point deficit in Cloud Containerization & DevOps</strong>. This 4-week roadmap focuses on closing your highest-impact skill gap.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center px-4 py-3 bg-slate-900/80 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Overall Readiness</div>
                    <div className="text-2xl font-extrabold text-blue-400 mt-0.5">{aiReport.overall_readiness}%</div>
                  </div>
                  <div className="text-center px-4 py-3 bg-slate-900/80 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Campus Percentile</div>
                    <div className="text-2xl font-extrabold text-purple-400 mt-0.5">{aiReport.campus_percentile}th</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4-Week Milestone Timeline */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>🗓️</span>
                <span>Personalized Remedial Curriculum</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {aiReport.personalized_roadmap.map((milestone) => (
                  <div 
                    key={milestone.week}
                    className={`bg-[#111827] border rounded-2xl p-6 transition-all relative overflow-hidden ${
                      milestone.status === 'NEXT_UP' 
                        ? 'border-blue-500/60 shadow-lg shadow-blue-500/10' 
                        : 'border-slate-800'
                    }`}
                  >
                    {milestone.status === 'NEXT_UP' && (
                      <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl">
                        Active Milestone
                      </div>
                    )}

                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-blue-400">
                        W{milestone.week}
                      </span>
                      <div>
                        <div className="text-xs font-semibold text-slate-400 uppercase">Target Domain: {milestone.target_domain}</div>
                        <h3 className="text-base font-bold text-white">{milestone.milestone_title}</h3>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="text-xs font-semibold text-slate-300">Action Objectives:</div>
                      <ul className="space-y-1.5 text-xs text-slate-400">
                        {milestone.focus_objectives.map((obj, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-blue-400 mt-0.5">•</span>
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <div className="text-slate-500">
                        Estimated: <strong className="text-slate-300">{milestone.estimated_hours} hrs</strong>
                      </div>
                      <div className="text-rose-400 font-mono font-semibold">
                        Gap Deficit: {milestone.skill_gap_deficit}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: CAMPUS TPO & FACULTY ANALYTICS */}
        {/* ========================================================================= */}
        {activeTab === 'campus_analytics' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold mb-2">
                  Training & Placement Officer (TPO) Executive View
                </div>
                <h1 className="text-2xl font-bold text-white">{campusData.campusName}</h1>
                <p className="text-sm text-slate-400 mt-1">
                  Real-time cohort skill benchmarking, recruitment readiness index, and department comparison.
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400">Eligible Batch Size:</span>
                <div className="text-xl font-bold text-white">{campusData.totalStudents} Candidates</div>
              </div>
            </div>

            {/* Campus TPO KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5">
                <div className="text-xs font-semibold text-slate-400 uppercase">Average Campus Readiness</div>
                <div className="text-3xl font-extrabold text-white mt-2">{campusData.averageReadinessScore}%</div>
                <p className="text-xs text-slate-500 mt-2">Aggregate across all registered engineering streams</p>
              </div>

              <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5">
                <div className="text-xs font-semibold text-slate-400 uppercase">Placement Ready Ratio</div>
                <div className="text-3xl font-extrabold text-emerald-400 mt-2">{campusData.placementReadinessRate}%</div>
                <p className="text-xs text-slate-500 mt-2">Students meeting or exceeding Tier-1 passing bar</p>
              </div>

              <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5">
                <div className="text-xs font-semibold text-slate-400 uppercase">Top Recruiting Role Demand</div>
                <div className="text-2xl font-extrabold text-blue-400 mt-2">Full-Stack & Cloud</div>
                <p className="text-xs text-slate-500 mt-2">Highest number of student assessment enrollments</p>
              </div>
            </div>

            {/* Department Comparison Table */}
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Department-wise Skill Benchmarks</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="text-xs text-slate-400 uppercase bg-slate-900/80 border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Department Name</th>
                      <th className="py-3 px-4">Enrolled Students</th>
                      <th className="py-3 px-4">Avg Readiness Score</th>
                      <th className="py-3 px-4">Primary Strength</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {campusData.departments.map((dept, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40">
                        <td className="py-3.5 px-4 font-semibold text-white">{dept.departmentName}</td>
                        <td className="py-3.5 px-4 font-mono">{dept.studentCount}</td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-blue-400">{dept.averageScore}%</span>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-400">{dept.topStrength}</td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            ON TRACK
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Student Placement Leaderboard */}
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Campus Top Performers Leaderboard</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {campusData.topPerformers.map((student, idx) => (
                  <div key={idx} className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-slate-400">Rank #{idx + 1}</span>
                      <span className="text-purple-400 font-semibold">{student.percentile}th %ile</span>
                    </div>
                    <div className="font-bold text-white text-base">{student.name}</div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">{student.department}</div>
                    <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                      <span className="text-slate-500">Readiness:</span>
                      <span className="text-emerald-400 font-bold">{student.readinessScore}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: CLOUD DEPLOYMENT BLUEPRINT & ARCHITECTURE */}
        {/* ========================================================================= */}
        {activeTab === 'deployment' && (
          <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
            <div className="border-b border-slate-800 pb-5">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold mb-2">
                Production-Ready &bull; Live URL Deployment
              </div>
              <h1 className="text-2xl font-bold text-white">How to Deploy SkillArena AI to the Cloud</h1>
              <p className="text-sm text-slate-400 mt-1">
                Zero localhost requirement for teacher evaluations — run on any phone, laptop, or projector.
              </p>
            </div>

            {/* Architecture Diagram Card */}
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-4">Cloud Architecture Overview</h3>
              <div className="bg-slate-950 p-4 rounded-xl font-mono text-xs text-blue-300 leading-relaxed border border-slate-800">
                <pre>{`[🌐 Public Internet]
        │
        ▼
[React Frontend (Vercel)] ──> https://skillarena-ai.vercel.app
        │ (REST API & JWT)
        ▼
[Spring Boot 3 + Java 21 (Render / Railway)] ──> https://skillarena-api.onrender.com
        │                                 │
        ▼                                 ▼
[Cloud MySQL (Aiven/Supabase)]   [Python AI Engine (FastAPI on Render)]`}</pre>
              </div>
            </div>

            {/* 3 Simple Deployment Steps */}
            <div className="space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">1</span>
                  <h4 className="text-base font-bold text-white">Frontend to Vercel (1-Click)</h4>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Deploy the React SPA to Vercel in seconds. It provides free SSL, CDN speed, and a clean public URL.
                </p>
                <div className="bg-slate-950 p-3 rounded-lg font-mono text-xs text-slate-300 border border-slate-800">
                  <code>cd frontend && npm run build && vercel --prod</code>
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">2</span>
                  <h4 className="text-base font-bold text-white">Spring Boot Backend to Render or Railway</h4>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Render and Railway automatically build and execute Spring Boot using the included Dockerfile and pom.xml.
                </p>
                <div className="bg-slate-950 p-3 rounded-lg font-mono text-xs text-slate-300 border border-slate-800">
                  <code>git push origin main &rarr; Render auto-builds Dockerfile &rarr; Exposes live HTTPS API</code>
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">3</span>
                  <h4 className="text-base font-bold text-white">Free Cloud MySQL Database</h4>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Create a free managed MySQL database on Aiven.io, TiDB Cloud, or Supabase, and apply <code className="text-blue-300">schema.sql</code>.
                </p>
                <div className="bg-slate-950 p-3 rounded-lg font-mono text-xs text-slate-300 border border-slate-800">
                  <code>SPRING_DATASOURCE_URL=jdbc:mysql://cloud-host:3306/skillarena_db</code>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 bg-[#0B0F19] py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <strong>SkillArena AI</strong> &bull; Intelligent Campus Skill Assessment & Personalized Learning Platform
          </div>
          <div>
            EdTech / E-Learning Capstone &bull; React.js &bull; Spring Boot &bull; Java &bull; Python AI &bull; MySQL
          </div>
        </div>
      </footer>
    </div>
  );
}
