import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

function Home({ children }: Props) {
  const logInDivClass = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
    backgroundImage:
      "url('https://images.pexels.com/photos/122244/pexels-photo-122244.jpeg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return <div style={logInDivClass}>{children}</div>;
}

export default Home;
