import { useMemo, useState } from 'react';
import NavButtons from './NavButtons';
import Props from './Props';
import Header from './Header';
import SelectBox from '../shared/SelectBox';

const ProjectType = ({ setFormData, formData, current, setCurrent }: Props) => {
  const [data, setData] = useState(formData['brief']['measurements'].toString());
  let isCommercial = useMemo(() => {
    return formData.brief.projectType === 'commercial';
  }, [formData]);
  const next = () => {
    if (data !== '') {
      let form = { ...formData };
      form['brief']['measurements'] = data;
      setFormData(form);
      setCurrent(current + 1);
    }
  };
  const prev = () => {
    if (isCommercial) {
      setCurrent(3);
    } else {
      if (formData['brief']['others'].length < 1) {
        setCurrent(current - 2);
      } else {
        setCurrent(current - 1);
      }
    }
  };
  return (
    <div className="w-full flex flex-col ">
      <Header title={'Measurement'} heading={'Select unit of measurement'} />
      <SelectBox
        setter={setData}
        state={data}
        options={[
          { value: 'sqm', label: 'Metrics (sqm)' },
          { value: 'ft', label: 'Imperial (ft)' }
        ]}
        placeholder={'Select Option'}
      />
      <NavButtons prev={prev} next={next} disabled={data === ''} />
    </div>
  );
};

export default ProjectType;
