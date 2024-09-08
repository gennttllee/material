import Button from 'components/shared/Button';
import { TbChevronLeft, TbChevronRight } from 'react-icons/tb';

const PaginationComponent = ({
  pageIndex,
  pageCount,
  setPageIndex
}: {
  pageIndex: number;
  pageCount: number;
  setPageIndex: any;
}) => {
  return (
    <>
      {pageCount > 1 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 my-10">
          <Button
            text="Previous"
            className={`w-full md:w-fit ${
              pageIndex < 1 ? ' !text-ashShade-0' : '!text-black'
            } !border-0`}
            disabled={pageIndex < 1 ? true : false}
            onClick={(ev) => {
              ev?.stopPropagation();
              setPageIndex((prev: number) => (prev -= 1));
            }}
            type="plain"
            LeftIcon={<TbChevronLeft />}
          />
          <div className="flex gap-2 items-center overflow-x-scroll">
            {Array.from({ length: pageCount }).map((_, index) => (
              <button
                className={` ${
                  pageIndex === index ? 'bg-bblue text-white' : 'text-black hover:bg-pbg'
                } font-Medium py-1 px-3 rounded `}
                onClick={(ev) => {
                  ev?.stopPropagation();
                  setPageIndex(index);
                }}>
                {index + 1}
              </button>
            ))}
          </div>
          <Button
            text="Next"
            className={`w-full md:w-fit ${
              pageIndex === pageCount - 1 || !pageCount ? ' !text-ashShade-0' : '!text-black'
            } !border-0`}
            disabled={pageIndex === pageCount - 1 || !pageCount ? true : false}
            onClick={(ev) => {
              ev?.stopPropagation();
              setPageIndex((prev: number) => (prev += 1));
            }}
            type="plain"
            RightIcon={<TbChevronRight />}
          />
        </div>
      )}
    </>
  );
};

export default PaginationComponent;
