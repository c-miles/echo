export interface Message {
  message: string;
  timestamp: Date;
  userId: string;
  username: string;
}

export type MessageThreadProps = {
  messages: Message[];
  onSendMessage: (message: string) => void;
  style?: React.CSSProperties;
};
