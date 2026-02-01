"use client";


import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, FileText, Link as LinkIcon, X } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { UserData } from '../types';

interface UploadCVViewProps {
  onNext: () => void;
  updateData: (data: Partial<UserData>) => void;
  currentData: UserData;
}

const BackgroundLines: React.FC = () => {
  const lines = [
    {
      id: 1,
      gradientId: "grad-up-1",
      startColor: "#0ea5e9", // brand-500
      delay: 0,
      duration: 15,
      // Vertical flow: Bottom to Top
      d: [
        "M 20 120 C 40 80 0 40 20 -20",
        "M 20 120 C 0 80 40 40 20 -20",
        "M 20 120 C 40 80 0 40 20 -20"
      ]
    },
    {
      id: 2,
      gradientId: "grad-up-2",
      startColor: "#6366f1", // indigo-500
      delay: 2,
      duration: 18,
      d: [
        "M 80 120 C 60 80 100 40 80 -20",
        "M 80 120 C 100 80 60 40 80 -20",
        "M 80 120 C 60 80 100 40 80 -20"
      ]
    },
    {
      id: 3,
      gradientId: "grad-up-3",
      startColor: "#8b5cf6", // violet-500
      delay: 1,
      duration: 20,
      d: [
        "M 50 120 C 70 90 30 30 50 -20",
        "M 50 120 C 30 90 70 30 50 -20",
        "M 50 120 C 70 90 30 30 50 -20"
      ]
    }
  ];

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
      <svg className="w-full h-full opacity-30 blur-[1px]" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          {lines.map(line => (
            <linearGradient key={line.gradientId} id={line.gradientId} x1="0%" y1="100%" x2="0%" y2="0%">
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

const UploadCVView: React.FC<UploadCVViewProps> = ({ onNext, updateData, currentData }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type === 'application/pdf') {
      updateData({ cvFile: file });
    } else {
      alert("Please upload a PDF file.");
    }
  };

  const removeFile = () => {
    updateData({ cvFile: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const canContinue = currentData.cvFile !== null || currentData.cvLink.length > 5;

  return (
    <div className="relative w-full flex flex-col items-center justify-center py-12 md:py-0 min-h-full">
      {/* Background Animation */}
      <BackgroundLines />

      <div className="relative z-10 w-full max-w-lg mx-auto space-y-8 px-4">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Upload your CV</h2>
          <p className="text-slate-400">We use this to personalize your applications.</p>
        </div>

        {/* Drag & Drop Area */}
        {!currentData.cvFile ? (
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative cursor-pointer border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-4 transition-all backdrop-blur-sm
              ${isDragging ? 'border-brand-500 bg-brand-500/10' : 'border-slate-700 hover:border-slate-500 bg-slate-900/40 hover:bg-slate-800/50'}
            `}
          >
            <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center border border-slate-700 shadow-xl">
              <UploadCloud className="w-8 h-8 text-brand-400" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-white">Click or drag PDF here</p>
              <p className="text-sm text-slate-500 mt-1">Maximum file size 10MB</p>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} 
              accept="application/pdf"
              className="hidden" 
            />
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center justify-between backdrop-blur-md"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-white">{currentData.cvFile.name}</p>
                <p className="text-xs text-slate-500">{(currentData.cvFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button onClick={removeFile} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        <div className="flex items-center gap-4 text-slate-600">
          <div className="h-px bg-slate-800 flex-1" />
          <span className="text-xs uppercase font-semibold">Or import via link</span>
          <div className="h-px bg-slate-800 flex-1" />
        </div>

        <Input
          icon={<LinkIcon className="w-5 h-5" />}
          placeholder="https://linkedin.com/in/..."
          value={currentData.cvLink}
          onChange={(e) => updateData({ cvLink: e.target.value })}
          label="CV / LinkedIn URL"
          className="bg-slate-900/50 backdrop-blur-sm"
        />

        <div className="pt-4">
          <Button fullWidth size="lg" onClick={onNext} disabled={!canContinue}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadCVView;