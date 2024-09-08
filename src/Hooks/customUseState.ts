import { useEffect, useState } from 'react';

const customUseState = () => {
  const [state, setState] = useState();
  const [callBack, setCallback] = useState<(arg?: any) => void>();

  useEffect(() => {
    if (callBack) callBack();
  }, [state, callBack]);

  const handleChange = (val: any, callBack?: () => void) => {
    setCallback(callBack);
    setState(val);
  };

  return { state, setState, handleChange } as const;
};

export default customUseState;
