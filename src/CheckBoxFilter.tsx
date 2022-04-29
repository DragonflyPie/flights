import React from "react";

type CheckBoxFilterProps = {
  value: string;
  active: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  avaliable: boolean;
};

const CheckBoxFilter = ({
  value,
  active,
  onChange,
  avaliable,
}: CheckBoxFilterProps) => {
  return (
    <div className="filters__group">
      <input
        id={value}
        type="checkbox"
        checked={active}
        onChange={onChange}
        disabled={!avaliable}
      />
      <label htmlFor={value}>{value}</label>
    </div>
  );
};

export default CheckBoxFilter;
