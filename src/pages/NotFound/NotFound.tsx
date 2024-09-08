import { AiOutlineArrowLeft, AiOutlineLoading } from 'react-icons/ai';
import { centered, flexer } from '../../constants/globalStyles';
import icon from '../../assets/notFound.svg';
import logo from '../../assets/bnklelogo.svg';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/shared/Button';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const navigation = useNavigate();
  const [imgHasLoaded, setImageLoader] = useState(false);

  useEffect(() => {
    const img = new Image();

    img.src = icon;

    img.onload = () => {
      setImageLoader(true);
    };
  }, []);

  if (!imgHasLoaded)
    return (
      <div className={'w-full h-screen' + centered}>
        <AiOutlineLoading className="text-bblue text-5xl animate-spin" />
      </div>
    );

  return (
    <div className={centered + 'h-screen w-screen'}>
      <div className={flexer + 'relative mx-auto'}>
        <img loading="lazy" decoding="async" src={logo} alt="" className="absolute top-[15%]" />
        <section className="max-w-md">
          <p className="text-base text-bblue font-Medium">404 error</p>
          <h1 className="capitalize font-Medium text-[64px]">Page not found</h1>
          <p className="text-lg text-bash mb-7">
            Sorry, the page you are looking for doesn’t exist. Here are some helpful links:
          </p>
          <div className="flex items-center">
            <Button
              onClick={() => navigation(-1)}
              LeftIcon={<AiOutlineArrowLeft className="text-sm mr-2" />}
              type="secondary"
              text="Go Back"
            />
            <Button onClick={() => navigation('/projects')} text="Take me home" className="ml-5" />
          </div>
        </section>
        <section className="w-10/12">
          <img
            className="w-full object-contain"
            src={icon}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </section>
      </div>
    </div>
  );
}
