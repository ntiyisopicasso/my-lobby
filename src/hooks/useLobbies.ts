import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

type Lobby = Tables<"lobbies">;
type LobbyInsert = TablesInsert<"lobbies">;
type LobbyMember = Tables<"lobby_members">;

export interface LobbyWithMembers extends Lobby {
  member_count: number;
  host_profile?: {
    username: string;
  };
}

export function useLobbies(gameFilter?: "cod-mobile" | "pubg-mobile" | "free-fire" | "all") {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["lobbies", gameFilter],
    queryFn: async () => {
      let q = supabase
        .from("lobbies")
        .select(`
          *,
          lobby_members(count),
          profiles!lobbies_host_id_fkey(username)
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (gameFilter && gameFilter !== "all") {
        q = q.eq("game", gameFilter as "cod-mobile" | "pubg-mobile" | "free-fire");
      }

      const { data, error } = await q;

      if (error) throw error;

      return data.map((lobby: any) => ({
        ...lobby,
        member_count: lobby.lobby_members?.[0]?.count || 0,
        host_profile: lobby.profiles,
      })) as LobbyWithMembers[];
    },
  });

  // Real-time subscription for lobby updates
  useEffect(() => {
    const channel = supabase
      .channel("lobbies-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "lobbies" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["lobbies"] });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "lobby_members" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["lobbies"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
}

export function useCreateLobby() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lobby: Omit<LobbyInsert, "host_id">) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("lobbies")
        .insert({ ...lobby, host_id: user.id })
        .select()
        .single();

      if (error) throw error;

      // Auto-join the host to the lobby
      await supabase.from("lobby_members").insert({
        lobby_id: data.id,
        user_id: user.id,
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lobbies"] });
    },
  });
}

export function useJoinLobby() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lobbyId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("lobby_members")
        .insert({ lobby_id: lobbyId, user_id: user.id });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lobbies"] });
    },
  });
}

export function useLeaveLobby() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lobbyId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("lobby_members")
        .delete()
        .eq("lobby_id", lobbyId)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lobbies"] });
    },
  });
}

export function useDeleteLobby() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lobbyId: string) => {
      const { error } = await supabase
        .from("lobbies")
        .delete()
        .eq("id", lobbyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lobbies"] });
    },
  });
}

export function useLobbyMembers(lobbyId: string) {
  return useQuery({
    queryKey: ["lobby-members", lobbyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lobby_members")
        .select(`
          *,
          profiles(username, level, rank)
        `)
        .eq("lobby_id", lobbyId);

      if (error) throw error;
      return data;
    },
    enabled: !!lobbyId,
  });
}
