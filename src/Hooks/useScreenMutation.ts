import { useEffect, useState } from 'react';

const UseMutationCount = <T>(watch: T) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount((prev) => prev + 1);
  }, [watch]);

  return { count, setCount } as const;
};
