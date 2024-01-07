export interface Participant {
  userId: string;
  sdp: string;
}

export interface Room {
  _id: string;
  participants: Participant[];
  createdAt: Date;
}

export interface RoomsProps {
  createRoom: () => void;
  joinRoom: (roomId: string) => void;
  rooms: Room[];
}
