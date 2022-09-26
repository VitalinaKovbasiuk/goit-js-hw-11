// Для HTTP-запитів використана бібліотека axios.
// import axios from "axios";
// axios.get('/users')
//   .then(res => {
//     console.log(res.data);
//   });

// $ npm install axios

// Використовується синтаксис async/await.
// Для повідомлень використана бібліотека notiflix.

// npm i notiflix

// all modules
// import Notiflix from 'notiflix';
// one by one
// import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import { Report } from 'notiflix/build/notiflix-report-aio';
// import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
// import { Loading } from 'notiflix/build/notiflix-loading-aio';
// import { Block } from 'notiflix/build/notiflix-block-aio';

// Код відформатований за допомогою Prettier.

// !Завдання - пошук зображень
// Створи фронтенд частину застосунку пошуку і перегляду зображень за ключовим словом. 
// Додай оформлення елементів інтерфейсу. 
// Подивись демо-відео роботи застосунку.

// !Форма пошуку
// Форма спочатку міститья в HTML документі. 
// Користувач буде вводити рядок для пошуку у текстове поле, 
// а по сабміту форми необхідно виконувати HTTP-запит.

// <form class="search-form" id="search-form">
//   <input
//     type="text"
//     name="searchQuery"
//     autocomplete="off"
//     placeholder="Search images..."
//   />
//   <button type="submit">Search</button>
// </form>

// !HTTP-запити
// Для бекенду використовуй публічний API сервісу Pixabay. 
//pixabay.com/api/

// user_id:30167991 

// Your API key: 30167991-7ee84147a11351fc2ac43bf2c

// Зареєструйся, 
// отримай свій унікальний ключ доступу і ознайомся з документацією.


// Список параметрів рядка запиту, які тобі обов'язково необхідно вказати:

// key - твій унікальний ключ доступу до API.
// q - термін для пошуку. Те, що буде вводити користувач.
// image_type - тип зображення. На потрібні тільки фотографії, тому постав значення photo.
// orientation - орієнтація фотографії. Постав значення horizontal.
// safesearch - фільтр за віком. Постав значення true.
// У відповіді буде масив зображень, що задовольнили критерії параметрів запиту. 
// Кожне зображення описується об'єктом, з якого тобі цікаві тільки наступні властивості:

// webformatURL - посилання на маленьке зображення для списку карток.
// largeImageURL - посилання на велике зображення.
// tags - рядок з описом зображення. Підійде для атрибуту alt.
// likes - кількість лайків.
// views - кількість переглядів.
// comments - кількість коментарів.
// downloads - кількість завантажень.
// Якщо бекенд повертає порожній масив, значить нічого підходящого не було знайдено. 
// У такому разі показуй повідомлення з текстом 
// "Sorry, there are no images matching your search query. Please try again.". 
// Для повідомлень використовуй бібліотеку notiflix.

// !Галерея і картка зображення
// Елемент div.gallery спочатку міститься в HTML документі, 
// і в нього необхідно рендерити розмітку карток зображень. 
// Під час пошуку за новим ключовим словом необхідно повністю очищати вміст галереї, 
// щоб не змішувати результати.

// <div class="gallery">
//   <!-- Картки зображень -->
// </div>

// Шаблон розмітки картки одного зображення для галереї.

// <div class="photo-card">
//   <img src="" alt="" loading="lazy" />
//   <div class="info">
//     <p class="info-item">
//       <b>Likes</b>
//     </p>
//     <p class="info-item">
//       <b>Views</b>
//     </p>
//     <p class="info-item">
//       <b>Comments</b>
//     </p>
//     <p class="info-item">
//       <b>Downloads</b>
//     </p>
//   </div>
// </div>

// !Пагінація
// Pixabay API підтримує пагінацію і надає параметри page і per_page. 
// Зроби так, щоб в кожній відповіді приходило 40 об'єктів (за замовчуванням 20).

