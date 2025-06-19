import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { useHttp } from "../../api/useHttp";
import { Loader2, Calendar, User, Info, Clock, X, ChevronDown, ChevronUp } from "lucide-react";

interface AdvisingItem {
  _id: string;
  reason: string;
  additionalInfo?: string;
  preferredDay?: string;
  preferredTime?: string;
  createdAt: string;
  updatedAt: string;
  advisor?: {
    name: string;
    email: string;
  };
  status: "Pending" | "Scheduled" | "Completed" | "Cancelled";
  meetingTime?: string;
  advisorNotes?: string;
}

interface AdvisingResponse {
  data: AdvisingItem[];
  count: number;
  success: boolean;
}

export default function AdvisingPage() {
  const {
    data: response,
    isPending: isLoading,
    isError,
  } = useHttp<AdvisingResponse>({
    url: "/advising/my",
    method: "GET",
  });

  const [selectedRequest, setSelectedRequest] = useState<AdvisingItem | null>(null);
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);
  const requests = response?.data || [];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Pending": return "warning";
      case "Scheduled": return "info";
      case "Completed": return "success";
      case "Cancelled": return "danger";
      default: return "outline";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewDetails = (request: AdvisingItem) => {
    setSelectedRequest(request);
  };

  const closeModal = () => {
    setSelectedRequest(null);
  };

  const toggleExpandRequest = (requestId: string) => {
    setExpandedRequestId(expandedRequestId === requestId ? null : requestId);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <Info className="h-5 w-5" />
          My Advising Requests
        </h1>
        <Link to="/student/request-advising" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">New Request</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-center">
          Failed to load advising requests. Please try again later.
        </div>
      ) : (
        <>
          {/* Desktop Table View (hidden on mobile) */}
          <div className="hidden sm:block border rounded-lg overflow-hidden shadow-sm">
            <div className="relative w-full overflow-auto">
              <table className="w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Request ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Submitted</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Advisor</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {requests.map((request) => (
                    <tr key={request._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 font-medium text-sm">
                        <span className="bg-gray-100 px-2 py-1 rounded text-gray-800">
                          {request._id.substring(18, 24).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {formatDate(request.createdAt)}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {request.advisor?.name || (
                          <span className="text-gray-400">Unassigned</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={getStatusVariant(request.status)}>
                          {request.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(request)}
                          className="hover:bg-gray-100"
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}

                  {requests.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8">
                        <div className="flex flex-col items-center space-y-2 text-gray-500">
                          <Info className="h-8 w-8" />
                          <p>No advising requests found</p>
                          <Link to="/student/request-advising">
                            <Button size="sm" className="mt-2">Create New Request</Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View (hidden on desktop) */}
          <div className="sm:hidden space-y-3">
            {requests.length === 0 ? (
              <div className="border rounded-lg p-6 text-center">
                <div className="flex flex-col items-center space-y-2 text-gray-500">
                  <Info className="h-8 w-8" />
                  <p>No advising requests found</p>
                  <Link to="/student/request-advising">
                    <Button size="sm" className="mt-2">Create New Request</Button>
                  </Link>
                </div>
              </div>
            ) : (
              requests.map((request) => (
                <div key={request._id} className="border rounded-lg overflow-hidden shadow-sm">
                  <div 
                    className="p-4 flex justify-between items-center cursor-pointer"
                    onClick={() => toggleExpandRequest(request._id)}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {request._id.substring(18, 24).toUpperCase()}
                        </span>
                        <Badge variant={getStatusVariant(request.status)}>
                          {request.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatDate(request.createdAt)}
                      </p>
                    </div>
                    {expandedRequestId === request._id ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>

                  {expandedRequestId === request._id && (
                    <div className="p-4 border-t space-y-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Advisor</p>
                        <p className="text-sm">
                          {request.advisor?.name || "Unassigned"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Reason</p>
                        <p className="text-sm">{request.reason}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(request)}
                        className="w-full mt-2"
                      >
                        View Full Details
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Modal for detailed view */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Request Details
                </h2>
                <button 
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-500">Request ID</h3>
                    <p className="text-sm">{selectedRequest._id.substring(18, 24).toUpperCase()}</p>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <Badge variant={getStatusVariant(selectedRequest.status)}>
                      {selectedRequest.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Submitted On
                    </h3>
                    <p className="text-sm">{formatDate(selectedRequest.createdAt)}</p>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <User className="h-4 w-4" />
                      Advisor
                    </h3>
                    <p className="text-sm">
                      {selectedRequest.advisor?.name || "Unassigned"}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium text-gray-500">Reason</h3>
                  <p className="text-sm mt-1">{selectedRequest.reason}</p>
                </div>

                {selectedRequest.additionalInfo && (
                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium text-gray-500">Additional Information</h3>
                    <p className="text-sm mt-1">{selectedRequest.additionalInfo}</p>
                  </div>
                )}

                {selectedRequest.meetingTime && (
                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Scheduled Meeting
                    </h3>
                    <p className="text-sm mt-1">
                      {formatDate(selectedRequest.meetingTime)}
                    </p>
                  </div>
                )}

                {selectedRequest.advisorNotes && (
                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium text-gray-500">Advisor Notes</h3>
                    <p className="text-sm mt-1">{selectedRequest.advisorNotes}</p>
                  </div>
                )}

                <div className="pt-4 border-t flex justify-end">
                  <Button variant="outline" onClick={closeModal}>Close</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}