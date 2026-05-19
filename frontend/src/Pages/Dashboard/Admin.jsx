import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

import {
  MdDelete,
  MdGroups,
  MdOutlineSchool,
  MdPersonAddAlt1,
} from "react-icons/md";

import {
  FaChalkboardTeacher,
  FaUniversity,
  FaEnvelope,
  FaUserGraduate,
  FaCheckCircle,
} from "react-icons/fa";

import Header from "../../components/Header";
import Spinner from "../../components/UI/Spinner";

function Admin() {
  const navigate = useNavigate();

  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);

  const [spinner, setSpinner] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const fetchTeachers = async () => {
    try {
      const jwtToken = localStorage.getItem("jwtToken");

      if (jwtToken == null) {
        navigate("/admin/login");
      } else {
        const response = await axios.get(
          `http://localhost:5000/api/v1/admin`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        setTeachers(response.data.data.users);
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  // ================= FETCH PENDING STUDENTS =================

  const fetchPendingStudents = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/teachers`,
        {
          params: {
            admissionStatus: false,
          },
        }
      );

      setStudents(response.data.students);
    } catch (error) {
      console.error("Error fetching pending students:", error);
    }
  };

  // ================= FETCH ALL STUDENTS =================

  const fetchAllStudents = async () => {
    try {
      const jwtToken = localStorage.getItem("jwtToken");

      const response = await axios.get(
        `http://localhost:5000/api/v1/admin/getstudents`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      console.log(response.data.data.users);

      setAllStudents(response.data.data.users);
    } catch (error) {
      console.error("Error fetching all students:", error);
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchPendingStudents();
    fetchAllStudents();
  }, []);

  // ================= DELETE TEACHER =================

  const handleDeleteTeacher = async (_id, index) => {
    const jwtToken = localStorage.getItem("jwtToken");

    await axios
      .delete(`http://localhost:5000/api/v1/admin/${_id}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
      .then(() => {
        const updatedTeachers = [...teachers];
        updatedTeachers.splice(index, 1);

        setTeachers(updatedTeachers);

        toast.success("Teacher deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting teacher:", error);
        toast.error("Error deleting teacher");
      });
  };

  // ================= DELETE STUDENT =================

  const handleDeleteStudent = async (_id, index) => {
    const jwtToken = localStorage.getItem("jwtToken");

    try {
      await axios.delete(
        `http://localhost:5000/api/v1/admin/rejectStudent/${_id}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      const updatedStudents = [...allStudents];
      updatedStudents.splice(index, 1);

      setAllStudents(updatedStudents);

      toast.success("Student deleted successfully");
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error("Error deleting student");
    }
  };

  // ================= FORM =================

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    subject: "",
    department: "",
    password: "",
    passwordConfirm: "",
  });

  function changeHandler(event) {
    const { name, value } = event.target;

    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  }

  async function submitHandler(event) {
    event.preventDefault();

    const requestData = {
      email: formData.email,
      name: formData.name,
      subject: formData.subject,
      department: formData.department,
      age: formData.age,
      password: formData.password,
      passwordConfirm: formData.passwordConfirm,
    };

    try {
      const jwtToken = localStorage.getItem("jwtToken");

      await axios.post(
        `http://localhost:5000/api/v1/admin`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      fetchTeachers();

      setFormData({
        name: "",
        email: "",
        age: "",
        subject: "",
        department: "",
        password: "",
        passwordConfirm: "",
      });

      setIsModalOpen(false);

      toast.success("Teacher Added");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  }

  // ================= APPROVE / REJECT =================

  const handleApproveReject = (_id) => {
    const updatedStudents = students.filter(
      (student) => student._id !== _id
    );

    setStudents(updatedStudents);
  };

  const approveStudent = async (_id) => {
    try {
      setSpinner(true);

      const jwtToken = localStorage.getItem("jwtToken");

      await axios.patch(
        `http://localhost:5000/api/v1/admin/approvestudent/${_id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      setSpinner(false);

      fetchAllStudents();

      toast.success("Student approved successfully");
    } catch (error) {
      setSpinner(false);

      console.error("Error approving student:", error);

      toast.error("Error approving student");
    }
  };

  const deleteStudent = async (_id) => {
    try {
      setSpinner(true);

      const jwtToken = localStorage.getItem("jwtToken");

      await axios.delete(
        `http://localhost:5000/api/v1/admin/rejectStudent/${_id}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      setSpinner(false);

      toast.info("Student rejected successfully");
    } catch (error) {
      setSpinner(false);

      console.error("Error rejecting student:", error);

      toast.error("Error rejecting student");
    }
  };

  return (
    <>
      {spinner ? (
        <Spinner />
      ) : (
        <>
          <Header
            name="Admin Dashboard"
            style="bg-gradient-to-r from-indigo-600 to-purple-600"
          />

          <section className="min-h-screen bg-slate-100 dark:bg-slate-900 dark:text-white px-4 md:px-8 py-8">

            {/* ================= DASHBOARD CARDS ================= */}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

              {/* TEACHERS */}

              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-slate-500 text-sm">
                      Total Teachers
                    </p>

                    <h2 className="text-4xl font-bold mt-2">
                      {teachers.length}
                    </h2>
                  </div>

                  <div className="bg-indigo-100 text-indigo-600 p-4 rounded-full text-3xl">
                    <FaChalkboardTeacher />
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold"
                >
                  Add Teacher
                </button>
              </div>

              {/* PENDING STUDENTS */}

              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-slate-500 text-sm">
                      Pending Students
                    </p>

                    <h2 className="text-4xl font-bold mt-2">
                      {students.length}
                    </h2>
                  </div>

                  <div className="bg-green-100 text-green-600 p-4 rounded-full text-3xl">
                    <MdOutlineSchool />
                  </div>
                </div>
              </div>

              {/* ALL STUDENTS */}

              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-slate-500 text-sm">
                      Total Students
                    </p>

                    <h2 className="text-4xl font-bold mt-2">
                      {allStudents.length}
                    </h2>
                  </div>

                  <div className="bg-blue-100 text-blue-600 p-4 rounded-full text-3xl">
                    <FaUserGraduate />
                  </div>
                </div>
              </div>

              {/* DEPARTMENTS */}

              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-slate-500 text-sm">
                      Departments
                    </p>

                    <h2 className="text-4xl font-bold mt-2">
                      {
                        new Set(
                          teachers.map((teacher) => teacher.department)
                        ).size
                      }
                    </h2>
                  </div>

                  <div className="bg-pink-100 text-pink-600 p-4 rounded-full text-3xl">
                    <FaUniversity />
                  </div>
                </div>
              </div>

              <div
                onClick={() =>
                  navigate(
                    "/teacher/attendance"
                  )
                }
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-3xl p-8 shadow-xl cursor-pointer hover:scale-105 transition"
              >

                <FaCheckCircle className="text-4xl mb-4" />

                <h2 className="text-3xl font-bold">
                  Attendance
                </h2>

                <p className="text-lg mt-2">
                  Manage Student Attendance
                </p>
              </div>
            </div>


            {isModalOpen && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">

                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-xl p-8">

                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h1 className="text-2xl font-bold">
                        Add New Teacher
                      </h1>
                    </div>

                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="text-2xl text-slate-500 hover:text-red-500"
                    >
                      ✕
                    </button>
                  </div>

                  <form
                    onSubmit={submitHandler}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={changeHandler}
                      placeholder="Teacher Name"
                      required
                      className="input-style"
                    />

                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={changeHandler}
                      placeholder="Age"
                      required
                      className="input-style"
                    />

                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={changeHandler}
                      placeholder="Department"
                      required
                      className="input-style"
                    />

                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={changeHandler}
                      placeholder="Subject"
                      required
                      className="input-style"
                    />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={changeHandler}
                      placeholder="Email"
                      required
                      className="input-style md:col-span-2"
                    />

                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={changeHandler}
                      placeholder="Password"
                      required
                      className="input-style"
                    />

                    <input
                      type="password"
                      name="passwordConfirm"
                      value={formData.passwordConfirm}
                      onChange={changeHandler}
                      placeholder="Confirm Password"
                      required
                      className="input-style"
                    />

                    <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-6 py-3 rounded-xl bg-slate-300"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        Add Teacher
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ================= TEACHERS TABLE ================= */}

            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-6 mb-10 overflow-hidden">

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  Teachers Management
                </h2>

                <div className="bg-indigo-100 text-indigo-600 p-3 rounded-xl text-2xl">
                  <MdGroups />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-700">
                      <th className="p-4">#</th>
                      <th className="p-4">Teacher</th>
                      <th className="p-4">Subject</th>
                      <th className="p-4">Department</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {teachers.map((teacher, index) => (
                      <tr
                        key={teacher._id}
                        className="border-b dark:border-slate-700"
                      >
                        <td className="p-4">{index + 1}</td>

                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
                              {teacher.name.charAt(0)}
                            </div>

                            <div>
                              <h3 className="font-semibold">
                                {teacher.name}
                              </h3>

                              <p className="text-sm text-slate-500">
                                Faculty Member
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          {Array.isArray(teacher.subject)
                            ? teacher.subject.join(", ")
                            : teacher.subject}
                        </td>

                        <td className="p-4">
                          {teacher.department}
                        </td>

                        <td className="p-4 text-center">
                          <button
                            onClick={() =>
                              handleDeleteTeacher(teacher._id, index)
                            }
                            className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl"
                          >
                            <MdDelete size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ================= ALL STUDENTS TABLE ================= */}

            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-6 mb-10 overflow-hidden">

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  Student Management
                </h2>

                <div className="bg-blue-100 text-blue-600 p-3 rounded-xl text-2xl">
                  <FaUserGraduate />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-700">
                      <th className="p-4">#</th>
                      <th className="p-4">Student</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Department</th>
                      <th className="p-4">Age</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {allStudents.map((student, index) => (
                      <tr
                        key={student._id}
                        className="border-b dark:border-slate-700"
                      >
                        <td className="p-4">{index + 1}</td>

                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                              {student.name?.charAt(0)}
                            </div>

                            <div>
                              <h3 className="font-semibold">
                                {student.name}
                              </h3>

                              <p className="text-sm text-slate-500">
                                Student
                              </p>
                            </div>
                          </div>
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

                        <td className="p-4 text-center">
                          <button
                            onClick={() =>
                              handleDeleteStudent(student._id, index)
                            }
                            className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl"
                          >
                            <MdDelete size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ================= STUDENT REQUESTS ================= */}

            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-6">

              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold">
                    Student Requests
                  </h2>

                  <p className="text-slate-500 mt-1">
                    Approve or reject students
                  </p>
                </div>

                <div className="bg-green-100 text-green-600 p-3 rounded-xl text-2xl">
                  <MdPersonAddAlt1 />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                {students.map((student) => (
                  <div
                    key={student._id}
                    className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-5 shadow-md"
                  >
                    <div className="flex flex-col items-center text-center">

                      <img
                        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        alt="student"
                        className="w-24 h-24 rounded-full mb-4"
                      />

                      <h3 className="text-xl font-bold">
                        {student.name}
                      </h3>

                      <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <FaUniversity />
                        {student.department}
                      </p>

                      <p className="text-slate-500 mt-2 flex items-center gap-2 break-all">
                        <FaEnvelope />
                        {student.email}
                      </p>

                      <div className="flex gap-3 mt-6 w-full">
                        <button
                          onClick={() => {
                            handleApproveReject(student._id);
                            approveStudent(student._id);
                          }}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => {
                            handleApproveReject(student._id);
                            deleteStudent(student._id);
                          }}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}

export default Admin;