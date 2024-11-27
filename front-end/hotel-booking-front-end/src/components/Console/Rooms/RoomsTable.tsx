import axios from "axios";
import { useState, useEffect, Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import AddRoomModal from "./AddRoomModal";

function RoomsTable() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const hotelId = searchParams.get("hotel_id");

  const [isLoading, setIsLoading] = useState(false);
  const [searchRoomNumber, setSearchRoomNumber] = useState("");
  const [roomList, setRoomList] = useState<RoomOutFromHotel[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [trigger, setTrigger] = useState(false);

  async function handleDelete(roomId: number) {
    console.log("deleting hotel with id: " + roomId);
    try {
      const apiBaseUrl = import.meta.env.VITE_HOTEL_SERVICE_BASE_URL;
      const url = apiBaseUrl + "/api/v1/room/delete-room/" + roomId;

      await axios.delete(url);

      alert("Deleted");
      setTrigger(!trigger);
    } catch (e) {
      console.log(e);
    }
  }

  const handleSearch = async () => {
    try {
      const apiBaseUrl = import.meta.env.VITE_HOTEL_SERVICE_BASE_URL;
      let url = `${apiBaseUrl}/api/v1/room/find-by-room-number/${hotelId}?page=${currentPage}`;

      if (searchRoomNumber?.trim()) {
        url += `&room_no=${searchRoomNumber.trim()}`;
      }

      const response = await axios.get(url);

      if (response.data) {
        const roomOutFromHotelList: RoomOutFromHotelPaginated = response.data;
        setRoomList(roomOutFromHotelList.rooms);
        setTotalPages(roomOutFromHotelList.total_pages);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

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

  useEffect(() => {
    handleSearch();
  }, [currentPage, trigger]);

  return (
    <Fragment>
      <div
        style={{
          maxHeight: "70vh",
          overflow: "auto",
          border: "1px solid black",
          borderRadius: "7px",
          boxShadow: "5px 10px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
            padding: "10px",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
          <input
            type="text"
            placeholder="Room number"
            value={searchRoomNumber}
            onChange={(e) => setSearchRoomNumber(e.target.value)}
            style={{
              padding: "5px",
              borderRadius: "4px",
              border: "1.5px solid black",
            }}
          />
          <button
            onClick={handleSearch}
            className="btn btn-outline-dark rounded-pill"
          >
            Search
          </button>
        </div>
        <table
          className="table table-group-divider"
          style={{
            width: "100%", // Full width of parent
            height: "100%", // Full height of parent
            margin: 0,
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th scope="col">room_id</th>
              <th scope="col">room_number</th>
              <th scope="col">hotel_id</th>
              <th scope="col">bed_number</th>
              <th scope="col">room_type</th>
              <th scope="col">price_per_night_adults</th>
              <th scope="col">price_per_night_children</th>
              <th scope="col">description</th>
              <th scope="col">
                <AddRoomModal
                  onClose={() => {
                    setTrigger(!trigger);
                  }}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {roomList.map((room) => (
              <tr key={room.room_id}>
                <th scope="row">{room.room_id}</th>
                <td>{room.room_number}</td>
                <td>{room.hotel_id}</td>
                <td>{room.bed_number}</td>
                <td>{room.room_type}</td>
                <td>€ {room.price_per_night_adults}</td>
                <td>€ {room.price_per_night_children}</td>
                <td>{room.description}</td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <Link
                      to={`detail?room_id=${room.room_id}`}
                      className="btn btn-outline-dark rounded-pill"
                    >
                      Room Detail
                    </Link>
                    <button
                      className="btn btn-outline-danger rounded-pill"
                      onClick={() => handleDelete(room.room_id || 0)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            <tr>
              <th scope="row"></th>
              <td>
                <button
                  className="btn btn-outline-dark rounded-pill"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                >
                  &lt; Previous Page
                </button>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <button
                  className="btn btn-outline-dark rounded-pill"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next Page &gt;
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Fragment>
  );
}

export default RoomsTable;
