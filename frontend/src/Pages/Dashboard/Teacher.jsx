import React, { useState, useEffect } from "react";
import { BsChevronRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import Header from "../../components/Header";
import Spinner from "../../components/UI/Spinner";
import { MdDelete } from "react-icons/md";
import {
  FaUserGraduate,
  FaCalendarAlt,
  FaEnvelope,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

function Teacher() {
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [highlightedTimeSlot, setHighlightedTimeSlot] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [messageModal, setMessageModal] = useState(false);
  const [seduleModal, setSeduleModal] = useState(false);

  const [messages, setMessages] = useState([]);
  const [messageCounts, setMessageCounts] = useState({});
  const [tableAppointments, setTableAppointments] = useState([]);

  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fetchData = async () => {
    try {
      const jwtToken = localStorage.getItem("Teacher jwtToken");

      if (jwtToken == null) {
        navigate("/teacher/login");
      } else {
        const response = await axios.get(
          `http://localhost:5000/api/v1/teachers/getAllPendingStudents`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        setCards(response.data.students);

        const counts = {};

        for (const card of response.data.students) {
          for (const studentInfo of card.students) {
            const emailToFilter =
              studentInfo.studentId && studentInfo.studentId.email
                ? studentInfo.studentId.email
                : null;

            if (emailToFilter) {
              const messageResponse = await axios.get(
                `http://localhost:5000/api/v1/messages`,
                {
                  headers: {
                    Authorization: `Bearer ${jwtToken}`,
                  },
                  params: {
                    email: emailToFilter,
                  },
                }
              );

              if (messageResponse.status === 200) {
                const data = messageResponse.data;
                counts[emailToFilter] = data.messages.length;
              }
            }
          }
        }

        setMessageCounts(counts);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchTeacherData = async () => {
    try {
      const jwtToken = localStorage.getItem("Teacher jwtToken");

      const response = await axios.get(
        `http://localhost:5000/api/v1/teachers/schedule`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      setTableAppointments(response.data.appointments);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchTeacherData();
  }, []);

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      const jwtToken = localStorage.getItem("Teacher jwtToken");

      const response = await axios.delete(
        `http://localhost:5000/api/v1/teachers/reschedule/${appointmentId}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      toast.success("Appointment Deleted Successfully");

      if (response.status === 200) {
        setTableAppointments((prevAppointments) =>
          prevAppointments.filter(
            (appointment) => appointment._id !== appointmentId
          )
        );
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  const fetchMessages = async (email) => {
    try {
      const jwtToken = localStorage.getItem("Teacher jwtToken");

      const response = await axios.get(
        `http://localhost:5000/api/v1/messages`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
          params: {
            email,
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;
        setMessages(data.messages);

        setMessageCounts((prevCounts) => ({
          ...prevCounts,
          [email]: data.messages.length,
        }));
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleStudentApprove = async (
    studentId,
    teacherAppointmentId
  ) => {
    try {
      setSpinner(true);

      const jwtToken = localStorage.getItem("Teacher jwtToken");

      const url = `http://localhost:5000/api/v1/teachers/changeApprovalStatus/${teacherAppointmentId}/${studentId}`;

      const response = await axios.patch(
        url,
        null,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      setSpinner(false);

      setCards((prevCards) => {
        return prevCards.map((schedule) => ({
          ...schedule,
          students: schedule.students.filter(
            (student) => student.studentId._id !== studentId
          ),
        }));
      });

      toast.success("Student Approved");
    } catch (error) {
      setSpinner(false);
      console.error(error);
    }
  };

  const handleStudentReject = async (
    studentId,
    teacherAppointmentId
  ) => {
    try {
      setSpinner(true);

      const jwtToken = localStorage.getItem("Teacher jwtToken");

      const url = `http://localhost:5000/api/v1/teachers/changeApprovalStatus/${teacherAppointmentId}/${studentId}`;

      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      setSpinner(false);

      setCards((prevCards) => {
        return prevCards.map((schedule) => ({
          ...schedule,
          students: schedule.students.filter(
            (student) => student.studentId._id !== studentId
          ),
        }));
      });

      toast.error("Student Rejected");
    } catch (error) {
      setSpinner(false);
      console.error(error);
    }
  };

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setHighlightedTimeSlot(timeSlot);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const jwtToken = localStorage.getItem("Teacher jwtToken");

      await axios.post(
        `http://localhost:5000/api/v1/teachers/schedule`,
        {
          scheduleAt: selectedTimeSlot,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      fetchTeacherData();

      setSeduleModal(false);
      setHighlightedTimeSlot("");
      setSelectedTimeSlot("");

      toast.success("Appointment Scheduled Successfully");
    } catch (error) {
      console.error(error);

      if (selectedTimeSlot === "") {
        toast.error("Please select one time slot");
      } else {
        toast.error("Already Booked");
      }
    }
  };

  return (
    <>
      {spinner ? (
        <Spinner />
      ) : (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-950 dark:text-white">
          <Header
            name="Teacher Dashboard"
            style="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-xl"
          />

          {/* Schedule Modal */}
          {seduleModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 w-[95%] max-w-xl">
                <h2 className="text-3xl font-bold mb-6 text-center">
                  Schedule Lecture
                </h2>

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      {
                        label: "2 PM - 4 PM",
                        value: `${getCurrentDate()}T14:00:00`,
                      },
                      {
                        label: "5 PM - 6 PM",
                        value: `${getCurrentDate()}T17:00:00`,
                      },
                      {
                        label: "7 PM - 8 PM",
                        value: `${getCurrentDate()}T19:00:00`,
                      },
                    ].map((slot) => (
                      <button
                        key={slot.value}
                        type="button"
                        onClick={() =>
                          handleTimeSlotSelect(slot.value)
                        }
                        className={`p-4 rounded-2xl border font-semibold transition-all duration-300 ${
                          highlightedTimeSlot === slot.value
                            ? "bg-indigo-600 text-white scale-105 shadow-lg"
                            : "bg-gray-100 hover:bg-indigo-100 dark:bg-slate-800"
                        }`}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-center gap-4 mt-8">
                    <button
                      type="button"
                      onClick={() => {
                        setSeduleModal(false);
                        setHighlightedTimeSlot("");
                        setSelectedTimeSlot("");
                      }}
                      className="px-6 py-3 rounded-xl bg-gray-300 hover:bg-gray-400 font-semibold"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg"
                    >
                      Save Schedule
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Message Modal */}
          {messageModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-[95%] max-w-2xl">
                <div className="border-b p-6">
                  <h2 className="text-2xl font-bold">
                    Student Messages
                  </h2>
                </div>

                <div className="max-h-[400px] overflow-y-auto p-6 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className="bg-gray-100 dark:bg-slate-800 p-4 rounded-2xl"
                    >
                      {message.messageText}
                    </div>
                  ))}
                </div>

                <div className="p-6 flex justify-end">
                  <button
                    onClick={() => setMessageModal(false)}
                    className="px-6 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          <section className="p-6 lg:p-10">
            {/* Top Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div
                onClick={() => setSeduleModal(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-3xl p-8 shadow-xl cursor-pointer hover:scale-105 transition"
              >
                <FaCalendarAlt className="text-4xl mb-4" />
                <h2 className="text-3xl font-bold">
                  {tableAppointments.length}
                </h2>
                <p className="text-lg mt-2">Upcoming Appointments</p>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl">
                <FaUserGraduate className="text-4xl text-indigo-600 mb-4" />
                <h2 className="text-3xl font-bold">
                  {cards.length}
                </h2>
                <p className="text-lg mt-2 text-gray-500">
                  Pending Requests
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl">
                <FaEnvelope className="text-4xl text-pink-600 mb-4" />
                <h2 className="text-3xl font-bold">
                  {Object.values(messageCounts).reduce(
                    (a, b) => a + b,
                    0
                  )}
                </h2>
                <p className="text-lg mt-2 text-gray-500">
                  Total Messages
                </p>
              </div>
            </div>

            {/* Appointment Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-6 overflow-x-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  Upcoming Appointments
                </h2>
              </div>

              <table className="w-full text-left">
                <thead>
                  <tr className="border-b dark:border-slate-700">
                    <th className="py-4">Name</th>
                    <th>Email</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Delete</th>
                  </tr>
                </thead>

                <tbody>
                  {tableAppointments.map((appointment) => {
                    const scheduleDate = new Date(
                      appointment.scheduleAt
                    );

                    return (
                      <tr
                        key={appointment._id}
                        className="border-b dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                      >
                        <td className="py-4 font-semibold">
                          {appointment.name}
                        </td>

                        <td>{appointment.sendBy}</td>

                        <td>
                          {scheduleDate.toLocaleDateString()}
                        </td>

                        <td>
                          {scheduleDate.toLocaleTimeString()}
                        </td>

                        <td>
                          <button
                            onClick={() =>
                              handleDeleteAppointment(
                                appointment._id
                              )
                            }
                            className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl"
                          >
                            <MdDelete />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Student Cards */}
            <div className="mt-12">
              <h2 className="text-3xl font-bold mb-8">
                Pending Student Requests
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {cards.map((schedule) =>
                  schedule.students.map((studentInfo) => {
                    const {
                      _id: teacherAppointmentId,
                      scheduleAt,
                    } = schedule;

                    const {
                      _id: studentId,
                      name,
                      department,
                      email,
                    } = studentInfo.studentId;

                    return (
                      <div
                        key={studentId}
                        className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                      >
                        <img
                          src="https://static.vecteezy.com/system/resources/previews/001/942/923/large_2x/student-boy-with-school-suitcase-back-to-school-free-vector.jpg"
                          alt="student"
                          className="h-56 w-full object-cover"
                        />

                        <div className="p-6">
                          <h3 className="text-2xl font-bold mb-2">
                            {name}
                          </h3>

                          <p className="text-gray-500 dark:text-gray-400 mb-2">
                            {department}
                          </p>

                          <p className="text-sm text-indigo-600 font-semibold mb-6">
                            {new Date(
                              scheduleAt
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>

                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() =>
                                handleStudentApprove(
                                  studentId,
                                  teacherAppointmentId
                                )
                              }
                              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold"
                            >
                              <FaCheckCircle />
                              Approve
                            </button>

                            <button
                              onClick={() =>
                                handleStudentReject(
                                  studentId,
                                  teacherAppointmentId
                                )
                              }
                              className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold"
                            >
                              <FaTimesCircle />
                              Reject
                            </button>
                          </div>

                          <button
                            onClick={() => {
                              setStudentEmail(email);
                              setMessages([]);
                              fetchMessages(email);
                              setMessageModal(true);
                            }}
                            className="relative w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold"
                          >
                            Inbox

                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full">
                              {messageCounts[email] || 0}
                            </span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default Teacher;