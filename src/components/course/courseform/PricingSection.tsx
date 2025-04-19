import React, {  useEffect } from "react";
import { CourseEntity, PricingType } from "../../../types/ICourse";

const PricingSection: React.FC<{
  course: Partial<CourseEntity>;
  setCourse: React.Dispatch<React.SetStateAction<Partial<CourseEntity>>>;
  errors: Record<string, string>;
}> = ({ course, setCourse, errors }) => {
  // Initialize pricing if it doesn't exist
  useEffect(() => {
    if (!course.pricing) {
      setCourse(prev => ({
        ...prev,
        pricing: { type: PricingType.paid, amount: 0 }
      }));
    }
  }, []);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    
    setCourse(prev => ({
      ...prev,
      pricing: { ...prev.pricing!, amount: value }
    }));
  };

  const handlePricingTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pricingType = e.target.value as PricingType;
    
    // Reset price when switching to free
    if (pricingType === PricingType.free) {
      setCourse(prev => ({
        ...prev,
        pricing: { type: pricingType, amount: 0 }
      }));
    } else {
      // When switching to paid, keep current amount
      const currentAmount = course.pricing?.amount || 0;
      setCourse(prev => ({
        ...prev,
        pricing: { type: pricingType, amount: currentAmount }
      }));
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-5">Course Pricing</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">
            Pricing Type <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 shadow-md text-base focus:outline-none focus:border-blue-600 focus:ring-blue-600 transition duration-200 appearance-none"
              value={course.pricing?.type || PricingType.paid}
              onChange={handlePricingTypeChange}
              required
            >
              {Object.values(PricingType).map(type => (
                <option key={type} value={type}>
                  {type === PricingType.free ? "Free" : "Paid"}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {course.pricing?.type === PricingType.free 
              ? "Students can enroll in this course for free" 
              : "Set a price for students to enroll in this course"}
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">
            Price {course.pricing?.type === PricingType.paid && <span className="text-red-500">*</span>}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              className={`block w-full pl-10 pr-4 py-3 rounded-lg shadow-md text-base focus:outline-none transition duration-200 ${
                errors.pricingAmount 
                  ? 'border-2 border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-2 border-gray-300 focus:border-blue-600 focus:ring-blue-600'
              }`}
              placeholder="0.00"
              min="0"
              step="0.01"
              value={course.pricing?.amount || 0}
              onChange={handlePriceChange}
              disabled={course.pricing?.type === PricingType.free}
              aria-describedby="price-currency"
            />
          </div>
          {errors.pricingAmount && (
            <p className="text-sm text-red-600 mt-1">{errors.pricingAmount}</p>
          )}
          {course.pricing?.type === PricingType.paid && !errors.pricingAmount && (
            <p className="text-xs text-gray-600 mt-1">Enter price in USD</p>
          )}
        </div>
      </div>

      {course.pricing?.type === PricingType.paid && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Remember to set a competitive price. Most courses in our platform range from $19.99 to $199.99.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingSection;