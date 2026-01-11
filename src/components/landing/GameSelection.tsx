import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight, Shield, Target, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GameSelectionProps {
  onBack: () => void;
  onGameSelect: (game: string) => void;
}

const games = [
  {
    id: "cod-mobile",
    name: "Call of Duty Mobile",
    shortName: "COD Mobile",
    icon: Target,
    color: "from-orange-500 to-red-600",
    bgGlow: "bg-orange-500/20",
    borderHover: "hover:border-orange-500/50",
    description: "Battle Royale & Multiplayer",
    players: "500M+ Downloads",
  },
  {
    id: "pubg-mobile",
    name: "PUBG Mobile",
    shortName: "PUBG Mobile",
    icon: Shield,
    color: "from-amber-400 to-yellow-600",
    bgGlow: "bg-amber-500/20",
    borderHover: "hover:border-amber-500/50",
    description: "Battle Royale",
    players: "1B+ Downloads",
  },
  {
    id: "free-fire",
    name: "Free Fire",
    shortName: "Free Fire",
    icon: Flame,
    color: "from-purple-500 to-pink-600",
    bgGlow: "bg-purple-500/20",
    borderHover: "hover:border-purple-500/50",
    description: "Fast-Paced Battle Royale",
    players: "1B+ Downloads",
  },
];

const GameSelection = ({ onBack, onGameSelect }: GameSelectionProps) => {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 p-6"
      >
        <Button
          variant="ghost"
          onClick={onBack}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pb-20">
        <div className="max-w-5xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Select Your <span className="text-gradient">Game</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Choose your battlefield and find your squad
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <button
                  onClick={() => onGameSelect(game.id)}
                  className={`game-card w-full text-left p-6 md:p-8 group ${game.borderHover}`}
                >
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 ${game.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <game.icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-gradient transition-colors">
                      {game.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {game.description}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mb-6">
                      {game.players}
                    </p>

                    {/* CTA */}
                    <div className="flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all">
                      <span>Select Game</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameSelection;
