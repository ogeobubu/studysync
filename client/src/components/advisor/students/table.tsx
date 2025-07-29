import React, { useState } from 'react';
import { Card } from "../../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Button } from "../../ui/button";
import { format } from "date-fns";
import { useHttp } from '../../../api/useHttp';
import { Modal } from '../../ui/modal';
import { Eye, Edit, Trash, User, Lock, Unlock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Badge } from "../../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Skeleton } from '../../ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle, Frown } from "lucide-react";

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

interface StudentsTableProps {
  students: Student[];
  refetchStudents: () => void;
  isLoading?: boolean;
  isError?: boolean;
}

export function StudentsTable({ 
  students, 
  refetchStudents, 
  isLoading = false, 
  isError = false,
}: StudentsTableProps) {
  const formatDate = (dateString: string) => format(new Date(dateString), 'PPp');

  // Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // API calls
  const { mutate: deleteStudent, isPending: isDeleting } = useHttp<void, { id: string }>({
    url: `/users/${selectedStudent?._id}`,
    method: 'DELETE',
  });

  const { mutate: toggleStudentStatus, isPending: isTogglingStatus } = useHttp<
    void,
    { active: boolean }
  >({
    url: `/users/${selectedStudent?._id}/${selectedStudent?.active ? 'deactivate' : 'reactivate'}`,
    method: 'PUT',
  });

  const handleDelete = async () => {
    if (!selectedStudent) return;
    
    try {
      await deleteStudent(
        { id: selectedStudent._id },
        {
          onSuccess: () => {
            toast.success('Student deleted successfully');
            refetchStudents();
            setDeleteModalOpen(false);
          },
          onError: (error) => {
            toast.error(error.message || 'Failed to delete student');
          }
        }
      );
    } catch (error) {
      toast.error('Failed to delete student');
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedStudent) return;
    
    try {
      await toggleStudentStatus(
        { active: !selectedStudent.active },
        {
          onSuccess: () => {
            toast.success(`Student ${selectedStudent.active ? 'blocked' : 'activated'} successfully`);
            refetchStudents();
            setBlockModalOpen(false);
          },
          onError: (error) => {
            toast.error(error.message || `Failed to ${selectedStudent.active ? 'block' : 'activate'} student`);
          }
        }
      );
    } catch (error) {
      toast.error(`Failed to ${selectedStudent?.active ? 'block' : 'activate'} student`);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
              <Skeleton className="h-10 w-10" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-xl font-medium mb-2">Failed to load students</h3>
        <p className="text-muted-foreground mb-4">
          We couldn't load the students. Please check your connection and try again.
        </p>
      </div>
    );
  }

  // Empty state
  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Frown className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No students found</h3>
        <p className="text-muted-foreground mb-4">
          There are currently no students to display.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile View */}
      <div className="sm:hidden space-y-4">
        {students.map((student) => (
          <Card key={student._id} className="p-4">
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarImage src={student.avatar} />
                <AvatarFallback>
                  {student.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-medium">{student.name}</h3>
                  <Badge variant={student.active ? 'success' : 'destructive'}>
                    {student.active ? 'Active' : 'Blocked'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {student.matricNumber}
                </p>
                <p className="text-sm text-muted-foreground">
                  {student.program} - {student.level}
                </p>
                <p className="text-sm text-muted-foreground">
                  Joined {formatDate(student.createdAt)}
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSelectedStudent(student);
                  setViewModalOpen(true);
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSelectedStudent(student);
                  setBlockModalOpen(true);
                }}
              >
                {student.active ? (
                  <Lock className="h-4 w-4 text-warning" />
                ) : (
                  <Unlock className="h-4 w-4 text-success" />
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSelectedStudent(student);
                  setDeleteModalOpen(true);
                }}
              >
                <Trash className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Matric Number</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={student.avatar} />
                      <AvatarFallback>
                        {student.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {student.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {student.matricNumber}
                </TableCell>
                <TableCell>
                  {student.program}
                </TableCell>
                <TableCell>
                  {student.level}
                </TableCell>
                <TableCell>
                  {formatDate(student.createdAt)}
                </TableCell>
                <TableCell>
                  <Badge variant={student.active ? 'success' : 'destructive'}>
                    {student.active ? 'Active' : 'Blocked'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right flex items-center justify-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setSelectedStudent(student);
                      setViewModalOpen(true);
                    }}
                  >
                    <Eye className="w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setSelectedStudent(student);
                      setBlockModalOpen(true);
                    }}
                  >
                    {student.active ? (
                      <Lock className="w-4 text-warning" />
                    ) : (
                      <Unlock className="w-4 text-success" />
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setSelectedStudent(student);
                      setDeleteModalOpen(true);
                    }}
                  >
                    <Trash className="w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* View Student Modal */}
      <StudentDetailsModal 
        isOpen={viewModalOpen} 
        onClose={() => setViewModalOpen(false)}
        student={selectedStudent}
      />

      {/* Block/Unblock Confirmation Modal */}
      <ConfirmationModal
        isOpen={blockModalOpen}
        onClose={() => setBlockModalOpen(false)}
        title={`${selectedStudent?.active ? 'Block' : 'Activate'} Student`}
        message={`Are you sure you want to ${selectedStudent?.active ? 'block' : 'activate'} ${selectedStudent?.name}? ${selectedStudent?.active ? 'They will no longer be able to access the system.' : 'They will regain access to the system.'}`}
        confirmText={isTogglingStatus ? 'Processing...' : selectedStudent?.active ? 'Block Student' : 'Activate Student'}
        onConfirm={handleToggleStatus}
        isConfirming={isTogglingStatus}
        variant={selectedStudent?.active ? 'destructive' : 'default'}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Deletion"
        message={`Are you sure you want to delete ${selectedStudent?.name}? This action cannot be undone and will permanently remove their account.`}
        confirmText={isDeleting ? 'Deleting...' : 'Delete Student'}
        onConfirm={handleDelete}
        isConfirming={isDeleting}
        variant="destructive"
      />
    </div>
  );
}

