import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInSeconds,
  differenceInYears
} from 'date-fns';
import axios from 'axios';
import fileDownload from 'js-file-download';
import { Doc, LatestDoc } from 'components/projects/documents/document-repo/SingleDocModal';
import { postForm } from 'apis/postForm';
import { displayError } from 'Utils';

const convertToProper = (str: string = '') => {
  if (str.length === 1) return str[0].toUpperCase();
  return str ? str[0].toUpperCase() + str.slice(1) : '';
};

const checkforSelection = (contractors_: any[], id: string) => {
  let isfound = contractors_.filter((m) => m._id === id);
  return isfound.length > 0 ? true : false;
};

function bytesToSize(bytes: number) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0 || isNaN(bytes)) return 'n/a';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  if (i === 0) return `${bytes} ${sizes[i]})`;
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
}

const hasDatePassed = (date: any) => {
  return new Date().getTime > date.getTime();
};

const getTimeRemaining = (start: Date, end: Date) => {
  let endT = new Date(end),
    startT = new Date(start);
  let years = differenceInYears(endT, startT);
  let months = differenceInMonths(endT, startT);

  let days = differenceInDays(endT, startT);
  let hours = differenceInHours(endT, startT);
  let minutes = differenceInMinutes(endT, startT);
  let seconds = differenceInSeconds(endT, startT);

  if (startT.getTime() >= endT.getTime()) {
    return 'ended';
  } else {
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}`;
    }
    if (months > 0) {
      return `${months} month${months > 1 ? 's' : ''}`;
    }
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''}`;
    }
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    if (seconds > 0) {
      return `${seconds} second${seconds > 1 ? 's' : ''}`;
    }
  }
};

const relativeNavigate = (str: string) => {};

const getFileUrl = async (m: LatestDoc) => {
  let { response, e } = await postForm('post', 'files/download', {
    S3Key: m.S3Key,
    Bucket: m.Bucket
  });
  if (response) {
    return response.data.data.url;
  }
};

const _getFileUrl = async (m: LatestDoc) => {
  return await postForm('post', 'files/download', {
    S3Key: m.S3Key,
    Bucket: m.Bucket
  });
};

let handleDownload = async (url: string, name: string) => {
  let res = await axios.get(url, {
    responseType: 'blob'
  });
  // .then((res) => {
  fileDownload(res.data, name, res.data.type);
  // });
};

let getFileBlob = async (url: string, name: string = '') => {
  try {
    let res = await fetch(url);
    return await res.blob();
  } catch (error) {
    console.log(error);
    displayError('could not get file from host');
  }
};

const convertDocToFile = async (m: LatestDoc) => {
  try {
    let { response, e } = await _getFileUrl(m);
    if (response) {
      return await getFileBlob(response?.data?.data?.url);
    } else {
      console.log(e);
      displayError('could not get File');
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteFile = async (id: string) => {
  return await postForm('delete', `files/delete/${id}`);
};

const editFile = async (id: string, body: { [field: string]: string }) => {
  return await postForm('patch', `files/update/${id}`, body);
};

const inRange = (start: Date, end: Date, date: Date) => {
  if (start.getTime() <= date.getTime() && end.getTime() >= date.getTime()) {
    return true;
  } else {
    return false;
  }
};
const isWeek = (date = new Date(), time = 'this') => {
  let today = new Date();
  let datenumber = today.getDate();
  let monthNumber = today.getMonth();
  let weekday = today.getDay();
  let weekstart =
    new Date(today.getFullYear(), monthNumber, datenumber).getTime() - weekday * 24 * 60 * 60000;
  let weekend = weekstart + 7 * 24 * 60 * 60000;
  if (time === 'lastweek') {
    weekend = weekstart;
    weekstart = new Date(weekend).getTime() - 7 * 24 * 60 * 60000;
  }
  return inRange(new Date(weekstart), new Date(weekend), date);
};

const islastMonth = (date = new Date()) => {
  let today = new Date().getMonth();
  if (today - 1 === date.getMonth()) {
    return true;
  }
  return false;
};

let truncateText = (str: string, maxletters: number = Infinity) => {
  if (!str) return '';
  if (str.length > maxletters) {
    let xtra = '...';
    let rawstr = str.slice(0, maxletters - 3) + xtra;
    return rawstr;
  }
  return str;
};

const getTimeDescription = (str: string = new Date().toISOString()) => {
  let date = new Date(str ? str : new Date().toISOString());
  let end = new Date(date.getTime() + 1000 * 60 * 60);
  let dstring = date.toString().split(' ');
  let endString = end.toString().split(' ');
  let st = `${dstring[2]} ${dstring[1]} ${dstring[3]}, ${dstring[4].slice(
    0,
    5
  )} - ${endString[4].slice(0, 5)}`;
  return st;
};

const toDecimalPlaceWithCommas = (x: number | string = 0) => {
  let y: any;
  if (typeof x === 'string') {
    y = parseInt(x).toFixed(2).split('.');
  } else {
    y = x.toFixed(2).split('.');
  }

  let z = parseInt(y[0]).toLocaleString();
  return z + '.' + y[1];
};

const convertToSentence = (str: string) => {
  return str
    .split(' ')
    .map((m) => convertToProper(m))
    .join(' ');
};

export {
  convertToProper,
  checkforSelection,
  bytesToSize,
  hasDatePassed,
  getTimeRemaining,
  relativeNavigate,
  handleDownload,
  isWeek,
  islastMonth,
  truncateText,
  getTimeDescription,
  toDecimalPlaceWithCommas,
  getFileUrl,
  editFile,
  deleteFile,
  convertToSentence,
  convertDocToFile
};
