import { FC } from 'react';
import Modal from '../Modal';
import { ModalProps } from '../Modal/Modal';

interface Props extends ModalProps {
  containerClassName?: string;
  ContainerOverlayClassName?: string;
}

const CustomModal: FC<Props> = ({
  ContainerOverlayClassName,
  containerClassName = '',
  children,
  ...props
}) => (
  <Modal {...props}>
    <div className={'relative z-[100] bg-white p-5 rounded-md shadow-md ' + containerClassName}>
      <div
        onClick={props.toggle}
        className={`fixed w-full h-full z-0 ${ContainerOverlayClassName}`}
      />
      <div className="w-full h-full relative z-10">{children}</div>
    </div>
  </Modal>
);

export default CustomModal;
