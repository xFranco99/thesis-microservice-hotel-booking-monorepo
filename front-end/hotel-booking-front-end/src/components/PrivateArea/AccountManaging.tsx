import { Fragment } from "react/jsx-runtime";
import { useAuth } from "../../state/AuthProvider";
import EditLine from "../common/EditLine";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AccountManaging() {
  const { user, isAuth } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<User>({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
  });
  const handleChange = (name: string, value: string) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwtToken");

      const apiBaseUrl = import.meta.env.VITE_AUTH_SERVICE_BASE_URL;
      const url = apiBaseUrl + "/api/v1/auth/edit-user";

      const response = await axios.patch(url, formData, {
        headers: {
          Authorization: `${token}`, // Aggiunta del token nell'header
        },
      });
      isAuth();
      navigate('/privateArea')
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Fragment>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Personal details</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="list-group list-group-flush">
            <EditLine
              fieldName="First name"
              value={user?.first_name}
              name="first_name"
              valueInput={formData.first_name}
              onChange={handleChange}
            ></EditLine>
            <EditLine
              fieldName="Last Name"
              value={user?.last_name}
              name="last_name"
              valueInput={formData.last_name}
              onChange={handleChange}
            ></EditLine>
            <EditLine
              fieldName="username"
              value={user?.username}
              name="username"
              valueInput={formData.username}
              onChange={handleChange}
            ></EditLine>
            <EditLine
              fieldName="email"
              value={user?.email}
              name="email"
              valueInput={formData.email}
              onChange={handleChange}
            ></EditLine>
            <EditLine
              fieldName="phone Number"
              value={user?.phone_number}
              name="phone_number"
              valueInput={formData.phone_number}
              onChange={handleChange}
            ></EditLine>
            <div className="row list-group-item">
              <button className="btn btn-outline-success" type="submit">
                Submit Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </Fragment>
  );
}

export default AccountManaging;
