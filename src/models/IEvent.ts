import { IBoardroom } from "./IBoardroom";
import { IOrganizer } from "./IOrganizer";

export interface IEvent {
  id: string;
  title: string;
  description: string;
  color: string; 
  startTime: Date;
  endTime: Date;
  boardroom: IBoardroom;
  attendees?: number;
  agenda?: string;
  organizer?: IOrganizer;
  IsConfirmed?: boolean;
}
