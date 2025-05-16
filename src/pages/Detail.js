import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Detail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [fire, setFire] = useState(null);

    const handleStatusChange = async (newStatus) => {
        try {
            await axios.patch(`http://localhost:5000/fires/${id}`, {
                status: newStatus
            });
            setFire(prev => ({...prev, status: newStatus}));
        } catch (error) {
            console.error('Ошибка изменения статуса:', error);
        }
    };

    useEffect(() => {
        const fetchFire = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/fires/${id}`);
                setFire(response.data);
            } catch (error) {
                console.error('Ошибка загрузки:', error);
            }
        };
        fetchFire();
    }, [id]);

    if (!fire) return <div>Загрузка...</div>;

    return (
        <div>
            <h1>Детали пожара</h1>
            <div>
                <strong>Адрес:</strong> {fire.street}, {fire.houseNumber}
            </div>
            <div>
                <strong>Статус:</strong> {fire.status}
            </div>
            <div>
                <strong>Уровень опасности:</strong> {fire.dangerLevel}
            </div>
            
            <h3>Изменить статус:</h3>
            <div>
                <button onClick={() => handleStatusChange("в обработке")}>
                    В обработке
                </button>
                <button onClick={() => handleStatusChange("бригада в пути")}>
                    Бригада в пути
                </button>
                <button onClick={() => handleStatusChange("тушение")}>
                    Тушение
                </button>
                <button onClick={() => handleStatusChange("потушен")}>
                    Потушен
                </button>
                <button onClick={() => handleStatusChange("ложный вызов")}>
                    Ложный вызов
                </button>
            </div>
            
            <button onClick={() => navigate('/')}>Назад к списку</button>
        </div>
    );
};

export default Detail;