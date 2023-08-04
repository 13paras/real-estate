import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Spinner from "./Spinner";

const Header = () => {
  const [pageState, setPageState] = useState("Sign-in");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setPageState("Profile");
        setIsAuthenticated(true);
      } else {
        setPageState("Sign-in");
        setIsAuthenticated(false);
      }
    });
  }, [auth]);

  const pathMatchRoute = (route) => {
    if (route == location.pathname) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <header className=' sticky top-0 z-40 flex items-center justify-between bg-deep_blue px-4 py-3 shadow-lg'>
      <h1 className='font-serif text-3xl font-semibold text-light_coral_red'>
        <Link to='/'>realtor.com</Link>
      </h1>
      <ul className='space-x-6 text-lg font-semibold text-cream transition duration-150 ease-in-out'>
        <Link
          to='/'
          className={`${
            pathMatchRoute("/") && " border-b-2 border-b-light_coral_red pb-1"
          }`}
        >
          Home
        </Link>

        <Link
          to='/offers'
          className={`${
            pathMatchRoute("/offers") &&
            "border-b-2 border-b-light_coral_red pb-1"
          }`}
        >
          Offers
        </Link>
        <Link
          to='/profile'
          className={`${
            pathMatchRoute("/profile") ||
            (pathMatchRoute("/sign-in") &&
              " border-b-2 border-b-light_coral_red pb-1")
          }`}
        >
          {pageState}
        </Link>
      </ul>
    </header>
  );
};

export default Header;
