import { useMemo, useState } from 'react';
import NavButtons from './NavButtons';
import Props from './Props';
import Header from './Header';
import SelectBox from '../shared/SelectBox';

const ProjectDrawing = ({ setFormData, formData, current, setCurrent }: Props) => {
  const [data, setData] = useState(formData['brief']['projectDrawing'].toString());
  let isCommercial = useMemo(() => {
    return formData.brief.projectType === 'commercial';
  }, [formData]);
  const next = () => {
    if (data !== '') {
      let form = { ...formData };
      form['brief']['projectDrawing'] = data;
      setFormData(form);
      setCurrent(current + 1);
    }
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  return (
    <div className="w-full flex flex-col ">
      <Header
        title={'Project drawing'}
        heading={`Do you have any Architectural drawings for your ${
          isCommercial ? 'project' : 'dream house'
        }?`}
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

      <NavButtons prev={prev} next={next} disabled={data === ''} />
    </div>
  );
};

export default ProjectDrawing;
