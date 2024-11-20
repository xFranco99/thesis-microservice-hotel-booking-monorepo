import { Link, useLocation } from "react-router-dom";
import Carousel from "../common/Carousel";
import Review from "./Review";
import { ReactNode } from "react";
import Star from "../common/Star";
import BookingFilterCard from "./BookingFilterCard";
import CardWithImage from "../common/CardWithImage";
import Datepicker from "../common/Datepicker";
import SearchFromList from "../common/SearchFromList";

/*const roomMock: Room = {
  roomId: 1001,
  hotelName: "Grand Plaza Hotel",
  hotelAddress: "123 Main Street, Downtown, New York, NY 10001",
  hotelStars: 4,
  hotelReviewScore: 8.9,
  hotelReviewNumber: 150,
  hotelPrice: 299,
  bedNumber: 2,
  roomType: "Double Room",
  roomLeft: 5,
  photo: [
    "https://cf.bstatic.com/xdata/images/hotel/square240/34977484.webp?k=9f5132e9575512002b0d4de003143c77e7c827e0656f64b8edaa9de80a6b8a12&o=",
  ],
  services: ["Wi-Fi", "Room Service", "Mini Bar", "TV", "Air Conditioning"],
  description:
    "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?",
};*/

function drawStars(hotelStars: number): ReactNode[] {
  let result: ReactNode[] = [];

  for (let i = 0; i < hotelStars; i++) {
    result.push(<Star></Star>);
  }

  return result;
}

function RoomDetail() {

  const location = useLocation();
  const data = location.state?._data as RoomOutAndBookRoomOut 

  const booking = data.booking;
  const room = data.booking != null ? data.booking.room : data.room;
  const hotel = room?.hotel;
  const photos = room?.photos;
  const services = room?.room_services;

  const reviewScore = Math.floor(Math.random() * 10) + 1;

  const stars = drawStars(reviewScore);
  const maspLink =
    "http://maps.google.com/?q=1200 Pennsylvania Ave SE, Washington, District of Columbia, 20003" +
    hotel?.hotel_address;

  const cardTitle = "€ " + room?.price_per_night_adults + " per night";

  return (
    <div className="container card-detail-padding">
      <div className="card" style={{ border: "1.5px solid black" }}>
        <div className="row">
          <div className="col-3 ">
            <div className="container d-flex justify-content-center align-items-center mt-4">
              <BookingFilterCard
                title={cardTitle}
                city="Rome"
                from="2024-11-27"
                to='2024-12-05'
                adults="2"
                reserve={true}
              ></BookingFilterCard>
            </div>
          </div>
          <div className="col-9">
            <Carousel></Carousel>
          </div>
        </div>
        <div className="card-body">
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
          </div>
          <div className="row">
            <h2 className="h5 mb-0">Description</h2>
            <div className="col" style={{ paddingTop: "8px" }}>
              {room?.description}
            </div>
          </div>
          <Review></Review>
        </div>
      </div>
    </div>
  );
}

export default RoomDetail;
