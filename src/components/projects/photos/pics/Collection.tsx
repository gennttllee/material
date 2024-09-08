import React from 'react';
import { picItem } from '../constants';
import DrawingCard from './DrawingCard';
import ListCard from './ListCard';
import { subDays } from 'date-fns';

interface Prop {
  label: string;
  picArr: picItem[];
  islist: boolean;
}

const Collection = ({ label, picArr, islist }: Prop) => {
  let today = new Date().toDateString();
  let yesterday = subDays(new Date(), 1).toDateString();
  return (
    <div className="mb-8">
      <p className="font-semibold mb-4">
        {label === today ? 'Today' : label === yesterday ? 'Yesterday' : label}
      </p>
      {!islist ? (
        <div className="grid w-full grid-cols-1  sm:grid-cols-2 gap-5 lg:grid-cols-3 xl:grid-cols-4 ">
          {picArr.map((m: any, i: number) => (
            <DrawingCard key={m.url} item={m} />
          ))}
        </div>
      ) : (
        <div className="w-full bg-white ">
          <div>
            {picArr.map((m: any, i: number) => (
              <ListCard key={m.url} item={m} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Collection;
