import React from 'react';
import { repo } from '../constants';
import FolderCard from './FolderCard';

const Index = () => {
  return (
    <div className="w-full ">
      <p className=" text-2xl font-semibold mb-5">Document Repo</p>
      <div className="w-full grid grid-cols-4 gap-5">
        {repo.map((m) => (
          <FolderCard isNew={m.isNew} name={m.name} />
        ))}
      </div>
    </div>
  );
};

export default Index;
