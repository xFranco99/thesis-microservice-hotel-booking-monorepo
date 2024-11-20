import ButtonLink from "../common/ButtonLink";
import Datepicker from "../common/Datepicker";
import SearchFromList from "../common/SearchFromList";
import Selector from "../common/Selector";
import "../common/common.css";

interface Props {
  title?: string;
  city?: string;
  from?: string;
  to?: string;
  adults?: string;
  childrens?: string;
  reserve?: boolean;
}

function BookingFilterCard({
  title = "Cerca",
  city = "",
  from = "",
  to = "",
  adults = "0",
  childrens = "0",
  reserve = false,
}: Props) {
  return (
    <form>
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
                value={from}
                className="form-control input-outline-dark"
              ></Datepicker>
            </div>
            <div className="row padding-td padding-lr">
              <Datepicker
                id="dateFrom"
                name="dateFrom"
                value={to}
                className="form-control input-outline-dark"
              ></Datepicker>
            </div>
            <div className="row padding-td padding-lr">
              <Selector
                values={["1", "2", "3", "4"]}
                selectedOption={adults}
                className="form-select input-outline-dark"
              />
            </div>
            <div className="row padding-td padding-lr">
              <Selector
                values={["1", "2", "3", "4"]}
                selectedOption={childrens}
                className="form-select input-outline-dark"
              />
            </div>
          </fieldset>
          <div className="row padding-td padding-lr">
            {reserve ? (
              <ButtonLink
                text="Reserve >"
                className="btn btn-outline-dark rounded-pill"
              ></ButtonLink>
            ) : (
              <ButtonLink
                className="btn btn-outline-dark rounded-pill"
                text="Search"
              ></ButtonLink>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

export default BookingFilterCard;
