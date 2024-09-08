import { useState } from 'react';
import Loader, { LoaderX } from './Loader';

interface Props {
  profId: string;
  type: string;
}
const ContractorFrame = ({ profId, type }: Props) => {
  const [loaded, setLoaded] = useState(false);
  let url = `${
    process.env.REACT_APP_AUTH_URL
  }?userId=${profId}&type=${type}&userProfileToken=${localStorage.getItem('token')}`;
  return (
    <>
      {!loaded && (
        <div className="w-full bg-white rounded-xl bg-opacity-20 mt-5  h-1/2 flex items-center justify-center p-5">
          <LoaderX color="blue" />
        </div>
      )}
      <iframe
        title="contractor frame"
        onLoad={() => setLoaded(true)}
        src={url}
        className={`w-full h-full ${loaded ? '' : 'hidden'}`}
      ></iframe>
    </>
  );
};

export default ContractorFrame;
