        var actuators = data.getData('actuators');

        // error checks
        if (!commands[type]) {
                helper.log.error('parse unknown command: "' + type + '"');
                return 'unknown command: "' + type + '"';
        }
        if (!commands[type].actions[action]) {
                helper.log.error('parse unknown action "' + action + '" for type "' + type + '"');
                return 'unknown action "' + action + '" for type "' + type + '"';
        }
        if (!actuators[serialnumber]) {
                helper.log.error('parse actuator "' + serialnumber + '" not found');
                return 'actuator "' + serialnumber + '" not found';
        }
        if (commands[type].deviceIds) {
                // this check is only valid for "real" actuators, i.e. hardware devices to which an input value is directly send
                // groups and scenes are virtual switches and send output datapoints over the bus
                if (commands[type].deviceIds.indexOf(actuators[serialnumber].deviceId) == -1) {
                        helper.log.error('parse actuator "' + serialnumber + '" (' + actuators[serialnumber].typeName + ') is not of type "' + type + '"');
                        return 'actuator "' + serialnumber + '" (' + actuators[serialnumber].typeName + ') is not of type "' + type + '"';
                }
        }
        var id = serialnumber;
        if (type == 'scene') {
                serialnumber = actuators[serialnumber].serialNumber;
        }

        var datapoint = Object.keys(commands[type].actions[action])[0];
        var value = commands[type].actions[action][datapoint];
        set(serialnumber, channel, datapoint, value);
        return 'set channel ' + channel + ' of ' + type + ' ' + serialnumber + ' (' + actuators[id].typeName + ') to ' + action + ': ' + serialnumber + '/' + channel + '/' + datapoint + ': ' + value;
}

/**
 * sets a knx parameter via xmpp
 * 
 * @param {string} serialnumber - serial number of the actuator
 * @param {string} channel - channel number of the actuator
 * @param {string} datapoint - datapoint of the actuator
 * @param {string} value - the value to set the datapoint to
 */
var set = function (serialnumber, channel, datapoint, value) {
        var d = data.getData('actuators');
        if (value == 'x') {
                if (d[serialnumber].deviceId == '9004') {
                        // thermostat
                        // current on/off status is stored in odp0008
                        // is set in idp0012
                        var current = d[serialnumber].channels[channel].datapoints['odp0008'];
                        value = current == 1 ? 0 : 1;
                } else {
                        // default: the idp and opd have the same id, so it's possible to just switch the 'i' and 'o'
                        var look = 'o' + datapoint.substr(1);
                        var current = d[serialnumber].channels[channel].datapoints[look];
                        value = current == 1 ? 0 : 1;
                }
        } else if (typeof value === 'string' && value.substr(0, 2) == 'x-') {
                // toggle movement of shutters on and off
                // odp0000 = 0, 1: not moving
                // odp0000 = 3: moving down
                // odp0000 = 2: moving up
                value = value.substr(2);
                if (
                        (d[serialnumber].channels[channel].datapoints['odp0000'] == 2 && value == 0) ||
                        (d[serialnumber].channels[channel].datapoints['odp0000'] == 3 && value == 1)
                ) {
                        datapoint = 'idp0001';
                        value = 1;
                }
        } else if (typeof value === 'string' && value.substr(0, 2) == 'p-') {
                // activate actuator for 200ms + dead time to rotate blinds step by step
                                                                                                                                                                                                                            150,35-42     65%
