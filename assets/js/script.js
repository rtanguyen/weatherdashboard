var searchInputEl = document.querySelector("#search-input");
var searchBtnEl = document.querySelector("#btn-search")
var currentEl = document.querySelector("#current-weather");
var forecastEl = document.querySelector("#forecast")
var searchValue = ""

var cityTitleEl = document.querySelector("#cityTitle")
var cityText = ""

//current date
$("#currentDay").html(function () {
    return moment().format("dddd, MMMM Do");
  });

var formHandler = function(event) {
    // get value from input element
    searchValue = searchInputEl.value.trim();
    console.log(searchValue)
    
    if (searchValue) {
      getCurrentWeather(searchValue);
  
      // clear old content
      currentEl.textContent = "";
      forecastEl.textContent = "";
      searchInputEl.value = "";
    } else {
      alert("Please enter a city");
    }
  };

var getCurrentWeather = function(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=fc3b8208da178484d1ec9579831a350b"
     // make a get request to url
  fetch(apiUrl)
  .then(function(response) {
    // request was successful
    if (response.ok) {
      console.log(response);
      response.json().then(function(data) {
        console.log(data);
        console.log(data.name)
        displayWeather(data)
      });
    } else {
      alert("Error. Please reenter city.");
    }
  })
  .catch(function(error) {
    alert("Unable to connect. Try again later.");
  });
};

//display weather
var displayWeather = function(data) {
    //currentEl.classList.remove("hidden");
    cityText = data.name
    console.log(cityText)
    $("#cityTitle")
}


// add event listeners to search
// searchBtnEl.addEventListener("click", formHandler);
$(document).ready(function() {
    $("button").click(function(event) {
        formHandler();
        event.preventDefault();
    })
});

//add event listener to search history
