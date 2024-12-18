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
import SignUpForm from "../LogIn/SignUpForm";

const reviews: Review[] = [
  {
    user: "Marty",
    date: "31 luglio 2024",
    rating: 4,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent euismod, quam in tempus suscipit, sapien lorem vehicula purus, non commodo lorem elit at risus. Sed malesuada lectus non nulla tincidunt, ut molestie neque ultrices. Proin auctor, nulla vel tempus elementum, urna tortor vestibulum metus, id fermentum ex sapien vel metus. Fusce vitae ligula vel velit sodales efficitur. Nullam posuere suscipit mi, id laoreet nunc varius non. Vestibulum ornare, odio at fermentum volutpat, eros odio vehicula augue, nec tincidunt orci augue et lorem. Sed dictum est id arcu fermentum tristique. Ut sed turpis non arcu blandit tempus. Proin varius justo non dictum scelerisque. Vivamus eleifend arcu ac gravida suscipit. Nunc ac lorem nec lacus interdum posuere sit amet quis odio. Aliquam efficitur viverra velit, id malesuada lorem ornare id.",
    helpfulCount: 4,
  },
];

function PrivateAreaLabel() {
  const { auth, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<BookingRoomOut[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      navigate("/");
    }

    console.log(bookings);

    async function fetchBookingList() {
      if (!user || isAdmin) {
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
  }, []);

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
            <Route
              path="roomListBooking"
              element={<RoomList data_list={data_list} />}
            />
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
            <Route
              path="newAdmin"
              element={<SignUpForm _isNewAdmin={true} />}
            />
          </Routes>
        </div>
      </div>
    </CommonLabel>
  );
}

export default PrivateAreaLabel;
