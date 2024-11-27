import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios, { AxiosError } from "axios";
import { useLocation } from "react-router-dom";

interface Props {
  onClose: () => void;
}

function AddRoomModal({ onClose }: Props) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const hotelId = searchParams.get("hotel_id");

  const [opened, setOpened] = useState<boolean>(false);
  const [newRoom, setNewRoom] = useState<RoomCreate>({} as RoomCreate);

  const handleOpenModal = () => {
    setOpened(true);
  };

  const handleCloseModal = () => {
    setNewRoom({} as RoomCreate);
    onClose();
    setOpened(false);
  };

  const handleSave = async () => {
    const apiBaseUrl = import.meta.env.VITE_HOTEL_SERVICE_BASE_URL;
    const url = `${apiBaseUrl}/api/v1/room/create-room`;

    if (!hotelId) {
      alert(hotelId + "this hotel id is not valid");
      setOpened(false);
      return;
    }

    const body: RoomCreate = {
      room_id: null,
      room_number: newRoom.room_number,
      hotel_id: Number(hotelId),
      bed_number: newRoom.bed_number,
      room_type: newRoom.room_type,
      price_per_night_adults: newRoom.price_per_night_adults,
      price_per_night_children: newRoom.price_per_night_children,
      description: newRoom.description,
    };

    if (body.bed_number) {
      console.log("ok");
    }

    try {
      await axios.post(url, body);
      handleCloseModal();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const e = error as AxiosError;
        const errorDetail =
          error.response?.data?.detail || "An unknown error occurred.";
        alert(errorDetail);
      } else {
        alert("Seems there are an issue, please retry later");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewRoom((prevData) => ({ ...prevData, [name]: value }));
  };

  const renderInputField = (
    label: string,
    name: keyof RoomCreate,
    type = "number"
  ) => (
    <div className="modal-body text-center">
      <label>{label}</label>
      <div className="mt-3">
        <input
          type={type}
          className="form-control"
          value={newRoom[name] || ""}
          name={name}
          onChange={handleChange}
        />
      </div>
    </div>
  );

  return (
    <div>
      <div className="d-flex gap-2">
        <button
          className="btn btn-outline-dark rounded-pill"
          onClick={handleOpenModal}
        >
          Add Room
        </button>
      </div>

      {opened && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="imageModalLabel"
          aria-hidden="true"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="imageModalLabel">
                  Add Room Details
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleCloseModal}
                ></button>
              </div>

              {renderInputField("Room Number", "room_number")}
              {renderInputField("Bed Number", "bed_number")}
              {renderInputField("Room Type", "room_type", "text")}
              {renderInputField(
                "Price per Night (Adults)",
                "price_per_night_adults"
              )}
              {renderInputField(
                "Price per Night (Children)",
                "price_per_night_children"
              )}
              {renderInputField("Description", "description", "text")}

              <div className="modal-footer justify-content-between">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddRoomModal;
