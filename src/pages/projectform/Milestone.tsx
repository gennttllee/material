import trendline from '../../assets/trend.svg';
import check from '../../assets/check.svg';

interface Props {
  status: string;
  index: number;
  title: string;
}

const Milestone = ({ status, index, title }: Props) => {
  return (
    <div className="flex flex-col  space-x-1 lg:space-x-0 items-center lg:items-start lg:flex-col relative">
      <div className="  flex lg:flex-row flex-col items-center relative">
        <div
          className={`${
            status === 'ongoing'
              ? 'bg-bblue text-white'
              : status === 'completed'
                ? ' bg-green-600'
                : 'bg-white text-bblue'
          } text-sm  rounded-full w-8 h-8 lg:w-9 lg:h-9 flex justify-center items-center lg:text-xl `}
        >
          {status === 'completed' ? (
            <img loading="lazy" decoding="async" src={check} className="w-3 lg:w-4" alt="check" />
          ) : (
            <span>{index}</span>
          )}
        </div>

        <div className="hidden lg:block lg:ml-3">{title}</div>
      </div>
      <div className="hidden lg:block ">
        {index <= 3 ? (
          <img loading="lazy" decoding="async" src={trendline} alt="" className="h-9 ml-[18px]" />
        ) : null}
      </div>
    </div>
  );
};

export default Milestone;
