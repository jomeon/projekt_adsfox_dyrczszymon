import React from 'react';

export interface ChannelData {
    id: number;
    source: string;
    customers: number;
}
interface FormProps {
    channels: ChannelData[];
    createChannel: () => Promise<void>;
    updateChannel: (id: number, updatedCustomers: number) => Promise<void>;
    deleteChannel: (channelId: number) => Promise<void>;
    formData: ChannelData;
    setFormData:  React.Dispatch<React.SetStateAction<ChannelData>>;
}

const Form: React.FC<FormProps> = ({channels,
                                    createChannel,
                                    updateChannel,
                                    deleteChannel,
                                    formData,
                                   setFormData}) => {



    const onFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'customers') {
            let number = parseInt(value, 10);
            if (value === '') number = 0;
            if(isNaN(number) || number < 0) {
                setFormData(prevData => {
                    return prevData;
                });
                return;
            }
            setFormData(prevData => {
                return ({
                    ...prevData,
                    customers: number,
                });
            });
        }
        else if(name==='source'){
            setFormData(prevData => ({
                ...prevData,
                source: value,
            }));
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
                        onChange={onFormChange}
                    />
                </div>
                <div>
                    <label htmlFor="customers">Liczba pozyskanych klientów:</label>
                    <input
                        type="number"
                        id="customers"
                        name="customers"
                        value={formData.customers}
                        onChange={onFormChange}
                    />
                </div>
                <button onClick={createChannel} type="submit">Dodaj</button>

            <h2>Kanały pozyskania klienta</h2>
            {channels.length > 0 ? (
                <ul>
                    {channels.sort((a, b) => b.customers - a.customers).map(channel => (
                        <li key={channel.id}>
                            {channel.source} - {channel.customers} klientów
                            <button onClick={() => updateChannel(channel.id, channel.customers + 1)}>
                                +1
                            </button>
                            <button onClick={() => updateChannel(channel.id, channel.customers - 1)}>
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
