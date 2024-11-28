import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Selector from "../../common/Selector";

interface Props {
  service?: ServiceOut;
  _isNew: boolean;
  onClose: (close: boolean) => void;
}

function ServiceEditAddModal({
  service = { service_id: 0 },
  _isNew = false,
  onClose,
}: Props) {
  const [serviceName, setServiceName] = useState(service.service_name || "");
  const [serviceIcon, setServiceIcon] = useState(service.service_icon || "");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [newService, setNewService] = useState<boolean>(_isNew);

  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setServiceName(service.service_name || "");
    setServiceIcon(service.service_icon || "");
    setOpenModal(false);
    onClose(true);
  };

  const handleSave = async () => {
    const apiBaseUrl = import.meta.env.VITE_HOTEL_SERVICE_BASE_URL;

    if (!serviceName || !serviceIcon) {
      alert("Please complete all fields before submit");
      return;
    }

    const url = `${apiBaseUrl}/api/v1/services/create-service`;

    const body = {
      services: [
        {
          service_name: serviceName,
          service_icon: serviceIcon,
        },
      ],
    };

    try {
      await axios.post(url, body);
    } catch (error) {
      alert("Seems there are an issue, please retry later");
    } finally {
      handleCloseModal();
    }
  };

  const handleUpdate = async () => {
    const apiBaseUrl = import.meta.env.VITE_HOTEL_SERVICE_BASE_URL;

    if (!service.service_id) {
      alert("Seems there are an issue with service_id, please retry later");
      handleCloseModal();
      return;
    }

    if (!serviceName || !serviceIcon) {
      alert("Please complete all fields before submit");
      return;
    }

    const url = `${apiBaseUrl}/api/v1/services/edit-service/${service.service_id}`;

    const body = {
      service_name: serviceName,
      service_icon: serviceIcon,
    };

    try {
      await axios.patch(url, body);
    } catch (error) {
      alert("Seems there are an issue, please retry later");
    } finally {
      handleCloseModal();
    }
  };

  return (
    <div>
      {_isNew ? (
        <button
          className="btn btn-outline-dark rounded-pill"
          onClick={handleOpen}
        >
          Add
        </button>
      ) : (
        <button
          className="btn btn-outline-primary rounded-pill"
          onClick={handleOpen}
        >
          Edit
        </button>
      )}

      {openModal && (
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
                  Service Details
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body text-center">
                <img
                  src={serviceIcon || import.meta.env.VITE_IMAGE_NOT_FOUND}
                  alt="Selected"
                  className="img-fluid"
                  style={{ maxWidth: "100%" }}
                />
                <div className="mt-3">
                  <h3>Service Name</h3>
                </div>
                <div className="mt-3">
                  <input
                    className="form-control"
                    value={serviceName || ""}
                    onChange={(e) => {
                      setServiceName(e.target.value);
                    }}
                  />
                </div>
                <div className="mt-3">
                  <h3>Service Icon</h3>
                </div>
                <div className="mt-3">
                  <input
                    className="form-control"
                    value={serviceIcon || ""}
                    onChange={(e) => {
                      setServiceIcon(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="modal-footer justify-content-between">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={_isNew ? handleSave : handleUpdate}
                >
                  {_isNew ? "Save" : "Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServiceEditAddModal;
