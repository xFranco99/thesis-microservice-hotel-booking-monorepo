import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  text?: string;
  className?: string;
  id?: string;
  to?: string;
  children?: ReactNode
  style?: object
  state?: object
}

function ButtonLink({
  text = "Submit",
  className = "btn btn-outline-light rounded-pill",
  id = "linkButton",
  to = "/",
  children,
  style,
  state
}: Props) {
  return (
    <Link to={to} state={state} className={className} id={id} style={style}>
      {text}{children}
    </Link>
  );
}

export default ButtonLink;
