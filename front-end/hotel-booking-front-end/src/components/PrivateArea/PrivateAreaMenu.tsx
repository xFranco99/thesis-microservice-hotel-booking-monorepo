import { Fragment } from "react/jsx-runtime";
import ButtonLink from "../common/ButtonLink";
import { useAuth } from "../../state/AuthProvider";
import { useNavigate } from "react-router-dom";

function PrivateAreaMenu() {
  const { logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = () => {
    logout();
    navigate("/");
  };

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
            to="resetPasswordFromAccount"
          >
            <h2 className="h5 mb-0">Reset Password</h2>
          </ButtonLink>

          {isAdmin && (
            <Fragment>
              <br></br>
              <ButtonLink
                className="btn btn-outline-dark btn-delete-border"
                text=""
                to=""
              >
                <h2 className="h5 mb-0">Create New Console Account</h2>
              </ButtonLink>
            </Fragment>
          )}

          {!isAdmin && (
            <Fragment>
              <br></br>
              <ButtonLink
                className="btn btn-outline-dark btn-delete-border"
                text=""
                to="roomListBooking"
              >
                <h2 className="h5 mb-0">Reservation</h2>
              </ButtonLink>
            </Fragment>
          )}

          {!isAdmin && (
            <Fragment>
              <br></br>
              <ButtonLink
                className="btn btn-outline-dark btn-delete-border"
                text=""
                to="reviewList"
              >
                <h2 className="h5 mb-0">My Reviews</h2>
              </ButtonLink>
            </Fragment>
          )}
          <br></br>
          <button
            className="btn btn-outline-dark btn-delete-border"
            onClick={handleLogOut}
          >
            <h2 className="h5 mb-0">Log Out</h2>
          </button>
          {!isAdmin && (
            <Fragment>
              <br></br>
              <ButtonLink
                className="btn btn-outline-dark btn-delete-border"
                text=""
                to="chatBot"
              >
                <h2 className="h5 mb-0">AI FAQ Assistant Bot</h2>
              </ButtonLink>
            </Fragment>
          )}
        </div>
      </div>
    </Fragment>
  );
}

export default PrivateAreaMenu;
