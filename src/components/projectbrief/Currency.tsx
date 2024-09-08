import { useState } from 'react';
import NavButtons from './NavButtons';
import Header from './Header';
import Props from './Props';
import { currencies } from '../../constants';
import SelectField from 'components/shared/SelectField';

const ProjectCurrency = ({ setFormData, formData, current, setCurrent }: Props) => {
  const [data, setData] = useState(formData['brief']['currency']);

  const next = () => {
    let { code, label } = data;
    if (code && label) {
      let form = { ...formData };
      form['brief']['currency'] = data;
      setFormData(form);
      setCurrent(current + 1);
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <div className="w-full flex flex-col gap-x-4 ">
      <Header title={'Currency'} heading={'What currency is going to be used on this projects?'} />
      <SelectField
        showSearch
        value={data.code}
        data={currencies.map((one) => ({ ...one, label: `${one.label}  (${one.value})` }))}
        onChange={(val) => {
          const currency = currencies.find((one) => one.value === val);
          if (currency) setData({ code: currency.value, label: currency.label });
        }}
      />
      <NavButtons prev={prev} next={next} disabled={!(data.code && data.label)} />
    </div>
  );
};

export default ProjectCurrency;
