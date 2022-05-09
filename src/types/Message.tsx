export interface Message {
  content: string;
  senderName: string;
  createdAt: number;
}

export interface ChatData {
  room: number;
  messages: Message[];
}

export interface ChatSession {
  username: string;
  port: number;
  messages: Message[];
}

export interface MessageData extends Message {
  room: number;
}
