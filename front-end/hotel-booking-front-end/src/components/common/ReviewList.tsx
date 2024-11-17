import { Fragment } from "react/jsx-runtime";
import ButtonLink from "./ButtonLink";

interface Props {
  reviews: Review[];
  isPersonalArea?: boolean;
}

function ReviewList({ reviews, isPersonalArea = false }: Props) {
  const buttonInPersonalArea = isPersonalArea ? (
    <ButtonLink className="btn btn-outline-primary btn-sm me-2" text="">
      Edit
    </ButtonLink>
  ) : (
    <Fragment>
      <ButtonLink className="btn btn-outline-primary btn-sm me-2" text="">
        Yes
      </ButtonLink>
      <ButtonLink className="btn btn-outline-secondary btn-sm" text="">
        No
      </ButtonLink>
    </Fragment>
  );

  return (
    <div>
      {reviews.map((review, index) => (
        <div key={index} className="card mb-3">
          <div className="card-body">
            <div className="d-flex align-items-center mb-2">
              <div
                className="bg-secondary text-white rounded-circle d-flex justify-content-center align-items-center"
                style={{ width: "50px", height: "50px" }}
              >
                {review.user[0]}
              </div>
              <div className="ms-3">
                <h5 className="mb-0">{review.user}</h5>
                <small className="text-muted">{review.date}</small>
              </div>
            </div>

            <div className="text-success mb-2">
              <br></br>
            </div>

            <p>{review.content}</p>

            <div className="d-flex justify-content-between align-items-center">
              <span className="text-muted">
                {review.helpfulCount} person found this review helpful.
              </span>
              <div>{buttonInPersonalArea}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ReviewList;
