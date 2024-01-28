export interface Message {
  message: string;
  timestamp: Date;
  username: string;
}

export type MessageThreadProps = {
  messages: Message[];
  onSendMessage: (message: string) => void;
  style?: React.CSSProperties;
};
