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
}));




export function setModalStatus(input: boolean) {
  useLibStore.setState({ modalStatus: input });
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




export function setNewEntryStatus(input: boolean) {
  useLibStore.setState({ newEntryStatus: input });
}
