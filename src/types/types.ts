export interface FlightRaw {
  flightToken: string;
  flight: {
    carrier: {
      uid: string;
      caption: string;
    };
    price: {
      total: {
        amount: number;
      };
    };
    legs: Leg[];
  };
}

export interface Flight {
  token: string;
  price: number;
  carrier: {
    uid: string;
    caption: string;
  };
  legs: Leg[];
}

export interface Leg {
  duration: number;
  segments: Segment[];
}

export interface Segment {
  departureAirport: Description;
  departureCity?: Description;
  arrivalAirport: Description;
  arrivalCity?: Description;
  travelDuration: number;
  arrivalDate: Date;
  departureDate: Date;
  flightNumber: string;
  airline: Description;
}

export interface Description {
  uid: string;
  caption: string;
}

export type SortingMethod = "priceAsc" | "priceDesc" | "duration";

export enum Group {
  AIRLINE = "airline",
  DIRECTNESS = "direct",
}
export interface Filter {
  value: string;
  group: Group;
  func: Function;
}

export interface FilterParams {
  filters: Filter[];
  flights: Flight[];
  min: number;
  max: number;
  facet?: "price" | "airline" | "directness";
}
