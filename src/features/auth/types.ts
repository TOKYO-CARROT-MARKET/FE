export interface AuthUser {
  id: number;
  email: string;
  nickname: string;
  profile_image_url: string | null;
  email_verified: boolean;
  provider: string;
  provider_uid: string;
  last_sign_in_at: string | null;
  created_at: string;
  updated_at: string;
}
