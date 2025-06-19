import { useEffect, useState } from "react";
import {
  GraduationCap,
  BookOpen,
  Plus,
  X,
  Save,
  Bookmark,
  Award,
  Clock,
  Calendar,
  Layers,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Progress } from "../../components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useHttp } from "../../api/useHttp";
import toast from "react-hot-toast";
import type { UserProfile, Course } from "../../types";

interface Registration {
  _id: string;
  courseId: Course;
  score?: number;
  grade?: string;
  gradePoint?: number;
  session: string;
  semester: string;
}

const AcademicsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [session, setSession] = useState("");
  const [semester, setSemester] = useState("First");
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [grades, setGrades] = useState<{ [key: string]: string }>({});
  const [studentId, setStudentId] = useState("");
  const [currentRegistrationId, setCurrentRegistrationId] = useState<
    string | null
  >(null);

  // Fetch current user
  const { data: userData } = useHttp<{ data: UserProfile }>({
    url: "/users/me",
    method: "GET",
  });

  // Fetch registrations
  const { data: registrationsData, refetch: refetchRegistrations } = useHttp<{
    data: Registration[];
  }>({
    url: studentId ? `/registrations/student/${studentId}` : null,
    method: "GET",
  });

  // Fetch available courses
  const { data: coursesData, refetch: refetchCourses } = useHttp<{
    data: Course[];
  }>({
    url: user?.program ? `/courses/programs/${user.program}` : null,
    method: "GET",
  });

  // Course registration mutation
  const registerMutation = useHttp({
    url: "/registrations",
    method: "POST",
    options: {
      onSuccess: () => {
        toast.success("Course registered successfully!");
        setIsModalOpen(false);
        refetchRegistrations?.();
      },
      onError: () => {
        toast.error("Failed to register course");
      },
    },
  });

  // Grade update mutation
  const updateGradeMutation = useHttp<
    unknown,
    { score: number; semester: string; session: string }
  >({
    url: currentRegistrationId
      ? `/registrations/${currentRegistrationId}/grade`
      : "",
    method: "PUT",
    options: {
      onSuccess: () => {
        toast.success("Grade updated successfully!");
        setCurrentRegistrationId(null);
        refetchRegistrations?.();
      },
      onError: () => {
        toast.error("Failed to update grade");
        setCurrentRegistrationId(null);
      },
    },
  });

  // Effects
  useEffect(() => {
    if (userData?.data) {
      setUser(userData.data);
      setStudentId(userData.data._id);
    }
  }, [userData]);

  useEffect(() => {
    if (coursesData?.data) setAllCourses(coursesData.data);
  }, [coursesData]);

  useEffect(() => {
    if (registrationsData?.data) {
      setRegistrations(registrationsData.data);
      const initialGrades = registrationsData.data.reduce((acc, reg) => {
        if (reg.score !== undefined) {
          acc[reg._id] = reg.score.toString();
        }
        return acc;
      }, {} as { [key: string]: string });
      setGrades(initialGrades);
    }
  }, [registrationsData]);

  // Handlers
  const handleRegisterCourse = () => {
    registerMutation.mutate({
      studentId,
      courseId: selectedCourseId,
      session,
      semester,
    });
  };

  const handleGradeChange = (regId: string, value: string) => {
    setGrades((prev) => ({ ...prev, [regId]: value }));
  };

  const handleSaveGrades = (regId: string) => {
    const scoreInput = grades[regId];
    if (!scoreInput) return toast.error("Please enter a score");

    const score = parseFloat(scoreInput);
    if (isNaN(score)) return toast.error("Please enter a valid number");
    if (score < 0 || score > 100)
      return toast.error("Score must be between 0-100");

    const reg = registrations.find((r) => r._id === regId);
    if (!reg) return toast.error("Registration not found");

    setCurrentRegistrationId(regId);
    updateGradeMutation.mutate({
      score,
      semester: reg.courseId.semester,
      session: reg.session,
    });
  };

  // Calculate academic metrics
  const calculateMetrics = () => {
    const gradedCourses = registrations.filter(
      (r) => r.gradePoint !== undefined
    );
    const currentSemesterCourses = registrations.filter(
      (r) => r.semester === semester && r.session === session
    );

    // CGPA calculation
    const totalPoints = gradedCourses.reduce(
      (sum, reg) => sum + reg.gradePoint! * reg.courseId.credits,
      0
    );
    const totalCredits = gradedCourses.reduce(
      (sum, reg) => sum + reg.courseId.credits,
      0
    );
    const cgpa =
  totalCredits > 0
    ? (Math.round((totalPoints / totalCredits) * 100) / 100).toFixed(2)
    : null;


    // Current semester GPA
    const semesterCourses = gradedCourses.filter(
      (r) => r.semester === semester && r.session === session
    );
    const semesterPoints = semesterCourses.reduce(
      (sum, reg) => sum + reg.gradePoint! * reg.courseId.credits,
      0
    );
    const semesterCredits = semesterCourses.reduce(
      (sum, reg) => sum + reg.courseId.credits,
      0
    );
    const semesterGpa =
  semesterCredits > 0
    ? (Math.round((semesterPoints / semesterCredits) * 100) / 100).toFixed(2)
    : null;


    // Total credits completed
    const completedCredits = gradedCourses.reduce(
      (sum, reg) => sum + reg.courseId.credits,
      0
    );

    // Academic standing
    let standing = "Good Standing";
    if (cgpa && parseFloat(cgpa) < 1.5) standing = "Probation";
    if (cgpa && parseFloat(cgpa) < 1.0) standing = "Suspension";

    return {
      cgpa,
      semesterGpa,
      completedCredits,
      standing,
      currentSemesterCredits: currentSemesterCourses.reduce(
        (sum, reg) => sum + reg.courseId.credits,
        0
      ),
      totalCourses: registrations.length,
      gradedCourses: gradedCourses.length,
    };
  };

  const {
    cgpa,
    semesterGpa,
    completedCredits,
    standing,
    currentSemesterCredits,
    totalCourses,
    gradedCourses,
  } = calculateMetrics();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="w-full">
          <h1 className="text-3xl font-bold flex items-center gap-3 mb-6 text-gray-800">
            <GraduationCap className="h-7 w-7 text-primary" />
            Academic Summary
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* CGPA Card */}
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
              <div className="flex items-center gap-3 text-gray-600 mb-1">
                <Award className="h-4 w-4 sm:h-5 sm:w-5" />
                <p className="text-xs sm:text-sm font-medium">CGPA</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {cgpa || "N/A"}
              </p>
              <Progress
                value={cgpa ? (parseFloat(cgpa) / 5) * 100 : 0}
                className="h-2 mt-3"
              />
            </div>

            {/* Semester GPA */}
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
              <div className="flex items-center gap-3 text-gray-600 mb-1">
                <Bookmark className="h-4 w-4 sm:h-5 sm:w-5" />
                <p className="text-xs sm:text-sm font-medium">Semester GPA</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {semesterGpa || "N/A"}
              </p>
              <Progress
                value={semesterGpa ? (parseFloat(semesterGpa) / 5) * 100 : 0}
                className="h-2 mt-3"
              />
            </div>

            {/* Credits */}
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
              <div className="flex items-center gap-3 text-gray-600 mb-1">
                <Layers className="h-5 w-5" />
                <p className="text-sm font-medium">Credits</p>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {completedCredits ?? 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {currentSemesterCredits} this semester
              </p>
            </div>

            {/* Academic Standing */}
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
              <div className="flex items-center gap-3 text-gray-600 mb-1">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                <p className="text-xs sm:text-sm font-medium">Standing</p>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 capitalize">
                {standing || "N/A"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {gradedCourses}/{totalCourses} courses graded
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Registered Courses Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Registered Courses
        </h2>

        <div className="border rounded-lg overflow-x-auto">
          <table className="min-w-full hidden md:table">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Code</th>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Units</th>
                <th className="px-6 py-3 text-left">Score</th>
                <th className="px-6 py-3 text-left">Grade</th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {registrations.map((reg) => (
                <tr key={reg._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{reg.courseId.code}</td>
                  <td className="px-6 py-4">{reg.courseId.title}</td>
                  <td className="px-6 py-4">{reg.courseId.credits}</td>
                  <td className="px-6 py-4">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={grades[reg._id] ?? ""}
                      onChange={(e) =>
                        handleGradeChange(reg._id, e.target.value)
                      }
                      placeholder="0-100"
                      className="w-24"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {reg.grade ? `${reg.grade} (${reg.gradePoint})` : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      onClick={() => handleSaveGrades(reg._id)}
                      disabled={
                        updateGradeMutation.isPending &&
                        currentRegistrationId === reg._id
                      }
                    >
                      {updateGradeMutation.isPending &&
                      currentRegistrationId === reg._id ? (
                        "Saving..."
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </>
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Version */}
          <div className="space-y-4 md:hidden">
            {registrations.map((reg) => (
              <div
                key={reg._id}
                className="bg-white p-4 rounded-lg shadow-sm border space-y-2"
              >
                <div className="text-sm">
                  <strong>Code:</strong> {reg.courseId.code}
                </div>
                <div className="text-sm">
                  <strong>Title:</strong> {reg.courseId.title}
                </div>
                <div className="text-sm">
                  <strong>Units:</strong> {reg.courseId.credits}
                </div>
                <div className="text-sm">
                  <strong>Score:</strong>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={grades[reg._id] ?? ""}
                    onChange={(e) => handleGradeChange(reg._id, e.target.value)}
                    placeholder="0-100"
                    className="mt-1 w-24"
                  />
                </div>
                <div className="text-sm">
                  <strong>Grade:</strong>{" "}
                  {reg.grade ? `${reg.grade} (${reg.gradePoint})` : "-"}
                </div>
                <div>
                  <Button
                    onClick={() => handleSaveGrades(reg._id)}
                    disabled={
                      updateGradeMutation.isPending &&
                      currentRegistrationId === reg._id
                    }
                    className="mt-2"
                  >
                    {updateGradeMutation.isPending &&
                    currentRegistrationId === reg._id ? (
                      "Saving..."
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Course Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Register Course</h3>
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Course</Label>
                <Select onValueChange={setSelectedCourseId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCourses.map((course) => (
                      <SelectItem key={course._id} value={course._id}>
                        {course.code} - {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Session</Label>
                <Input
                  value={session}
                  onChange={(e) => setSession(e.target.value)}
                  placeholder="e.g. 2023/2024"
                />
              </div>

              <div>
                <Label>Semester</Label>
                <Select onValueChange={setSemester} value={semester}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="First">First Semester</SelectItem>
                    <SelectItem value="Second">Second Semester</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleRegisterCourse}
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? "Registering..." : "Register"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <div className="fixed bottom-6 right-6">
        <Button onClick={() => setIsModalOpen(true)} className="shadow-lg">
          <Plus className="h-4 w-4 mr-2" />
          Register Course
        </Button>
      </div>
    </div>
  );
};

export default AcademicsPage;
