import { create } from 'zustand';
import { IModals } from '../types/modal-types';

interface IModalStore {
  modalType: IModals;
  contentModal?: any;
  openModal: (modalType: IModals, contentModal?: any) => void;
  closeModal: () => void;
}

export const useModalStore = create<IModalStore>(set => ({
  modalType: null,
  contentModal: null,
  openModal: (modalType, contentModal) => {
    set({ modalType, contentModal });
  },
  closeModal: () => {
    set({ modalType: null });
  },
}));
