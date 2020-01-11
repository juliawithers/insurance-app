// let apiKey_health = '4b7a78e632642f4b6da68fcd56a2c6ae';
// let apiKey_geo = 'AIzaSyCDm1-bN6rsQQoues6UA64S9O0TdCe_jE0`;
// https://maps.googleapis.com/maps/api/geocode/json?address=1111+street+name+city+zip&key=apikey
//  'https://api.betterdoctor.com/2016-03-01/specialties?fields=dentist&limit=10&user_key=4b7a78e632642f4b6da68fcd56a2c6ae'

// ='https://api.betterdoctor.com/2016-03-01/practices?name=Emory&location=33.836984%2C%20-84.327867%2C5&user_location=33.836984%2C%20-84.327867&sort=distance-asc&skip=0&limit=10&user_key=4b7a78e632642f4b6da68fcd56a2c6ae'

// Possible inputs: 
// name
// specialty_uid - is a comma separated list of specialties
// insurance_uid -same but for insurance
// practice_uid - same but for practices
// the two required criteria:
// location - lat,long,range
// user_location - important to give distance response parameter from response. how to get it though? address? so need the geocoding api to translate to lat long
// practice
// doctor
// specialty - use specialty search
// practice & doctor, use the doctor search to see if that doctor is at that practice.
// practice & doctor & specialty: doctor search using practice uid, doctor name, and specialty.  
function getHealthData(){
    let source = 'https://api.betterdoctor.com/2016-03-01/doctors?specialty_uid=dentist&location=33.836984%2C%20-84.327867%2C5&user_location=33.836984%2C%20-84.327867&sort=distance-asc&skip=0&limit=10&user_key=4b7a78e632642f4b6da68fcd56a2c6ae'
    fetch(source)
    .then(response =>{
      if(response.ok){
        return response.json()
      }
    })
    .then(responseJson => manipulateData(responseJson))
    .catch(err => console.log(err.message))
    }
    function manipulateData(responseJson){
      // console.log(responseJson)
      // console.log(responseJson.data[0].practices)
      // to find practices in our designated area:
      // responseJson.data(iterate through).practices(iterate through).within_search_area if true:
      // find distance:
      // responseJson.data(iterate through).practices(iterate through).distance
      // Show location: 
      // responseJson.data(iterate through).practices(iterate through).visit_address.city/state/street/street2/zip
      // show hours:
      // responseJson.data(iterate through).practices(iterate through).office_hours
      // show phone:
      // responseJson.data(iterate through).practices(iterate through).phones(iterate)
    
        console.log(responseJson.data[0].practices[0].phones)
      // console.log(responseJson.data[0].insurances)
      // console.log(responseJson.data[0].insurances[0].insurance_plan.name)
      // console.log(responseJson.data[0].insurances[0].insurance_provider.name )
    
      // to get to the insurance plans: 
      // responseJson.data(iterate through the array).insurances(iterate through the array).insurance_plan.name 
      // responseJson.data(iterate through the array).insurances(iterate through the array).insurance_provider.name 
    }
    
    function getGeo(){
      let src = "https://maps.googleapis.com/maps/api/geocode/json?address=1744+Morris+Landers+Drive,+Atlanta+GA&key=AIzaSyCDm1-bN6rsQQoues6UA64S9O0TdCe_jE0"
    
      fetch(src)
      .then(resp =>{
      if(resp.ok){
        return resp.json()
      }
      })
      .then(respJson => manipulateGeo(respJson))
      .catch(error => console.log(error.message))
    }
    
    function manipulateGeo(respJson){
      console.log(respJson)
      // shows the lat long object
      console.log(respJson.results[0].geometry.location)
      // lat:
      console.log(respJson.results[0].geometry.location.lat)
      // long:
      console.log(respJson.results[0].geometry.location.lng)
    }
    
    $(getHealthData)
    $(getGeo)