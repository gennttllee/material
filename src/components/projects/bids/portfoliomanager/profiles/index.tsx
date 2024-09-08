import { useState } from 'react';
import { toggle } from '../../../../../store/slices/profileSlice';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import ProfList from 'pages/projects/Home/Components/professionals/ProfList';
import { HiOutlineChevronLeft } from 'react-icons/hi';
import { Profs } from 'pages/projects/Home/Components/professionals/ProfList';
import { ContractorModal } from 'pages/projects/Home/Components/professionals/index';
const Index = () => {
  const [_modal, _setModal] = useState(false);
  const [viewing, setViewing] = useState<{
    id: string;
    type: 'contractor' | 'consultant';
  }>({
    id: '',
    type: 'consultant'
  });

  let dispatch = useAppDispatch();
  let selectedContractors = useAppSelector((store) => store.contractor);
  let bid = useAppSelector((m) => m.bid);
  return (
    <>
      {_modal && (
        <ContractorModal
          type={viewing.type}
          id={viewing.id}
          _setModal={(val: boolean) => _setModal(val)}
        />
      )}
      <div className="w-full h-full relative overflow-y-auto no-scrollbar">
        <div className="w-full sticky  top-0 bg-projectBg ">
          <button
            className="items-center  flex hover:text-borange hover:underline "
            onClick={() => dispatch(toggle())}
          >
            <HiOutlineChevronLeft size={16} />
            Back
          </button>
        </div>

        <div className="w-full flex justify-between items-center ">
          <p className="mt-9 lg:mt-3 mb-8 font-bold text-2xl">Profiles</p>
          <button
            onClick={() => dispatch(toggle())}
            disabled={selectedContractors.length === 0}
            className={`rounded-lg px-8 py-2  font-semibold border-2 ${
              selectedContractors.length === 0
                ? ' border-ashShade-4 text-bash'
                : 'bg-bblue text-white'
            }`}
          >
            {' '}
            Add to Bid
          </button>
        </div>
        <ProfList
          showSelector
          initialType={bid.type}
          handleModal={(x: boolean) => {
            _setModal(x);
          }}
          setViewing={(id: string, type: Profs) => {
            setViewing({ id, type });
          }}
        />
      </div>
    </>
  );
};

export default Index;
