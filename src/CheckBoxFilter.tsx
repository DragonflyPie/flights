import React from "react";
import { sliceAirline } from "./utils";

type CheckBoxFilterProps = {
  value: string;
  active: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  avaliable: boolean;
  airlineMinPrice?: number;
};

const CheckBoxFilter = ({
  value,
  active,
  onChange,
  avaliable,
  airlineMinPrice,
}: CheckBoxFilterProps) => {
  return (
    <div className="sidebar__group">
      <input
        id={value}
        type="checkbox"
        checked={active}
        onChange={onChange}
        disabled={!avaliable}
      />
      {!airlineMinPrice ? (
        <label htmlFor={value}>&nbsp;- {value}</label>
      ) : (
        <label
          htmlFor={value}
          className={airlineMinPrice ? "sidebar__airline-label" : ""}
        >
          &nbsp;- {sliceAirline(value)}
          <span>от {airlineMinPrice} р.</span>
        </label>
      )}
    </div>
  );
};

export default CheckBoxFilter;
