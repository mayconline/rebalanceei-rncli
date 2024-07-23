import { ReactNode } from 'react';
import { Modal as RNModal } from 'react-native';
import ShadowBackdrop from '../ShadowBackdrop';

interface IModalProps {
  children?: ReactNode;
}

export const Modal = ({ children }: IModalProps) => {
  return (
    <RNModal animationType="slide" transparent visible statusBarTranslucent>
      <ShadowBackdrop>{children}</ShadowBackdrop>
    </RNModal>
  );
};
