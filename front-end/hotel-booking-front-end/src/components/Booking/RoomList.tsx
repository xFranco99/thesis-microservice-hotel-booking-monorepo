import CardWithImage from "../common/CardWithImage";
import "../common/common.css";
import RoomCardBoody from "./RoomCardBody";

interface Props {
  rooms: Room[]
}

function RoomList({rooms}: Props) {

const missingPhoto = 'https://media.istockphoto.com/id/1472933890/vector/no-image-vector-symbol-missing-available-icon-no-gallery-for-this-moment-placeholder.jpg?s=612x612&w=0&k=20&c=Rdn-lecwAj8ciQEccm0Ep2RX50FCuUJOaEM8qQjiLL0='

  return (
    <ul className="list-group list-group-flush">
      {rooms.map((room) => (
        <li className="list-group padding-td">
          <CardWithImage image={room.photo?.[0] || missingPhoto}>
            <RoomCardBoody
              room={room}
            ></RoomCardBoody>
          </CardWithImage>
        </li>
      ))}
    </ul>
  );
}

export default RoomList;
