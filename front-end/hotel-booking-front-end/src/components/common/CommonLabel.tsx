import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  style?: object
}

function CommonLabel({ children, style = { backgroundColor: "#F0F0F0" } }: Props) {
  return (
    <div
      className="container text-center"
      style={style}
    >
      {children}
    </div>
  );
}

export default CommonLabel;
