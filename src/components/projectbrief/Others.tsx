import { useState } from 'react';
import NavButtons from './NavButtons';
import Props from './Props';
import Header from './Header';
import SelectBox from '../shared/SelectBox';

const Others = ({ current, setCurrent }: Props) => {
  const [data, setData] = useState('');
  const next = () => {
    if (data === 'Yes') {
      setCurrent(current + 1);
    } else if (data === 'No') {
      setCurrent(current + 2);
    }
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  return (
    <div className="w-full flex flex-col ">
      <Header
        title={'Others'}
        heading={'Would you like to add other types of spaces to your dream home ? '}
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

export default Others;
