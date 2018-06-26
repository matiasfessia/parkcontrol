/** */
const checkin = evt => {
  evt.preventDefault();
  const licensePlateInput = document.getElementById('checkin-license-plate');
  const vehicleType = document.querySelector('input[name=vehicleType]:checked');
  const date = new Date();
  switch (vehicleType.value) {
    case 'moto':
      checkinData.motos.push({ licensePlate: licensePlateInput.value, type: vehicleType.value, date });
      break;
    case 'car':
      checkinData.cars.push({ licensePlate: licensePlateInput.value, type: vehicleType.value, date });
      break;
    case 'pickup':
      checkinData.pickups.push({ licensePlate: licensePlateInput.value, type: vehicleType.value, date });
      break;
  }
  licensePlateInput.value ='';
  licensePlateInput.focus();
  vehicleType.checked = false;

  saveInLocalStorage();
  refreshDataView();
}

/** */
const checkout = evt => {
  evt.preventDefault();
  const licensePlateInput = document.getElementById('checkout-license-plate');
  const date = new Date();
  const vehicle = getVehicleCheckin(licensePlateInput.value);
  if (!vehicle) {
    return false;
  }
  
  const result = calculateRate(date, new Date(vehicle.date), vehicle.type);

  checkoutData.push({
    licensePlate: vehicle.licensePlate,
    type: vehicle.type,
    dateIn: vehicle.date,
    dateOut: date,
    parkedHours: result.parkedHours,
    rate: result.rate
  });

  deleteVehicleOnCheckintList(vehicle.licensePlate);
  
  moneyRaisedData = Number(moneyRaisedData) + Number(result.rate);
  licensePlateInput.value = '';
  licensePlateInput.focus();
  
  saveInLocalStorage();
  refreshDataView();
}

/** */
const deleteVehicleOnCheckintList = (licensePlate) => {
  for (type in checkinData) {
    let index = checkinData[type].findIndex(vehicle => licensePlate === vehicle.licensePlate);
    if (index > -1) {
      checkinData[type].splice(index, 1);
    }
  }
}

/** */
const calculateRate = (dateIn, dateOut, vehicleType) => {
  const diff = dateIn.getTime() - dateOut.getTime(); // This will give difference in milliseconds
  let parkedHours = (((diff / 1000) / 60) / 60).toFixed(2); // 1000: from milleseconds to seconds, 60 from seconds to minutes, 60 from minutes to hours
  if (parkedHours < 0.5) {
    parkedHours = 0.5;
  }
  const rate = (parkedHours * Number(ratesData[vehicleType])).toFixed(2);
  return {
    parkedHours,
    rate
  };
}

/** */
const getVehicleCheckin = (licensePlate) => {
  for (type in checkinData) {
    let result = checkinData[type].find(vehicle => licensePlate === vehicle.licensePlate);
    if (result) {
      return result;
    }
  }
}

/** */
const saveRates = (evt) => {
  evt.preventDefault();
  ratesData = {
    moto: Number(motoRateDOM.value),
    car: Number(carRateDOM.value),
    pickup: Number(pickupRateDOM.value),
  }
  saveInLocalStorage();  
}

/** Crea un node del DOM para agregar el vehiculo a la lista */
const createVehicleNode = (licensePlate, date) => {
  const liDOM = document.createElement('li');
  liDOM.appendChild(document.createTextNode(licensePlate));

  const timeDOM = document.createElement('span');
  timeDOM.classList.add('time');
  timeDOM.appendChild(document.createTextNode(date.toLocaleTimeString('es-ar', {hour: '2-digit', minute: '2-digit'}) + ' hs'));

  liDOM.appendChild(timeDOM);

  return liDOM;
}

/** */
const createVehicleCheckoutNode = (licensePlate, type, amount, parkedHours) => {
  const liDOM = document.createElement('li');
  liDOM.innerHTML = `
    <span>${licensePlate}</span>
    <span>${type}</span>
    <span>$ ${amount} [${parkedHours}hs]</span>
  `;
  return liDOM;
}

const onDefaultValuesBtnClick = () => {
  refreshDataView();
}

