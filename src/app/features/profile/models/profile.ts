export interface Profile {
  id: string;
  userName: string;
  email: string;
  phoneNumber?: string | null;
  fullName?: string | null;
  bio?: string | null;
  address?: string | null;
  profileImage?: string | null;
  roles: string[];
}
