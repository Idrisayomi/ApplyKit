"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, Cpu, FileSearch, Sparkles, AlertCircle } from 'lucide-react';
import { UserData } from '@/types';
import { uploadCV, analyzeCV, searchJobs } from '@/lib/api-client';
import type { CVAnalysis, Job } from '@/lib/api-client';

interface ProcessingViewProps {
  onComplete: (data: { cvAnalysis: CVAnalysis; jobs: Job[]; cvText: string }) => void;
  userData: UserData;
}

const steps = [
  { id: 1, label: "Analyzing CV structure & keywords", icon: FileSearch },
  { id: 2, label: "Matching skills with market demand", icon: Cpu },
  { id: 3, label: "Generating job recommendations", icon: Sparkles },
];

const ProcessingView: React.FC<ProcessingViewProps> = ({ onComplete, userData }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    processUserData();
  }, []);

  const processUserData = async () => {
    try {
      let cvText = '';
      let cvAnalysis: CVAnalysis | null = null;

      // Step 1: Upload and parse CV (if file provided)
      if (userData.cvFile) {
        setCurrentStep(1);
        setProgress(10);
        
        const uploadResult = await uploadCV(userData.cvFile);
        cvText = uploadResult.data.parsedCV.rawText;
        setProgress(33);
      }

      // Step 2: Analyze CV with Gemini
      setCurrentStep(2);
      setProgress(40);
      
      cvAnalysis = await analyzeCV(cvText, userData.cvLink || undefined);
      setProgress(66);

      // Step 3: Search for matching jobs
      setCurrentStep(3);
      setProgress(75);
      
      const jobs = await searchJobs(cvAnalysis, userData.role, userData.seniority);
      setProgress(100);

      // Small delay for UX
      setTimeout(() => {
        onComplete({ cvAnalysis, jobs, cvText });
      }, 500);

    } catch (err) {
      console.error('Processing error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during processing');
      setProgress(0);
    }
  };

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Processing Failed</h3>
        <p className="text-slate-400 text-center mb-6 max-w-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-medium transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center min-h-[400px]">
      <div className="relative w-24 h-24 mb-12">
        <div className="absolute inset-0 border-4 border-slate-800 rounded-full" />
        <motion.div 
            className="absolute inset-0 border-4 border-t-brand-500 border-r-brand-500 border-b-transparent border-l-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{progress}%</span>
        </div>
        <div className="absolute -inset-4 bg-brand-500/20 blur-2xl rounded-full animate-pulse z-[-1]" />
      </div>

      <div className="w-full space-y-6">
        {steps.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          const Icon = step.icon;

          return (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-colors duration-500 ${
                isActive || isCompleted 
                  ? 'bg-slate-800/50 border-slate-700' 
                  : 'bg-transparent border-transparent opacity-40'
              }`}
            >
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-500
                ${isCompleted ? 'bg-green-500/20 text-green-400' : isActive ? 'bg-brand-500/20 text-brand-400' : 'bg-slate-800 text-slate-600'}
              `}>
                {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : isActive ? <Loader2 className="w-6 h-6 animate-spin" /> : <Icon className="w-6 h-6" />}
              </div>
              <div className="flex-1">
                <p className={`font-medium transition-colors ${isActive || isCompleted ? 'text-white' : 'text-slate-500'}`}>
                  {step.label}
                </p>
                {isActive && (
                  <motion.div 
                    layoutId="loading-bar"
                    className="h-1 bg-brand-500/50 rounded-full mt-2 w-full overflow-hidden"
                  >
                    <motion.div 
                        className="h-full bg-brand-400"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ProcessingView;