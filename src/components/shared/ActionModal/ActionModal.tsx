import { centered, flexer } from 'constants/globalStyles';
import trashImage from 'assets/puzzle-inbox-message.svg';
import CustomModal from '../CustomModal/CustomModal';
import { ModalProps } from '../Modal/Modal';
import Button from '../Button/Button';

/**
 * @since August 2023
 * @author Christophe K. Kwizera <christophekwizera@gmail.com>
 * @see {@link https://kabundege.rw} - Author's website
 * @returns {JSX.Element}
 */

interface ActionModalProps {
  ThumbNail?: React.ReactNode;
  actionRequest: () => void;
  isLoading?: boolean;
  actionLabel: string;
  description: string; // the text above the buttons
  heading: string; // the text above the description
  title: string; // the short description on top
}

type Props = ModalProps & ActionModalProps;

const ActionModal = (props: Props) => {
  const { toggle, visible, ...rest } = props;
  const Modal = (
    <CustomModal
      key={rest.title}
      className="z-20"
      {...{ toggle, visible }}
      containerClassName="w-11/12 md:w-3/6"
    >
      <DeleteWrapper {...props} />
    </CustomModal>
  );
  return Modal;
};

const DeleteWrapper = ({
  title,
  toggle,
  heading,
  ThumbNail,
  actionLabel,
  description,
  actionRequest,
  isLoading = false
}: Props) => (
  <>
    <div key={title + 'head'} className={flexer + 'mb-3'}>
      <h4 className="font-base font-Medium">{title}</h4>
      <label
        onClick={toggle}
        className="capitalize text-orange-300 hover:text-orange-500 cursor-pointer"
      >
        close
      </label>
    </div>
    <div key={title + 'bottom'} className={centered + 'flex-col'}>
      {ThumbNail || <img src={trashImage} alt="" loading="lazy" decoding="async" />}
      <h6 className="font-bold">{heading}</h6>
      <label className="text-gray-500">{description}</label>
      <div className={flexer + 'mt-4'}>
        <Button text="Cancel" className="mr-5" type="secondary" onClick={toggle} />
        <Button type="danger" {...{ isLoading }} text={actionLabel} onClick={actionRequest} />
      </div>
    </div>
  </>
);

export default ActionModal;
