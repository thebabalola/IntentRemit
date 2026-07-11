"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Target, 
  Split, 
  Lock, 
  CheckCircle2,
  Rocket
} from "lucide-react";

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
  highlightId?: string;
}

const steps: Step[] = [
  {
    title: "Welcome to IntentRemit",
    description: "The world's first programmable remittance protocol on Celo. Let's show you how to send money with purpose.",
    icon: <Rocket className="text-celoyellow w-8 h-8" />,
  },
  {
    title: "Define Your Goal",
    description: "Start by selecting what the money is for. Whether it's School Fees or Business, purpose defines the intent.",
    icon: <Target className="text-celoyellow w-8 h-8" />,
    highlightId: "goal-selection",
  },
  {
    title: "AI Smart Split",
    description: "Our AI suggests the best split between immediate cash and long-term growth. Just click 'Apply Split' to use it.",
    icon: <Sparkles className="text-celoyellow w-8 h-8" />,
    highlightId: "ai-suggestion",
  },
  {
    title: "Programmable Split",
    description: "Use the slider to decide how much goes to the recipient now, and how much is locked for their future.",
    icon: <Split className="text-celoyellow w-8 h-8" />,
    highlightId: "split-slider",
  },
  {
    title: "The Growth Vault",
    description: "Locked funds earn yield automatically. You're not just sending money; you're building a future.",
    icon: <Lock className="text-celoyellow w-8 h-8" />,
    highlightId: "growth-vault",
  },
  {
    title: "You're Ready!",
    description: "Connect your wallet and create your first purposeful remittance intent today.",
    icon: <CheckCircle2 className="text-celoyellow w-8 h-8" />,
  }
];

export default function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("hasSeenIntentRemitTour");
    if (!hasSeenTour) {
      setIsOpen(true);
    }
  }, []);

  const closeTour = () => {
    localStorage.setItem("hasSeenIntentRemitTour", "true");
    setIsOpen(false);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      closeTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          {/* Backdrop: Lighter and less blurry to keep the landing page visible */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeTour}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-[#0b0a05] border border-celoyellow/20 rounded-[32px] overflow-hidden shadow-[0_0_50px_rgba(252,255,82,0.1)]"
          >
            {/* 3D Geometric Background inside Modal */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <img src="/assets/bg_geometric.png" alt="Geometric Background" className="w-full h-full object-cover blur-[4px]" />
            </div>
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                className="h-full bg-celoyellow"
              />
            </div>

            <button 
              onClick={closeTour}
              className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="p-10 pt-14 text-center">
              <motion.div 
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="w-20 h-20 bg-celoyellow/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-celoyellow/20">
                  {steps[currentStep].icon}
                </div>
                
                <h3 className="text-3xl font-black text-white tracking-tight">
                  {steps[currentStep].title}
                </h3>
                
                <p className="text-gray-400 text-lg leading-relaxed font-medium">
                  {steps[currentStep].description}
                </p>
              </motion.div>

              <div className="mt-12 flex items-center justify-between">
                <div className="flex gap-1.5">
                  {steps.map((_, i) => (
                    <div 
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === currentStep ? "w-6 bg-celoyellow" : "w-1.5 bg-white/10"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex gap-3">
                  {currentStep > 0 && (
                    <button 
                      onClick={prevStep}
                      className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all"
                    >
                      <ChevronLeft size={24} />
                    </button>
                  )}
                  <button 
                    onClick={nextStep}
                    className="px-6 py-3 bg-celoyellow text-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                  >
                    {currentStep === steps.length - 1 ? "Get Started" : "Next"}
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
