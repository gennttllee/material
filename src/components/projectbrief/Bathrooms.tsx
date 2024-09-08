import { useState, useEffect } from 'react';
import NavButtons from './NavButtons';
import Props from './Props';
import Header from './Header';
import SelectButtons from './SelectButtons';
import Error from './Error';

const Bathrooms = ({ setFormData, formData, current, setCurrent }: Props) => {
  const [data, setData] = useState(formData['brief']['bathrooms'].toString());
  const [error, setError] = useState('');
  useEffect(() => {
    if (data != '') {
      setError('');
    }
  }, [data]);
  const next = () => {
    if (data !== '') {
      let form = { ...formData };
      form['brief']['bathrooms'] = data;
      setFormData(form);
      setCurrent(current + 1);
    } else {
      setError('Please pick an option');
    }
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  return (
    <div className="w-full flex flex-col ">
      <Header
        title={'Toilet / Bathroom'}
        heading={'How many baths/toilets would you like your dream house to have?'}
      />
      <div className="flex   flex-wrap">
        {['2', '3', '4', '5', '6+'].map((num, i) => (
          <SelectButtons key={i} setter={setData} state={data} label={num} />
        ))}
      </div>
      <Error message={error} />
      <NavButtons prev={prev} next={next} disabled={data === '0'} />
    </div>
  );
};

export default Bathrooms;
