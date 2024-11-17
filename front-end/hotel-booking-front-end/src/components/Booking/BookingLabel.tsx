import { Fragment } from "react/jsx-runtime";
import BookingFilterCard from "./BookingFilterCard";
import RoomList from "./RoomList";
import ButtonLink from "../common/ButtonLink";
import CommonLabel from "../common/CommonLabel";

const roomsListMock: Room[] = [
  {
    roomId: 1001,
    hotelName: "Grand Plaza Hotel",
    hotelAddress: "123 Main Street, Downtown, New York, NY 10001",
    hotelStars: 4,
    hotelReviewScore: 3.5,
    hotelReviewNumber: 150,
    hotelPrice: 299,
    bedNumber: 2,
    roomType: "Double Room",
    roomLeft: 5,
    photo: [
      "https://cf.bstatic.com/xdata/images/hotel/square240/34977484.webp?k=9f5132e9575512002b0d4de003143c77e7c827e0656f64b8edaa9de80a6b8a12&o=",
    ],
    services: ["Wi-Fi", "Room Service", "Mini Bar", "TV", "Air Conditioning"],
  },
  {
    roomId: 1002,
    hotelName: "Seaside Resort",
    hotelAddress: "789 Ocean Drive, Miami Beach, FL 33139",
    hotelStars: 5,
    hotelReviewScore: 9.2,
    hotelReviewNumber: 150,
    hotelPrice: 459,
    bedNumber: 3,
    roomType: "Triple Room",
    roomLeft: 10,
    photo: [
      "https://cf.bstatic.com/xdata/images/hotel/square240/34977484.webp?k=9f5132e9575512002b0d4de003143c77e7c827e0656f64b8edaa9de80a6b8a12&o=",
    ],
    services: [
      "Wi-Fi",
      "Room Service",
      "Pool Access",
      "Beach View",
      "Spa Access",
      "Mini Bar",
    ],
  },
  {
    roomId: 1003,
    hotelName: "City Comfort Inn",
    hotelAddress: "456 Business Ave, Chicago, IL 60601",
    hotelStars: 3,
    hotelReviewScore: 6.8,
    hotelReviewNumber: 150,
    hotelPrice: 159,
    bedNumber: 1,
    roomType: "Single Room",
    roomLeft: 20,
    photo: [
      "https://cf.bstatic.com/xdata/images/hotel/square240/34977484.webp?k=9f5132e9575512002b0d4de003143c77e7c827e0656f64b8edaa9de80a6b8a12&o=",
    ],
    services: ["Wi-Fi", "TV", "Air Conditioning", "Work Desk"],
  },
  {
    roomId: 1004,
    hotelName: "Mountain View Lodge",
    hotelAddress: "321 Pine Road, Denver, CO 80202",
    hotelStars: 4,
    hotelReviewScore: 8.5,
    hotelReviewNumber: 150,
    hotelPrice: 279,
    bedNumber: 2,
    roomType: "Double Room",
    roomLeft: 35,
    photo: [
      "https://cf.bstatic.com/xdata/images/hotel/square240/34977484.webp?k=9f5132e9575512002b0d4de003143c77e7c827e0656f64b8edaa9de80a6b8a12&o=",
    ],
    services: ["Wi-Fi", "Fireplace", "Mountain View", "Breakfast", "Parking"],
  },
  {
    roomId: 1005,
    hotelName: "The Luxury Tower",
    hotelAddress: "555 High Street, Los Angeles, CA 90001",
    hotelStars: 5,
    hotelReviewScore: 9.5,
    hotelReviewNumber: 150,
    hotelPrice: 599,
    bedNumber: 2,
    roomType: "Double Room",
    roomLeft: 45,
    photo: [
      "https://cf.bstatic.com/xdata/images/hotel/square240/34977484.webp?k=9f5132e9575512002b0d4de003143c77e7c827e0656f64b8edaa9de80a6b8a12&o=",
    ],
    services: [
      "Wi-Fi",
      "Room Service",
      "Spa Access",
      "Pool",
      "Restaurant",
      "Gym",
      "Valet Parking",
    ],
  },
  {
    roomId: 1006,
    hotelName: "Historic Downtown Hotel",
    hotelAddress: "890 Heritage St, Boston, MA 02108",
    hotelStars: 4,
    hotelReviewScore: 8.7,
    hotelReviewNumber: 150,
    hotelPrice: 329,
    bedNumber: 2,
    roomType: "Double Room",
    roomLeft: 55,
    photo: [
      ],
    services: ["Wi-Fi", "Room Service", "Historic Tours", "Restaurant", "Bar"],
  },
];

function BookingLabel() {
  return (
    <CommonLabel>
      <div className="row">
        <div className="col-3 padding-td">
          <BookingFilterCard
            city="Rome"
            from="2024-11-27"
            to="2024-12-05"
            adults="2"
            reserve={false}
          ></BookingFilterCard>
        </div>
        <div className="col-9">
          <RoomList rooms={roomsListMock}></RoomList>
        </div>
      </div>
      <div className="row padding-td">
        <div className="col-3"></div>
        <div className="col-9">
          <ButtonLink
            text="Load Other"
            className="btn btn-outline-dark rounded-pill"
          ></ButtonLink>
        </div>
      </div>
    </CommonLabel>
  );
}

export default BookingLabel;
