import { centered, flexer } from 'constants/globalStyles';
import CustomModal from '../CustomModal/CustomModal';
import trashImage from 'assets/trashImage.svg';
import { ModalProps } from '../Modal/Modal';
import Button from '../Button/Button';
import { useEffect } from 'react';

/**
 * @since August 2023
 * @author Christophe K. Kwizera <christophekwizera@gmail.com>
 * @see {@link https://kabundege.rw} - Author's website
 * @returns {JSX.Element}
 */

interface DeleteModalProps {
  ThumbNail?: React.ReactNode;
  deleteRequest: () => void;
  submitBtnText?: string;
  description?: string;
  isLoading: boolean;
  title: string;
}

type Props = ModalProps & DeleteModalProps;

const DeleteModal = (props: Props) => {
  const { toggle, visible, ...rest } = props;
  const Modal = (
    <CustomModal
      key={rest.title}
      className=" z-[100] "
      {...{ toggle, visible }}
      containerClassName="w-11/12 md:w-3/6">
      <DeleteWrapper {...props} />
    </CustomModal>
  );
  return Modal;
};

const DeleteWrapper = ({
  title,
  toggle,
  isLoading,
  ThumbNail,
  description,
  submitBtnText,
  deleteRequest
}: Props) => {

  return (
    <>
      <div key={title + 'head'} className={flexer + 'mb-3'}>
        <h4 className="font-base font-Medium">{title}</h4>
        <label
          onClick={toggle}
          className="capitalize text-orange-300 hover:text-orange-500 cursor-pointer">
          close
        </label>
      </div>
      <div key={title + 'bottom'} className={centered + 'flex-col'}>
        {ThumbNail || <img src={trashImage} alt="" loading="lazy" decoding="async" />}
        <h6 className="font-bold">Are you sure you want to continue?</h6>
        <label className="text-gray-500">
          {description || 'This item will be completely removed'}
        </label>
        <div className={flexer + 'mt-4'}>
          <Button text="Cancel" className="mr-5" type="secondary" onClick={toggle} />
          <Button
            type="danger"
            {...{ isLoading }}
            onClick={deleteRequest}
            text={submitBtnText || 'Yes, I’m sure'}
          />
        </div>
      </div>
    </>
  );
};

export default DeleteModal;
