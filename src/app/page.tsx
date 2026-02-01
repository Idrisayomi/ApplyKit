"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

import LandingView from "@/views/LandingView";
import UploadCVView from "@/views/UploadCVView";
import RoleSelectionView from "@/views/RoleSelectionView";
import ProcessingView from "@/views/ProcessingView";
import ResultsView from "@/views/ResultsView";

import { ViewState, UserData } from "@/types";
import type { CVAnalysis, Job } from "@/lib/api-client";


export default function Home() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.LANDING);
  const [userData, setUserData] = useState<UserData>({
    cvFile: null,
    cvLink: "",
    role: "",
    seniority: "Mid",
  });
  
  // Store API results
  const [apiResults, setApiResults] = useState<{
    cvAnalysis: CVAnalysis | null;
    jobs: Job[];
    cvText: string;
  }>({
    cvAnalysis: null,
    jobs: [],
    cvText: '',
  });

  const handleNext = (nextView: ViewState) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentView(nextView);
  };

  const handleBack = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    switch (currentView) {
      case ViewState.UPLOAD:
        setCurrentView(ViewState.LANDING);
        break;
      case ViewState.ROLE_SELECTION:
        setCurrentView(ViewState.UPLOAD);
        break;
      case ViewState.PROCESSING:
        setCurrentView(ViewState.ROLE_SELECTION);
        break;
      case ViewState.RESULTS:
        setCurrentView(ViewState.ROLE_SELECTION);
        break;
      default:
        break;
    }
  };

  const updateUserData = (data: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...data }));
  };

  const handleProcessingComplete = (data: { cvAnalysis: CVAnalysis; jobs: Job[]; cvText: string }) => {
    setApiResults(data);
    handleNext(ViewState.RESULTS);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-50 relative overflow-x-hidden font-sans selection:bg-brand-500/30 selection:text-brand-200 flex flex-col">
      {/* Background ambience */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-900/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center py-6 shrink-0 relative z-50">
          <div className="flex items-center gap-4">
            {currentView !== ViewState.LANDING && (
              <button
                onClick={handleBack}
                className="group flex items-center p-2 -ml-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
                aria-label="Go back"
              >
                <ChevronLeft className="w-6 h-6" />
                <span className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-1 transition-all duration-300 ease-out text-sm font-medium whitespace-nowrap">
                  Back
                </span>
              </button>
            )}

            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setCurrentView(ViewState.LANDING)}
            >
              <div className="w-8 h-8 bg-gradient-to-tr from-brand-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-500/20">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
              </div>
              <span className="font-bold text-xl tracking-tight text-white hidden sm:block">
                JobPilot
              </span>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-grow flex flex-col relative z-10 py-4 sm:py-8">
          <AnimatePresence mode="wait">
            {currentView === ViewState.LANDING && (
              <motion.div key="landing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                <LandingView onStart={() => handleNext(ViewState.UPLOAD)} />
              </motion.div>
            )}

            {currentView === ViewState.UPLOAD && (
              <motion.div key="upload" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.4 }}>
                <UploadCVView onNext={() => handleNext(ViewState.ROLE_SELECTION)} updateData={updateUserData} currentData={userData} />
              </motion.div>
            )}

            {currentView === ViewState.ROLE_SELECTION && (
              <motion.div key="role" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.4 }}>
                <RoleSelectionView onNext={() => handleNext(ViewState.PROCESSING)} updateData={updateUserData} currentData={userData} />
              </motion.div>
            )}

            {currentView === ViewState.PROCESSING && (
              <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                <ProcessingView onComplete={handleProcessingComplete} userData={userData} />
              </motion.div>
            )}

            {currentView === ViewState.RESULTS && (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
                <ResultsView 
                  userData={userData} 
                  jobs={apiResults.jobs}
                  cvAnalysis={apiResults.cvAnalysis}
                  cvText={apiResults.cvText}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}