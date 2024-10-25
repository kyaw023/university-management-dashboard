const examData = {
  name: "Fall Semester Final Exams 2023",
  examSchedule: [
    {
      date: "2023-12-10",
      time: "09:00 AM - 11:00 AM",
      subject: "Mathematics",
      venue: "Hall A",
    },
    {
      date: "2023-12-12",
      time: "02:00 PM - 04:00 PM",
      subject: "Physics",
      venue: "Lab 101",
    },
    {
      date: "2023-12-14",
      time: "10:00 AM - 12:00 PM",
      subject: "Computer Science",
      venue: "IT Center",
    },
    {
      date: "2023-12-16",
      time: "01:00 PM - 03:00 PM",
      subject: "English Literature",
      venue: "Auditorium",
    },
  ],
  instructions: [
    "Arrive at the exam venue at least 15 minutes before the scheduled time.",
    "Electronic devices, except for approved calculators, are strictly prohibited.",
    "Read all questions carefully before answering.",
    "Time management is crucial. Allocate your time wisely among all sections.",
    "Write legibly and use blue or black ink only.",
  ],
  signatory: "Prof. Jane Smith, Dean of Examinations",
};

module.exports = examData;
