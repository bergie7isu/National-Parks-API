'use strict';

const apiKey = 'MY NATIONAL PARKS KEY';
const geoCodeApiKey = 'MY GOOGLE KEY';
const nationalParksApiUrl = 'https://developer.nps.gov/api/v1/parks';
let i;
let numberOfStates = 1;

function formatParkAddress(jsonResponse, i) {
    $(`.park-address${i}`).append(jsonResponse.results[0].formatted_address);
}

function getAddress(latLong, i) {
    let addressFetch = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latLong + '&key=' + geoCodeApiKey;
    fetch(addressFetch)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error(response.statusText);
            }
        })
        .then(jsonResponse => formatParkAddress(jsonResponse, i))
        .catch(error => {
            $(`.park-address${i}`).append('Address not retrieved! ' + error.message);
        });
}

function logResults(jsonResponse) {
    $('.results').empty();
    $('.results').removeClass('hidden');
    if (jsonResponse.length == 0) {
        $('.results').append(`<div class="no-results"><h3>No parks found!</h3></div>`);
    }
    else {
        for (i = 0; i < jsonResponse.data.length; i++) {
            $('.results').append(`<div class="park-result">
                    <h2 class="park-name">${jsonResponse.data[i].fullName} (${jsonResponse.data[i].states})</h2>
                    <h4 class="park-address${i}"></h4>
                    <a class="park-url" href="${jsonResponse.data[i].url}">${jsonResponse.data[i].url}</a>
                    <p class="park-description">${jsonResponse.data[i].description}</p>
                </div>`);
            let latLong = jsonResponse.data[i].latLong;
            latLong = latLong.replace('lat:','').replace(' long:','');
            if (latLong != '') {
                getAddress(latLong, i);
            }
            else {
                $(`.park-address${i}`).append('Address not found!');
            }
        }
    }
}

function formatQueryString(params) {
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    return queryItems.join('&');
}

function getNationalParks(stateArray, maxResults=10) {
    const params = {
        api_key: apiKey,
        stateCode: stateArray.join(','),
        limit: maxResults
    };
    const queryString = formatQueryString(params);
    const fetchUrl = nationalParksApiUrl + '?' + queryString;
    fetch(fetchUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error(response.statusText);
            }
        })
        .then(jsonResponse => logResults(jsonResponse))
        .catch(error => {
            $('.results').empty();
            $('.results').append(`<div class="error"><h3>Bad Request: ${error.message}!!!</h3></div>`);
            $('.results').removeClass('hidden');
        });
}

function watchForSubmit() {
    addState();
    $('form').submit(function(event) {
        event.preventDefault();
        const stateArray = [];
        for (i = 1; i <= numberOfStates; i++) {
            if ($(`#state${i}`).val() != "") {
                stateArray.push($(`#state${i}`).val());
            }
        }
        const maxResults = $('#max-results').val();
        getNationalParks(stateArray, maxResults);
    });
}

function addState() {
    $('button.add-state').on('click', function() {
        numberOfStates++;
        $('.states').append(`<section class="state${numberOfStates} additional-state">
                                <label for="state${numberOfStates}" class="state"><label>
                                <select id="state${numberOfStates}">
                                    <option value="" selected>Pick a State!</option>
                                    <option value="AK">Alaska</option>
                                    <option value="AL">Alabama</option>
                                    <option value="AR">Arkansas</option>
                                    <option value="AZ">Arizona</option>
                                    <option value="CA">California</option>
                                    <option value="CO">Colorada</option>
                                    <option value="CT">Conneticut</option>
                                    <option value="DC">District of Colombia</option>
                                    <option value="DE">Delaware</option>
                                    <option value="FL">Florida</option>
                                    <option value="GA">Georgia</option>
                                    <option value="HI">Hawaii</option>
                                    <option value="IA">Iowa</option>
                                    <option value="ID">Idaho</option>
                                    <option value="IL">Illinois</option>
                                    <option value="IN">Indiana</option>
                                    <option value="KS">Kansas</option>
                                    <option value="KY">Kentucky</option>
                                    <option value="LA">Louisiana</option>
                                    <option value="MA">Massachusetts</option>
                                    <option value="MD">Maryland</option>
                                    <option value="ME">Maine</option>
                                    <option value="MI">Michigan</option>
                                    <option value="MN">Minnesota</option>
                                    <option value="MO">Missouri</option>
                                    <option value="MS">Mississippi</option>
                                    <option value="MT">Montana</option>
                                    <option value="NC">North Carolina</option>
                                    <option value="ND">North Dakota</option>
                                    <option value="NE">Nebraska</option>
                                    <option value="NH">New Hampshire</option>
                                    <option value="NJ">New Jersey</option>
                                    <option value="NM">New Mexico</option>
                                    <option value="NV">Nevada</option>
                                    <option value="NY">New York</option>
                                    <option value="OH">Ohio</option>
                                    <option value="OK">Oklahoma</option>
                                    <option value="OR">Oregon</option>
                                    <option value="PA">Pennsylvania</option>
                                    <option value="RI">Rhode Island</option>
                                    <option value="SC">South Carolina</option>
                                    <option value="SD">South Dakota</option>
                                    <option value="TN">Tennessee</option>
                                    <option value="TX">Texas</option>
                                    <option value="UT">Utah</option>
                                    <option value="VT">Vermont</option>
                                    <option value="VA">Virginia</option>
                                    <option value="WA">Washington</option>
                                    <option value="WI">Wisconsin</option>
                                    <option value="WV">West Virginia</option>
                                    <option value="WY">Wyoming</option>    
                                </select>
                                <button type="button" class="remove-state" id="remove-state${numberOfStates}">X</button>
                            </section`);
        deleteState();
    });
}

function deleteState() {
    $('.remove-state').off('click');
    $('.remove-state').on('click', function() {
        let buttonRow = this.id.slice(12);
        $(`section.state${buttonRow}`).remove();
    });
}

$(watchForSubmit)