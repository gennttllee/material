import { useContext, useEffect, useState } from 'react';
import NavButtons from './NavButtons';
import Props from './Props';
import Header from './Header';
import { formToSchema, purge } from '../../pages/projectform/utils';
import Error from './Error';
import { postForm } from '../../apis/postForm';
import { displayError, displaySuccess } from 'Utils';
import { setNewProject } from '../../store/slices/newprojectSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loadClusters } from 'store/slices/clusterSlice';
import { useNavigate } from 'react-router-dom';
import useClusters from 'Hooks/useClusters';
import { makeRequest } from 'pages/projects/Helper';
import { StoreContext } from 'context';

const LandBudget = ({ setFormData, formData, current, setCurrent }: Props) => {
  let { data: projectList, setContext } = useContext(StoreContext);
  let { getClusters, refreshproject } = useClusters(true);
  let field = 'landBudget';
  let navigate = useNavigate();
  const [data, setData] = useState(formData['brief'][field].toString());
  const [error, setError] = useState('');
  const [fetching, setFetching] = useState(false);
  const dispatch = useAppDispatch();
  let { currentType } = useAppSelector((m) => m.cluster);
  useEffect(() => {
    let from = parseInt(data.split('-')[0]);
    let to = parseInt(data.split('-')[1]);
    let val = '';
    if (isNaN(from) || isNaN(to)) {
      val = 'Please input values for the minimum and Maximum of the range';
    }
    if (from > to) {
      val += '\n The maximum field must be greater than the minimum field';
    }
    val == '' ? setError('') : setError(val);
  }, [data]);
  const next = async () => {
    if (data !== '') {
      let form = { ...formData };
      form['brief'][field] = data;
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
          makeRequest(setContext);
          // refreshproject()
          navigate(-1);
        } else {
          dispatch(setNewProject(response.data.data._id));
          setCurrent(current + 1);
        }
      } else if (e) {
        displayError(e.message);
      }
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleChange = (e: any, x: string) => {
    let arr = data.split('-');
    x === 'from' ? (arr[0] = e.target.value) : (arr[1] = e.target.value);
    setData(arr.join('-'));
  };
  return (
    <div className="w-full flex flex-col ">
      <Header title={'Land'} heading={'What is your budget for acquiring the land?'} />
      <div className=" flex justify-between  w-full">
        <input
          onChange={(e) => handleChange(e, 'from')}
          type="number"
          placeholder="From"
          className="w-[48%]  border rounded-lg border-bborder p-4 "
          value={data.split('-')[0]}
        />
        <input
          onChange={(e) => handleChange(e, 'to')}
          type="number"
          placeholder="To"
          className="w-[48%]  border rounded-lg border-bborder p-4 "
          value={data.split('-')[1]}
        />
      </div>

      <Error message={error} />

      <NavButtons prev={prev} next={next} loading={fetching} disabled={error !== '' || fetching} />
    </div>
  );
};

export default LandBudget;
