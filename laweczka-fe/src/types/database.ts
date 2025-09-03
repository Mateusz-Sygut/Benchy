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
    };
  };
}

export type Bench = Omit<Database['public']['Tables']['benches']['Row'], 'description'> & {
  description?: string;
  username?: string;
};

export type Rating = Database['public']['Tables']['ratings']['Row'] & {
  username?: string;
};

export type BenchInsert = Database['public']['Tables']['benches']['Insert'];
export type RatingInsert = Database['public']['Tables']['ratings']['Insert'];

