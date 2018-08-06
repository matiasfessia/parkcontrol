const getVehicleCheckin = (licensePlate) => {
  const checkinData = JSON.parse(localStorage.getItem('checkin'));
  for (var type in checkinData) {
    let result = checkinData[type].find(vehicle => licensePlate === vehicle.licensePlate);
    if (result) {
      return result;
    }
  }
}

export { getVehicleCheckin };