class DeviceParser {

    capabilities () {
        return [
            'measure_temperature',
            'measure_luminance',
            'flora_measure_fertility',
            'flora_measure_moisture',
        ]
    }

    getDeviceData (floraDevice) {
        moment.locale('nl')
        const settings = floraDevice.settings
        const deviceData = {
            'name': floraDevice.name,
            'id': floraDevice.id,
            'lastUpdated': moment(
              new Date(Date.parse(settings['last_updated']))).fromNow(),
        }
        deviceData['capabilities'] = {}
        for (const capabilityName of this.capabilities()) {
            const capability = floraDevice.capabilitiesObj[capabilityName]
            const min = settings[capabilityName + '_min']
            const max = settings[capabilityName + '_max']
            deviceData['capabilities'][capabilityName] = {
                'sensor': capability.title,
                'min': min,
                'value': capability.value,
                'max': max,
                'suffix': ' ' + capability.units,
            }
        }

        return deviceData
    }
}