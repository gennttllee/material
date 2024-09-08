import React from 'react';
import { formatWithComma } from 'Utils';

interface ViewDetailsProps {
  s_n: any;
  date: string;
  material: string;
  quantity: number;
  unit: string;
  rate?: number;
  amount?: number;
  description?: string;
  _id: string;
  vendor?: string;
  category?: string;
  notes?: string;
  acknowledgedBy: string;
  orderNumber?: string;
}

const ViewDetails: React.FC<ViewDetailsProps> = ({
  orderNumber,
  date,
  material,
  quantity,
  unit,
  vendor,
  category,
  acknowledgedBy,
  notes
}) => {
  return (
    <div className="absolute z-50 w-[440px] h-[550px] right-12 rounded-lg  bg-white my-1  text-sm  shadow-custom outline-none   gap-4 opacity-100   ">
      <div className="text-#000000 text-[22px] px-5 pt-6 font-semibold ">
        <h4 className="font-semibold  text-[#222B34]">Item details</h4>
      </div>
      <div className="content">
        <div className="details bg-pbg py-2 my-5 mx-5 px-2  outline-none rounded-md">
          <div className="flex capitalize  text-[14px] px-2 py-3 leading-5 justify-between">
            <p className="font-semibold  text-[#222B34]  ">Name</p>
            <p className="text-[#77828D]">{material}</p>
          </div>
          <hr />
          <div className="flex capitalize  text-[14px] px-2 py-3 leading-5 justify-between">
            <p className="font-semibold  text-[#222B34]  ">Order Number</p>
            <p className="text-[#77828D]">{orderNumber}</p>
          </div>
          <hr />
          <div className="flex capitalize text-[14px]  px-2 py-3 leading-5 justify-between">
            <p className="font-semibold  text-[#222B34]">Quantity</p>
            <p className="text-[#77828D]">{formatWithComma(quantity)}</p>
          </div>
          <hr />
          <div className="flex capitalize text-[14px] px-2 py-3 leading-5 justify-between">
            <p className="font-semibold  text-[#222B34]">unit</p>
            <p className="text-[#77828D]">{unit}</p>
          </div>
          <hr />
          <div className="flex capitalize text-[14px] px-2 py-3 leading-5 justify-between">
            <p className="font-semibold  text-[#222B34]">vendor</p>
            <p className="text-[#77828D]">{vendor}</p>
          </div>
          <hr />
          <div className="flex capitalize text-[14px] px-2 py-3 leading-5 justify-between">
            <p className="font-semibold  text-[#222B34]">date supplied</p>
            <p className="text-[#77828D]">{date}</p>
          </div>
          <hr />
          <div className="flex capitalize text-[14px] px-2 py-3 leading-5 justify-between">
            <p className="font-semibold  text-[#222B34]">category</p>
            <p className="text-[#77828D]">{category}</p>
          </div>
          <hr />
          <div className="flex capitalize text-[14px] px-2 py-3 leading-5 justify-between">
            <p className="font-semibold  text-[#222B34]">acknowledged By</p>
            <p className="text-[#77828D]">{acknowledgedBy}</p>
          </div>
        </div>
        <div className="note px-5 pb-4 mt-1 ">
          <p className="font-semibold  text-[#222B34] text-[14px]">Notes</p>
          <p className="text-[#77828D] pt-2 pb-6 mb-4  leading-5">{notes}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;
