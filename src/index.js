// Створи фронтенд частину програми пошуку даних про країну за її частковою або повною назвою. 
// Подивися демо-відео роботи програми.
// Для HTTP-запитів використана бібліотека axios.

// https://axios-http.com/

// $ npm install axios

// Using jsDelivr CDN:
// <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
// Using unpkg CDN:
// <script src="https://unpkg.com/axios/dist/axios.min.js"></script>

// import axios from "axios";
// axios.get('/users')
//   .then(res => {
//     console.log(res.data);
//   });

// Використовується синтаксис async/await.
// Для повідомлень використана бібліотека notiflix.

// npm i notiflix

// Import
// all modules
// import Notiflix from 'notiflix';

// one by one
// import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import { Report } from 'notiflix/build/notiflix-report-aio';
// import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
// import { Loading } from 'notiflix/build/notiflix-loading-aio';
// import { Block } from 'notiflix/build/notiflix-block-aio';

// CSS and JS
// <link rel="stylesheet" href="dist/notiflix-3.2.5.min.css" />
// <script src="dist/notiflix-3.2.5.min.js"></script>


// !HTTP-запит
// Використовуй публічний API Rest Countries v2, 
// https://restcountries.com/
// а саме ресурс name, 
// https://restcountries.com/v3.1/name/{name}
// https://restcountries.com/v3.1/name/peru
// https://restcountries.com/v3.1/name/united
// який повертає масив об'єктів країн, 
// що задовольнили критерій пошуку. Додай мінімальне оформлення елементів інтерфейсу.

// Напиши функцію fetchCountries(name), яка робить HTTP-запит на ресурс name і повертає 
// проміс з масивом країн - результатом запиту. Винеси її в окремий файл fetchCountries.js 
// і зроби іменований експорт.

// !Фільтрація полів
// У відповіді від бекенду повертаються об'єкти, велика частина властивостей яких, тобі не знадобиться. Щоб скоротити обсяг переданих даних, додай рядок параметрів запиту - таким чином цей бекенд реалізує фільтрацію полів. Ознайомся з документацією синтаксису фільтрів.

// Тобі потрібні тільки наступні властивості:
// name.official - повна назва країни
// capital - столиця
// population - населення
// flags.svg - посилання на зображення прапора
// languages - масив мов


// !Поле пошуку
// Назву країни для пошуку користувач вводить у текстове поле input#search-box. 
// HTTP-запити виконуються при введенні назви країни, тобто на події input. 
// Але робити запит з кожним натисканням клавіші не можна, 
// оскільки одночасно буде багато запитів і вони будуть виконуватися в непередбачуваному порядку.
// Необхідно застосувати прийом Debounce на обробнику події і робити HTTP-запит через 300мс після того, 
// як користувач перестав вводити текст. Використовуй пакет lodash.debounce.

// lodash.debounce v4.0.8
// Using npm:
// $ {sudo -H} npm i -g npm
// $ npm i --save lodash.debounce

// In Node.js:
// var debounce = require('lodash.debounce');

// Якщо користувач повністю очищає поле пошуку, то HTTP-запит не виконується, 
// а розмітка списку країн або інформації про країну зникає.

// Виконай санітизацію введеного рядка методом trim(), це вирішить проблему, 
// коли в полі введення тільки пробіли, або вони є на початку і в кінці рядка.


// !Інтерфейс
// Якщо у відповіді бекенд повернув більше ніж 10 країн, в інтерфейсі 
// з'являється повідомлення про те, що назва повинна бути специфічнішою. 
// Для повідомлень використовуй бібліотеку notiflix і виводь такий рядок 
// "Too many matches found. Please enter a more specific name.".

// Якщо бекенд повернув від 2-х до 10-и країн, під тестовим полем відображається список знайдених країн. 
// Кожен елемент списку складається з прапора та назви країни.

// Якщо результат запиту - це масив з однією країною, 
// в інтерфейсі відображається розмітка картки з даними про країну: 
// прапор, назва, столиця, населення і мови.

// !Обробка помилки
// Якщо користувач ввів назву країни, якої не існує, бекенд поверне не порожній масив, 
// а помилку зі статус кодом 404 - не знайдено. Якщо це не обробити, 
// то користувач ніколи не дізнається про те, що пошук не дав результатів. Додай повідомлення 
// "Oops, there is no country with that name" у разі помилки, використовуючи бібліотеку notiflix.

// !УВАГА
// Не забувай про те, що fetch не вважає 404 помилкою, 
// тому необхідно явно відхилити проміс, щоб можна було зловити і обробити помилку.


import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const refs = {
  inputBox: document.querySelector('#search-box'),
  countriList: document.querySelector('.country-list'),
  countriInfo: document.querySelector('.country-info'),
};

refs.inputBox.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(e) {
  const countryName = e.target.value.trim();

  if (!countryName) {
    clearTemplate();
    return;
  }

  fetchCountries(countryName)
    .then(data => {
      if (data.length > 10) {
        specificNameInfo();
        clearTemplate();
        return;
      }
      renderTemplate(data);
    })
    .catch(error => {
      clearTemplate();
      errorWarn();
    });
}

function errorWarn() {
    Notify.failure(`Oops, there is no country with that name`);
  }

  function specificNameInfo() {
    Notify.info(`Too many matches found. Please enter a more specific name.`);
  }

function clearTemplate() {
    refs.countriInfo.innerHTML = '';
    refs.countriList.innerHTML = '';
  }

function renderTemplate(elements) {
  let template = '';
  let refsTemplate = '';
  clearTemplate();

  if (elements.length === 1) {
    template = createItem(elements);
    refsTemplate = refs.countriInfo;
  } else {
    template = createList(elements);
    refsTemplate = refs.countriList;
  }

  drawTemplate(refsTemplate, template);
}

function createItem(element) {
  return element.map(
    ({ name, capital, population, flags, languages }) =>
      `
      <img
        src="${flags.svg}" 
        alt="${name.official}" 
        width="80" 
        height="50">
      <h1 class="country-info__title">${name.official}</h1>
      <ul class="country-info__list">
          <li class="country-info__item">
          <span>Capital:</span>
        ${capital}
          </li>
          <li class="country-info__item">
          <span>Population:</span>
          ${population}
          </li>
          <li class="country-info__item">
          <span>Lenguages:</span>
          ${Object.values(languages)}
          </li>
      </ul>
  `
  );
}

function createList(elements) {
  return elements
    .map(
      ({ name, flags }) => `
      <li class="country-list__item">
        <img class="country-list__img" 
          src="${flags.svg}" 
          alt="${name.official}" 
          width="50" 
          height="50">
        ${name.official}
      </li>`
    )
    .join('');
}

function drawTemplate(refs, markup) {
  refs.innerHTML = markup;
}