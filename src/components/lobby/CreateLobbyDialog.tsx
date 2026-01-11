import { useState } from "react";
import { motion } from "framer-motion";
import { X, Plus, Mic, MicOff, Lock, Globe, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateLobby } from "@/hooks/useLobbies";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type GameType = Database["public"]["Enums"]["game_type"];
type SkillLevel = Database["public"]["Enums"]["skill_level"];
type GenderPreference = Database["public"]["Enums"]["gender_preference"];

interface CreateLobbyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const gameModes: Record<GameType, string[]> = {
  "cod-mobile": ["Battle Royale", "Multiplayer", "Ranked", "Custom Room"],
  "pubg-mobile": ["Classic", "Arcade", "Arena", "Ranked", "Custom Room"],
  "free-fire": ["Battle Royale", "Clash Squad", "Ranked", "Custom Room"],
};

const languages = [
  "English",
  "Hindi",
  "Spanish",
  "Portuguese",
  "Arabic",
  "Indonesian",
  "Thai",
  "Vietnamese",
  "Filipino",
  "Russian",
];

const CreateLobbyDialog = ({ open, onOpenChange }: CreateLobbyDialogProps) => {
  const { toast } = useToast();
  const createLobby = useCreateLobby();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    game: "cod-mobile" as GameType,
    game_mode: "Battle Royale",
    max_players: 4,
    skill_level: "any" as SkillLevel,
    language: "English",
    region: "",
    gender_preference: "any" as GenderPreference,
    voice_chat: false,
    password: "",
    is_private: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a lobby title",
        variant: "destructive",
      });
      return;
    }

    try {
      await createLobby.mutateAsync({
        title: formData.title,
        description: formData.description || null,
        game: formData.game,
        game_mode: formData.game_mode,
        max_players: formData.max_players,
        skill_level: formData.skill_level,
        language: formData.language,
        region: formData.region || null,
        gender_preference: formData.gender_preference,
        voice_chat: formData.voice_chat,
        password: formData.is_private ? formData.password : null,
        is_private: formData.is_private,
      });

      toast({
        title: "Lobby Created!",
        description: "Your lobby is now live and ready for players.",
      });

      onOpenChange(false);
      setFormData({
        title: "",
        description: "",
        game: "cod-mobile",
        game_mode: "Battle Royale",
        max_players: 4,
        skill_level: "any",
        language: "English",
        region: "",
        gender_preference: "any",
        voice_chat: false,
        password: "",
        is_private: false,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create lobby",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Create Lobby
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Lobby Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Pro Squad - Ranked Push"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="h-11"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your lobby, goals, or requirements..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
            />
          </div>

          {/* Game & Mode */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Game</Label>
              <Select
                value={formData.game}
                onValueChange={(value: GameType) => {
                  setFormData({
                    ...formData,
                    game: value,
                    game_mode: gameModes[value][0],
                  });
                }}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cod-mobile">COD Mobile</SelectItem>
                  <SelectItem value="pubg-mobile">PUBG Mobile</SelectItem>
                  <SelectItem value="free-fire">Free Fire</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Game Mode</Label>
              <Select
                value={formData.game_mode}
                onValueChange={(value) => setFormData({ ...formData, game_mode: value })}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {gameModes[formData.game].map((mode) => (
                    <SelectItem key={mode} value={mode}>
                      {mode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Players & Skill */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Max Players</Label>
              <Select
                value={formData.max_players.toString()}
                onValueChange={(value) => setFormData({ ...formData, max_players: parseInt(value) })}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2, 3, 4, 5, 10, 20, 50, 100].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} players
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Skill Level</Label>
              <Select
                value={formData.skill_level}
                onValueChange={(value: SkillLevel) => setFormData({ ...formData, skill_level: value })}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Level</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Language & Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Language</Label>
              <Select
                value={formData.language}
                onValueChange={(value) => setFormData({ ...formData, language: value })}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Gender Preference</Label>
              <Select
                value={formData.gender_preference}
                onValueChange={(value: GenderPreference) => setFormData({ ...formData, gender_preference: value })}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="male">Male Only</SelectItem>
                  <SelectItem value="female">Female Only</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Region */}
          <div className="space-y-2">
            <Label htmlFor="region">Region (Optional)</Label>
            <Input
              id="region"
              placeholder="e.g., North America, India, Europe"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              className="h-11"
            />
          </div>

          {/* Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                {formData.voice_chat ? (
                  <Mic className="w-5 h-5 text-primary" />
                ) : (
                  <MicOff className="w-5 h-5 text-muted-foreground" />
                )}
                <div>
                  <div className="font-medium text-sm">Voice Chat</div>
                  <div className="text-xs text-muted-foreground">Require voice communication</div>
                </div>
              </div>
              <Switch
                checked={formData.voice_chat}
                onCheckedChange={(checked) => setFormData({ ...formData, voice_chat: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                {formData.is_private ? (
                  <Lock className="w-5 h-5 text-secondary" />
                ) : (
                  <Globe className="w-5 h-5 text-muted-foreground" />
                )}
                <div>
                  <div className="font-medium text-sm">Private Lobby</div>
                  <div className="text-xs text-muted-foreground">Require password to join</div>
                </div>
              </div>
              <Switch
                checked={formData.is_private}
                onCheckedChange={(checked) => setFormData({ ...formData, is_private: checked })}
              />
            </div>

            {formData.is_private && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <Label htmlFor="password">Lobby Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-11"
                />
              </motion.div>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="hero"
              className="flex-1"
              disabled={createLobby.isPending}
            >
              {createLobby.isPending ? "Creating..." : "Create Lobby"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLobbyDialog;
