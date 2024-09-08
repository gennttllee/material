import Loader, { LoaderX } from '../shared/Loader';
interface Props {
  next: () => void;
  prev: () => void;
  isfirst?: boolean;
  islast?: boolean;
  disabled?: boolean;
  loading?: boolean;
}
const NavButtons = ({ next, prev, isfirst, islast, disabled, loading }: Props) => {
  return (
    <div className="lg:self-end justify-between lg:justify-start flex space-x-4 mt-7">
      {isfirst ? null : (
        <button className="px-8 py-2 border border-[#5E6777] rounded-md" onClick={() => prev()}>
          Back
        </button>
      )}
      {islast ? null : (
        <button
          disabled={disabled ? true : false}
          onClick={() => next()}
          className={`px-8 py-2 text-white ${disabled ? ' bg-gray-400' : 'bg-bblue'}  rounded-md`}
        >
          {loading ? <LoaderX /> : <span>Next</span>}
        </button>
      )}
    </div>
  );
};

export default NavButtons;
