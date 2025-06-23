import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext"
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Mail,
  NotebookPen,
  Calendar,
  Edit,
  Save,
  X,
  BookOpen,
  Award,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Progress } from "../../components/ui/progress";
import { useHttp } from "../../api/useHttp";
import toast from "react-hot-toast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";

type UserProfile = {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  gender?: "male" | "female" | null;
  matricNumber?: string;
  program?: string;
  level?: string;
  cgpa?: number;
  gpa?: number;
};

type Registration = {
  _id: string;
  courseId: {
    _id: string;
    code: string;
    title: string;
    credits: number;
  };
  score?: number;
  grade?: string;
  gradePoint?: number;
  semester: string;
};

const programs = [
  "Computer Science",
  "Computer Science with Mathematics",
  "Computer Science with Economics",
  "Computer Engineering",
];

const levels = ["Part I", "Part II", "Part III", "Part IV", "Part V"];

export default function StudentProfilePage() {
const { setUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [academicStats, setAcademicStats] = useState({
    gpa: 0,
    cgpa: 0,
    totalCredits: 0,
    completedCredits: 0,
    standing: "Good Standing",
  });

  const { data: userData, isPending: userLoading } = useHttp<{
    data: UserProfile;
  }>({
    url: "/users/me",
    method: "GET",
  });

  const { data: registrationsData } = useHttp<{ data: Registration[] }>({
    url: `/registrations/student/${profile?._id}`,
    method: "GET",
  });

  const updateMutation = useHttp<{ data: UserProfile }, Partial<UserProfile>>({
    url: "/users/me",
    method: "PUT",
  });

  useEffect(() => {
    if (userData?.data) {
      setProfile(userData.data);
    }
  }, [userData]);

  useEffect(() => {
    if (registrationsData?.data) {
      setRegistrations(registrationsData.data);
      calculateAcademicStats(registrationsData.data);
    }
  }, [registrationsData]);

  const calculateAcademicStats = (regs: Registration[]) => {
    const gradedCourses = regs.filter((r) => r.gradePoint !== undefined);

    // Calculate semester GPA (most recent semester)
    const currentSemester = regs.reduce(
      (latest, reg) => (reg.semester > latest ? reg.semester : latest),
      ""
    );

    const semesterCourses = gradedCourses.filter(
      (r) => r.semester === currentSemester
    );
    const semesterPoints = semesterCourses.reduce(
      (sum, reg) => sum + reg.gradePoint! * reg.courseId.credits,
      0
    );
    const semesterCredits = semesterCourses.reduce(
      (sum, reg) => sum + reg.courseId.credits,
      0
    );
    const gpa =
      semesterCredits > 0
        ? parseFloat((semesterPoints / semesterCredits).toFixed(2))
        : 0;

    // Calculate CGPA (all graded courses)
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
        ? parseFloat((totalPoints / totalCredits).toFixed(2))
        : 0;

    // Determine academic standing
    let standing = "Good Standing";
    if (cgpa < 1.5) standing = "Probation";
    if (cgpa < 1.0) standing = "Suspension";

    setAcademicStats({
      gpa,
      cgpa,
      totalCredits: regs.reduce((sum, reg) => sum + reg.courseId.credits, 0),
      completedCredits: totalCredits,
      standing,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev!, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProfile((prev) => ({ ...prev!, [name]: value }));
  };

  const handleSave = () => {
    if (!profile) return;

    updateMutation.mutate(profile, {
      onSuccess: (res) => {
        setProfile(res.data);
        setIsEditing(false);
        toast.success("Profile updated successfully!");
        setUser(res.data)
      },
    });
  };

  if (userLoading || !profile)
    return <div className="p-6">Loading profile...</div>;

  return (
    <div className="p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start">
          <div className="w-full space-y-6">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={profile.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="matricNumber">Matric Number</Label>
                  <Input
                    id="matricNumber"
                    name="matricNumber"
                    type="text"
                    value={profile.matricNumber || ""}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={profile.phoneNumber || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    value={profile.address || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={profile.gender || ""}
                      onValueChange={(value) =>
                        handleSelectChange("gender", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="program">Program</Label>
                    <Select
                      value={profile.program || ""}
                      onValueChange={(value) =>
                        handleSelectChange("program", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select program" />
                      </SelectTrigger>
                      <SelectContent>
                        {programs.map((program) => (
                          <SelectItem key={program} value={program}>
                            {program}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Select
                    value={profile.level || ""}
                    onValueChange={(value) =>
                      handleSelectChange("level", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <div>
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <div className="flex items-center gap-4 mt-2 text-gray-600">
                  <div className="flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" />
                    <span>{profile.program || "Program N/A"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{profile.level || "Level N/A"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 ml-4 mt-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </div>

        {/* Enhanced Academic Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Award className="h-4 w-4" />
                Semester GPA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {academicStats.gpa.toFixed(2)}
              </div>
              <Progress
                value={(academicStats.gpa / 5) * 100}
                className="h-2 mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                CGPA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {academicStats.cgpa.toFixed(2)}
              </div>
              <Progress
                value={(academicStats.cgpa / 5) * 100}
                className="h-2 mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Credits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {academicStats.completedCredits}
                <span className="text-sm font-normal text-gray-500 ml-1">
                  / {academicStats.totalCredits}
                </span>
              </div>
              <Progress
                value={
                  (academicStats.completedCredits /
                    academicStats.totalCredits) *
                    100 || 0
                }
                className="h-2 mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Standing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {academicStats.standing}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Based on your cumulative performance
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 md:flex-row flex-col justifify-between items-center">
        <Link to="/chats">
          <Button className="h-12">
            <Mail className="h-5 w-5 mr-2" />
            Contact Advisor
          </Button>
        </Link>
        <Link to="/student/academics">
          <Button className="h-12">
            <NotebookPen className="h-5 w-5 mr-2" />
            View Academic Record
          </Button>
        </Link>
      </div>
    </div>
  );
}
