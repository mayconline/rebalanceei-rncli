import React, { ReactNode, createContext } from 'react';

import { useModalStore } from '../../store/useModalStore';

import AddTicketModal from '../../modals/AddTicketModal';
import { Modal } from '../../components/Modal';
import SuccessModal from '../../modals/SuccessModal';
import PlanModal from '../../modals/PlanModal';
import WalletModal from '../../modals/WalletModal';
import MenuModal from '../../modals/MenuModal';

interface IPrivatesModalProps {
  children: ReactNode;
}

const PrivatesModalContext = createContext({});

export const PrivatesModalProvider = ({ children }: IPrivatesModalProps) => {
  const { modalType, contentModal, closeModal } = useModalStore();

  console.log({ modalType, contentModal });

  return (
    <PrivatesModalContext.Provider value={{}}>
      {children}

      {modalType === 'AddTicket' && (
        <Modal>
          <AddTicketModal onClose={closeModal} contentModal={contentModal} />
        </Modal>
      )}

      {modalType === 'SUCCESS' && (
        <Modal>
          <SuccessModal onClose={closeModal} />
        </Modal>
      )}

      {modalType === 'PLAN' && (
        <Modal>
          <PlanModal onClose={closeModal} />
        </Modal>
      )}

      {modalType === 'Wallet' && (
        <Modal>
          <WalletModal onClose={closeModal} />
        </Modal>
      )}

      {modalType === 'Menu' && (
        <Modal>
          <MenuModal onClose={closeModal} />
        </Modal>
      )}
    </PrivatesModalContext.Provider>
  );
};
