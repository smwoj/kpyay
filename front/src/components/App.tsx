import * as React from "react";
import {useLayoutEffect, useState} from "react";
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
    color: string,
}

const Chart: React.FC<ChartProps> = (props: ChartProps) => {
    return <div className="chartBox">
        <LineChart width={props.width} height={props.height} data={props.data}>
            <XAxis dataKey="name"/>
            <YAxis/>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
            <Line type="monotone" dataKey="uv" stroke="#8884d8"/>
            <Line type="monotone" dataKey="pv" stroke="#82ca9d"/>
        </LineChart>
    </div>
};

function useWindowSize() {
    const [size, setSize] = useState([0, 0]);

    useLayoutEffect(() => {
        const updateSize = () => {
            setSize([window.innerWidth, window.innerHeight]);
        };
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    return size;
}

const App: React.Component<{}, {}> = () => {
    const [width, height] = useWindowSize();

    const chartWidth = width > 800 ? width / 2 : width;
    const chartHeight = height >= 300 ? 300: height;

    return (
        <div className="App">
            <header className="App-header">
                <br/>
                <Chart width={chartWidth} height={chartHeight} data={data} color={"red"}/>
                <Chart width={chartWidth} height={chartHeight} data={data} color={"red"}/>
            </header>
        </div>
    );
};

export default App;
