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

      <div className="list-group list-group-flush">
        <div className="row list-group-item d-flex align-items-center">
          <div className="col-1 fw-bold">Name</div>
          <div className="col-3">{details.name}</div>
          <div className="col"></div>
          <div className="col-1">
            <button
              className="btn btn-outline-primary"
              onClick={() => onEdit("name")}
            >
              Edit
            </button>
          </div>
        </div>

        <div className="row list-group-item d-flex align-items-center">
          <div className="col-1 fw-bold">Username</div>
          <div className="col-3">{details.username}</div>
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

        <div className="row list-group-item d-flex align-items-center">
          <div className="col-1 fw-bold">Email</div>
          <div className="col-4">{details.email}</div>
          <div className="col"></div>
          <div className="col-1">
            <button
              className="btn btn-outline-primary"
              onClick={() => onEdit("email")}
            >
              Edit
            </button>
          </div>
        </div>

        <div className="row list-group-item d-flex align-items-center">
          <div className="col-1 fw-bold">Phone Number</div>
          <div className="col-3">{details.phoneNumber}</div>
          <div className="col"></div>
          <div className="col-1">
            <button
              className="btn btn-outline-primary"
              onClick={() => onEdit("phoneNumber")}
            >
              Edit
            </button>
          </div>
        </div>

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
    </div>
  );
}

export default AccountManaging;
