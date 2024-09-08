import React from 'react';

interface Prop {
  title: string;
  description: string;
}

const Title = ({ title, description }: Prop) => {
  return (
    <div className="md:w-1/2 w-full">
      <p className=" font-bold">{title}</p>
      <p className="text-justify">{description}</p>
    </div>
  );
};

export default Title;
