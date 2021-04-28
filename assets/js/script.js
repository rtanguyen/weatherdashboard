var searchHistoryArr = new Array(8).fill("");
var retrieve = ""
var searchHistoryList = $("#list-group")
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
    searchValue = searchValue.toUpperCase();
    // console.log(searchValue)

    if (searchValue) {
        getCurrentWeather(searchValue);
        save(searchValue);
    // clear old content
        currentEl.textContent = "";
        forecastEl.textContent = "";
        searchInputEl.value = "";
    } 
  };

//save search history to local storage
var save = function(searchValue) {
    //if previously searched, move to top of array/list
    if (searchHistoryArr.includes(searchValue)) {
        let cityIndex = searchHistoryArr.findIndex(i=>i.includes(searchValue));
        searchHistoryArr.push(searchHistoryArr.splice(searchHistoryArr.indexOf(searchValue), 1)[0])
        // searchHistoryArr.pop()
        searchHistoryArr.unshift(searchValue);
        console.log(searchValue)
    } else {
        searchHistoryArr.pop();
        searchHistoryArr.unshift(searchValue);
        console.log(searchHistoryArr);
    };    

    //save to local storage
    localStorage.setItem("savedHistory", JSON.stringify(searchHistoryArr));
    displayHistory();
}

//display search history
var displayHistory = function () {
for (var i = 0; i < searchHistoryArr.length; i++) {
    if (searchHistoryArr[i] !== "") {
        var list = $("#savedCity" + i).text(searchHistoryArr[i]).removeClass("hidden");
        }}}

//get today's weather
var getCurrentWeather = function(city) {
   var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=fc3b8208da178484d1ec9579831a350b"
  fetch(url).then(function(response) {
      console.log(response);
    // request was successful
    if (response.ok) {
      response.json().then(function(data) {
        console.log(data)
        displayWeather(data);
      });
    } 
    else {
      alert("Error. Please reenter city.");
    }
  })
};

//display current weather
var displayWeather = function(weather) {
    cityText = weather.name
    console.log(typeof cityText)
    $("#cityTitle").text() = cityText;
}
//get 5 day forecast
//display forecast


//retrieve from local storage and display search history
var load = function() {
    searchHistoryArr = JSON.parse(localStorage.getItem("savedHistory"));
    if (!searchHistoryArr) {
        searchHistoryArr = new Array(8).fill("");
    } else {
        displayHistory();
    }
}

// add event listeners to search
$(document).ready(function() {
    $("button").click(function(event) {
        formHandler();
        event.preventDefault();
    });
});

//add event listener to search history
$(".list-group-item").on("click", function() {
    cityList = $(this).text();
    getCurrentWeather(cityList);
})

load();