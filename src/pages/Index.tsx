import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import GameSelection from "@/components/landing/GameSelection";
import { useNavigate } from "react-router-dom";

type Step = "hero" | "game-selection";

const Index = () => {
  const [step, setStep] = useState<Step>("hero");
  const navigate = useNavigate();

  const handleYesClick = () => {
    setStep("game-selection");
  };

  const handleBack = () => {
    setStep("hero");
  };

  const handleGameSelect = (gameId: string) => {
    // For now, we'll store the selected game and navigate to verification
    // Once we implement auth, this will redirect to profile verification
    console.log("Selected game:", gameId);
    navigate(`/verify?game=${gameId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        <AnimatePresence mode="wait">
          {step === "hero" && (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <HeroSection onYesClick={handleYesClick} />
            </motion.div>
          )}
          
          {step === "game-selection" && (
            <motion.div
              key="game-selection"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <GameSelection onBack={handleBack} onGameSelect={handleGameSelect} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {step === "hero" && <Footer />}
    </div>
  );
};

export default Index;
