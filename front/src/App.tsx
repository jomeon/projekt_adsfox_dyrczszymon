import React, { useEffect, useState } from 'react';
import PieChart from './PieChart';
import './style.css';
import Form from "./form.tsx";
import {DataItem} from './PieChart';
const App: React.FC = () => {

    const [chartData, setChartData] = useState<DataItem[]>([]);

    useEffect(() => {
        fetchChartData();
    }, []);

    const fetchChartData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/getChannels');
            const data = await response.json();
            updateChartData(data);
        } catch (error) {
            console.error('Błąd podczas pobierania danych:', error);
        }
    };

    const updateChartData = (data: DataItem[]) => {

        setChartData(data);

    }
        return (
            <div>
                <h1>Pie Chart Example</h1>
                <PieChart data={chartData}/>
                <Form updateChartData={updateChartData}/>
            </div>
        );

    };

export default App;