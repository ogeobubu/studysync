import { Card } from "../ui/card";
import { StatsCard } from "./dashboard/stats-card";
import { SectionHeader } from "./dashboard/section-header";
import { RequestsTable } from "./dashboard/requests-table";
import { Divider } from "./dashboard/divider";
import { useHttp } from "../../api/useHttp";
import { Skeleton } from "../ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";

interface StatsData {
  totalAdvisors: number;
  totalStudents: number;
  pendingRequests: number;
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
  // Fetch system overview data
  const { 
    data: statsData, 
    isLoading: statsLoading, 
    error: statsError,
    refetch: refetchStats
  } = useHttp<{ data: StatsData }>({
    url: '/users/analytics/overview',
  });

  // Fetch pending requests data
  const { 
    data: requestsData, 
    isLoading: requestsLoading, 
    error: requestsError,
    refetch: refetchRequests
  } = useHttp<{ data: Request[] }>({
    url: '/advising/pending',
  });

  // Fetch advisors data
  const { 
    data: advisorsData, 
    isLoading: advisorsLoading, 
    error: advisorsError,
    refetch: refetchAdvisors
  } = useHttp<{ data: Advisor[] }>({
    url: '/users?role=advisor',
  });

  const handleRetry = () => {
    if (statsError) refetchStats();
    if (requestsError) refetchRequests();
    if (advisorsError) refetchAdvisors();
  };

  const isLoading = statsLoading || requestsLoading || advisorsLoading;
  const isError = statsError || requestsError || advisorsError;
  const isRefreshing = [refetchStats, refetchRequests, refetchAdvisors].some(
    fn => fn.status === 'loading'
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-[200px]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
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
      advisorsError?.message
    ].filter(Boolean);

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
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
        <Button
          variant="outline"
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
      
      {/* System Overview Section */}
      <section>
        <SectionHeader title="System Overview" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard 
            title="Total Advisors" 
            value={statsData?.data.totalAdvisors ?? 0}
            icon="advisor"
          />
          <StatsCard 
            title="Total Students" 
            value={statsData?.data.totalStudents ?? 0}
            icon="student"
          />
          <StatsCard 
            title="Pending Requests" 
            value={statsData?.data.pendingRequests ?? 0}
            icon="request"
          />
        </div>
      </section>

      <Divider />

      {/* Pending Advising Requests Section */}
      <section>
        <SectionHeader title="Pending Advising Requests" />
        <Card>
          <RequestsTable 
            requests={requestsData?.data ?? []} 
            refetchRequests={refetchRequests}
            advisors={advisorsData?.data ?? []}
            isLoading={requestsLoading}
            isError={!!requestsError}
          />
        </Card>
      </section>
    </div>
  );
}