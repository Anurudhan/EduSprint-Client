import { CourseEntity } from "./ICourse";
import { SignupFormData } from "./IForm";

export enum CompleationStatus {
    enrolled = 'enrolled',
    inProgress = 'in-progress',
    Completed = 'completed',
}

export interface EnrollmentEntity {
    _id?: string;
    userId?: string;
    courseId?: string;
    enrolledAt?: Date | string;
    completionStatus?: CompleationStatus;
    progress?: {
        completedLessons?:  string[] | [] | null;
        completedAssessments?: string[] | [] | null;
        overallCompletionPercentage?: number
    };
    course?:CourseEntity;
    instructor?:SignupFormData;
};