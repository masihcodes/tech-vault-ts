export interface LibraryItem {
  id: string | number;
  name: string;
  category: string;
  description: string;
  installCommand: string;
  docsUrl: string;
  isBookmarked: boolean;
  personalNote: string | null;
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
}