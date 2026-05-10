import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import { IoIosLogOut } from "react-icons/io";
import { FaMoon, FaSun, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { HiOutlineAcademicCap } from "react-icons/hi";

import { ThemeContext } from "../../context/ThemeContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenu, setMobileMenu] = useState(false);

  // ================= TOKENS =================

  const teacherToken = localStorage.getItem("Teacher jwtToken");
  const studentToken = localStorage.getItem("Student jwtToken");
  const adminToken = localStorage.getItem("jwtToken");

  const teacherName = localStorage.getItem("Teacher Name");
  const studentName = localStorage.getItem("Student Name");
  const adminName = localStorage.getItem("Admin Name");

  const getCurrentRole = () => {
    if (location.pathname.startsWith("/teacher") && teacherToken)
      return "teacher";

    if (location.pathname.startsWith("/student") && studentToken)
      return "student";

    if (location.pathname.startsWith("/admin") && adminToken)
      return "admin";

    if (teacherToken) return "teacher";
    if (studentToken) return "student";
    if (adminToken) return "admin";

    return null;
  };

  const currentRole = getCurrentRole();

  const localData = Boolean(
    teacherToken || studentToken || adminToken
  );

  const userData =
    (currentRole === "teacher" && teacherName) ||
    (currentRole === "student" && studentName) ||
    (currentRole === "admin" && adminName) ||
    teacherName ||
    studentName ||
    adminName;

  const { theme, toggleTheme } = useContext(ThemeContext);

  // ================= LOGOUT =================

  const changeHandler = () => {
    if (currentRole === "teacher") {
      localStorage.removeItem("Teacher jwtToken");
      localStorage.removeItem("Teacher Name");

      toast.success("Teacher Logout Successfully");
    } else if (currentRole === "student") {
      localStorage.removeItem("Student jwtToken");
      localStorage.removeItem("Student Name");
      localStorage.removeItem("email");

      toast.success("Student Logout Successfully");
    } else if (currentRole === "admin") {
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("Admin Name");

      toast.success("Admin Logout Successfully");
    }

    setMobileMenu(false);
    navigate("/");
  };

  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-slate-950/80 border-b border-gray-200 dark:border-slate-800 shadow-md">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ================= MAIN NAV ================= */}

          <div className="flex items-center justify-between h-16 sm:h-20">

            {/* ================= LOGO ================= */}

            <Link
              to={!localData ? "/" : undefined}
              onClick={() => {
                if (localData) {
                  toast.success("Welcome to Tutor-Time");
                }
              }}
              className="flex items-center gap-2 sm:gap-3"
            >
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-2 sm:p-3 rounded-2xl shadow-lg">

                <HiOutlineAcademicCap className="text-white text-xl sm:text-2xl" />
              </div>

              <div className="flex flex-col">

                <h1 className="text-lg sm:text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  Tutor-Time
                </h1>

                <span className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">
                  Smart Learning Platform
                </span>
              </div>
            </Link>

            {/* ================= DESKTOP SECTION ================= */}

            <div className="hidden md:flex items-center gap-4">

              {/* USER INFO */}

              {userData && (
                <div className="flex items-center gap-3 bg-gray-100 dark:bg-slate-900 px-4 py-2 rounded-2xl shadow-sm">

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

              {/* THEME BUTTON */}

              <button
                onClick={toggleTheme}
                className="w-11 h-11 rounded-2xl flex items-center justify-center bg-gray-100 dark:bg-slate-900 hover:scale-105 transition-all duration-300 shadow-md"
              >
                {theme === "light" ? (
                  <FaMoon className="text-lg text-slate-700" />
                ) : (
                  <FaSun className="text-lg text-yellow-400" />
                )}
              </button>

              {/* LOGOUT BUTTON */}

              {localData && (
                <button
                  onClick={changeHandler}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105"
                >

                  <IoIosLogOut className="text-2xl" />

                  <span>Logout</span>
                </button>
              )}
            </div>

            {/* ================= MOBILE RIGHT ================= */}

            <div className="flex md:hidden items-center gap-3">

              {/* THEME BUTTON */}

              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-slate-900 shadow-md"
              >
                {theme === "light" ? (
                  <FaMoon className="text-lg text-slate-700" />
                ) : (
                  <FaSun className="text-lg text-yellow-400" />
                )}
              </button>

              {/* MENU BUTTON */}

              <button
                onClick={() => setMobileMenu(!mobileMenu)}
                className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-slate-900 shadow-md text-lg dark:text-white"
              >
                {mobileMenu ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>

          {/* ================= MOBILE MENU ================= */}

          {mobileMenu && (
            <div className="md:hidden pb-5 animate-fadeIn">

              <div className="mt-3 bg-gray-100 dark:bg-slate-900 rounded-2xl p-4 shadow-lg">

                {/* USER INFO */}

                {userData && (
                  <div className="flex items-center gap-3 border-b border-gray-300 dark:border-slate-700 pb-4 mb-4">

                    <FaUserCircle className="text-4xl text-indigo-600" />

                    <div>

                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Welcome Back
                      </p>

                      <h2 className="font-bold text-sm dark:text-white">
                        {userData}
                      </h2>
                    </div>
                  </div>
                )}

                {/* LOGOUT */}

                {localData && (
                  <button
                    onClick={changeHandler}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow-md"
                  >

                    <IoIosLogOut className="text-2xl" />

                    Logout
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;