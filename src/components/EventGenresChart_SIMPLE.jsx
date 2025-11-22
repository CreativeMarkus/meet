import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip
} from 'recharts';

const EventGenresChart = () => {
    const data = [
        { name: 'React', value: 18 },
        { name: 'JavaScript', value: 18 },
        { name: 'AngularJS', value: 2 },
        { name: 'jQuery', value: 1 },
        { name: 'Node', value: 1 }
    ];

    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

    return (
        <div style={{ width: '100%', height: '400px', backgroundColor: '#f9f9f9' }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
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

export default EventGenresChart;