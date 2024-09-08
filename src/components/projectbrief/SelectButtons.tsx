interface Props {
  setter: any;
  state: string;
  label: string;
}

const SelectButtons = ({ setter, state, label }: Props) => {
  return (
    <span
      onClick={(e) => setter(label)}
      className={`w-full p-6 border-2 m-2  block sm:w-auto  cursor-pointer sm:inline   ${
        state !== label
          ? 'border-bash hover:text-bblue'
          : 'border-bblue bg-bblue text-white hover:text:white'
      } rounded-md flex justify-center  hover:border-bblue items-center `}
    >
      <span>{label}</span>
    </span>
  );
};

export default SelectButtons;
