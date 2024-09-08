import { useState, useEffect, useMemo, useRef } from 'react';
import NavButtons from './NavButtons';
import Props from './Props';
import Header from './Header';
import cancel from '../../assets/cancel.svg';
import Error from './Error';
import InputField from 'components/shared/InputField';
import { convertToProper } from 'components/shared/utils';
import { boolean } from 'yup';
import { TbCheck, TbClockSearch, TbEdit, TbHttpDelete } from 'react-icons/tb';
import { MdClose } from 'react-icons/md';
import { useClickOutSideComponent } from 'components/projects/Team/Views/Components/OnScreen';

export type CommercialSpaceType = { name: string; quantity: number; iconNumber?: number };

const ProjectType = ({ setFormData, formData, current, setCurrent }: Props) => {
  const [feature, setFeature] = useState<string>('');
  const [spaces, setSpaces] = useState<CommercialSpaceType>({
    name: '',
    quantity: 0
  });
  let isCommercial = useMemo(() => {
    return formData.brief.projectType === 'commercial';
  }, [formData]);
  const [data, setData] = useState(
    isCommercial ? formData['brief']['commercialSpaces'] : formData['brief']['others']
  );
  const [error, setError] = useState('');
  const remove = (i: number) => {
    let datacopy = [...data];
    datacopy.splice(i, 1);
    setData(datacopy);
  };
  useEffect(() => {
    if (data.length !== 0) {
      setError('');
    }
  }, [data]);
  const next = () => {
    if (data.length !== 0) {
      let form = { ...formData };
      if (isCommercial) {
        form['brief']['commercialSpaces'] = data;
      } else {
        form['brief']['others'] = data;
      }

      setFormData(form);
      setCurrent(isCommercial ? 3 : current + 1);
    } else {
      setError('Please Add a space');
    }
  };
  const edit = (idx: number, value: CommercialSpaceType) => {
    let dataCopy = [...data];
    dataCopy[idx] = value;
    setData(dataCopy);
  };
  const prev = () => {
    setCurrent(isCommercial ? 2 : current - 1);
  };

  let isAddDisabled = useMemo(() => {
    if (isCommercial) {
      return !(spaces.name && spaces.quantity);
    } else {
      return feature === '';
    }
  }, [feature, spaces]);

  return (
    <div className="w-full flex flex-col ">
      <Header
        title={isCommercial ? 'Others' : 'Spaces'}
        heading={`What other types of spaces would you like your ${
          isCommercial ? 'project' : 'dream home'
        } to have? `}
      />
      <div className="flex  flex-col items-start">
        <div className=" flex w-full flex-wrap gap-3  py-3">
          {data.map((el: string | CommercialSpaceType, i: number) =>
            typeof el === 'string' ? (
              <ItemComponent key={i} element={el} idx={i} onRemove={() => remove(i)} />
            ) : (
              <EditableComponent
                idx={i}
                element={el}
                onRemove={() => remove(i)}
                onEdit={(val: CommercialSpaceType) => edit(i, val)}
              />
            )
          )}
        </div>
        <div className=" flex w-full   items-end">
          {!isCommercial ? (
            <input
              placeholder="eg. Garage"
              className="flex-1   border rounded-lg border-bbg p-4"
              type="text"
              value={feature}
              onChange={(e) => {
                setFeature(e.target.value);
              }}
            />
          ) : (
            <div className=" flex items-center flex-1 justify-between overflow-auto   ">
              <InputField
                value={spaces.name}
                label="Name"
                onChange={(x) => {
                  setSpaces({ ...spaces, name: x.target.value });
                }}
                placeholder="stadium"
                ContainerClassName="  flex-1   "
              />
              <div className=" mx-4 max-w-[100px]">
                <InputField
                  value={spaces.quantity}
                  ContainerClassName=" w-auto"
                  type="number"
                  className=" "
                  label="Quantity"
                  onChange={(x) => {
                    setSpaces({ ...spaces, quantity: parseInt(x.target.value) });
                  }}
                  placeholder="2"
                />
              </div>
            </div>
          )}
          <button
            disabled={isAddDisabled}
            className={` ${isCommercial ? ' mb-3 ' : ''} bg-bblue ml-1 ${
              isAddDisabled ? ' bg-bbg' : ''
            } text-sm text-white rounded-md px-5 py-3`}
            onClick={() => {
              setData([...data, isCommercial ? spaces : feature]);
              isCommercial ? setSpaces({ name: '', quantity: 0 }) : setFeature('');
            }}>
            Add
          </button>
        </div>
      </div>
      <Error message={error} />
      <NavButtons prev={prev} next={next} disabled={data.length < 1} />
    </div>
  );
};

interface ItemProps {
  element: string | { name: string; quantity: number };
  idx: number;
  isCommercial?: boolean;
  onRemove: () => void;
}
const ItemComponent = ({ element, idx, isCommercial, onRemove }: ItemProps) => {
  let isString = useMemo(() => {
    return typeof element === 'string';
  }, []);
  return (
    <span className="p-1 mr-2 mb-2 rounded-md bg-bbg flex ">
      <span className="text-bblue mr-2">
        {convertToProper(typeof element === 'string' ? element : element.name)}
      </span>
      <span className=" ml-2">{typeof element === 'string' ? null : element.quantity}</span>
      <img loading="lazy" decoding="async" onClick={onRemove} src={cancel} alt="" />
    </span>
  );
};

interface EditableComponentProps {
  element: CommercialSpaceType;
  idx: number;
  onRemove: () => void;
  onEdit: (ele: CommercialSpaceType) => void;
}
const EditableComponent = ({ element, idx, onRemove, onEdit }: EditableComponentProps) => {
  let [val, setValue] = useState(element);
  const [isEditing, setIsEditing] = useState(false);
  let ref = useRef<any>();

  useClickOutSideComponent(ref, () => {
    setIsEditing(false);
  });

  return (
    <div ref={ref} className=" bg-bbg rounded-md py-2 px-4 flex items-center ">
      {isEditing ? (
        <span className="  items-center">
          <input
            className="  p-2 rounded-md"
            type="text"
            value={val.name}
            onChange={(e) => {
              setValue({ ...val, name: e.target.value });
            }}
          />
          <input
            className=" ml-4 w-12 p-2 rounded-md"
            type="number"
            value={val.quantity.toString()}
            onChange={(e) => {
              setValue({ ...val, quantity: parseInt(e.target.value) });
            }}
          />
        </span>
      ) : (
        <span className=" flex items-center mr-4">
          <span>{element.name}</span>
          <span className=" ml-4">{element.quantity}</span>
        </span>
      )}
      <span className=" ml-4  flex items-center">
        {
          <span
            onClick={() => {
              if (isEditing) {
                onEdit(val);
                setIsEditing(false);
              } else {
                setIsEditing(true);
              }
            }}
            className={`p-1 rounded-md ${isEditing ? ' bg-bgreen-2' : 'bg-bblue'} `}>
            {isEditing ? <TbCheck color="white" size={16} /> : <TbEdit color="white" size={16} />}
          </span>
        }

        <span
          onClick={() => {
            isEditing ? setIsEditing(false) : onRemove();
          }}
          className="p-1 ml-2 rounded-md bg-bred ">
          <MdClose color="white" size={16} />
        </span>
      </span>
    </div>
  );
};

export { EditableComponent };
export default ProjectType;
