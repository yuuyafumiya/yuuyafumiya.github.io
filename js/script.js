'use strict';

// geolocation 現在位置取得

navigator.geolocation.getCurrentPosition(success, fail);

function success(pos) {
    popup(pos);
    ajaxRequest(pos.coords.latitude, pos.coords.longitude);
}

function popup(pos) {
    var geo_text = "緯度:" + pos.coords.latitude + "\n";
    geo_text += "経度:" + pos.coords.longitude + "\n";
    geo_text += "高度:" + pos.coords.altitude + "\n";
    geo_text += "位置精度:" + pos.coords.accuracy + "\n";
    geo_text += "高度精度:" + pos.coords.altitudeAccuracy  + "\n";
    geo_text += "移動方向:" + pos.coords.heading + "\n";
    geo_text += "速度:" + pos.coords.speed + "\n";

    var date = new Date(pos.timestamp);

    geo_text += "取得時刻:" + date.toLocaleString() + "\n";

    alert(geo_text);
}

function utcToJSTime(utcTime) {
    return utcTime * 1000;
}

function fail(error) {
    alert('位置情報の取得に失敗しました。エラーコード：' + error.code);
}

// データ取得
function ajaxRequest(lat, long) {
    const url = 'https://api.openweathermap.org/data/2.5/forecast';
    const appId = 'b876c21e468e205ac0ee26f62169a1a6';

    $.ajax({
        url: url,
        data: {
            appid: appId,
            lat: lat,
            lon: long,
            units: 'metric',
            lang: 'ja'
        }
    })
    .done(function(data) {
        $('#place').text(data.city.name + ',' + data.city.country);

        data.list.forEach(function(forecast, index){
            const dateTime = new Date(utcToJSTime(forecast.dt));
            const month = dateTime.getMonth() +1;
            const date = dateTime.getDate();
            const hours = dateTime.getHours();
            const min = String(dateTime.getMinutes()).padStart(2, '0');
            const temperature = Math.round(forecast.main.temp);
            const description = forecast.weather[0].description;
            const iconPath = `images/${forecast.weather[0].icon}.svg`;

            if(index === 0){
                const currentWeather = `<div class="icon"><img src="${iconPath}"></div>
                <div class="info">
                    <p>
                    <span class="description">現在の天気:${description}</span>
                    <span class="temp">${temperature}</span>℃
                    </p>
                </div>`;
            $('#weather').html(currentWeather);    
            }else {
                const tableRow = `
                <tr>
                    <td class="info">
                    ${month}/${date} ${hours}:${min}
                    </td>
                    <td class="icon"><img src="${iconPath}"></td>
                    <td><span class="description">${description}</span></td>
                    <td><span class="temp">${temperature}℃</span></td>
                    </tr>`;
                    $('#forecast').append(tableRow);
            }


    });
    })

    .fail(function() {
        console.log('$.ajax failed!');
    })
}
