import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Gamepad2, Users, Zap } from "lucide-react";

interface HeroSectionProps {
  onYesClick: () => void;
}

const HeroSection = ({ onYesClick }: HeroSectionProps) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: "1s" }} />

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-10 md:left-20"
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="glass-card p-4 opacity-60">
          <Gamepad2 className="w-8 h-8 text-primary" />
        </div>
      </motion.div>
      
      <motion.div
        className="absolute top-40 right-10 md:right-32"
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="glass-card p-4 opacity-60">
          <Users className="w-8 h-8 text-secondary" />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-20 md:left-40"
        animate={{ y: [-5, 15, -5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="glass-card p-4 opacity-60">
          <Zap className="w-8 h-8 text-primary" />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8"
          >
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">Squad Finder for Mobile Gamers</span>
          </motion.div>

          {/* Logo/Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight"
          >
            <span className="text-foreground">My</span>
            <span className="text-gradient">Lobby</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto"
          >
            Find your perfect squad. Dominate together. The ultimate lobby finder for 
            <span className="text-primary"> COD Mobile</span>,
            <span className="text-secondary"> PUBG Mobile</span>, and
            <span className="text-primary"> Free Fire</span>.
          </motion.p>

          {/* Question */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground">
              Are you a mobile gamer?
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="hero" 
                size="xl"
                onClick={onYesClick}
                className="min-w-[160px]"
              >
                Yes, I am
              </Button>
              <Button 
                variant="heroOutline" 
                size="xl"
                className="min-w-[160px]"
                onClick={() => window.open('https://play.google.com', '_blank')}
              >
                Not yet
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16"
          >
            {[
              { value: "50K+", label: "Active Players" },
              { value: "10K+", label: "Lobbies Created" },
              { value: "3", label: "Games Supported" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};

export default HeroSection;
