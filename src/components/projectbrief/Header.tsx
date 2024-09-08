interface Props {
  title: string;
  heading: string;
}

const Header = ({ title, heading }: Props) => {
  return (
    <div>
      <p className=" text-bash text-base mb-1">{title}</p>
      <h3 className="text-2xl font-semibold mb-8">{heading}</h3>
    </div>
  );
};

export default Header;
