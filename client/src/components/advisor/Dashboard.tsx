import { Card } from "../ui/card";
import { StatsCard } from "./dashboard/stats-card";
import { SectionHeader } from "./dashboard/section-header";
import { RequestsTable } from "./dashboard/requests-table";
import { Divider } from "./dashboard/divider";
import { useHttp } from "../../api/useHttp";
import { Skeleton } from "../ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle, RefreshCw, User, Users, Clock, Calendar, BookOpen } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "../../context/AuthContext";

interface StatsData {
  totalAdvisors: number;
  totalStudents: number;
  pendingRequests: number;
  upcomingSessions?: number;
  recentCompleted?: number;
  assignedStudents?: number;
  commonTopics?: { topic: string; count: number }[];
}

interface Advisor {
  _id: string;
  name: string;
  email: string;
}

interface Request {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  reason: string;
  additionalInfo?: string;
  preferredDays?: string[];
  preferredTimeRange?: {
    start: string;
    end: string;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
  advisor?: Advisor;
}

export function DashboardContent() {
  const { user } = useAuth();
  const isAdvisor = user?.role === 'advisor';
  
  // Fetch system overview data
  const { 
    data: statsData, 
    isLoading: statsLoading, 
    error: statsError,
    refetch: refetchStats
  } = useHttp<{ data: StatsData }>({
    url: isAdvisor ? '/users/analytics/advisor' : '/users/analytics/overview',
  });

  // Fetch pending requests data
  const { 
    data: requestsData, 
    isLoading: requestsLoading, 
    error: requestsError,
    refetch: refetchRequests
  } = useHttp<{ data: Request[] }>({
    url: isAdvisor ? '/advising/advisor/my-pending' : '/advising/pending',
  });

  // Fetch advisors data (only for admin)
  const { 
    data: advisorsData, 
    isLoading: advisorsLoading, 
    error: advisorsError,
    refetch: refetchAdvisors
  } = useHttp<{ data: Advisor[] }>({
    url: '/users?role=advisor',
    skip: isAdvisor // Skip this request if user is advisor
  });

  const handleRetry = () => {
    refetchStats();
    refetchRequests();
    if (!isAdvisor) refetchAdvisors();
  };

  const isLoading = statsLoading || requestsLoading || (!isAdvisor && advisorsLoading);
  const isError = statsError || requestsError || (!isAdvisor && advisorsError);
  const isRefreshing = [refetchStats, refetchRequests, refetchAdvisors].some(
    fn => fn.status === 'loading'
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-[200px]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(isAdvisor ? 4 : 3)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  if (isError) {
    const errorMessages = [
      statsError?.message,
      requestsError?.message,
      !isAdvisor && advisorsError?.message
    ].filter(Boolean);

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRetry}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Retry
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading dashboard data</AlertTitle>
          <AlertDescription>
            {errorMessages.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {errorMessages.map((msg, i) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
            ) : (
              "An unknown error occurred"
            )}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRetry}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>
      
      {/* Overview Section */}
      <section>
        <SectionHeader title={isAdvisor ? "Your Advisor Overview" : "System Overview"} />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isAdvisor ? (
            <>
              <StatsCard 
                title="Assigned Students" 
                value={statsData?.data.assignedStudents ?? 0}
                icon={<Users className="h-5 w-5" />}
              />
              <StatsCard 
                title="Upcoming Sessions" 
                value={statsData?.data.upcomingSessions ?? 0}
                icon={<Calendar className="h-5 w-5" />}
              />
              <StatsCard 
                title="Recent Completed" 
                value={statsData?.data.recentCompleted ?? 0}
                icon={<Clock className="h-5 w-5" />}
              />
              <StatsCard 
                title="Pending Requests" 
                value={statsData?.data.pendingRequests ?? 0}
                icon={<BookOpen className="h-5 w-5" />}
              />
            </>
          ) : (
            <>
              <StatsCard 
                title="Total Advisors" 
                value={statsData?.data.totalAdvisors ?? 0}
                icon={<User className="h-5 w-5" />}
              />
              <StatsCard 
                title="Total Students" 
                value={statsData?.data.totalStudents ?? 0}
                icon={<Users className="h-5 w-5" />}
              />
              <StatsCard 
                title="Pending Requests" 
                value={statsData?.data.pendingRequests ?? 0}
                icon={<BookOpen className="h-5 w-5" />}
              />
            </>
          )}
        </div>
      </section>

      {isAdvisor && statsData?.data.commonTopics && (
        <>
          <Divider />
          <section>
            <SectionHeader title="Common Topics" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {statsData.data.commonTopics.map((topic) => (
                <Card key={topic.topic} className="p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{topic.topic}</h3>
                    <span className="text-sm text-muted-foreground">
                      {topic.count} {topic.count === 1 ? 'request' : 'requests'}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </>
      )}

      <Divider />

      {/* Requests Section */}
      <section>
        <SectionHeader 
          title={isAdvisor ? "Your Pending Requests" : "Pending Advising Requests"} 
        />
        <Card>
          <RequestsTable 
            requests={requestsData?.data ?? []} 
            refetchRequests={refetchRequests}
            advisors={advisorsData?.data ?? []}
            isLoading={requestsLoading}
            isError={!!requestsError}
            isAdvisor={isAdvisor}
          />
        </Card>
      </section>
    </div>
  );
}