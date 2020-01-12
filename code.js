let apiKey_BD = '4b7a78e632642f4b6da68fcd56a2c6ae';
let srcDoctors = 'https://api.betterdoctor.com/2016-03-01/doctors?';
let srcPractices = 'https://api.betterdoctor.com/2016-03-01/practices?';
let srcPredictive = 'http://www.mapquestapi.com/search/v3/prediction?key=c77LD6NXniLCkBGt4rVOjzK7RsNokvAA&collection=address,franchise&countryCode=US&languageCod=en&limit=15&q=';
let srcMap ='http://www.mapquestapi.com/geocoding/v1/address?key=c77LD6NXniLCkBGt4rVOjzK7RsNokvAA&location=';

// 1210 Druid Hills Reserve Drive, Atlanta, GA 30329

// Possible inputs: 
// name
// let specialty_uid =  - is a comma separated list of specialties
// let insurance_uid =  -same but for insurance
// let practice_uid= - same but for practices
// the two required criteria:
// 
// let user_location= - important to give distance response parameter from response. how to get it though? address? so need the geocoding api to translate to lat long
// let radius = will go in range
// let location= - lat,long,range
// practice
// doctor
// specialty - use specialty search
// practice & doctor, use the doctor search to see if that doctor is at that practice.
// practice & doctor & specialty: doctor search using practice uid, doctor name, and specialty.  
function getHealthData(userLocation, radius, specialty, doctor, practice){
  console.log(userLocation)
  console.log(radius)
  console.log(specialty)
  console.log(doctor)
  console.log(practice)
// scenario for just required input - practices endpoint
  if (specialty === "" & doctor === "" & practice === ""){
    let source = srcPractices+'&sort=distance-asc&skip=0&limit=10&user_key='+ apiKey_BD;
    // console.log(source,userLocation,radius)

    usePractices(source, userLocation,radius)
  }
// scenario for required + specialty - doctor endpoint
  else if (doctor === "" & practice === ""){
    let source = srcPractices+'specialty_uid='+specialty+'&sort=distance-asc&skip=0&limit=10&user_key='+ apiKey_BD;
    console.log(source)

    useDoctors(source,userLocation,radius)
  }
// scenario for required + doctor - doctor endpoint
  else if (specialty === "" & practice === ""){
    let source = srcPractices+'&name='+doctor+'&sort=distance-asc&skip=0&limit=10&user_key='+ apiKey_BD;
    console.log(source)

    useDoctors(source,userLocation,radius)
  }
// scenario for required + practice - practices endpoint
  else if (specialty === "" & doctor === ""){
 let source = srcPractices+'&practice_uid='+practice+'&sort=distance-asc&skip=0&limit=10&user_key='+ apiKey_BD;
    console.log(source)

    useDoctors(source,userLocation,radius)
  }
// scenario for required + specialty + doctor - doctor endpoint
  else if (practice === ""){
    let source = srcPractices+'&specialty_uid='+specialty+'&name='+doctor+'&sort=distance-asc&skip=0&limit=10&user_key='+ apiKey_BD;
    console.log(source)

    useDoctors(source,userLocation,radius)
  }
// scenario for required + specialty + practice - doctor endpoint
  else if (doctor === ""){
    let source = srcPractices+'&practice_uid='+practice+'&specialty_uid='+specialty+'&sort=distance-asc&skip=0&limit=10&user_key='+ apiKey_BD;
    console.log(source)

    useDoctors(source,userLocation,radius)
  }
// scenario for required + doctor + practice - doctor endpoint
  else if (specialty === ""){
    let source = srcPractices+'&name='+doctor+'&practice_uid='+practice+'&sort=distance-asc&skip=0&limit=10&user_key='+ apiKey_BD;
    console.log(source)

    useDoctors(source,userLocation,radius)
  }
// scenario for required + specialty + doctor + practice - doctor endpoint
  else {
    let source = srcPractices+'&name='+doctor+'&practice_uid='+practice+'&specialty_uid='+specialty+'&sort=distance-asc&skip=0&limit=10&user_key='+ apiKey_BD;
    console.log(source)

    useDoctors(source,userLocation,radius)
  }
}

