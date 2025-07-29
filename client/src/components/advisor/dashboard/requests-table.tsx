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
import { Eye, Edit, Trash, UserPlus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Textarea } from '../../ui/textarea';
import { Badge } from "../../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Skeleton } from '../../ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert";
import { AlertCircle, Frown } from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Request {
  _id: string;
  user: User;
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
  advisor?: User;
  notes?: {
    advisorNotes?: string;
  };
}

interface Advisor {
  _id: string;
  name: string;
  email: string;
  specialization?: string;
}

interface RequestsTableProps {
  requests: Request[];
  refetchRequests: () => void;
  advisors: Advisor[];
  isLoading?: boolean;
  isError?: boolean;
}

export function RequestsTable({ 
  requests, 
  refetchRequests, 
  advisors, 
  isLoading = false, 
  isError = false,
}: RequestsTableProps) {
  const formatDate = (dateString: string) => format(new Date(dateString), 'PPp');
  const formatTime = (timeString: string) => format(new Date(`2000-01-01T${timeString}`), 'h:mm a');

  // Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [selectedAdvisor, setSelectedAdvisor] = useState<string>('');
  const [assignmentNotes, setAssignmentNotes] = useState('');

  // API calls
  const { mutate: deleteRequest, isPending: isDeleting } = useHttp<void, { id: string }>({
    url: `/advising/${selectedRequest?._id}`,
    method: 'DELETE',
  });

  const { mutate: assignAdvisor, isPending: isAssigning } = useHttp<
    void,
    { advisorId: string; notes?: string }
  >({
    url: `/advising/${selectedRequest?._id}/assign`,
    method: 'PATCH',
  });

  const handleDelete = async () => {
    if (!selectedRequest) return;
    
    try {
      await deleteRequest(
        { id: selectedRequest._id },
        {
          onSuccess: () => {
            toast.success('Request deleted successfully');
            refetchRequests();
            setDeleteModalOpen(false);
          },
          onError: (error) => {
            toast.error(error.message || 'Failed to delete request');
          }
        }
      );
    } catch (error) {
      toast.error('Failed to delete request');
    }
  };

  const handleAssignAdvisor = async () => {
    if (!selectedRequest || !selectedAdvisor) return;
    
    try {
      await assignAdvisor(
        { 
          advisorId: selectedAdvisor,
          notes: assignmentNotes 
        },
        {
          onSuccess: () => {
            toast.success('Advisor assigned successfully');
            refetchRequests();
            setAssignModalOpen(false);
            setSelectedAdvisor('');
            setAssignmentNotes('');
          },
          onError: (error) => {
            toast.error(error.message || 'Failed to assign advisor');
          }
        }
      );
    } catch (error) {
      toast.error('Failed to assign advisor');
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'warning';
      case 'assigned': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'destructive';
      default: return 'default';
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
        <h3 className="text-xl font-medium mb-2">Failed to load requests</h3>
        <p className="text-muted-foreground mb-4">
          We couldn't load the advising requests. Please check your connection and try again.
        </p>
      </div>
    );
  }

  // Empty state
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Frown className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No advising requests found</h3>
        <p className="text-muted-foreground mb-4">
          There are currently no advising requests to display.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile View */}
      <div className="sm:hidden space-y-4">
        {requests?.map((request) => (
          <Card key={request._id} className="p-4">
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarImage src={request.user.avatar} />
                <AvatarFallback>
                  {request.user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-medium">{request.user.name}</h3>
                  <Badge variant={getStatusVariant(request.status)}>
                    {request.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground capitalize">
                  {request.reason.replace(/-/g, ' ')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(request.createdAt)}
                </p>
                {request.advisor && (
                  <div className="mt-2 flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    <span className="text-sm">
                      {request.advisor.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSelectedRequest(request);
                  setViewModalOpen(true);
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSelectedRequest(request);
                  setSelectedAdvisor(request.advisor?._id || '');
                  setAssignModalOpen(true);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSelectedRequest(request);
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
              <TableHead>Reason</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Preferred Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Advisor</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests?.map((request) => (
              <TableRow key={request._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={request.user.avatar} />
                      <AvatarFallback>
                        {request.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{request.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {request.user.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="capitalize">
                  {request.reason.replace(/-/g, ' ')}
                </TableCell>
                <TableCell>
                  {formatDate(request.createdAt)}
                </TableCell>
                <TableCell>
                  {request.preferredTimeRange ? (
                    `${formatTime(request.preferredTimeRange.start)} - ${formatTime(request.preferredTimeRange.end)}`
                  ) : 'Flexible'}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(request.status)}>
                    {request.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {request.advisor ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={request.advisor.avatar} />
                        <AvatarFallback>
                          {request?.advisor?.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{request.advisor.name}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Not assigned</span>
                  )}
                </TableCell>
                <TableCell className="text-right flex items-center justify-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setSelectedRequest(request);
                      setViewModalOpen(true);
                    }}
                  >
                    <Eye className="w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setSelectedRequest(request);
                      setSelectedAdvisor(request.advisor?._id || '');
                      setAssignModalOpen(true);
                    }}
                  >
                    <Edit className="w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setSelectedRequest(request);
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

      {/* View Request Modal */}
      <RequestDetailsModal 
        isOpen={viewModalOpen} 
        onClose={() => setViewModalOpen(false)}
        request={selectedRequest}
      />

      {/* Assign Advisor Modal */}
      <AssignAdvisorModal
        isOpen={assignModalOpen}
        onClose={() => {
          setAssignModalOpen(false);
          setSelectedAdvisor('');
          setAssignmentNotes('');
        }}
        advisors={advisors}
        selectedAdvisor={selectedAdvisor}
        onAdvisorChange={setSelectedAdvisor}
        notes={assignmentNotes}
        onNotesChange={setAssignmentNotes}
        onSubmit={handleAssignAdvisor}
        isSubmitting={isAssigning}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Deletion"
        message="Are you sure you want to delete this advising request? This action cannot be undone."
        confirmText={isDeleting ? 'Deleting...' : 'Delete Request'}
        onConfirm={handleDelete}
        isConfirming={isDeleting}
        variant="destructive"
      />
    </div>
  );
}

// Extracted Modal Components
function RequestDetailsModal({ isOpen, onClose, request }: {
  isOpen: boolean;
  onClose: () => void;
  request: Request | null;
}) {
  const formatTime = (timeString: string) => 
    format(new Date(`2000-01-01T${timeString}`), 'h:mm a');

  if (!request) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">Request Details</h2>
            <p className="text-sm text-muted-foreground">
              Created on {format(new Date(request.createdAt), 'PPpp')}
            </p>
          </div>
          <Badge variant={
            request.status.toLowerCase() === 'pending' ? 'warning' :
            request.status.toLowerCase() === 'completed' ? 'success' : 'default'
          }>
            {request.status}
          </Badge>
        </div>

        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium">Student Information</h3>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={request.user.avatar} />
                  <AvatarFallback>
                    {request.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p>{request.user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {request.user.email}
                  </p>
                </div>
              </div>
            </div>

            {request.advisor && (
              <div className="space-y-2">
                <h3 className="font-medium">Assigned Advisor</h3>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={request?.advisor?.avatar} />
                    <AvatarFallback>
                      {request?.advisor?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p>{request?.advisor?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {request?.advisor?.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium">Request Details</h3>
              <div className="space-y-1">
                <p className="capitalize">
                  <span className="text-muted-foreground">Reason: </span>
                  {request.reason.replace(/-/g, ' ')}
                </p>
                {request.preferredDays?.length ? (
                  <p>
                    <span className="text-muted-foreground">Preferred Days: </span>
                    {request.preferredDays.join(', ')}
                  </p>
                ) : null}
                {request.preferredTimeRange ? (
                  <p>
                    <span className="text-muted-foreground">Preferred Time: </span>
                    {formatTime(request.preferredTimeRange.start)} - {formatTime(request.preferredTimeRange.end)}
                  </p>
                ) : null}
              </div>
            </div>

            {request.notes?.advisorNotes && (
              <div className="space-y-2">
                <h3 className="font-medium">Advisor Notes</h3>
                <div className="p-3 bg-muted rounded-md">
                  <p className="whitespace-pre-line">
                    {request.notes.advisorNotes}
                  </p>
                </div>
              </div>
            )}
          </div>

          {request.additionalInfo && (
            <div className="space-y-2">
              <h3 className="font-medium">Additional Information</h3>
              <div className="p-3 bg-muted rounded-md">
                <p className="whitespace-pre-line">
                  {request.additionalInfo}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
}

function AssignAdvisorModal({
  isOpen,
  onClose,
  advisors,
  selectedAdvisor,
  onAdvisorChange,
  notes,
  onNotesChange,
  onSubmit,
  isSubmitting,
}: {
  isOpen: boolean;
  onClose: () => void;
  advisors: Advisor[];
  selectedAdvisor: string;
  onAdvisorChange: (value: string) => void;
  notes: string;
  onNotesChange: (value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Assign Advisor</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Advisor
            </label>
            <Select 
              value={selectedAdvisor} 
              onValueChange={onAdvisorChange}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an advisor" />
              </SelectTrigger>
              <SelectContent>
                {advisors.length > 0 ? (
                  advisors.map((advisor) => (
                    <SelectItem key={advisor._id} value={advisor._id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={advisor.avatar} />
                          <AvatarFallback>
                            {advisor.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p>{advisor.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {advisor.email}
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <div className="py-2 px-3 text-sm text-muted-foreground">
                    No advisors available
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Assignment Notes
            </label>
            <Textarea 
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Add any notes for the advisor..."
              rows={4}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={onSubmit}
            disabled={!selectedAdvisor || isSubmitting}
          >
            {isSubmitting ? 'Assigning...' : 'Assign Advisor'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

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