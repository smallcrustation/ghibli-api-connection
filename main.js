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

  // --- get all films and display ---
  $('#js-data-films').on('click', (e) => {

    // prevent page from scrolling to top
    e.preventDefault();

    // set h2 Data to current data type displayed
    $('.js-ghibli-data-type').text('Films');

    // get object list of films, call a promise using  Promises and .then
    ghibliApiPromise('films').then(JSON.parse).then(function (response) {
      console.log('Success! films');
      // handleDisplayFilms()
      handleDisplayFilms(response);

    }, function (error) {
      console.error('Failed!', error);
    });
  });

  // ---- get all cats and display -----
  $('#js-data-species-cat').on('click', (e) => {
    // prevent page from scrolling to top
    e.preventDefault();

    $('.js-ghibli-data-type').text('Cats');

    ghibliApiPromise('species?name=Cat').then(JSON.parse).then(function (response) {
      console.log('Success! cats');
      let catsList = response[0].people; // bc response is an array even if just 1 item returned

      $('#js-content').empty(); // empty the html b4 going through the list and adding new cats

      for (let i = 0; i < catsList.length; i++) {
        let catApiUrl = catsList[i];
        catApiUrl = catApiUrl.slice(32); // b/c ghibliApiPromise() already has that
        ghibliApiPromise(catApiUrl).then(JSON.parse).then(function (catResponse) {
          //console.log('Success! got a cat');

          // check if cat.films is greater than 0
          if (catResponse.films.length > 0) {
            // each cat only has one film
            const filmUrl = catResponse.films[0].slice(32);
            // console.log(filmUrl);
            ghibliApiPromise(filmUrl).then(JSON.parse).then(function (filmResponse) {
              // console.log(filmResponse.title);
              handleDisplayCat(catResponse, filmResponse);
            }, function (error) {
              console.error('error', error);
            });

          }
          else {
            console.log('no films for this cat');
            handleDisplayCat(catResponse);
          }
          // handleDisplayCat(catResponse);

        }, function (error) {
          console.error('Failed!', error);
        });
      }

    }, function (error) {
      console.error('Failed!', error);
    });
  });

  $('#js-data-species-human').on('click', (e) => {
    // prevent page from scrolling to top
    e.preventDefault();

    $('.js-ghibli-data-type').text('Humans');

    ghibliApiPromise('species?name=Human').then(JSON.parse).then(function (response) {
      console.log('Success! humans');

      $('#js-content').empty();

      let humanUrlList = response[0].people;

      for (let i = 0; i < humanUrlList.length; i++) {
        let humanUrl = humanUrlList[i].slice(32);
        // GOOD TIL HERE
        // go to each human url to get it's data
        ghibliApiPromise(humanUrl).then(JSON.parse).then(function (humanResponse) {
          // get human movie url, [0] b/c ea. are only in one movie
          //console.log(humanResponse);
          let filmUrl = humanResponse.films[0].slice(32);

          ghibliApiPromise(filmUrl).then(JSON.parse).then(function (filmResponse) {
            // console.log(humanResponse.name + ' ' + filmResponse.title);


            handleDisplayHuman(humanResponse, filmResponse);

          }, function (error) {
            console.error('Error', error);
          });

        }, function (error) {
          console.error('Error', error);
        });
      }
    }, function (error) {
      console.error('Error', error);
    });

  });
}

// for running on window load (display films as default)
window.onload = function () {
  // set h2 Data to current data type displayed
  $('.js-ghibli-data-type').text('Films');
  // get object list of films, call a promise using  Promises and .then
  ghibliApiPromise('films').then(JSON.parse).then(function (response) {
    console.log('Success! films');
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

    $('#js-content').empty();
    $('#js-content').append(html);
  }
}

function handleDisplayCat(cat, film) {

  if (cat.age === 'NA') {
    cat.age = 'Unknown';
  }

  let color = getRandomColor();

  let html = `<section class="card" style="border-color:${color};">
  <h2 style="background-color:${color};">${cat.name}</h2>
  <article>
  <ul>
    <li>Age: ${cat.age}</li>
    <li>Sex: ${cat.gender}</li>
    <li>Eye Color: ${cat.eye_color}</li>
    <li>Hair Color: ${cat.hair_color}</li> 
    <li>Film: ${film.title}</li>
  </ul>  
  </article>
</section>`;

  $('#js-content').append(html);
}

function handleDisplayHuman(human, film) {

  if (human.age === 'NA') {
    human.age = 'Unknown';
  }

  let color = getRandomColor();

  let html = `<section class="card" style="border-color:${color};">
  <h2 style="background-color:${color};">${human.name}</h2>
  <article>
  <ul>
    <li>Age: ${human.age}</li>
    <li>Sex: ${human.gender}</li>
    <li>Eye Color: ${human.eye_color}</li>
    <li>Hair Color: ${human.hair_color}</li> 
    <li>Film: ${film.title}</li>
  </ul>  
  </article>
</section>`;

  $('#js-content').append(html);
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
