import z from "zod";

/**
 * Types shared between the client and server go here.
 */

export interface Friend {
  friend_id: string;
  display_name: string;
  avatar_url: string;
  mood_tag: string;
  bio: string;
  category: string;
  streak_days: number;
  expires_at?: string;
}

export interface Message {
  id: number;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}
