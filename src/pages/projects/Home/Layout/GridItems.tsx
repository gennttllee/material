import Button from 'components/shared/Button';
import { centered, flexer, hoverFade, responsiveFlex } from 'constants/globalStyles';
import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import { TbFolderPlus, TbHomePlus, TbPlus } from 'react-icons/tb';
import { useLocation } from 'react-router-dom';
import { Path } from '../Components/Header';
import NewProjectModal from '../Components/NewProject';
import NewPrototypeModal from '../Components/NewPrototypeModal';
import useRole, { UserRoles } from 'Hooks/useRole';
import { StoreContext } from 'context';
import { searchArrayOfObjects } from 'helpers/search';
import StatusFilter from 'components/shared/StatusFilter';
import { Brief, StatusEnum } from 'types';
import AddClusterModal from '../Components/AddClusterModal';
import ClusterCard from '../Components/ClusterCard';
import useClusters from 'Hooks/useClusters';
import { useAppSelector } from 'store/hooks';
import { LoaderX } from 'components/shared/Loader';
import MoveToClusterModal from '../Components/MoveToClusterModal';

interface Props<T> {
  data: T[];
  Card: FC<any>;
  showMore?: boolean;
  isLoading?: boolean;
  handleMore?: () => void;
  paginationEnabled?: boolean;
  label?: 'Getting started' | Path;
  gridClassName?: HTMLDivElement['className'];
}

type modalType = 'project' | 'prototype' | 'cluster' | 'add-to-cluster';

