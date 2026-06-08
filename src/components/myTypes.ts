import { z } from 'zod';

export interface LibraryItem {
  id: string | number;
  name: string;
  category: string;
  description: string;
  installCommand: string;
  docsUrl: string;
  isBookmarked?: boolean;
  personalNote: string | null;
  createdBy: number | null;
  isProtected: boolean;
  status: "public" | "private" | "pending";
}

export interface LibraryItems {
  myLibs: LibraryItem[];
}

export interface LibPromise {
  libPromise: Promise<LibraryItem[]>;
}

export interface LibStoreState<T> {
  modalStatus: boolean,
  target: T,
  newEntryStatus: boolean;
  signInModalStatus: boolean;
  signUpModalStatus: boolean;
  badgeModalStatus: boolean;
  libInfo: T;
}







export interface HomePageProps {
  searchParams: Promise<{
    q?: string | string[];
    sort?: string | string[];
  }>;
}


export interface LibListProps {
  user: User | null;
  libPromise: Promise<LibraryItem[]>;
}


export interface ErrorHandlerProps {
  error: unknown;
  resetErrorBoundary?: () => void;
  reset?: () => void;
}






export interface ActionResponse {
  success: boolean;
  message: string;
}





export interface AuthCredentials {
  name?: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
}







export const SignupSchema = z.object({
  name: z.string().trim().min(1, { message: "need at least one character" }).max(50, { message: "maximum characters are 50" }),
  email: z.email().toLowerCase(),
  password: z.string().min(8, { message: "password should be at least 8 character" }).max(22),
});


export const LibraryItemScheme = z.object({
  name: z.string().trim().min(3).max(50),
  category: z.enum(["UI Components", "State Management", "Data Fetching", "Animation", "Routing"]),
  description: z.string().trim().min(10).max(300),
  installCommand: z.string().trim().min(5),
  docsUrl: z.url("Please enter a valid URL"),
});