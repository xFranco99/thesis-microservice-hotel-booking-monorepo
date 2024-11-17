import { Fragment } from "react/jsx-runtime";
import { useAuth } from "../../state/AuthProvider";
import EditLine from "../common/EditLine";

interface PersonalDetailsFormProps {
  details: PersonalDetails;
  onEdit: (field: keyof PersonalDetails) => void;
}

function AccountManaging({ details, onEdit }: PersonalDetailsFormProps) {
  const { auth, user } = useAuth();

  return (
    <Fragment>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Personal details</h2>
        </div>

        <form>
          <div className="list-group list-group-flush">
            <EditLine
              fieldName="First name"
              value={user?.first_name}
            ></EditLine>
            <EditLine
              fieldName="Last Name"
              value={user?.last_name}
            ></EditLine>
            <EditLine fieldName="username" value={user?.username}></EditLine>
            <EditLine fieldName="email" value={user?.email}></EditLine>
            <EditLine
              fieldName="phone Number"
              value={user?.phone_number}
            ></EditLine>

            <div className="row list-group-item d-flex align-items-center">
              <div className="col-1 fw-bold">Password</div>
              <div className="col-3">******</div>
              <div className="col"></div>
              <div className="col-1">
                <button
                  className="btn btn-outline-primary"
                  onClick={() => onEdit("username")}
                >
                  Edit
                </button>
              </div>
            </div>
            <div className="row list-group-item">
              <button
                className="btn btn-outline-danger"
                onClick={() => onEdit("username")}
              >
                Delete Account
              </button>
            </div>
          </div>
        </form>
      </div>
    </Fragment>
  );
}

export default AccountManaging;
