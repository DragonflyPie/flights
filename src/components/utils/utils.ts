import { Flight, FlightRaw } from "../../types/types";

const dayjs = require("dayjs");
require("dayjs/locale/ru");
const localizedFormat = require("dayjs/plugin/localizedFormat");
var duration = require("dayjs/plugin/duration");
dayjs.extend(localizedFormat);
dayjs.extend(duration);

export const capitalize = (name: string | undefined): string => {
  if (name === undefined) {
    return "";
  }
  return name.slice(0, 1).toUpperCase() + name.slice(1).toLocaleLowerCase();
};

export const getDate = (dt: Date): string => {
  const date = dayjs(dt).locale("ru").format("DD MMM dd");
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
    .format("HH ч mm мин");
  return hours;
};

export function onlyUnique(value: string, index: number, self: any) {
  return self.indexOf(value) === index;
}

export const flattenData = (data: FlightRaw[]): Flight[] => {
  const flattenFlights = data.map((flight) => {
    return {
      token: flight.flightToken,
      price: flight.flight.price.total.amount,
      carrier: flight.flight.carrier,
      legs: flight.flight.legs,
    };
  });
  return flattenFlights;
};

export const sliceAirline = (name: string) => {
  if (name.length > 19) {
    return name.slice(0, 14) + "...";
  }
  return name;
};
