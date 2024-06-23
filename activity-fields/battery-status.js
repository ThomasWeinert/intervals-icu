{
  // define short labels ((symbols) for device types
  const DeviceLabels = {
    PowerMeter: '🗲',
    BikeSpeedSensor: '⎋',
    BikeSpeedCadenceSensor: '⎋',
    BikeCadenceSensor: '⟲',
    Radar: '↭',
    Control: '🖯',
    FitnessEquipmentDevice: '🏋',
    BloodPressureMonitor: '🌢',
    GeocacheTransmitter: '🗺',
    EnvironmentSensor: '🌡',
    WeightSensor: '⚖',
    HeartRateSensor: '♥',
    StrideSpeedAndDistanceSensor: '👟'
  };
  const AntDeviceTypes = {
    11: 'PowerMeter',
    16: "Control",
    17: "FitnessEquipmentDevice",
    18: "BloodPressureMonitor",
    19: "GeocacheTransmitter",
    25: "EnvironmentSensor",
    40: 'Radar',
    119: "WeightSensor",
    120: "HeartRateSensor",
    121: "BikeSpeedCadenceSensor",
    122: "BikeCadenceSensor",
    123: "BikeSpeedSensor",
    124: "StrideSpeedAndDistanceSensor",
  };
  const BLEDeviceTypes = {
    2: "PowerMeter",
  };
  const BatteryStatus = {
    '1': 'New', '2': 'Good', '3': 'OK', '4': 'Low', '5': 'Critical', '7': 'Invalid', '8': 'CNT'
  }
  const devices = {}
  for (let di of icu.fit.device_info) {
    const serial = di.serial_number?.value;
    if (serial) {
      if (!devices[serial]) {
        devices[serial] = {};
      }
      if (di.battery_status?.value) {
        devices[serial] = {
          ...devices.serial,
          status: BatteryStatus[di.battery_status?.value]
        }
      }

      switch (di.source_type?.value) {
        case 5:
          // direct
          if (
            di.manufacturer?.value === 1 /* Garmin */ &&
            (
              di.product?.value === 3192 || /* Speed Sensor*/
              di.product?.value === 3307 /* Cannondale Wheel Sensor*/
            )
          ) {
            devices[serial].type = 'BikeSpeedSensor' || `D ${di.manufacturer?.value}-${di.product?.value}`
          }
          break;
        case 3:
          // bluetooth
          devices[serial].type = BLEDeviceTypes[di.device_type?.value] || `BLE ${di.device_type?.value}`
          break;
        case 1:
          // ant
          devices[serial].type = AntDeviceTypes[di.device_type?.value] || `ANT ${di.device_type?.value}`
          break;
      }
    }
  }
  let returnValue = Object.values(devices).reduce(
    (carry, device) => {
      if (device.status) {
        const label = DeviceLabels[`${device.type}`] || (device.type || '?') + ':'
        carry.push(label + ' ' + device.status)
      }
      return carry;
    },
    []
  ).join(', ');
  returnValue
}
