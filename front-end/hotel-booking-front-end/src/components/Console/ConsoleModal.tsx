import CommonLabel from "../common/CommonLabel";
import HotelTable from "./Hotel/HotelTable";
import { useAuth } from "../../state/AuthProvider";
import { Route, Routes, useNavigate } from "react-router-dom";
import RoomsTable from "./Rooms/RoomsTable";
import ConsoleRoomDetail from "./Rooms/ConsoleRoomDetail";
import ServiceTable from "./Services/ServicesTable";
import MailTable from "./Mail/MailTable";
import AiRagTable from "./RAG/AiRagTable";

function ConsoleModal() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  if (!isAdmin) {
    navigate("/");
  }

  return (
    <CommonLabel style={{ backgroundColor: "rgba(255, 255, 255, 0)" }}>
      <Routes>
        <Route path="*" element={<HotelTable />} />
        <Route path="rooms" element={<RoomsTable />} />
        <Route path="rooms/detail" element={<ConsoleRoomDetail />} />
        <Route path="services" element={<ServiceTable />} />
        <Route path="mail" element={<MailTable />} />
        <Route path="aiRag" element={<AiRagTable />} />
      </Routes>
    </CommonLabel>
  );
}

export default ConsoleModal;
