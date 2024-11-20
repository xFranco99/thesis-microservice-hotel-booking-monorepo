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
      {data_list.map((data) => (
        <li className="list-group padding-td">
          <CardWithImage
            image={
              data.booking
                ? data.booking.room?.photos?.[0]
                : data.room?.photos?.[0] ||
                  "https://media.istockphoto.com/id/1472933890/vector/no-image-vector-symbol-missing-available-icon-no-gallery-for-this-moment-placeholder.jpg?s=612x612&w=0&k=20&c=Rdn-lecwAj8ciQEccm0Ep2RX50FCuUJOaEM8qQjiLL0="
            }
          >
            <RoomCardBoody data={data}></RoomCardBoody>
          </CardWithImage>
        </li>
      ))}
    </ul>
  );
}

export default RoomList;
