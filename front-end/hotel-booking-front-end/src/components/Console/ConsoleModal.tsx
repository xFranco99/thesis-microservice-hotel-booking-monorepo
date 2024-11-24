import { Fragment, useEffect, useState } from "react";
import CommonLabel from "../common/CommonLabel";
import SearchFromList from "../common/SearchFromList";
import axios from "axios";
import HotelTable from "./Hotel/HotelTable";

function ConsoleModal() {
  return (
    <CommonLabel style={{ backgroundColor: "rgba(255, 255, 255, 0)" }}>
      <HotelTable></HotelTable>
    </CommonLabel>
  );
}

export default ConsoleModal;
