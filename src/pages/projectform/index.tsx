import React, { useState, useEffect } from 'react';
import logo from '../../assets/bnklelogo.svg';
import projectbrief from '../../components/projectbrief';
import Milestone from './Milestone';
import TopLableMobile from './TopLableMobile';
import TopMilestone from './TopMilestone';
import { handleCompletion, handleCurrentMilestone } from './utils';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';

const Index = () => {
  let navigate = useNavigate();
  const [formData, setFormData] = useState({
    brief: {
      commercialSpaces: [],
      projectType: '',
      buildingType: '',
      units: '',
      projectLocation: {
        city: '',
        state: '',
        country: ''
      },
      bedrooms: 0,
      livingrooms: 0,
      diningrooms: 0,
      bathrooms: 0,
      kitchens: 0,
      stores: 0,
      others: [],
      measurements: '',
      projectDrawing: '',
      mechanicalDrawing: '',
      structuralDrawing: '',
      landLocation: {
        city: '',
        state: '',
        country: ''
      },
      currency: {
        code: '',
        label: ''
      },
      isLandAcquired: '',
      needHelpWithLand: '',
      landBudget: '-',
      preferredLocation: {
        city: '',
        state: '',
        country: ''
      },
      preferredLandSize: '-',
      isLandAgentHelpNeeded: ''
    }
  });

  const [milestones, setMileStones] = useState([
    { title: 'Project Brief', status: 'ongoing' },
    { title: 'Project Document', status: 'Not-Started' },
    { title: 'Land', status: 'Not-Started' },
    { title: 'Schedule Call', status: 'Not-Started' }
  ]);

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    handleCompletion(formData.brief, milestones, setMileStones);
    handleCurrentMilestone(current, milestones, setMileStones);
  }, [current, formData.brief]);


  return (
    <div className="  h-screen flex flex-col lg:flex-row 2xl:items-center ">
      <div className="  w-full  h-screen flex flex-col lg:flex-row ">
        <div className=" w-full lg:w-[30%] pb-10 lg:pb-0  lg:h-full flex flex-col justify-start overflow-hidden  pt-10 bg-bbg">
          <div className=" lg:ml-[25%] h-auto  flex flex-col items-center lg:items-start">
            <img
              src={logo}
              alt="logo"
              loading="lazy"
              decoding="async"
              className=" w-20 lg:w-[25%] mb-9 lg:mb-24"
            />
            <div className="flex-1 hidden lg:flex w-full justify-evenly   lg:justify-center lg:items-start  lg:flex-col  pb-5">
              {milestones.map((m, i) => (
                <Milestone key={i} index={i + 1} title={m.title} status={m.status} />
              ))}
            </div>
            <div className="lg:hidden flex-col w-full">
              <TopMilestone milestones={milestones} />
              <TopLableMobile milestones={milestones} />
            </div>
          </div>
        </div>
        <div className="lg:w-[70%] h-full overflow-y-auto 2xl:pt-20 flex items-center flex-col px-4 ">
          <div className="w-full 2xl:w-[900px]  2xl:self-center h-full overflow-y-auto 2xl:pt-10  pt-10 lg:pt-32 lg:px-28 xl:px-40 flex items-center flex-col px-4 2xl:flex-1 ">
            <div
              onClick={() => navigate('/projects')}
              className="flex items-start  cursor-pointer self-start mb-6 p-2 hover:underline hover:bg-[whitesmoke]  rounded-lg">
              <span className=" flex items-center  left-4 top-4 z-10">
                <FiChevronLeft size={24} />
                <span className=" ml-2 font-semibold text-xl text-borange decoration-borange">
                  Exit
                </span>
              </span>
            </div>
            {React.createElement(projectbrief[current], {
              setFormData,
              setCurrent,
              formData,
              current
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
