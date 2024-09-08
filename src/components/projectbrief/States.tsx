import { states } from './constants';
import SelectBox from '../shared/SelectBox';

interface Prop {
  state: string;
  setter: any;
}
let createOptions = () => {
  let arr = [];
  for (let k of states) {
    arr.push({ value: k, label: k });
  }
  return arr;
};

const States = ({ state, setter }: Prop) => {
  return (
    <>
      <SelectBox
        setter={setter}
        state={state}
        options={createOptions()}
        placeholder={'Select Option'}
      />
    </>
  );
};

export default States;
