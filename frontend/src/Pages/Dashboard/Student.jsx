import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

import Header from "../../components/Header";
import Spinner from "../../components/UI/Spinner";

import {
  FaChalkboardTeacher,
  FaCalendarCheck,
  FaEnvelope,
  FaClock,
  FaBookOpen,
  FaUserGraduate,
} from "react-icons/fa";

function Student() {
  const navigate = useNavigate();

  const [lectureDetails, setLectureDetails] = useState([]);
  const [email, setEmail] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    message: "",
  });

  const fetchTable = async () => {
    try {
      const jwtToken = localStorage.getItem("Student jwtToken");

      const response = await axios.get(
        `http://localhost:5000/api/v1/student/appointment/getRegisteredAppointments`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      setLectureDetails(response.data.appointments);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const emailAdd = localStorage.getItem("email");
    setEmail(emailAdd);

    const fetchData = async () => {
      try {
        const jwtToken = localStorage.getItem("Student jwtToken");

        if (jwtToken == null) {
          navigate("/student/login");
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
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    fetchTable();
  }, []);

  function changeHandler(event) {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  async function submitHandler(event) {
    event.preventDefault();

    const messageObject = {
      to: teacherEmail,
      messageText: formData.message,
    };

    setShowModal(false);

    try {
      const jwtToken = localStorage.getItem("Student jwtToken");

      const response = await axios.post(
        `http://localhost:5000/api/v1/messages`,
        messageObject,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Message sent successfully");
      } else {
        toast.error("Failed to send message");
      }
    } catch (error) {
      console.error(error);
    }

    setFormData({ message: "" });
  }

  const handleBookAppointment = async (
    appointmentId,
    scheduleAt
  ) => {
    setSpinner(true);

    const jwtToken = localStorage.getItem("Student jwtToken");

    await axios
      .patch(
        `http://localhost:5000/api/v1/student/appointment/${appointmentId}`,
        {
          scheduleAt,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      )
      .then((response) => {
        setSpinner(false);

        toast.success("Appointment booked successfully");

        fetchTable();
      })
      .catch((error) => {
        setSpinner(false);

        toast.error("Already booked appointment");
      });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {spinner ? (
        <Spinner />
      ) : (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-950 dark:text-white">
          {/* Header */}
          <Header
            name="Student Dashboard"
            style="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 shadow-xl"
          />

          {/* Message Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-[95%] max-w-lg overflow-hidden">
                <div className="px-6 py-5 border-b dark:border-slate-700">
                  <h2 className="text-2xl font-bold">
                    Send Message
                  </h2>
                </div>

                <form onSubmit={submitHandler}>
                  <div className="p-6">
                    <textarea
                      rows="5"
                      className="w-full rounded-2xl border border-gray-300 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      type="text"
                      name="message"
                      value={formData.message}
                      onChange={changeHandler}
                      placeholder="Write your message here..."
                    />
                  </div>

                  <div className="flex justify-end gap-4 px-6 py-5 border-t dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-6 py-3 rounded-xl bg-gray-300 hover:bg-gray-400 text-black font-semibold"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="p-6 lg:p-10">
            {/* Dashboard Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-3xl p-8 shadow-xl">
                <FaCalendarCheck className="text-5xl mb-4" />

                <h2 className="text-4xl font-bold">
                  {lectureDetails.length}
                </h2>

                <p className="mt-2 text-lg">
                  Upcoming Lectures
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl">
                <FaChalkboardTeacher className="text-5xl text-indigo-600 mb-4" />

                <h2 className="text-4xl font-bold">
                  {teachers.length}
                </h2>

                <p className="mt-2 text-lg text-gray-500">
                  Available Teachers
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl">
                <FaEnvelope className="text-5xl text-pink-600 mb-4" />

                <h2 className="text-4xl font-bold">
                  Active
                </h2>

                <p className="mt-2 text-lg text-gray-500">
                  Student Account
                </p>
              </div>
            </div>

            {/* Upcoming Lectures */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-6 mb-12 overflow-x-auto">
              <div className="flex items-center gap-3 mb-6">
                <FaBookOpen className="text-3xl text-blue-600" />

                <h2 className="text-3xl font-bold">
                  Upcoming Lectures
                </h2>
              </div>

              {lectureDetails.length !== 0 ? (
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b dark:border-slate-700">
                      <th className="py-4">#</th>
                      <th>Teacher</th>
                      <th>Date</th>
                      <th>Time</th>
                    </tr>
                  </thead>

                  <tbody>
                    {lectureDetails.map((detail, index) => (
                      <tr
                        key={index}
                        className="border-b dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                      >
                        <td className="py-4 font-semibold">
                          {index + 1}
                        </td>

                        <td>{detail.name}</td>

                        <td>
                          {formatDate(detail.scheduleAt)}
                        </td>

                        <td>
                          {formatTime(detail.scheduleAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-10">
                  <FaCalendarCheck className="text-6xl mx-auto text-gray-400 mb-4" />

                  <h2 className="text-2xl font-semibold">
                    No Upcoming Lectures
                  </h2>
                </div>
              )}
            </div>

            {/* Teachers Section */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <FaUserGraduate className="text-3xl text-indigo-600" />

                <h2 className="text-3xl font-bold">
                  All Teachers
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {teachers.map((teacher, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                  >
                    <img
                      src="https://static.vecteezy.com/system/resources/previews/002/406/452/non_2x/female-teacher-teaching-a-lesson-at-the-school-free-vector.jpg"
                      alt="Teacher"
                      className="w-full h-60 object-cover"
                    />

                    <div className="p-6">
                      <h2 className="text-2xl font-bold mb-2">
                        {teacher.name}
                      </h2>

                      <div className="space-y-2 mb-6">
                        <p className="text-gray-500 dark:text-gray-400">
                          <span className="font-semibold text-black dark:text-white">
                            Subject:
                          </span>{" "}
                          {teacher.subject}
                        </p>

                        <p className="text-gray-500 dark:text-gray-400 break-all">
                          <span className="font-semibold text-black dark:text-white">
                            Email:
                          </span>{" "}
                          {teacher.email}
                        </p>
                      </div>

                      {/* Appointment Slots */}
                      <div className="space-y-4">
                        {teacher.appointments.length > 0 ? (
                          teacher.appointments.map(
                            (appointment, appointmentIndex) => (
                              <div
                                key={appointmentIndex}
                                className="bg-gray-100 dark:bg-slate-800 rounded-2xl p-4"
                              >
                                <div className="flex items-center gap-2 text-indigo-600 font-semibold mb-3">
                                  <FaClock />

                                  {new Date(
                                    appointment.scheduleAt
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>

                                <button
                                  onClick={() =>
                                    handleBookAppointment(
                                      appointment._id,
                                      appointment.scheduleAt
                                    )
                                  }
                                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
                                >
                                  Book Appointment
                                </button>
                              </div>
                            )
                          )
                        ) : (
                          <div className="bg-red-100 text-red-600 rounded-2xl p-4 text-center font-semibold">
                            No Scheduled Appointments
                          </div>
                        )}
                      </div>

                      {/* Message Button */}
                      <button
                        onClick={() => {
                          setTeacherEmail(teacher.email);
                          setShowModal(true);
                        }}
                        className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold shadow-lg"
                      >
                        Send Message
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Student;