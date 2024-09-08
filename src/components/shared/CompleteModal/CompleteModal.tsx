import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';
import Modal from '../Modal/Modal';
import { flexer, hoverFade } from 'constants/globalStyles';

export interface CompleteModalProps {
  toggleButton?: ReactNode;
  toggleButtonClass?: string;
  children: ReactNode;
  loading?: boolean;
  className?: string;
  modalClassName?: string;
  initialState?: boolean;
  title?: string;
  state?: boolean;
  toggler?: () => void;
}

export interface ChildComponentProps {
  className?: string;
  showModal: boolean;
  toggleModal: () => void;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const CompleteModal: FC<CompleteModalProps> = ({
  initialState = false,
  toggleButtonClass,
  modalClassName,
  toggleButton,
  className,
  children,
  loading,
  title,
  state,
  toggler,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showModal, setModal] = useState(initialState ?? false);

  useEffect(() => {
    setModal(initialState);
  }, [initialState]);

  const toggleModal = () => {
    if (toggler) {
      toggler();
    } else {
      setModal((prev) => !prev);
    }
  };

  const childrenWithProps = React.Children.map(children, (child: ReactNode) => {
    if (React.isValidElement(child)) {
      // Use a type assertion to specify the expected child props
      return React.cloneElement(child, {
        toggleModal,
        showModal,
        setModal
      } as ChildComponentProps); // Replace with your actual child component's props type
    }
    return child;
  });

  return (
    <>
      <button
        className={toggleButtonClass}
        onClick={(ev) => {
          ev.stopPropagation();
          toggleModal();
        }}>
        {toggleButton}
      </button>
      <Modal
        overlayClassName="opacity-50 backdrop-blur-0"
        className="backdrop-blur-0 drop-shadow-lg"
        visible={showModal}
        toggle={toggleModal}>
        <div
          onClick={(e) => e.stopPropagation()}
          className={
            'bg-white fixed cursor-auto  w-11/12 md:max-w-[500px] h-fit p-6 flex-col rounded-lg z-[100]' +
            modalClassName
          }
          ref={containerRef}>
          <div className={flexer + 'mb-5'}>
            <h4 className="font-Medium">{title}</h4>
            <button onClick={toggleModal} className={'text-bash text-sm' + hoverFade}>
              Close
            </button>
          </div>
          {showModal ? childrenWithProps : null}
        </div>
      </Modal>
    </>
  );
};

export default CompleteModal;
