import { useState } from 'react';
import Document from './Document';
import { HiPlus } from 'react-icons/hi';
import Modal from './Modal';
import { BsChevronDown, BsChevronRight } from 'react-icons/bs';
import { TbInfoCircle } from 'react-icons/tb';
import { AiOutlineFile } from 'react-icons/ai';
import { useNavigate, useLocation } from 'react-router-dom';
import { checkAvailability } from '../TabComponent';
interface Prop {
  docs: any[];
  isAdditional?: boolean;
  collapsed?: boolean;
}
const BidDocuments = ({ docs, isAdditional }: Prop) => {
  const [collapsed, setCollapsed] = useState(isAdditional ? true : false);
  const [modal, setModal] = useState(false);
  let { pathname } = useLocation();
  let navigate = useNavigate();
  const getDefaultDocs = () => {
    if (isAdditional) {
      return docs.length > 0 ? docs : [];
    } else {
      return docs.length > 0 ? [...docs] : [{ name: 'Bill of Quantities', requiresResponse: true }];
    }
  };
  //eslint-disable-next-line
  const [doc, setDoc] = useState<any>(getDefaultDocs());
  const updateDocs = (doc: { name: string; input: true; isAddtional?: string }) => {
    let newdocs = [...docs, doc];

    setDoc(newdocs);
  };

  return (
    <>
      {modal ? (
        <Modal
          isAdditional={isAdditional ? isAdditional : undefined}
          setter={updateDocs}
          closer={() => setModal(!modal)}
        />
      ) : null}
      <div className="p-6 lg:w-1/2 bg-white rounded-lg mb-3">
        <div
          onClick={() => {
            setCollapsed(!collapsed);
          }}
          className="flex justify-between font-semibold items-center"
        >
          <span className="text-lg group relative flex items-center  text-bblack-1">
            {isAdditional ? 'Contract documents' : 'Bid documents'}

            <span className="ml-3">
              <TbInfoCircle className=" cursor-pointer" color="#C8CDD4" />
              {isAdditional ? (
                <span className="absolute top-[calc(50%+20px)] hidden group-hover:flex  -translate-x-1/2 w-48 p-2 bg-black rounded-lg text-white text-xs before:content-[''] before:absolute before:left-1/2 before:-top-[16px] after:translate-x-1/2 before:border-8 before:border-x-transparent before:border-t-transparent before:border-b-black">
                  These documents are reserved for just the bid winner
                </span>
              ) : null}
            </span>
          </span>
          <span className={` cursor-pointer flex items-center text-borange `}>
            <span className="ml-3">
              {!collapsed ? (
                <BsChevronRight color="#9099A8" size={16} />
              ) : (
                <BsChevronDown color="#9099A8" size={16} />
              )}
            </span>
          </span>
        </div>
        <div className="w-full justify-end hover:cursor-pointer flex my-4">
          <span
            className="flex hover:underline text-borange items-center"
            onClick={() => setModal(true)}
          >
            <HiPlus size={16} className=" mr-3" /> <span className=" text-sm">Add Document</span>
          </span>
        </div>
        <div className={`${collapsed ? 'hidden' : ''} mb-3`}>
          {docs &&
            docs.map((m: any, i: number) => (
              <Document
                key={i}
                index={i}
                doc={m}
                name={m.name}
                requiresResponse={m.requiresResponse ? m.requiresResponse : false}
              />
            ))}
          {docs.length < 1 && isAdditional && (
            <div className="w-full flex flex-col items-center">
              <AiOutlineFile color="#9099A8" size={24} />
              <span className="text-bash mt-3 mb-6 ">No documents created yet</span>
            </div>
          )}
        </div>

        {!isAdditional && (
          <button
            disabled={!isAdditional && !checkAvailability(docs)}
            onClick={() => {
              let path = pathname.split('/');
              path.pop();
              navigate(path.join('/') + '/invite');
            }}
            className={`${collapsed ? 'hidden' : ''} ${
              !isAdditional && !checkAvailability(docs)
                ? 'bg-ashShade-9 text-bash border border-ashShade-4'
                : 'bg-bblue text-white'
            } w-full rounded-lg py-2   text-center cursor-pointer`}
          >
            Next
          </button>
        )}
      </div>
    </>
  );
};

export default BidDocuments;
