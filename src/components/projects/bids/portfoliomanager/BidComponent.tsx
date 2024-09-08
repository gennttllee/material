import { convertToProper } from '../../../shared/utils';
interface Prop {
  index: number;
  setter: any;
  selected: boolean;
  name: string;
}

const BidComponent = ({ index, name, setter, selected }: Prop) => {
  return (
    <span
      className={`p-2 rounded-lg m-2 cursor-pointer ${
        !selected ? 'border-bblue border text-bblue' : 'bg-green-500 text-white'
      } `}
      onClick={() => setter(index)}
    >
      {convertToProper(name)}
    </span>
  );
};

export default BidComponent;
