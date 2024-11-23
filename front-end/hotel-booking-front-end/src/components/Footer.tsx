import { useAuth } from "../state/AuthProvider";
import AdminContent from "./Footer/AdminContent";
import UserContent from "./Footer/UserContent";

function Footer() {
  const { auth, user } = useAuth();

  return (
    <footer
      className="d-flex flex-wrap justify-content-between align-items-center bg-dark"
      style={{ maxHeight: "15vh" }}
    >
      <div className="container text-white">
        <footer
          className="d-flex flex-wrap justify-content-between align-items-center py-3 bg-dark"
          style={{ height: "15vh" }}
        >
          {(auth && user?.role === "ADMIN") ? <AdminContent /> : <UserContent />}
        </footer>
      </div>
    </footer>
  );
}

export default Footer;
