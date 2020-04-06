import * as React from "react";
import {useWindowSize} from '../hooks'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
} from 'recharts';


const data = [
    {
        name: 'A', uv: 4000, pv: 2400, amt: 2400,
    },
    {
        name: 'B', uv: 3000, pv: 1398, amt: 2210,
    },
    {
        name: 'C', uv: 2000, pv: 9800, amt: 2290,
    },
    {
        name: 'D', uv: 2780, pv: 3908, amt: 2000,
    },
    {
        name: 'E', uv: 1890, pv: 4800, amt: 2181,
    },
    {
        name: 'F', uv: 2390, pv: 3800, amt: 2500,
    },
    {
        name: 'G', uv: 3490, pv: 4300, amt: 2100,
    },
];


interface ChartProps {
    width: number,
    height: number,
    data: { uv: number, pv: number, name: string, amt: number }[],
}

const Chart: React.FC<ChartProps> = (props: ChartProps) => {
    return <div className="chartBox">
        <LineChart width={props.width} height={props.height} data={props.data}>
            <XAxis dataKey="name"/>
            <YAxis/>
            <CartesianGrid stroke="#eeeeee" strokeDasharray="5 5"/>
            <Line type="monotone" dataKey="uv" stroke="red"/>
            <Line type="monotone" dataKey="pv" stroke="#82ca9d"/>
        </LineChart>
    </div>
};

const App = () => {
    const [width, height] = useWindowSize();

    const chartWidth = width >= 600 ? 600 : width;
    const chartHeight = height >= 300 ? 300 : height;

    return (
        <div className="App">
            <header className="App-header">
                <br/>
                <Chart width={chartWidth} height={chartHeight} data={data}/>
                <Chart width={chartWidth} height={chartHeight} data={data}/>
            </header>
        </div>
    );
};

export default App;
