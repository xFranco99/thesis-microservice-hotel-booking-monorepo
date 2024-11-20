import { Fragment } from "react/jsx-runtime";
import BookingFilterCard from "./BookingFilterCard";
import RoomList from "./RoomList";
import ButtonLink from "../common/ButtonLink";
import CommonLabel from "../common/CommonLabel";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function BookingLabel() {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState<RoomOut[]>([]);

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

  const [startDate, setStartDate] = useState(_startDate);
  const [endDate, setEndDate] = useState(_endDate);
  const [childNumber, setChildNumber] = useState(_childNumber);
  const [adultNumber, setAdultNumber] = useState(_adultNumber);
  const [city, setCity] = useState<string>(_city);

  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const [pageRight, setPageRight] = useState(false)

  const fetchRooms = async () => {
    const isDateError = !startDate || !endDate || startDate > endDate;
    const isCityError = !city;
    const isGuestNumberError =
      (childNumber > 0 && adultNumber <= 0) ||
      (adultNumber <= 0 && childNumber <= 0);

    if (isDateError || isCityError || isGuestNumberError) {
      return;
    }

    const apiBaseUrl = import.meta.env.VITE_HOTEL_SERVICE_BASE_URL;

    const url = `${apiBaseUrl}/api/v1/room/search-room?city=${encodeURIComponent(
      city
    )}&date_from=${encodeURIComponent(
      startDate.toISOString().split("T")[0]
    )}&date_to=${encodeURIComponent(
      endDate.toISOString().split("T")[0]
    )}&total_guests=${encodeURIComponent(
      childNumber + adultNumber
    )}&page=${encodeURIComponent(page)}&page_size=${encodeURIComponent(pageSize)}`;

    const res = await axios.get(url);

    if (res.data) {
      setPageRight(res.data.length >= pageSize)
      setRooms(res.data);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const data_list: RoomOutAndBookRoomOut[] = rooms.map((room) => {
    return {
      room: room || null,
      booking: null,
    };
  });

  return (
    <CommonLabel>
      <div className="row">
        <div className="col-3 padding-td">
          <BookingFilterCard
            _city={_city}
            _from={startDate.toISOString().split("T")[0]}
            _to={endDate.toISOString().split("T")[0]}
            _adults={String(_childNumber)}
            _childrens={String(_adultNumber)}
          ></BookingFilterCard>
        </div>
        <div className="col-9">
          <RoomList data_list={data_list}></RoomList>
        </div>
      </div>
      <div className="row padding-td">
        <div className="col-3">
          <button
            className={
              page == 1
                ? "btn btn-outline-dark rounded-pill disabled"
                : "btn btn-outline-dark rounded-pill"
            }
            onClick={() => {
              setPage(page - 1);
              fetchRooms();
            }}
          >
            &lt; Previus Page
          </button>
        </div>
        <div className="col"></div>
        <div className="col-3">
          <button
            className={
              page == 1
                ? "btn btn-outline-dark rounded-pill disabled"
                : "btn btn-outline-dark rounded-pill"
            }
            onClick={() => {
              setPage(page + 1);
              fetchRooms();
            }}
          >
            Next Page &gt;
          </button>
        </div>
      </div>
    </CommonLabel>
  );
}

export default BookingLabel;
