import React, { FC, memo, ReactNode } from 'react';
import { centered } from '../../../constants/globalStyles';

export interface ModalProps {
  visible: boolean;
  toggle: () => void;
  className?: string;
  children?: ReactNode;
  overlayClassName?: string;
}
/**
 *
 * @param param0
 * @returns
 */
const Modal: FC<ModalProps> = ({
  toggle,
  visible,
  children,
  className = '',
  overlayClassName = ''
}) => (
  <div
    className={`fixed w-screen h-screen top-0 left-0 z-[60] drop-shadow-lg backdrop-blur-sm ${centered} ${
      !visible && 'hidden'
    } ${className}`}
  >
    <div
      onClick={toggle}
      className={`absolute w-full h-full bg-boverlay z-0 ${overlayClassName}`}
    />
    {children}
  </div>
);

export default memo(Modal);
