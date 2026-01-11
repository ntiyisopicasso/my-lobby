import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Users, Filter, Globe, Mic, Trophy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LobbyCard from "@/components/lobby/LobbyCard";
import CreateLobbyDialog from "@/components/lobby/CreateLobbyDialog";
import AuthDialog from "@/components/auth/AuthDialog";
import { useLobbies, useJoinLobby } from "@/hooks/useLobbies";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [gameFilter, setGameFilter] = useState<"all" | "cod-mobile" | "pubg-mobile" | "free-fire">("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  
  const { data: lobbies, isLoading, error } = useLobbies(gameFilter);
  const joinLobby = useJoinLobby();

  const filteredLobbies = lobbies?.filter(
    (lobby) =>
      lobby.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lobby.host_profile?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleCreateLobby = () => {
    if (!user) {
      setAuthDialogOpen(true);
      toast({
        title: "Sign in required",
        description: "Please sign in to create a lobby",
      });
      return;
    }
    setCreateDialogOpen(true);
  };

  const handleJoinLobby = async (lobbyId: string) => {
    if (!user) {
      setAuthDialogOpen(true);
      toast({
        title: "Sign in required",
        description: "Please sign in to join a lobby",
      });
      return;
    }

    try {
      await joinLobby.mutateAsync(lobbyId);
      toast({
        title: "Joined Lobby!",
        description: "You have successfully joined the lobby.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to join",
        description: error.message || "Could not join lobby",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-foreground">Lobby Hub</h1>
              <p className="text-muted-foreground">Find your squad or create a new lobby</p>
            </div>
            <Button variant="hero" className="gap-2" onClick={handleCreateLobby}>
              <Plus className="w-4 h-4" />
              Create Lobby
            </Button>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {[
              { label: "Active Lobbies", value: lobbies?.length || 0, icon: Users },
              { label: "Players Online", value: "—", icon: Globe },
              { label: "Voice Lobbies", value: lobbies?.filter(l => l.voice_chat).length || 0, icon: Mic },
              { label: "Pro Lobbies", value: lobbies?.filter(l => l.skill_level === "pro").length || 0, icon: Trophy },
            ].map((stat, index) => (
              <div key={index} className="glass-card p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 mb-8"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search lobbies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <Select value={gameFilter} onValueChange={(v: typeof gameFilter) => setGameFilter(v)}>
              <SelectTrigger className="w-full sm:w-48 h-12">
                <SelectValue placeholder="All Games" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Games</SelectItem>
                <SelectItem value="cod-mobile">COD Mobile</SelectItem>
                <SelectItem value="pubg-mobile">PUBG Mobile</SelectItem>
                <SelectItem value="free-fire">Free Fire</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-16">
              <p className="text-destructive">Failed to load lobbies. Please try again.</p>
            </div>
          )}

          {/* Lobbies Grid */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredLobbies.map((lobby) => (
                <LobbyCard
                  key={lobby.id}
                  lobby={lobby}
                  onJoin={handleJoinLobby}
                  isJoining={joinLobby.isPending}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredLobbies.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No lobbies found</h3>
              <p className="text-muted-foreground mb-4">
                {lobbies?.length === 0
                  ? "Be the first to create a lobby!"
                  : "Try adjusting your search or filters"}
              </p>
              <Button variant="hero" className="gap-2" onClick={handleCreateLobby}>
                <Plus className="w-4 h-4" />
                Create Lobby
              </Button>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />

      {/* Dialogs */}
      <CreateLobbyDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </div>
  );
};

export default Dashboard;
