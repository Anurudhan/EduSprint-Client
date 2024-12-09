import { CourseEntity, PricingType } from "../../../types/ICourse";

const PricingSection: React.FC<{
    course: Partial<CourseEntity>, 
    setCourse: React.Dispatch<React.SetStateAction<Partial<CourseEntity>>>
  }> = ({ course, setCourse }) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Pricing Type</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-200 border-2 shadow-md focus:border-blue-500 focus:ring-blue-500"
            value={course.pricing?.type}
            onChange={e => setCourse(prev => ({
              ...prev,
              pricing: { ...prev.pricing!, type: e.target.value as PricingType }
            }))}
          >
            {Object.values(PricingType).map(type => (
              <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
            ))}
          </select>
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            className="mt-1 block w-full rounded-md border-gray-200 border-2 shadow-md focus:border-blue-500 focus:ring-blue-500"
            value={course.pricing?.amount}
            onChange={e => setCourse(prev => ({
              ...prev,
              pricing: { ...prev.pricing!, amount: Number(e.target.value) }
            }))}
            disabled={course.pricing?.type === PricingType.free}
          />
        </div>
      </div>
    );
  };
  export default PricingSection;