// Початкове значення параметра page повинно бути 1.
// З кожним наступним запитом, його необхідно збільшити на 1.
// У разі пошуку за новим ключовим словом, значення page потрібно повернути до початкового, 
// оскільки буде пагінація по новій колекції зображень.
// HTML документ вже містить розмітку кнопки, по кліку на яку, 
// необхідно виконувати запит за наступною групою зображень і додавати розмітку 
// до вже існуючих елементів галереї.

// <button type="button" class="load-more">Load more</button>

// В початковому стані кнопка повинна бути прихована.
// Після першого запиту кнопка з'являється в інтерфейсі під галереєю.
// При повторному сабміті форми кнопка спочатку ховається, 
// а після запиту знову відображається.
// У відповіді бекенд повертає властивість totalHits - загальна кількість зображень, 
// які відповідають критерію пошуку (для безкоштовного акаунту). 
// Якщо користувач дійшов до кінця колекції, ховай кнопку і виводь повідомлення з текстом 
// "We're sorry, but you've reached the end of search results.".


import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import PixabayApiService from './js/pixabay';
import LoadMoreBtn from './js/load-more-btn';

// Описаний в документації
import SimpleLightbox from 'simplelightbox';
// npm install simplelightbox
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';


const refs = {
  searchForm: document.querySelector('.search-form'),
  searchInput: document.querySelector('.search-input'),
  searchBtn: document.querySelector('search-btn'),
  galleryCards: document.querySelector('.gallery'),
  body: document.querySelector('body'),
};
refs.body.style.backgroundColor = '#e2e0dc';

const pixabayApiService = new PixabayApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});
loadMoreBtn.refs.button.hidden = true;

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetnchArticles);

function onSearch(event) {
  event.preventDefault();

  pixabayApiService.query = event.currentTarget.elements.query.value;
  clearArticlesContainer();

  if (pixabayApiService.query === '') {
    Notify.info('Please, write something...');
  } else {
    clearArticlesContainer();

    loadMoreBtn.Show();
    pixabayApiService.resetPage();
    loadMoreBtn.refs.button.hidden = false;
    Notify.success('Here are the images we were able to find!');
    fetnchArticles();
  }
}

function fetnchArticles() {
  loadMoreBtn.disable();
  pixabayApiService.fetchArticles().then(hits => {
    createGalleryMarkup(hits);
    loadMoreBtn.enable();
  });
}

