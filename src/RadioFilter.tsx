import React from "react";
import { SortingMethod } from "./types/types";

type RadioFilterProps = {
  value: SortingMethod;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
  label: string;
};

const RadioFilter = ({ value, onChange, label, checked }: RadioFilterProps) => {
  return (
    <div className="radio__group">
      <input
        id={value}
        type="radio"
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={value}> - {label}</label>
    </div>
  );
};

export default RadioFilter;
