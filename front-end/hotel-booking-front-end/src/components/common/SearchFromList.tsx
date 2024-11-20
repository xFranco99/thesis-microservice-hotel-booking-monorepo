import axios from "axios";
import { Fragment, useState } from "react";

interface Props {
  id?: string;
  placeholder?: string;
  value?: string;
  maxResults?: number;
  className?: string;
  style?: object;
  onChange?: (searchValue: string) => void;
}

function SearchFromList({
  id,
  placeholder,
  value = "",
  maxResults = 3,
  className = "form-control",
  onChange,
  style
}: Props) {
  const [inputValue, setInputValue] = useState(value);
  const [filteredRecords, setFilteredRecords] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleFilter = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.trim().toLowerCase();
    if (onChange) onChange(searchTerm);
    setInputValue(event.target.value);

    const apiBaseUrl = import.meta.env.VITE_HOTEL_SERVICE_BASE_URL;
    const url =
      apiBaseUrl + "/api/v1/hotel/available-city?city_name=" + searchTerm;
    const filtered = await axios.get(url);

    /*const filtered =
      list?.filter((item) => item.toLowerCase().includes(searchTerm)) || [];*/

    setFilteredRecords(filtered.data); //filtered.slice(0, maxResults)
    setShowResults(searchTerm.length > 0 && filtered.data.length > 0);
  };

  const handleSelect = (item: string) => {
    setInputValue(item);
    if (onChange) onChange(item);
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
        style={style}
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
