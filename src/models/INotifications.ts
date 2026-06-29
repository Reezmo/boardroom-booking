import { IEvent } from "./IEvent";
import { IUser } from "./IUser";

export interface INotification {
  id: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  createdAt: Date;
  read: boolean;
  event?: IEvent; // Optional: link to related event
  recipient: IUser; // The user who receives the notification
 
}
