import { Link, useLocation } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import Star from "../common/Star";
import { ReactNode, useState } from "react";
import ButtonLink from "../common/ButtonLink";
import axios from "axios";

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

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const _city = searchParams.get("city") || "";
  const _startDate = searchParams.get("date_from")
    ? new Date(searchParams.get("date_from")!)
    : new Date();
  const _endDate = searchParams.get("date_to")
    ? new Date(searchParams.get("date_to")!)
    : new Date();

  const _childNumber = Number(searchParams.get("childNumber")) || 0;
  const _adultNumber = Number(searchParams.get("adultNumber")) || 0;

  function getDateDifferenceInDays(date1: Date, date2: Date): number {
    const diffInMillis = Math.abs(date2.getTime() - date1.getTime());

    const diffInDays = diffInMillis / (1000 * 3600 * 24);

    return diffInDays;
  }

  function calculateTotalPrice(adultPrice: number, childPrice: number): number {
    const priceAmountAdults = _adultNumber * adultPrice;
    const priceAmountChilds = _childNumber * childPrice;

    const totalNigth = getDateDifferenceInDays(_startDate, _endDate);

    return (priceAmountAdults + priceAmountChilds) * totalNigth;
  }

  const booking = data.booking;
  const room = data.booking != null ? data.booking.room : data.room;
  const hotel = room?.hotel;
  const photos = room?.photos;
  const services = room?.room_services;

  const idObject = isReserved ? booking?.booking_id : room?.room_number;

  const reviewScore = Math.floor(Math.random() * 10) + 1;

  const maspLink = "http://maps.google.com/?q=" + hotel?.hotel_address;

  const txtScore = reviewTextScore(reviewScore); //room.hotelReviewScore
  const colorScore = reviewColorScore(reviewScore); //room.hotelReviewScore
  const stars = drawStars(hotel?.hotel_stars ?? 0);

  let priceAdults = 0;
  let priceChilds = 0;

  if (room) {
    priceAdults += room.price_per_night_adults || 0;
    priceChilds += room.price_per_night_children || 0; // Example for children if you have it
  }

  const detailPath = `/roomDetail?isReserved=${isReserved}&id=${idObject}&city=${_city}&date_from=${encodeURIComponent(
    _startDate.toISOString().split("T")[0]
  )}&date_to=${encodeURIComponent(
    _endDate.toISOString().split("T")[0]
  )}&adultNumber=${_adultNumber}&childNumber=${_childNumber}`;

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
        <Link
          className="mt-2"
          to={
            "http://127.0.0.1:8082/api/v1/bookingget-booking-pdf-by-id/" +
            booking?.booking_id
          }
          target="_blank"
        >
          Print Reservation
        </Link>
      </div>
    </Fragment>
  );

  async function handleDelete() {
    try {
      const apiBaseUrl = import.meta.env.VITE_HOTEL_SERVICE_BASE_URL;
      const url = `${apiBaseUrl}/api/v1/booking/reservation-revoke?booking_id=${booking?.booking_id}`;
      await axios.delete(url);
      window.location.reload();
    } catch (e) {
      console.log(e);
    }
  }

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
              {!isReserved && (
                <Fragment>
                  <div>{txtScore}</div>
                  {/* review number */}
                  <div>{reviewScore} reviews</div>
                </Fragment>
              )}
            </div>
            {isReserved ? (
              <button className="btn btn-danger" onClick={handleDelete}>
                Cancel
              </button>
            ) : (
              <div className={colorScore}>{reviewScore}</div>
            )}
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
              {" "}
              <div className="text-secondary">
                € {room?.price_per_night_adults}/night e.p.
              </div>
              <div className="text-secondary">
                under 12: € {room?.price_per_night_children}/night e.p.
              </div>
              <div className="fs-4 fw-bold">
                Total: €{" "}
                {booking?.payment_amount ||
                  calculateTotalPrice(priceAdults, priceChilds)}
              </div>
              <div className="small text-secondary">
                You may have additional costs
              </div>
              <ButtonLink
                className="btn btn-outline-primary mt-2"
                text=" Details ›"
                to={detailPath}
                state={{ price: calculateTotalPrice(priceAdults, priceChilds) }}
              ></ButtonLink>
            </Fragment>
          )}
        </div>
      </div>
    </Fragment>
  );
}

export default RoomCardBoody;
