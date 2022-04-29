import React from "react";

type CheckBoxFilterProps = {
  value: string;
  active: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const CheckBoxFilter = ({ value, active, onChange }: CheckBoxFilterProps) => {
  return (
    <div className="filters__group">
      <input type="checkbox" checked={active} onChange={onChange} />
      <label>{value}</label>
    </div>
  );
};

export default CheckBoxFilter;
