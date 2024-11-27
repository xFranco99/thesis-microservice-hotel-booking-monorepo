import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Selector from "../../common/Selector";

interface Props {
  service?: ServiceOut;
  _isNew: boolean;
  onClose: (close: boolean) => void;
}

function DetailServiceModal({
  service = { service_id: 0 },
  _isNew = false,
  onClose,
}: Props) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const roomId = searchParams.get("room_id");
  const firstServiceId = service?.service_id;

  const [serviceNames, setServiceNames] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceOut>(service);
  const [serviceList, setServiceList] = useState<ServiceOut[]>([service]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [newService, setNewService] = useState<boolean>(_isNew);

  useEffect(() => {
    const fetchServices = async () => {
      const apiBaseUrl = import.meta.env.VITE_HOTEL_SERVICE_BASE_URL;
      const url = `${apiBaseUrl}/api/v1/services/get-all-services`;

      try {
        const result = await axios.get(url);

        if (result.data) {
          setServiceList(result.data);

          let names: string[] = [];
          for (const service of serviceList) {
            names.push(service?.service_name || "");
          }
          setServiceNames(names);
        }
      } catch (error) {
        alert("Seems there are an issue, please retry later");
      }
    };

    fetchServices();
  }, [openModal]);

  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedService(service);
    setOpenModal(false);
    onClose(true);
  };

  const handleChange = (nameSelected: string) => {
    for (const service of serviceList) {
      if (nameSelected === service?.service_name) {
        setSelectedService(service);
      }
    }
  };

  const handleDelete = async (selectedServiceId: number) => {
    console.log("delete");
    const apiBaseUrl = import.meta.env.VITE_HOTEL_SERVICE_BASE_URL;
    const url = `${apiBaseUrl}/api/v1/services/remove-service-from-room/${roomId}/${selectedServiceId}`;

    try {
      await axios.delete(url);
    } catch (error) {
      alert("Seems there are an issue, please retry later");
    }
  };

  const handleSave = async () => {
    const apiBaseUrl = import.meta.env.VITE_HOTEL_SERVICE_BASE_URL;
    const url = `${apiBaseUrl}/api/v1/services/associate-room-to-service`;

    let body: AssociateRoomWithServices;
    if (Number(roomId)) {
      console.log(Number(roomId));
      body = {
        room_id: Number(roomId),
        services: [selectedService.service_id],
      };
    } else {
      alert("Sorry but there is an error with roomId retrieve, try later");
      handleCloseModal();
      return;
    }

    try {
      const response: AssociateRoomWithServicesOut = (
        await axios.post(url, body)
      ).data;

      console.log(response.not_associated_services.length);
      if (response.not_associated_services.length !== 0) {
        alert(
          "An error occurred. \nRemember, can't associate one service twice"
        );
        return;
      }
      !newService && handleDelete(firstServiceId);
    } catch (error) {
      alert("Seems there are an issue, please retry later");
    } finally {
      handleCloseModal();
    }
  };

  return (
    <div>
      <div
        className="d-flex gap-4"
        onClick={handleOpen}
        style={{ cursor: "pointer" }}
      >
        {_isNew ? (
          <li
            key={service?.service_id}
            className="d-flex align-items-center gap-2"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/4601/4601618.png"
              alt="Add new Service"
              style={{ width: "24px", height: "24px" }}
            />
            Add New Service
          </li>
        ) : (
          <li
            key={service?.service_id}
            className="d-flex align-items-center gap-2"
          >
            <img
              src={service?.service_icon || ""}
              alt={service?.service_name || ""}
              style={{ width: "24px", height: "24px" }}
            />
            {service?.service_name}
          </li>
        )}
      </div>

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
                  src={
                    selectedService.service_icon ||
                    import.meta.env.VITE_IMAGE_NOT_FOUND
                  }
                  alt="Selected"
                  className="img-fluid"
                  style={{ maxWidth: "100%" }}
                />
                <div className="mt-3">
                  <h3>{selectedService.service_name}</h3>
                </div>
                <div className="mt-3">
                  <Selector
                    selectedOption={selectedService.service_name || "-"}
                    values={serviceNames}
                    onChange={(nameSelected) => {
                      handleChange(nameSelected);
                    }}
                  />
                </div>
              </div>
              <div className="modal-footer justify-content-between">
                {!_isNew && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      handleDelete(selectedService.service_id);
                      handleCloseModal();
                    }}
                  >
                    Delete
                  </button>
                )}
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

export default DetailServiceModal;
