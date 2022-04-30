import { Filter, FilterParams, Flight, FlightRaw, Group } from "./types/types";

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

export const filterByAirlines = (flight: Flight, filters: Filter[]) => {
  const airlineFilters = filters.filter(
    (filter) => filter.group === Group.AIRLINE
  );
  if (!airlineFilters.length) {
    return true;
  }
  return airlineFilters.some((filter) => filter.func(flight));
};

export const filterByDirectness = (flight: Flight, filters: Filter[]) => {
  const directnessFilters = filters.filter(
    (filter) => filter.group === Group.DIRECTNESS
  );
  if (!directnessFilters.length) {
    return true;
  }
  return directnessFilters.some((filter) => filter.func(flight));
};

export const filterByMinPrice = (flight: Flight, minPrice: number) => {
  if (minPrice) {
    return flight.price >= minPrice;
  }
  return true;
};

export const filterByMaxPrice = (flight: Flight, maxPrice: number) => {
  if (maxPrice) {
    return flight.price <= maxPrice;
  }
  return true;
};

export const filterFlights = (filterParams: FilterParams) => {
  return filterParams.flights.filter((flight) => {
    const showByAirline = filterByAirlines(flight, filterParams.filters);
    const showByMinPrice = filterByMinPrice(flight, filterParams.min);
    const showByMaxPrice = filterByMaxPrice(flight, filterParams.max);
    const showByDirect = filterByDirectness(flight, filterParams.filters);
    if (filterParams.facet) {
      switch (filterParams.facet) {
        case "airline":
          return showByDirect && showByMaxPrice && showByMinPrice;
        case "price":
          return showByAirline && showByDirect;
        case "directness":
          return showByAirline && showByMaxPrice && showByMinPrice;
      }
    }
    return showByAirline && showByDirect && showByMaxPrice && showByMinPrice;
  });
};

export const getFlightsByAirline = (flights: Flight[], airline: string) => {
  return flights.filter((flight) => flight.carrier.caption === airline);
};

export const sliceAirline = (name: string) => {
  if (name.length > 19) {
    return name.slice(0, 14) + "...";
  }
  return name;
};
