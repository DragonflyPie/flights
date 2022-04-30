import { Filter, FilterParams, Flight, Group } from "../../types/types";
import { onlyUnique } from "../utils/utils";

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
