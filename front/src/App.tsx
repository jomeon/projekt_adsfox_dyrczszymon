import React, { useEffect, useState } from 'react';
import PieChart from './PieChart';
import './style.css';
import Form, {ChannelData} from "./form.tsx";
const App: React.FC = () => {

    const [channels, setChannels] = useState<ChannelData[]>([]);
    const [formData, setFormData] = useState<ChannelData>({
        id: 0,
        source: '',
        customers: 0,
    });


    useEffect(() => {
        fetchChannels();
    }, []);

    const fetchChannels = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/getChannels');
            const data = await response.json();
            setChannels(data);
        } catch (error) {
            console.error('Błąd podczas pobierania danych:', error);
        }
    };


    const createChannel = async () => {

        try {
            if(channels.some(channel => channel.source == formData.source))
            {
                console.log('Channel already exists');
                return;
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

    const updateChannel = async (id: number, updatedCustomers: number) => {
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
                <h1>adsfox intern</h1>
                {channels.some((channel) => channel.customers > 0) && <PieChart data={channels}/> }
                <Form channels={channels} createChannel={createChannel}
                      updateChannel={updateChannel} deleteChannel={deleteChannel}
                      formData={formData} setFormData={setFormData}/>
            </div>
        );

    };

export default App;