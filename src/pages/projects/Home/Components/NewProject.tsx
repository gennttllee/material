import Button from 'components/shared/Button';
import Modal from 'components/shared/Modal';
import { ModalProps } from 'components/shared/Modal/Modal';
import { centered, flexer, hoverFade } from 'constants/globalStyles';
import { useEffect, useRef, useState } from 'react';
import { BsCheckCircleFill, BsCircle } from 'react-icons/bs';
import { TbLayoutGridAdd, TbPlus } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { displayError, displaySuccess } from 'Utils';

export default function NewProjectModal(props: ModalProps) {
  const { toggle, visible } = props;
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);
  const [type, setType] = useState<'custom' | 'existing'>();

  useEffect(() => {
    // clicke event that's incharge of
    // closing the modal
    document.addEventListener('click', (e: any) => {
      if (e.target && e.target.contains(modalRef.current)) {
        toggle();
      }
    });

    return () => {
      // clear the event
      document.removeEventListener('click', () => {
        toggle();
      });
    };
  }, [toggle]);

  const handleContinue = () => {
    if (type === 'custom') {
      navigate('/projectform');
    } else {
      navigate('/projects/prototypes');
    }
  };

  const ModalView = (
    <div
      ref={modalRef}
      className="bg-white absolute cursor-auto  w-11/12 md:w-1/2 h-fit py-6 px-10 flex-col rounded-lg z-10"
    >
      <div className={flexer + 'mb-8'}>
        <p className="font-Medium text-base">Create a project</p>
        <button onClick={toggle} className="font-Medium text-bash text-sm">
          Close
        </button>
      </div>
      <h1 className="text-2xl font-semibold text-center">Create a project</h1>
      <p className="text-base text-bash text-center mt-2">
        Create your project from scratch or select from our list of existing prototypes
      </p>
      <div className={flexer + 'mt-8'}>
        <div
          onClick={() => setType('custom')}
          className={
            `flex-1 border relative p-4 rounded flex-col ${type === 'custom' && 'border-bblue'}` +
            centered +
            hoverFade
          }
        >
          <div className="absolute top-2 right-2">
            {type !== 'custom' ? (
              <BsCircle className="text-bash text-base" />
            ) : (
              <BsCheckCircleFill className="text-bblue text-base" />
            )}
          </div>
          <TbPlus className="text-6xl my-5" />
          <p className="font-Medium text-base mb-1 text-center">Create custom project</p>
          <p className="text-sm text-bash text-center">Create custom project from scratch</p>
        </div>
        <div className="mx-2" />
        <div
          onClick={() => setType('existing')}
          className={
            `flex-1 border relative p-4 rounded ${type === 'existing' && 'border-bblue'} flex-col` +
            centered +
            hoverFade
          }
        >
          <div className="absolute top-2 right-2">
            {type !== 'existing' ? (
              <BsCircle className="text-bash text-base" />
            ) : (
              <BsCheckCircleFill className="text-bblue text-base " />
            )}
          </div>
          <TbLayoutGridAdd className="text-6xl my-5" />
          <p className="font-Medium text-base mb-1 text-center">Select from existing prototypes</p>
          <p className="text-sm text-bash text-center">Select from a list of existing prototypes</p>
        </div>
      </div>
      <Button
        text="Continue"
        onClick={handleContinue}
        className="w-8/12 mt-10 mx-auto"
        type={type ? 'primary' : 'muted'}
      />
    </div>
  );

  if (visible) return <Modal {...props}>{ModalView}</Modal>;
  return <></>;
}
