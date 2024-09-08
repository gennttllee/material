import { useState } from 'react';
import NavButtons from './NavButtons';
import Props from './Props';
import Header from './Header';
import SelectButtons from './SelectButtons';

const Livingrooms = ({ setFormData, formData, current, setCurrent }: Props) => {
  const [data, setData] = useState(formData['brief']['stores'].toString());
  const next = () => {
    if (data !== '') {
      let form = { ...formData };
      form['brief']['stores'] = data;
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
        title={'Stores'}
        heading={'How many stores would you like your dream house to have?'}
      />
      <div className="flex   flex-wrap">
        {['0', '1', '2', '3+'].map((num, i) => (
          <SelectButtons key={i} setter={setData} state={data} label={num} />
        ))}
      </div>
      <NavButtons prev={prev} next={next} />
    </div>
  );
};

export default Livingrooms;
