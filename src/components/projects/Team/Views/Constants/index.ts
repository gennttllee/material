import { TOption } from 'components/shared/SelectField/SelectField';
import moment from 'moment';
import timezoneslist from 'timezones-list';

const durations: TOption[] = [
  { label: '15 min', value: '15' },
  { label: '30 min', value: '30' },
  { label: '45 min', value: '45' },
  { label: '1 hour', value: '60' },
  { label: '1hr : 15min', value: '75' },
  { label: '1hr : 30min', value: '90' },
  { label: '1hr : 45min', value: '105' },
  { label: '2 hours', value: '120' }
];

const timezones: TOption[] = timezoneslist.map((m) => ({ label: m.label, value: m.label }));

const TimeSlots = (date: Date, isEditing = false) => {
  const today = new Date();
  const startingHour = 5;
  const currentHour = today.getHours();
  const isToday =
    today.getDate() === date.getDate() &&
    today.getMonth() === date.getMonth() &&
    today.getFullYear() === date.getFullYear();
  const initialHour = isEditing
    ? startingHour
    : !isToday || currentHour < startingHour
      ? startingHour
      : currentHour;

  let slots: TOption[] = [];

  for (let i = initialHour; i < 24; i++) {
    const hour = i <= 12 ? i : i - 12;
    const isPM = i >= 12;

    let hourlySlots = [...slots];
    const currentMin = today.getMinutes();

    if (isToday && currentHour === i) {
      // add 15
      if (currentMin < 15) {
        hourlySlots.push({
          label: `${hour} : 15 ${isPM ? 'PM' : 'AM'}`,
          value: (i * 60 + 15).toString()
        });
      }
      //add 30
      if (currentMin < 30) {
        hourlySlots.push({
          label: `${hour} : 30 ${isPM ? 'PM' : 'AM'}`,
          value: (i * 60 + 30).toString()
        });
      }
      //add 45
      if (currentMin < 45) {
        hourlySlots.push({
          label: `${hour} : 45 ${isPM ? 'PM' : 'AM'}`,
          value: (i * 60 + 45).toString()
        });
      }
    } else {
      hourlySlots = [
        ...hourlySlots,
        {
          label: `${hour} : 00 ${isPM ? 'PM' : 'AM'}`,
          value: (i * 60).toString()
        },
        {
          label: `${hour} : 15 ${isPM ? 'PM' : 'AM'}`,
          value: (i * 60 + 15).toString()
        },
        {
          label: `${hour} : 30 ${isPM ? 'PM' : 'AM'}`,
          value: (i * 60 + 30).toString()
        },
        {
          label: `${hour} : 45 ${isPM ? 'PM' : 'AM'}`,
          value: (i * 60 + 45).toString()
        }
      ];
    }

    slots = hourlySlots;
  }

  return slots;
};
let slots = TimeSlots(new Date());
let locations = [
  { label: 'Onsite', value: 'Onsite' },
  { value: 'Online', label: 'Online' }
];

const makeDuration = (str: string) => {
  let duration = parseInt(str);
  return `${duration > 60 ? Math.floor(duration / 60).toString() + ' Hr' : ''} ${
    duration % 60
  } Mins`;
};
const makeEndTIme = (start: string, duration: string) => {
  let time = new Date(start).getTime() + parseInt(duration) * 1000 * 60;
  return moment(new Date(time)).format('h:mm A');
};

export { durations, TimeSlots, slots, timezones, locations, makeDuration, makeEndTIme };
