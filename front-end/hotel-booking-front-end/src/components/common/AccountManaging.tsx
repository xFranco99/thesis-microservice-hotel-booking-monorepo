import EditLine from "./EditLine";
import InputText from "./InputText";

interface PersonalDetailsFormProps {
  details: PersonalDetails;
  onEdit: (field: keyof PersonalDetails) => void;
}

function AccountManaging({ details, onEdit }: PersonalDetailsFormProps) {
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Personal details</h2>
      </div>

      <form>
        <div className="list-group list-group-flush">
          <EditLine fieldName="First name" value={details.firstName}></EditLine>
          <EditLine
            fieldName="second Name"
            value={details.secondName}
          ></EditLine>
          <EditLine fieldName="username" value={details.username}></EditLine>
          <EditLine fieldName="email" value={details.email}></EditLine>
          <EditLine
            fieldName="phone Number"
            value={details.phoneNumber}
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
  );
}

export default AccountManaging;
