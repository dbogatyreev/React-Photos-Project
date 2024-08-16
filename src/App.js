import React, { useEffect, useState } from 'react';
import './index.scss';
import { Collection } from './Collection';

const cats = [
  { "name": "Все" },
  { "name": "Море" },
  { "name": "Горы" },
  { "name": "Архитектура" },
  { "name": "Города" }
]

function App() {
  const [categoryId, setCategoryId] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    fetch(`https://66bf423542533c4031459db1.mockapi.io/CollectionsPhoto?`)
      .then((res) => res.json())
      .then((json) => {
        if (json.length > 0) {
          setCollections(json[0].collections);
        } else {
          console.warn('Получен пустой массив данных');
        }
      })
      .catch((err) => {
        console.warn(err);
        alert('Ошибка при получении данных');
      })
  }, [categoryId]);

  return (
    <div className="App">
      <h1>Моя коллекция фотографий</h1>
      <div className="top">
        <ul className="tags">
          {cats.map((obj, i) =>
            <li
              onClick={() => setCategoryId(i)}
              className={categoryId === i ? 'active' : ''}
              key={obj.name}>
              {obj.name}
            </li>
          )}
        </ul>
        <input value={searchValue} onChange={e => setSearchValue(e.target.value)} className="search-input" placeholder="Поиск по названию" />
      </div>
      <div className="content">
        {collections.filter(obj => obj.name.toLowerCase().includes(searchValue.toLocaleLowerCase()))
          .map((obj) => (
            <Collection key={obj.id} name={obj.name} images={obj.photos} />
          ))}
      </div>
      <ul className="pagination">
        <li>1</li>
        <li className="active">2</li>
        <li>3</li>
      </ul>
    </div>
  );
}

export default App;
