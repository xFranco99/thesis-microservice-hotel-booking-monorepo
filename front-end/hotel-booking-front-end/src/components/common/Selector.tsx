interface Props {
  values: string[];
  selectedOption?: string;
  placeholderOption?: string;
  className?: string;
}

function Selector({
  values,
  selectedOption,
  placeholderOption = "-",
  className = "form-select",
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
    <select className={className} aria-label="Default select example">
      <option selected>{placeholderOption}</option>
      {options}
    </select>
  );
}

export default Selector;
