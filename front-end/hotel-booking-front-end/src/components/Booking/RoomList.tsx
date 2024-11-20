import { useState } from "react";
import CardWithImage from "../common/CardWithImage";
import "../common/common.css";
import RoomCardBoody from "./RoomCardBody";

interface Props {
  data_list: RoomOutAndBookRoomOut[];
}

function RoomList({ data_list }: Props) {
  return (
    <ul className="list-group list-group-flush">
      {data_list ? data_list.map((data) => (
        <li className="list-group padding-td">
          <CardWithImage
            image={
              data.booking
                ? data.booking.room?.photos?.[0]
                : data.room?.photos?.[0] || import.meta.env.VITE_IMAGE_NOT_FOUND
            }
          >
            <RoomCardBoody data={data}></RoomCardBoody>
          </CardWithImage>
        </li>
      )) : <h1>Empty</h1>}
    </ul>
  );
}

export default RoomList;
