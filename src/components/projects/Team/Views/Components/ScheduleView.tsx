import React, { useEffect, useContext, useState, useMemo } from 'react';
import InputField from 'components/shared/InputField';
import { InputFieldWithRef_ } from 'components/shared/InputField/InputField';
import SelectField from 'components/shared/SelectField';
import TextArea from 'components/shared/TextArea';
import Button from 'components/shared/Button/Button';
import { durations, TimeSlots, locations, makeDuration, timezones } from '../Constants';
import SelectDate from 'components/shared/SelectDate';
import MemberList, { List } from './MemberList';
import { StoreContext } from 'context';
import { centered, flexer, hoverFade, spacer } from 'constants/globalStyles';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { meetingSchema } from '../validation';
import addMinutes from 'date-fns/addMinutes';
import { useAppSelector } from 'store/hooks';
import { postForm } from 'apis/postForm';
import { displayError, displaySuccess } from 'Utils';
import { differenceInMinutes } from 'date-fns';
import MeetRadio from './MeetRadio';

interface Props {
  isEditing: boolean;
  setShowing: any;
  meetings: any[];
  setMeetings: any;
  initialDetails?: any;
}
export interface Guest {
  userId: string;
  id?: string;
  role?: string;
  prole?: string;
  _id?: string;
  name?: string;
}
interface NewMeeting {
  date: Date;
  title: string;
  time: string;
  description: string;
  duration: string;
  location: string;
  projectId: string;
  guests: Guest[];
  timezone?: string;
}

interface EditMeeting {
  date: Date;
  title: string;
  time: string;
  description: string;
  duration: string;
  location: string;
  projectId?: string;
  guests?: Guest[];
  timezone?: string;
}

