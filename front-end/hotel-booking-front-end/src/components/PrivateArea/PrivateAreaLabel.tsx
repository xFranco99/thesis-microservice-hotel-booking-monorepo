import RoomList from "../Booking/RoomList";
import AccountManaging from "../common/AccountManaging";
import CommonLabel from "../common/CommonLabel";
import ReviewList from "../common/ReviewList";
import { Routes, Route } from "react-router-dom";
import PrivateAreaMenu from "./PrivateAreaMenu";

const personalDetails: PersonalDetails = {
  name: "John Doe",
  username: "John",
  email: "johndoe@example.com",
  phoneNumber: "+1234567890",
  dateOfBirth: "1990-01-01",
  nationality: "USA",
  gender: "Male",
  address: "123 Main St, Anytown, CA 12345",
  passportDetails: "Passport Number: ABC123456, Expiry: 2025-12-31",
};

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

const roomsListMock: Room[] = [
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
];

function PrivateAreaLabel() {
  const handleEdit = (field: keyof PersonalDetails) => {
    console.log(`Editing ${field}`);
    // Implement your edit logic here
  };

  return (
    <CommonLabel style={{ backgroundColor: "#FFFFFF" }}>
      <div className="row padding-td">
        <PrivateAreaMenu></PrivateAreaMenu>
        <div className="col col-8">
        <Routes>
            <Route
              path="accountManaging"
              element={<AccountManaging details={personalDetails} onEdit={handleEdit} />}
            />
            <Route
              path="roomList"
              element={<RoomList rooms={roomsListMock} />}
            />
            <Route
              path="reviewList"
              element={<ReviewList reviews={reviews} isPersonalArea={true} />}
            />
          </Routes>
        </div>
      </div>
    </CommonLabel>
  );
}

export default PrivateAreaLabel;
