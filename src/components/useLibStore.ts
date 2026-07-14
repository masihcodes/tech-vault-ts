import { create } from 'zustand';
import { LibraryItem, LibStoreState } from './myTypes';

export const useLibStore = create<LibStoreState<LibraryItem>>()(() => ({
  modalStatus: false,

  target: {
    id: '',
    name: '',
    category: '',
    description: '',
    installCommand: '',
    docsUrl: '',
    imageUrl: '',
    isBookmarked: false,
    personalNote: null,
    createdBy: null,
    isProtected: false,
    status: 'pending'
  },

  newEntryStatus: true,
  signInModalStatus: false,
  signUpModalStatus: false,
  badgeModalStatus: false,

  libInfo: {
    id: '',
    name: '',
    category: '',
    description: '',
    installCommand: '',
    docsUrl: '',
    imageUrl: '',
    isBookmarked: false,
    personalNote: null,
    createdBy: null,
    isProtected: false,
    status: 'pending'
  },
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

export function setBadgeModalStatus(input: boolean) {
  useLibStore.setState({ badgeModalStatus: input });
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
      imageUrl: input.imageUrl,
      isBookmarked: input.isBookmarked,
      personalNote: input.personalNote,
      createdBy: input.createdBy,
      isProtected: input.isProtected,
      status: input.status
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
      imageUrl: '',
      isBookmarked: false,
      personalNote: null,
      createdBy: null,
      isProtected: false,
      status: 'pending'
    },
  });
}


export function setLibInfo(input: LibraryItem) {
  useLibStore.setState({
    libInfo: {
      id: input.id,
      name: input.name,
      category: input.category,
      description: input.description,
      installCommand: input.installCommand,
      docsUrl: input.docsUrl,
      imageUrl: input.imageUrl,
      isBookmarked: input.isBookmarked,
      personalNote: input.personalNote,
      createdBy: input.createdBy,
      isProtected: input.isProtected,
      status: input.status
    },
  });
}

export function resetLibInfo() {
  useLibStore.setState({
    libInfo: {
      id: '',
      name: '',
      category: '',
      description: '',
      installCommand: '',
      docsUrl: '',
      imageUrl: '',
      isBookmarked: false,
      personalNote: null,
      createdBy: null,
      isProtected: false,
      status: 'pending'
    },
  });
}