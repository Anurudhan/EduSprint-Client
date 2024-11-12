
import { Calendar, Clock, AlertCircle, CheckCircle2, Timer } from 'lucide-react';

interface Assessment {
  id: number;
  title: string;
  course: string;
  dueDate: string;
  duration: string;
  questions: number;
  status: 'upcoming' | 'completed' | 'ongoing';
  score?: number;
}

const assessments: Assessment[] = [
  {
    id: 1,
    title: "JavaScript Fundamentals Quiz",
    course: "Advanced JavaScript Concepts",
    dueDate: "2024-03-25",
    duration: "45 minutes",
    questions: 30,
    status: 'upcoming'
  },
  {
    id: 2,
    title: "React Components Assessment",
    course: "React.js Masterclass",
    dueDate: "2024-03-22",
    duration: "60 minutes",
    questions: 25,
    status: 'completed',
    score: 92
  },
  {
    id: 3,
    title: "Python Data Structures",
    course: "Python for Data Science",
    dueDate: "2024-03-20",
    duration: "90 minutes",
    questions: 40,
    status: 'ongoing'
  }
];

const StudentAssessments = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Assessments</h1>
        <div className="flex gap-4">
          <select className="btn btn-secondary">
            <option>All Assessments</option>
            <option>Upcoming</option>
            <option>Completed</option>
            <option>Ongoing</option>
          </select>
          <button className="btn btn-primary">
            Start New Assessment
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {assessments.map((assessment) => (
          <AssessmentCard key={assessment.id} assessment={assessment} />
        ))}
      </div>
    </div>
  );
};

const AssessmentCard = ({ assessment }: { assessment: Assessment }) => {
  const statusColors = {
    upcoming: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20',
    completed: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
    ongoing: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
  };

  const StatusIcon = {
    upcoming: AlertCircle,
    completed: CheckCircle2,
    ongoing: Timer
  }[assessment.status];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {assessment.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {assessment.course}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize flex items-center gap-1 ${statusColors[assessment.status]}`}>
          <StatusIcon className="w-4 h-4" />
          {assessment.status}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">Due: {new Date(assessment.dueDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{assessment.duration}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{assessment.questions} questions</span>
        </div>
      </div>

      {assessment.score && (
        <div className="mt-4 pt-4 border-t dark:border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">Score:</span>
            <span className="text-lg font-semibold text-green-600 dark:text-green-400">
              {assessment.score}%
            </span>
          </div>
        </div>
      )}

      <div className="mt-4 flex gap-4">
        {assessment.status === 'upcoming' && (
          <button className="btn btn-primary flex-1">
            Start Assessment
          </button>
        )}
        {assessment.status === 'completed' && (
          <button className="btn btn-secondary flex-1">
            View Results
          </button>
        )}
        {assessment.status === 'ongoing' && (
          <button className="btn btn-primary flex-1">
            Continue Assessment
          </button>
        )}
        <button className="btn btn-secondary">
          View Details
        </button>
      </div>
    </div>
  );
};

export default StudentAssessments;