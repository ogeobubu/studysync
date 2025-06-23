// types/chat.ts
export interface Chat {
  _id: string;
  student: User;
  advisor: User;
  appointment?: string;
  messages: Message[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  sender: User;
  content: string;
  timestamp: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  role: 'student' | 'advisor' | 'admin';
}