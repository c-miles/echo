export interface User {
  createdAt: Date;
  email: string;
  picture: string;
  username?: string;
}

export interface DashboardProps {
  userInfo: User | null;
  handleUsernameSubmit: (e: React.FormEvent) => void;
  handleGoToRooms: () => void;
  newUsername: string;
  setNewUsername: React.Dispatch<React.SetStateAction<string>>;
}
