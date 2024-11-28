import axios from "axios";
import { useEffect, useState } from "react";
import ServiceEditAddModal from "./ServiceEditAddModal";

function ServiceTable() {
  const [services, setServices] = useState<ServiceOut[]>([]);
  const [searchService, setSearchService] = useState("");
  const [trigger, setTrigger] = useState(false);

  async function fetchServices() {
    const apiBaseUrl = import.meta.env.VITE_HOTEL_SERVICE_BASE_URL;
    const url = apiBaseUrl + "/api/v1/services/get-all-services";

    try {
      const response = await axios.get(url);
      if (response.data) {
        console.log(response.data)
        setServices(response.data);
      }
    } catch (e) {
      alert("Seems there are an issue, please retry later");
    }
  }

  async function deleteServices(service_id: number) {
    const apiBaseUrl = import.meta.env.VITE_HOTEL_SERVICE_BASE_URL;

    if (!service_id) {
      alert("Seems there are an issue with service_id, please retry later");
      return;
    }

    const url = `${apiBaseUrl}/api/v1/services/delete-service/${service_id}`;

    try {
      await axios.delete(url);
      setTrigger(!trigger);
    } catch (e) {
      alert("Seems there are an issue, please retry later");
    }
  }

  useEffect(() => {
    fetchServices();
  }, [trigger]);

  const filterServices = () => {
    return services.filter((service) =>
      service.service_name?.toLowerCase().includes(searchService.toLowerCase())
    );
  };

  return (
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
          placeholder="Service Name"
          value={searchService}
          onChange={(e) => setSearchService(e.target.value)}
          style={{
            padding: "5px",
            borderRadius: "4px",
            border: "1.5px solid black",
          }}
        />
        <button
          className="btn btn-outline-dark rounded-pill"
          onClick={() => setSearchService("")}
        >
          Clean
        </button>
      </div>
      <table
        className="table table-group-divider"
        style={{
          width: "100%",
          height: "100%",
          margin: 0,
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th scope="col">service_id</th>
            <th scope="col">service_name</th>
            <th scope="col">service_icon</th>
            <th scope="col">
              <ServiceEditAddModal
                _isNew={true}
                onClose={() => {
                  setTrigger(!trigger);
                }}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {filterServices().map((service: ServiceOut) => (
            <tr key={service.service_id}>
              <th scope="row">{service?.service_id}</th>
              <td>{service?.service_name}</td>
              <td>
                <img
                  src={
                    service?.service_icon ||
                    import.meta.env.VITE_IMAGE_NOT_FOUND
                  }
                  style={{ maxWidth: "50px", maxHeight: "50px" }}
                />
              </td>
              <td>
                <div className="d-flex justify-content-center gap-2">
                  <ServiceEditAddModal
                    _isNew={false}
                    service={service}
                    onClose={() => {
                      setTrigger(!trigger);
                    }}
                  />
                  <button
                    className="btn btn-outline-danger rounded-pill"
                    onClick={() => deleteServices(service.service_id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ServiceTable;
