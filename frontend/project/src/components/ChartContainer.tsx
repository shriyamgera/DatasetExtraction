import React, { useState } from 'react';
import { 
  BarChart, Bar, 
  LineChart, Line, 
  PieChart, Pie, 
  ScatterChart, Scatter,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer
} from 'recharts';
import { CSVData, ChartConfig } from '../types';
import { BarChart3, LineChart as LineIcon, PieChart as PieIcon, ScatterChart as ScatterIcon, TrendingUp } from 'lucide-react';

interface ChartContainerProps {
  data: CSVData;
}

const COLORS = ['#3B82F6', '#14B8A6', '#8B5CF6', '#F59E0B', '#EC4899', '#06B6D4', '#F97316'];

const ChartContainer: React.FC<ChartContainerProps> = ({ data }) => {
  const { headers, rows } = data;
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    type: 'bar',
    xKey: headers[0] || '',
    yKey: headers[1] || headers[0] || '',
    title: 'Data Visualization'
  });

  const handleChartTypeChange = (type: ChartConfig['type']) => {
    setChartConfig(prev => ({ ...prev, type }));
  };

  const handleAxisChange = (axis: 'xKey' | 'yKey', value: string) => {
    setChartConfig(prev => ({ ...prev, [axis]: value }));
  };

  const renderChart = () => {
    const filteredData = rows.filter(row => 
      row[chartConfig.xKey] !== undefined && 
      row[chartConfig.yKey] !== undefined &&
      row[chartConfig.yKey] !== ''
    );

    const chartData = filteredData.map(row => ({
      ...row,
      [chartConfig.yKey]: isNaN(Number(row[chartConfig.yKey])) ? row[chartConfig.yKey] : Number(row[chartConfig.yKey])
    }));

    if (chartData.length === 0) {
      return (
        <div className="py-8 text-center">
          <p className="text-gray-500">No valid data for selected axes</p>
        </div>
      );
    }

    switch (chartConfig.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={chartConfig.xKey} 
                angle={-45} 
                textAnchor="end" 
                height={70}
                interval={0}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={chartConfig.yKey} fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={chartConfig.xKey} 
                angle={-45} 
                textAnchor="end" 
                height={70}
                interval={0}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={chartConfig.yKey} 
                stroke="#8B5CF6" 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <Pie
                data={chartData}
                dataKey={chartConfig.yKey}
                nameKey={chartConfig.xKey}
                cx="50%"
                cy="50%"
                outerRadius={130}
                fill="#8884d8"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={chartConfig.xKey} 
                type="category" 
                name={chartConfig.xKey} 
                angle={-45} 
                textAnchor="end" 
                height={70}
                interval={0}
              />
              <YAxis dataKey={chartConfig.yKey} name={chartConfig.yKey} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter name={chartConfig.yKey} data={chartData} fill="#14B8A6" />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={chartConfig.xKey} 
                angle={-45} 
                textAnchor="end" 
                height={70}
                interval={0}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey={chartConfig.yKey} 
                stroke="#F59E0B" 
                fill="#F59E0B" 
                fillOpacity={0.3} 
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h3 className="text-lg font-semibold mb-4 sm:mb-0">{chartConfig.title}</h3>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleChartTypeChange('bar')}
            className={`p-2 rounded-md flex items-center ${chartConfig.type === 'bar' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <BarChart3 size={18} className="mr-1" />
            <span className="text-sm">Bar</span>
          </button>
          
          <button
            onClick={() => handleChartTypeChange('line')}
            className={`p-2 rounded-md flex items-center ${chartConfig.type === 'line' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <LineIcon size={18} className="mr-1" />
            <span className="text-sm">Line</span>
          </button>
          
          <button
            onClick={() => handleChartTypeChange('pie')}
            className={`p-2 rounded-md flex items-center ${chartConfig.type === 'pie' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <PieIcon size={18} className="mr-1" />
            <span className="text-sm">Pie</span>
          </button>
          
          <button
            onClick={() => handleChartTypeChange('scatter')}
            className={`p-2 rounded-md flex items-center ${chartConfig.type === 'scatter' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <ScatterIcon size={18} className="mr-1" />
            <span className="text-sm">Scatter</span>
          </button>
          
          <button
            onClick={() => handleChartTypeChange('area')}
            className={`p-2 rounded-md flex items-center ${chartConfig.type === 'area' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <TrendingUp size={18} className="mr-1" />
            <span className="text-sm">Area</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            X-Axis
          </label>
          <select
            value={chartConfig.xKey}
            onChange={(e) => handleAxisChange('xKey', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md bg-white"
          >
            {headers.map((header) => (
              <option key={header} value={header}>
                {header}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Y-Axis
          </label>
          <select
            value={chartConfig.yKey}
            onChange={(e) => handleAxisChange('yKey', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md bg-white"
          >
            {headers.map((header) => (
              <option key={header} value={header}>
                {header}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4">
        {renderChart()}
      </div>
    </div>
  );
};

export default ChartContainer;