'use strict';

// ---------- handle API requests ------------

// gets data from API endpoint and returns an array of objects
function ghibliApiPromise(endpoint) {
  return new Promise(function (resolve, reject) {
    // create a request, assign a new XMLHttpRequest object to it
    let request = new XMLHttpRequest();

    // open connection using GET req on the url endpoint(open a url)
    request.open('GET', 'https://ghibliapi.herokuapp.com/' + endpoint, true);

    // onload function only runs after request.send()
    request.onload = function () {
      if (this.readyState === 4) {
        if (request.status === 200) {
          resolve(request.response);
        } else {
          reject(request.response);
        }
      }
    };

    // any other error
    request.onerror = function () {
      // console.error(request.statusText);
      reject(Error('Network Error'));
    };

    // send the request to the url
    request.send();
  });
}

function handleMenuSelection() {

  $('#js-data-films').on('click', (e) => {

    // prevent page from scrolling to top
    e.preventDefault();

    // set h2 Data to current data type displayed
    $('.js-ghibli-data-type').text('Films');

    // get object list of films, call a promise using  Promises and .then
    ghibliApiPromise('films').then(JSON.parse).then(function (response) {
      console.log('Success!');
      // handleDisplayFilms()
      handleDisplayFilms(response);

    }, function (error) {
      console.error('Failed!', error);
    });
  });

  $('#js-data-species-cat').on('click', (e) => {
    // prevent page from scrolling to top
    e.preventDefault();
    console.log('js-cat');
  });

  $('#js-data-species-people').on('click', (e) => {
    // prevent page from scrolling to top
    e.preventDefault();
    console.log('js-people');
  });
}

// for running on window load (display films as default)
window.onload = function () {
  // set h2 Data to current data type displayed
  $('.js-ghibli-data-type').text('Films');
  // get object list of films, call a promise using  Promises and .then
  ghibliApiPromise('films').then(JSON.parse).then(function (response) {
    console.log('Success!');
    // handleDisplayFilms()
    handleDisplayFilms(response);

  }, function (error) {
    console.error('Failed!', error);
  });
};

// ---------- handle display items ------------

function handleDisplayFilms(filmsList) {
  if (filmsList.length > 0) {
    let html = ''; // need '' b/c synchronous will return undefined then you data otherwise
    filmsList.forEach(film => {
      let color = getRandomColor();
      html += `<section class="card" style="border-color:${color};">
      <h2 style="background-color:${color};">${film.title}</h2>
      <article>${film.description}
      </article>
    </section>`;
    });

    $('#js-content').append(html);

    
  }
}


// ---------- handle Navigation Bar ------------

function handleNavBar() {
  $('#js-navbar-toggle').on('click', function () {
    $('.main-nav').slideToggle();
  });
}

function handleNavHover() {
  $('.main-nav a').hover(function () {
    let color = getRandomColor();
    $(this).css('background-color', color);
  }, function () {
    $(this).css('background-color', 'white');
  });
}

// ---------- handle Other Styling/Animation ------------
function getRandomColor() {
  const colors = ['#4D4140', '#596F7E', '#168B98', '#ED5B67', '#E27766',
    '#DAAD50', '#EAC3A6', '#272020', '#2D3840', '#0E464C', '#762D34', '#703C33', '#6D5826', '#766255'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// function styleCardColor() {
//   let color = getRandomColor();
//   $('.card').css('border-color', color);
//   $('.card h2').css('background-color', color);
// }

// --------- Handle the App -----------------

function handleApp() {
  handleNavBar();
  handleMenuSelection();
  handleNavHover();
}

$(handleApp());
