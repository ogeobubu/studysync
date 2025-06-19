export enum Role {
  ADMIN = 'admin',
  ADVISOR = 'advisor',
  STUDENT = 'student'
}

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export type UserProfile = {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  gender?: "male" | "female" | null;
  matricNumber?: string;
  program?: string;
  level?: string;
  cgpa?: number;
  gpa?: number;
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export type JwtPayload = {
  id: string;
  role: Role;
  name: string;
  email: string;
  iat: number;
  exp: number;
}