// Student Details Modal Component
function StudentDetailsModal({ isOpen, onClose, student }: {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
}) {
  if (!student) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">Student Details</h2>
            <p className="text-sm text-muted-foreground">
              Joined on {format(new Date(student.createdAt), 'PPpp')}
            </p>
          </div>
          <Badge variant={student.active ? 'success' : 'destructive'}>
            {student.active ? 'Active' : 'Blocked'}
          </Badge>
        </div>

        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium">Basic Information</h3>
              <div className="flex items-center gap-3">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={student.avatar} />
                  <AvatarFallback>
                    {student.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-medium">{student.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {student.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Academic Information</h3>
              <div className="p-3 bg-muted rounded-md space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Matric Number</p>
                  <p>{student.matricNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Program</p>
                  <p>{student.program}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Level</p>
                  <p>{student.level}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium">Account Status</h3>
              <div className="p-3 bg-muted rounded-md">
                <div className="flex items-center gap-2">
                  {student.active ? (
                    <>
                      <div className="h-2 w-2 rounded-full bg-success" />
                      <span>Active</span>
                    </>
                  ) : (
                    <>
                      <div className="h-2 w-2 rounded-full bg-destructive" />
                      <span>Blocked</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Last updated: {format(new Date(student.updatedAt), 'PPpp')}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Account Created</h3>
              <div className="p-3 bg-muted rounded-md">
                <p>{format(new Date(student.createdAt), 'PPpp')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
}

// Confirmation Modal Component
function ConfirmationModal({
  isOpen,
  onClose,
  title,
  message,
  confirmText,
  onConfirm,
  isConfirming,
  variant = 'default'
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmText: string;
  onConfirm: () => void;
  isConfirming: boolean;
  variant?: 'default' | 'destructive';
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6">
        <h2 className="text-xl font-bold">{title}</h2>
        <p>{message}</p>
        <div className="flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isConfirming}
          >
            Cancel
          </Button>
          <Button 
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={onConfirm}
            disabled={isConfirming}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}