import { hoverFade } from 'constants/globalStyles';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AiOutlineClose, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FetchImage } from 'components/shared/FetchImage';
import { Prototype, User } from 'types';
import useFetch from 'Hooks/useFetch';
import { StoreContext } from 'context';
import { BiEdit } from 'react-icons/bi';
import { getProfessional } from 'apis/user';
import PrototypeModal from './PrototypeModal';
import NewPrototypeModal from './NewPrototypeModal';
import { BsThreeDotsVertical } from 'react-icons/bs';
import useRole, { UserRoles } from 'Hooks/useRole';
import buildingIcon from 'assets/buildingType.svg';
import { deleteProtoType } from 'apis/prototypes';
import { useAppSelector } from 'store/hooks';
import { FiTrash2 } from 'react-icons/fi';
import { TbBed } from 'react-icons/tb';
import DeleteModal from 'components/shared/DeleteModal/DeleteModal';
import { BucketNames } from '../../../../constants';

export default function PrototypeCard(props: Prototype) {
  const { prototypeImages, projectName, projectType, description, owner, ...rest } = props;
  const { isOfType } = useRole();
  const [showMenu, setMenu] = useState(false);
  const [showModal, setModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { setContext } = useContext(StoreContext);
  const { load, successResponse } = useFetch<[User]>();
  const [showEditModal, setEditModal] = useState(false);
  const [showDeleteModal, setDeleteModal] = useState(false);
  const { load: loadDelete, isLoading } = useFetch<[User]>();
  const { _id: userId } = useAppSelector((state) => state.user);
  const uniqueClassName = `prototype${props._id}`;

  const toggleEditModal = () => {
    if (!showEditModal) {
      setModal(false);
    }
    setEditModal((prev) => !prev);
  };

  const toggleDeleteModal = () => {
    setDeleteModal((prev) => !prev);
  };

  const toggleMenu = () => {
    setMenu((prev) => !prev);
  };

  useEffect(() => {
    // click event that's in charge of
    // closing the modal
    document.addEventListener('click', (e: any) => {
      if (
        e.target &&
        (e.target.contains(menuRef.current) || !e.target.classList.contains(uniqueClassName))
      ) {
        setMenu(false);
      }
    });

    return () => {
      // clear the event
      document.removeEventListener('click', () => {
        setMenu(false);
      });
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    load(getProfessional(owner));
  }, []);

  const toggleModal = () => {
    setModal((prev) => !prev);
  };

  const featuredImage = useMemo(() => {
    return prototypeImages[Math.floor(Math.random() * prototypeImages.length)].key;
  }, [prototypeImages]);

  const handleDelete = () => {
    loadDelete(deleteProtoType(props._id)).then((res) => {
      if (res.status === 200) {
        /** remove the prototype from local data */
        setContext((prev) => ({
          ...prev,
          prototypes: prev.prototypes.filter((one) => one._id !== props._id)
        }));
      }
    });
  };

  const Menu = () => (
    <>
      <div
        ref={menuRef}
        className={
          `${
            showMenu ? 'inline' : 'hidden group-hover:inline'
          } ${uniqueClassName} bg-gray-200 shadow rounded-full p-1 absolute z-10 top-4 right-4` +
          hoverFade
        }
        onClick={toggleMenu}>
        {!showMenu ? (
          <BsThreeDotsVertical
            className={'text-gray-400 hover:text-gray-800 cursor-pointer ' + uniqueClassName}
          />
        ) : (
          <AiOutlineClose
            className={
              'text-gray-400 hover:text-gray-800 cursor-pointer !text-[8px]' + uniqueClassName
            }
          />
        )}
      </div>
      <DeleteModal
        {...{ isLoading }}
        title="Delete prototype"
        visible={showDeleteModal}
        toggle={toggleDeleteModal}
        deleteRequest={handleDelete}
      />
      {showMenu && (
        <div
          className={
            'absolute p-2 top-5 right-11 bg-white rounded-md shadow-md z-10 ' + uniqueClassName
          }>
          <div
            onClick={toggleEditModal}
            className={
              'flex items-center p-1 group hover:bg-blue-100 rounded-md ' + uniqueClassName
            }>
            <BiEdit
              className={
                'icon icon text-base text-gray-400 group-hover:text-bblue ' + uniqueClassName
              }
            />
            <label
              className={
                'mx-2 text-base text-gray-400 group-hover:text-bblue cursor-pointer ' +
                uniqueClassName
              }>
              Edit
            </label>
          </div>
          <div
            onClick={toggleDeleteModal}
            className={
              'flex items-center group hover:bg-red-100 p-1 mt-2 rounded-md' +
              hoverFade +
              uniqueClassName
            }>
            {isLoading ? (
              <AiOutlineLoading3Quarters className="icon animate-spin text-base text-gray-400 group-hover:text-red-700 cursor-pointer" />
            ) : (
              <FiTrash2
                className={
                  'icon text-base text-gray-400 group-hover:text-red-700 ' + uniqueClassName
                }
              />
            )}
            <label
              className={
                'mx-2 text-base text-gray-400 group-hover:text-red-700 cursor-pointer ' +
                uniqueClassName
              }>
              Delete
            </label>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      <div className={`relative group ${uniqueClassName}`}>
        {isOfType(UserRoles.Consultant) && userId === props.owner ? <Menu /> : null}
        <div
          onClick={toggleModal}
          className={uniqueClassName + hoverFade + 'overflow-hidden rounded-md relative'}>
          <div className="bg-blue-100 h-60 relative w-full">
            <FetchImage
              alt={projectName}
              src={featuredImage}
              key={uniqueClassName}
              className="w-full rounded-t h-full absolute left-0 top-0 object-cover"
            />
          </div>
          <div className="p-4 bg-white rounded-b">
            <p className="font-semibold text-base capitalize">{projectName}</p>
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                <TbBed className="text-bash text-base" />
                <p className="text-bash text-sm mx-1">
                  {rest.numberOfBedRooms} Bedroom
                  {rest.numberOfBedRooms > 1 && 's'}
                </p>
              </div>
              &bull;
              <div className="flex items-center">
                <img src={buildingIcon} alt="duplex" className="w-4 h-4 mx-1" />
                <p className="text-bash text-sm capitalize">{projectType}</p>
              </div>
            </div>
            <div className="flex items-center">
              <p className="text-sm font-Medium">By</p>
              <div className="bg-pbg p-1 rounded-full ml-2">
                {successResponse && successResponse[0]?.businessInformation.logo ? (
                  <FetchImage
                    decoding="sync"
                    bucketName={BucketNames[0]}
                    className="rounded-full w-5 h-5"
                    src={successResponse[0].businessInformation.logo}
                  />
                ) : null}
              </div>
              <p className="font-Medium text-black ml-1 mr-2">
                {successResponse ? successResponse[0]?.name : 'Loading...'}
              </p>
            </div>
          </div>
        </div>
      </div>
      {showEditModal && (
        <NewPrototypeModal
          addPrototype={(prototype) => {
            setContext((prev) => ({
              ...prev,
              prototypes: prev.prototypes.map((one) =>
                one._id === prototype._id ? prototype : one
              )
            }));
            toggleEditModal();
          }}
          initialValue={props}
          visible={showEditModal}
          toggle={toggleEditModal}
        />
      )}
      {showModal && (
        <PrototypeModal
          ref={modalRef}
          {...{ toggleModal, toggleEditModal, ...props }}
          logo={successResponse ? successResponse[0]?.businessInformation.logo : ''}
          name={successResponse ? successResponse[0]?.name : ''}
          consultant={successResponse && successResponse[0]}
        />
      )}
    </>
  );
}
