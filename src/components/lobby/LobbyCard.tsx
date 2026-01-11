import { motion } from "framer-motion";
import { Users, Globe, Mic, ChevronRight, Trophy, Target, Shield, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LobbyWithMembers } from "@/hooks/useLobbies";
import type { Database } from "@/integrations/supabase/types";

type GameType = Database["public"]["Enums"]["game_type"];

interface LobbyCardProps {
  lobby: LobbyWithMembers;
  onJoin: (lobbyId: string) => void;
  isJoining?: boolean;
}

const skillColors: Record<string, string> = {
  beginner: "bg-green-500/20 text-green-400",
  intermediate: "bg-amber-500/20 text-amber-400",
  pro: "bg-red-500/20 text-red-400",
  any: "bg-blue-500/20 text-blue-400",
};

const gameIcons: Record<GameType, typeof Target> = {
  "cod-mobile": Target,
  "pubg-mobile": Shield,
  "free-fire": Flame,
};

const gameColors: Record<GameType, string> = {
  "cod-mobile": "text-orange-500",
  "pubg-mobile": "text-amber-500",
  "free-fire": "text-purple-500",
};

const LobbyCard = ({ lobby, onJoin, isJoining }: LobbyCardProps) => {
  const GameIcon = gameIcons[lobby.game];
  const isFull = lobby.member_count >= lobby.max_players;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="game-card p-6 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className={`${gameColors[lobby.game]}`}>
            <GameIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {lobby.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              Hosted by {lobby.host_profile?.username || "Unknown"}
            </p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${skillColors[lobby.skill_level]}`}>
          {lobby.skill_level === "any" ? "Any Level" : lobby.skill_level}
        </span>
      </div>

      {lobby.description && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {lobby.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-2 py-1 rounded-md bg-muted text-xs text-muted-foreground">
          {lobby.game_mode}
        </span>
        <span className="px-2 py-1 rounded-md bg-muted text-xs text-muted-foreground flex items-center gap-1">
          <Globe className="w-3 h-3" />
          {lobby.language}
        </span>
        {lobby.voice_chat && (
          <span className="px-2 py-1 rounded-md bg-primary/20 text-xs text-primary flex items-center gap-1">
            <Mic className="w-3 h-3" />
            Voice
          </span>
        )}
        {lobby.region && (
          <span className="px-2 py-1 rounded-md bg-muted text-xs text-muted-foreground">
            {lobby.region}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            <span className={`font-medium ${isFull ? "text-destructive" : "text-foreground"}`}>
              {lobby.member_count}
            </span>
            /{lobby.max_players} players
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-primary"
          onClick={() => onJoin(lobby.id)}
          disabled={isFull || isJoining}
        >
          {isFull ? "Full" : isJoining ? "Joining..." : "Join"}
          {!isFull && <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>
    </motion.div>
  );
};

export default LobbyCard;
