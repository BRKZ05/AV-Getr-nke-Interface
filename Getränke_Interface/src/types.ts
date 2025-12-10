export interface Member {
  id: string;
  name: string;
  email?: string;
}

export interface Order {
  member: string;
  amount: number;
  time: string;
}