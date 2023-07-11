import { Outlet, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useEffect } from "react";
import Footer from "../components/Footer";

export default function AppView() {
  const navigator = useNavigate();
  useEffect(() => {
    navigator("/manual");
  }, []);

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
