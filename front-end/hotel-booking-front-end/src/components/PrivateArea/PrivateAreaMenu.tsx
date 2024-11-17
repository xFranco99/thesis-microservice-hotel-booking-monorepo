import { Fragment } from "react/jsx-runtime";
import ButtonLink from "../common/ButtonLink";

function PrivateAreaMenu() {
  return (
    <Fragment>
      <div className="col col-4>">
        <div className="list-group" style={{ minHeight: "80vh" }}>
          <br></br>
          <ButtonLink
            className="btn btn-outline-dark btn-delete-border"
            text=""
            to="accountManaging"
          >
            <h2 className="h5 mb-0">Account</h2>
          </ButtonLink>
          <br></br>
          <ButtonLink
            className="btn btn-outline-dark btn-delete-border"
            text=""
            to="roomList"
          >
            <h2 className="h5 mb-0">Reservation</h2>
          </ButtonLink>
          <br></br>
          <ButtonLink
            className="btn btn-outline-dark btn-delete-border"
            text=""
            to="reviewList"
          >
            <h2 className="h5 mb-0">My Reviews</h2>
          </ButtonLink>
        </div>
      </div>
    </Fragment>
  );
}

export default PrivateAreaMenu;
