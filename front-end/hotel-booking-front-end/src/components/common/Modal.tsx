import { useState } from "react";
import Datepicker from "./Datepicker";
import Selector from "./Selector";
import ButtonLink from "./ButtonLink";
import InputText from "./InputText";
import SearchFromList from "./SearchFromList";

function Modal() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const nums: Array<string> = ["1", "2", "3"];

  return (
    <form>
      <div className="card" style={{ backgroundColor: "rgba(33, 37, 41, .7)" }}>
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col">
              <p className="text-white">City</p>
              {/*<InputText className="form-control"/>*/}
              <SearchFromList
                list={[
                  "Roma",
                  "Rimini",
                  "Ravenna",
                  "Genova",
                  "Catanzaro",
                  "Ginevra",
                  "Torino",
                ]}
              ></SearchFromList>
            </div>
            <div className="col">
              <p className="text-white">Check-in Date</p>
              <Datepicker id="dateFrom" name="dateFrom"></Datepicker>
            </div>
            <div className="col">
              <p className="text-white">Check-out Date</p>
              <Datepicker id="dateTo" name="dateTo"></Datepicker>
            </div>
            <div className="col">
              <p className="text-white">Children</p>
              <Selector values={["1", "2", "3", "4"]} />
            </div>
            <div className="col">
              <p className="text-white">Adults</p>
              <Selector values={["1", "2", "3", "4"]} />
            </div>
            <div className="col text-center">
              <ButtonLink
                text="Search"
                className="btn btn-outline-light rounded-pill"
                id="searchForRooms"
                to="/bookingLabel"
              ></ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default Modal;
