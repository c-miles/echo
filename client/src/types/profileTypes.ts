import { User } from "./userTypes";

export interface ProfileProps {
  error: string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  userInfo: User | null;
  username: string;
}
