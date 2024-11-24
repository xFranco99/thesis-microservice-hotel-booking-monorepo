import axios from "axios";
import { useState, useEffect, Fragment } from "react";
import HotelFormModal from "./HotelFormModal";

function HotelTable() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchCity, setSearchCity] = useState("");
  const [searchAddress, setSearchAddress] = useState("");
  const [searchName, setSearchName] = useState("");
  const [hotelList, setHotelList] = useState<HotelOut[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [trigger, setTrigger] = useState(false);

  async function handleDelete(hotelId: number) {
    console.log("deleting hotel with id: " + hotelId);
    try {
      const apiBaseUrl = import.meta.env.VITE_HOTEL_SERVICE_BASE_URL;
      const url = apiBaseUrl + "/api/v1/hotel/delete-hotel/" + hotelId;

      await axios.delete(url);

      alert("Deleted");
      setTrigger(!trigger);
    } catch (e) {
      console.log(e);
    }
  }

  const handleSearch = async () => {
    console.log(
      "Search triggered with:",
      searchCity,
      searchAddress,
      searchName
    );

    try {
      const apiBaseUrl = import.meta.env.VITE_HOTEL_SERVICE_BASE_URL;
      const url = apiBaseUrl + "/api/v1/hotel/search-by-name-city-address";

      const params: Record<string, string | number> = {};

      if (searchName?.trim()) {
        params.hotel_name = searchName.trim();
      }
      if (searchCity?.trim()) {
        params.hotel_city = searchCity.trim();
      }
      if (searchAddress?.trim()) {
        params.hotel_address = searchAddress.trim();
      }
      params.page = currentPage;

      const response = await axios.get(url, {
        params,
      });

      if (response.data) {
        const hotelOutList: HotelOutPaginated = response.data;
        setHotelList(hotelOutList.hotel_out);
        setTotalPages(hotelOutList.total_pages);
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
            placeholder="City"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            style={{
              padding: "5px",
              borderRadius: "4px",
              border: "1.5px solid black",
            }}
          />
          <input
            type="text"
            placeholder="Address"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            style={{
              padding: "5px",
              borderRadius: "4px",
              border: "1.5px solid black",
            }}
          />
          <input
            type="text"
            placeholder="Hotel Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
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
              <th scope="col">id</th>
              <th scope="col">hotel_name</th>
              <th scope="col">hotel_stars</th>
              <th scope="col">total_rooms</th>
              <th scope="col">hotel_city</th>
              <th scope="col">refundable</th>
              <th scope="col">
                <HotelFormModal onClose={(isClosed) => setTrigger(!trigger)} />
              </th>
            </tr>
          </thead>
          <tbody>
            {hotelList.map((hotelInfo) => (
              <tr key={hotelInfo.hotel_id}>
                <th scope="row">{hotelInfo.hotel_id}</th>
                <td>{hotelInfo.hotel_name}</td>
                <td>{hotelInfo.hotel_stars}</td>
                <td>{hotelInfo.total_rooms}</td>
                <td>{hotelInfo.hotel_city}</td>
                <td>{hotelInfo.refundable ? "Yes" : "No"}</td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <button className="btn btn-outline-primary rounded-pill">
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-danger rounded-pill"
                      onClick={() => handleDelete(hotelInfo.hotel_id)}
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

export default HotelTable;
