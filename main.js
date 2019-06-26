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

function handleGhibliDataType() {
  $('#js-data-films').on('click', () => {

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

  $('#js-data-species-cat').on('click', () => {
    console.log('js-cat');
  });

  $('#js-data-species-people').on('click', () => {
    console.log('js-people');
  });
}

// ---------- handle display items ------------
function displayItems(htmlContent) {
  $('#js-content').append(htmlContent);
}

function handleDisplayFilms(filmsList) {
  console.log(filmsList);
  if (filmsList.length > 0) {
    let html = ''; //
    filmsList.forEach(film => {
      html += `<section class="content">
      <h2>${film.title}</h2>
      <article>${film.description}
      </article>
    </section>`;
    });

    displayItems(html);
  }
}


// ---------- handle Navigation Bar ------------

function handleNavBar() {
  $('#js-navbar-toggle').on('click', function () {
    $('.main-nav').toggle('.active').animate();
  });
}

function handleApp() {
  // handleRestRequest();
  handleNavBar();
  handleGhibliDataType();
}

$(handleApp());
