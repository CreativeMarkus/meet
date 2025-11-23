import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    ScatterChart,
    Scatter,
    XAxis, YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const CityEventsChart = ({ allLocations, events }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const getData = () => {
            const chartData = allLocations.map((location) => {
                const count = events.filter((event) => event.location === location).length
                const city = location.split((/, | - /))[0]
                return { city, count };
            }).filter(item => item.count > 0);
            return chartData;
        };

        setData(getData());
    }, [allLocations, events]);

    const isMobile = window.innerWidth < 480;
    const containerPadding = isMobile ? '10px' : '35px';

    return (
        <div style={{ width: '100%', height: isMobile ? 400 : 450, border: '2px solid #ddd', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: containerPadding, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height={isMobile ? 320 : 370}>
                <ScatterChart
                    margin={{
                        top: 30,
                        right: 30,
                        bottom: 80,
                        left: 30,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        type="category" dataKey="city" name="City"
                        angle={60} interval={0} tick={{ dx: 20, dy: 40, fontSize: window.innerWidth < 480 ? 10 : 14 }}
                    />
                    <YAxis type="number" dataKey="count" name="Number of events" allowDecimals={false} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Events" data={data} fill="#8884d8" />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
}

CityEventsChart.propTypes = {
    allLocations: PropTypes.array.isRequired,
    events: PropTypes.array.isRequired
};

export default CityEventsChart;