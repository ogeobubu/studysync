import { useEffect, useState } from "react";
import { Sparkles, Check, Plus, Info, BookOpen } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";

import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { useHttp } from "../../api/useHttp";
import toast from "react-hot-toast";
import type { Course, UserProfile } from "../../types";

const SESSIONS = ["2022/2023", "2023/2024", "2024/2025"];
const SEMESTERS = ["First", "Second"];

const RecommendationsPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [session, setSession] = useState(SESSIONS[1]);
  const [semester, setSemester] = useState(SEMESTERS[0]);

  const { data: userData } = useHttp<{ data: UserProfile }>({
    url: "/users/me",
    method: "GET",
  });

  const { data: recommendationsData, error: recommendationsError } = useHttp<{
    data: Course[];
  }>({
    url: "/recommendations",
    method: "GET",
  });

  const registerMutation = useHttp({
    url: "/registrations",
    method: "POST",
  });

  useEffect(() => {
    if (userData?.data?._id) {
      setStudentId(userData.data._id);
    }
  }, [userData]);

  useEffect(() => {
    if (recommendationsData) {
      setRecommendations(recommendationsData.data);
      setLoading(false);
    }
    if (recommendationsError) {
      toast.error("Failed to load recommendations");
      setLoading(false);
    }
  }, [recommendationsData, recommendationsError]);

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleRegisterSelected = async () => {
    if (!studentId) {
      toast.error("Student ID is missing");
      return;
    }

    if (selectedCourses.length === 0) {
      toast.error("Please select at least one course");
      return;
    }

    try {
      await Promise.all(
        selectedCourses.map((courseId) =>
          registerMutation.mutateAsync({
            studentId,
            courseId,
            session,
            semester,
          })
        )
      );
      toast.success("Courses registered successfully!");
      setSelectedCourses([]);
    } catch (err) {
      toast.error(err?.response?.data?.data?.error || "Failed to register courses");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading recommendations...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="h-6 w-6" />
          Course Recommendations
        </h1>

        <div className="flex gap-3">
  {/* Session Select */}
  <div className="w-[150px]">
    <Select value={session} onValueChange={setSession}>
      <SelectTrigger>
        <SelectValue placeholder="Select session" />
      </SelectTrigger>
      <SelectContent>
        {SESSIONS.map((s) => (
          <SelectItem key={s} value={s}>
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>

  {/* Semester Select */}
  <div className="w-[150px]">
    <Select value={semester} onValueChange={setSemester}>
      <SelectTrigger>
        <SelectValue placeholder="Select semester" />
      </SelectTrigger>
      <SelectContent>
        {SEMESTERS.map((s) => (
          <SelectItem key={s} value={s}>
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
</div>

      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <AlertTitle>How These Recommendations Work</AlertTitle>
        <AlertDescription className="text-blue-700">
          Our system suggests courses based on your academic progress, completed
          prerequisites, and program requirements. Selected courses are
          highlighted in blue. You can register for multiple recommendations at
          once using the button at the bottom right.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.length > 0 ? (
          recommendations.map((course) => (
            <Card
              key={course._id}
              className={`transition-all hover:shadow-md ${
                selectedCourses.includes(course._id)
                  ? "border-blue-500 ring-2 ring-blue-200 bg-blue-50"
                  : ""
              }`}
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span className="text-lg">
                    {course.code} - {course.title}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSelectCourse(course._id)}
                    className="hover:bg-blue-100"
                  >
                    {selectedCourses.includes(course._id) ? (
                      <Check className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Plus className="h-5 w-5" />
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">{course.description}</p>

                  <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    <span className="text-sm font-medium">
                      {course.credits} Credits
                    </span>
                    <span className="text-sm text-gray-500">
                      {course.semester} Semester
                    </span>
                  </div>

                  {course.prerequisites?.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Prerequisites:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {course.prerequisites.map((prereq, i) => (
                          <span
                            key={i}
                            className="text-xs bg-gray-100 px-2 py-1 rounded"
                          >
                            {prereq}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No recommendations available
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              We couldn't find any courses to recommend based on your progress.
              This may be because you've completed all available courses or
              haven't met prerequisites for remaining courses.
            </p>
          </div>
        )}
      </div>

      {recommendations.length > 0 && (
        <div className="fixed bottom-6 right-6">
          <Button
            onClick={handleRegisterSelected}
            disabled={
              registerMutation.isPending || selectedCourses.length === 0
            }
            className="shadow-lg flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Sparkles className="h-4 w-4" />
            Register Selected ({selectedCourses.length})
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;
