import React, { useEffect, useState } from "react";

import "./App.css";
import CheckBoxFilter from "./CheckBoxFilter";
import FlightsList from "./FlightsList";
import InputFilter from "./InputFilter";
import RadioFilter from "./RadioFilter";

import {
  Filter,
  FilterParams,
  Flight,
  FlightRaw,
  Group,
  SortingMethod,
} from "./types/types";
import {
  capitalize,
  getDate,
  getDuration,
  getHours,
  getLastFlightOnPage,
  getMaxPrice,
  getMinPrice,
  getPossibleAirlines,
  getTime,
} from "./utils";

function App() {
  const FLIGHTS_PER_PAGE = 5;

  const [flights, setFlights] = useState<Flight[]>([]);
  const [sortBy, setSortBy] = useState<SortingMethod>("priceAsc");
  const [filters, setFilters] = useState<Filter[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [page, setPage] = useState(1);

  const flightsOnPage = FLIGHTS_PER_PAGE * page;

  const filterByAirline = (flight: Flight, filters: Filter[]) => {
    const airlineFilters = filters.filter(
      (filter) => filter.group === Group.AIRLINE
    );
    if (!airlineFilters.length) {
      return true;
    }
    return airlineFilters.some((filter) => filter.func(flight));
  };

  const filterByDirectness = (flight: Flight, filters: Filter[]) => {
    const directnessFilters = filters.filter(
      (filter) => filter.group === Group.DIRECTNESS
    );
    if (!directnessFilters.length) {
      return true;
    }
    return directnessFilters.some((filter) => filter.func(flight));
  };

  const filterByMinPrice = (flight: Flight, minPrice: number) => {
    if (minPrice) {
      return flight.price >= minPrice;
    }
    return true;
  };

  const filterByMaxPrice = (flight: Flight, maxPrice: number) => {
    if (maxPrice) {
      return flight.price <= maxPrice;
    }
    return true;
  };

  const filterFlights = (filterParams: FilterParams) => {
    return filterParams.flights.filter((flight) => {
      const showByAirline = filterByAirline(flight, filterParams.filters);
      const showByMinPrice = filterByMinPrice(flight, minPrice);
      const showByMaxPrice = filterByMaxPrice(flight, maxPrice);
      const showByDirect = filterByDirectness(flight, filters);
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

  const filteredFlights = filterFlights({ flights, filters });

  const lastElementOnPage = FLIGHTS_PER_PAGE * page;

  const filterExist = ({ value, group }: { value: string; group: Group }) => {
    const exists = filters.find(
      (filter) => filter.value === value && filter.group === group
    );
    return exists !== undefined;
  };

  const addFilter = (filterToAdd: Filter) => {
    setFilters((currentFilters) => [...currentFilters, filterToAdd]);
  };

  const removeFilter = (filterToRemove: Filter) => {
    setFilters((currentFilters) =>
      currentFilters.filter(
        (filter) =>
          !(
            filter.value === filterToRemove.value &&
            filter.group === filterToRemove.group
          )
      )
    );
  };

  const toggleFilter = (filterToToggle: Filter) => {
    if (
      filterExist({ value: filterToToggle.value, group: filterToToggle.group })
    ) {
      removeFilter(filterToToggle);
    } else {
      addFilter(filterToToggle);
    }
  };

  useEffect(() => {
    const flattenData = (data: FlightRaw[]): Flight[] => {
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

    const getData = async () => {
      const response = await fetch("./data/flights.JSON");
      const data = await response.json();
      const transformedData = await flattenData(data.result.flights);

      setFlights(transformedData);
    };

    getData();
  }, []);

  useEffect(() => {
    if (flights.length) {
      setMinPrice(getMinPrice(flights));
      setMaxPrice(getMaxPrice(flights));
    }
  }, [flights]);

  const handleRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSortBy(e.target.value as SortingMethod);
  };

  const updateMinPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value) {
      setMinPrice(value);
    }
  };

  const updateMaxPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value) {
      setMaxPrice(value);
    }
  };

  const sortFlights = (flights: Flight[], sortBy: SortingMethod) => {
    if (sortBy === "priceDesc") {
      return flights.sort((a, b) => b.price - a.price);
    }
    if (sortBy === "duration") {
      return flights.sort((a, b) => getDuration(a) - getDuration(b));
    }
    return flights.sort((a, b) => a.price - b.price);
  };

  const flightsToRender = sortFlights(filteredFlights, sortBy);

  const loadMore = () => {
    setPage(page + 1);
  };

  return (
    <div className="app">
      <div className="TEMPORARY_COLUMN">
        <div className="radio">
          <RadioFilter
            value="priceAsc"
            label="по возрастанию цены"
            checked={sortBy === "priceAsc"}
            onChange={handleRadio}
          />
          <RadioFilter
            value="priceDesc"
            label="по убыванию цены"
            checked={sortBy === "priceDesc"}
            onChange={handleRadio}
          />
          <RadioFilter
            value="duration"
            label="по времени в пути"
            checked={sortBy === "duration"}
            onChange={handleRadio}
          />
        </div>
        <hr></hr>
        {getPossibleAirlines(flights).map((airline) => (
          <CheckBoxFilter
            key={airline}
            value={airline}
            active={filterExist({
              value: airline,
              group: Group.AIRLINE,
            })}
            avaliable={filterFlights({
              flights,
              filters,
              facet: "airline",
            }).some((flight) => flight.carrier.caption === airline)}
            onChange={() =>
              toggleFilter({
                value: airline,
                group: Group.AIRLINE,
                func: (flight: Flight) => flight.carrier.caption === airline,
              })
            }
          />
        ))}
        <hr></hr>
        <CheckBoxFilter
          value={"Без пересадок"}
          active={filterExist({ value: "direct", group: Group.DIRECTNESS })}
          avaliable={filterFlights({
            flights,
            filters,
            facet: "directness",
          }).some((flight) =>
            flight.legs.every((leg) => leg.segments.length === 1)
          )}
          onChange={() =>
            toggleFilter({
              value: "direct",
              group: Group.DIRECTNESS,
              func: (flight: Flight) =>
                flight.legs.every((leg) => leg.segments.length === 1),
            })
          }
        />
        <CheckBoxFilter
          value={"1 пересадка"}
          active={filterExist({ value: "indirect", group: Group.DIRECTNESS })}
          avaliable={filterFlights({
            flights,
            filters,
            facet: "directness",
          }).some((flight) =>
            flight.legs.some((leg) => leg.segments.length > 1)
          )}
          onChange={() =>
            toggleFilter({
              value: "indirect",
              group: Group.DIRECTNESS,
              func: (flight: Flight) =>
                flight.legs.some((leg) => leg.segments.length > 1),
            })
          }
        />
        <hr></hr>
        <InputFilter
          value={minPrice}
          name="от"
          onChange={updateMinPrice}
          min={getMinPrice(flights)}
          max={getMaxPrice(flights)}
        />
        <InputFilter
          value={maxPrice}
          name="до"
          onChange={updateMaxPrice}
          min={getMinPrice(flights)}
          max={getMaxPrice(flights)}
        />
      </div>

      {/* <SideBar /> */}
      <div className="">
        <FlightsList
          flightsOnPage={flightsOnPage}
          flightsToRender={flightsToRender}
        />

        {flightsToRender.length > flightsOnPage && (
          <button onClick={loadMore}>Показать ещё</button>
        )}
      </div>
    </div>
  );
}

export default App;
