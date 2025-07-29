import { Calendar } from 'lucide-react';
import { useHttp } from '../../api/useHttp';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle, Frown } from 'lucide-react';

interface Appointment {
  appointment: any;
  _id: string;
  title?: string;
  date?: string;
  time?: string; // This comes in 24-hour format (e.g., "15:10")
  status: string;
  advisor?: {
    name: string;
    email: string;
  };
  formattedMeetingDate?: string | null;
  isUpcoming?: boolean;
}

export default function UpcomingAppointments() {
  const { 
    data: appointmentsData, 
    isLoading, 
    isError
  } = useHttp<{ 
    success: boolean; 
    count: number; 
    data: Appointment[] 
  }>({
    url: '/advising/my',
    method: 'GET'
  });

  // Filter only scheduled and upcoming appointments
  const upcomingAppointments = appointmentsData?.data?.filter(
    appt => appt.status === 'Scheduled' && appt.isUpcoming
  ) || [];

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="border-b pb-4 last:border-b-0 last:pb-0">
              <div className="flex items-start gap-3">
                <Skeleton className="w-5 h-5 mt-0.5 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load appointments. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Empty state
  if (upcomingAppointments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
        <div className="flex flex-col items-center justify-center py-4 text-center">
          <Frown className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">
            You don't have any upcoming appointments.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
      <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
      <div className="space-y-4">
        {upcomingAppointments.map(appointment => (
          <div key={appointment._id} className="border-b pb-4 last:border-b-0 last:pb-0">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 mt-0.5 text-gray-500 flex-shrink-0" />
              <div>
                <h3 className="font-medium">
                  {appointment.appointment?.title || 'Advising Session'}
                </h3>
                {appointment.formattedMeetingDate ? (
                  <p className="text-gray-600">
                    {appointment.formattedMeetingDate}
                  </p>
                ) : (
                  <p className="text-gray-600">
                    {appointment.appointment?.date && formatDate(appointment.appointment.date)} at{' '}
                    {appointment.appointment?.time && formatTimeFrom24Hour(appointment.appointment.time)}
                  </p>
                )}
                {appointment.advisor && (
                  <p className="text-sm text-gray-500 mt-1">
                    With: {appointment.advisor.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper function to format 24-hour time to 12-hour format with AM/PM
function formatTimeFrom24Hour(time24: string): string {
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${period}`;
}

// Helper function to format date
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}