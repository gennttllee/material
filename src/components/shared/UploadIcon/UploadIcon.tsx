import { FC, useRef } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { FiUpload } from 'react-icons/fi';
import { hoverFade } from '../../../constants/globalStyles';

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  handleChange: (value: any) => void;
  value?: any;
  isUploading: boolean;
};

const UploadIcon: FC<Props> = ({ value, isUploading, handleChange, ...rest }) => {
  const InputRef = useRef<HTMLInputElement | null>(null);

  const onClickHandler = () => {
    if (InputRef.current) InputRef.current.click();
  };

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    //
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // check if multiple is in use!
      handleChange(rest.multiple ? e.currentTarget.files : e.currentTarget.files[0]);
    }
  };

  return (
    <div className={`rounded-full bg-ashShade-3 mr-4 ${hoverFade} p-2`} onClick={onClickHandler}>
      <input type="file" ref={InputRef} onChange={onChange} className="hidden" {...rest} />
      <div>
        {isUploading ? (
          <AiOutlineLoading className="text-ashShade-1 animate-spin" />
        ) : (
          <FiUpload className="text-ashShade-1" />
        )}
      </div>
    </div>
  );
};

export default UploadIcon;
