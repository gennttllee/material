import React, { useState } from 'react';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import { hoverFade } from '../../../constants/globalStyles';
import InputField from '../InputField';
import { InputProps } from '../InputField/InputField';

interface Props extends InputProps {}

export default function PasswordInput(props: Props) {
  const [showPass, setShowPass] = useState(false);

  const toggleShowPass = () => {
    setShowPass((prev) => !prev);
  };

  const PasswordToggleIcon = showPass ? (
    <BsEyeFill className={'text-bash' + hoverFade} onClick={toggleShowPass} />
  ) : (
    <BsEyeSlashFill className={'text-bash' + hoverFade} onClick={toggleShowPass} />
  );

  return (
    <InputField {...props} type={showPass ? 'text' : 'password'} IconProp={PasswordToggleIcon} />
  );
}
