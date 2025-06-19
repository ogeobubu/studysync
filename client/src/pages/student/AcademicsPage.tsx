import { GraduationCap, BookOpen, ChevronDown, Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

export default function AcademicsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            Academic Summary
          </h1>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">CGPA</p>
              <p className="text-xl font-semibold">3.85</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Standing</p>
              <p className="text-xl font-semibold">Good Standing</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Level</p>
              <p className="text-xl font-semibold">Junior</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Semester</p>
              <p className="text-xl font-semibold">Fall 2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Courses */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Current Courses
        </h2>
        
        {/* Desktop Table */}
        <div className="hidden md:block border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Code</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Title</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Units</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Instructor</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">C5101</td>
                <td className="px-6 py-4">Intro to Computer Science</td>
                <td className="px-6 py-4">3</td>
                <td className="px-6 py-4">Dr. Anderson</td>
                <td className="px-6 py-4">
                  <Badge variant="default">Ongoing</Badge>
                </td>
                <td className="px-6 py-4 text-gray-400">N/A</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">MA202</td>
                <td className="px-6 py-4">Calculus II</td>
                <td className="px-6 py-4">4</td>
                <td className="px-6 py-4">Dr. Bennett</td>
                <td className="px-6 py-4">
                  <Badge variant="default">Ongoing</Badge>
                </td>
                <td className="px-6 py-4 text-gray-400">N/A</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">EN101</td>
                <td className="px-6 py-4">English Composition</td>
                <td className="px-6 py-4">3</td>
                <td className="px-6 py-4">Prof. Clark</td>
                <td className="px-6 py-4">
                  <Badge variant="default">Ongoing</Badge>
                </td>
                <td className="px-6 py-4 text-gray-400">N/A</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          <div className="border rounded-lg p-4">
            <div className="flex justify-between">
              <div>
                <p className="font-medium">C5101 - Intro to Computer Science</p>
                <p className="text-sm text-gray-600">Dr. Anderson</p>
              </div>
              <Badge variant="default">3 Units</Badge>
            </div>
            <div className="mt-3 flex justify-between items-center">
              <Badge variant="default">Ongoing</Badge>
              <span className="text-sm text-gray-400">Grade: N/A</span>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex justify-between">
              <div>
                <p className="font-medium">MA202 - Calculus II</p>
                <p className="text-sm text-gray-600">Dr. Bennett</p>
              </div>
              <Badge variant="default">4 Units</Badge>
            </div>
            <div className="mt-3 flex justify-between items-center">
              <Badge variant="default">Ongoing</Badge>
              <span className="text-sm text-gray-400">Grade: N/A</span>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex justify-between">
              <div>
                <p className="font-medium">EN101 - English Composition</p>
                <p className="text-sm text-gray-600">Prof. Clark</p>
              </div>
              <Badge variant="default">3 Units</Badge>
            </div>
            <div className="mt-3 flex justify-between items-center">
              <Badge variant="default">Ongoing</Badge>
              <span className="text-sm text-gray-400">Grade: N/A</span>
            </div>
          </div>
        </div>
      </div>

      {/* Registration CTA */}
      <div className="fixed bottom-6 right-6 md:static md:flex md:justify-end">
        <Button className="flex items-center gap-1 shadow-lg">
          <Plus className="h-4 w-4" />
          Register Course
        </Button>
      </div>
    </div>
  );
}