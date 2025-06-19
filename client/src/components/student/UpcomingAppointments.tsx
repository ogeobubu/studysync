import { Calendar } from 'lucide-react';

interface Appointment {
  id: number;
  title: string;
  date: string;
  time: string;
}

export default function UpcomingAppointments() {
  const appointments: Appointment[] = [
    {
      id: 1,
      title: 'Academic Advising Session',
      date: 'Tuesday, July 23, 2024',
      time: '10:00 AM'
    },
    {
      id: 2,
      title: 'Course Planning Meeting',
      date: 'Wednesday, August 14, 2024',
      time: '8:00 PM'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
      <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
      <div className="space-y-4">
        {appointments.map(appointment => (
          <div key={appointment.id} className="border-b pb-4 last:border-b-0 last:pb-0">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 mt-0.5 text-gray-500 flex-shrink-0" />
              <div>
                <h3 className="font-medium">{appointment.title}</h3>
                <p className="text-gray-600">
                  {appointment.date} - {appointment.time}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}