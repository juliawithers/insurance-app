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
    let source = srcDoctors+'&sort=distance-asc&skip=0&limit=10&user_key='+ apiKey_BD;
    useDoctors(source, userLocation,radius)
  }
// scenario for required + specialty - doctor endpoint
  else if (doctor === "" & practice === ""){
    let source = srcDoctors+'specialty_uid='+specialty+'&sort=distance-asc&skip=0&limit=10&user_key='+ apiKey_BD;
    console.log(source)

    useDoctors(source,userLocation,radius)
  }
// scenario for required + doctor - doctor endpoint
  else if (specialty === "" & practice === ""){
    let source = srcDoctors+'&name='+doctor+'&sort=distance-asc&skip=0&limit=10&user_key='+ apiKey_BD;
    console.log(source)

    useDoctors(source,userLocation,radius)
  }
// scenario for required + practice - practices endpoint
  else if (specialty === "" & doctor === ""){
 let source = srcDoctors+'&name='+practice+'&sort=distance-asc&skip=0&limit=10&user_key='+ apiKey_BD;
    console.log(source)

    useDoctors(source,userLocation,radius)
  }
// scenario for required + specialty + doctor - doctor endpoint
  else if (practice === ""){
    let source = srcDoctors+'&specialty_uid='+specialty+'&name='+doctor+'&sort=distance-asc&skip=0&limit=10&user_key='+ apiKey_BD;
    console.log(source)

    useDoctors(source,userLocation,radius)
  }
// scenario for required + specialty + practice - doctor endpoint
  else if (doctor === ""){
    let source = srcDoctors+'&practice_uid='+practice+'&specialty_uid='+specialty+'&sort=distance-asc&skip=0&limit=10&user_key='+ apiKey_BD;
    console.log(source)

    useDoctors(source,userLocation,radius)
  }
// scenario for required + doctor + practice - doctor endpoint
  else if (specialty === ""){
    let source = srcDoctors+'&name='+doctor+'&practice_uid='+practice+'&sort=distance-asc&skip=0&limit=10&user_key='+ apiKey_BD;
    console.log(source)

    useDoctors(source,userLocation,radius)
  }
// scenario for required + specialty + doctor + practice - doctor endpoint
  else {
    let source = srcDoctors+'&name='+doctor+'&practice_uid='+practice+'&specialty_uid='+specialty+'&sort=distance-asc&skip=0&limit=10&user_key='+ apiKey_BD;
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

// **********Must fetch the health data based of endpoint:********** 


function fetchHealthDataDoctor(source){
  fetch(source)
  .then(response =>{
    if(response.ok){
      return response.json()
    }
  })
  .then(responseJson => manipulateDoctorData(responseJson))
  .catch(error=>console.log(error))
}

// **********Manipulate the Response**********
// NEXT STEPS: Must have a contingency for the data below to have empty fields
function manipulateDoctorData(responseJson){
  console.log(responseJson)
  // Need to add the URL links to pages
  if (responseJson.data.length === 0){
    // <p class="hidden" id="error_message"></p>
    $('#error_message').html(`Sorry, I could not find data for this search. Please try altering the inputs.`)
  }

  for(let i=0;i<responseJson.data.length;i++){

    let objArr=[];
    console.log(responseJson.data[i].practices.length)
    for(let j=0;j<responseJson.data[i].practices.length;j++){
        // console.log(j)
      if(responseJson.data[i].practices[j].within_search_area === true){
        // Practice Name
        let practice_name = responseJson.data[i].practices[j].name;
        // Distance from userLocation
        let dist = responseJson.data[i].practices[j].distance;
        // let distNum = parseInt(dist,10);
        let dist_ance = dist.toFixed(2);
        // Phone Number
        let ph = responseJson.data[i].practices[j].phones[0].number 
        let area = ph.slice(0,3)
        let three_dig = ph.slice(3,6)
        let four_dig = ph.slice(6,10)
        let ph_num = [area,three_dig,four_dig].join('-')
        // Location Address
        let ci_ty = responseJson.data[i].practices[j].visit_address.city;
        let st_ate = responseJson.data[i].practices[j].visit_address.state;
        let s_treet = responseJson.data[i].practices[j].visit_address.street;
        let s_treet2 = responseJson.data[i].practices[j].visit_address.street2;
        let z_ip = responseJson.data[i].practices[j].visit_address.zip;
        objArr.push({
          practice: practice_name,
          distance: dist_ance,
          phone: ph_num,
          city: ci_ty,
          state: st_ate,
          street: s_treet,
          street2: s_treet2,
          zip: z_ip
        })
       
      
        // Name of Doctor 
        let first_name = responseJson.data[i].profile.first_name;
        let last_name = responseJson.data[i].profile.last_name;
        // Specialty of Doctor
        let special = responseJson.data[i].specialties[0].name
        
        let insuranceArr = [];
        for (let k=0;k<responseJson.data[i].insurances.length;k++){
          // Insurances taken ***Highest 
        
          if(responseJson.data[i].insurances[k] !== undefined && responseJson.data[i].insurances[k] !== undefined){

            let planName = responseJson.data[i].insurances[k].insurance_plan.name;
            let provider = responseJson.data[i].insurances[k].insurance_provider.name;
            
            insuranceArr.push(planName+'-'+ provider);
          }
          else if(responseJson.data[i].insurances[k] === undefined && responseJson.data[i].insurances[k] !== undefined){
            let planName = "Not Available :(";
            let provider = responseJson.data[i].insurances[k].insurance_provider.name;
            
            insuranceArr.push(planName+'-'+ provider);
          } 
          else if(responseJson.data[i].insurances[k] !== undefined && responseJson.data[i].insurances[k] === undefined){
            let planName = responseJson.data[i].insurances[k].insurance_plan.name;
            let provider = "Not Available :(";

            insuranceArr.push(planName+'-'+ provider);
            
          } 
          else{
            insuranceArr.push('Unfortunately, no Insurance is listed for this provider')
          }
      }
       // test logs:
    let insurance = insuranceArr.join(' &<br>')
    console.log(insurance)
    console.log(objArr)
    console.log(first_name)
    console.log(last_name)
    renderListItemDoctor(first_name,last_name,special,objArr,insurance)
     }
    } 
   
  }
}

// **********Must render the health data based off search params:**********
function renderListItemDoctor(first_name,last_name,special,objArr,insurance){
  // will render the lists onto ul class="listResults"
  // first_name,last_name,special,practice_name,distance,hours,phone,city,state,street,street2,zip,insuranceArr
  if(insurance !==""){
  for (let i=0;i<objArr.length;i++){
    $('.listResults').append(
      `<li class="return_data">
        
        <div>
          <h3>${first_name} ${last_name}</h3>
          <p class="distance">${objArr[i].distance} Miles Away</p>
          <p>Specialty: ${special}</p>
          <p>Practice: ${objArr[i].practice}</p>
          <div class="insurance">${insurance}</div>
          <p>Phone: ${objArr[i].phone}</p>
          <p>${objArr[i].street} ${objArr[i].street2}, 
          ${objArr[i].city},<br>${objArr[i].state} ${objArr[i].zip}</p>
          <p></p>
        </div>
      </li>`
      )
    }
  }
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
    $('.listResults').empty()
    $('#error_message').empty()
    let userLocation = $('.user_location').val();
    let radius = $('.radius').val();
    let specialty = $('.specialty_uid').val();
    // Note that specialty takes input like dentist, pediatrist, pediatrics, endocrinologist. not dentistry, pediatry, pediatrics. Should eventually provide a drop down list of common practice specialties.
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
