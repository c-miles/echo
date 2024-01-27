export interface Message {
  userId: string;
  message: string;
  timestamp: Date;
}

export type MessageThreadProps = {
  messages: Message[];
  onSendMessage: (message: string) => void;
};
