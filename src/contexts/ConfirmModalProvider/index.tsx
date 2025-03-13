import React, { ReactNode, createContext } from 'react';
import { useModalStore } from '../../store/useModalStore';
import { Modal } from '../../components/Modal';
import ConfirmModal from '../../modals/ConfirmModal';

interface IConfirmModalProvider {
  children: ReactNode;
}

const PrivatesModalContext = createContext({});

export const ConfirmModalProvider = ({ children }: IConfirmModalProvider) => {
  const {
    contentConfirmModal,
    isOpenConfirmModal,
    isLoading,
    closeConfirmModal,
  } = useModalStore(
    ({
      contentConfirmModal,
      isOpenConfirmModal,
      isLoading,
      closeConfirmModal,
    }) => ({
      contentConfirmModal,
      isOpenConfirmModal,
      isLoading,
      closeConfirmModal,
    }),
  );

  return (
    <PrivatesModalContext.Provider value={{}}>
      {children}

      {isOpenConfirmModal && (
        <Modal animationType="fade">
          <ConfirmModal
            onClose={closeConfirmModal}
            contentConfirmModal={contentConfirmModal}
            isLoading={isLoading}
          />
        </Modal>
      )}
    </PrivatesModalContext.Provider>
  );
};
