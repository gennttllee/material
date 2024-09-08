import React from 'react';
import nocontent from 'assets/nocontent.svg';
import { Button } from 'react-day-picker';

interface Prop {
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
  onClick?: () => any;
  showBtn?: boolean;
}
const Index = ({ title, subtitle, onClick, buttonLabel, showBtn = true }: Prop) => {
  return (
    <div className="w-full h-full flex flex-col items-center">
      <img loading="lazy" decoding="async" src={nocontent} alt="" className="w-64" />
      <p className="font-semibold mt-6 mb-2 text-2xl text-bblack-0">{title}</p>
      <p className=" text-ashShade-1 text-center">{subtitle}</p>

      {!!showBtn && (
        <button
          onClick={() => {
            if (onClick) {
              onClick();
            }
            return;
          }}
          className="py-2 rounded-lg bg-bblue px-6 mt-8 text-white"
        >
          {buttonLabel}
        </button>
      )}
    </div>
  );
};

export default Index;
