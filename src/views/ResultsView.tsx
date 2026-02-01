"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Building2, ChevronRight, X, Copy, Check, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/Button';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { UserData } from '@/types';
import type { Job, CVAnalysis } from '@/lib/api-client';
import { generateApplication } from '@/lib/api-client';

interface ResultsViewProps {
  userData: UserData;
  jobs: Job[];
  cvAnalysis: CVAnalysis | null;
  cvText: string;
}

interface JobWithAssets extends Job {
  generatedAssets?: {
    cv: string;
    coverLetter: string;
    email: string;
  };
}

const ResultsView: React.FC<ResultsViewProps> = ({ userData, jobs, cvAnalysis, cvText }) => {
  const [selectedJob, setSelectedJob] = useState<JobWithAssets | null>(null);
  const [jobsWithAssets, setJobsWithAssets] = useState<JobWithAssets[]>(jobs);

  const handleJobClick = async (job: JobWithAssets) => {
    setSelectedJob(job);
    
    // Generate assets if not already generated
    if (!job.generatedAssets && cvAnalysis) {
      try {
        const assets = await generateApplication(
          cvText,
          {
            company: job.company,
            role: job.role,
            description: job.description,
            requirements: job.requirements,
          },
          {
            skills: cvAnalysis.skills,
            experience: cvAnalysis.experience,
          }
        );
        
        // Update job with generated assets
        const updatedJob = {
          ...job,
          generatedAssets: {
            cv: assets.cv,
            coverLetter: assets.coverLetter,
            email: assets.email,
          },
        };
        
        setSelectedJob(updatedJob);
        
        // Update jobs list
        setJobsWithAssets(prev => 
          prev.map(j => j.id === job.id ? updatedJob : j)
        );
      } catch (error) {
        console.error('Error generating application:', error);
      }
    }
  };

  return (
    <div className="h-full flex flex-col relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">Your Matches</h2>
          <p className="text-slate-400">Found {jobsWithAssets.length} high-fit opportunities.</p>
        </div>
        <div className="hidden sm:block">
            <Button variant="secondary" size="sm">Export All</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {jobsWithAssets.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleJobClick(job)}
            className="group bg-slate-900/50 border border-slate-800 hover:border-brand-500/50 rounded-2xl p-6 cursor-pointer hover:bg-slate-800/50 transition-all hover:shadow-2xl hover:shadow-brand-900/10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="text-brand-400" />
            </div>
            
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center font-bold text-lg text-white">
                {job.company[0]}
              </div>
              <div>
                <h3 className="font-bold text-lg text-white leading-tight mb-1">{job.role}</h3>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Building2 className="w-3 h-3" />
                    {job.company}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800">
                    <p className="text-xs text-slate-500 mb-1">Fit Score</p>
                    <p className="text-xl font-bold text-brand-400">{job.fitScore}%</p>
                </div>
                <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800">
                    <p className="text-xs text-slate-500 mb-1">Reply Prob</p>
                    <p className="text-xl font-bold text-emerald-400">{job.responseProb}%</p>
                </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail Modal / Panel */}
      <AnimatePresence>
        {selectedJob && (
          <JobDetailPanel 
            key="job-panel" 
            job={selectedJob} 
            onClose={() => setSelectedJob(null)}
            isGenerating={!selectedJob.generatedAssets}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

interface JobDetailPanelProps {
  job: JobWithAssets;
  onClose: () => void;
  isGenerating: boolean;
}

const JobDetailPanel: React.FC<JobDetailPanelProps> = ({ job, onClose, isGenerating }) => {
  const [activeTab, setActiveTab] = useState<'cv' | 'coverLetter' | 'email'>('cv');
  const [copied, setCopied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleCopy = () => {
    if (job.generatedAssets) {
      navigator.clipboard.writeText(job.generatedAssets[activeTab]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApplyClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmApply = () => {
    setShowConfirmModal(false);
    setIsApplying(true);
    
    // Simulate sending application
    setTimeout(() => {
        setIsApplying(false);
        setHasApplied(true);
    }, 1500);
  };

  return (
    <>
      <motion.div
        key="job-panel"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[100] flex justify-end"
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative h-full w-full md:w-[600px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-900 z-10">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{job.company}</h2>
              <p className="text-slate-400 text-sm flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> {job.role}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          {!isGenerating && (
            <div className="flex border-b border-slate-800 px-6 gap-6">
                {(['cv', 'coverLetter', 'email'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-4 text-sm font-medium border-b-2 transition-colors relative ${
                            activeTab === tab 
                                ? 'text-brand-400 border-brand-500' 
                                : 'text-slate-500 border-transparent hover:text-slate-300'
                        }`}
                    >
                        {tab === 'cv' ? 'Tailored CV' : tab === 'coverLetter' ? 'Cover Letter' : 'Application Email'}
                    </button>
                ))}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-950/30">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <Loader2 className="w-12 h-12 text-brand-400 animate-spin mb-4" />
                  <p className="text-slate-400">Generating your application materials...</p>
                </div>
              ) : (
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white text-slate-900 rounded-lg p-8 shadow-sm min-h-[500px] font-serif text-sm leading-relaxed whitespace-pre-wrap"
                >
                    {job.generatedAssets?.[activeTab]}
                </motion.div>
              )}
          </div>

          {/* Footer */}
          {!isGenerating && (
            <div className="p-6 border-t border-slate-800 bg-slate-900 flex items-center justify-between gap-4">
                <Button variant="secondary" onClick={handleCopy} className="flex-1" disabled={!job.generatedAssets}>
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? 'Copied' : 'Copy Text'}
                </Button>
                
                <Button 
                    className={`flex-1 transition-all ${hasApplied ? 'bg-emerald-600 hover:bg-emerald-600 border-emerald-600 text-white' : ''}`}
                    onClick={handleApplyClick}
                    disabled={isApplying || hasApplied || !job.generatedAssets}
                >
                    {isApplying ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : hasApplied ? (
                        <Check className="w-4 h-4 mr-2" />
                    ) : (
                        <Send className="w-4 h-4 mr-2" />
                    )}
                    {isApplying ? 'Sending...' : hasApplied ? 'Applied!' : 'Apply Now'}
                </Button>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmApply}
        title="Send Application?"
        description={`You're about to send your application to ${job.company} for the ${job.role} position. Your tailored CV, cover letter, and email will be submitted.`}
        confirmText="Send Application"
        cancelText="Review Again"
        isLoading={isApplying}
        variant="default"
      />
    </>
  );
};

export default ResultsView;