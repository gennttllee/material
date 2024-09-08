import React, { useState } from 'react';
import noContent from 'assets/nocontent.svg';
import { LoaderX } from 'components/shared/Loader';
import { useNavigate, useNavigation } from 'react-router-dom';
import Button from 'components/shared/Button';

interface ConfirmationProps {
  onCancel: () => void | Promise<void>;
  onProceed: () => void;
  text: string;
  className?: string;
  cancleButtonText?: string;
  buttonText?: string;
  removeImage?: boolean;
  Element?: React.ReactElement;
}

function ConfirmationModal({
  onCancel,
  onProceed,
  text,
  className,
  buttonText,
  cancleButtonText,
  removeImage,
  Element
}: ConfirmationProps) {
  let [loading, setLoading] = useState(false);
  let [_leftLoading, setLeftLoading] = useState(false);
  let navigation = useNavigate();
  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
      }}
      className={className}>
      {!removeImage && <img src={noContent} />}
      <p className="text-center font-semibold whitespace-pre my-4 max-w-[400px]">{text}</p>
      {Element}
      <div className="flex items-center w-full justify-evenly  gap-x-4 mt-7">
        <Button
          isLoading={_leftLoading}
          type="secondary"
          onClick={async () => {
            setLeftLoading(true);
            await onCancel();
            setLeftLoading(false);
          }}
          text={cancleButtonText ?? 'Cancel'}
        />
        <Button
          type="danger"
          isLoading={loading}
          text={buttonText ?? 'Submit'}
          onClick={async () => {
            setLoading(true);
            await onProceed();
            setLoading(false);
          }}
        />
      </div>
    </span>
  );
}

export default ConfirmationModal;
