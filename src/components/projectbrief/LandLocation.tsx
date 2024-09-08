import { useState } from 'react';
import NavButtons from './NavButtons';
import Props from './Props';
import Header from './Header';
import { displayError, displaySuccess } from 'Utils';
import { postForm } from '../../apis/postForm';
import { formToSchema, purge } from '../../pages/projectform/utils';
import { setNewProject } from '../../store/slices/newprojectSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import LocationSelector from './LocationSelector';
import { loadClusters } from 'store/slices/clusterSlice';
import useClusters from 'Hooks/useClusters';
import { useNavigate } from 'react-router-dom';
const ProjectType = ({ setFormData, formData, current, setCurrent }: Props) => {
  const [data, setData] = useState(formData['brief']['landLocation']);
  const [fetching, setFetching] = useState(false);
  let { currentType } = useAppSelector((m) => m.cluster);
  const dispatch = useAppDispatch();
  const { getClusters, refreshproject } = useClusters(true);
  let navigate = useNavigate();
  const next = async () => {
    let { city, country, state } = data;
    if (city && country && state) {
      let form = { ...formData };
      form['brief']['landLocation'] = data;
      setFormData(() => form);
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
          refreshproject();
          navigate(-1);
        } else {
          dispatch(setNewProject(response.data.data._id));
          setCurrent(current + 5);
        }
      } else if (e) {
        displayError(e.message);
      }
    }
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  return (
    <div className="w-full flex flex-col ">
      <Header title={'Land'} heading={'Where is this land located?'} />
      <LocationSelector data={data} setData={(x: {}) => setData(x)} />
      <NavButtons
        prev={prev}
        next={next}
        loading={fetching}
        disabled={!(data.city && data.country && data.state) || fetching}
      />
    </div>
  );
};

export default ProjectType;
