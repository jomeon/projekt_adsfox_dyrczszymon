/**
 * @jest-environment jsdom
 */

import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import App from '../App';
import '@testing-library/jest-dom'
import PieChart from "../PieChart.tsx";
import Form, {ChannelData} from "../form.tsx";

global.ResizeObserver = require('resize-observer-polyfill')

const mockData: ChannelData[] = [
    { id: 0, source: 'A', customers: 10 },
    { id: 1, source: 'B', customers: 20 },
    { id: 2, source: 'C', customers: 30 },
];
test('renders App component', () => {
    render(<App />);
    expect(screen.getByText('Pie Chart Example')).toBeInTheDocument();
});

test('displays pie chart', () => {
    render(<PieChart data={mockData} />);
    expect(document.getElementsByTagName('canvas')[0]).toBeInTheDocument();
});

test('displays data under form', () => {
    render(<Form channels={mockData} createChannel={async ()=>{}}
                 updateChannel={async ()=>{}} deleteChannel={async ()=>{}}
                 formData={{id: 0, source: '', customers: 0}} setFormData={()=>{}}
    />);
    const clients = document.getElementsByTagName('li');
    expect(clients.length === 3);
    expect(clients[0].innerHTML.includes('A - 10 klientów'));
    expect(clients[1].innerHTML.includes('B - 20 klientów'));
    expect(clients[2].innerHTML.includes('C - 30 klientów'));
});


test('properly handles lack of data', () => {
    render(<Form channels={[]} createChannel={async ()=>{}}
                 updateChannel={async ()=>{}} deleteChannel={async ()=>{}}
                 formData={{id: 0, source: '', customers: 0}} setFormData={()=>{}}
    />);
    const clients = document.getElementsByTagName('li');
    expect(clients.length === 0);
    expect(document.getElementsByTagName('p')[0].innerText === 'Brak kanałów pozyskania klienta.');
    expect(document.getElementsByTagName('canvas').length === 0);
});

test('prevents invalid numbers from being entered', () => {
    render(<Form channels={[]} createChannel={async ()=>{}}
                 updateChannel={async ()=>{}} deleteChannel={async ()=>{}}
                 formData={{id: 0, source: '', customers: 0}} setFormData={()=>{}}
    />);

    const input_field = document.getElementById('customers');
    expect(input_field).toBeInTheDocument();

    fireEvent.change(input_field!, {target: {value: '-32'}});
    expect(input_field!.getAttribute('value') === '0');
    fireEvent.change(input_field!, {target: {value: 'abc'}});
    expect(input_field!.getAttribute('value') === '0');
});

test('accepts valid integers in the form', () => {
    render(<Form channels={[]} createChannel={async ()=>{}}
                 updateChannel={async ()=>{}} deleteChannel={async ()=>{}}
                 formData={{id: 0, source: '', customers: 0}} setFormData={()=>{}}
    />);

    const input_field = document.getElementById('customers');
    expect(input_field).toBeInTheDocument();

    fireEvent.change(input_field!, {target: {value: '32'}})
    expect(input_field!.getAttribute('value') === '32')
    fireEvent.change(input_field!, {target: {value: '110'}})
    expect(input_field!.getAttribute('value') === '110')


});