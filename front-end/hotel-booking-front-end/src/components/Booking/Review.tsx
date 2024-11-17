import ReviewList from "../common/ReviewList";

function Review() {
  // Dummy data for the reviews
  const reviews: Review[] = [
    {
      user: "Marty",
      date: "31 luglio 2024",
      rating: 4,
      content:
        "Modifico di nuovo dopo aver ricevuto aiuto: Sono stati gentilissimi! Purtroppo non è stato possibile recuperare ciò che ho perso, ma hanno cercato comunque di aiutarmi a tornare al livello che avevo raggiunto. Le missioni devo comunque rifarle tutte e al momento mi manca la voglia, ma il gioco è bellissimo! Un consiglio: se scaricate il gioco, dopo il tutorial andate nelle impostazioni e collegate il vostro account di Google Play, inoltre, per sicurezza, salvate ogni volta che potete.",
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
