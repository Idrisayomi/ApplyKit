"use client";


import React from 'react';
import { Search, Briefcase } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { UserData, SeniorityLevel } from '../types';
import { motion } from 'framer-motion';

interface RoleSelectionViewProps {
  onNext: () => void;
  updateData: (data: Partial<UserData>) => void;
  currentData: UserData;
}

const BackgroundLines: React.FC = () => {
  const lines = [
    {
      id: 1,
      gradientId: "grad-cross-1",
      startColor: "#0ea5e9", // brand-500
      delay: 0,
      duration: 25,
      // Horizontal wave
      d: [
        "M -20 30 C 30 20 70 40 120 30",
        "M -20 30 C 30 40 70 20 120 30",
        "M -20 30 C 30 20 70 40 120 30"
      ]
    },
    {
      id: 2,
      gradientId: "grad-cross-2",
      startColor: "#a855f7", // purple-500
      delay: 1,
      duration: 20,
      // Vertical wave (Left side)
      d: [
        "M 20 -20 C 30 30 10 70 20 120",
        "M 20 -20 C 10 30 30 70 20 120",
        "M 20 -20 C 30 30 10 70 20 120"
      ]
    },
    {
      id: 3,
      gradientId: "grad-cross-3",
      startColor: "#ec4899", // pink-500
      delay: 2,
      duration: 22,
      // Vertical wave (Right side)
      d: [
        "M 80 -20 C 70 30 90 70 80 120",
        "M 80 -20 C 90 30 70 70 80 120",
        "M 80 -20 C 70 30 90 70 80 120"
      ]
    },
    {
      id: 4,
      gradientId: "grad-cross-4",
      startColor: "#6366f1", // indigo-500
      delay: 0,
      duration: 28,
      // Horizontal wave (Lower)
      d: [
        "M -20 70 C 30 80 70 60 120 70",
        "M -20 70 C 30 60 70 80 120 70",
        "M -20 70 C 30 80 70 60 120 70"
      ]
    }
  ];

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
      <svg className="w-full h-full opacity-30 blur-[1px]" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          {lines.map(line => (
            <linearGradient key={line.gradientId} id={line.gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={line.startColor} stopOpacity="0" />
              <stop offset="25%" stopColor={line.startColor} stopOpacity="0.4" />
              <stop offset="50%" stopColor={line.startColor} stopOpacity="0.8" />
              <stop offset="75%" stopColor={line.startColor} stopOpacity="0.4" />
              <stop offset="100%" stopColor={line.startColor} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {lines.map((line) => (
          <motion.path
            key={line.id}
            stroke={`url(#${line.gradientId})`}
            strokeWidth="0.4"
            fill="none"
            initial={{ d: line.d[0] }}
            animate={{ d: line.d }}
            transition={{
              duration: line.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: line.delay
            }}
          />
        ))}
      </svg>
    </div>
  );
};

const RoleSelectionView: React.FC<RoleSelectionViewProps> = ({ onNext, updateData, currentData }) => {
  const levels: SeniorityLevel[] = ['Junior', 'Mid', 'Senior', 'Lead'];

  const canContinue = currentData.role.length > 2;

  return (
    <div className="relative w-full flex flex-col items-center justify-center py-12 md:py-0 min-h-full">
      {/* Background Animation */}
      <BackgroundLines />

      <div className="relative z-10 w-full max-w-lg mx-auto space-y-8 px-4">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Target Role</h2>
          <p className="text-slate-400">Tell us what you are looking for.</p>
        </div>

        <div className="space-y-6">
          <Input
            label="Job Title"
            placeholder="e.g. Frontend Engineer"
            icon={<Search className="w-5 h-5" />}
            value={currentData.role}
            onChange={(e) => updateData({ role: e.target.value })}
            autoFocus
            className="bg-slate-900/50 backdrop-blur-sm"
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-400 ml-1">Seniority Level</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {levels.map((level) => {
                const isSelected = currentData.seniority === level;
                return (
                  <button
                    key={level}
                    onClick={() => updateData({ seniority: level })}
                    className={`
                      relative px-3 py-3 rounded-xl text-sm font-medium transition-all border
                      ${isSelected 
                        ? 'bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-900/40' 
                        : 'bg-slate-900/40 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white backdrop-blur-sm'
                      }
                    `}
                  >
                    {level}
                    {isSelected && (
                      <motion.div
                        layoutId="outline"
                        className="absolute inset-0 rounded-xl border-2 border-brand-400 pointer-events-none"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800 flex gap-4 backdrop-blur-sm shadow-xl">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="space-y-1">
                  <p className="text-sm font-medium text-white">Pro Tip</p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                      We'll scan for remote-first opportunities and companies with high response rates based on your seniority preference.
                  </p>
              </div>
          </div>
        </div>

        <div className="pt-4">
          <Button fullWidth size="lg" onClick={onNext} disabled={!canContinue}>
            Generate Applications
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionView;