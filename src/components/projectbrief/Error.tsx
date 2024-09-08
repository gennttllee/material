interface Prop {
  message: string;
}
const Error = ({ message }: Prop) => {
  return <div className=" text-red-600 text-xs my-2">{message}</div>;
};

export default Error;
