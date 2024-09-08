import { LoaderX } from 'components/shared/Loader';
import { useRef, useState } from 'react';
import { TbChevronDown, TbChevronUp, TbTrash, TbUser } from 'react-icons/tb';
import { Access } from '../types';
import { useClickOutSideComponent } from 'components/projects/Team/Views/Components/OnScreen';
import { setOptions } from 'react-chartjs-2/dist/utils';

interface Props {
  url: string;
  name: string;
  email: string;
  showRole?: boolean;
  showDelete?: boolean;
  onDelete?: () => void | Promise<void>;
  role?: string;
  roleOptions?: string[];
  accessTypeOptions?: string[];
  onChangeRole?: (x: string) => Promise<void> | void;
  onChangeAccessType?: (x: string) => Promise<void> | void;
  AccessValue?: Access;
}
const UserComponent = ({
  url,
  name,
  email,
  showRole,
  showDelete,
  onDelete,
  role,
  roleOptions,
  onChangeRole,
  accessTypeOptions,
  onChangeAccessType,
  AccessValue
}: Props) => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showAccessTypes, setShowAccessTypes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [changingAccess, setChangingAccess] = useState(false);

  const accessRef = useRef<any>();

  const handleDelete = async () => {
    setDeleting(true);
    if (onDelete) {
      await onDelete();
    }
    setDeleting(false);
  };
  const handleRoleChange = async (x: string) => {
    setLoading(true);

    if (onChangeRole) await onChangeRole(x);

    setLoading(false);
  };

  const handleAccessTypeChange = async (x: string) => {
    setChangingAccess(true);
    if (onChangeAccessType) await onChangeAccessType(x);

    setChangingAccess(false);
  };

  return (
    <div className=" flex items-center justify-between ">
      <span className=" flex items-center ">
        {!error && url ? (
          <img src={url} onError={() => setError(true)} className=" rounded-full h-8 w-8" alt="" />
        ) : (
          <span className=" w-8 h-8 rounded-full border border-bash flex items-center justify-center">
            <TbUser size={24} />
          </span>
        )}
        <div className=" ml-2.5 ">
          <p className=" font-semibold text-sm">{name}</p>
          <p className=" text-bash text-xs">{email}</p>
        </div>
      </span>
      <span className=" items-center flex ">
        <div className=" flex items-center gap-x-2 ">
          {accessTypeOptions && !showRole && (
            <SelectionWithLabel
              onChange={(x: string) => {
                handleAccessTypeChange(x);
              }}
              value={AccessValue?.accessType || 'Role'}
              options={accessTypeOptions}
            />
          )}

          {roleOptions && !showRole && (
            <SelectionWithLabel
              onChange={(x: string) => {
                handleRoleChange(x);
              }}
              value={AccessValue?.role || 'Role'}
              options={roleOptions}
            />
          )}
        </div>

        {showRole && <span className=" text-sm font-semibold">{role}</span>}
        {showDelete && (
          <span className=" hover:bg-ashShade-0 p-2 rounded-full" onClick={handleDelete}>
            {deleting ? <LoaderX color="blue" /> : <TbTrash color="#C8CDD4" />}
          </span>
        )}
      </span>
    </div>
  );
};

interface SelectionWithLabelType {
  value: string;
  onChange: (x: string) => Promise<void> | void;
  options: string[];
}
const SelectionWithLabel = ({ value, onChange, options }: SelectionWithLabelType) => {
  const [open, setOpen] = useState(false);
  const optionsRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useClickOutSideComponent(optionsRef, () => {
    setOpen(false);
  });
  let className = ' ml-2  ';
  return (
    <div className=" cursor-pointer">
      <p
        onClick={() => {
          setOpen(true);
        }}
        className=" flex font-semibold text-bblack-0 whitespace-nowrap items-center text-sm">
        {value}
        {open ? <TbChevronUp className={className} /> : <TbChevronDown className={className} />}
      </p>
      {open && (
        <span
          ref={optionsRef}
          className="absolute cursor-pointer bg-white z-10 w-24  flex flex-col   shadow-bnkle p-2 rounded-md gap-y-1">
          {options.map((m) => (
            <span
              onClick={(e) => {
                setLoading(true);
                e.stopPropagation();
                if (value !== m) {
                  onChange(m);
                }
                setLoading(false);
                setOpen(false);
              }}
              className={`p-2 text-xs w-full text-bblack-0 font-semibold whitespace-nowrap ${
                value === m ? 'hover:bg-lightblue' : 'hover:bg-ashShade-0'
              }   rounded-md`}>
              {loading ? <LoaderX className=" w-2 h-2 " /> : m}
            </span>
          ))}
        </span>
      )}
    </div>
  );
};

export { UserComponent };
