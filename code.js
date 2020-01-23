
let apiKey_BD = '4b7a78e632642f4b6da68fcd56a2c6ae';
let srcDoctors = 'https://cors-anywhere.herokuapp.com/https://api.betterdoctor.com/2016-03-01/doctors?sort=distance-asc&skip=0&limit=15&';
let srcMap ='https://www.mapquestapi.com/geocoding/v1/address?key=c77LD6NXniLCkBGt4rVOjzK7RsNokvAA&location=';

// Possible inputs: 
// User Location 
// Radius of search
// Specialty 
function getHealthData(userLocation, radius, specialty){
// scenario for just required input - practices endpoint
  if (specialty === ""){
    let source = srcDoctors+'user_key='+ apiKey_BD;
    useDoctors(source, userLocation,radius)
  }
// scenario for required + specialty - doctor endpoint
  else if (specialty !== ""){
    let source = srcDoctors+'specialty_uid='+specialty+'&user_key='+ apiKey_BD;
    useDoctors(source,userLocation,radius)
  }
}

// **********Must prepare the addresses and source for the health data based of endpoint:**********
function useDoctors(source,userLocation,radius){
 // search Doctors
  let address = parseLocation(userLocation)
  getGeo(address,source,radius)
  .then(src=>{
    responseJson = fetchHealthDataDoctor(src)
  })
  .catch(err=>console.log(err))
}

// **********Fetch the health data:********** 
function fetchHealthDataDoctor(src){
   fetch(src)
   .then(response =>{
    if(response.ok){
      return response.json()
    }
  })
   .then(responseJson => manipulateDoctorData(responseJson))
   .catch(error=>console.log(error))
}

// **********Manipulate the Health Data Response**********
function manipulateDoctorData(responseJson){
  if (responseJson.data.length === 0){
    $('#error_message').toggleClass('hidden')
    $('#error_message').html(`Sorry, I could not find data for this search. Please try altering the inputs.`)
  }

  for(let i=0;i<responseJson.data.length;i++){
    const doctor = responseJson.data[i];

    // get the doctor data and save in the object
    insuranceArray = generateInsuranceData(doctor)
    const doctorData = {
      firstName: doctor.profile.first_name,
      lastName: doctor.profile.last_name,
      specialty: doctor.specialties[0].name,
      practiceData: generatePracticeData(doctor),  
    }
    let short = [];
    if(insuranceArray.length <=5){
      for(let j=0;j<insuranceArray.length;j++){
        short.push(insuranceArray[j]);
      }
    }
    else if(insuranceArray.length >5){
      for(let j=0;j<5;j++){
        short.push(insuranceArray[j])
      }
    }
    splitData(insuranceArray,short,doctorData)
    insJoin = short.join('<br>')
    doctorData.insuranceData = insJoin;
    renderListItemDoctor(doctorData)
  }
} 

function generatePracticeData(doctor){
    // create the practice data
    const practiceArr = []
    for(let i=0;i<doctor.practices.length;i++){ 
      const practice = doctor.practices[i];
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
        let z_ip = practice.visit_address.zip;
        practiceArr.push({
          pracTice: practice_name,
          distance: dist_ance,
          phone: ph_num,
          city: ci_ty,
          state: st_ate,
          street: s_treet,
          zip: z_ip,
        }) 
      }
    }
    return practiceArr;
} 


// create the insurances data
function generateInsuranceData(doctor){
    let insuranceArr = [];
    for (let i=0;i<doctor.insurances.length;i++){ 
      if(doctor.insurances[i] !== undefined && doctor.insurances[i] !== undefined){
        let planName = doctor.insurances[i].insurance_plan.name;
        let provider = doctor.insurances[i].insurance_provider.name;       
        insuranceArr.push('- '+planName +' : '+ provider);
      }
      else if(doctor.insurances[i] === undefined && doctor.insurances[i] !== undefined){
        let planName = 'Not Available :(';
        let provider = doctor.insurances[i].insurance_provider.name;        
        insuranceArr.push('- '+planName +' : '+ provider);
      } 
      else if(doctor.insurances[i] !== undefined && doctor.insurances[i] === undefined){
        let planName = doctor.insurances[i].insurance_plan.name;
        let provider = 'Not Available :(';
        insuranceArr.push('- '+planName +' : '+ provider);
      } 
      else{
        insuranceArr.push('Unfortunately, no Insurance is listed for this provider')
      } 
  }
  return insuranceArr;  
}

