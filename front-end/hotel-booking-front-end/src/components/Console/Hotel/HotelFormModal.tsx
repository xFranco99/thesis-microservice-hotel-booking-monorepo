import axios from "axios";
import React, { useEffect, useState } from "react";

interface Props {
  onClose: (close: boolean) => void;
  editMode?: boolean;
  initialData?: HotelUpdate;
  hotel_id?: number;
}

function HotelFormModal({
  onClose,
  editMode = false,
  initialData,
  hotel_id,
}: Props) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<HotelUpdate>({
    hotel_name: "",
    hotel_address: "",
    hotel_stars: 0,
    total_rooms: 0,
    hotel_city: "",
    refundable: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? target.checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const apiBaseUrl = import.meta.env.VITE_HOTEL_SERVICE_BASE_URL;
      const url = !editMode
        ? `${apiBaseUrl}/api/v1/hotel/create-hotel`
        : `${apiBaseUrl}/api/v1/hotel/edit-hotel/${hotel_id}`;

      const response = editMode
        ? await axios.patch(url, formData)
        : await axios.post(url, formData);

      if (response) {
        alert("Hotel created successfully!");
        setShowModal(false);
        setFormData({
          hotel_name: "",
          hotel_address: "",
          hotel_stars: 0,
          total_rooms: 0,
          hotel_city: "",
          refundable: true,
        });
        onClose(true);
      } else {
        alert("Failed to create hotel.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred.");
    }
  };

  useEffect(() => {
    if (editMode && initialData) {
      setFormData(initialData);
    }
  }, []);

  const openButtonClass = editMode
    ? "btn btn-outline-primary rounded-pill"
    : "btn btn-outline-success rounded-pill";

  return (
    <div>
      <button
        onClick={() => {
          setShowModal(true);
          onClose(false);
        }}
        className={openButtonClass}
      >
        {editMode ? "Edit" : "Add New"}
      </button>

      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editMode ? "Edit Hotel" : "Create Hotel"}
                </h5>
                <button
                  onClick={() => {
                    setShowModal(false);
                    onClose(true);
                  }}
                  className="btn-close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="hotel_name" className="form-label">
                      Hotel Name
                    </label>
                    <input
                      type="text"
                      id="hotel_name"
                      name="hotel_name"
                      className="form-control"
                      value={formData.hotel_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="hotel_address" className="form-label">
                      Hotel Address
                    </label>
                    <input
                      type="text"
                      id="hotel_address"
                      name="hotel_address"
                      className="form-control"
                      value={formData.hotel_address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="hotel_stars" className="form-label">
                      Hotel Stars
                    </label>
                    <input
                      type="number"
                      id="hotel_stars"
                      name="hotel_stars"
                      className="form-control"
                      value={formData.hotel_stars}
                      onChange={handleChange}
                      min={0}
                      max={5}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="total_rooms" className="form-label">
                      Total Rooms
                    </label>
                    <input
                      type="number"
                      id="total_rooms"
                      name="total_rooms"
                      className="form-control"
                      value={formData.total_rooms}
                      onChange={handleChange}
                      min={1}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="hotel_city" className="form-label">
                      Hotel City
                    </label>
                    <input
                      type="text"
                      id="hotel_city"
                      name="hotel_city"
                      className="form-control"
                      value={formData.hotel_city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      id="refundable"
                      name="refundable"
                      className="form-check-input"
                      checked={formData.refundable}
                      onChange={handleChange}
                    />
                    <label htmlFor="refundable" className="form-check-label">
                      Refundable
                    </label>
                  </div>
                  <button type="submit" className="btn btn-success">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HotelFormModal;
