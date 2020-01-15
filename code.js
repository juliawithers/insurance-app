let apiKey_BD = '4b7a78e632642f4b6da68fcd56a2c6ae';
let srcDoctors = 'https://api.betterdoctor.com/2016-03-01/doctors?sort=distance-asc&skip=0&limit=15&';
let srcPredictive = 'http://www.mapquestapi.com/search/v3/prediction?key=c77LD6NXniLCkBGt4rVOjzK7RsNokvAA&collection=address,franchise&languageCod=en&limit=15&q=';
let srcMap ='http://www.mapquestapi.com/geocoding/v1/address?key=c77LD6NXniLCkBGt4rVOjzK7RsNokvAA&location=';

// 1210 Druid Hills Reserve Drive, Atlanta, GA 30329

// Possible inputs: 
// User Location - need to add predictive text
// Radius of search
// Specialty 
function getHealthData(userLocation, radius, specialty, doctor, practice){
  console.log(userLocation)
  console.log(radius)
  console.log(specialty)
  console.log(doctor)
  console.log(practice)
// scenario for just required input - practices endpoint
  if (specialty === ""){
    let source = srcDoctors+'user_key='+ apiKey_BD;
    useDoctors(source, userLocation,radius)
  }
// scenario for required + specialty - doctor endpoint
  else if (specialty !== ""){
    let source = srcDoctors+'specialty_uid='+specialty+'&user_key='+ apiKey_BD;
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
  //console.log(responseJson)
  // Need to add the URL links to pages
  if (responseJson.data.length === 0){
    // <p class="hidden" id="error_message"></p>
    $('#error_message').html(`Sorry, I could not find data for this search. Please try altering the inputs.`)
  }

  for(let i=0;i<responseJson.data.length;i++){
    const doctor = responseJson.data[i];

    // get the doctor data and save in the object
    const doctorData = {
      firstName: doctor.profile.first_name,
      lastName: doctor.profile.last_name,
      specialty: doctor.specialties[0].name,
      practiceData: generatePracticeData(doctor), //send to function to create this data
      insuranceData: generateInsuranceData(doctor) //send to function to create this data
    }
    console.log(doctorData)
    renderListItemDoctor(doctorData)
  }
} //end of manipulateDoctorData

function generatePracticeData(doctor){
    // create the practice data
    const practiceArr = []
    for(let i=0;i<doctor.practices.length;i++){
      const practice = doctor.practices[i];
              // console.log(j)
      if(doctor.practices[i].within_search_area === true){
        // Practice Name
        let practice_name = practice.name;
        // Distance from userLocation
        let dist = practice.distance;
        // let distNum = parseInt(dist,10);
        let dist_ance = dist.toFixed(2);
        // Phone Number
        let ph = practice.phones[0].number 
        let area = ph.slice(0,3)
        let three_dig = ph.slice(3,6)
        let four_dig = ph.slice(6,10)
        let ph_num = [area,three_dig,four_dig].join('-')
        // Location Address
        let ci_ty = practice.visit_address.city;
        let st_ate = practice.visit_address.state;
        let s_treet = practice.visit_address.street;
        // let s_treet2 = doctor.practices[i].visit_address.street2;
        let z_ip = practice.visit_address.zip;
        practiceArr.push({
          pracTice: practice_name,
          distance: dist_ance,
          phone: ph_num,
          city: ci_ty,
          state: st_ate,
          street: s_treet,
          zip: z_ip
        }) 
      }//end of if
      
    }//end of for
    return practiceArr;
} //end of generatePracticeData

// create the insurances data
function generateInsuranceData(doctor){
    let insuranceArr = [];
    for (let i=0;i<doctor.insurances.length;i++){
      // Insurances taken ***Highest 
    
      if(doctor.insurances[i] !== undefined && doctor.insurances[i] !== undefined){

        let planName = doctor.insurances[i].insurance_plan.name;
        let provider = doctor.insurances[i].insurance_provider.name;
        
        insuranceArr.push(planName+'-'+ provider);
      }
      else if(doctor.insurances[i] === undefined && doctor.insurances[i] !== undefined){
        let planName = "Not Available :(";
        let provider = doctor.insurances[i].insurance_provider.name;
        
        insuranceArr.push(planName+'-'+ provider);
      } 
      else if(doctor.insurances[i] !== undefined && doctor.insurances[i] === undefined){
        let planName = doctor.insurances[i].insurance_plan.name;
        let provider = "Not Available :(";

        insuranceArr.push(planName+'-'+ provider);
        
      } 
      else{
        insuranceArr.push('Unfortunately, no Insurance is listed for this provider')
      } 
  }
  // test logs:
    const insurance = insuranceArr.join(' &<br>')
    return insurance;  
}


// **********Must render the health data based off search params:**********
// const doctorData = {
//   firstName: doctor.profile.first_name,
//   lastName: doctor.profile.last_name,
//   specialty: doctor.specialties[0].name,
//   practiceData: generatePracticeData(doctor), //send to function to create this data
//   insuranceData: generateInsuranceData(doctor) //send to function to create this data
// }
function renderListItemDoctor(doctorData){
  // will render the lists onto ul class="listResults"
  // first_name,last_name,special,practice_name,distance,hours,phone,city,state,street,street2,zip,insuranceArr
  if(doctorData.insuranceData !== ""){
    for (let i=0;i<doctorData.practiceData.length;i++){
      $('.listResults').append(
        `<li class="return_data">
          <div>
            <h3>${doctorData.firstName} ${doctorData.lastName}</h3>
            <p class="distance">${doctorData.practiceData[i].distance} Miles Away</p>
            <p>Specialty: ${doctorData.specialty}</p>
            <p>Practice: ${doctorData.practiceData[i].pracTice}</p>
            <div class="insurance">${doctorData.insuranceData}</div>
            <p>Phone: ${doctorData.practiceData[i].phone}</p>
            <p>${doctorData.practiceData[i].street},
            ${doctorData.practiceData[i].city},<br>${doctorData.practiceData[i].state} ${doctorData.practiceData[i].zip}</p>
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
  
}//end of parseLocation

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
}//end of getGeo


// create the string for BetterDoctor location search
function manipulateGeo(responseJson){
  // lat:
  let lat = responseJson.results[0].locations[0].latLng.lat;
  // long:
  let long = responseJson.results[0].locations[0].latLng.lng;
  latLong = lat+','+long;
  console.log(latLong)
  return latLong

}//end of manipulateGeo

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
} //end of watchForm

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

// pediatrician, podiatrist, gynecologist, psychiatrist, optometrist, nephrologist, family medicine, internal medicine, orthopedic, dentist, dermatologist, psychologist
// NEXT STEPS: finish the drop down select for specialty
// finish predictive text for address
// finish css
$(watchForm)