const ScheduleView = ({ isEditing, setShowing, meetings, setMeetings, initialDetails }: Props) => {
  const { data, selectedProjectIndex } = useContext(StoreContext);

  let user = useAppSelector((m) => m.user);
  const [loading, setLoading] = useState(false);

  const [startValues, setStartValues] = useState<any>(isEditing ? initialDetails : undefined);

  let initialTime = useMemo(() => {
    let diff: string = '';
    if (startValues?.time !== undefined && startValues?.date !== undefined) {
      diff = differenceInMinutes(
        new Date(startValues?.time),
        new Date(startValues?.date)
      ).toString();
    }
    return diff ? diff : undefined;
  }, [startValues]);
  const {
    reset,
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors, isValid },
    trigger,
    watch
  } = useForm<NewMeeting>({
    reValidateMode: 'onChange',
    defaultValues: {
      date: new Date(meetings[initialDetails || 0]?.date),
      title: '',
      time: '',
      description: '',
      duration: '',
      location: '',
      projectId: data[selectedProjectIndex]._id,
      guests: [],
      timezone: ''
    },
    resolver: yupResolver(meetingSchema)
  });
  let date = watch('date');
  let slots = useMemo(() => {
    return TimeSlots(
      new Date(isEditing ? startValues?.date : new Date(date ?? undefined)),
      isEditing
    );
  }, [startValues, date]);
  const newMeetingSubmit = async () => {
    trigger();
    if (isValid) {
      setLoading(true);
      let values = getValues();
      let { guests } = values;
      let allguests = [...guests].filter((m) => {
        if (m.userId === user._id && m.role === user.role) {
          return false;
        }
        return true;
      });
      let alreadyAdded = false;
      allguests.map((m) => {
        if (m._id == user._id) {
          alreadyAdded = true;
        }
      });
      if (!alreadyAdded) {
        allguests.push({ userId: user._id, role: user.role });
      }
      values.guests = allguests.map((m: Guest) => {
        let g = { userId: m._id, role: m.prole } as Guest;
        return g;
      });
      let dateString = new Date(values.date).toDateString();
      values.date = new Date(dateString);
      values.time = addMinutes(new Date(dateString), parseInt(values.time)).toISOString();
      if (values?.timezone === '') {
        delete values?.timezone;
      }
      let { e, response } = await postForm('post', 'meeting/add', values);
      if (response) {
        let newMeetings = [...meetings];
        newMeetings.push(response.data.data);
        setMeetings((_: any) => newMeetings);
        reset();
        setShowing(null);
      } else {
        displayError('Could not create meeting');
      }
      setLoading(false);
    }
  };

  const updateMeeting = async () => {
    trigger();

    if (isValid) {
      trigger();
      if (isValid) {
        setLoading(true);
        let values = getValues();
        let { guests } = values;
        let allguests = [...guests].filter((m) => {
          if (m.userId === user._id) {
            return false;
          }
          return true;
        });
        let alreadyAdded = false;
        allguests.forEach((m) => {
          if (m.userId == user._id) {
            alreadyAdded = true;
            return;
          }
        });

        if (!alreadyAdded) {
          if (team.data[user._id]) {
            allguests.push(team.data[user._id] as Guest);
          }
        }
        values.guests = allguests.map((m: Guest) => {
          let g: Guest = { userId: m._id, role: m.prole } as Guest;
          return g;
        });
        let dateString = new Date(values.date).toDateString();
        values.date = new Date(dateString);
        values.time = addMinutes(new Date(dateString), parseInt(values.time)).toISOString();

        let editValues: EditMeeting = {
          ...values
        };
        delete editValues?.projectId;
        if (editValues?.timezone === '') {
          delete editValues?.timezone;
        }
        let { e, response } = await postForm(
          'patch',
          'meeting/update/' + initialDetails?._id,
          editValues
        );
        if (response) {
          let newMeetings = [...meetings];
          let idx = newMeetings.findIndex((m) => {
            return m._id === initialDetails._id;
          });
          newMeetings[idx] = response.data.data[0];
          setMeetings((_: any) => newMeetings);
          reset();
          setShowing(null);
        } else {
          displayError('Could not update meeting');
        }
        setLoading(false);
      }
    }
  };
  let team = useAppSelector((m) => m.team);
  const list = useMemo(() => {
    let details: { [key: string]: any }[] = [];
    let ids = Object.keys(team.data);
    ids.forEach((m) => {
      let item = team.data[m];
      if (item && item._id !== data[selectedProjectIndex]._id) {
        details.push(item);
      }
    });
    return details;
  }, [team]);

  useEffect(() => {
    if (isEditing) {
      setValue('title', startValues?.title || '', {
        shouldValidate: true
      });
      setValue('description', startValues?.description || '', {
        shouldValidate: true
      });
      setValue('date', new Date(startValues?.date), {
        shouldValidate: true
      });
      setValue('location', startValues?.location, {
        shouldValidate: true
      });
      setValue('timezone', startValues?.timezone, {
        shouldValidate: true
      });
    }
  }, [startValues]);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={` bg-white py-6 px-4 text-bash  font-commons  rounded-md scrollbar min-w-[45%] xl:min-w-[40%]   max-h-[80%] max-w-[532px] overflow-y-auto `}>
      <div className={flexer}>
        <h2 className="text-xl  font-semibold text-bblack-1">
          {isEditing !== true ? 'Schedule' : 'Update'} meeting
        </h2>
        <button
          onClick={() => setShowing(null)}
          className={'text-bash font-Medium text-base' + hoverFade}>
          Close
        </button>
      </div>

      <InputFieldWithRef_
        defaultValue={startValues?.title ?? ''}
        onChange={(e) => {
          setValue('title', e.target.value, { shouldValidate: true });
        }}
        label="Title"
        placeholder="Basis"
        className="bg-transparent   "
        wrapperClassName=" border border-bash outline-bash placeholder-ashShades-4"
      />
      {errors.title && <span className="text-red-500 text-sm">{`${errors?.title.message}`}</span>}
      <TextArea
        defaultValue={startValues?.description ?? ''}
        onChange={(e) => {
          setValue('description', e.target.value, { shouldValidate: true });
        }}
        label="Description"
        ContainerClassName={` ${'mt-5 '} `}
        wrapperClassName=" border border-bash"
        placeholder="add note"
      />
      {errors.description && (
        <span className="text-red-500 text-sm">{`${errors?.description.message}`}</span>
      )}
      <div className={flexer}>
        <SelectDate
          value={new Date(getValues().date)}
          initialValue={new Date(startValues?.date ?? new Date())}
          onChange={(e) => {
            setValue('date', e, { shouldValidate: true, shouldTouch: true });
          }}
          wrapperClassName="border border-bash"
          placeholder="June 12, 2022"
          label="Date"
        />
        <SelectField
          initialValue={initialTime}
          wrapperClassName="border border-bash"
          data={slots}
          placeholder="02:30 PM"
          onChange={(e) => {
            setValue('time', e, { shouldValidate: true });
          }}
          className="mx-3"
          label="Time"
        />
        <SelectField
          initialValue={startValues?.duration}
          wrapperClassName="border border-bash"
          placeholder="1hr : 30min"
          onChange={(val) => {
            setValue('duration', val, { shouldValidate: true });
          }}
          label="Duration"
          data={durations}
        />
      </div>
      {errors.date && <div className="text-red-500 text-sm">{`${errors?.date.message}`}</div>}
      {errors.time && <div className="text-red-500 text-sm">{`${errors?.time.message}`}</div>}
      {errors.duration && (
        <div className="text-red-500 text-sm">{`${errors?.duration.message}`}</div>
      )}

      <SelectField
        initialValue={startValues?.timezone}
        wrapperClassName="border border-bash"
        placeholder="Select a timezone"
        onChange={(val) => {
          setValue('timezone', val, { shouldValidate: true });
        }}
        label="Timezone"
        data={timezones}
      />
      {errors.timezone && (
        <div className="text-red-500 text-sm">{`${errors?.timezone?.message ?? ''}`}</div>
      )}

      <MeetRadio
        list={locations}
        setter={(x: string) => setValue('location', x, { shouldValidate: true })}
        initialValue={startValues?.location}
      />
      {errors.location && (
        <span className="text-red-500 text-sm">{`${errors?.location.message}`}</span>
      )}
      <div className="mb-6" />
      <MemberList
        initialValue={startValues?.guests}
        list={list}
        setValue={(field: any, val: any) => {
          setValue(field, val, {
            shouldValidate: true
          });
        }}
      />
      {errors.guests && <span className="text-red-500 text-sm">{`${errors.guests.message}`}</span>}

      <div className="flex items-center justify-end gap-x-4">
        <Button
          textStyle="text-bblack-1"
          className=" font-satoshi py-3 mt-5 bg-transparent border-bash text-bblack-1"
          onClick={() => setShowing(null)}
          text="Cancel"
        />
        <Button
          isLoading={loading}
          text={isEditing ? 'Update Schedule' : 'Create Schedule'}
          onClick={() => {
            isEditing ? updateMeeting() : newMeetingSubmit();
          }}
          className=" font-satoshi py-3 mt-5"
        />
      </div>
    </div>
  );
};

export default ScheduleView;
