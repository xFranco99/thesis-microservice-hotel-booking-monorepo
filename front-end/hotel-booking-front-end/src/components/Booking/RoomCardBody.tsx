import { Link } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import Star from "../common/Star";
import { ReactNode } from "react";
import ButtonLink from "../common/ButtonLink";

function reviewTextScore(hotelReviewScore: number): string {
  if (hotelReviewScore < 6) {
    return "Bad";
  } else if (hotelReviewScore < 7.5) {
    return "Good";
  } else if (hotelReviewScore < 9.5) {
    return "Very Good";
  } else {
    return "Excellent";
  }
}

function reviewColorScore(hotelReviewScore: number): string {
  if (hotelReviewScore < 6) {
    return "bg-danger text-white px-2 py-1 rounded";
  } else if (hotelReviewScore < 7.5) {
    return "bg-success text-white px-2 py-1 rounded";
  } else if (hotelReviewScore < 9.5) {
    return "bg-primary text-white px-2 py-1 rounded";
  } else {
    return "bg-warning px-2 py-1 rounded";
  }
}

function drawStars(hotelStars: number): ReactNode[] {
  let result: ReactNode[] = [];

  for (let i = 0; i < hotelStars; i++) {
    result.push(<Star></Star>);
  }

  return result;
}

interface Props {
  data: RoomOutAndBookRoomOut;
}

function RoomCardBoody({ data }: Props) {
  const isReserved = data.booking != null;

  const booking = data.booking;
  const room = data.booking != null ? data.booking.room : data.room;
  const hotel = room?.hotel;
  const photos = room?.photos;
  const services = room?.room_services;

  const reviewScore = Math.floor(Math.random() * 10) + 1;

  const maspLink =
    "http://maps.google.com/?q=1200 Pennsylvania Ave SE, Washington, District of Columbia, 20003" +
    hotel?.hotel_address;

  const txtScore = reviewTextScore(reviewScore); //room.hotelReviewScore
  const colorScore = reviewColorScore(reviewScore); //room.hotelReviewScore
  const stars = drawStars(hotel?.hotel_stars ?? 0);

  /*const roomLeftAlert = room.roomLeft < 11 && (
    <div className="small text-danger mt-2 text-center text-md-start">
      Only {room.roomLeft} rooms left at this price on our site
    </div>
  );*/

  const reservedAlert = (
    <Fragment>
      <div className="small mt-2 text-center text-md-start fw-bold">
        Reserved
      </div>
      <div className="small mt-2 text-center text-md-start">
        {booking?.booked_from} / {booking?.booked_to}
      </div>
      <div className="small mt-2 text-center text-md-end">
        <ButtonLink
          className="mt-2"
          text="Print Reservation"
          to="/"
        ></ButtonLink>
      </div>
    </Fragment>
  );

  return (
    <Fragment>
      <div className="row mb-3">
        <div className="col">
          <div className="d-flex align-items-center gap-2">
            <h2 className="h5 text-primary mb-0">{hotel?.hotel_name}</h2>
          </div>
          <div className="d-flex align-items-center gap-2 padding-td">
            {stars}
          </div>
          <div className="d-flex align-items-center gap-2 small text-secondary">
            <span>Location</span>
            <Link
              className="btn btn-link btn-sm p-0 text-decoration-none"
              to={maspLink}
            >
              Open in Maps
            </Link>
          </div>
        </div>

        <div className="col-auto text-end">
          <div className="d-flex align-items-center gap-2">
            <div className="small">
              <div>{txtScore}</div>
              {/* review number */}
              <div>{reviewScore} reviews</div>
            </div>
            <div className={colorScore}>{reviewScore}</div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col mt-auto">
          <h3 className="h6 fw-bold mb-2 text-center text-md-start">
            {room?.room_type}
          </h3>
          <div className="small text-secondary text-center text-md-start">
            {room?.bed_number} Bed
          </div>
          <div className="small mt-2 text-center text-md-start">
            8 notti, 2 adulti
          </div>
          {/*!isReserved && roomLeftAlert*/}
        </div>
        <div className="col-auto text-end">
          {isReserved ? (
            reservedAlert
          ) : (
            <Fragment>
              <div className="text-secondary">
                Price per night children € {room?.price_per_night_children}
              </div>
              <div className="fs-4 fw-bold">
                Price per night adults € {room?.price_per_night_adults}
              </div>
              <div className="small text-secondary">
                You may have additional costs
              </div>
              <ButtonLink
                className="btn btn-outline-primary mt-2"
                text=" Details ›"
                to="/roomDetail"
              ></ButtonLink>
            </Fragment>
          )}
        </div>
      </div>
    </Fragment>
  );
}

export default RoomCardBoody;
