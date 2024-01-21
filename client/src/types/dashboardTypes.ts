import { User } from "./userTypes";

export interface DashboardProps {
  createRoom: () => void;
  handleJoinRoom: (pin: string) => void;
  handleUsernameSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  newUsername: string;
  setNewUsername: React.Dispatch<React.SetStateAction<string>>;
  userInfo: User | null;
  usernameError: string;
}
