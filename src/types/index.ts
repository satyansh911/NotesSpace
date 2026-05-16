export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  is_public: boolean;
  is_favorite: boolean;
  is_archived: boolean;
  is_deleted: boolean;
  share_id: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}
