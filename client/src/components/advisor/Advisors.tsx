import { useState } from 'react';
import { Card } from "../ui/card";
import { AdvisorsTable } from "./advisors/advisors-table";
import { useHttp } from "../../api/useHttp";
import { Skeleton } from "../ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle, RefreshCw, UserPlus } from "lucide-react";
import { Button } from "../ui/button";
import { AddAdvisorModal } from "./advisors/addAdvisorModal";

interface Advisor {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  specialization?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export function Advisors() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const { 
    data: advisorsData, 
    isLoading: advisorsLoading, 
    error: advisorsError,
    refetch: refetchAdvisors,
    isRefetching: isRefreshing
  } = useHttp<{ data: Advisor[] }>({
    url: '/users?role=advisor',
  });

  const handleRefresh = () => {
    refetchAdvisors();
  };

  if (advisorsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-[250px]" />
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  if (advisorsError) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Advisors</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading advisors</AlertTitle>
          <AlertDescription>
            {advisorsError.message || "An unknown error occurred while loading advisors"}
          </AlertDescription>
        </Alert>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefreshing}
          isLoading={isRefreshing}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Advisor Management</h1>
          <p className="text-muted-foreground">
            Manage all academic advisors in the system
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            isLoading={isRefreshing}
          >
            Refresh
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Advisor
          </Button>
        </div>
      </div>

      <section>
        <Card>
          <AdvisorsTable 
            advisors={advisorsData?.data ?? []} 
            refetchAdvisors={refetchAdvisors}
          />
        </Card>
      </section>

      <AddAdvisorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={refetchAdvisors}
      />
    </div>
  );
}