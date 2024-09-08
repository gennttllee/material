import React, { useState, useEffect, useContext } from 'react';
import { toDecimalPlaceWithCommas } from './utils';
import { useAppSelector } from 'store/hooks';
import { StoreContext } from 'context';

interface Props {
  value: number;
  setter: any;
  className: string;
}
const addCommas = (x: number) => x.toLocaleString();
const removeCommas = (x: string = '0') => {
  return parseInt(x.replaceAll(/[,]/g, '')) || 0;
};
const NumberInput = ({ value, className, setter }: Props) => {
  const [sValue, setSValue] = useState<any>(addCommas(value));
  const { selectedProject } = useContext(StoreContext);
  useEffect(() => {
    if (sValue) {
      setter(removeCommas(sValue));
    }
  }, [sValue]);
  useEffect(() => {
    setSValue((_: any) => addCommas(value));
  }, [value]);
  return (
    <div className={className + ' flex '}>
      <span className="mr-0.5 text-ashShade-2">{selectedProject?.currency?.code}</span>
      <input
        className={' border-0 flex-1 outline-none'}
        pattern="/[0-9\,\.]+/"
        value={sValue}
        onChange={(e) => {
          if (e.target.value.endsWith('.')) {
            setSValue(addCommas(removeCommas(e.target.value + '00')));
          } else {
            setSValue(e.target.value === '' ? '0' : addCommas(removeCommas(e.target.value)));
          }
        }}
      />
    </div>
  );
};

export default NumberInput;
