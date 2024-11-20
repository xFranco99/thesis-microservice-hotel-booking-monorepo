interface Props {
  values: string[];
  selectedOption?: string;
  placeholderOption?: string;
  className?: string;
  onChange?: (selectedOption: string) => void;
  style?: object
}

function Selector({
  values,
  selectedOption,
  placeholderOption = "-",
  className = "form-select",
  onChange,
  style
}: Props) {
  const options = values.map((val) =>
    selectedOption === val ? (
      <option selected value={val}>
        {val}
      </option>
    ) : (
      <option value={val}>{val}</option>
    )
  );

  return (
    <select
      className={className}
      aria-label="Default select example"
      onChange={(e) => {
        if (onChange) onChange(e.target.value);
      }}
      style={style}
    >
      <option selected>{placeholderOption}</option>
      {options}
    </select>
  );
}

export default Selector;
