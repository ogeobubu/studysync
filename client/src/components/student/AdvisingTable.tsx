import type { AdvisingRequest } from './types'
import AdvisingRow from './AdvisingRow'
import { Button } from '../ui/button'
import { ArrowUpDown } from 'lucide-react'

interface Props {
  requests: AdvisingRequest[]
}

export default function AdvisingTable({ requests }: Props) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="border-b">
            <tr className="hover:bg-gray-50">
              {['Request ID', 'Submission Date', 'Advisor', 'Status', 'Details'].map((heading, idx) => (
                <th
                  key={idx}
                  className={`h-12 px-4 text-left align-middle font-medium text-gray-500 ${
                    heading === 'Details' ? 'text-right' : ''
                  }`}
                >
                  {['Request ID', 'Submission Date'].includes(heading) ? (
                    <Button variant="ghost" className="p-0">
                      {heading}
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    heading
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {requests.map((request) => (
              <AdvisingRow key={request.id} request={request} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
