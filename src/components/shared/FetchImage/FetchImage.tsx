import { FC, ImgHTMLAttributes, useEffect, useRef, memo, useCallback, useState } from 'react';
import placeholder from '../../../assets/placeholder.svg';
import { GetDownloadSignedUrls } from 'apis/AwsFiles';

export interface CustomImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  pushSrc?: boolean;
  divClassName?: string;
  bucketName?: string;
  hasTransitionEffect?: boolean;
  pushSrcFn?: (val: string) => void;
}

const FetchImage: FC<CustomImageProps> = ({
  divClassName,
  src,
  pushSrcFn,
  pushSrc = false,
  bucketName,
  hasTransitionEffect = false,
  alt = '',
  ...rest
}) => {
  const ImgRef = useRef<HTMLImageElement | null>(null);
  const [isLoading, setLoader] = useState(true);

  useEffect(() => {
    if (src) {
      if (!src.startsWith('data:') && !src.startsWith('blob')) {
        if (ImgRef.current)
          src.startsWith('https')
            ? (ImgRef.current.src = src)
            : GetDownloadSignedUrls(src, bucketName).then((res) => {
                if (ImgRef.current) {
                  ImgRef.current.src = res.data.url;
                  setLoader(false);
                }
              });
      } else if (ImgRef.current) {
        // local files
        ImgRef.current.src = src;
        setLoader(false);
      }
    }
    // add photo transition pulse effect
    if (src && hasTransitionEffect) {
      if (ImgRef.current) {
        ImgRef.current.classList.add('animate-pulse');
        ImgRef.current.onload = function () {
          if (ImgRef.current) ImgRef.current.classList.remove('animate-pulse');
          setLoader(false);
        };
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
        className={rest.className + ` ${isLoading ? 'hidden' : ''}`}
      />
    );

  return (
    <div className={`relative p-20 bg-slate-50 h-fit ${divClassName}`}>
      <img
        loading="lazy"
        decoding="async"
        alt="placeholder"
        src={placeholder}
        className={`object-contain object-center transform -translate-y-[50%] -translate-x-[50%] absolute top-[50%] left-[50%]`}
      />
    </div>
  );
};

export default memo(FetchImage);
