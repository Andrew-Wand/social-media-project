import { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import { Link, useNavigate } from "react-router-dom";
import { TbHome } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { MdLogout } from "react-icons/md";

const Navbar = ({ loggedIn }) => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const user = AuthService.getCurrentUser();
  let navigate = useNavigate();
  const userIdParam = window.location.pathname.slice(-1);

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
    user;
  }, []);

  const logOut = () => {
    AuthService.logout();
  };

  const openMobileMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className={currentUser ? "" : "hidden"}>
      <div className="navbar bg-base-300 shadow-lg xl:bg-transparent xl:shadow-none ">
        {/* Mobile */}
        <div className="navbar-start xl:navbar-start xl:ml-[27rem]">
          {user ? (
            <Link
              to={`/main/${user.id}`}
              className="btn btn-ghost text-xl xl:text-3xl"
            >
              MyBlog
            </Link>
          ) : (
            <Link to={`/`} className="btn btn-ghost text-xl xl:text-3xl">
              MyBlog
            </Link>
          )}
        </div>
        <div className="navbar-end">
          <label className="btn btn-ghost text-white swap swap-rotate lg:hidden ">
            {/* this hidden checkbox controls the state */}
            {!isOpen ? (
              <input type="checkbox" onClick={openMobileMenu} id="hamburger" />
            ) : (
              <input
                type="checkbox"
                onClick={openMobileMenu}
                checked
                id="hamburger"
              />
            )}

            {/* hamburger icon */}
            <svg
              className="swap-off fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 512 512"
            >
              <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
            </svg>

            {/* close icon */}
            <svg
              className="swap-on fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 512 512"
            >
              <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
            </svg>
          </label>
        </div>
        {/* DESKTOP */}
        <div className="xl:navbar-end hidden xl:flex xl:mr-[27rem] ">
          <ul className="menu menu-horizontal px-1 xl:text-[1.1rem]">
            {currentUser ? (
              // User is logged in
              <>
                <li className="nav-item">
                  <Link to={`/profile/${userIdParam}`} className="nav-link">
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <a href="/" className="nav-link" onClick={logOut}>
                    Log Out
                  </a>
                </li>
              </>
            ) : (
              // No user logged in
              <>
                <li className="nav-item">
                  <Link to={"/sign-in"} className="nav-link">
                    Login
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to={"/register"} className="nav-link">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      {/* MOBILE */}
      <div
        className={
          !isOpen
            ? "text-center h-0 overflow-hidden transition-[height] ease duration-[400ms] lg:hidden  bg-base-200 w-full z-0 shadow-md"
            : "text-center h-[9.5rem] overflow-hidden transition-[height] ease duration-[400ms] lg:hidden  bg-base-200 w-full z-0 text-[#b8c5c9]"
        }
      >
        <ul className="menu text-lg ">
          <li className="">
            {user ? (
              <Link to={`/main/${user.id}`}>
                <span className="mr-2">
                  <TbHome className="text-2xl" />
                </span>
                Home
              </Link>
            ) : (
              <Link to={`/`}>
                <span className="mr-2">
                  <TbHome className="text-2xl" />
                </span>
                Home
              </Link>
            )}
          </li>

          <li className="">
            <Link
              to={`/profile/${userIdParam}`}
              className="nav-link"
              onClick={closeMobileMenu}
            >
              <span className="mr-2">
                <CgProfile className="text-2xl" />
              </span>
              Profile
            </Link>
          </li>
          <li className="">
            <a className="cursor-pointer" href="/" onClick={logOut}>
              <span className="mr-2">
                <MdLogout className="text-2xl" />
              </span>
              Log Out
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
  // return (
  //   <nav>
  //     <div className="navbar bg-slate-500 xl:shadow-lg">
  //       {/* MOBILE */}
  //       <div className="navbar-start">
  //         <div className={user ? "dropdown" : "hidden"}>
  //           <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
  //             <svg
  //               xmlns="http://www.w3.org/2000/svg"
  //               className="h-5 w-5"
  //               fill="none"
  //               viewBox="0 0 24 24"
  //               stroke="currentColor"
  //             >
  //               <path
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //                 strokeWidth="2"
  //                 d="M4 6h16M4 12h8m-8 6h16"
  //               />
  //             </svg>
  //           </div>
  //           <ul
  //             tabIndex={0}
  //             className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
  //           >
  //             {/* User is loggedin */}
  //             <div className="navbar-nav ">
  //               <li className="nav-item">
  //                 <Link to={`/profile/${userIdParam}`} className="nav-link">
  //                   Profile
  //                 </Link>
  //               </li>
  //               <li className="nav-item">
  //                 <a href="/" className="nav-link" onClick={logOut}>
  //                   Log Out
  //                 </a>
  //               </li>
  //             </div>
  //           </ul>
  //         </div>
  //         {user ? (
  //           <Link to={`/main/${user.id}`} className="btn btn-ghost text-xl">
  //             Chat Room
  //           </Link>
  //         ) : (
  //           <Link to={`/`} className="btn btn-ghost text-xl">
  //             Chat Room
  //           </Link>
  //         )}
  //       </div>

  //       {/* DESKTOP */}
  //       <div className="navbar-end hidden xl:flex">
  //         <ul className="menu menu-horizontal px-1">
  //           {currentUser ? (
  //             // User is logged in
  //             <>
  //               <li className="nav-item">
  //                 <Link to={`/profile/${userIdParam}`} className="nav-link">
  //                   Profile
  //                 </Link>
  //               </li>
  //               <li className="nav-item">
  //                 <a className="nav-link" onClick={logOut}>
  //                   Log Out
  //                 </a>
  //               </li>
  //             </>
  //           ) : (
  //             // No user logged in
  //             <>
  //               <li className="nav-item">
  //                 <Link to={"/sign-in"} className="nav-link">
  //                   Login
  //                 </Link>
  //               </li>

  //               <li className="nav-item">
  //                 <Link to={"/register"} className="nav-link">
  //                   Sign Up
  //                 </Link>
  //               </li>
  //             </>
  //           )}
  //         </ul>
  //       </div>
  //     </div>
  //   </nav>
  // );
};

export default Navbar;
