import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
    const [fires, setFires] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/fires');
                const visibleFires = response.data.filter(fire => !fire.hidden);
                setFires(visibleFires);

                visibleFires.forEach(fire => {
                    if (fire.status === "в обработке") {
                        setTimeout(async () => {
                            try {
                                await axios.patch(`http://localhost:5000/fires/${fire.id}`, {
                                    status: "бригада в пути"
                                });
                                setFires(prev => prev.map(f => 
                                    f.id === fire.id ? {...f, status: "бригада в пути"} : f
                                ));
                            } catch (error) {
                                console.error('Ошибка обновления статуса:', error);
                            }
                        }, 6000);
                    }
                });
            } catch (error) {
                console.error('Ошибка загрузки:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/fires/${id}`);
            setFires(prev => prev.filter(fire => fire.id !== id));
        } catch (error) {
            console.error('Ошибка удаления:', error);
        }
    };

    if (loading) return <div>Загрузка...</div>;

    return (
        <div className="container">
            <h1>Активные пожары</h1>
            
            {fires.length === 0 ? (
                <div>
                    <p>Нет активных пожаров</p>
                    <Link to="/add">Добавить пожар</Link>
                </div>
            ) : (
                <>
                    <ul>
                        {fires.map(fire => (
                            <li key={fire.id}>
                                <div>
                                    <strong>Адрес:</strong> {fire.street}, {fire.houseNumber}
                                </div>
                                <div>
                                    <strong>Статус:</strong> {fire.status}
                                </div>
                                <div>
                                    <strong>Опасность:</strong> {fire.dangerLevel}
                                </div>
                                <button onClick={() => handleDelete(fire.id)}>Удалить</button>
                                <Link to={`/detail/${fire.id}`}>Подробнее</Link>
                            </li>
                        ))}
                    </ul>
                    <Link to="/add">Добавить новый пожар</Link>
                </>
            )}
        </div>
    );
};

export default Home;