import { FC } from 'react';
import { ModalWrapper } from './SubTaskCard';
import { IoIosClose, IoIosArrowBack, IoMdSearch } from 'react-icons/io';
import { flexer, hoverFade } from '../../../../../constants/globalStyles';
import Button from 'components/shared/Button';

interface Props {
  onCloseModal: () => void;
}

interface CheckboxGroupProps {
  title: string;
  options: string[];
}

const CheckboxGroup: FC<CheckboxGroupProps> = ({ title, options }) => (
  <div className="flex flex-col gap-2">
    <p className="font-satoshi font-medium text-base text-bblack-1">{title}</p>
    <div className="flex flex-col gap-2">
      {options.map((option, index) => (
        <CheckboxLabel key={index} label={option} />
      ))}
    </div>
  </div>
);

interface CheckboxLabelProps {
  label: string;
}

const CheckboxLabel: FC<CheckboxLabelProps> = ({ label }) => (
  <label className="flex items-center gap-2">
    <input type="checkbox" className="border-bash text-bash" />
    <span className="text-base font-satoshi font-normal text-bash">{label}</span>
  </label>
);

export const AddPredecessorModal: FC<Props> = ({ onCloseModal }) => {
  const checkboxGroups = [
    {
      title: '1st & Ground Floor',
      options: [
        'Remove formwork from ground floor columns',
        'Remove formwork from ground floor columns',
        'Remove formwork from ground floor columns',
        'Remove formwork from ground floor columns'
      ]
    },
    { title: '2nd Floor', options: ['Option A', 'Option B', 'Option C', 'Option D'] },
    { title: '3rd Floor', options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'] }
  ];

  return (
    <ModalWrapper>
      <div className="flex flex-col gap-6">
        <div className={flexer}>
          <div className="flex items-center gap-4 w-[175.33px]">
            <IoIosArrowBack
              size={16}
              className={`${hoverFade} text-ashShade-2 transform transition-all`}
              onClick={onCloseModal}
            />
            <p className="text-base text-bblack-1 font-satoshi font-bold">Add Predecessor</p>
          </div>
          <IoIosClose
            size={24}
            className={`${hoverFade} text-ashShade-2 transform transition-all`}
            onClick={onCloseModal}
          />
        </div>

        <div className="w-full bg-ashShade-0 py-2 px-4 rounded-lg">
          <div className="flex items-center gap-1">
            <IoMdSearch
              size={20}
              className={`${hoverFade} text-ashShade-2 transform transition-all`}
            />
            <input
              type="text"
              placeholder="Search"
              className="flex-grow text-base text-bash font-medium font-satoshi bg-transparent outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 overflow-x-scroll h-[300px]">
          {checkboxGroups.map((group, index) => (
            <CheckboxGroup key={index} title={group.title} options={group.options} />
          ))}
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button text="Back" type="secondary" onClick={onCloseModal} />
          <Button text="Done" onClick={() => {}} />
        </div>
      </div>
    </ModalWrapper>
  );
};
