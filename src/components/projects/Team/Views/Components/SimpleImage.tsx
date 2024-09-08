import React, { useState } from 'react';
import { LoaderX } from 'components/shared/Loader';
interface Props {
  url: string;
  className: string;
}
const SimpleImage = ({ url, className }: Props) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  return (
    <div className={className + 'relative flex items-center justify-center'}>
      <img
        onError={() => setError(true)}
        onLoad={() => setLoading(false)}
        className={`${loading ? 'hidden' : className}`}
        src={url}
        alt="logo"
      />
      {loading && !error && <LoaderX color="blue" />}
    </div>
  );
};

export default SimpleImage;
