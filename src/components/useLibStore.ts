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
    isBookmarked: false,
    personalNote: null,
  },

  newEntryStatus: true,
  signInModalStatus: false,
  signUpModalStatus: false
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