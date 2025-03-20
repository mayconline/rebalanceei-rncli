import { create } from 'zustand';
import type { IContentConfirmModalProps, IModals } from '../types/modal-types';

interface IModalStore {
  modalType: IModals;
  contentModal?: any;
  contentConfirmModal?: IContentConfirmModalProps;
  isOpenConfirmModal: boolean;
  isLoading: boolean;
  openModal: (modalType: IModals, contentModal?: any) => void;
  closeModal: () => void;
  openConfirmModal: (contentConfirmModal: IContentConfirmModalProps) => void;
  closeConfirmModal: () => void;
  setLoading: (state: boolean) => void;
}

export const useModalStore = create<IModalStore>(set => ({
  isOpenConfirmModal: false,
  modalType: null,
  contentModal: null,
  isLoading: false,
  openModal: (modalType, contentModal) => {
    set({ modalType, contentModal });
  },
  closeModal: () => {
    set({ modalType: null, contentModal: null });
  },
  openConfirmModal: contentConfirmModal => {
    set({ isOpenConfirmModal: true, contentConfirmModal });
  },
  closeConfirmModal: () => {
    set({ isOpenConfirmModal: false, contentConfirmModal: undefined });
  },
  setLoading: state => {
    set({ isLoading: state });
  },
}));
