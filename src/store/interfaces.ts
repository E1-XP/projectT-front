export interface UserData {
  avatar: string;
  email: string;
  username: string;
}

export interface Entry {
  billable: boolean;
  description: string;
  project: string;
  start: number;
  stop: number;
  userId: string;
  __v: number;
  _id: string;
}

export interface Project {
  name: string;
  color: string;
  client: string;
  _id: string;
}