// **********Must prepare the addresses and source for the health data based of endpoint:**********
function useDoctors(source,userLocation,radius){
 // search Doctors
  let address = parseLocation(userLocation)
  console.log(address)

  getGeo(address,source,radius)
  .then(src=>{
    console.log(src)
    responseJson = fetchHealthDataDoctor(src)
   })
}

function usePractices(source,userLocation,radius){
 // search Practices
  let address = parseLocation(userLocation)
  console.log(address)

  getGeo(address,source,radius)
  .then(src=>{
    console.log(src)
    responseJson = fetchHealthDataPractice(src)
   })
}

// **********Must fetch the health data based of endpoint:********** 
function fetchHealthDataPractice(source){
  fetch(source)
  .then(response =>{
    if(response.ok){
      return response.json()
    }
  })
  .then(responseJson => manipulatePracticeData(responseJson))
}

function fetchHealthDataDoctor(source){
  fetch(source)
  .then(response =>{
    if(response.ok){
      return response.json()
    }
  })
  .then(responseJson => manipulateDoctorData(responseJson))
}

// **********Two scenarios - data passed through doctor search and data passed through practice search**********
function manipulateDoctorData(responseJson){
  console.log(responseJson)
  // Need to add the URL links to pages
  for(let i=0;i<=responseJson.data.length;i++){
    // Name of Doctor
    let first_name = responseJson.data[i].profile.first_name;
    let last_name = responseJson.data[i].profile.last_name;
    // Specialty of Doctor
    let special = responseJson.data[i].specialties.name
    // Practice Name
    let practice_name = responseJson.data[i].practices[0].name;
    // Distance from userLocation
    let distance = responseJson.data[i].practices[0].distance;
    // Hours of operation
    let hours = responseJson.data[i].practices[0].office_hours;
    // Phone Number
    let phone = responseJson.data[i].practices[0].phones[0] //might have to iterate to find landline
    // Location Address
    let city = responseJson.data[i].practices[0].visit_address.city;
    let state = responseJson.data[i].practices[0].visit_address.state;
    let street = responseJson.data[i].practices[0].visit_address.street;
    let street2 = responseJson.data[i].practices[0].visit_address.street2;
    let zip = responseJson.data[i].practices[0].visit_address.zip;
      
    let insuranceArr = [];
    for (let j=0;j<=responseJson.data[i].insurances.length;j++){
      // Insurances taken ***Highest 
      let planName = responseJson.data[i].insurances[j].insurance_plan.name; 
      let provider = responseJson.data[i].insurances[j].insurance_provider.name; 
      insuranceArr.push(planName+'-'+provider);
      }
    renderListItemDoctor(first_name,last_name,special,practice_name,distance,hours,phone,city,state,street,street2,zip,insuranceArr)
  }

  // test logs:
  console.log(insuranceArr)
  console.log(city)
  console.log(special)
}

function manipulatePracticeData(responseJson){
  console.log(responseJson)
  // Practice search: need to find the following data-
 
  for(let i=0;i<=responseJson.data.length;i++){
  
    // Practice Name
    let practice_name = responseJson.data[i].name;
    // Distance from userLocation
    let distance = responseJson.data[i].distance;
    // Hours of operation
    let hours = responseJson.data[i].office_hours;
    // Phone Number
    let phone = responseJson.data[i].phones[0] //might have to iterate to find landline
    // Location Address
    let city = responseJson.data[i].visit_address.city;
    let state = responseJson.data[i].visit_address.state;
    let street = responseJson.data[i].visit_address.street;
    let street2 = responseJson.data[i].visit_address.street2;
    let zip = responseJson.data[i].visit_address.zip;
      
    let info = "" 
    for (let j=0;j<=responseJson.data[i].doctors.length;j++){
        // Name of Doctor
        let first_name = responseJson.data[i].doctors[j].profile.first_name;
        let last_name = responseJson.data[i].doctors[j].profile.last_name;
        // Specialty of Doctor
        let special = responseJson.data[i].doctors[j].specialties.name
        
      let insuranceArr = [];
      for(let k=0;k<=responseJson.data[i].doctors[j].insurances.length;k++){
        // Insurances taken ***Highest 
        let planName = responseJson.data[i].doctors[j].insurances[k].insurance_plan.name; 
        let provider = responseJson.data[i].doctors[j].insurances[k].insurance_provider.name; 
        
        insuranceArr.push(planName+'-'+provider+' ');
      }
    info = first_name+' '+last_name+'-'+special+':'+insuranceArr
    }
    renderListItemPractice(practice_name,distance,hours,phone,city,state,street,street2,zip,info)
  }

 
  // test logs:
  console.log(practice_name)
  console.log(insuranceArr)
  console.log(infoArr)
  console.log(distance)
}

