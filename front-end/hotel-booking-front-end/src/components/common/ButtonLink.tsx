import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  text?: string;
  className?: string;
  id?: string;
  to?: string;
  children?: ReactNode
  style?: object
}

function ButtonLink({
  text = "Submit",
  className = "btn btn-outline-light rounded-pill",
  id = "linkButton",
  to = "/",
  children,
  style
}: Props) {
  return (
    <Link to={to} className={className} id={id} style={style}>
      {text}{children}
    </Link>
  );
}

export default ButtonLink;