function GridItems<T>({
  data,
  label,
  Card,
  handleMore,
  gridClassName,
  showMore = true,
  isLoading = false,
  paginationEnabled = false
}: Props<T>) {
  const [localData, setLocalData] = useState<Props<T>['data']>([]);
  const [projectFilter, setProjectFilter] = useState<StatusEnum>();
  const { setContext, searchQuery } = useContext(StoreContext);
  let { getClusters } = useClusters(true);

  const { isOfType, isProfessional } = useRole();
  const [pageIndex, setPageIndex] = useState(0);
  const [showModal, setModal] = useState<{
    status: boolean;
    type?: modalType;
  }>({ status: false });
  const { pathname } = useLocation();
  const { canCreateBrief } = useRole();
  const { data: clusterList, loading } = useAppSelector((m) => m.cluster);

  const pageItemCount = useMemo(() => (canCreateBrief ? 15 : 16), [canCreateBrief]);

  const filteredData = useMemo(() => {
    let _localdata = [...localData.filter((m: any) => !m.clusterId)] as unknown as Brief[];
    if (label === 'all' && projectFilter) {
      // @ts-ignore
      return _localdata.filter((project) => project.status === projectFilter);
    }
    return _localdata;
  }, [localData, projectFilter]);

  const pageCount = useMemo(() => {
    return Number(Math.ceil(filteredData.length / pageItemCount));
  }, [filteredData]);

  const pageData = useMemo(() => {
    return paginationEnabled
      ? [...filteredData].splice(pageItemCount * pageIndex, pageItemCount)
      : filteredData;
  }, [pageCount, pageIndex, filteredData]);

  useEffect(() => {
    setLocalData(searchArrayOfObjects(data, searchQuery));
  }, [data, searchQuery]);

  useEffect(() => {
    if (searchQuery && pageIndex) {
      // reset pagination when we have a searchQuery
      setPageIndex(0);
    }
  }, [searchQuery, pageIndex]);
  useEffect(() => {
    if (clusterList.length === 0) {
      getClusters();
    }
  }, []);
  const toggleModal = (type?: modalType) => {
    setModal((prev) => ({ status: !prev.status, type }));
  };

  const ModalView = () => {
    switch (showModal.type) {
      case 'project':
        return <NewProjectModal visible={showModal.status} toggle={() => toggleModal()} />;
      case 'prototype':
        return (
          <NewPrototypeModal
            addPrototype={(prototype) => {
              /** add the newly created prototype */
              setContext((prev) => ({
                ...prev,
                prototypes: [...prev.prototypes, prototype]
              }));
              toggleModal();
            }}
            visible={showModal.status}
            toggle={() => toggleModal()}
          />
        );
      case 'cluster':
        return <AddClusterModal closer={() => toggleModal(undefined)} />;
      default:
        return <></>;
    }
  };
  const [buttonOptions, setButtonOptions] = useState(false);
  const handleOptions = (val: string) => {
    toggleModal(val as any);
    setButtonOptions(false);
  };
  return (
    <div className="w-full mt-10 md:mt-20 ">
      <div className={flexer + 'mb-6'}>
        <h2 className="font-semibold text-2xl capitalize">
          {label === 'all' ? 'Projects' : label}
        </h2>
        <div className="flex items-center">
          {showMore && (
            <p onClick={handleMore} className={'text-bblue font-Medium text-sm' + hoverFade}>
              View more
            </p>
          )}
          {pathname.includes('all') && canCreateBrief ? (
            <span className="relative">
              <Button
                text="Create New"
                className="ml-5 hidden md:flex"
                onClick={() => setButtonOptions(!buttonOptions)}
                LeftIcon={<TbPlus className="mr-2 text-white" />}
              />
              {buttonOptions && (
                <span className=" my-2  hover:cursor-pointer rounded-md overflow-hidden absolute left-5 top-10 z-10 p-2 flex flex-col gap-y-2 bg-white shadow-bnkle">
                  <span
                    onClick={() => handleOptions('project')}
                    className=" rounded-md hover:bg-ashShade-0 items-center flex text-bash p-2">
                    <TbHomePlus color="#9099A8" className=" mr-4" />
                    {`Create Project`}
                  </span>
                  <span
                    onClick={() => handleOptions('cluster')}
                    className=" rounded-md hover:bg-ashShade-0 p-2 items-center flex text-bash">
                    <TbFolderPlus color="#9099A8" className=" mr-4" />
                    {`Create Cluster`}
                  </span>
                </span>
              )}
            </span>
          ) : null}

          {pathname.includes('types') && isOfType(UserRoles.Consultant) ? (
            <Button
              className="ml-5"
              text="Create Prototype"
              onClick={() => toggleModal('prototype')}
              LeftIcon={<TbPlus className="mr-2 text-white" />}
            />
          ) : null}

          {pathname.includes('all') && (
            <>
              <div className="mx-3" />
              <StatusFilter
                value={projectFilter}
                options={Object.values(StatusEnum)}
                onChange={(val) => {
                  setProjectFilter(val as StatusEnum);
                  setPageIndex(0);
                }}
              />
            </>
          )}
        </div>
      </div>
      {pathname.includes('all') && (
        <>
          {clusterList.length > 0 && !loading && (
            <div className=" mb-10">
              <div>
                <p className=" font-semibold text-lg ">Clusters</p>
                {loading ? (
                  <div className="w-full bg-white rounded-md my-4 p-10 items-center flex justify-center">
                    <LoaderX color="blue" />
                  </div>
                ) : clusterList.length === 0 ? (
                  <div className="w-full text-xl font-semibold bg-white rounded-md my-4 p-10  flex text-center">
                    No clusters found
                  </div>
                ) : (
                  <div
                    className={` mt-4 grid gap-5 grid-cols-1  md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 `}>
                    {clusterList.map((m, i) => (
                      <ClusterCard key={i} {...m} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          {clusterList.length > 0 && !loading && (
            <p className=" font-semibold text-lg mb-4">Projects</p>
          )}
        </>
      )}
      <div
        className={
          `grid gap-5 grid-cols-1  md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 ` + gridClassName
        }
        onClick={(ev) => ev.stopPropagation()}>
        {canCreateBrief && (
          <div
            className={
              centered +
              'flex-col py-6 px-15 bg-bblue rounded' +
              ` ${(label !== 'all' || isProfessional) && 'hidden'} ` +
              hoverFade
            }
            onClick={() => toggleModal('project')}>
            <TbPlus className="text-6xl mb-2 text-white" />
            <p className="font-Medium text-sm text-white">Create a project</p>
          </div>
        )}
        {pageData[0]
          ? React.Children.toArray(
              pageData.map((item: any, i: number) => <Card key={i} {...item} />)
            )
          : isLoading
            ? [1, 2, 3].map((_) => (
                <div key={_} className="bg-gray-200 rounded animate-pulse p-4">
                  <div className={flexer}>
                    <div className="h-4 bg-pbg w-[10%] rounded"></div>
                    <div className="h-4 bg-pbg w-[85%] rounded"></div>
                  </div>
                  <div className="h-20 bg-pbg w-full rounded mt-5"></div>
                </div>
              ))
            : null}
      </div>
      <h1
        className={` ${
          filteredData[0] || isLoading ? 'hidden' : ''
        } font-Medium w-full text-lg text-bash capitalize text-center`}>
        {/* No {label === 'all' ? 'Projects' : label} found */}
      </h1>
      {paginationEnabled && pageCount > 1 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 my-10">
          <Button
            text="Previous"
            className="w-full md:w-fit"
            type={pageIndex < 1 ? 'muted' : 'transparent'}
            onClick={(ev) => {
              ev?.stopPropagation();
              setPageIndex((prev) => (prev -= 1));
            }}
          />
          <div className="flex gap-2 items-center overflow-x-scroll">
            {Array.from({ length: pageCount }).map((_, index) => (
              <button
                className={` ${
                  pageIndex === index ? 'bg-bblue text-white' : 'text-black hover:bg-pbg'
                } font-Medium py-1 px-3 rounded `}
                onClick={(ev) => {
                  ev?.stopPropagation();
                  setPageIndex(index);
                }}>
                {index + 1}
              </button>
            ))}
          </div>
          <Button
            text="Next"
            className="w-full md:w-fit"
            type={pageIndex === pageCount - 1 || !pageCount ? 'muted' : 'transparent'}
            onClick={(ev) => {
              ev?.stopPropagation();
              setPageIndex((prev) => (prev += 1));
            }}
          />
        </div>
      )}
      {ModalView()}
    </div>
  );
}

export default GridItems;
