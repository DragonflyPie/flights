import React, { useEffect, useState } from "react";
import { Flight } from "../../types/types";
import { capitalize, getDate, getHours, getTime } from "../utils/utils";
import { WiTime4 } from "react-icons/wi";

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
    <div className="flights-list">
      {flightsToRender.slice(0, flightsOnPage).map((flight) => (
        <div className="flight" key={flight.token}>
          <div className="flight__price-bar">
            <div className="flight__airline">{flight.carrier.caption}</div>
            <div className="flight__column">
              <div className="flight__price">{flight.price} &#8381;</div>
              Стоимость для одного взрослого пассажира
            </div>
          </div>

          {flight.legs.map((leg, index) => (
            <div className="flight__leg" key={index}>
              <div className="flight__airports">
                {capitalize(leg.segments[0].departureCity?.caption)},&nbsp;
                {leg.segments[0].departureAirport.caption.toUpperCase()}&nbsp;
                <span className="link">
                  ({leg.segments[0].departureAirport.uid.toUpperCase()}
                  )&nbsp;&rarr;&nbsp;
                </span>
                (
                {capitalize(
                  leg.segments[leg.segments.length - 1].arrivalCity?.caption
                )}
                ,
                {leg.segments[
                  leg.segments.length - 1
                ].arrivalAirport.caption.toUpperCase()}
                &nbsp;
                <span className="link">
                  (
                  {leg.segments[
                    leg.segments.length - 1
                  ].arrivalAirport.uid.toUpperCase()}
                  )
                </span>
              </div>
              <hr className="flight__line"></hr>
              <div className="flight__dt">
                <div className="flight__dt-group">
                  <div className="flight__time">
                    {getTime(leg.segments[0].departureDate)}
                  </div>
                  <div className="flight__date">
                    {getDate(leg.segments[0].departureDate)}
                  </div>
                </div>
                <div className="flight__dt-group">
                  <WiTime4 fontSize={20} />
                  <div className="">{getHours(leg.duration)}</div>
                </div>
                <div className="flight__dt-group">
                  <div className="flight__date">
                    {getDate(leg.segments[0].arrivalDate)}
                  </div>
                  <div className="flight__time">
                    {getTime(leg.segments[0].arrivalDate)}
                  </div>
                </div>
              </div>

              {leg.segments.length !== 1 ? (
                <div className="flight__change">
                  {leg.segments.length - 1} пересадка
                </div>
              ) : (
                <hr className="flight__change-line"></hr>
              )}

              <div className="">
                {leg.segments[1] &&
                leg.segments[0].airline.uid !== leg.segments[1].airline.uid
                  ? `${leg.segments[0].airline.caption}, ${leg.segments[1].airline.caption}`
                  : leg.segments[0].airline.caption}
              </div>
              {index === 0 && <hr className="flight__thick-line"></hr>}
            </div>
          ))}
          <button className="flight__button">ВЫБРАТЬ</button>
        </div>
      ))}

      {flightsToRender.length > flightsOnPage && (
        <button onClick={loadMore} className="flights-list__button">
          Показать ещё
        </button>
      )}
    </div>
  );
};

export default FlightsList;
