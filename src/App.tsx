import { useCallback, useState } from "react";
import "./App.css";
import FlightsList from "./FlightsList";
import SideBar from "./SideBar";
import { Flight } from "./types/types";

function App() {
  const [flightsToRender, setFlightsToRender] = useState<Flight[]>([]);

  const updateFlightsToRender = useCallback((preparedFlights: Flight[]) => {
    setFlightsToRender(preparedFlights);
  }, []);

  return (
    <div className="app">
      <SideBar updateFlightsToRender={updateFlightsToRender} />
      <FlightsList flightsToRender={flightsToRender} />
    </div>
  );
}

export default App;
