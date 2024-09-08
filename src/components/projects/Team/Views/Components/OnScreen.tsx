import React, { useEffect, useMemo, RefObject, useState, MouseEvent, useLayoutEffect } from 'react';

export default function useOnScreen(ref: RefObject<Element>) {
  const [isIntersecting, setIntersecting] = useState(false);

  const observer = useMemo(
    () => new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting)),
    [ref]
  );

  useEffect(() => {
    observer.observe(ref.current!);
    return () => observer.disconnect();
  }, []);

  return isIntersecting;
}

export function usePosition(ref: RefObject<Element>, rootRef: RefObject<Element>) {
  const [isIntersecting, setIntersecting] = useState<any>({});
  const generateThreshold = () => {
    let arr: number[] = [];
    for (let i = 0; i < 1; i += 0.01) {
      arr.push(i);
    }
    return arr;
  };
  const observer = useMemo(
    () =>
      new IntersectionObserver(
        ([entry]) => {
          setIntersecting(entry);
        },
        {
          root: rootRef.current,
          rootMargin: '0px',
          threshold: generateThreshold()
        }
      ),
    [rootRef, ref]
  );

  useEffect(() => {
    observer.observe(ref.current!);
    return () => observer.disconnect();
  }, []);

  return isIntersecting;
}

export function useClickOutSideComponent(ref: RefObject<Element>, handler: () => void) {
  const clickHandler = (e: Event) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      handler();
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', clickHandler);

    return () => {
      document.removeEventListener('mousedown', clickHandler);
    };
  }, [ref]);
}

export function useComponentDimensions(ref: RefObject<Element>) {
  let [dims, setDims] = useState({
    height: 0,
    width: 0
  });
  const clickHandler = () => {
    // if (ref.current && !ref.current.contains(e.target as Node)) {
    //   // handler();
    // }
    setDims({
      height: ref.current?.clientHeight || 0,
      width: ref.current?.clientWidth || 0
    });
  };

  useLayoutEffect(() => {
    window.addEventListener('resize', clickHandler);
    clickHandler();
    return () => {
      window.removeEventListener('resize', clickHandler);
    };
  }, [ref, ref.current]);

  return dims;
}