function createGalleryMarkup(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
    <div class="photo-card">
      <a href="${largeImageURL}">
        <img
          class="photo-card__img"
          src="${largeImageURL}" 
          alt="${tags}" 
          loading="lazy" 
          width="320"
          height="212"
        />
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          <span>${likes}</span>
        </p>
        <p class="info-item">
          <b>Views</b>
          <span>${views}</span>
        </p>
        <p class="info-item">
          <b>Comments</b>
          <span>${comments}</span>
        </p>
        <p class="info-item">
          <b>Downloads</b>
          <span>${downloads}</span>
        </p>
      </div>
    </div>
    `;
      }
    )
    .join('');

  refs.galleryCards.insertAdjacentHTML('beforeend', markup);
  gallery.refresh();
}

function clearArticlesContainer() {
  refs.galleryCards.innerHTML = '';
}

var gallery = new SimpleLightbox('.gallery a', {
  /* options */
});



// import ImagesApiService from './js/images-service';
// // import LoadMoreBtn from './js/load-more';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';
// import { Notify } from 'notiflix/build/notiflix-notify-aio';

// const refs = {
//   galleryContainer: document.querySelector('.gallery'),
//   searchForm: document.querySelector('.search-form'),
//   toTopBtn: document.querySelector('.to-top'),
//   wrapper: document.querySelector('.wrapper'),
// };

// const imagesApiService = new ImagesApiService();
// const gallery = new SimpleLightbox('.gallery a');
// // const loadMoreBtn = new LoadMoreBtn({
// //   selector: '.load-more',
// //   hidden: true,
// // });
// const optionsForObserver = {
//   rootMargin: '250px',
// };
// const observer = new IntersectionObserver(onEntry, optionsForObserver);

// // observer.observe(refs.wrapper);
// refs.searchForm.addEventListener('submit', onSearch);
// refs.toTopBtn.addEventListener('click', onTopScroll);
// // loadMoreBtn.refs.button.addEventListener('click', onLoadMore);
// window.addEventListener('scroll', onScrollToTopBtn);

// function onSearch(e) {
//   e.preventDefault();

//   imagesApiService.query = e.currentTarget.elements.searchQuery.value.trim();

//   imagesApiService.resetLoadedHits();
//   imagesApiService.resetPage();
//   // loadMoreBtn.show();
//   // loadMoreBtn.disable();
//   clearGelleryContainer();

//   if (!imagesApiService.query) {
//     return erorrQuery();
//   }

//   imagesApiService.fetchImages().then(({ hits, totalHits }) => {
//     if (!hits.length) {
//       // setTimeout(() => {
//       //   loadMoreBtn.hide();
//       // }, 1_500);

//       return erorrQuery();
//     }

//     observer.observe(refs.wrapper);
//     // loadMoreBtn.enable();
//     imagesApiService.incrementLoadedHits(hits);
//     createGalleryMarkup(hits);
//     accessQuery(totalHits);
//     gallery.refresh();

//     if (hits.length === totalHits) {
//       // loadMoreBtn.hide();
//       observer.unobserve(refs.wrapper);
//       endOfSearch();
//     }
//   });

//   observer.unobserve(refs.wrapper);
// }

// function onEntry(entries) {
//   entries.forEach(entry => {
//     if (entry.isIntersecting && imagesApiService.query) {
//       imagesApiService
//         .fetchImages()
//         .then(({ hits, totalHits }) => {
//           imagesApiService.incrementLoadedHits(hits);
//           if (totalHits <= imagesApiService.loadedHits) {
//             observer.unobserve(refs.wrapper);
//             endOfSearch();
//           }

//           createGalleryMarkup(hits);
//           smoothScrollGallery();
//           gallery.refresh();
//         })
//         .catch(error => {
//           console.warn(`${error}`);
//         });
//     }
//   });
// }



// function accessQuery(totalHits) {
//   Notify.success(`Hooray! We found ${totalHits} images.`);
// }

// function endOfSearch() {
//   Notify.info("We're sorry, but you've reached the end of search results.");
// }

// function erorrQuery() {
//   Notify.failure('Sorry, there are no images matching your search query. Please try again.');
// }

// function clearGelleryContainer() {
//   refs.galleryContainer.innerHTML = '';
// }

// function createGalleryMarkup(images) {
//   const markup = images
//     .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
//       return `
//     <div class="photo-card">
//       <a href="${webformatURL}">
//         <img
//           class="photo-card__img"
//           src="${largeImageURL}" 
//           alt="${tags}" 
//           loading="lazy" 
//           width="320"
//           height="212"
//         />
//       </a>
//       <div class="info">
//         <p class="info-item">
//           <b>Likes</b>
//           <span>${likes}</span>
//         </p>
//         <p class="info-item">
//           <b>Views</b>
//           <span>${views}</span>
//         </p>
//         <p class="info-item">
//           <b>Comments</b>
//           <span>${comments}</span>
//         </p>
//         <p class="info-item">
//           <b>Downloads</b>
//           <span>${downloads}</span>
//         </p>
//       </div>
//     </div>
//     `;
//     })
//     .join('');

//   refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
// }

// function onScrollToTopBtn() {
//   const offsetTrigger = 100;
//   const pageOffset = window.pageYOffset;

//   pageOffset > offsetTrigger
//     ? refs.toTopBtn.classList.remove('is-hidden')
//     : refs.toTopBtn.classList.add('is-hidden');
// }

// function onTopScroll() {
//   window.scrollTo({
//     top: 0,
//     behavior: 'smooth',
//   });
// }

// function smoothScrollGallery() {
//   const { height } = refs.galleryContainer.firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: height * 2,
//     behavior: 'smooth',
//   });
// }