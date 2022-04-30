import { Flight } from "./types/types";

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

export function onlyUnique(value: string, index: number, self: any) {
  return self.indexOf(value) === index;
}

export const getPossibleAirlines = (flights: Flight[]) => {
  return flights
    .map((flight) => flight.carrier.caption)
    .filter(onlyUnique)
    .sort((a, b) => (a > b ? -1 : 1));
};

export const getMinPrice = (flights: Flight[]) => {
  const prices = flights.map((flight) => flight.price);
  return Math.min(...prices);
};

export const getMaxPrice = (flights: Flight[]) => {
  const prices = flights.map((flight) => flight.price);
  return Math.max(...prices);
};

export const getDuration = (flight: Flight) => {
  return flight.legs[0].duration + flight.legs[1].duration;
};

export const getLastFlightOnPage = (flightsPerPage: number, page: number) => {
  return flightsPerPage * page;
};
