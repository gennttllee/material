import { useComponentDimensions } from 'components/projects/Team/Views/Components/OnScreen';
import React, { useState, useRef, useEffect } from 'react';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';

interface SliderProps {
  items: {
    url: string;
    alt: string;
    name?: string;
    classes?: string;
  }[];
}

const ImageSlider = ({ items }: SliderProps) => {
  let [current, setCurrent] = useState(0);
  const [hover, setHover] = useState(false);
  let ref = useRef<HTMLDivElement>(null);
  let scrollRef = useRef<HTMLDivElement>(null);
  let { width, height } = useComponentDimensions(ref);
  const next = () => {
    if (items.length > 1) {
      setCurrent((_) => (_ === items.length - 1 ? 0 : _ + 1));
    }
  };
  useEffect(() => {
    let interval = setInterval(() => {
      if (!hover) {
        next();
      }
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [current,hover]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ behavior: 'smooth', left: current * width });
  }, [current]);

  return (
    <div
      onMouseOver={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      ref={ref}
      className="w-full h-full relative">
      <Button number={items.length} current={current} isLeft setter={setCurrent} />
      <Button number={items.length} current={current} setter={setCurrent} />
      <div className="w-full absolute z-50 bottom-2">
        <div className="flex cursor-pointer items-center gap-2 justify-center">
          {items.map((m, i) => (
            <div
              key={i}
              onClick={() => {
                setCurrent((_) => i);
              }}
              className={`w-2 h-2 ${
                i === current ? ' bg-ashShade-1' : 'bg-white'
              } border border-bash rounded-full`}></div>
          ))}
        </div>
      </div>
      <div
        ref={scrollRef}
        style={{ height, width }}
        className="bg-bblue whitespace-nowrap overflow-x-auto no-scrollbar">
        {items.map((m, i) => (
          <img
            className=" inline-block object-cover"
            src={m.url}
            key={i}
            style={{ width, height }}
            alt=""
          />
        ))}
      </div>
    </div>
  );
};

type _Button = {
  number: number;
  current: number;
  isLeft?: boolean;
  setter: any;
};

const Button = ({ number, current, isLeft, setter }: _Button) => {
  return (
    <div
      onClick={() => {
        isLeft
          ? setter(current === 0 ? number - 1 : current - 1)
          : setter(current === number - 1 ? 0 : current + 1);
      }}
      className={`bg-white hover:cursor-pointer absolute top-[calc(50%-16px)] ${`${
        isLeft ? 'left-4' : 'right-4'
      }`} z-40 rounded-full h-8 w-8 flex items-center justify-center`}>
      {isLeft ? <BiChevronLeft size={16} /> : <BiChevronRight size={16} />}
    </div>
  );
};

export default ImageSlider;

//   <ImageGallery
//     onImageLoad={() => {
//       if (!load) {
//         setLoad(true);
//       }
//     }}
//     autoPlay
//     showPlayButton={false}
//     showBullets
//     showFullscreenButton={false}
//     showThumbnails={false}
//     lazyLoad
//     additionalClass={`w-full h-full  ${load ? "block" : " hidden"} `}
//     items={ims}
//     renderLeftNav={(onClick, disabled) => {
//       return (
//         <div
//           onClick={onClick}
//           className="bg-white hover:cursor-pointer absolute top-[calc(50%-24px)] left-4 z-10 rounded-full h-8 w-8 flex items-center justify-center"
//         >
//           <BiChevronLeft size={16} />
//         </div>
//       );
//     }}
//     renderRightNav={(onClick) => {
//       return (
//         <div
//           onClick={onClick}
//           className="bg-white hover:cursor-pointer absolute top-[calc(50%-24px)] right-4 z-10 rounded-full h-8 w-8 flex items-center justify-center"
//         >
//           <BiChevronRight size={16} />