// create global variable to save all insurance data
const insuranceObject = [];
function splitData(insuranceArray,short,doctorData){
  if(insuranceArray !== ""){
    for (let i=0;i<doctorData.practiceData.length;i++){
     insuranceObject.push({
          insArray: insuranceArray,
          id: doctorData.firstName + i,
          insShort: short})
    } 
  } 
}


// **********Must render the health data based off search params:**********
let count = 1;
function renderListItemDoctor(doctorData){
  if(doctorData.insuranceData !== ""){
    for (let i=0;i<doctorData.practiceData.length;i++){ 
      $('.listResults').append(
        `<li class="return_data">
          <p class="distance"><b class="count">${count} - ${doctorData.practiceData[i].distance} mi</b></p>
          <div class="container">
            <div class="upperLine">
              <h2 class="doctor_name">${doctorData.firstName} ${doctorData.lastName} - ${doctorData.specialty}</h2>
              <p class="practice_box"> ${doctorData.practiceData[i].pracTice}</p>
            </div>
            <div class="container2">
              <div class="insurance" id="${doctorData.firstName}${i}">
                <p>${doctorData.insuranceData}
                <button class="showMore" id="${doctorData.firstName}${i}">Show More</button>
                </p>
              </div>
            </div>
            <p>Phone: <a href="tel:${doctorData.practiceData[i].phone}">${doctorData.practiceData[i].phone}</a></p>
            <p>${doctorData.practiceData[i].street},
            ${doctorData.practiceData[i].city},<br>${doctorData.practiceData[i].state} ${doctorData.practiceData[i].zip}</p>
            <p></p>
          </div>
        </li>`
        )
      count+=1;
      }
    }
}

// Need to figure out how to populate the short and long lists easily 
function watchShow(){
  // Show More
  $('.listResults').on('click', '.showMore', function(e){ 
    e.preventDefault();
    const id = $(e.target).attr('id')
    for(let i=0;i<insuranceObject.length;i++){
      if(id === insuranceObject[i].id){
        $(e.target).closest('.insurance p').html(`${insuranceObject[i].insArray.join('\n')}<button class="showLess" id="${id}">Show Less</button>`); 
      }
    }
  })
  // Show Less
  $('.listResults').on('click', '.showLess', function(e){
    e.preventDefault();
    const id = $(e.target).attr('id')
    for(let i=0;i<insuranceObject.length;i++){
      if(id === insuranceObject[i].id){
        $(e.target).closest('.insurance p').html(`${insuranceObject[i].insShort.join('\n')}<button class="showMore" id="${id}">Show More</button>`); 
      }
    }
  })
}

// create proper address format for geolocation conversion
function parseLocation(userLocation){
  let locSplit = userLocation.split(/,?\s+/);
  return locSplit.join(',')
}

// fetch the coordinates for the given address
async function getGeo(address,source,radius){
  let srcGeo = srcMap+address

  const resp = await fetch(srcGeo)
  const responseJson = await resp.json()

  userLatLong = manipulateGeo(responseJson)

  let url = source+'&location='+userLatLong+','+radius+'&user_location='+userLatLong;
  return url
}


// create the string for BetterDoctor location search
function manipulateGeo(responseJson){
  // lat:
  let lat = responseJson.results[0].locations[0].latLng.lat;
  // long:
  let long = responseJson.results[0].locations[0].latLng.lng;
  latLong = lat+','+long;
  return latLong
}

// whatch the form for submittal
function watchForm(){
  $('.submit').submit(e=>{
      e.preventDefault();
      count = 1;
      $('.listResults').empty()
      $('#error_message').empty()
      let radius = $('.radius').val();
      let specialty = $('#drop').val().toString();
      let userLocation = $('.user_location').val();
      if(userLocation === "" && radius !== ""){
        $('#alert').toggleClass('hidden')
        $('#alert').html("Please enter a location. Either by city/zip or specific address")
      }
      else if(userLocation !=="" && radius === ""){
        $('#alert').toggleClass('hidden')
        $('#alert').html("Please enter a search radius")
      }
      else if(userLocation ==="" && radius === ""){
        $('#alert').toggleClass('hidden')
        $('#alert').html("Please enter a location and search radius")
      }
      getHealthData(userLocation,radius,specialty)
      }
    )
} 

function bindEventHandlers() {
  watchForm();
  watchShow();
}

$(bindEventHandlers)

