import ReviewList from "../common/ReviewList";

function Review() {
  // Dummy data for the reviews
  const reviews: Review[] = [
    {
      user: "Marty",
      date: "31 luglio 2024",
      rating: 4,
      content:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent euismod, quam in tempus suscipit, sapien lorem vehicula purus, non commodo lorem elit at risus. Sed malesuada lectus non nulla tincidunt, ut molestie neque ultrices. Proin auctor, nulla vel tempus elementum, urna tortor vestibulum metus, id fermentum ex sapien vel metus. Fusce vitae ligula vel velit sodales efficitur. Nullam posuere suscipit mi, id laoreet nunc varius non. Vestibulum ornare, odio at fermentum volutpat, eros odio vehicula augue, nec tincidunt orci augue et lorem. Sed dictum est id arcu fermentum tristique. Ut sed turpis non arcu blandit tempus. Proin varius justo non dictum scelerisque. Vivamus eleifend arcu ac gravida suscipit. Nunc ac lorem nec lacus interdum posuere sit amet quis odio. Aliquam efficitur viverra velit, id malesuada lorem ornare id.",
      helpfulCount: 4,
    },
  ];

  return (
    <div className="container my-5">
      <div className="row mb-4">
        <div className="col-lg-4 text-center">
          <h1 className="display-4 fw-bold">8.9</h1>
          <div className="text-success fs-4">Very Good</div>
          <p className="text-muted">150 reviews</p>
        </div>
        <div className="col-lg-8">
          <div className="mb-2">
            <span className="me-2">0.0</span>
            <span className="me-2">Staff</span>
            <div className="d-flex align-items-center">
              <div className="progress w-100" style={{ height: "8px" }}>
                <div
                  className="progress-bar bg-success"
                  style={{ width: "80%" }}
                ></div>
              </div>
            </div>
          </div>
          <div className="mb-2">
            <span className="me-2">0.0</span>
            <span className="me-2">Comfort</span>
            <div className="d-flex align-items-center">
              <div className="progress w-100" style={{ height: "8px" }}>
                <div
                  className="progress-bar bg-success"
                  style={{ width: "15%" }}
                ></div>
              </div>
            </div>
          </div>
          <div className="mb-2">
            <span className="me-2">0.0</span>
            <span className="me-2">Facilities</span>
            <div className="d-flex align-items-center">
              <div className="progress w-100" style={{ height: "8px" }}>
                <div
                  className="progress-bar bg-warning"
                  style={{ width: "3%" }}
                ></div>
              </div>
            </div>
          </div>
          <div className="mb-2">
            <span className="me-2">0.0</span>
            <span className="me-2">Cleanliness</span>
            <div className="d-flex align-items-center">
              <div className="progress w-100" style={{ height: "8px" }}>
                <div
                  className="progress-bar bg-warning"
                  style={{ width: "1%" }}
                ></div>
              </div>
            </div>
          </div>
          <div className="mb-2">
            <span className="me-2">0.0</span>
            <span className="me-2">Location</span>
            <div className="d-flex align-items-center">
              <div className="progress w-100" style={{ height: "8px" }}>
                <div
                  className="progress-bar bg-danger"
                  style={{ width: "1%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReviewList reviews={reviews}></ReviewList>
    </div>
  );
}

export default Review;
