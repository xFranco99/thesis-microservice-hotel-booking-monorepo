interface Props {
  services: ServiceBase[];
}

function RoomServices({ services }: Props) {

  return (
    <div className="container">
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
        {services.map((service, index) => (
          <div key={index} className="col">
            <div className="d-flex align-items-center justify-content-between p-3 border rounded">
              <span className="text-muted">{service.service_name}</span>
              <img
                src={service.service_icon || import.meta.env.VITE_IMAGE_NOT_FOUND}
                style={{ width: "40px", height: "40px", objectFit: "cover" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoomServices;
