export enum Role {
  Pending = "pending",
  Student = "student",
  Instructor = "instructor",
  Admin = "admin",
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export enum Profession {
  Student = "student",
  Working = "working",
}

interface Contact {
  phone?: string;
  social?: string;
  address?: string;
}

interface Profile {
  avatar?: string | File;
  dateOfBirth?: string;
  gender?: Gender;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  _id?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  userName?: string;
  profile?: Profile;
  contact?: Contact;
  profession?: Profession;
  qualification?: string;
  role?: Role;
  profit?: string;
  isGAuth?: boolean;
  cv?: string | File;
  isVerified?: boolean;
  isRejected?: boolean;
  isRequested?: boolean;
  createdAt?: Date;
  isOtpVerified?: boolean;
  isBlocked?: boolean;
  chatId?:string;
  roomId?:string;
  lastLoginDate?: Date;
  loginStreak?: number;
  lastSeen?: Date;
  isOnline?:boolean;
  weeklyLogins?: boolean[];
}

export interface Response {
  success: boolean;
  message?: string;
  data?: SignupFormData;
}
