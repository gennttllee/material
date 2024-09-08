import { useState } from 'react';
import NavButtons from './NavButtons';
import Props from './Props';
import Header from './Header';
import LocationSelector from './LocationSelector';

const PreferedLandLocation = ({ setFormData, formData, current, setCurrent }: Props) => {
  let field = 'preferredLocation';
  const [data, setData] = useState(formData['brief'][field]);
  const next = () => {
    let { city, country, state } = data;
    if (city && country && state) {
      let form = { ...formData };
      form['brief'][field] = data;
      setFormData(form);
      setCurrent(current + 1);
    }
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  return (
    <div className="w-full flex flex-col ">
      <Header title={'Land'} heading={'Where are you looking to acquire land for your project'} />
      <LocationSelector data={data} setData={(x: {}) => setData(x)} />

      <NavButtons prev={prev} next={next} disabled={!(data.city && data.country && data.state)} />
    </div>
  );
};

export default PreferedLandLocation;
