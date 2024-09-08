import React, { useEffect } from 'react';
import { useContext, useState } from 'react';
import { StoreContext } from 'context';
import { postForm } from 'apis/postForm';
import { addAllMembers, addMember, clear, setExact, setLoading } from 'store/slices/teamSlice';
import { useDispatch } from 'react-redux';
import { isCompany } from './roleFunctions';
import { useAppSelector } from 'store/hooks';
import { GetDownloadSignedUrls, GetUploadSignedUrls } from 'apis/AwsFiles';
import { BucketNames } from '../constants';
import { Team } from 'components/projects/Team/Views/Components/ChatsView';

const useTeamMembers = () => {
  let dispatch = useDispatch();
  const { data, selectedProjectIndex, selectedProject } = useContext(StoreContext);
  const fetchAllTeamMemberDetails = async () => {
    //   setLoading(true);
    dispatch(setExact({ loading: true, data: {} }));
    let projectId = selectedProject?._id;
    let members = selectedProject?.team || [];
    let isProfessional = (s: string) => ['contractor', 'consultant'].includes(s);

    let uniqueMembers: Team[] = [];

    members
      .filter((m) => m?.id)
      .forEach((m) => {
        let found = uniqueMembers.find((k) => {
          if (!m.id) return false;
          if (m?._id) {
            return k?.id === m?.id;
          }
          return false;
        });
        if (!found) {
          uniqueMembers.push(m);
        }
      });

    let all = await Promise.all(
      uniqueMembers.map(async (m) => {
        let { e, response } = await postForm(
          'get',
          `users/user-and-professional/${m.id}`,
          {},
          `iam`
        );
        if (response) {
          let data = response.data.data;
          if (!isCompany(data.rolename)) {
            data.name = `${data?.firstName + ' ' + data?.lastName}`;
          }
          let nameSplit = (data?.firstName + ' ' + data?.lastName)?.split(' ') || '';
          data.initials = isProfessional(data.rolename)
            ? data.name.slice(0, 2)
            : `${nameSplit[0]?.toUpperCase()[0]}${nameSplit[1]?.toUpperCase()[0]}`;

          data.prole = m.role;

          if (isCompany(data.rolename)) {
            data.logo = data?.businessInformation?.logo
              ? 'https://bnkle-iam-images.s3.eu-west-1.amazonaws.com/' +
                data?.businessInformation?.logo
              : data.logo;
          } else {
            if (data.logo) {
              let logo = await GetDownloadSignedUrls(data.logo, BucketNames[1]);
              data.logo = logo?.data?.url || '';
            }
          }

          return data;
        }
      })
    );

    all = all.filter((m) => m?.name !== 'General');

    all.push({
      role: 'general',
      id: projectId,
      _id: projectId,
      name: 'General'
    });
    let acc: { [key: string]: any } = {};
    all.map((m) => {
      acc[m?._id] = m;
    });

    dispatch(setExact({ loading: false, data: acc }));

    //   setLoading(false);
  };

  useEffect(() => {
    if (data.length > 0 && selectedProject?._id) {
      fetchAllTeamMemberDetails();
    }
    // if (data[0] || data[selectedProjectIndex]) {
    // dispatch(clear());

    // }
  }, [selectedProject, data, selectedProjectIndex]);
};

const useMembersDetails = (list: Team) => {
  // let dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();
  const [data, setData] = useState<any>({});
  const fetchAllTeamMemberDetails = async () => {
    setLoading(true);
    let isProfessional = (s: string) => ['contractor', 'consultant'].includes(s);
    let { e, response } = await postForm(
      'get',
      `users/user-and-professional/${list.id}`,
      {},
      `iam`
    );
    if (response) {
      let _data = response.data.data;
      if (!isCompany(_data.rolename)) {
        _data.name = `${_data?.firstName + ' ' + _data?.lastName}`;
      }
      let nameSplit = (_data?.firstName + ' ' + _data?.lastName)?.split(' ') || '';
      _data.initials = isProfessional(_data.rolename)
        ? _data.name.slice(0, 2)
        : `${nameSplit[0]?.toUpperCase()[0]}${nameSplit[1]?.toUpperCase()[0]}`;

      _data.prole = list.role;

      if (isCompany(_data.rolename)) {
        _data.logo = _data?.businessInformation?.logo
          ? 'https://bnkle-iam-images.s3.eu-west-1.amazonaws.com/' +
            _data?.businessInformation?.logo
          : _data.logo;
      } else {
        if (_data.logo) {
          let logo = await GetDownloadSignedUrls(_data.logo, BucketNames[1]);
          _data.logo = logo?.data?.url || '';
        }
      }
      setData(_data);
      // return _data;
    } else {
      setError(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    // if (data.length > 0) {
      fetchAllTeamMemberDetails();
    // }
  }, [list]);

  return { loading, data, error };
};
export { useMembersDetails };
export default useTeamMembers;
