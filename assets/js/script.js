var searchHistoryArr = new Array(8).fill("");
var retrieve = ""
var searchHistoryList = $("#list-group")
var searchInputEl = document.querySelector("#search-input");
var searchBtnEl = document.querySelector("#btn-search")
var currentEl = document.querySelector("#current-weather");
var forecastEl = document.querySelector("#forecast")
var searchValue = ""
var currentDay = moment().format("dddd, MMMM Do");
var cardBody = ""


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
        $("#current-weather").empty();
        $("#forecast").empty();
        displayWeather(data);
        getCurrentUV(data);
      });
    } 
    else {
      alert("Error. Please reenter city.");
    }
  })
};

//create divs to display weather
var displayWeather = function(weather) {
    let weatherContainer = $("<div>").addClass("card bg-transparent text-center").appendTo(currentEl);
    let cardHeader = $("<div>").addClass("card-header bg-color").appendTo(weatherContainer);
    let cityTitle = $("<h2>").addClass("card-title").text(weather.name).appendTo(cardHeader);
    let dateTitle = $("<h4>").addClass("card-title").html(currentDay).appendTo(cardHeader);
    let icon = $("<img>").addClass("icon-img").attr("src", "http://openweathermap.org/img/wn/" + weather.weather[0].icon + ".png").appendTo(cardHeader);
    cardBody = $("<div>").addClass("card-body").appendTo(weatherContainer);
    let tempText =$("<p>").addClass("card-text").attr("id", "currentWeatherText").text("Temperature: " + weather.main.temp + " °F").appendTo(cardBody);
    let windText =$("<p>").addClass("card-text").text("Wind: " + weather.wind.speed + " MPH").appendTo(cardBody);
    let humidityText =$("<p>").addClass("card-text").text("Humidity: " + weather.main.humidity + "%").appendTo(cardBody);
}

//get today's UV index
var getCurrentUV = function(coordinates) {
    var UVurl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + coordinates.coord.lat + "&lon=" + coordinates.coord.lon + "&units=imperial&appid=fc3b8208da178484d1ec9579831a350b"
      fetch(UVurl).then(function(response) {
            response.json().then(function(data) {  
                console.log(data)  
            //display UV
            let uvText =$("<p>").addClass("btn btn-sm").text("UV Index: " + data.current.uvi).appendTo(cardBody);

            //UV conditional formatting
            if (data.current.uvi <= 2) {
                uvText.addClass("btn-success")
            } else if(data.current.uvi <= 7) {
                uvText.addClass("btn-warning")
            } else if(data.current.uvi <= 10) {
                uvText.addClass("btn-danger")
            }

            //get forecast
            for(var i = 1; i<7; i++) {
                //convert date from unix
                var newDate = moment.unix(data.daily[i].dt)
                newDate = newDate._d.toLocaleDateString();
                // console.log(convertDate)

                let forecastContainer = $("<div>").addClass("col-lg-2 col-md-4").appendTo(forecastEl);
                let forecastCard = $("<div>").addClass("card fc-bg text-center").appendTo(forecastContainer)
                let cardBodyForecast = $("<div>").addClass("card-body").appendTo(forecastCard);
                let forecastDate = $("<h5>").addClass("card-title").html(newDate).appendTo(cardBodyForecast);   
                let forecastIcon = $("<img>").addClass("icon-img").attr("src", "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png").appendTo(cardBodyForecast);   
                let forecastTemp = $("<p>").addClass("card-text fp").text(Math.ceil(data.daily[i].temp.day) + " °F").appendTo(cardBodyForecast);
                let forecastWind = $("<p>").addClass("card-text fp").text(Math.ceil(data.daily[i].wind_speed) + " MPH").appendTo(cardBodyForecast);
                let forecastHumidity = $("<p>").addClass("card-text fp").text(data.daily[i].humidity + "%").appendTo(cardBodyForecast);
            }
          });
        }) 
    }

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

//press enter to search
$("#search-input").keyup(function(event) {
    if (event.keyCode === 13) {
        $("#btn-search").click();
    }
});

//add event listener to search history
$(".list-group-item").on("click", function() {
    cityList = $(this).text();
    getCurrentWeather(cityList);
})

load();