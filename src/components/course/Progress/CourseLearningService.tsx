import { commonRequest, URL } from "../../../common/api";
import { config } from "../../../common/config";
import { LessonProgressService } from "../../user/LessonProgressService";
import {
  AssessmentResult,
  CompleationStatus,
  EnrollmentEntity,
} from "../../../types";
import { Assessment } from "../../../types/IAssessment";
import { Lesson } from "../../../types/ICourse";
import { generateRandomString } from "../../../utilities/generate/generateRandomString";

// Define interfaces
export interface LessonStatus {
  [lessonNumber: string]: "not-started" | "in-progress" | "completed";
}

export interface AssessmentStatus {
  [lessonNumber: string]: "locked" | "available" | "completed";
}
interface CachedData {
  enrollment: EnrollmentEntity;
  assessments: Assessment[];
}

export class CourseLearningService {
  static cache: Record<string, CachedData> = {};
  static debounceTimeout: NodeJS.Timeout | null = null;
  static async fetchEnrollmentAndAssessments(
    enrollmentId: string,
    setEnrollment: (enrollment: EnrollmentEntity) => void,
    setAssessments: (assessments: Assessment[]) => void,
    setLoading: (loading: boolean) => void
  ): Promise<void> {
    try {
      setLoading(true);
      const cacheKey = `enrollment-${enrollmentId}`;
  if (this.cache[cacheKey]) {
    setEnrollment(this.cache[cacheKey].enrollment);
    setAssessments(this.cache[cacheKey].assessments);
    return;
  }
      const response = await commonRequest<EnrollmentEntity>(
        "GET",
        `${URL}/course/enrollment/${enrollmentId}`,
        undefined,
        config
      );
      setEnrollment(response.data);

      if (response.data.courseId) {
        const assessmentsResponse = await commonRequest<Assessment[]>(
          "GET",
          `${URL}/course/assessment?courseId=${response.data.courseId}`,
          undefined,
          config
        );
        setAssessments(assessmentsResponse.data);
        this.cache[cacheKey] = { enrollment: response.data, assessments: assessmentsResponse.data };
      }
    } catch (error) {
      console.error("Error fetching enrollment or assessments:", error);
    } finally {
      setLoading(false);
    }
  }

  static calculateProgress(
    completedLessons: string[],
    completedAssessments: string[],
    totalLessons: number,
    totalAssessments: number
  ): number {
    const totalSteps = totalLessons + totalAssessments;
    const completedSteps =
      completedLessons.length + completedAssessments.length;
    return totalSteps ? (completedSteps / totalSteps) * 100 : 0;
  }

  static calculateTotalScore(results: AssessmentResult[]): number {
    if (results.length === 0) return 0;
    return (
      results.reduce((acc, result) => acc + result.bestScore, 0) /
      results.length
    );
  }

  static async handleLessonComplete(
    enrollment: EnrollmentEntity,
    currentLessonNumber: string,
    lessons: Lesson[],
    assessments: Assessment[],
    setEnrollment: (enrollment: EnrollmentEntity) => void,
    setLessonStatus: React.Dispatch<React.SetStateAction<LessonStatus>>,
    setAssessmentStatus: React.Dispatch<React.SetStateAction<AssessmentStatus>>,
    setShowAssessment: (show: boolean) => void,
    setShowCompletionModal: (show: boolean) => void,
    setCurrentLessonIndex: (index: number) => void,
    currentLessonIndex: number
  ): Promise<void> {
    const newCompletedLessons = [
      ...(enrollment.progress?.completedLessons || []),
    ];
    if (!newCompletedLessons.includes(currentLessonNumber)) {
      newCompletedLessons.push(currentLessonNumber);
    }

    const progress = this.calculateProgress(
      newCompletedLessons,
      enrollment.progress?.completedAssessments || [],
      lessons.length,
      assessments.length
    );
    if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
    try {
      this.debounceTimeout = setTimeout(async () => {
        try {
      const result = await LessonProgressService.updateLessonProgress({
        ...enrollment,
        progress: {
          ...enrollment.progress,
          completedLessons: newCompletedLessons,
          overallCompletionPercentage: progress,
        },
      });
      setEnrollment(result);
    } catch (err) {
      console.error("Error:", err);
    }
  }, 1000);
      setLessonStatus(
        (prev: LessonStatus): LessonStatus => ({
          ...prev,
          [currentLessonNumber]: "completed",
        })
      );

      const currentAssessment = assessments.find(
        (a) => a.lessonId === currentLessonNumber
      );
      
      if (currentAssessment) {
        setAssessmentStatus(
          (prev: AssessmentStatus): AssessmentStatus => ({
            ...prev,
            [currentLessonNumber]: "available",
          })
        );
        setShowAssessment(true);
      } else if (currentLessonIndex < lessons.length - 1) {
        // If no assessment, automatically move to next lesson
        setCurrentLessonIndex(currentLessonIndex + 1);
      } else {
        setShowCompletionModal(true);
      }
    } catch (err) {
      console.error("Error updating lesson progress:", err);
    }
  }

