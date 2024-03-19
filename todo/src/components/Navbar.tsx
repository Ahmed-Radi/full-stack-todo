import { NavLink, useLocation } from "react-router-dom";
import Button from "./ui/Button";

const Navbar = () => {
  const { pathname } = useLocation()
  const storageKey = "user"
  const userDataString = localStorage.getItem(storageKey)
  const userData = userDataString ? JSON.parse(userDataString) : null

  const logoutHandler = () => {
    localStorage.removeItem('user');
    location.replace(pathname) // use "pathname" from useLocation to refresh current page
    /**
     * The scenario of what happens:
     * 1. Fire the logoutHandler function.
     * 2. Remove user data from local storage.
     * 3. Use "pathname" from useLocation to refresh the current page.
     * 4. The protected route component will check in local storage for user data. If it is not found, it will redirect me to the login page.
    */
  }
  return (
    <nav className={`max-w-lg mx-auto mt-7 mb-20 ${userData ? "" : "bg-indigo-600"} px-3 py-5 rounded-md`}>
      <ul className="flex items-center justify-between">
        <li className={`${userData ? "text-indigo-600" : "text-white"} duration-200 font-semibold text-lg`}>
          <NavLink to="/">Home</NavLink>
        </li>
        {userData ? <>
          <div className="flex items-center text-indigo-600 space-x-2">
            <li className="text-indigo-600 duration-200 font-semibold text-lg">
              <NavLink to="/profile">Profile</NavLink>
            </li>
            <Button size={"sm"} onClick={logoutHandler} className="cursor-pointer">
              Logout
            </Button>
          </div>
        </> : <>
        <div className="flex items-center text-indigo-600 space-x-2">
          <li className="text-white duration-200 font-semibold text-lg">
            <NavLink to="/register">Register</NavLink>
          </li>
          <li className="text-white duration-200 font-semibold text-lg">
            <NavLink to="/login">Login</NavLink>
          </li>
        </div>
        </>
        }
      </ul>
    </nav>
  );
};

export default Navbar;
