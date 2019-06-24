'use strict';

// gets data from API endpoint and returns an array of objects
function handleRestRequest(endpoint) {
  return new Promise(function (resolve, reject) {
    // create a request, assign a new XMLHttpRequest object to it
    let request = new XMLHttpRequest();

    // open connection using GET req on the url endpoint(open a url)
    request.open('GET', 'https://ghibliapi.herokuapp.com/' + endpoint, true);

    // onload function only runs after request.send()
    request.onload = function () {
      if (this.readyState === 4) {
        if (request.status === 200) {
          // let dataList = JSON.parse(this.response);
          //console.log(dataList);
          //return dataList;
          resolve(request.response);

        } else {
          // console.error(request.statusText);
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
    console.log('js-films');
    // set h2
    $('.js-ghibli-data-type').text('Films');

    // get objects list of films, call handleRestRequest()
    handleRestRequest('films').then(JSON.parse).then(function(response){
      console.log('Success!', response);
    }, function(error){
      console.error('Failed!', error);
    });
    // call handleFilmDisplay()
    
  });

  $('#js-data-species-cat').on('click', () => {
    console.log('js-cat');
  });

  $('#js-data-species-people').on('click', () => {
    console.log('js-people');
  });
}

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
