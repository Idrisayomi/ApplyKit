"use client";


import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/Button';

interface LandingViewProps {
  onStart: () => void;
}

const BackgroundLines: React.FC = () => {
  const lines = [
    {
      id: 1,
      // Cyan line, top area
      gradientId: "grad-cyan",
      startColor: "#0ea5e9",
      delay: 1,
      duration: 15,
      d: [
        "M -20 30 C 20 10 60 50 120 30",
        "M -20 30 C 20 50 60 10 120 30", 
        "M -20 30 C 20 10 60 50 120 30"
      ]
    },
    {
      id: 2,
      // Indigo line, middle area
      gradientId: "grad-indigo",
      startColor: "#6366f1",
      delay: 2,
      duration: 18,
      d: [
        "M -20 50 C 30 60 70 40 120 50",
        "M -20 50 C 30 40 70 60 120 50",
        "M -20 50 C 30 60 70 40 120 50"
      ]
    },
    {
      id: 3,
      // Sky/Blue line, bottom area
      gradientId: "grad-sky",
      startColor: "#38bdf8",
      delay: 5,
      duration: 20,
      d: [
        "M -20 70 C 40 50 80 90 120 70",
        "M -20 70 C 40 90 80 50 120 70",
        "M -20 70 C 40 50 80 90 120 70"
      ]
    },
    {
      id: 4,
      // Purple crossing line
      gradientId: "grad-purple",
      startColor: "#a855f7",
      delay: 1,
      duration: 25,
      d: [
        "M -20 80 C 30 70 70 30 120 20",
        "M -20 80 C 50 90 50 10 120 20",
        "M -20 80 C 30 70 70 30 120 20"
      ]
    }
  ];

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
      <svg className="w-full h-full opacity-40 blur-[1px]" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          {lines.map(line => (
            <linearGradient key={line.gradientId} id={line.gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
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

const LandingView: React.FC<LandingViewProps> = ({ onStart }) => {
  return (
    <div className="relative w-full flex flex-col items-center justify-center py-12 md:py-8 min-h-full">
      {/* Background Animation */}
      <BackgroundLines />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto space-y-12 px-6 w-full">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="inline-block px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 text-brand-400 text-sm font-medium mb-4 backdrop-blur-sm shadow-lg shadow-brand-900/10">
            ✨ AI-Powered Job Applications
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-400 leading-tight pb-2 drop-shadow-sm">
            Land your dream job <br />
            <span className="text-brand-500 drop-shadow-md">without the grind.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 font-medium italic max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Upload your CV once. We tailor it, write the cover letter, and draft the email for every single role you apply to.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full"
        >
          <Button size="lg" onClick={onStart} className="group min-w-[200px] font-semibold tracking-wide">
            Start Applying
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="ghost" size="lg" onClick={() => {}} className="text-slate-400 hover:text-white font-medium">
            View Sample
          </Button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 p-8 border border-slate-800 bg-slate-950/60 rounded-2xl w-full backdrop-blur-md shadow-2xl shadow-black/50"
        >
          {[
            { title: "ATS Optimized", desc: "Beat the robots with tailored keywords." },
            { title: "Smart Matching", desc: "Find roles that actually fit your skills." },
            { title: "Human Tone", desc: "Professional, confident, and never robotic." }
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left">
              <div className="flex items-center gap-2 text-white font-semibold tracking-wide">
                <CheckCircle2 className="w-5 h-5 text-brand-500 shrink-0" />
                {feature.title}
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default LandingView;