import { Link, useLocation } from "react-router-dom";
import Carousel from "../common/Carousel";
import Review from "./Review";
import { Fragment, ReactNode, useEffect, useState } from "react";
import Star from "../common/Star";
import BookingFilterCard from "./BookingFilterCard";
import CardWithImage from "../common/CardWithImage";
import Datepicker from "../common/Datepicker";
import SearchFromList from "../common/SearchFromList";
import axios from "axios";
import { set } from "react-datepicker/dist/date_utils";
import RoomServices from "./RoomServices";
import { useAuth } from "../../state/AuthProvider";
import PaymentModal from "../common/PaymentModal";

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
  const { user, auth, isAuth } = useAuth();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const _price = location.state.price || "";

  const _isReserved = searchParams.get("isReserved") === "true" || false;
  const _id = searchParams.get("id") || "";

  const _startDate = searchParams.get("date_from")
    ? new Date(searchParams.get("date_from")!)
    : new Date();
  const _endDate = searchParams.get("date_to")
    ? new Date(searchParams.get("date_to")!)
    : new Date();
  const _childNumber = Number(searchParams.get("childNumber")) || 0;
  const _adultNumber = Number(searchParams.get("adultNumber")) || 0;

  const [startDate, setStartDate] = useState(_startDate);
  const [endDate, setEndDate] = useState(_endDate);
  const [childNumber, setChildNumber] = useState(_childNumber);
  const [adultNumber, setAdultNumber] = useState(_adultNumber);
  const [price, setPrice] = useState(_price);

  const [_room, setRoomOut] = useState<RoomOut>();
  const [_booking, setBookingOut] = useState<BookingRoomOut>();
  const [isLoading, setIsLoading] = useState(true);

  const [openModal, setOpenModal] = useState<boolean>(false);

  const [isSuccess, setIsSuccess] = useState(false);

  const handleModalSubmit = (cardDetails: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  }) => {
    console.log(cardDetails);
    try {
      isAuth(); // check session ended
      setOpenModal(false);
    } catch {
    } finally {
      handleBooking(cardDetails.cardNumber);
    }
  };

  const fetchData = async () => {
    const apiBaseUrl = import.meta.env.VITE_HOTEL_SERVICE_BASE_URL;

    const url = _isReserved
      ? `${apiBaseUrl}/api/v1/bookingget-booking-by-id/${_id}`
      : `${apiBaseUrl}/api/v1/room/get-room-by-room-number/${_id}`;

    try {
      const res = await axios.get(url);

      if (_isReserved) {
        setBookingOut(res.data);
        setPrice(
          booking?.payment_amount ? String(booking?.payment_amount) : "0"
        );
      } else {
        setRoomOut(res.data);
        setPrice(_price);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [_id, _isReserved]);

  const data = {
    room: _room || null,
    booking: _booking || null,
  };

  const booking = data.booking;
  const room = data.booking != null ? data.booking.room : data.room;
  const hotel = room?.hotel;
  const photos = room?.photos;
  const services = room?.room_services;

  const stars = drawStars(hotel?.hotel_stars || 1);
  const maspLink = "http://maps.google.com/?q=" + hotel?.hotel_address;

  const cardTitle = String("Total: € " + price);

  if (isLoading) {
    return (
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "200px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  function OpenModal() {
    console.log("open modal");
    isAuth(); // avoid session expired
    auth ? setOpenModal(true) : alert("You have to sign-in first");
  }

  async function handleBooking(cardNumberFromModal: string) {
    if (!auth) {
      alert("You have to sign-in first");
    }

    const data = {
      room_number: _id,
      user_id: user?.id_user,
      hotel_id: room?.hotel_id,
      booked_from: startDate,
      booked_to: endDate,
      adult_no: adultNumber,
      children_no: childNumber,
      credit_card_no: cardNumberFromModal,
      date_payment: new Date(),
      date_refound: null,
      cancelled: false,
    };

    try {
      const apiBaseUrl = import.meta.env.VITE_HOTEL_SERVICE_BASE_URL;
      const url = apiBaseUrl + "/api/v1/booking/book-an-hotel";
      const response = await axios.post(url, data);

      setIsSuccess(true);
      setOpenModal(true);
      searchParams.set("isReserved", "false")
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Fragment>
      <PaymentModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleModalSubmit}
        isSuccess={isSuccess}
      ></PaymentModal>
      <div className="container card-detail-padding">
        <div className="card" style={{ border: "1.5px solid black" }}>
          <div className="row mb-3 align-items-center">
            <div className="col ">
              <div className="container d-flex justify-content-center align-items-center mt-4">
                <BookingFilterCard
                  title={cardTitle}
                  _city={hotel?.hotel_city || ""}
                  _from={
                    booking?.booked_from ??
                    startDate.toISOString().split("T")[0]
                  }
                  _to={
                    booking?.booked_to ?? endDate.toISOString().split("T")[0]
                  }
                  _adults={String(adultNumber)}
                  _childrens={String(childNumber)}
                ></BookingFilterCard>
              </div>
            </div>
            <div className="col-auto">
              <Carousel images={photos}></Carousel>
            </div>
          </div>
          <div className="card-body">
            <div className="row mb-3 align-items-center">
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
              <div className="col-auto">
                {!_isReserved && (
                  <button
                    className={
                      isSuccess
                        ? "btn btn-outline-dark rounded-pill disabled"
                        : "btn btn-outline-dark rounded-pill"
                    }
                    onClick={OpenModal}
                  >
                    Book Now
                  </button>
                )}
              </div>
            </div>
            <div className="row">
              <h2 className="h5 mb-0">Description</h2>
              <div className="col" style={{ paddingTop: "8px" }}>
                {room?.description}
              </div>
            </div>
            <br></br>
            <div className="row">
              <h2 className="h5 mb-0">Services</h2>
              <div className="col" style={{ paddingTop: "8px" }}>
                {services && <RoomServices services={services} />}
              </div>
            </div>
            <Review></Review>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default RoomDetail;
