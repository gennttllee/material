import {
  CSSProperties,
  FC,
  memo,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { IoImageOutline } from 'react-icons/io5';
import { centered, hoverFade } from 'constants/globalStyles';
import { FetchImage } from '../FetchImage';

export interface Props {
  onChange: (value: File) => void;
  label?: string;
  value?: any;
  placeholder: string;
  placeholderTextClassName?: string;
  placeholderIconClassName?: string;
  wrapperClassName?: CSSProperties;
  parentRef?: RefObject<HTMLDivElement>;
  required?: boolean;
  error?: any;
}

const ImagePicker: FC<Props> = ({
  value,
  onChange,
  parentRef,
  placeholderIconClassName,
  wrapperClassName,
  placeholderTextClassName,
  label,
  placeholder,
  error
}) => {
  const InputRef = useRef<HTMLInputElement | null>(null);
  const [localValue, setLocalValue] = useState<string>();

  useEffect(() => {
    if (value && value.name) {
      setLocalValue(URL.createObjectURL(value));
    } else if (value && typeof value === 'string') {
      // eslint-disable-next-line
      setLocalValue(value);
    } else {
      setLocalValue('');
    }
    // eslint-disable-next-line
  }, [value]);

  const onClickHandler = useCallback(() => {
    if (InputRef.current) InputRef.current.click();
  }, [InputRef]);

  useEffect(() => {
    const parent: RefObject<HTMLDivElement> | undefined = parentRef;
    if (parent?.current) {
      parent.current.addEventListener('click', onClickHandler);
    }
    return () => {
      parent?.current?.removeEventListener('click', onClickHandler);
    };
  }, [parentRef, onClickHandler]);

  return (
    <div className="m-2">
      <label className="capitalize font-sm font-Medium text-bash">{label}</label>
      <div
        style={wrapperClassName}
        className={
          'h-32 w-32 rounded-full mt-2 border-2 overflow-hidden bg-[#F1F2F4] ' +
          centered +
          hoverFade
        }
        onClick={onClickHandler}>
        <input
          type="file"
          ref={InputRef}
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.currentTarget.files && e.currentTarget.files[0]) {
              onChange(e.currentTarget.files[0]);
            }
          }}
        />
        {localValue ? (
          <FetchImage src={localValue} />
        ) : (
          <>
            <IoImageOutline className={placeholderIconClassName} />
            <div className="mx-1" />
            <span className={placeholderTextClassName}>{placeholder}</span>
          </>
        )}
      </div>
      <p className="inputError">{!localValue ? error : null}</p>
    </div>
  );
};

export default memo(ImagePicker);
