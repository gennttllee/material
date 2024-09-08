import { useState } from 'react';
import NavButtons from './NavButtons';
import Props from './Props';
import Header from './Header';
import SelectButtons from './SelectButtons';

const Bedrooms = ({ setFormData, formData, current, setCurrent }: Props) => {
  const [data, setData] = useState(formData['brief']['bedrooms'].toString());
  const next = () => {
    if (data !== '') {
      let form = { ...formData };
      form['brief']['bedrooms'] = data;
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
        title={'Bedrooms'}
        heading={'How many bedrooms would you like your dream house to have?'}
      />
      <div className="flex   flex-wrap">
        {['2', '3', '4', '5', '6+'].map((num, i) => (
          <SelectButtons key={i} setter={setData} state={data} label={num} />
        ))}
      </div>

      <NavButtons prev={prev} next={next} disabled={data === '0'} />
    </div>
  );
};

export default Bedrooms;
