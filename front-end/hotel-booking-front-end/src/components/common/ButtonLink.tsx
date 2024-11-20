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
  onClick?: () => void
}

function ButtonLink({
  text = "Submit",
  className = "btn btn-outline-light rounded-pill",
  id = "linkButton",
  to = "/",
  children,
  style,
  state,
  onClick
}: Props) {
  return (
    <Link to={to} state={state} className={className} id={id} style={style} onClick={onClick}>
      {text}{children}
    </Link>
  );
}

export default ButtonLink;
