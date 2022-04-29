import React, { useEffect, useState } from "react";

import "./App.css";
import CheckBoxFilter from "./CheckBoxFilter";
import InputFilter from "./InputFilter";
import RadioFilter from "./RadioFilter";
import SideBar from "./SideBar";

import {
  Filter,
  Flight,
  FlightRaw,
  Group,
  Segment,
  SortingMethod,
} from "./types/types";
import {
  capitalize,
  getDate,
  getDuration,
  getHours,
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
      (filter) => filter.group === Group.DIRECT
    );
    if (!directnessFilters.length) {
      return true;
    }
    return directnessFilters.some((filter) => filter.func(flight));
  };

  const filterByMinPrice = (flight: Flight, minPrice: number) => {
    return flight.price >= minPrice;
  };

  const filterByMaxPrice = (flight: Flight, maxPrice: number) => {
    return flight.price <= maxPrice;
  };

  const filterFlights = (flights: Flight[], filters: Filter[]) => {
    return flights.filter((flight) => {
      const showByAirline = filterByAirline(flight, filters);
      const showByMinPrice = filterByMinPrice(flight, minPrice);
      const showByMaxPrice = filterByMaxPrice(flight, maxPrice);
      const showByDirect = filterByDirectness(flight, filters);
      return showByAirline && showByDirect && showByMaxPrice && showByMinPrice;
    });
  };

  const visibleFlights = filterFlights(flights, filters);

  const lastElementOnPage = FLIGHTS_PER_PAGE * page;

  const filterExist = (params: Omit<Filter, "func">) => {
    const exists = filters.find(
      (filter) => filter.value === params.value && filter.group === params.group
    );
    return exists !== undefined;
  };

  const addFilter = (newFilter: Filter) => {
    setFilters((currentFilters) => [...currentFilters, newFilter]);
  };

  const removeFilter = (params: Omit<Filter, "func">) => {
    setFilters((currentFilters) =>
      currentFilters.filter(
        (filter) =>
          !(filter.value === params.value && filter.group === params.group)
      )
    );
  };

  const toggleFilter = (filter: Filter) => {
    if (filterExist({ value: filter.value, group: filter.group })) {
      removeFilter({ value: filter.value, group: filter.group });
    } else {
      addFilter(filter);
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
      setMaxPrice(getMaxPrice(flights));
      setMinPrice(getMinPrice(flights));
    }
  }, [flights]);

  const handleRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSortBy(e.target.value as SortingMethod);
  };

  const updateMinPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    // if (value < getMinPrice(flights)) {
    //   setMinPrice(getMinPrice(flights));
    //   return;
    // }
    // if (value > getMaxPrice(flights)) {
    //   setMaxPrice(getMaxPrice(flights));
    //   return;
    // }
    setMinPrice(value);
  };

  const updateMaxPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    // if (value < getMinPrice(flights)) {
    //   setMinPrice(getMinPrice(flights));
    //   return;
    // }
    // if (value > getMaxPrice(flights)) {
    //   setMaxPrice(getMaxPrice(flights));
    //   return;
    // }
    setMaxPrice(value);
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

  const renderedFlights = sortFlights(visibleFlights, sortBy)
    .slice(0, lastElementOnPage)
    .map((flight) => (
      <div className="flight" key={flight.token}>
        <div className="flight__price">{flight.price}</div>

        {flight.legs.map((leg, index) => (
          <div className="flight__leg" key={index}>
            <div className="">
              {capitalize(leg.segments[0].departureCity?.caption)},{" "}
              {leg.segments[0].departureAirport.caption.toUpperCase()}(
              {leg.segments[0].departureAirport.uid.toLocaleUpperCase()})&rarr;
              {capitalize(
                leg.segments[leg.segments.length - 1].arrivalCity?.caption
              )}
              ,
              {leg.segments[
                leg.segments.length - 1
              ].arrivalAirport.caption.toLocaleUpperCase()}
              (
              {leg.segments[
                leg.segments.length - 1
              ].arrivalAirport.uid.toLocaleUpperCase()}
              )
            </div>
            <div className="flight__dt">
              <div className="flight__time">
                {getTime(leg.segments[0].departureDate)}
              </div>
              <div className="flight__date">
                {getDate(leg.segments[0].departureDate)}
              </div>
              <div className="">{getHours(leg.duration)}</div>
              <div className="flight__date">
                {getDate(leg.segments[0].arrivalDate)}
              </div>
              <div className="flight__time">
                {getTime(leg.segments[0].arrivalDate)}
              </div>
            </div>
            <div className="">
              {leg.segments.length !== 1 && (
                <div className="">{leg.segments.length - 1} пересадка</div>
              )}
            </div>
            <div className="">
              {leg.segments[1] &&
              leg.segments[0].airline.uid !== leg.segments[1].airline.uid
                ? `${leg.segments[0].airline.caption}, ${leg.segments[1].airline.caption}`
                : leg.segments[0].airline.caption}
            </div>
            <hr></hr>
          </div>
        ))}
      </div>
    ));

  const loadMore = () => {
    setPage(page + 1);
  };

  return (
    <div className="app">
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
      {getPossibleAirlines(flights).map((airline) => (
        <CheckBoxFilter
          key={airline}
          value={airline}
          active={filterExist({ value: airline, group: Group.AIRLINE })}
          onChange={() =>
            toggleFilter({
              value: airline,
              group: Group.AIRLINE,
              func: (flight: Flight) => flight.carrier.caption === airline,
            })
          }
        />
      ))}
      <CheckBoxFilter
        value={"Без пересадок"}
        active={filterExist({ value: true, group: Group.DIRECT })}
        onChange={() =>
          toggleFilter({
            value: true,
            group: Group.DIRECT,
            func: (flight: Flight) =>
              flight.legs.every((leg) => leg.segments.length === 1),
          })
        }
      />
      <CheckBoxFilter
        value={"1 пересадка"}
        active={filterExist({ value: false, group: Group.DIRECT })}
        onChange={() =>
          toggleFilter({
            value: false,
            group: Group.DIRECT,
            func: (flight: Flight) =>
              flight.legs.some((leg) => leg.segments.length > 1),
          })
        }
      />
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

      {/* <SideBar /> */}
      <div className="">
        <div className="App">{renderedFlights}</div>
        <button onClick={loadMore}>Показать ещё</button>
      </div>
    </div>
  );
}

export default App;
