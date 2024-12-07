import { useLocation, useNavigate } from "react-router-dom";
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
  onSearch: (search: boolean) => void;
}

function BookingFilterCard({
  title = "Cerca",
  _city = "",
  _from = "",
  _to = "",
  _adults = "0",
  _childrens = "0",
  onSearch,
}: Props) {
  const navigate = useNavigate();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const reserve = searchParams.get("isReserved") === "true";

  const [startDate, setStartDate] = useState<Date>(new Date(_from));
  const [endDate, setEndDate] = useState<Date>(new Date(_to));
  const [adultNumber, setAdultNumber] = useState(Number(_adults));
  const [childNumber, setChildNumber] = useState(Number(_childrens));
  const [city, setCity] = useState<string>(_city);

  const [errorDate, setErrorDate] = useState(false);
  const [errorGuestNumber, setErrorGuestNumber] = useState(false);
  const [errorCity, setErrorCity] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // validate inputs
    const isDateError = !startDate || !endDate || startDate >= endDate;
    const isCityError = !city;
    const isGuestNumberError =
      isNaN(adultNumber) ||
      (childNumber > 0 && adultNumber <= 0) ||
      (adultNumber <= 0 && childNumber <= 0);

    // update the error states
    setErrorDate(isDateError);
    setErrorCity(isCityError);
    setErrorGuestNumber(isGuestNumberError);

    // prevent navigation
    if (isDateError || isCityError || isGuestNumberError) {
      return;
    }

    const apiBaseUrl = import.meta.env.VITE_HOTEL_SERVICE_BASE_URL;

    const _dateFrom = startDate
      ? startDate.toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];
    const _dateTo = endDate
      ? endDate.toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

    navigate(
      `/bookingLabel?city=${city}&date_from=${encodeURIComponent(
        _dateFrom
      )}&date_to=${encodeURIComponent(
        _dateTo
      )}&adultNumber=${adultNumber}&childNumber=${childNumber}`
    );
    onSearch(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="card input-outline-dark">
        <div className="card-body">
          <div className="row">
            <h4>{title}</h4>
          </div>
          <fieldset>
            <div className="position-relative row padding-td padding-lr">
              <label>City</label>
              <SearchFromList
                value={city}
                className="form-select input-outline-dark"
                onChange={(city) => {
                  setErrorCity(false);
                  setCity(city);
                }}
              ></SearchFromList>
            </div>
            <div className="row padding-td padding-lr">
              <label>Check-in</label>
              <Datepicker
                id="dateFrom"
                name="dateFrom"
                value={startDate.toISOString().split("T")[0]}
                className={errorDate ? "form-control input-outline-dark is-invalid" : "form-control input-outline-dark"} 
                onChange={(dateFrom) => {
                  setErrorDate(false);
                  setStartDate(dateFrom);
                }}
              ></Datepicker>
            </div>
            <div className="row padding-td padding-lr">
              <label>Check-out</label>
              <Datepicker
                id="dateFrom"
                name="dateFrom"
                value={endDate.toISOString().split("T")[0]}
                className={errorDate ? "form-control input-outline-dark is-invalid" : "form-control input-outline-dark"} 
                onChange={(dateTo) => {
                  setErrorDate(false);
                  setEndDate(dateTo);
                }}
              ></Datepicker>
            </div>
            <div className="row padding-td padding-lr">
              <label>Adults</label>
              <Selector
                values={["1", "2", "3", "4"]}
                selectedOption={String(adultNumber)}
                className={errorGuestNumber ? "form-select input-outline-dark is-invalid" : "form-select input-outline-dark"} 
                onChange={(adults) => {
                  const numberValue = adults ? Number(adults) : 0;
                  setErrorGuestNumber(false);
                  setAdultNumber(numberValue);
                }}
              />
            </div>
            <div className="row padding-td padding-lr">
              <label>Children</label>
              <Selector
                values={["1", "2", "3", "4"]}
                selectedOption={String(childNumber)}
                className={errorGuestNumber ? "form-select input-outline-dark is-invalid" : "form-select input-outline-dark"} 
                onChange={(children) => {
                  const numberValue = children ? Number(children) : 0;
                  setErrorGuestNumber(false);
                  setChildNumber(numberValue);
                }}
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
              <button
                className="btn btn-outline-dark rounded-pill"
                type="submit"
              >
                Search &gt;
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

export default BookingFilterCard;
