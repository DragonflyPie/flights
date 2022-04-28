import React, { useEffect, useState } from "react";
import { LanguageServiceMode, setSyntheticLeadingComments } from "typescript";
import "./App.css";
import SideBar from "./SideBar";
import TicketList from "./TicketList";
import { Flight, FlightRaw, Segment } from "./types/types";
import { capitalize, getDate, getHours, getTime } from "./utils";

function App() {
  const FLIGHTS_PER_PAGE = 30;

  const [flights, setFlights] = useState<Flight[]>([]);
  const [page, setPage] = useState(1);

  const lastElementOnPage = FLIGHTS_PER_PAGE * page;

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

  const renderedFlights = flights.slice(0, lastElementOnPage).map((flight) => (
    <div className="flight" key={flight.token}>
      <div className="flight__price">{flight.price}</div>

      {flight.legs.map((leg) => (
        <div className="flight__leg">
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
              {getDate(leg.segments[0].departureDate)}
            </div>
            <div className="flight__time">
              {getTime(leg.segments[0].departureDate)}
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

  const loadMore = (): void => {
    setPage(page + 1);
  };

  console.log(renderedFlights);

  return (
    <div className="app">
      <SideBar />
      <div className="">
        <div className="App">{renderedFlights}</div>
        <button onClick={loadMore}>Показать ещё</button>
      </div>
    </div>
  );
}

export default App;
