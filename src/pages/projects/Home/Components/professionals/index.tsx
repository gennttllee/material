import { useState } from 'react';
import { HiOutlineChevronLeft } from 'react-icons/hi';
import { AiOutlineClose } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import SuperModal from 'components/shared/SuperModal';
import ContractorFrame from 'components/shared/ContractorFrame';
import ProfList, { Profs } from './ProfList';
import UserTable from './UserTable';
import { useAppSelector } from 'store/hooks';
import { tHeaders } from './constants';

const Index = () => {
  // let dispatch = useAppDispatch();
  let navigate = useNavigate();
  let contractors = useAppSelector((m) => m.contractor);
  const [_modal, _setModal] = useState(false);
  const [viewing, setViewing] = useState<{
    id: string;
    type: 'contractor' | 'consultant';
  }>({
    id: '',
    type: 'consultant'
  });
  return (
    <>
      {_modal && (
        <ContractorModal
          type={viewing.type}
          id={viewing.id}
          _setModal={(val: boolean) => _setModal(val)}
        />
      )}
      <div className="w-full h-full  relative overflow-y-auto no-scrollbar">
        <div className="w-full sticky mt-12  ">
          <button
            className="items-center  flex  hover:underline "
            onClick={() => {
              navigate(-1);
            }}>
            <HiOutlineChevronLeft size={16} />
            Back
          </button>
        </div>

        <h1 className="mt-3 font-semibold text-3xl">Professionals</h1>
        <ProfList
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

interface ContractorModalProps {
  _setModal: (x: boolean) => void;
  id: string;
  type: Profs;
}

const ContractorModal = ({ _setModal, id, type }: ContractorModalProps) => {
  return (
    <SuperModal classes="bg-white  px-10 py-5 flex flex-col" closer={() => _setModal(false)}>
      <div className="w-full h-full  flex-col flex">
        <div className="w-full flex mb-4   items-center justify-end overflow-y-auto ">
          <span
            className=" bg-white rounded-full w-8 h-8 flex items-center justify-center"
            onClick={() => _setModal(false)}>
            <AiOutlineClose size={24} />
          </span>
        </div>
        <div className="bg-white flex-1 rounded-md overflow-y-auto">
          <ContractorFrame profId={id} type={type} />
        </div>
      </div>
    </SuperModal>
  );
};

export { ContractorModal };
export default Index;
