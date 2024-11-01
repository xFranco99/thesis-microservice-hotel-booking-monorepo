function Footer() {
  return (
    <footer
      className="d-flex flex-wrap justify-content-between align-items-center bg-dark"
      style={{ height: "15vh" }}
    >
      <div className="container text-white">
        <footer
          className="d-flex flex-wrap justify-content-between align-items-center py-3 bg-dark"
          style={{ height: "15vh" }}
        >
          <div
            className="col-md-4 d-flex align-items-center"
            style={{ paddingLeft: "20px" }}
          >
            <a
              href="/"
              className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1"
            ></a>
            <span className="mb-3 mb-md-0 text-muted">© 2024 Company, Inc</span>
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
        </footer>
      </div>
    </footer>
  );
}

export default Footer;
