import { create } from 'zustand';


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

interface LibStoreState<T> {
  modalStatus: boolean,
  target: T,
  newEntryStatus: boolean;
  signInModalStatus: boolean;
  signUpModalStatus: boolean;
  userName: string | null;
  isAuthenticated: boolean;
  refreshHomeTrigger: boolean;
  refreshMyLibTrigger: boolean;
}


export const useLibStore = create<LibStoreState<LibraryItem>>()(() => ({
  modalStatus: false,
  target: {
    id: '',
    name: '',
    category: '',
    description: '',
    installCommand: '',
    docsUrl: '',
    isBookmarked: false,
    personalNote: null,
  },

  newEntryStatus: true,
  signInModalStatus: false,
  signUpModalStatus: false,
  userName: null,
  isAuthenticated: false,
  refreshHomeTrigger: false,
  refreshMyLibTrigger: false
}));




export function setModalStatus(input: boolean) {
  useLibStore.setState({ modalStatus: input });
}

export function setNewEntryStatus(input: boolean) {
  useLibStore.setState({ newEntryStatus: input });
}

export function setSignInModalStatus(input: boolean) {
  useLibStore.setState({ signInModalStatus: input });
}

export function setSignUpModalStatus(input: boolean) {
  useLibStore.setState({ signUpModalStatus: input });
}

export function loginAction(name: string | null) {
  useLibStore.setState({ userName: name, isAuthenticated: name !== null });
}

export function logoutAction() {
  useLibStore.setState({ userName: null, isAuthenticated: false });
}

export function toggleHomeRefresh() {
  useLibStore.setState(s => ({ refreshHomeTrigger: !s.refreshHomeTrigger }));
}

export function toggleMyLibRefresh() {
  useLibStore.setState(s => ({ refreshMyLibTrigger: !s.refreshMyLibTrigger }));
}


export function setTarget(input: LibraryItem) {
  useLibStore.setState({
    target: {
      id: input.id,
      name: input.name,
      category: input.category,
      description: input.description,
      installCommand: input.installCommand,
      docsUrl: input.docsUrl,
      isBookmarked: input.isBookmarked,
      personalNote: input.personalNote,
    },
  });
}




export function resetTarget() {
  useLibStore.setState({
    target: {
      id: '',
      name: '',
      category: '',
      description: '',
      installCommand: '',
      docsUrl: '',
      isBookmarked: false,
      personalNote: null,
    },
  });
}