export type RegisterData = {
  name: string;
  email: string;
  password: string;
  role: string;
}

export type RegisterResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export type LoginData = {
  email: string;
  password: string;
}

export type LoginResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}