import React from "react";

type InputFilterProps = {
  value: number;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputFilter = ({ name, value, onChange }: InputFilterProps) => {
  return (
    <>
      <label htmlFor={name}>{name}</label>
      <input
        id={name}
        type="number"
        onChange={onChange}
        value={value}
        className="filters__price"
      />
    </>
  );
};

export default InputFilter;
