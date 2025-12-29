import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface YearlySalesChartProps {
    data: Array<{ name: string; ventas: number }>;
}

export const YearlySalesChart = ({ data }: YearlySalesChartProps) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Comportamiento Anual de Ventas</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            tickFormatter={(value) => `S/ ${value}`}
                        />
                        <Tooltip
                            cursor={{ stroke: '#4F46E5', strokeWidth: 2 }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            formatter={(value: number) => [`S/ ${value.toFixed(2)}`, 'Ventas']}
                        />
                        <Legend />
                        <Line 
                            type="monotone" 
                            dataKey="ventas" 
                            name="Ventas Mensuales" 
                            stroke="#4F46E5" 
                            strokeWidth={3}
                            dot={{ fill: '#4F46E5', strokeWidth: 2, r: 4, stroke: '#fff' }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
