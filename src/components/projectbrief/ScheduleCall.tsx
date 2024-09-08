import { useState, useContext, useCallback } from 'react';
import NavButtons from './NavButtons';
import Props from './Props';
import Header from './Header';
import { InlineWidget, useCalendlyEventListener } from 'react-calendly';
import axios from 'axios';
import { displayError, displaySuccess, displayWarning } from 'Utils';
import { useNavigate } from 'react-router-dom';
import { postForm } from '../../apis/postForm';
import { useAppSelector } from '../../store/hooks';
import { StoreContext } from 'context';
import { makeRequest } from 'pages/projects/Helper';
type URI = {
  uri: string;
};
const ScheduleCall = ({ setFormData, formData, current, setCurrent }: Props) => {
  let navigate = useNavigate();
  let projectId = useAppSelector((s) => s.newProject).id;
  const user = useAppSelector((s) => s.user);
  const setErrStatus = useState<number | null>(null)[1];
  const makecall = async (uri: string, url: string, startTime: string, number: number) => {
    let { response, e } = await postForm('patch', `projects/briefs/${projectId}`, {
      scheduledCall: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        startTime: startTime,
        joiningInfo: {
          eventUri: uri,
          eventUrl: url
        }
      }
    });

    if (response) {
      await fetchProjects();
      displaySuccess('Event Scheduled Successfully. Now redirecting to your dashboard');
      navigate('/projects/');
    } else {
      if (number >= 2) {
        displayError('Error scheduling call');
      } else {
        makecall(uri, url, startTime, number + 1);
        displayError('Error scheduling call, Trying again');
      }
    }
  };
  const { selectedProjectIndex, handleContext, menuProjects, setContext } =
    useContext(StoreContext);
  const fetchProjects = useCallback(async () => {
    await makeRequest(setContext, setErrStatus);
  }, []);

  useCalendlyEventListener({
    onEventScheduled: async (e) => {
      displaySuccess('Please wait while we register your event');
      axios
        .get(e.data.payload.event.uri, {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_CALENDLYTOKEN}`
          }
        })
        .then(async (res) => {
          try {
            let response = await makecall(
              e?.data?.payload?.event?.uri,
              res?.data?.resource?.location?.join_url,
              res.data.resource.start_time,
              1
            );
          } catch (error) {
            displayError(String(error));
          }
        })
        .catch((e) => {
          displayWarning("couldn't get event details");
          navigate('/projects/');
        });
    }
  });
  const [data, setData] = useState('');
  const [showCalendly, setShowCalendly] = useState(false);

  const next = () => {
    if (data !== '' && data === 'Yes') {
      setCurrent(current + 1);
    } else {
      setCurrent(current + 2);
    }
  };
  const prev = () => {
    if (formData['brief']['landLocation'] !== '') {
      setCurrent(current - 5);
    } else if (formData['brief']['needHelpWithLand'] === 'No') {
      setCurrent(current - 5);
    } else {
      setCurrent(current - 1);
    }
  };
  return (
    <div className="w-full flex flex-col lg:-m-8 ">
      <Header title={''} heading={'Schedule Call'} />
      <p className="text-bash text-xl ">
        Please schedule a call, and you will be assigned with a portfolio/relationship manager who
        will review the project brief along with you and help with forming a project team of experts
        to deliver your dream house.
      </p>
      <a
        onClick={() => setShowCalendly(!showCalendly)}
        className="font-bold cursor-pointer mt-4 text-bblue hover:underline no-underline  text-base"
      >
        Click here to schedule a meeting with a Portfolio Manager
      </a>
      <div className={`w-full h-[630px] ${showCalendly ? 'block' : 'hidden'} `}>
        <InlineWidget
          url="https://calendly.com/buildwithbnkle/projectbrief"
          prefill={{
            email: user?.email,
            lastName: user?.lastName,
            firstName: user?.firstName,
            name: `${user?.firstName} ${user?.lastName}`
          }}
        />
      </div>
      <NavButtons prev={prev} next={next} islast />
    </div>
  );
};

export default ScheduleCall;
