import { FC, ImgHTMLAttributes, useEffect, useRef, memo, useCallback } from 'react';
import placeholder from '../../../assets/placeholder.svg';
import { BucketNames } from '../../../constants';

export interface CustomImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  pushSrc?: boolean;
  divClassName?: string;
  imageBucketName?: string;
  pushSrcFn?: (val: string) => void;
}

const CustomeImage: FC<CustomImageProps> = ({
  divClassName,
  src,
  pushSrcFn,
  imageBucketName = BucketNames[0],
  pushSrc = false,
  alt = '',
  ...rest
}) => {
  const ImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (src) {
      if (!src.startsWith('data:') && !src.startsWith('blob')) {
        if (ImgRef.current)
          ImgRef.current.src = src.startsWith('https')
            ? src
            : `https://${imageBucketName}.eu-west-1.amazonaws.com/` + src;
      } else if (ImgRef.current) {
        // local files
        ImgRef.current.src = src;
      }
    }
  }, [src]);

  const handlePush = useCallback(() => {
    // push up the image source when needed
    if (pushSrcFn && ImgRef.current) pushSrcFn(ImgRef.current.src);
  }, [pushSrcFn]);

  useEffect(() => {
    if (pushSrc) {
      handlePush();
    }
  }, [pushSrc, handlePush]);

  if (src)
    return (
      <img
        loading="lazy"
        decoding="async"
        {...rest}
        ref={ImgRef}
        alt={alt}
        className={rest.className}
      />
    );

  return (
    <div className={`relative p-20 bg-slate-50 h-fit ${divClassName}`}>
      <img
        alt=""
        loading="lazy"
        decoding="async"
        src={placeholder}
        className={`object-contain object-center transform -translate-y-[50%] -translate-x-[50%] absolute top-[50%] left-[50%]`}
      />
    </div>
  );
};

export default memo(CustomeImage);
