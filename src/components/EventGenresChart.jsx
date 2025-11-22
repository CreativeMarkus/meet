import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend
} from 'recharts';

const genres = ['React', 'JavaScript', 'Node', 'jQuery', 'Angular', 'Python', 'Vue', 'TypeScript', 'Java', 'C++'];

const EventGenresChart = ({ events }) => {
    const [data, setData] = useState([]);
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#ff8042', '#a4de6c', '#ffc0cb', '#40e0d0', '#da70d6'];

    const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent }) => {
        const RADIAN = Math.PI / 180;
        const radius = outerRadius;
        const x = cx + radius * Math.cos(-midAngle * RADIAN) * 1.07;
        const y = cy + radius * Math.sin(-midAngle * RADIAN) * 1.07;
        return percent > 0.02 ? (
            <text
                x={x}
                y={y}
                fill="#333"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                fontSize="12px"
                fontWeight="500"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        ) : null;
    };

    useEffect(() => {
        console.log('EventGenresChart - Events received:', events?.length || 0);

        const getData = () => {
            const data = genres.map(genre => {
                const filteredEvents = events.filter(event => event.summary && event.summary.includes(genre));
                return {
                    name: genre,
                    value: filteredEvents.length
                };
            }).filter(item => item.value > 0); // Only show genres that have events
            return data;
        };

        const chartData = getData(); console.log('EventGenresChart - Chart data:', chartData);
        setData(chartData);
    }, [events]);

    // Debug: show data info
    if (!data || data.length === 0) {
        return (
            <div style={{ width: '100%', minWidth: '500px', height: 400, border: '2px solid #ddd', borderRadius: '8px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <p>No chart data available. Events: {events?.length || 0}</p>
            </div>
        );
    }

    return (
        <div style={{ width: '100%', minWidth: '450px', height: 500, border: '2px solid #ddd', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height={420}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        fill="#8884d8"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={160}
                        cx="50%"
                        cy="50%"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Pie>
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        wrapperStyle={{
                            paddingTop: '20px',
                            fontSize: '14px'
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

EventGenresChart.propTypes = {
    events: PropTypes.array.isRequired
};

export default EventGenresChart;