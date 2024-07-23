import React, { ReactNode } from 'react';

import { Backdrop } from './styles';

interface IShadowBackdropProps {
  children?: ReactNode;
}

const ShadowBackdrop = ({ children }: IShadowBackdropProps) => (
  <Backdrop>{children}</Backdrop>
);

export default ShadowBackdrop;
