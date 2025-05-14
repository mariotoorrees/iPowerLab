import { useCallback } from "react";
import { format, subMonths } from "date-fns";
import { useWeights } from "@/hooks/use-metrics";
import { 
  AreaChart,
  Area,
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from "recharts";

export function WeightChart() {
  const { data: weights = [] } = useWeights(1);
  
  // Get min and max weights for y-axis calculation
  const minWeight = weights.length > 0 
    ? Math.floor(Math.min(...weights.map(w => w.weight)) - 3)
    : 150;
  
  const maxWeight = weights.length > 0 
    ? Math.ceil(Math.max(...weights.map(w => w.weight)) + 3)
    : 180;
  
  // Always show last 90 days
  const getFilteredData = useCallback(() => {
    if (!weights.length) return [];
    
    const now = new Date();
    const startDate = subMonths(now, 3); // Always 90 days
    
    // Filter weights by date and sort chronologically
    return weights
      .filter(w => new Date(w.date) >= startDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(w => ({
        date: format(new Date(w.date), "MMM d"),
        weight: w.weight
      }));
  }, [weights]);
  
  const chartData = getFilteredData();
  
  // Get starting and current weight info
  const startingWeight = chartData.length > 0 ? chartData[0].weight : null;
  const currentWeight = chartData.length > 0 ? chartData[chartData.length - 1].weight : null;
  const targetWeight = 165; // This would come from user data in a real app
  
  // Calculate weight change
  const weightChange = startingWeight && currentWeight 
    ? (currentWeight - startingWeight).toFixed(1) 
    : null;
  
  const weightChangeIsPositive = weightChange && parseFloat(weightChange) > 0;

  return (
    <div className="space-y-2">
      {/* Weight summary at the top */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-sm text-gray-500">Current</span>
          <h3 className="text-xl font-semibold">{currentWeight ? `${currentWeight} lbs` : "N/A"}</h3>
        </div>
        
        {weightChange && (
          <div className={`text-sm ${weightChangeIsPositive ? 'text-red-500' : 'text-green-500'}`}>
            {weightChangeIsPositive ? '+' : ''}{weightChange} lbs
          </div>
        )}
      </div>
      
      {/* Chart */}
      <div className="h-[180px]">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 5,
                right: 0,
                left: -20, 
                bottom: 5,
              }}
            >
              <defs>
                <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#027eb3" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#027eb3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10, fill: "#9e9e9e" }} 
                tickLine={false}
                axisLine={{ stroke: '#f0f0f0' }}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={[minWeight, maxWeight]} 
                tick={{ fontSize: 10, fill: "#9e9e9e" }} 
                tickLine={false}
                axisLine={{ stroke: '#f0f0f0' }}
                width={25}
              />
              <Tooltip 
                formatter={(value) => [`${value} lbs`, 'Weight']}
                contentStyle={{
                  borderRadius: 12,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
                  fontSize: 12,
                  padding: '8px 12px'
                }}
              />
              <ReferenceLine 
                y={targetWeight} 
                stroke="#9e9e9e" 
                strokeDasharray="3 3" 
                label={{ 
                  value: 'Goal', 
                  position: 'right',
                  fill: '#9e9e9e',
                  fontSize: 10 
                }} 
              />
              <Area
                type="monotone"
                dataKey="weight"
                stroke="#027eb3"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#weightGradient)"
                dot={{ r: 2, fill: 'white', stroke: '#027eb3', strokeWidth: 1.5 }}
                activeDot={{ r: 5, fill: "#027eb3", strokeWidth: 0 }}
                isAnimationActive={true}
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-400">No weight data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
