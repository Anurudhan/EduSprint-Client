import { CourseEntity } from "./ICourse";
import { SignupFormData } from "./IForm";

export interface PaymentEntity {
    amount: string;
    _id?: string;
    userId?: string;
    courseId?: string;
    createdAt?: string;
    status?: string;
    course?:CourseEntity;
    user?:SignupFormData;
    type?: "credit" | "debit";
};