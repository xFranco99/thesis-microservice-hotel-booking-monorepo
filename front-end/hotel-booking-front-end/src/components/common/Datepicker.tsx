interface Props {
  id: string;
  name: string;
  value?: string;
  style?: object;
  className?: string;
}

function Datepicker({
  id,
  name,
  value,
  style,
  className = "form-control",
}: Props) {
  return (
    <input
      className={className}
      type="date"
      id={id}
      name={name}
      defaultValue={value}
      style={style}
    />
  );
}

export default Datepicker;
