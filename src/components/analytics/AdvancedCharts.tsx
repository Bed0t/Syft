import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Scatter
} from 'recharts';

const COLORS = {
  primary: ['#4F46E5', '#818CF8', '#A5B4FC', '#C7D2FE'],
  success: ['#059669', '#34D399', '#6EE7B7', '#A7F3D0'],
  warning: ['#D97706', '#FBBF24', '#FCD34D', '#FDE68A'],
  danger: ['#DC2626', '#F87171', '#FCA5A5', '#FECACA']
};

interface MetricsChartProps {
  data: any[];
  type: 'area' | 'bar' | 'line' | 'pie' | 'composed';
  dataKeys: string[];
  xAxisKey: string;
  stacked?: boolean;
  height?: number;
  colorScheme?: keyof typeof COLORS;
}

export const MetricsChart: React.FC<MetricsChartProps> = ({
  data,
  type,
  dataKeys,
  xAxisKey,
  stacked = false,
  height = 300,
  colorScheme = 'primary'
}) => {
  const colors = COLORS[colorScheme];

  const renderChart = () => {
    switch (type) {
      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {dataKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stackId={stacked ? "1" : index}
                fill={colors[index % colors.length]}
                stroke={colors[index % colors.length]}
              />
            ))}
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {dataKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                stackId={stacked ? "1" : index}
                fill={colors[index % colors.length]}
              />
            ))}
          </BarChart>
        );

      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {dataKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey={dataKeys[0]}
              nameKey={xAxisKey}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );

      case 'composed':
        return (
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {dataKeys.map((key, index) => {
              // Alternate between bar and line
              return index % 2 === 0 ? (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={colors[index % colors.length]}
                  opacity={0.8}
                />
              ) : (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                />
              );
            })}
          </ComposedChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer>{renderChart()}</ResponsiveContainer>
    </div>
  );
};

interface MetricsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  chart?: React.ReactNode;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  change,
  icon,
  chart
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {icon && <div className="mr-3">{icon}</div>}
          <div>
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{value}</p>
              {change !== undefined && (
                <span
                  className={`ml-2 text-sm font-medium ${
                    change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {change >= 0 ? '+' : ''}{change}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      {chart && <div className="mt-4">{chart}</div>}
    </div>
  );
};

interface MetricsGridProps {
  items: MetricsCardProps[];
  columns?: number;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ items, columns = 4 }) => {
  return (
    <div className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-${columns}`}>
      {items.map((item, index) => (
        <MetricsCard key={index} {...item} />
      ))}
    </div>
  );
}; 