import { useState, useEffect } from 'react';
import NavButtons from './NavButtons';
import Props from './Props';
import Header from './Header';
import SelectBox from '../shared/SelectBox';

const ProjectType = ({ setFormData, formData, current, setCurrent }: Props) => {
  const [data, setData] = useState(formData['brief']['projectType'].toString());
  const [error, setError] = useState('');
  const next = () => {
    let form = { ...formData };
    form['brief']['projectType'] = data;
    setFormData(form);
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };
  return (
    <div className="w-full flex flex-col ">
      <Header title={'Project Type'} heading={'Is this a commercial or residential project?'} />
      <SelectBox
        setter={setData}
        state={data}
        options={[
          { value: 'commercial', label: 'Commercial' },
          { value: 'residential', label: 'Residential' }
        ]}
        placeholder={'Select Option'}
      />
      <NavButtons isfirst prev={prev} next={next} disabled={!data} />
    </div>
  );
};

export default ProjectType;
