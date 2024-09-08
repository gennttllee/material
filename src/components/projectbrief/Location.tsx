import { useMemo, useState } from 'react';
import NavButtons from './NavButtons';
import Props from './Props';
import Header from './Header';

import LocationSelector from './LocationSelector';
const ProjectType = ({ setFormData, formData, current, setCurrent }: Props) => {
  const [data, setData] = useState(formData['brief']['projectLocation']);
  let isCommercial = useMemo(() => {
    return formData.brief.projectType === 'commercial';
  }, [formData]);
  const next = () => {
    let { city, country, state } = data;
    if (city && country && state) {
      let form = { ...formData };
      form['brief']['projectLocation'] = data;
      setFormData(form);
      setCurrent(isCommercial ? 12 : current + 1);
    }
  };
  const prev = () => {
    setCurrent(isCommercial ? 11 : current - 1);
  };

  return (
    <div className="w-full flex flex-col gap-x-4 ">
      <Header title={'Location'} heading={'Where is the project going to be located?'} />
      <LocationSelector
        data={data}
        setData={(x: {}) => {
          setData(x);
        }}
      />
      <NavButtons prev={prev} next={next} disabled={!(data.city && data.country && data.state)} />
    </div>
  );
};

export default ProjectType;
