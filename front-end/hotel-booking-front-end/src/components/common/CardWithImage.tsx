import { ReactNode } from "react";

interface Props {
  image?: string;
  children: ReactNode;
  style?: object
}

function CardWithImage({ image = "", children, style }: Props) {
  return (
    <div className="card flex-row" style={style}>
      {image !== "" && (
        <img
          className="card-img-left example-card-img-responsive"
          src={image}
          style={{
            padding: "12px",
            borderRadius: "20px",
            maxHeight: "264px",
            maxWidth: "264px",
          }}
        />
      )}

      <div className="card-body">{children}</div>
    </div>
  );
}

export default CardWithImage;
