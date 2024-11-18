import React, { Fragment, useState } from "react";
import InputText from "./InputText";
import axios from "axios";

interface Props {
  fieldName: string;
  value?: string;
  valueInput: string;
  name: string;
}

function EditLine({
  fieldName,
  value,
  valueInput,
  name,
  onChange,
}: Props & { onChange: (name: string, value: string) => void }) {
  const [showInput, setShowInput] = useState(false);

  const handleInput = (event: React.MouseEvent<HTMLButtonElement>) => {
    setShowInput(!showInput);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.name, e.target.value);
  };

  return (
    <div className="row list-group-item d-flex align-items-center">
      <div className="col-1 fw-bold">{fieldName}</div>
      <div className="col-3">{value}</div>
      <div className="col"></div>
      <div className="col-1">
        {!showInput && (
          <button className="btn btn-outline-primary" onClick={handleInput}>
            Edit
          </button>
        )}
      </div>
      {showInput && (
        <div className="row d-flex align-items-center">
          <div className="col d-flex align-items-center padding-td">
            <input
              type="text"
              className="form-control"
              id={fieldName}
              name={name}
              value={valueInput}
              onChange={handleChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default EditLine;
