import SuperModal from './SuperModal';
import ContractorFrame from './ContractorFrame';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { close } from '../../store/slices/contractorProfileSlice';
import { IoCloseSharp } from 'react-icons/io5';
import { convertToProper } from './utils';

const ContractorProfile = () => {
  const dispatch = useAppDispatch();
  const profileModal = useAppSelector((m) => m.contractorModal);

  return (
    <div
      className={`absolute z-[100] left-0 top-0 w-screen h-screen ${
        !profileModal.display ? 'hidden' : ''
      }`}
    >
      <SuperModal
        classes="flex  bg-ashShade-5 justify-center  "
        closer={() => {
          dispatch(close());
        }}
      >
        <div
          className="w-4/5 h-full overflow-y-auto pt-10 no-scrollbar   justify-center relative"
          onClick={(e) => e.stopPropagation()}
        >
          <span
            className="w-12 h-12 cursor-pointer absolute right-0 flex top-0 bg-white rounded-full justify-center items-center  "
            onClick={() => {
              dispatch(close());
            }}
          >
            <IoCloseSharp color="#C8CDD4" size={24} />
          </span>
          <p className="font-bold">{convertToProper(profileModal.type)} Profile</p>
          <ContractorFrame profId={profileModal.profId} type={profileModal.type} />
        </div>
      </SuperModal>
    </div>
  );
};

export default ContractorProfile;
