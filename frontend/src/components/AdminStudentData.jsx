import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  FaEye,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaArrowRight,
  FaUserGraduate,
  FaTimes,
} from "react-icons/fa";

function AdminStudentData() {

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [showProfile, setShowProfile] =
    useState(false);

  // EDIT MODAL

  const [showEdit, setShowEdit] =
    useState(false);

  // SELECTED STUDENT

  const [selectedStudent, setSelectedStudent] =
    useState(null);

  // FORM DATA

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      department: "",
      age: "",
      password: "",
      passwordConfirm: "",
    });

  const navigate = useNavigate();

  const studentsPerPage = 10;

  // ================= FETCH STUDENTS =================

  const fetchStudents = async () => {

    try {

      setLoading(true);

      const jwtToken = localStorage.getItem(
        "Teacher jwtToken"
      );

      if (!jwtToken) {

        navigate("/teacher/login");

        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/v1/teachers/students/get",
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      setStudents(response.data.students);

      setLoading(false);

    } catch (error) {

      setLoading(false);

      console.log(error);

      if (
        error.response &&
        error.response.status === 401
      ) {

        localStorage.removeItem(
          "Teacher jwtToken"
        );

        navigate("/teacher/login");
      }
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ================= PAGINATION =================

  const totalPages = Math.ceil(
    students.length / studentsPerPage
  );

  const indexOfLastStudent =
    currentPage * studentsPerPage;

  const indexOfFirstStudent =
    indexOfLastStudent - studentsPerPage;

  const currentStudents = students.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  const handleNext = () => {

    if (currentPage < totalPages) {

      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {

    if (currentPage > 1) {

      setCurrentPage(currentPage - 1);
    }
  };

  // ================= DELETE STUDENT =================

  const handleDelete = async (id) => {

    try {

      const jwtToken = localStorage.getItem(
        "Teacher jwtToken"
      );

      await axios.delete(
        `http://localhost:5000/api/v1/teachers/students/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      setStudents((prev) =>
        prev.filter(
          (student) => student._id !== id
        )
      );

    } catch (error) {

      console.log(error);
    }
  };

  // ================= VIEW PROFILE =================

  const handleView = (student) => {

    setSelectedStudent(student);

    setShowProfile(true);
  };

  // ================= EDIT PROFILE =================

  const handleEdit = (student) => {

    setSelectedStudent(student);

    setFormData({
      name: student.name || "",
      email: student.email || "",
      department: student.department || "",
      age: student.age || "",
      password: "",
      passwordConfirm: "",
    });

    setShowEdit(true);
  };

  // ================= HANDLE INPUT =================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= UPDATE STUDENT =================

  const handleUpdateStudent = async (
    e
  ) => {

    e.preventDefault();

    try {

      const jwtToken = localStorage.getItem(
        "Teacher jwtToken"
      );

      const response = await axios.patch(
        `http://localhost:5000/api/v1/teachers/students/update/${selectedStudent._id}`,

        formData,

        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      const updatedStudent =
        response.data.student;

      // UPDATE UI

      setStudents((prev) =>
        prev.map((student) =>
          student._id === updatedStudent._id
            ? updatedStudent
            : student
        )
      );

      setSelectedStudent(updatedStudent);

      setShowEdit(false);

      alert(
        "Student updated successfully"
      );

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Update failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 p-6 transition-all duration-300">

      {/* ================= PROFILE MODAL ================= */}

      {showProfile && selectedStudent && (

        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

          <div className="bg-white dark:bg-slate-900 w-[95%] max-w-xl rounded-3xl shadow-2xl p-8 relative">

            {/* CLOSE BUTTON */}

            <button
              onClick={() =>
                setShowProfile(false)
              }
              className="absolute top-5 right-5 text-gray-500 hover:text-red-500"
            >
              <FaTimes size={20} />
            </button>

            {/* PROFILE */}

            <div className="flex flex-col items-center">

              <div className="w-28 h-28 rounded-full bg-indigo-600 flex items-center justify-center text-white text-4xl font-bold mb-5">

                {selectedStudent.name
                  ?.charAt(0)
                  .toUpperCase()}

              </div>

              <h2 className="text-3xl font-bold dark:text-white">
                {selectedStudent.name}
              </h2>

              <p className="text-gray-500 mt-2">
                {selectedStudent.email}
              </p>

            </div>

            {/* DETAILS */}

            <div className="grid grid-cols-2 gap-5 mt-8">

              <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded-2xl">
                <h3 className="text-sm text-gray-500">
                  Department
                </h3>

                <p className="font-bold dark:text-white">
                  {selectedStudent.department}
                </p>
              </div>

              <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded-2xl">
                <h3 className="text-sm text-gray-500">
                  Age
                </h3>

                <p className="font-bold dark:text-white">
                  {selectedStudent.age}
                </p>
              </div>

              <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded-2xl">
                <h3 className="text-sm text-gray-500">
                  Role
                </h3>

                <p className="font-bold dark:text-white">
                  {selectedStudent.roles}
                </p>
              </div>

              <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded-2xl">
                <h3 className="text-sm text-gray-500">
                  Appointments
                </h3>

                <p className="font-bold dark:text-white">
                  {selectedStudent.appointments
                    ?.length || 0}
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}

      {showEdit && (

        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

          <div className="bg-white dark:bg-slate-900 w-[95%] max-w-2xl rounded-3xl shadow-2xl p-8 relative">

            {/* CLOSE */}

            <button
              onClick={() =>
                setShowEdit(false)
              }
              className="absolute top-5 right-5 text-gray-500 hover:text-red-500"
            >
              <FaTimes size={20} />
            </button>

            <h2 className="text-3xl font-bold mb-8 dark:text-white">
              Edit Student
            </h2>

            {/* FORM */}

            <form
              onSubmit={
                handleUpdateStudent
              }
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >

              {/* NAME */}

              <div>
                <label className="block mb-2 font-semibold dark:text-white">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-4 rounded-2xl bg-gray-100 dark:bg-slate-800 dark:text-white outline-none"
                />
              </div>

              {/* EMAIL */}

              <div>
                <label className="block mb-2 font-semibold dark:text-white">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-4 rounded-2xl bg-gray-100 dark:bg-slate-800 dark:text-white outline-none"
                />
              </div>

              {/* DEPARTMENT */}

              <div>
                <label className="block mb-2 font-semibold dark:text-white">
                  Department
                </label>

                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full p-4 rounded-2xl bg-gray-100 dark:bg-slate-800 dark:text-white outline-none"
                />
              </div>

              {/* AGE */}

              <div>
                <label className="block mb-2 font-semibold dark:text-white">
                  Age
                </label>

                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full p-4 rounded-2xl bg-gray-100 dark:bg-slate-800 dark:text-white outline-none"
                />
              </div>

              {/* PASSWORD */}

              <div>
                <label className="block mb-2 font-semibold dark:text-white">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="w-full p-4 rounded-2xl bg-gray-100 dark:bg-slate-800 dark:text-white outline-none"
                />
              </div>

              {/* CONFIRM PASSWORD */}

              <div>
                <label className="block mb-2 font-semibold dark:text-white">
                  Confirm Password
                </label>

                <input
                  type="password"
                  name="passwordConfirm"
                  value={
                    formData.passwordConfirm
                  }
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className="w-full p-4 rounded-2xl bg-gray-100 dark:bg-slate-800 dark:text-white outline-none"
                />
              </div>

              {/* SUBMIT */}

              <div className="md:col-span-2">

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold text-lg transition-all"
                >
                  Update Student
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

      {/* ================= HEADER ================= */}

      <div className="flex items-center gap-4 mb-8">

        <div className="bg-indigo-600 text-white p-4 rounded-2xl shadow-lg">
          <FaUserGraduate className="text-3xl" />
        </div>

        <div>
          <h1 className="text-3xl font-bold dark:text-white">
            Students Database
          </h1>

          <p className="text-gray-500 dark:text-gray-400">
            Manage students records and details
          </p>
        </div>
      </div>

      {/* ================= TABLE ================= */}

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-x-auto border border-gray-200 dark:border-slate-800">

        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-200">

          <thead className="bg-gray-800 dark:bg-slate-800 text-white">

            <tr>
              <th className="p-4">S.No</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Department</th>
              <th className="p-4">Age</th>
              <th className="p-4">Role</th>
              <th className="p-4">
                Appointments
              </th>
              <th className="p-4 text-center">
                Action
              </th>
            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td
                  colSpan="8"
                  className="text-center py-10 text-lg font-semibold dark:text-white"
                >
                  Loading...
                </td>
              </tr>

            ) : currentStudents.length > 0 ? (

              currentStudents.map(
                (student, index) => (

                  <tr
                    key={student._id}
                    className="border-b border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-300"
                  >

                    <td className="p-4">
                      {indexOfFirstStudent +
                        index +
                        1}
                    </td>

                    <td className="p-4 font-semibold">
                      {student.name}
                    </td>

                    <td className="p-4">
                      {student.email}
                    </td>

                    <td className="p-4">
                      {student.department}
                    </td>

                    <td className="p-4">
                      {student.age}
                    </td>

                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 text-xs font-semibold">
                        {student.roles}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 text-xs font-semibold">
                        {student.appointments
                          ?.length || 0}
                      </span>
                    </td>

                    <td className="p-4">

                      <div className="flex items-center justify-center gap-4 text-lg">

                        {/* VIEW */}

                        <button
                          onClick={() =>
                            handleView(student)
                          }
                          className="text-gray-500 hover:text-blue-500 transition-all"
                        >
                          <FaEye />
                        </button>

                        {/* EDIT */}

                        <button
                          onClick={() =>
                            handleEdit(student)
                          }
                          className="text-gray-500 hover:text-green-500 transition-all"
                        >
                          <FaEdit />
                        </button>

                        {/* DELETE */}

                        <button
                          onClick={() =>
                            handleDelete(
                              student._id
                            )
                          }
                          className="text-gray-500 hover:text-red-500 transition-all"
                        >
                          <FaTrash />
                        </button>

                      </div>
                    </td>

                  </tr>
                )
              )

            ) : (

              <tr>
                <td
                  colSpan="8"
                  className="text-center py-10 text-lg font-semibold dark:text-white"
                >
                  No Students Found
                </td>
              </tr>

            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminStudentData;