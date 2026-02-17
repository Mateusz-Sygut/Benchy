export interface Database {
  public: {
    Tables: {
      benches: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          latitude: number;
          longitude: number;
          image_type: string;
          user_id: string;
          created_at: string;
          updated_at: string;
          average_rating: number | null;
          rarity_id: string;
          bench_type_id: string | null;
          location_id: string | null;
          tags: string[] | null;
          image_url: string | null;
          is_favorite: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          latitude: number;
          longitude: number;
          image_type: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
          average_rating?: number | null;
          rarity_id?: string;
          bench_type_id?: string | null;
          location_id?: string | null;
          tags?: string[] | null;
          image_url?: string | null;
          is_favorite?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          latitude?: number;
          longitude?: number;
          image_type?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
          average_rating?: number | null;
          rarity_id?: string;
          bench_type_id?: string | null;
          location_id?: string | null;
          tags?: string[] | null;
          image_url?: string | null;
          is_favorite?: boolean;
        };
      };
      ratings: {
        Row: {
          id: string;
          user_id: string;
          bench_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          bench_id: string;
          rating: number;
          comment?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          bench_id?: string;
          rating?: number;
          comment?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      rarity: {
        Row: {
          id: string;
          name: string;
          level: number;
          color: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          level: number;
          color: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          level?: number;
          color?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      bench_types: {
        Row: {
          id: string;
          name: string;
          icon: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          icon: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          icon?: string;
          created_at?: string;
        };
      };
      locations: {
        Row: {
          id: string;
          name: string;
          icon: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          icon: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          icon?: string;
          created_at?: string;
        };
      };
      tags: {
        Row: {
          id: string;
          name: string;
          category: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          created_at?: string;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          bench_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          bench_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          bench_id?: string;
          created_at?: string;
        };
      };
      achievements: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          category: string;
          requirement_type: string;
          requirement_value: number;
          token_tier: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          icon: string;
          category: string;
          requirement_type: string;
          requirement_value: number;
          token_tier: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          icon?: string;
          category?: string;
          requirement_type?: string;
          requirement_value?: number;
          token_tier?: number;
          created_at?: string;
        };
      };
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          unlocked_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_id: string;
          unlocked_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          achievement_id?: string;
          unlocked_at?: string;
        };
      };
      titles: {
        Row: {
          id: string;
          name: string;
          description: string;
          rarity_level: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          rarity_level: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          rarity_level?: number;
          created_at?: string;
        };
      };
      user_titles: {
        Row: {
          id: string;
          user_id: string;
          title_id: string;
          unlocked_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title_id: string;
          unlocked_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title_id?: string;
          unlocked_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          selected_title_id: string | null;
          avatar_url: string | null;
          total_benches_created: number;
          total_time_spent: number;
          total_ratings_given: number;
          total_favorites: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          selected_title_id?: string | null;
          avatar_url?: string | null;
          total_benches_created?: number;
          total_time_spent?: number;
          total_ratings_given?: number;
          total_favorites?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          selected_title_id?: string | null;
          avatar_url?: string | null;
          total_benches_created?: number;
          total_time_spent?: number;
          total_ratings_given?: number;
          total_favorites?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type Bench = Omit<Database['public']['Tables']['benches']['Row'], 'description'> & {
  description?: string;
  username?: string;
  rarity?: Database['public']['Tables']['rarity']['Row'];
  bench_type?: Database['public']['Tables']['bench_types']['Row'];
  location?: Database['public']['Tables']['locations']['Row'];
};

export type Rating = Database['public']['Tables']['ratings']['Row'] & {
  username?: string;
};

export type BenchInsert = Database['public']['Tables']['benches']['Insert'];
export type RatingInsert = Database['public']['Tables']['ratings']['Insert'];

// New types for ŁawAppka features
export type Rarity = Database['public']['Tables']['rarity']['Row'];
export type BenchType = Database['public']['Tables']['bench_types']['Row'];
export type Location = Database['public']['Tables']['locations']['Row'];
export type Tag = Database['public']['Tables']['tags']['Row'];
export type Favorite = Database['public']['Tables']['favorites']['Row'];
export type Achievement = Database['public']['Tables']['achievements']['Row'];
export type UserAchievement = Database['public']['Tables']['user_achievements']['Row'];
export type Title = Database['public']['Tables']['titles']['Row'];
export type UserTitle = Database['public']['Tables']['user_titles']['Row'];
export type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

// Extended types with relations
export type ExtendedBench = Bench & {
  rarity: Rarity | null;
  bench_type: BenchType | null;
  location: Location | null;
  tags?: Tag[];
  is_favorite: boolean;
};

export type ExtendedUserProfile = UserProfile & {
  selected_title: Title | null;
  unlocked_titles: Title[];
  achievements: (UserAchievement & { achievement: Achievement })[];
};

// Update types
export type BenchUpdate = Database['public']['Tables']['benches']['Update'];

