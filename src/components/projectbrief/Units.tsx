import { useState } from 'react';
import NavButtons from './NavButtons';
import Props from './Props';
import Header from './Header';

const Units = ({ setFormData, formData, current, setCurrent }: Props) => {
  const [data, setData] = useState(formData['brief']['units'].toString());
  const next = () => {
    if (data !== '') {
      let form = { ...formData };
      form['brief']['units'] = data;
      setFormData(form);

      setCurrent(formData.brief.projectType === 'commercial' ? 11 : current + 1);
    }
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  return (
    <div className="w-full flex flex-col ">
      <Header title={'Units'} heading={'How many buildings are going to be on this development?'} />
      <input
        value={data}
        placeholder="e.g 1"
        type="number"
        className="border rounded-lg border-bborder p-4"
        onChange={(e) => setData(e.target.value)}
        name=""
        id=""
      />

      <NavButtons prev={prev} next={next} disabled={data === ''} />
    </div>
  );
};

export default Units;
