import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Form = () => {
    const streetRef = useRef();
    const houseNumberRef = useRef();
    const [dangerLevel, setDangerLevel] = useState('средняя');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const newFire = {
            street: streetRef.current.value,
            houseNumber: houseNumberRef.current.value,
            status: 'в обработке',
            dangerLevel,
            timestamp: new Date().toISOString(),
            hidden: false
        };

        try {
            await axios.post('http://localhost:5000/fires', newFire);
            navigate('/');
        } catch (error) {
            console.error('Ошибка добавления:', error);
        }
    };

    return (
        <div>
            <h2>Сообщить о новом пожаре</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Улица:</label>
                    <input 
                        type="text" 
                        ref={streetRef} 
                        required 
                    />
                </div>
                
                <div>
                    <label>Номер дома:</label>
                    <input 
                        type="text" 
                        ref={houseNumberRef} 
                        required 
                    />
                </div>
                
                <div>
                    <label>Степень опасности:</label>
                    <select 
                        value={dangerLevel}
                        onChange={(e) => setDangerLevel(e.target.value)}
                    >
                        <option value="низкая">Низкая</option>
                        <option value="средняя">Средняя</option>
                        <option value="высокая">Высокая</option>
                        <option value="критическая">Критическая</option>
                    </select>
                </div>
                
                <button type="submit">Отправить</button>
            </form>
        </div>
    );
};

export default Form;