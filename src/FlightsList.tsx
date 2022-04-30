import React, { useEffect, useState } from "react";
import { Flight } from "./types/types";
import { capitalize, getDate, getHours, getTime } from "./utils";

type FlightListProps = {
  flightsToRender: Flight[];
};

const FlightsList = ({ flightsToRender }: FlightListProps) => {
  const FLIGHTS_PER_PAGE = 5;
  const [page, setPage] = useState(1);

  const flightsOnPage = FLIGHTS_PER_PAGE * page;

  useEffect(() => {
    setPage(1);
  }, [flightsToRender]);

  const loadMore = () => {
    setPage(page + 1);
  };
  return (
    <div className="">
      {flightsToRender.slice(0, flightsOnPage).map((flight) => (
        <div className="flight" key={flight.token}>
          <div className="flight__price">{flight.price}</div>

          {flight.legs.map((leg, index) => (
            <div className="flight__leg" key={index}>
              <div className="">
                {capitalize(leg.segments[0].departureCity?.caption)},{" "}
                {leg.segments[0].departureAirport.caption.toUpperCase()}(
                {leg.segments[0].departureAirport.uid.toLocaleUpperCase()}
                )&rarr;
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
              {index === 0 && <hr></hr>}
            </div>
          ))}
        </div>
      ))}

      {flightsToRender.length > flightsOnPage && (
        <button onClick={loadMore}>Показать ещё</button>
      )}
    </div>
  );
};

export default FlightsList;
