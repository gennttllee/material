import React from 'react';

interface Prop {
  children: React.ReactElement;
  closer: () => any;
  classes?: string;
}

const SuperModal = ({ children, closer, classes }: Prop) => {
  return (
    <div
      onClick={() => closer()}
      className={`w-screen h-screen ${classes} z-[9999] fixed top-0 left-0 `}
    >
      {children}
    </div>
  );
};

export default SuperModal;
