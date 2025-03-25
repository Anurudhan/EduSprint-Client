import { CourseEntity } from "./ICourse";
import { SignupFormData } from "./IForm";

export enum CompleationStatus {
    enrolled = 'enrolled',
    inProgress = 'in-progress',
    Completed = 'completed',
}

export interface LessonProgress {
  lessonId: string;
  videoProgress?: {
      watchedDuration: number;  // in seconds
      totalDuration: number;    // in seconds
      lastWatchedTimestamp?: Date;
      watchedPercentage: number;
  };
  status: 'not-started' | 'in-progress' | 'completed';
}
export interface AssessmentResult {
    _id?: string;
    enrollmentId: string;
    courseId: string;
    lessonId: string;
    assessmentId: string;
    attempts: {
      score: number;
      passed: boolean;
      completedAt: Date;
      answers: { questionId: string; selectedAnswer: string; isCorrect: boolean }[];
    }[];
    bestScore: number;
    totalPoints: number;
    earnedPoints: number;
    status: 'inProgress' | 'failed' | 'passed';
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Certificate {
    _id: string;
    enrollmentId: string;
    userId: string;
    courseId: string;
    issuedAt: Date;
    certificateNumber: string;
    score: number; // Overall course score
    downloadUrl?: string;
  }
  
  export interface EnrollmentEntity {
    _id?: string;
    userId?: string;
    courseId?: string;
    enrolledAt?: Date | string;
    completionStatus?: CompleationStatus;
    lessonProgresses?: LessonProgress[];
    progress?: {
      completedLessons?: string[] | null;
      completedAssessments?: string[] | null;
      overallCompletionPercentage?: number;
      totalScore?: number; // Cumulative score across all assessments
    };
    course?: CourseEntity;
    instructor?: SignupFormData;
    certificate?: Certificate;
  } 