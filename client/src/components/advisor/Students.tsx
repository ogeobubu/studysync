import { useState } from 'react';
import { Card } from "../ui/card";
import { StudentsTable } from "./students/table";
import { useHttp } from "../../api/useHttp";
import { Skeleton } from "../ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle, RefreshCw, UserPlus } from "lucide-react";
import { Button } from "../ui/button";
import { AddStudentModal } from "./students/addModal";

interface Student {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  matricNumber: string;
  program: string;
  level: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export function Students() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const { 
    data: studentsData, 
    isLoading: studentsLoading, 
    error: studentsError,
    refetch: refetchStudents,
    isRefetching: isRefreshing
  } = useHttp<{ data: Student[] }>({
    url: '/users?role=student',
  });

  const handleRefresh = () => {
    refetchStudents();
  };

  if (studentsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-[250px]" />
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  if (studentsError) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Students</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading students</AlertTitle>
          <AlertDescription>
            {studentsError.message || "An unknown error occurred while loading students"}
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
          <h1 className="text-3xl font-bold">Student Management</h1>
          <p className="text-muted-foreground">
            Manage all registered students in the system
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
            Add Student
          </Button>
        </div>
      </div>

      <section>
        <Card>
          <StudentsTable 
            students={studentsData?.data ?? []} 
            refetchStudents={refetchStudents}
          />
        </Card>
      </section>

      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={refetchStudents}
      />
    </div>
  );
}