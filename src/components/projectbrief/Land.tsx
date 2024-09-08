import { useState } from 'react';
import NavButtons from './NavButtons';
import Props from './Props';
import Header from './Header';
import SelectBox from '../shared/SelectBox';

const Land = ({ setFormData, formData, current, setCurrent }: Props) => {
  const field = 'isLandAcquired';
  const [data, setData] = useState(formData['brief'][field]);

  const next = () => {
    if (data !== '') {
      let form = { ...formData };
      form['brief'][field] = data;
      setFormData(() => form);
      if (data === 'Yes') {
        setCurrent(current + 1);
      } else {
        setCurrent(current + 2);
      }
    }
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  return (
    <div className="w-full flex flex-col ">
      <Header
        title={'Land'}
        heading={'Have you acquired a piece of land for the development of this project?'}
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

export default Land;
