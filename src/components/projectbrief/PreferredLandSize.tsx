import { useState, useEffect } from 'react';
import NavButtons from './NavButtons';
import Props from './Props';
import Header from './Header';
import Error from './Error';

const ProjectType = ({ setFormData, formData, current, setCurrent }: Props) => {
  let field = 'preferredLandSize';
  const [data, setData] = useState(formData['brief'][field].toString());
  const [error, setError] = useState('');

  useEffect(() => {
    let from = parseInt(data.split('-')[0]);
    let to = parseInt(data.split('-')[1]);
    let val = '';
    if (isNaN(from) || isNaN(to)) {
      val = 'Please input values for the minimum and Maximum of the range';
    }
    if (from > to) {
      val += '\n The maximum field must be greater than the minimum field';
    }
    val === '' ? setError('') : setError(val);
  }, [data]);
  const next = () => {
    if (data !== '') {
      let form = { ...formData };
      form['brief'][field] = data;
      setFormData(form);
      setCurrent(current + 1);
    }
  };
  const prev = () => {
    setCurrent(current - 1);
  };

  const handleChange = (e: any, x: string) => {
    let arr = data.split('-');
    x === 'from' ? (arr[0] = e.target.value) : (arr[1] = e.target.value);
    setData(arr.join('-'));
  };
  return (
    <div className="w-full flex flex-col ">
      <Header
        title={'Land'}
        heading={`What is the size(${formData.brief.measurements.toUpperCase()}) of land you would like to have?`}
      />
      <div className=" flex space-x-3  ">
        <input
          onChange={(e) => handleChange(e, 'from')}
          type="number"
          min={0}
          placeholder="From"
          className="w-[48%] border rounded-lg border-bborder p-4"
          value={data.split('-')[0]}
        />
        <input
          min={0}
          onChange={(e) => handleChange(e, 'to')}
          type="number"
          placeholder="To"
          className="w-[48%] border rounded-lg border-bborder p-4"
          value={data.split('-')[1]}
        />
      </div>

      <Error message={error} />

      <NavButtons prev={prev} next={next} disabled={error != ''} />
    </div>
  );
};

export default ProjectType;
