import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import { IoIosLogOut } from "react-icons/io";
import { FaMoon, FaSun, FaUserCircle } from "react-icons/fa";
import { HiOutlineAcademicCap } from "react-icons/hi";

import { ThemeContext } from "../../context/ThemeContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isRootRoute = location.pathname === "/";

  const localData =
    localStorage.getItem("Teacher jwtToken") ||
    localStorage.getItem("Student jwtToken") ||
    localStorage.getItem("jwtToken");

  const userData =
    localStorage.getItem("Student Name") ||
    localStorage.getItem("Teacher Name") ||
    localStorage.getItem("Admin Name");

  const { theme, toggleTheme } = useContext(ThemeContext);

  const changeHandler = () => {
    localStorage.removeItem("Teacher jwtToken");
    localStorage.removeItem("Student jwtToken");
    localStorage.removeItem("jwtToken");

    localStorage.removeItem("Student Name");
    localStorage.removeItem("Teacher Name");
    localStorage.removeItem("Admin Name");

    toast.success("Logout Successfully");

    navigate("/");
  };

  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-slate-950/80 border-b border-gray-200 dark:border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              to={!localData ? "/" : undefined}
              onClick={() => {
                if (localData) {
                  toast.success("Welcome to Tutor-Time");
                }
              }}
              className="flex items-center gap-3"
            >
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-3 rounded-2xl shadow-lg">
                <HiOutlineAcademicCap className="text-white text-2xl" />
              </div>

              <div className="flex flex-col">
                <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  Tutor-Time
                </h1>

                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Smart Learning Platform
                </span>
              </div>
            </Link>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* User Info */}
              {userData && (
                <div className="hidden sm:flex items-center gap-3 bg-gray-100 dark:bg-slate-900 px-4 py-2 rounded-2xl shadow-sm">
                  <FaUserCircle className="text-2xl text-indigo-600" />

                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Welcome Back
                    </span>

                    <span className="font-semibold text-sm dark:text-white">
                      {userData}
                    </span>
                  </div>
                </div>
              )}

              {/* Theme Button */}
              <button
                onClick={toggleTheme}
                className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gray-100 dark:bg-slate-900 hover:scale-105 transition-all duration-300 shadow-md"
              >
                {theme === "light" ? (
                  <FaMoon className="text-xl text-slate-700" />
                ) : (
                  <FaSun className="text-xl text-yellow-400" />
                )}
              </button>

              {/* Logout Button */}
              {localData && (
                <button
                  onClick={changeHandler}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <IoIosLogOut className="text-2xl" />

                  <span className="hidden md:block">
                    Logout
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;