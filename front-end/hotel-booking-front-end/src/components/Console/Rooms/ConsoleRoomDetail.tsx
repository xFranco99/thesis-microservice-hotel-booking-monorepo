import axios from "axios";
import { useState, useEffect, Fragment } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ImageModal from "./ImageModal";
import DetailServiceModal from "./DetailServiceModal";

function ConsoleRoomDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const roomId = searchParams.get("room_id");

  const [isLoading, setIsLoading] = useState(false);
  const [room, setRoom] = useState<RoomOut>({} as RoomOut);
  const [photos, setPhotos] = useState<PhotoBaseOut[]>([]);
  const [services, setServices] = useState<ServiceOut[]>([]);
  const [trigger, setTrigger] = useState(false);

  const fetchRoom = async () => {
    try {
      const apiBaseUrl = import.meta.env.VITE_HOTEL_SERVICE_BASE_URL;
      let url = `${apiBaseUrl}/api/v1/room/get-room-by-room-number/${roomId}`;

      const response = await axios.get(url);

      if (response.data) {
        const room: RoomOut = response.data;
        setRoom(room);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPhotos = async () => {
    try {
      const apiBaseUrl = import.meta.env.VITE_HOTEL_SERVICE_BASE_URL;
      let url = `${apiBaseUrl}/api/v1/photos/get-photos-associated-to-room?room_id=${roomId}`;

      const response = await axios.get(url);

      if (response.data) {
        const photos: PhotoBaseOut[] = response.data;
        setPhotos(photos);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const apiBaseUrl = import.meta.env.VITE_HOTEL_SERVICE_BASE_URL;
      let url = `${apiBaseUrl}/api/v1/services/get-all-services-from-room/${roomId}`;

      const response = await axios.get(url);

      if (response.data) {
        const services: ServiceOut[] = response.data;
        setServices(services);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRoom((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = async () => {
    const body: RoomPatch = {
      bed_number: room.bed_number === 0 ? null : room.bed_number,
      room_type: room.room_type,
      price_per_night_adults: room.price_per_night_adults,
      price_per_night_children: room.price_per_night_children,
      description: room.description,
    };

    const apiBaseUrl = import.meta.env.VITE_HOTEL_SERVICE_BASE_URL;
    let url = `${apiBaseUrl}/api/v1/room/edit-room/${roomId}`;

    try {
      const result = await axios.patch(url, body);

      navigate("/console/rooms?hotel_id=" + room.hotel_id);
    } catch (error) {
      alert("Seems there are an issue, please retry later");
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
    fetchRoom();
    fetchPhotos();
    fetchServices();
    console.log(photos);
  }, [trigger]);

  if (!room) {
    return (
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "200px" }}
      >
        <p>No room details available.</p>
      </div>
    );
  }

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
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
          <h1>Room Detail</h1>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            style={{
              width: "2rem",
              height: "2rem", 
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "1.50rem",
            }}
            onClick={() => {
              navigate("/console/rooms?hotel_id=" + room.hotel_id);
            }}
          ></button>
        </div>
        <table
          className="table table-bordered table-striped"
          style={{ marginBottom: "0px" }}
        >
          <tbody>
            <tr>
              <th>Hotel ID</th>
              <td className="d-flex justify-content-between align-items-center">
                {room.hotel_id || ""}
              </td>
            </tr>
            <tr>
              <th>Room ID</th>
              <td className="d-flex justify-content-between align-items-center">
                {room.room_id || ""}
              </td>
            </tr>
            <tr>
              <th>Room Number</th>
              <td>
                <input
                  type="text"
                  className="form-control"
                  placeholder="New image URL"
                  name="room_number"
                  value={room.room_number || ""}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                />
              </td>
            </tr>
            <tr>
              <th>Bed Number</th>
              <td>
                <input
                  type="text"
                  className="form-control"
                  placeholder="New image URL"
                  name="bed_number"
                  value={room.bed_number || ""}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                />
              </td>
            </tr>
            <tr>
              <th>Room Type</th>
              <td>
                <input
                  type="text"
                  className="form-control"
                  placeholder="New image URL"
                  name="room_type"
                  value={room.room_type || ""}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                />
              </td>
            </tr>
            <tr>
              <th>Price Per Night (Adults)</th>
              <td>
                <input
                  type="text"
                  className="form-control"
                  placeholder="New image URL"
                  name="price_per_night_adults"
                  value={room.price_per_night_adults || ""}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                />
              </td>
            </tr>
            <tr>
              <th>Price Per Night (Children)</th>
              <td>
                <input
                  type="text"
                  className="form-control"
                  placeholder="New image URL"
                  name="price_per_night_children"
                  value={room.price_per_night_children || ""}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                />
              </td>
            </tr>
            <tr>
              <th>Description</th>
              <td>
                <input
                  type="text"
                  className="form-control"
                  placeholder="New image URL"
                  name="description"
                  value={room.description || ""}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                />
              </td>
            </tr>
            <tr>
              <th></th>
              <td>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => {
                    handleSave();
                  }}
                >
                  Save
                </button>
              </td>
            </tr>
            <tr>
              <th>Photos</th>
              <td>
                <div className="d-flex flex-wrap gap-2">
                  {photos.map((photo) => (
                    <ImageModal
                      _isNew={false}
                      photo={photo}
                      onClose={() => setTrigger(!trigger)}
                    ></ImageModal>
                  ))}
                  <ImageModal
                    _isNew={true}
                    onClose={() => setTrigger(!trigger)}
                  ></ImageModal>
                </div>
              </td>
            </tr>
            <tr>
              <th>Services</th>
              <td>
                <ul className="list-unstyled">
                  {services.map((service, index) => (
                    <DetailServiceModal
                      _isNew={false}
                      service={service}
                      onClose={() => {
                        setTrigger(!trigger);
                      }}
                    />
                  ))}
                  <DetailServiceModal
                    _isNew={true}
                    onClose={() => {
                      setTrigger(!trigger);
                    }}
                  />
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Fragment>
  );
}

export default ConsoleRoomDetail;
