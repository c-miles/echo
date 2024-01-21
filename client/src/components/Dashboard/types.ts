export interface User {
  id: string;
  createdAt: Date;
  email: string;
  picture: string;
  username?: string;
}

export interface DashboardProps {
  createRoom: () => void;
  handleJoinRoom: (pin: string) => void;
  handleUsernameSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  newUsername: string;
  setNewUsername: React.Dispatch<React.SetStateAction<string>>;
  userInfo: User | null;
  usernameError: string;
}
