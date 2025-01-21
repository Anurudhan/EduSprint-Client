import { Category } from "./ICategory";
import { SignupFormData } from "./IForm";


export interface CourseFirst {
    title?: string;
    description?: string;
    thumbnail?: string;
    language?: string;
    category?: string;
    pricing?: string;
    video?: string;
}



export interface Lesson {
    lessonNumber?: string,
    title?: string;
    description?: string;
    thumbnail?: string;
    video?: string;
    duration?: string;
    objectives?: string[];
}

interface Trial {
    video?: string;
}

interface Attachments {
    title?: string;
    url?: string;
}

export enum PricingType {
    free = 'free',
    paid = 'paid'
}

interface Pricing {
    amount?: number;
    type?: PricingType;
}

export interface FilterState {
    search: string;
    category: string;
    priceType: PricingType | '';
    minPrice: number;
    maxPrice: number;
    level: Level | '';
    minRating: number;
  }

export enum Level {
    beginner = 'beginner',
    intermediate = 'intermediate',
    advanced = 'expert'
}
export interface CourseEntity {
    _id?:string;
    title?: string;
    description?: string;
    thumbnail?: string;
    categoryRef?: string;
    instructorRef?: string;
    language?: string;
    lessons?: Lesson[];
    trial?: Trial;
    level?: Level;
    attachments?: Attachments;
    pricing?: Pricing;
    isRequested?: boolean;
    isPublished?: boolean;
    isBlocked?: boolean;
    isRejected?: boolean;
    rating?: number;
    studentsEnrolled?: number | string;
    students?:string[];
    category?:Category;
    instructor?:SignupFormData;
}