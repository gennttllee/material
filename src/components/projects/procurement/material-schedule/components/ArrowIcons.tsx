import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";


const ArrowIcons = () => {
  return (
    <div className="flex flex-col w-[12px] h-[12px] items-center ml-1">
      <span className="hover:cursor-pointer">
      <IoIosArrowUp color="#9099A8" fontSize={10} />
      </span>
      <span className="hover:cursor-pointer">
      <IoIosArrowDown color="#9099A8" fontSize={10} />
      </span>
    </div>
  )
}

export default ArrowIcons;