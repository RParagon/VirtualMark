export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          created_at: string
          title: string
          excerpt: string
          content: string
          category: string
          author: string
          date: string
          read_time: string
          image_url: string
          featured: boolean
          status: 'draft' | 'published'
        }
        Insert: Omit<Database['public']['Tables']['posts']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['posts']['Insert']>
      }
    }
  }
}

export type Post = Database['public']['Tables']['posts']['Row']
export type NewPost = Database['public']['Tables']['posts']['Insert']
export type UpdatePost = Database['public']['Tables']['posts']['Update']