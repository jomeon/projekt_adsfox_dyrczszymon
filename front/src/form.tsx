import React, { useEffect, useState } from 'react';
import {DataItem} from "./PieChart.tsx";

interface ChannelData {
    id: number;
    source: string;
    customers: number;
}
interface FormProps {
    updateChartData: (data:DataItem[]) => void;
}

const Form: React.FC<FormProps> = ({updateChartData}) => {
    const [channels, setChannels] = useState<ChannelData[]>([]);
    const [formData, setFormData] = useState<ChannelData>({
        id: 0,
        source: '',
        customers: 0,
    });


    useEffect(() => {
        // Pobranie danych z backendu przy załadowaniu komponentu
        fetchChannels();
    }, []);

    const fetchChannels = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/getChannels'); // Wywołanie REST API z adresu /api/channels
            const data = await response.json();
            setChannels(data);
            const updatedChartData = data.map((item: ChannelData) => ({
                source: item.source,
                customers: item.customers,
            }));
            updateChartData(updatedChartData);
        } catch (error) {
            console.error('Błąd podczas pobierania kanałów:', error);
        }
    };
    const createChannel = async () => {

        try {
            if(channels.find(channel => channel.source == formData.source))
            {
                console.log('Channel already exists');
                return null;
            }
            const response = await fetch('http://127.0.0.1:8000/api/createChannels', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            setChannels([...channels, data]);
            fetchChannels();
            setFormData({ id: 0, source: '', customers: 0 }); // Zresetuj formularz po dodaniu kanału
        } catch (error) {
            console.error('Błąd podczas tworzenia kanału:', error);
        }
    };

    const deleteChannel = async (channelId: number) => {
        try {
            await fetch(`http://127.0.0.1:8000/api/deleteChannels/${channelId}`, {
                method: 'DELETE',
            });
            setChannels(channels.filter((channel) => channel.id !== channelId));
            fetchChannels();
        } catch (error) {
            console.error('Błąd podczas usuwania kanału:', error);
        }
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'customers' && !isNaN(Number(value)) && Number(value) >= 0) {
            setFormData(prevData => {
                return ({
                    ...prevData,
                    [name]: Number(value),
                });
            });
        }
        else if(name==='source'){
            setFormData(prevData => ({
                ...prevData,
                [name]: value,
            }));
        }
        fetchChannels();
    };





    const handleUpdate = async (id: number, updatedCustomers: number) => {
        if(updatedCustomers<0){
            return;
        }
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/updateChannels/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ customers: updatedCustomers }),
            });

            if (response.ok) {
                setChannels(prevChannels =>
                    prevChannels.map(channel => {
                        if (channel.id === id) {
                            return { ...channel, customers: updatedCustomers };
                        }
                        return channel;
                    })
                );

                fetchChannels();

            } else {

            }
        } catch (error) {
            console.error('Błąd podczas aktualizacji kanału:', error);
        }
    };

    return (
        <div>
            <h2>Formularz</h2>
                <div>
                    <label htmlFor="source">Źródło:</label>
                    <input
                        type="text"
                        id="source"
                        name="source"
                        value={formData.source}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="customers">Liczba pozyskanych klientów:</label>
                    <input
                        type="number"
                        id="customers"
                        name="customers"
                        value={formData.customers}
                        onChange={handleChange}
                    />
                </div>
                <button onClick={createChannel} type="submit">Dodaj</button>

            <h2>Kanały pozyskania klienta</h2>
            {channels.length > 0 ? (
                <ul>
                    {channels.map(channel => (
                        <li key={channel.id}>
                            {channel.source} - {channel.customers} klientów
                            <button onClick={() => handleUpdate(channel.id, channel.customers + 1)}>
                                +1
                            </button>
                            <button onClick={() => handleUpdate(channel.id, channel.customers - 1)}>
                                -1
                            </button>
                            <button onClick={() => deleteChannel(channel.id)}>Usuń</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Brak kanałów pozyskania klienta.</p>
            )}
        </div>
    );
};

export default Form;
