import { Fragment, useState } from "react";

interface Props {
  list?: string[];
  id?: string;
  placeholder?: string;
  value?: string;
  maxResults?: number;
  className?: string;
}

function SearchFromList({
  list,
  id,
  placeholder,
  value = "",
  maxResults = 3,
  className = "form-control",
}: Props) {
  const [inputValue, setInputValue] = useState(value);
  const [filteredRecords, setFilteredRecords] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    setInputValue(event.target.value);

    const filtered =
      list?.filter((item) => item.toLowerCase().includes(searchTerm)) || [];

    setFilteredRecords(filtered.slice(0, maxResults));
    setShowResults(searchTerm.length > 0 && filtered.length > 0);
  };

  const handleSelect = (item: string) => {
    setInputValue(item);
    setShowResults(false);
  };

  return (
    <Fragment>
      <input
        type="text"
        className={className}
        id={id}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleFilter}
      />
      {showResults && (
        <ul
          className="list-group position-absolute w-100"
          style={{ top: "100%", marginTop: "0.25rem", zIndex: 1050 }}
        >
          {filteredRecords.map((el, index) => (
            <li
              key={index}
              className="list-group-item"
              style={{ cursor: "pointer" }}
              onClick={() => handleSelect(el)}
            >
              {el}
            </li>
          ))}
        </ul>
      )}
    </Fragment>
  );
}

export default SearchFromList;
