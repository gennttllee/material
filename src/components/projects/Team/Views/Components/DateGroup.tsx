import React, { useRef, useEffect } from 'react';
import Message from './Message';
import { MessageEvent } from 'store/slices/chatsSlice';
import useOnScreen, { usePosition } from './OnScreen';
import { isVisible } from '@testing-library/user-event/dist/utils';

interface Props {
  messages: MessageEvent[];
  date: string;
  firstPending?: MessageEvent;
  setOnscreen?: any;
  topRef: React.RefObject<any>;
}

const DateGroup = ({ messages, topRef, date, firstPending, setOnscreen }: Props) => {
  let ref = useRef<HTMLDivElement>(null);
  let position = usePosition(ref, topRef);
  useEffect(() => {
    let { rootBounds, boundingClientRect } = position;
    if (rootBounds && boundingClientRect) {
      let top = rootBounds.y + boundingClientRect.y;
      let height = boundingClientRect?.height;
      let c1 = rootBounds.y > boundingClientRect.y;
      let c2 = top + height >= 0;
      if (c1 && c2) {
        setOnscreen(date);
      }
    }
  }, [position]);

  return (
    <div ref={ref} className="w-full mb-2 py-3">
      {date && (
        <div className="w-full   flex relative justify-center items-center mb-2">
          <div className="border flex-1 border-ashShade-0 rounded-full"></div>

          <span className="absolute font-light text-xs rounded-full text-bblack-1 border border-ashShade-0 self-center bg-white  px-3 py-1">
            {date}
          </span>
        </div>
      )}
      <div className="w-full flex flex-col">
        {messages.map((m, i) => (
          <Message isFirstPending={firstPending?._id === m._id} {...m} key={m._id} />
        ))}
      </div>
    </div>
  );
};

export default DateGroup;
