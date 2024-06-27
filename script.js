'use strict';

const btnScrollTo = document.querySelector('.btn--scroll-to');
const sectiong1 = document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////learn-more smooth scrolling code

btnScrollTo.addEventListener('click', e => {
  const s1coords = sectiong1.getBoundingClientRect();
  window.scrollTo({
    left: s1coords.left + window.scrollX,
    top: s1coords.top + window.scrollY + 100,
    behavior: 'smooth',
  });
});

/////////////Page Navigation

document.querySelector('.nav__links').addEventListener('click', e => {
  e.preventDefault();
  console.log(e.target);
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    if (id !== '#')
      document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

/////////////Tab component

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content ');

tabsContainer.addEventListener('click', e => {
  // console.log(e.target.closest('.operations__tab'));
  const tab = e.target.closest('.operations__tab');
  //Guard clause
  if (!tab) return;
  // reomve active classes
  tabs.forEach(e => e.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  //activate tab
  tab.classList.add('operations__tab--active');
  //activate content
  document
    .querySelector(`.operations__content--${tab.dataset.tab}`)
    .classList.add('operations__content--active');
});

////////nav menu animationg

function menuOpacity(e) {
  if (
    e.target.classList.contains('nav__link') ||
    e.target.classList.contains('nav__logo')
  ) {
    const link = e.target;
    const sibling = e.target.closest('.nav').querySelectorAll('.nav__link');
    const logo = e.target.closest('.nav').querySelector('img');
    sibling.forEach(s => {
      if (link !== s) s.style.opacity = this;
    });
    if (link !== logo) logo.style.opacity = this;
  }
}

nav.addEventListener('mouseover', menuOpacity.bind(0.5));

nav.addEventListener('mouseout', menuOpacity.bind(1));

/////////////sticky navbar
const initialCoords = sectiong1.getBoundingClientRect();
const navHeight = nav.getBoundingClientRect().height;

const obsCallback = (entries, observer) => {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const options = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};
const observer = new IntersectionObserver(obsCallback, options);

observer.observe(header);

/////// reveal sections
const sectionAll = document.querySelectorAll('.section');

const revealSection = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

sectionAll.forEach(section => {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

/////////////lazy loading images
const imgTarge = document.querySelectorAll('img[data-src]');
const imgObserverCallback = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(imgObserverCallback, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTarge.forEach(img => imgObserver.observe(img));

////////////slider
function slider() {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotsContainer = document.querySelector('.dots');

  function createDots() {
    slides.forEach((_, i) => {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  }

  function goToSlide(slide) {
    activeDot(slide);
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  }

  function activeDot(slide) {
    currentSlide = slide;
    const dots = dotsContainer.querySelectorAll('.dots__dot');
    dots.forEach(d => d.classList.remove('dots__dot--active'));
    dots[slide].classList.add('dots__dot--active');
    // document
    //   .querySelector(`.dots__dot[data-slide="${slide}"]`)
    //   .classList.add('dots__dot--active');
  }

  let currentSlide = 0;
  const maxSlide = slides.length - 1;

  function nextSlide() {
    currentSlide === maxSlide ? (currentSlide = 0) : currentSlide++;
    goToSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide < 1 ? (currentSlide = maxSlide) : currentSlide--;
    goToSlide(currentSlide);
  }

  function init() {
    createDots();
    goToSlide(0);
  }

  init();

  ////////event handlers
  btnRight.addEventListener('click', nextSlide);

  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', e => {
    e.key === 'ArrowRight' && nextSlide();
    e.key === 'ArrowLeft' && prevSlide();
  });

  dotsContainer.addEventListener('click', e => {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      activeDot(slide);
      goToSlide(slide);
    }
  });
}

slider();

/////

// window.addEventListener('scroll', () => {
//   console.log(initialCoords);
//   if (window.scrollY > initialCoords.top)
//    nav.classList.add('sticky');
//   else {
//     nav.classList.remove('sticky');
//   }
// });

////////////lecture//////////

//Creating , Selecting and Removing elements

// const header = document.querySelector('.header');
// const div = document.createElement('div');
// div.classList.add('cookie-message');
// // div.textContent = "hello boy"
// div.innerHTML =
//   'We use Cookie for inprovment <button class="btn btn--close-cookie">Got it</button>';
// // header.prepend(div);
// // header.append(div.cloneNode(true));
// // header.after(div)
// header.before(div);
// document.querySelector('.btn--close-cookie').addEventListener('click', () => {
//   // div.remove();
//   div.parentElement.removeChild(div);
// });

// div.style.backgroundColor = '#37383d';
// div.style.width = '100%';
// div.style.height = Number.parseFloat(getComputedStyle(div).height,10) + 20 + 'px'

// document.documentElement.style.setProperty('--color-primary','orange')
//////////////

/*it will not work until u commet above div ele */
// header.insertAdjacentHTML(
//   'afterbegin',
//   `
// <div class="cookie-message">Hello <button class="btn btn--close-cookie">Remove</button></div>
// `
// );

// document.querySelector('.btn--close-cookie').addEventListener('click', () => {
//   document.querySelector('.cookie-message').remove();
// });

//////////////
// const logo = document.querySelector('.nav__logo');
// console.log(logo.classList.contains('c'));
// console.log(logo.className);

//////scroll
// const btnScrollTo = document.querySelector('.btn--scroll-to');
// const sectiong1 = document.querySelector('#section--1');

// btnScrollTo.addEventListener('click', e => {
//   const s1coords = sectiong1.getBoundingClientRect();
//   // console.log(e.target.getBoundingClientRect());
//   // console.log('current scroll h/w',window.pageXOffset,window.pageYOffset);
//   // console.log('current scroll h/w',window.scrollX,window.scrollY);
//   // console.log('viewport  x/y',document.documentElement.clientWidth,document.documentElement.clientHeight);

//   //scrolling
//   window.scrollTo({
//     left: s1coords.left + window.scrollX,
//     top: s1coords.top + window.scrollY + 100,
//     behavior: 'smooth',
//   });
//   // sectiong1.scrollIntoView({behavior:'smooth'})
// });

////////////////event capturing and bubbling
// function random(min, max) {
//   return Math.floor(Math.random() * (max - min + 1) + min);
// }

// function randomColor() {
//   return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
// }

// const link = document.querySelector('.nav__link');
// const nav_link = document.querySelector('.nav__links');
// const nav = document.querySelector('.nav');

// link.addEventListener("click",function(e){
//   this.style.backgroundColor = randomColor();
//   // console.log("link",this);
//   console.log("link",e.target,e.currentTarget);
//   // e.stopPropagation()
// })

// nav_link.addEventListener("click",function(e){
//   this.style.backgroundColor = randomColor();
//   // console.log("nav=link",this);
//   console.log("navlink",e.target,e.currentTarget);
// })

// nav.addEventListener("click",function(e){
//   this.style.backgroundColor = randomColor();
//   // console.log("nav",this);
//   console.log("nav",e.target,e.currentTarget);
// })

// document.addEventListener('DOMContentLoaded',(e)=>{
//   console.log("html parsed and tree built",e);
// })

// window.addEventListener('load',(e)=>{
// console.log("page loaded",e);
// })

// window.addEventListener('beforeunload', e => {
//   e.preventDefault();
//   console.log('beforeunload', e);
//   e.returnValue = 'want to leave';
// });
