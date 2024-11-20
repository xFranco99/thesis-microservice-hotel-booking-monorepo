import { useLocation } from "react-router-dom";
import ButtonLink from "../common/ButtonLink";
import Datepicker from "../common/Datepicker";
import SearchFromList from "../common/SearchFromList";
import Selector from "../common/Selector";
import "../common/common.css";
import { useState } from "react";

interface Props {
  title?: string;
  _city?: string;
  _from?: string;
  _to?: string;
  _adults?: string;
  _childrens?: string;
}

function BookingFilterCard({
  title = "Cerca",
  _city = "",
  _from = "",
  _to = "",
  _adults = "0",
  _childrens = "0",
}: Props) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const reserve = searchParams.get("isReserved") === "true";

  const [startDate, setStartDate] = useState<Date>(new Date(_from));
  const [endDate, setEndDate] = useState<Date>(new Date(_to));
  const [adultNumber, setAdultNumber] = useState(Number(_adults));
  const [childNumber, setChildNumber] = useState(Number(_childrens));
  const [city, setCity] = useState<string>(_city);

  const handleSearchButton = () => {

  }

  return (
    <form onSubmit={handleSearchButton}>
      <div className="card input-outline-dark">
        <div className="card-body">
          <div className="row">
            <h4>{title}</h4>
          </div>
          <fieldset>
            <div className="position-relative row padding-td padding-lr">
              <SearchFromList
                value={city}
                className="form-select input-outline-dark"
              ></SearchFromList>
            </div>
            <div className="row padding-td padding-lr">
              <Datepicker
                id="dateFrom"
                name="dateFrom"
                value={startDate.toISOString().split("T")[0]}
                className="form-control input-outline-dark"
              ></Datepicker>
            </div>
            <div className="row padding-td padding-lr">
              <Datepicker
                id="dateFrom"
                name="dateFrom"
                value={endDate.toISOString().split("T")[0]}
                className="form-control input-outline-dark"
              ></Datepicker>
            </div>
            <div className="row padding-td padding-lr">
              <Selector
                values={["1", "2", "3", "4"]}
                selectedOption={String(adultNumber)}
                className="form-select input-outline-dark"
              />
            </div>
            <div className="row padding-td padding-lr">
              <Selector
                values={["1", "2", "3", "4"]}
                selectedOption={String(childNumber)}
                className="form-select input-outline-dark"
              />
            </div>
          </fieldset>
          <div className="row padding-td padding-lr">
            {reserve ? (
              <ButtonLink
                text="Reserved"
                className="btn btn-outline-dark rounded-pill"
              ></ButtonLink>
            ) : (
              <ButtonLink
                className="btn btn-outline-dark rounded-pill"
                text="Search >"
              ></ButtonLink>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

export default BookingFilterCard;
