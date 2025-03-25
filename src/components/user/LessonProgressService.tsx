import { URL, commonRequest } from '../../common/api';
import { config } from '../../common/config';
import { AssessmentResult, EnrollmentEntity } from '../../types';


export class LessonProgressService {
  /**
   * Update lesson progress in the backend
   * @param progressData Lesson progress details to update
   * @returns Updated enrollment entity or error
   */
  static async updateLessonProgress(progressData: EnrollmentEntity): Promise<EnrollmentEntity> {
    try {
      const response = await commonRequest<EnrollmentEntity>(
        'PUT', 
        `${URL}/course/enrollment`, 
        progressData,
        config
      );
      return response.data;
    } catch (error) {
      console.error('Error updating lesson progress:', error);
      throw error;
    }
  }

  static async createAssessmentResult(progressData: AssessmentResult): Promise<AssessmentResult> {
    try {
      const response = await commonRequest<AssessmentResult>(
        'POST', 
        `${URL}/course/assessment-results`, 
        progressData,
        config
      );
      return response.data;
    } catch (error) {
      console.error('Error updating lesson progress:', error);
      throw error;
    }
  }

  /**
   * Mark lesson as completed in the backend
   * @param enrollmentId ID of the enrollment
   * @param lessonId ID of the completed lesson
   * @returns Updated enrollment entity or error
   */
  static async completeLessonInBackend(enrollmentId: string, lessonId: string): Promise<EnrollmentEntity> {
    try {
      const response = await commonRequest<EnrollmentEntity>(
        'PUT', 
        `${URL}/course/enrollment`, 
        { 
          enrollmentId, 
          lessonId 
        },
        config
      );
      return response.data;
    } catch (error) {
      console.error('Error marking lesson as completed:', error);
      throw error;
    }
  }
}