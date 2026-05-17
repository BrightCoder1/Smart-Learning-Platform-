import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FaEye,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaArrowRight,
  FaUserGraduate,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function StudentData() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);

  const studentsPerPage = 10;


  const fetchStudents = async () => {
    try {
      setLoading(true);

      const jwtToken = localStorage.getItem(
        "Teacher jwtToken"
      );

      if(!jwtToken){
        navigate("/teacher/login")
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

      if(!jwtToken){
        
      }

      await axios.delete(
         `http://localhost:5000/api/v1/teachers/students/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      setStudents((prev) =>
        prev.filter((student) => student._id !== id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 p-6 transition-all duration-300">
      {/* HEADER */}

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

      {/* TABLE */}

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-x-auto border border-gray-200 dark:border-slate-800">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-200">
          {/* TABLE HEAD */}

          <thead className="bg-gray-800 dark:bg-slate-800 text-white">
            <tr>
              <th className="p-4">S.No</th>

              <th className="p-4">Name</th>

              <th className="p-4">Email</th>

              <th className="p-4">Department</th>

              <th className="p-4">Subjects</th>

              <th className="p-4">Age</th>

              <th className="p-4">Role</th>

              <th className="p-4">Appointments</th>

              <th className="p-4">Admission</th>

              <th className="p-4 text-center">
                Action
              </th>
            </tr>
          </thead>

          {/* TABLE BODY */}

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="10"
                  className="text-center py-10 text-lg font-semibold dark:text-white"
                >
                  Loading...
                </td>
              </tr>
            ) : currentStudents.length > 0 ? (
              currentStudents.map((student, index) => (
                <tr
                  key={student._id}
                  className="border-b border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-300"
                >

                  <td className="p-4">
                    {indexOfFirstStudent + index + 1}
                  </td>


                  <td className="p-4 font-semibold text-black dark:text-white">
                    {student.name}
                  </td>


                  <td className="p-4">
                    {student.email}
                  </td>


                  <td className="p-4">
                    {student.department}
                  </td>


                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {student.subject &&
                      student.subject.length > 0 ? (
                        student.subject.map(
                          (sub, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 text-xs font-semibold"
                            >
                              {sub}
                            </span>
                          )
                        )
                      ) : (
                        <span className="text-gray-400">
                          No Subjects
                        </span>
                      )}
                    </div>
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
                      {student.appointments?.length || 0}
                    </span>
                  </td>


                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        student.admissionStatus
                          ? "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300"
                          : "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300"
                      }`}
                    >
                      {student.admissionStatus
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>


                  <td className="p-4">
                    <div className="flex items-center justify-center gap-4 text-lg">
                      <button className="text-gray-500 hover:text-blue-500 transition-all">
                        <FaEye />
                      </button>

                      <button className="text-gray-500 hover:text-green-500 transition-all">
                        <FaEdit />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(student._id)
                        }
                        className="text-gray-500 hover:text-red-500 transition-all"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="10"
                  className="text-center py-10 text-lg font-semibold dark:text-white"
                >
                  No Students Found
                </td>
              </tr>
            )}
          </tbody>
        </table>


        <div className="flex items-center justify-between p-5 border-t border-gray-200 dark:border-slate-800">

          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl transition-all ${
              currentPage === 1
                ? "bg-gray-300 dark:bg-slate-700 cursor-not-allowed"
                : "bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-black dark:text-white"
            }`}
          >
            <FaArrowLeft />
            Previous
          </button>


          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() =>
                  setCurrentPage(index + 1)
                }
                className={`w-10 h-10 rounded-xl font-semibold transition-all ${
                  currentPage === index + 1
                    ? "bg-black dark:bg-indigo-600 text-white"
                    : "bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 text-black dark:text-white"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl transition-all ${
              currentPage === totalPages
                ? "bg-gray-300 dark:bg-slate-700 cursor-not-allowed"
                : "bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-black dark:text-white"
            }`}
          >
            Next
            <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentData;