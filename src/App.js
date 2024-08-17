import React, { useEffect, useState } from 'react';
import './index.scss';
import { Collection } from './Collection';

const cats = [
  { "name": "Все", "id": 0 },
  { "name": "Море", "id": 1 },
  { "name": "Горы", "id": 2 },
  { "name": "Архитектура", "id": 3 },
  { "name": "Города", "id": 4 }
];

function App() {
  const [categoryId, setCategoryId] = useState(0);
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [collections, setCollections] = useState([]);

  const itemsPerPage = 3;  // Количество элементов на странице

  useEffect(() => {
    setIsLoading(true);
    fetch(`https://66bf423542533c4031459db1.mockapi.io/CollectionsPhoto`)
      .then((res) => res.json())
      .then((json) => {
        if (json.length > 0 && json[0].collections) {
          setCollections(json[0].collections);
        } else {
          console.warn('Получен пустой массив данных или неправильная структура данных');
        }
      })
      .catch((err) => {
        console.warn(err);
        alert('Ошибка при получении данных');
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Фильтрация коллекций по категории
  const filteredCollections = collections.filter(
    (obj) => categoryId === 0 || obj.category === categoryId
  );

  // Фильтрация по поисковому запросу
  const visibleCollections = filteredCollections.filter(
    (obj) => obj.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Определение начального и конечного индексов для текущей страницы
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCollections = visibleCollections.slice(startIndex, endIndex);

  return (
    <div className="App">
      <h1>Моя коллекция фотографий</h1>
      <div className="top">
        <ul className="tags">
          {cats.map((obj) =>
            <li
              onClick={() => setCategoryId(obj.id)}
              className={categoryId === obj.id ? 'active' : ''}
              key={obj.id}>
              {obj.name}
            </li>
          )}
        </ul>
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="search-input"
          placeholder="Поиск по названию"
        />
      </div>
      <div className="content">
        {isLoading ? (
          <h2>Идет загрузка...</h2>
        ) : (
          paginatedCollections.map((obj) => (
            <Collection key={obj.name} name={obj.name} images={obj.photos} />
          ))
        )}
      </div>
      <ul className="pagination">
        {[...Array(Math.ceil(visibleCollections.length / itemsPerPage))].map((_, i) => (
          <li
            key={i}
            onClick={() => setPage(i + 1)}
            className={page === i + 1 ? 'active' : ''}
          >
            {i + 1}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
