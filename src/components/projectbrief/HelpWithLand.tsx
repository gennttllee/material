import { useContext, useState } from 'react';
import NavButtons from './NavButtons';
import Props from './Props';
import Header from './Header';
import SelectBox from '../shared/SelectBox';
import { postForm } from '../../apis/postForm';
import { displayError, displaySuccess } from 'Utils';
import { formToSchema, purge } from '../../pages/projectform/utils';
import { setNewProject } from '../../store/slices/newprojectSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useNavigate } from 'react-router-dom';
import { loadClusters } from 'store/slices/clusterSlice';
import useClusters from 'Hooks/useClusters';
import { makeRequest } from 'pages/projects/Helper';
import { StoreContext } from 'context';
const HelpWithLand = ({ setFormData, formData, current, setCurrent }: Props) => {
  const [data, setData] = useState(formData['brief']['needHelpWithLand']);
  const { getClusters, refreshproject } = useClusters(true);
  const [fetching, setFetching] = useState(false);
  const { setContext } = useContext(StoreContext);
  const dispatch = useAppDispatch();
  let navigate = useNavigate();
  let { currentType } = useAppSelector((m) => m.cluster);
  const next = async () => {
    if (data !== '') {
      let form = { ...formData };
      form['brief']['needHelpWithLand'] = data;
      setFormData(() => form);
      if (data === 'Yes') {
        setCurrent(current + 1);
      } else {
        setFetching(true);
        let { e, response } = await postForm(
          'post',
          currentType ? 'clusters/create-project' : 'projects/briefs',
          purge({ ...formToSchema(formData.brief), clusterId: currentType?._id })
        );
        setFetching(false);
        if (response) {
          displaySuccess('Project Brief Submitted Successfully');
          if (currentType) {
            dispatch(loadClusters({ currentType: undefined }));
            getClusters();
            makeRequest(setContext);
            // refreshproject()
            navigate(-1);
          } else {
            dispatch(setNewProject(response.data.data._id));
            setCurrent(current + 4);
          }
        } else if (e) {
          displayError(e.message);
        }
      }
    }
  };
  const prev = () => {
    if (formData['brief']['isLandAcquired'] === 'No') {
      setCurrent(current - 2);
    } else {
      setCurrent(current - 1);
    }
  };
  return (
    <div className="w-full flex flex-col ">
      <Header
        title={'Land'}
        heading={
          'Our team has a network of land agents. Please provide a few details, if you would like us to help with your search.'
        }
      />

      <SelectBox
        setter={setData}
        state={data}
        options={[
          { value: 'Yes', label: 'Yes' },
          { value: 'No', label: 'No' }
        ]}
        placeholder={'Select Option'}
      />
      <NavButtons prev={prev} next={next} loading={fetching} disabled={data === '' || fetching} />
    </div>
  );
};

export default HelpWithLand;
