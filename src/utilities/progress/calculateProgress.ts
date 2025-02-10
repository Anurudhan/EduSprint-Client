import { EnrollmentEntity } from "../../types";


export const calculateProgress = (enrollment: EnrollmentEntity) => {
  if (!enrollment.course?.lessons?.length) return 0;
  
  const totalLessons = enrollment.course.lessons.length;
  const completedLessons = enrollment.progress?.completedLessons?.length || 0;
  
  return Math.round((completedLessons / totalLessons) * 100);
};