  static async handleAssessmentComplete(
    enrollment: EnrollmentEntity,
    currentLessonNumber: string,
    currentAssessment: Assessment,
    score: number,
    answers: {
      questionId: string;
      selectedAnswer: string;
      isCorrect: boolean;
    }[],
    lessons: Lesson[],
    assessmentResults: AssessmentResult[],
    setEnrollment: (enrollment: EnrollmentEntity) => void,
    setAssessmentResults: (results: AssessmentResult[]) => void,
    setAssessmentStatus: React.Dispatch<React.SetStateAction<AssessmentStatus>>,
    setShowAssessment: (show: boolean) => void,
    setCurrentLessonIndex: (index: number) => void,
    setShowCompletionModal: (show: boolean) => void,
    currentLessonIndex: number,
    assessments:Assessment[]
  ): Promise<void> {
    const newCompletedAssessments = [
      ...(enrollment.progress?.completedAssessments || []),
    ];
    if (!newCompletedAssessments.includes(currentLessonNumber)) {
      newCompletedAssessments.push(currentLessonNumber);
    }
    const totalPoints = currentAssessment.questions.reduce(
      (sum, q) => sum + (q.points || 0),
      0
    );
    const earnedPoints = Math.round((score / 100) * totalPoints);

    const assessmentResult: AssessmentResult = {
      enrollmentId: enrollment._id || "",
      courseId: currentAssessment.courseId,
      lessonId: currentLessonNumber,
      userId:enrollment.userId as string,
      assessmentId: currentAssessment._id || "",
      attempts: [
        {
          score,
          passed: score >= currentAssessment.passingScore,
          completedAt: new Date(),
          answers,
        },
      ],
      bestScore: score,
      totalPoints,
      earnedPoints,
      status: score >= currentAssessment.passingScore ? "passed" : "failed",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const savedAssessment =
        await LessonProgressService.createAssessmentResult(assessmentResult);
      
      const updatedAssessmentResults = [...assessmentResults, savedAssessment];
      setAssessmentResults(updatedAssessmentResults);
      
      setAssessmentStatus(
        (prev: AssessmentStatus): AssessmentStatus => ({
          ...prev,
          [currentLessonNumber]: "completed",
        })
      );

      // Always calculate progress with updated completed assessments
      const progress = this.calculateProgress(
        enrollment.progress?.completedLessons || [],
        newCompletedAssessments,
        lessons.length,
        assessments.length
      );

      if (score >= currentAssessment.passingScore) {
        const updateData = {
          ...enrollment,
          progress: {
            ...enrollment.progress,
            completedAssessments: newCompletedAssessments,
            overallCompletionPercentage: progress,
            totalScore: this.calculateTotalScore(updatedAssessmentResults),
          },
        };

        // If all lessons are completed
        if (currentLessonIndex === lessons.length - 1) {
          updateData.completionStatus = CompleationStatus.Completed;
          updateData.certificate = {
            _id: `CERT-${generateRandomString(8)}`,
            enrollmentId: enrollment._id || "",
            userId: enrollment.userId || "",
            courseId: enrollment.courseId || "",
            issuedAt: new Date(),
            certificateNumber: `CERT-${Date.now()}`,
            score: updateData.progress.totalScore,
          };
        }

        // Update enrollment
        const result = await LessonProgressService.updateLessonProgress(updateData);
        setEnrollment(result);

        // Move to next lesson
        if (currentLessonIndex < lessons.length - 1) {
          setTimeout(() => {
            setCurrentLessonIndex(currentLessonIndex + 1);
            setShowAssessment(false);
          }, 2000);
        } else {
          setShowCompletionModal(true);
        }
      }
    } catch (error) {
      console.error("Error saving assessment:", error);
    }
  }
}