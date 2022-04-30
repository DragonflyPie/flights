import React, { useEffect, useState } from "react";
import CheckBoxFilter from "../filters/CheckBoxFilter";
import InputFilter from "../filters/InputFilter";
import RadioFilter from "../filters/RadioFilter";
import { Filter, Flight, Group, SortingMethod } from "../../types/types";
import { flattenData } from "../utils/utils";
import {
  filterFlights,
  getDuration,
  getFlightsByAirline,
  getMaxPrice,
  getMinPrice,
  getPossibleAirlines,
} from "../filters/filtersUtils";

type SideBarProps = {
  updateFlightsToRender: (flights: Flight[]) => void;
};

const SideBar = ({ updateFlightsToRender }: SideBarProps) => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [sortBy, setSortBy] = useState<SortingMethod>("priceAsc");
  const [filters, setFilters] = useState<Filter[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  useEffect(() => {
    const getInitialData = async () => {
      const response = await fetch("./data/flights.JSON");
      const data = await response.json();
      const transformedData = await flattenData(data.result.flights);

      setFlights(transformedData);
    };

    getInitialData();
  }, []);

  useEffect(() => {
    if (flights.length) {
      setMinPrice(getMinPrice(flights));
      setMaxPrice(getMaxPrice(flights));
    }
  }, [flights]);

  useEffect(() => {
    const filteredFlights = filterFlights({
      flights,
      filters,
      min: minPrice,
      max: maxPrice,
    });

    const sortedFlights = sortFlights(filteredFlights, sortBy);
    updateFlightsToRender(sortedFlights);
  }, [filters, flights, maxPrice, minPrice, sortBy, updateFlightsToRender]);

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

  return (
    <div className="sidebar">
      <div className="radio">
        <h2>Сортировать</h2>
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

      <div className="sidebar__directness">
        <h2>Фильтровать</h2>
        <CheckBoxFilter
          value={"1 пересадка"}
          active={filterExist({ value: "indirect", group: Group.DIRECTNESS })}
          avaliable={filterFlights({
            flights,
            filters,
            min: minPrice,
            max: maxPrice,
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
        <CheckBoxFilter
          value={"без пересадок"}
          active={filterExist({ value: "direct", group: Group.DIRECTNESS })}
          avaliable={filterFlights({
            flights,
            filters,
            min: minPrice,
            max: maxPrice,
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
      </div>

      <div className="sidebar__price">
        <h2>Цена</h2>
        <InputFilter value={minPrice} name="От " onChange={updateMinPrice} />
        <InputFilter value={maxPrice} name="До " onChange={updateMaxPrice} />
      </div>
      <div className="sidebar__airlines">
        <h2>Авиакомпании</h2>
        {getPossibleAirlines(flights).map((airline) => (
          <CheckBoxFilter
            key={airline}
            value={airline}
            airlineMinPrice={getMinPrice(getFlightsByAirline(flights, airline))}
            active={filterExist({
              value: airline,
              group: Group.AIRLINE,
            })}
            avaliable={filterFlights({
              flights,
              filters,
              min: minPrice,
              max: maxPrice,
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
      </div>
    </div>
  );
};

export default SideBar;
