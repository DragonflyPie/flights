import React from "react";

type InputFilterProps = {
  value: number;
  name: string;
  min: number;
  max: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputFilter = ({ name, value, onChange, min, max }: InputFilterProps) => {
  return (
    <>
      <label htmlFor={name}>{name}</label>
      <input
        id={name}
        type="number"
        onChange={onChange}
        value={value}
        className="filters__price"
        min={min}
        max={max}
      />
    </>
  );
};

export default InputFilter;
