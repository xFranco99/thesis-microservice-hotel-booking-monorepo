import RoomList from "../Booking/RoomList";
import AccountManaging from "./AccountManaging";
import CommonLabel from "../common/CommonLabel";
import ReviewList from "../common/ReviewList";
import { Routes, Route, useNavigate } from "react-router-dom";
import PrivateAreaMenu from "./PrivateAreaMenu";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../state/AuthProvider";
import OtpVerifyCode from "../LogIn/OtpVerifyCode";
import ChatBot from "./ChatBot";
import axios from "axios";
import { useEffect, useState } from "react";

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

/*const roomsListMock: Room[] = [
  {
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
    reservedFrom: "2024-11-27",
    reservedTo: "2024-12-05",
  },
];*/

function PrivateAreaLabel() {
  const { auth, user } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<BookingRoomOut[]>([]);
  const [loading, setLoading] = useState(true);

  if(!auth){
    navigate("/")
  }

  useEffect(() => {
    async function fetchBookingList() {
      if (!auth || !user) {
        setLoading(false); // Ensure loading ends even if auth fails
        return;
      }

      try {
        const apiBaseUrl = import.meta.env.VITE_HOTEL_SERVICE_BASE_URL;
        const url =
          apiBaseUrl +
          "/api/v1/booking/get-active-user-booking/" +
          user?.id_user;
        const response = await axios.get(url);

        if (response.data) {
          setBookings(response.data);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }

    fetchBookingList();
  }, [auth, user]);

  if (loading) {
    return <div>Loading...</div>;
  }
  
  /*if (!auth) {
    return <Navigate to="/logIn" />;
  }*/

  const data_list: RoomOutAndBookRoomOut[] = bookings.map((booking) => {
    return {
      room: null,
      booking: booking || null,
    };
  });

  return (
    <CommonLabel style={{ backgroundColor: "#FFFFFF" }}>
      <div className="row padding-td">
        <PrivateAreaMenu></PrivateAreaMenu>
        <div className="col col-8">
          <Routes>
            <Route path="accountManaging" element={<AccountManaging />} />
            {
              <Route
                path="roomListBooking"
                element={<RoomList data_list={data_list} />}
              />
            }
            <Route
              path="reviewList"
              element={<ReviewList reviews={reviews} isPersonalArea={true} />}
            />
            <Route
              path="resetPasswordFromAccount"
              element={
                <OtpVerifyCode isForgotPassword={true} fromAccount={true} />
              }
            />
            <Route path="chatBot" element={<ChatBot />} />
          </Routes>
        </div>
      </div>
    </CommonLabel>
  );
}

export default PrivateAreaLabel;
