export const centered = ' flex items-center justify-center ';
export const flexer = ' flex items-center justify-between ';
export const responsiveFlex = 'flex flex-col md:flex-row items-center md:justify-between';
export const errorStyle = ' text-bred text-left ';
export const spacer = ' m-3 ';
export const hoverFade = ' cursor-pointer hover:opacity-80 ';
export const scrollbarWithBg = (bgColor?: string) =>
  ` scrollbar scrollbar-thin scrollbar-thumb-ashShade-4 scrollbar-track-${bgColor} !scrollbar-thumb-rounded-full scrollbar-track-rounded-full `;
export const horizontalScrollBar =
  ' scrollbar scrollbar-thin scrollbar-thumb-ashShade-4 scrollbar-track-transparent scrollbar-thumb-opacity-0 scrollbar-track-opacity-0 hover:scrollbar-thumb-opacity-100 hover:scrollbar-track-opacity-100 !scrollbar-thumb-rounded-full scrollbar-track-rounded-full ';
export const verticalScrollbar =
  ' scrollbar scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent scrollbar-hide scrollbar-thumb-opacity-0 scrollbar-track-opacity-0 hover:scrollbar-thumb-opacity-100 hover:scrollbar-track-opacity-100 !scrollbar-thumb-rounded-full scrollbar-track-rounded-full';
// For the hover effect on the scrollbar track
export const scrollbarTrackHover =
  ' hover:scrollbar-track-transparent hover:scrollbar-track-rounded-full ';
