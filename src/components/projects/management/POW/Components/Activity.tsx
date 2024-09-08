import React, { useContext, useEffect } from 'react';
import { SubtaskActivity } from '../../types';
import { centered, flexer } from 'constants/globalStyles';
import Moment from 'react-moment';
import useFetch from 'Hooks/useFetch';
import { User } from 'types';
import { getProfessionalOrManager } from 'apis/user';
import { PMStoreContext } from '../../Context';
import { useParams } from 'react-router-dom';
import { isProfessional } from 'components/projects/Team/Views/Components/MemberList';
import { Image } from 'components/shared/Image';

interface ActivityProps extends SubtaskActivity {
  index: number;
  hasShortDate?: boolean;
}

const Activity = ({
  index,
  action,
  date,
  _id,
  performedBy,
  hasShortDate = false
}: ActivityProps) => {
  const { load, isLoading, successResponse: fetchedPerformer } = useFetch<User>();

  useEffect(() => {
    load(getProfessionalOrManager(performedBy));
  }, []);

  return (
    <div key={_id} className={`flex ${!!index && 'mt-4'}`}>
      <div
        key={_id}
        className={`${
          isProfessional(fetchedPerformer?.type || '')
            ? '!w-10 !h-10'
            : 'bg-white border px-2 w-10 h-10'
        } mr-3 rounded-full bg-white flex-shrink-0 ${isLoading && 'animate-pulse'}`}
      >
        {isProfessional(fetchedPerformer?.type || '') ? (
          <Image
            className="w-full h-full"
            alt="icon"
            src={fetchedPerformer?.businessInformation.logo}
          />
        ) : (
          <p className="text-bash font-Demibold text-sm transform translate-y-2 truncate">
            {fetchedPerformer?.firstName?.charAt(0)}
            {fetchedPerformer?.lastName?.charAt(0)}
          </p>
        )}
      </div>
      <div className="overflow-hidden">
        <p className="truncate" title={action}>
          <span className="font-Demibold">
            {!fetchedPerformer
              ? null
              : isProfessional(fetchedPerformer.type)
                ? fetchedPerformer?.name
                : fetchedPerformer?.firstName + ' ' + fetchedPerformer?.lastName}
          </span>{' '}
          <span className="text-bash">{action}</span>
        </p>
        <Moment
          className="text-bash text-sm font-Medium"
          format={hasShortDate ? 'h:mm A' : 'MMMM Do YYYY, h:mm a'}
        >
          {date}
        </Moment>
      </div>
    </div>
  );
};

export default Activity;
