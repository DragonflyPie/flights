const dayjs = require("dayjs");
require("dayjs/locale/ru");
const localizedFormat = require("dayjs/plugin/localizedFormat");
var duration = require("dayjs/plugin/duration");
dayjs.extend(localizedFormat);
dayjs.extend(duration);

export const capitalize = (name: string | undefined): string => {
  if (name == undefined) {
    return "";
  }
  return name.slice(0, 1).toUpperCase() + name.slice(1).toLocaleLowerCase();
};

export const getDate = (dt: Date): string => {
  const date = dayjs(dt).locale("ru").format("DD, MMM dd");
  return date;
};

export const getTime = (dt: Date): string => {
  const time = dayjs(dt).format("HH:mm");
  return time;
};

export const getHours = (duration: Number): string => {
  const hours = dayjs
    .duration(duration, "Minutes")
    .locale("ru")
    .format("HHч mmм");
  return hours;
};
