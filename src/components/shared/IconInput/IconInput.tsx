import { CSSProperties, FC, HTMLInputTypeAttribute } from 'react';
import { IconType } from 'react-icons';
import { flexer } from '../../../constants/globalStyles';

interface Props {
  onChange: (value: string) => void;
  className?: string;
  placeholder: string;
  required?: boolean;
  readOnly?: boolean;
  Icon?: IconType;
  value?: string;
  type?: HTMLInputTypeAttribute;
  style?: CSSProperties;
}

const IconInput: FC<Props> = ({
  type,
  placeholder,
  value,
  required,
  onChange,
  Icon,
  readOnly,
  className
}) => (
  <div className={flexer + ' w-full bg-gray-100 p-2 rounded-md ' + className}>
    {Icon ? <Icon className="text-gray-500 mx-2" /> : null}
    <input
      className={'flex-1 p-1 bg-transparent outline-none ' + className}
      onChange={(e) => onChange(e.currentTarget.value)}
      placeholder={placeholder}
      readOnly={readOnly}
      required={required}
      value={value}
      type={type}
    />
  </div>
);

export default IconInput;