// **********Must render the health data based of endpoint:**********
function renderListItemDoctor(){
  // will render the lists onto ul class="listResults"
  // first_name,last_name,special,practice_name,distance,hours,phone,city,state,street,street2,zip,insuranceArr
  $('.listResults').append(
    `<li>
      <span>${distance}</span>
      <div>
        <h3>${first_name} ${last_name}</h3>
        <p>${special}</p>
        <p>${practice_name}</p>
        <p><em>${insuranceArr}</em></p>
        <p>${hours} / ${phone}</p>
        <p>${street}${street2},${city},${state}${zip}</p>
        <p></p>
      </div>
    </li>`
  )
}

function renderListItemPractice(){
  // will render the lists onto ul class="listResults"
  // practice_name,distance,hours,phone,city,state,street,street2,zip,info
  $('.listResults').append(
    `<li>
      <span>${distance}</span>
      <div>
        <h3>${practice_name}</h3>
        <p>${special}</p>
        <p><em>${infoArr}</em></p>
        <p>${hours} / ${phone}</p>
        <p>${street}${street2},${city},${state}${zip}</p>
        <p></p>
      </div>
    </li>`
  )
}

// create proper address format for geolocation conversion
function parseLocation(userLocation){
  let locSplit = userLocation.split(/,?\s+/);
  console.log(locSplit)
  return locSplit.join(",")
  
}

// fetch the coordinates for the given address
async function getGeo(address,source,radius){
  let src = srcMap+address
  console.log(src)

  const resp = await fetch(src)
  const responseJson = await resp.json()

  userLatLong = manipulateGeo(responseJson)
  console.log(userLatLong)

  let url = source+'&location='+userLatLong+','+radius+'&user_location='+userLatLong;
  console.log(url)
  return url
  // fetch(src)
  // .then(response =>{
  //   if(response.ok){
  //     return response.json()
  //   }
  // })
  // .then(responseJson => manipulateGeo(responseJson))
  // .catch(error => console.log(error.message))
}


// create the string for BetterDoctor location search
function manipulateGeo(responseJson){
  // lat:
  let lat = responseJson.results[0].locations[0].latLng.lat;
  // long:
  let long = responseJson.results[0].locations[0].latLng.lng;
  latLong = lat+','+long;
  console.log(latLong)
  return latLong

}
// whatch the form for submittal
function watchForm(){
  // watch for search button submit
  $('.submit').submit(e=>{
    e.preventDefault();
    let userLocation = $('.user_location').val();
    let radius = $('.radius').val();
    let specialty = $('.specialty_uid').val();
    let doctor = $('.doctor').val();
    let practice = $('.practice').val();
    getHealthData(userLocation,radius,specialty,doctor,practice)
    }
  )
}
// Predictive text for addres - in progress
// function watchPredictive(){
//   $('.user_location').each(function(){
//     let elem = $(this);
//   })

//   $('.user_location').on("keypress keydown keyup change",function(event){
//     let src = srcPredictive+$('.user_location')
//     console.log(src)
//     fetch(src)
//     .then(resp =>{
//       if(resp.ok){
//         return resp.json()
//       }
//       })
//     .then(respJson => renderPredictive(respJson))
//     .catch(error => console.log(error.message))})
// }
// function usePredictive(){

// }
// function renderPredictive(responseJson){
//   console.log(respJson)
// }
// $(watchPredictive)
$(watchForm)
// $(getHealthData)
// $(getGeo)