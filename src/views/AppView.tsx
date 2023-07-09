import { Outlet, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useEffect } from "react";

export default function AppView() {
  const navigator = useNavigate();
  useEffect(() => {
    navigator("/manual");
  }, []);

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
