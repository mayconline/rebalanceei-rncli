import React, { memo, useCallback } from 'react';
import Button from '../../components/Button';
import {
  ContainerButtons,
  DescriptionConfirmModal,
  LegendConfirmModal,
  WrapperConfirmModal,
} from './styles';
import { IContentConfirmModalProps } from '../../types/modal-types';
import { colors } from '../../themes/colors';

interface IConfirmModalProps {
  contentConfirmModal?: IContentConfirmModalProps;
  isLoading?: boolean;
  onClose: () => void;
}

const ConfirmModal = ({
  contentConfirmModal,
  isLoading = false,
  onClose,
}: IConfirmModalProps) => {
  const handleConfirm = useCallback(async () => {
    await contentConfirmModal?.onConfirm();
    onClose();
  }, []);

  return (
    <WrapperConfirmModal style={colors.shadow.card}>
      <DescriptionConfirmModal>
        {contentConfirmModal?.description}
      </DescriptionConfirmModal>

      {contentConfirmModal?.legend && (
        <LegendConfirmModal>{contentConfirmModal?.legend}</LegendConfirmModal>
      )}

      <ContainerButtons isOnlyConfirm={contentConfirmModal?.isOnlyConfirm}>
        <Button
          onPress={handleConfirm}
          loading={isLoading}
          disabled={isLoading}
          outlined
        >
          {contentConfirmModal?.isOnlyConfirm ? 'Continuar' : 'Sim'}
        </Button>
        {!contentConfirmModal?.isOnlyConfirm && (
          <Button onPress={onClose} disabled={isLoading}>
            Não
          </Button>
        )}
      </ContainerButtons>
    </WrapperConfirmModal>
  );
};

export default memo(ConfirmModal);
