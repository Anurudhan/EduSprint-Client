import { TrendingUp} from 'lucide-react';
interface StatCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; // type for the icon component
  label: string;
  value: string | number; // value can be a string or number
  trend: string; // trend is a string, but you can adjust the type if needed
}

const StatCard = ({ icon: Icon, label, value, trend }: StatCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-xl font-semibold text-gray-800 dark:text-white">{value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            <TrendingUp className="w-3 h-3 inline mr-1" />
            {trend}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
