import useProjectImages from 'Hooks/useProjectImages';
import NoContent from 'components/projects/photos/NoContent';
import { LoaderX } from 'components/shared/Loader';
import React, { useEffect, useMemo, useState } from 'react';
import { NoContentDashBoard } from '.';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
const IMAGE_PER_PAGE = 12;
const Photos = () => {
  let { images, loading } = useProjectImages('media');
  const [page, setPage] = useState(1);

  const MaxPage = useMemo(() => {
    return Math.ceil(images.length / IMAGE_PER_PAGE);
  }, [images]);
  const viewing = useMemo(() => {
    let left = (page - 1) * IMAGE_PER_PAGE;
    let right = page * IMAGE_PER_PAGE;

    return images.slice(left, right);
  }, [page, images]);

  const handleClick = (btn: 'left' | 'right') => () => {
    if (btn === 'right' && page + 1 <= MaxPage) {
      setPage(page + 1);
    }
    if (btn === 'left' && page - 1 >= 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="rounded-md h-full  py-6 flex flex-col  bg-white ">
      <div className="h-full flex-col">
        <div className="flex justify-between items-center px-4 pb-6">
          <p className="text-2xl font-semibold  ">Photos & videos</p>

          {images.length > 0 && (
            <div className="flex items-center ">
              <span className="mr-3">
                {page} of {MaxPage}
              </span>
              <span onClick={handleClick('left')} className="p-0.5 cursor-pointer">
                <FaChevronLeft color={page === 1 ? 'lightgrey' : 'black'} />
              </span>
              <span onClick={handleClick('right')} className="p-0.5 cursor-pointer">
                <FaChevronRight color={page === MaxPage ? 'lightgrey' : 'black'} />
              </span>
            </div>
          )}
        </div>

        {loading ? (
          <LoaderX className="w-full h-full items-center justify-center" />
        ) : images.length < 1 ? (
          <div className="flex-1 overflow-y-auto">
            <NoContentDashBoard
              imageClass="w-1/3"
              titleClass="font-semibold"
              containerClass=" flex flex-col items-center "
              title="No photos have been uploaded on this project"
            />
          </div>
        ) : (
          <div className=" grid-cols-1 flex-1 sm:grid-cols-2 lg:grid-cols-4 grid gap-4 px-4 overflow-y-auto">
            {viewing.map((m, i) => (
              <img
                key={i}
                className="rounded-md w-full h-[108px] max-h-[108px] object-cover"
                src={m}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Photos;
