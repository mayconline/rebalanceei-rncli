import { ReactNode } from 'react';
import { Modal as RNModal, ModalProps } from 'react-native';
import ShadowBackdrop from '../ShadowBackdrop';

interface IModalProps extends ModalProps {
  children?: ReactNode;
}

export const Modal = ({ children, ...props }: IModalProps) => {
  return (
    <RNModal
      animationType="slide"
      transparent
      visible
      statusBarTranslucent
      {...props}
    >
      <ShadowBackdrop>{children}</ShadowBackdrop>
    </RNModal>
  );
};