/** */
const refreshDataView = () => {
  motosListCheckinDOM.innerHTML = '';  
  checkinData.motos.forEach(moto => {
    motosListCheckinDOM.appendChild(createVehicleNode(moto.licensePlate, new Date(moto.date)));
  });
  carListCheckinDOM.innerHTML = '';
  checkinData.cars.forEach(car => {
    carListCheckinDOM.appendChild(createVehicleNode(car.licensePlate, new Date(car.date)));
  });
  pickupsListCheckinDOM.innerHTML = '';  
  checkinData.pickups.forEach(pickup => {
    pickupsListCheckinDOM.appendChild(createVehicleNode(pickup.licensePlate, new Date(pickup.date)));
  });
  vehiclesListCheckoutDOM.innerHTML = '';  
  checkoutData.forEach(vehicle => {
    vehiclesListCheckoutDOM.appendChild(createVehicleCheckoutNode(vehicle.licensePlate, vehicle.type, vehicle.rate, vehicle.parkedHours));
  });

  motosCounterDOM.forEach(counter => { counter.innerHTML = checkinData.motos.length});
  carsCounterDOM.forEach(counter => { counter.innerHTML = checkinData.cars.length});
  pickupsCounterDOM.forEach(counter => { counter.innerHTML = checkinData.pickups.length});
  vehiclesCounterDOM.innerHTML = checkoutData.length;

  motoRateDOM.value = ratesData.moto;
  carRateDOM.value = ratesData.car;
  pickupRateDOM.value = ratesData.pickup;

  moneyRaisedDOM.innerHTML = '$ ' + moneyRaisedData;
}

/** Guardar el arreglo de vehiculos en la localStorage del navegador. */
const saveInLocalStorage = () => {
  localStorage.setItem('checkin', JSON.stringify(checkinData));
  localStorage.setItem('checkout', JSON.stringify(checkoutData));
  localStorage.setItem('rates', JSON.stringify(ratesData));
  localStorage.setItem('moneyRaised', moneyRaisedData);
}

/** */
const onHomeBtnClicked = () => {
  sectionToogle('dashboard');  
}

const onCheckinBtnClicked = () => {
  sectionToogle('checkin');
}

/** */
const onCheckoutBtnClicked = () => {
  sectionToogle('checkout');
}

/** */
const showMenu = () => {
  menu.classList.add('active');
  backdrop.classList.add('active');  
}

/** */
const closeMenu = () => {
  menu.classList.remove('active');
  backdrop.classList.remove('active');
}

/** */
const onMenuBtnClicked = (evt) => {
  if (menu.classList.contains('active')) {
    closeMenu();
  } else {
    showMenu();
  }
}

/** */
const handleWindowClick = (evt) => {
  evt.stopPropagation();
  if (evt.target.classList.contains('backdrop')) {
    closeMenu();
  }
}

/** */
const onRatesBtnClicked = () => {
  sectionToogle('rates');
  closeMenu();
}

/** */
const sectionToogle = sectionToActivate => {
  document.querySelectorAll('body > section').forEach(section => {
    section.classList.remove('active');
    if (section.classList.contains(sectionToActivate)) {
      section.classList.add('active');
    }
  })
}

window.addEventListener('click', handleWindowClick);
const menu = document.querySelector('.menu');
const backdrop = document.querySelector('.backdrop');
const motosListCheckinDOM = document.querySelector('.checkin .motos-list');
const carListCheckinDOM = document.querySelector('.checkin .cars-list');
const pickupsListCheckinDOM = document.querySelector('.checkin .pickups-list');
const motosCounterDOM = document.querySelectorAll('.motos-counter-badge');
const carsCounterDOM = document.querySelectorAll('.cars-counter-badge');
const pickupsCounterDOM = document.querySelectorAll('.pickups-counter-badge');
const moneyRaisedDOM = document.querySelector('.money-raised');
const vehiclesListCheckoutDOM = document.querySelector('.checkout .vehicles');
const vehiclesCounterDOM = document.querySelector('.vehicles-counter-badge');
const motoRateDOM = document.getElementById('moto-rate');
const carRateDOM = document.getElementById('car-rate');
const pickupRateDOM = document.getElementById('pickup-rate');

// recupero la data de la local storage
let checkinData = localStorage.getItem('checkin') ? JSON.parse(localStorage.getItem('checkin')) : {motos: [], cars: [], pickups: []};
let checkoutData = localStorage.getItem('checkout') ? JSON.parse(localStorage.getItem('checkout')) : [];
let ratesData = localStorage.getItem('rates') ? JSON.parse(localStorage.getItem('rates')) : {moto: 0, car: 0, pickup: 0};
let moneyRaisedData = localStorage.getItem('moneyRaised') ?localStorage.getItem('moneyRaised') : 0;

refreshDataView();