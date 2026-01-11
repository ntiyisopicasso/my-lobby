import { useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, CheckCircle2, AlertCircle, Loader2, Target, Shield, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/layout/Navbar";

const gameInfo: Record<string, { name: string; icon: React.ElementType; color: string; placeholder: string }> = {
  "cod-mobile": {
    name: "Call of Duty Mobile",
    icon: Target,
    color: "from-orange-500 to-red-600",
    placeholder: "Enter your Activision ID",
  },
  "pubg-mobile": {
    name: "PUBG Mobile",
    icon: Shield,
    color: "from-amber-400 to-yellow-600",
    placeholder: "Enter your PUBG username",
  },
  "free-fire": {
    name: "Free Fire",
    icon: Flame,
    color: "from-purple-500 to-pink-600",
    placeholder: "Enter your UID (e.g., 123456789)",
  },
};

const freeFireRegions = [
  { value: "IND", label: "India" },
  { value: "BR", label: "Brazil" },
  { value: "SG", label: "Singapore" },
  { value: "ID", label: "Indonesia" },
  { value: "TH", label: "Thailand" },
  { value: "VN", label: "Vietnam" },
  { value: "TW", label: "Taiwan" },
  { value: "ME", label: "Middle East" },
  { value: "PK", label: "Pakistan" },
  { value: "BD", label: "Bangladesh" },
];

type VerificationStatus = "idle" | "loading" | "success" | "error";

interface PlayerData {
  username: string;
  level: number;
  rank: string;
  avatar?: string;
}

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const gameId = searchParams.get("game") || "cod-mobile";
  const game = gameInfo[gameId] || gameInfo["cod-mobile"];
  const GameIcon = game.icon;

  const [gamertag, setGamertag] = useState("");
  const [region, setRegion] = useState("");
  const [status, setStatus] = useState<VerificationStatus>("idle");
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    if (!gamertag.trim()) {
      setError("Please enter your gamer tag");
      return;
    }

    if (gameId === "free-fire" && !region) {
      setError("Please select your region");
      return;
    }

    setStatus("loading");
    setError("");

    // Simulate API call - will be replaced with real API integration
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock success response
    setPlayerData({
      username: gamertag,
      level: Math.floor(Math.random() * 100) + 50,
      rank: ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Master", "Legendary"][
        Math.floor(Math.random() * 7)
      ],
    });
    setStatus("success");
  };

  const handleContinue = () => {
    // Store verified player data and navigate to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="max-w-lg mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Game Selection
            </Button>
          </motion.div>

          {/* Game Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center`}>
              <GameIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg font-semibold text-foreground">{game.name}</span>
          </motion.div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8"
          >
            <h1 className="text-2xl font-bold text-center mb-2">Verify Your Profile</h1>
            <p className="text-muted-foreground text-center mb-8">
              Enter your in-game credentials to verify your account
            </p>

            {status !== "success" ? (
              <div className="space-y-6">
                {/* Gamer Tag Input */}
                <div className="space-y-2">
                  <Label htmlFor="gamertag">Gamer Tag / UID</Label>
                  <Input
                    id="gamertag"
                    placeholder={game.placeholder}
                    value={gamertag}
                    onChange={(e) => setGamertag(e.target.value)}
                    className="h-12"
                  />
                </div>

                {/* Region Select for Free Fire */}
                {gameId === "free-fire" && (
                  <div className="space-y-2">
                    <Label>Region</Label>
                    <Select value={region} onValueChange={setRegion}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select your region" />
                      </SelectTrigger>
                      <SelectContent>
                        {freeFireRegions.map((r) => (
                          <SelectItem key={r.value} value={r.value}>
                            {r.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-destructive text-sm"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </motion.div>
                )}

                {/* Verify Button */}
                <Button
                  variant="hero"
                  size="lg"
                  className="w-full"
                  onClick={handleVerify}
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Verify Profile
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                {/* Success Icon */}
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-primary" />
                </div>

                <h2 className="text-xl font-bold mb-2 text-foreground">Profile Verified!</h2>
                <p className="text-muted-foreground mb-6">Your account has been successfully verified</p>

                {/* Player Stats */}
                {playerData && (
                  <div className="glass-card p-4 mb-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-sm text-muted-foreground">Username</div>
                        <div className="font-semibold text-foreground truncate">{playerData.username}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Level</div>
                        <div className="font-semibold text-primary">{playerData.level}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Rank</div>
                        <div className="font-semibold text-secondary">{playerData.rank}</div>
                      </div>
                    </div>
                  </div>
                )}

                <Button variant="hero" size="lg" className="w-full" onClick={handleContinue}>
                  Continue to Dashboard
                </Button>
              </motion.div>
            )}
          </motion.div>

          {/* Help Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center text-sm text-muted-foreground mt-6"
          >
            Having trouble? Make sure your profile is public and try again.
          </motion.p>
        </div>
      </main>
    </div>
  );
};

export default Verify;
