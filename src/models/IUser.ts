export interface IUser {
  id: string;
  fullName: string;
  mail: string;
  tenantId?: string; // Optional: to link user to a specific tenant or organization
  profilePicture?: string; 
}
