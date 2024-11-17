import React, { Fragment, useState } from "react";
import InputText from "./InputText";

interface Props {
  fieldName: string;
  value?: string;
}

function EditLine({ fieldName, value }: Props) {
  const [showInput, setShowInput] = useState(false);

  const handleInput = (event: React.MouseEvent<HTMLButtonElement>) => {
    setShowInput(true);
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
            <InputText></InputText>
          </div>
          <div className="col-1">
            <button className="btn btn-outline-success" type="submit">
              Edit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditLine;
