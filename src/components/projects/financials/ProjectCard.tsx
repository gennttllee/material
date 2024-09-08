import React, { useEffect, useState, useMemo } from 'react';
import { IoEllipsisVertical } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import { ProjectCardProps } from './types';
import moment from 'moment';
import { postForm } from 'apis/postForm';
import useContractorDetails from 'Hooks/useContractorDetails';
import { convertToProper, truncateText } from 'components/shared/utils';
import { displayError, displayWarning } from 'Utils';
import { populate } from 'store/slices/financeSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import useRole from 'Hooks/useRole';
import { LoaderX } from 'components/shared/Loader';
import { centered } from 'constants/globalStyles';

const ProjectCard = ({
  name,
  end,
  start,
  status,
  submissionId,
  bid,
  bidType,
  register,
  index,
  autoload
}: ProjectCardProps) => {
  const { projectId } = useParams();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [contractor, setContractor] = useState<string>('');
  let winner = useContractorDetails(contractor, bidType);

  const navigate = useNavigate();
  let dispatch = useAppDispatch();
  const { isProfessional } = useRole();
  const getContractorImage = async () => {
    if (submissionId !== 'express-bid') {
      let { response, e } = await postForm('get', 'submissions/bid/' + bid);
      if (e) {
        register(false);
        if (isProfessional) setError(true);
      } else {
        let { data } = response;
        let bidder = data.data.filter((m: any) => m._id === submissionId)[0].bidder;

        setContractor((_) => bidder);
        register(true);
      }
    } else {
      let { response, e } = await postForm('get', 'bids/' + bid);
      if (response) {
        setContractor(response.data.data[0]?.invites[0]?.bidder);
      }
    }
  };
  useEffect(() => {
    getContractorImage();
  }, []);

  useEffect(() => {
    if (!winner.loading) {
      setLoading(false);
    }
  }, [winner]);

  const handleNavigation = async () => {
    setFetching(true);
    try {
      if (loading === false) {
        let { e, response } = await postForm('get', 'financials/?bidId=' + bid);

        if (e) {
          displayWarning('No POW has been created on this bid');
          // return;
        } else {
          let data = {
            ...response.data.data,
            bidName: name,
            contractor: winner?.details?.name
          };
          data.payments.reverse();
          dispatch(populate(data));
          navigate(`/projects/${projectId}/financials/details`);
        }
      } else {
        displayError('Fetching Contractor details,Please try again...');
      }
    } catch (error) {
      displayWarning('Could not fetch project Financials');
    }
    setFetching(false);
  };

  useEffect(() => {
    if (autoload && !loading) handleNavigation();
  }, [autoload, loading]);

  return (
    <div
      onClick={handleNavigation}
      className={`w-full rounded-lg p-6 bg-white cursor-pointer hover:border-borange hover:border `}>
      <div className="flex items-center justify-between">
        {loading ? (
          <LoaderX color="blue" />
        ) : contractor ? (
          <span className="flex items-center text-sm ">
            <span>{convertToProper(bidType)}: &nbsp;</span>
            {
              <span className="flex items-center">
                <span className=" text-bblack-0 font-semibold">
                  {truncateText(winner?.details?.name, 10)}
                </span>
                <span>
                  {winner.image && (
                    <img className="ml-2 rounded-full w-6 h-6" src={winner.image} alt="img" />
                  )}
                </span>
              </span>
            }
          </span>
        ) : (
          <span className={'px-2 py-0.5 rounded-full bg-bblue text-white ' + centered}>
            express-bid
          </span>
        )}
        <span className="rounded-full p-2 hover:bg-ashShade-0">
          {!fetching ? (
            <IoEllipsisVertical className="text-bash" size={16} />
          ) : (
            <div className=" border-y-borange border-l-borange border-r-transparent border-2 animate-spin w-4 h-4 rounded-full  bg-white"></div>
          )}
        </span>
      </div>
      <p className=" text-2xl font-semibold mb-6 mt-8">{name} Finance</p>
      <div className="w-full flex items-center justify-between"></div>
    </div>
  );
};

export default ProjectCard;
