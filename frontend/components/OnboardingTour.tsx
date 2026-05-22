"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";

const steps = [
  {
    title: "Welcome to IntentRemit",
    description: "Send programmable remittances on Celo. Attach rules and conditions to the money you send, ensuring it's used exactly as intended.",
    icon: "👋",
  },
  {
    title: "Set Your Goal & AI Split",
    description: "Select the purpose of your transfer (e.g., School Fees). Our AI will suggest the perfect split between immediate cash and locked funds for long-term growth.",
    icon: "🎯",
  },
  {
    title: "Immediate vs Locked",
    description: "Use the slider to customize how much the recipient can spend right now versus how much is securely held in our high-yield Growth Vault.",
    icon: "⚖️",
  },
  {
    title: "Enforce Conditions",
    description: "Want to release funds on a specific date? Or require multiple approvals before unlock? Set your custom lock conditions with ease.",
    icon: "🔒",
  },
  {
    title: "Track Everything",
    description: "Monitor the progress of your transfers, check unlock countdowns, and claim funds directly from your personalized Dashboard.",
    icon: "📊",
  }
];

export default function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if user has seen the tour
    const hasSeenTour = localStorage.getItem("intentremit_tour_seen");
    if (!hasSeenTour) {
      // Small delay so it doesn't jarringly appear before page render
      const timer = setTimeout(() => setIsOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("intentremit_tour_seen", "true");
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/5">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
              Product Tour ({currentStep + 1} of {steps.length})
            </span>
            <button
              onClick={handleClose}
              className="p-1 rounded-full hover:bg-white/10 text-white/50 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="flex justify-center mb-6 text-6xl">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
              >
                {steps[currentStep].icon}
              </motion.div>
            </div>

            <motion.div
              key={`text-${currentStep}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center h-32"
            >
              <h2 className="text-2xl font-bold mb-3 text-white">
                {steps[currentStep].title}
              </h2>
              <p className="text-white/60 leading-relaxed text-sm">
                {steps[currentStep].description}
              </p>
            </motion.div>
          </div>

          {/* Footer Navigation */}
          <div className="flex items-center justify-between p-4 bg-white/[0.02] border-t border-white/5">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`p-2 rounded-lg flex items-center transition-colors ${
                currentStep === 0 
                  ? 'text-white/20 cursor-not-allowed' 
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>

            {/* Progress Dots */}
            <div className="flex gap-2">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentStep ? 'bg-[#22c55e] w-4' : 'bg-white/20 w-2'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextStep}
              className="px-4 py-2 bg-[#22c55e] hover:bg-[#1ea950] text-black font-semibold rounded-lg flex items-center gap-1 transition-colors"
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              {currentStep < steps.length - 1 && <ChevronRightIcon className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
