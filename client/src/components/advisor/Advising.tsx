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

interface Advisor {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Request {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
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
  notes?: {
    advisorNotes?: string;
  };
}

export function Advising() {
  // Fetch pending requests data
  const { 
    data: requestsData, 
    isLoading: requestsLoading, 
    error: requestsError,
    refetch: refetchRequests,
    isRefetching: isRefreshingRequests
  } = useHttp<{ data: Request[] }>({
    url: '/advising',
  });

  // Fetch advisors data
  const { 
    data: advisorsData, 
    isLoading: advisorsLoading, 
    error: advisorsError,
    refetch: refetchAdvisors,
    isRefetching: isRefreshingAdvisors
  } = useHttp<{ data: Advisor[] }>({
    url: '/users?role=advisor',
  });

  const handleRefresh = () => {
    refetchRequests();
    refetchAdvisors();
  };

  const isLoading = requestsLoading || advisorsLoading;
  const isError = requestsError || advisorsError;
  const isRefreshing = isRefreshingRequests || isRefreshingAdvisors;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-[250px]" />
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  if (isError) {
    const errorMessages = [
      requestsError?.message,
      advisorsError?.message
    ].filter(Boolean);

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Advising Requests</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading advising data</AlertTitle>
          <AlertDescription>
            {errorMessages.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {errorMessages.map((msg, i) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
            ) : (
              "An unknown error occurred while loading advising requests"
            )}
          </AlertDescription>
        </Alert>
        <Button
          variant="outline"
          onClick={handleRefresh}
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
        <h1 className="text-3xl font-bold">Advising Requests</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
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

      {/* Advising Requests Section */}
      <section>
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