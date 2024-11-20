import { ChangeEvent } from "react";

interface Props {
  id: string;
  name: string;
  value?: string;
  style?: object;
  className?: string;
  onChange?: (_date: Date) => void;
}

function Datepicker({
  id,
  name,
  value,
  style,
  className = "form-control",
  onChange,
}: Props) {
  return (
    <input
      className={className}
      type="date"
      id={id}
      name={name}
      defaultValue={value}
      style={style}
      onChange={(event) => {
        if (onChange) {
          const dateValue = event.target.value
            ? new Date(event.target.value)
            : null;
          if (dateValue) onChange(dateValue);
        }
      }}
    />
  );
}

export default Datepicker;
