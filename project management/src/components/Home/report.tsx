import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { MoreHorizontal, MessageCircle, FileText } from 'lucide-react';

const DetailedReportsSection = () => {
  // Sample data for the mini chart
  const chartData = [
    { value: 10 }, { value: 15 }, { value: 13 }, 
    { value: 17 }, { value: 14 }, { value: 18 },
    { value: 16 }, { value: 19 }
  ];
  type ProgressCircleProps = {
    percentage: number;
    color: string;
    label: string;
  };
 
  const ProgressCircle: React.FC<ProgressCircleProps>  = ({ percentage, color, label }) => (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="44"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="8"
          />
          <circle
            cx="48"
            cy="48"
            r="44"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 44 * percentage / 100} ${2 * Math.PI * 44}`}
          />
        </svg>
        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg font-semibold">
          {percentage}%
        </span>
      </div>
      <span className="mt-2 text-sm text-gray-600">{label}</span>
    </div>
  );

  return (
    <div className="flex items-center justify-between max-w-5xl mx-auto px-6 py-16 gap-20">
      {/* Left side with progress circles and stats card */}
      <div className="bg-gray-50 w-96 h-96 p-8 rounded-3xl space-y-8 overflow-hidden">
  {/* Task Status */}
  <div>
    <h3 className="text-lg font-semibold mb-6">Task Status</h3>
    <div className="flex gap-4">
      <ProgressCircle percentage={84} color="#10B981" label="Completed"  />
      <ProgressCircle percentage={46} color="#818CF8" label="In Progress" />
      <ProgressCircle percentage={13} color="#6B7280" label="Not Started" />
    </div>
  </div>

  {/* Stats Card */}
  <div className="bg-white p-6 rounded-xl shadow-sm h-full overflow-hidden">
    <div className="flex justify-between items-start mb-4">
      <div>
        <span className="text-xs text-red-500 font-medium px-2 py-1 bg-red-50 rounded-full">Help</span>
        <h3 className="text-lg font-semibold mt-2">Research</h3>
        <p className="text-sm text-gray-500 mt-1">
          User research helps you to create an optimal product for users.
        </p>
      </div>
      <button className="text-gray-400">
        <MoreHorizontal size={20} />
      </button>
    </div>

    <div className="flex items-center gap-4 mb-4">
      <div className="flex -space-x-2">
        <div className="w-6 h-6 rounded-full bg-blue-500" />
        <div className="w-6 h-6 rounded-full bg-green-500" />
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <MessageCircle size={16} />
        <span>19 comments</span>
        <FileText size={16} className="ml-2" />
        <span>3 files</span>
      </div>
    </div>

    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-2xl font-bold">2,420</span>
        <span className="text-green-500 text-sm">↑ 40% vs last month</span>
      </div>
      <div className="h-12">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#818CF8" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
</div>


      {/* Right side content */}
      <div className="flex-1">
      <span className="inline-block px-4 py-1 text-sm bg-gradient-to-r  text-transparent bg-clip-text border border-gradient-to-r from-indigo-500 to-rose-500 rounded-full">
          Report
        </span>
        
        <h2 className="text-4xl font-semibold mt-6 mb-6">
          Detailed reports to track <br />project progress.
        </h2>
        
        <p className="text-gray-600 mb-8">
          Decide if you want to throw it away retain it and continue with your <br /> 
          workflow unhindered. Need short bursts of productivity? Meet the br
          versatile Pomodoro timer that makes short creative bursts possible.
        </p>
        
        <button className="px-6 py-2 bg-indigo-900 text-white rounded-full hover:bg-indigo-800 transition-colors">
          Start for free
        </button>
      </div>
    </div>
  );
};

export default DetailedReportsSection;