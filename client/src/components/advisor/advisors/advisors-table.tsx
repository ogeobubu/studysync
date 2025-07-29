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

interface AdvisorsTableProps {
  advisors: Advisor[];
  refetchAdvisors: () => void;
  isLoading?: boolean;
  isError?: boolean;
}

export function AdvisorsTable({ 
  advisors, 
  refetchAdvisors, 
  isLoading = false, 
  isError = false,
}: AdvisorsTableProps) {
  const formatDate = (dateString: string) => format(new Date(dateString), 'PPp');

  // Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);

  // API calls
  const { mutate: deleteAdvisor, isPending: isDeleting } = useHttp<void, { id: string }>({
    url: `/users/${selectedAdvisor?._id}`,
    method: 'DELETE',
  });

  const { mutate: toggleAdvisorStatus, isPending: isTogglingStatus } = useHttp<
    void,
    { active: boolean }
  >({
    url: `/users/${selectedAdvisor?._id}/${selectedAdvisor?.active ? 'deactivate' : 'reactivate'}`,
    method: 'PUT',
  });

  const handleDelete = async () => {
    if (!selectedAdvisor) return;
    
    try {
      await deleteAdvisor(
        { id: selectedAdvisor._id },
        {
          onSuccess: () => {
            toast.success('Advisor deleted successfully');
            refetchAdvisors();
            setDeleteModalOpen(false);
          },
          onError: (error) => {
            toast.error(error.message || 'Failed to delete advisor');
          }
        }
      );
    } catch (error) {
      toast.error('Failed to delete advisor');
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedAdvisor) return;
    
    try {
      await toggleAdvisorStatus(
        { active: !selectedAdvisor.active },
        {
          onSuccess: () => {
            toast.success(`Advisor ${selectedAdvisor.active ? 'blocked' : 'activated'} successfully`);
            refetchAdvisors();
            setBlockModalOpen(false);
          },
          onError: (error) => {
            toast.error(error.message || `Failed to ${selectedAdvisor.active ? 'block' : 'activate'} advisor`);
          }
        }
      );
    } catch (error) {
      toast.error(`Failed to ${selectedAdvisor?.active ? 'block' : 'activate'} advisor`);
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
        <h3 className="text-xl font-medium mb-2">Failed to load advisors</h3>
        <p className="text-muted-foreground mb-4">
          We couldn't load the advisors. Please check your connection and try again.
        </p>
      </div>
    );
  }

  // Empty state
  if (advisors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Frown className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No advisors found</h3>
        <p className="text-muted-foreground mb-4">
          There are currently no advisors to display.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile View */}
      <div className="sm:hidden space-y-4">
        {advisors.map((advisor) => (
          <Card key={advisor._id} className="p-4">
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarImage src={advisor.avatar} />
                <AvatarFallback>
                  {advisor.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-medium">{advisor.name}</h3>
                  <Badge variant={advisor.active ? 'success' : 'destructive'}>
                    {advisor.active ? 'Active' : 'Blocked'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {advisor.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  {advisor.specialization || 'No specialization'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Joined {formatDate(advisor.createdAt)}
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSelectedAdvisor(advisor);
                  setViewModalOpen(true);
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSelectedAdvisor(advisor);
                  setBlockModalOpen(true);
                }}
              >
                {advisor.active ? (
                  <Lock className="h-4 w-4 text-warning" />
                ) : (
                  <Unlock className="h-4 w-4 text-success" />
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSelectedAdvisor(advisor);
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
              <TableHead>Advisor</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {advisors.map((advisor) => (
              <TableRow key={advisor._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={advisor.avatar} />
                      <AvatarFallback>
                        {advisor.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{advisor.name}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-muted-foreground">
                    {advisor.email}
                  </p>
                </TableCell>
                <TableCell>
                  {advisor.specialization || 'None'}
                </TableCell>
                <TableCell>
                  {formatDate(advisor.createdAt)}
                </TableCell>
                <TableCell>
                  <Badge variant={advisor.active ? 'success' : 'destructive'}>
                    {advisor.active ? 'Active' : 'Blocked'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right flex items-center justify-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setSelectedAdvisor(advisor);
                      setViewModalOpen(true);
                    }}
                  >
                    <Eye className="w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setSelectedAdvisor(advisor);
                      setBlockModalOpen(true);
                    }}
                  >
                    {advisor.active ? (
                      <Lock className="w-4 text-warning" />
                    ) : (
                      <Unlock className="w-4 text-success" />
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setSelectedAdvisor(advisor);
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

      {/* View Advisor Modal */}
      <AdvisorDetailsModal 
        isOpen={viewModalOpen} 
        onClose={() => setViewModalOpen(false)}
        advisor={selectedAdvisor}
      />

      {/* Block/Unblock Confirmation Modal */}
      <ConfirmationModal
        isOpen={blockModalOpen}
        onClose={() => setBlockModalOpen(false)}
        title={`${selectedAdvisor?.active ? 'Block' : 'Activate'} Advisor`}
        message={`Are you sure you want to ${selectedAdvisor?.active ? 'block' : 'activate'} ${selectedAdvisor?.name}? ${selectedAdvisor?.active ? 'They will no longer be able to access the system.' : 'They will regain access to the system.'}`}
        confirmText={isTogglingStatus ? 'Processing...' : selectedAdvisor?.active ? 'Block Advisor' : 'Activate Advisor'}
        onConfirm={handleToggleStatus}
        isConfirming={isTogglingStatus}
        variant={selectedAdvisor?.active ? 'destructive' : 'default'}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Deletion"
        message={`Are you sure you want to delete ${selectedAdvisor?.name}? This action cannot be undone and will permanently remove their account.`}
        confirmText={isDeleting ? 'Deleting...' : 'Delete Advisor'}
        onConfirm={handleDelete}
        isConfirming={isDeleting}
        variant="destructive"
      />
    </div>
  );
}

// Advisor Details Modal Component
function AdvisorDetailsModal({ isOpen, onClose, advisor }: {
  isOpen: boolean;
  onClose: () => void;
  advisor: Advisor | null;
}) {
  if (!advisor) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">Advisor Details</h2>
            <p className="text-sm text-muted-foreground">
              Joined on {format(new Date(advisor.createdAt), 'PPpp')}
            </p>
          </div>
          <Badge variant={advisor.active ? 'success' : 'destructive'}>
            {advisor.active ? 'Active' : 'Blocked'}
          </Badge>
        </div>

        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium">Basic Information</h3>
              <div className="flex items-center gap-3">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={advisor.avatar} />
                  <AvatarFallback>
                    {advisor.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-medium">{advisor.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {advisor.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Specialization</h3>
              <div className="p-3 bg-muted rounded-md">
                <p className="text-muted-foreground">
                  {advisor.specialization || 'No specialization provided'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium">Account Status</h3>
              <div className="p-3 bg-muted rounded-md">
                <div className="flex items-center gap-2">
                  {advisor.active ? (
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
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Account Created</h3>
              <div className="p-3 bg-muted rounded-md">
                <p>{format(new Date(advisor.createdAt), 'PPpp')}</p>
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