import { useState } from 'react';

const useFocus = (autoFocus = false) => {
  const [focused, setFocus] = useState(autoFocus);

  const handleFocus = () => {
    setFocus((prev) => !prev);
  };

  return { handleFocus, focused, setFocus };
};

export default useFocus;
