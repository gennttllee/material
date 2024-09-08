import React, { createElement, useContext } from 'react';
import { GroupCardProps } from './types';
import { toDecimalPlaceWithCommas } from 'components/shared/utils';
import { useAppSelector, useAppDispatch } from 'store/hooks';
import { openModal } from 'store/slices/financeSlice';
import { hoverFade } from 'constants/globalStyles';
import { StoreContext } from 'context';

const GroupCard = ({ title, btn, btntitle, amount, bgColor, icon, iconColor }: GroupCardProps) => {
  const { selectedProject } = useContext(StoreContext);
  const user = useAppSelector((m) => m.user);
  const dispatch = useAppDispatch();
  return (
    <div className="rounded-md w-full p-6 bg-white">
      <div className="w-full flex items-start justify-between">
        <div
          style={{ backgroundColor: bgColor }}
          className=" w-14 h-14 flex items-center justify-center rounded-full  ">
          {createElement(icon, { size: 24, color: iconColor })}
        </div>
        {!!btn && (
          <button
            onClick={() => {
              if (btntitle === 'Update budget') {
                dispatch(openModal({ name: 'budget', isEditing: false }));
              } else if (btntitle === 'Record Expenditure') {
                dispatch(openModal({ name: 'expenditure', isEditing: false }));
              }
            }}
            className={
              ` bg-blue-100 font-Medium text-xs text-bblue ${
                btntitle === 'Update budget' && user.role !== 'portfolioManager' ? 'hidden' : ''
              } rounded-lg px-3 py-1` + hoverFade
            }>
            {btntitle}
          </button>
        )}
      </div>
      <div className="text-bblack-1 font-semibold mt-10">
        <p>{title}</p>
        <p className="text-3xl text-bash">
          {selectedProject.currency?.code} {toDecimalPlaceWithCommas(amount)}
        </p>
      </div>
    </div>
  );
};

export default GroupCard;
