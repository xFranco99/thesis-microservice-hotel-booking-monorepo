import { Fragment } from "react/jsx-runtime";

function UserContent() {
  return (
    <Fragment>
      <div
        className="col-md-4 d-flex align-items-center"
        style={{ paddingLeft: "20px" }}
      >
        <div>
          <h5>Contact Us</h5>
          <p className="mb-1">Phone: (555) 123-4567</p>
          <p className="mb-3">Email: contact@company.com</p>
          <div className="d-flex gap-3 ">
            <a href="#" className="text-white text-decoration-none">
              <i className="fab fa-facebook-f"></i> Facebook
            </a>
            <a href="#" className="text-white text-decoration-none">
              <i className="fab fa-twitter"></i> Twitter
            </a>
            <a href="#" className="text-white text-decoration-none">
              <i className="fab fa-linkedin"></i> LinkedIn
            </a>
          </div>
          <div className="mt-3">
            <span className="text-white">© 2024 Company, Inc</span>
          </div>
        </div>
      </div>

      <div
        className="col-md-5 offset-md-1 mb-3"
        style={{ display: "contents" }}
      >
        <form style={{ paddingRight: "20px" }}>
          <h5>Subscribe to our newsletter</h5>
          <p>Monthly digest of what's new and exciting from us.</p>
          <div className="d-flex flex-column flex-sm-row w-100 gap-2">
            <input
              id="newsletter1"
              type="text"
              className="form-control"
              placeholder="Email address"
            />
            <button className="btn btn-outline-light" type="button">
              Subscribe
            </button>
          </div>
        </form>
      </div>
    </Fragment>
  );
}

export default UserContent;
