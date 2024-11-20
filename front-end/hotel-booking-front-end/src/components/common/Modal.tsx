import { useState } from "react";
import Datepicker from "./Datepicker";
import Selector from "./Selector";
import ButtonLink from "./ButtonLink";
import InputText from "./InputText";
import SearchFromList from "./SearchFromList";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Modal() {
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [adultNumber, setAdultNumber] = useState(0);
  const [childNumber, setChildNumber] = useState(0);
  const [city, setCity] = useState<string>();

  const [errorDate, setErrorDate] = useState(false);
  const [errorGuestNumber, setErrorGuestNumber] = useState(false);
  const [errorCity, setErrorCity] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // validate inputs
    const isDateError = !startDate || !endDate || startDate >= endDate;
    const isCityError = !city;
    const isGuestNumberError =
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

    /*const url = `${apiBaseUrl}/api/v1/room/search-room?city=${city}&date_from=${encodeURIComponent(
      _dateFrom
    )}&date_to=${encodeURIComponent(_dateTo)}&total_guests=${guestNumber}`;*/

    navigate(
      `/bookingLabel?city=${city}&date_from=${encodeURIComponent(
        _dateFrom
      )}&date_to=${encodeURIComponent(
        _dateTo
      )}&adultNumber=${adultNumber}&childNumber=${childNumber}`
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="card" style={{ backgroundColor: "rgba(33, 37, 41, .7)" }}>
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col">
              <p className="text-white">City</p>
              <SearchFromList
                onChange={(city) => {
                  setErrorCity(false);
                  setCity(city);
                }}
                style={errorCity ? { border: "4px solid red" } : {}}
              />
            </div>
            <div className="col">
              <p className="text-white">Check-in Date</p>
              <Datepicker
                id="dateFrom"
                name="dateFrom"
                onChange={(dateFrom) => {
                  setErrorDate(false);
                  setStartDate(dateFrom);
                }}
                style={errorDate ? { border: "4px solid red" } : {}}
              />
            </div>
            <div className="col">
              <p className="text-white">Check-out Date</p>
              <Datepicker
                style={errorDate ? { border: "4px solid red" } : {}}
                id="dateTo"
                name="dateTo"
                onChange={(dateTo) => {
                  setErrorDate(false);
                  setEndDate(dateTo);
                }}
              />
            </div>
            <div className="col">
              <p className="text-white">Children</p>
              <Selector
                values={["1", "2", "3", "4"]}
                style={errorGuestNumber ? { border: "4px solid red" } : {}}
                onChange={(children) => {
                  const numberValue = children ? Number(children) : 0;
                  setErrorGuestNumber(false);
                  setChildNumber(numberValue);
                }}
              />
            </div>
            <div className="col">
              <p className="text-white">Adults</p>
              <Selector
                values={["1", "2", "3", "4"]}
                style={errorGuestNumber ? { border: "4px solid red" } : {}}
                onChange={(adults) => {
                  const numberValue = adults ? Number(adults) : 0;
                  setErrorGuestNumber(false);
                  setAdultNumber(numberValue);
                }}
              />
            </div>
            <div className="col text-center">
              <button
                className="btn btn-outline-light rounded-pill"
                id="searchForRooms"
                type="submit"
                //to="/bookingLabel"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default Modal;
