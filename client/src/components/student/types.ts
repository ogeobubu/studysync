export interface AdvisingRequest {
  id: string
  submissionDate: string
  advisor: string
  status: 'Pending' | 'Scheduled' | 'Completed'
}
