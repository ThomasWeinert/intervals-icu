{
  let sensor = ''
  for (let di of icu.fit.device_info) {
    if (
      (
        di.source_type?.value === 1 /* Ant+ */ &&
        (
          di.device_type?.value === 121 /* Speed */ ||
          di.device_type?.value === 123 /* Speed + Cadence */
        )
      ) ||
      (
        di.source_type?.value === 5 /* Direct */ &&
        di.manufacturer?.value === 1 /* Garmin */ &&
        (
          di.product?.value === 3192 || /* Speed Sensor*/
          di.product?.value === 3307 /* Cannondale Wheel Sensor*/
        )
      )
    ) {
      // console.log("di " + di)
      sensor = di.serial_number?.value
    }
  }
  sensor
}
