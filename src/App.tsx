import { useCallback, useState } from "react";
import "./App.scss";
import FlightsList from "./components/flightList/FlightsList";
import SideBar from "./components/sidebar/SideBar";
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
