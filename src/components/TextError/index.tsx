import React, { useState } from 'react';
import { Modal } from 'react-native';
import PlanModal from '../../modals/PlanModal';
import { formatErrors } from '../../utils/format';
import { TextContentError } from './styles';

interface ITextError {
  children: string;
  isTabs?: boolean;
}

const TextError = ({ children, isTabs }: ITextError) => {
  const openPlanModal =
    children === 'Tickets limited to 16 items' ||
    children === 'Wallet limited to 2 items';

  const [openModal, setOpenModal] = useState(openPlanModal);

  return (
    <>
      <TextContentError isTabs={isTabs} numberOfLines={1} ellipsizeMode="tail">
        {formatErrors(children)}
      </TextContentError>

      {openModal && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={openModal}
          statusBarTranslucent={true}
        >
          <PlanModal onClose={() => setOpenModal(false)} />
        </Modal>
      )}
    </>
  );
};

export default TextError;
