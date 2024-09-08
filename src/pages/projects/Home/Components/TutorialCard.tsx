import { hoverFade } from 'constants/globalStyles';
import React from 'react';
import { TbPlayerPlayFilled } from 'react-icons/tb';

export interface GettingStartedProps {
  label: string;
  image: string;
}

export default function TutorialCard({ label, image }: GettingStartedProps) {
  return (
    <div className={hoverFade + 'relative group'}>
      <img
        alt={label}
        decoding="async"
        loading="lazy"
        src={image}
        className="w-full object-cover object-left-top rounded"
      />
      <p className="font-semibold text-lg capitalize mt-4">{label}</p>
      <div className="hidden group-hover:block absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-3">
        <TbPlayerPlayFilled className="text-bblue text-lg" />
      </div>
    </div>
  );
}
