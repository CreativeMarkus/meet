import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip
} from 'recharts';

const EventGenresChart = ({ events }) => {
    const [data, setData] = useState([]);
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

    useEffect(() => {
        const genres = ['React', 'JavaScript', 'Node', 'jQuery', 'AngularJS'];
        const chartData = genres.map((genre) => {
            const count = events.filter((event) =>
                event.summary && event.summary.includes(genre)
            ).length;
            return { name: genre, value: count };
        }).filter(item => item.value > 0);


        setData(chartData);
    }, [events]);

    return (
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

EventGenresChart.propTypes = {
    events: PropTypes.array.isRequired
};

export default EventGenresChart;