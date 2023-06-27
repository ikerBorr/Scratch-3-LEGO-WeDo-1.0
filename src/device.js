const HID = require("node-hid");

const consts = require('./consts');

const VENDOR_ID = 0x0694;
const PRODUCT_ID = 0x003;

const MAX_POWER = 127;
const DEFAULT_POWER = 40;

const UID = 0x00;

const MESSAGE_LENGTH = 8;

const DISTANCE_SENSOR_IDS = [0xb0, 0xb1, 0xb2, 0xb3];
const TILT_SENSOR_IDS = [0x26, 0x27];

const SENSOR = {
    "TILT": 0,
    "DISTANCE": 1
}


class Device {
    constructor() {

        this._loadVariables()
        this._connect();
    }

    _loadVariables() {

        this._hub = false;
        this._path = "";
        this._motor_power = [DEFAULT_POWER, DEFAULT_POWER];
        this._motor_dir = [1, 1];
        this._buffer = Buffer.alloc(0);
        this._data_sensors = new Array(2).fill(0);
        this._sensor_dir = [0, 0];
    }

    startEx() {

        this._loadVariables();

        if (!this._hub && this._path != "")
        {
            try {
                this._hub = new HID.HID(this._path);
            } catch(e) {
                return e;
            }
        }
    }

    stopAll() {

        const hub = this._hub;

        if (hub) {

            this.turnOnMotor(consts.MOTOR["motor A"], 0);
            this.turnOnMotor(consts.MOTOR["motor B"], 0);

            this._hub = false;

            try {
                hub.close();
            } catch(e) {
                console.log(e);
                this._hub = true;
            }
        }
    }

    _connect() {

        const devices = HID
            .devices()
            .filter((device) => device.vendorId == VENDOR_ID && device.productId == PRODUCT_ID);
        
        if (!devices) {
            return "No se ha encontrado dispositivos.";
        }

        try {
            this._hub = new HID.HID(devices[0].path);
        } catch(e) {
            return e;
        }

        this._hub.on("data", this._incomingData.bind(this));
        this._hub.on("error", (e) => { console.log(e); });
        this._path = devices[0].path;
    }

    _incomingData(data) {

        if (data) {
            if (!this._buffer) {
                this._buffer = data;
            } else {
                this._buffer = Buffer.concat([this._buffer, data]);
            }
        }
        if (this._buffer.length <= 0) {
            return;
        }
        if (this._buffer.length >= MESSAGE_LENGTH) {
            const message = this._buffer.slice(0, MESSAGE_LENGTH);
            this._buffer = this._buffer.slice(MESSAGE_LENGTH);
            this._parseMessage(message);
            if (this._buffer.length > 0) {
                this._incomingData();
            }
        }
    }

    _parseMessage(message) {

        this._parseSensorData(0, message[3], message[2]);
        this._parseSensorData(1, message[5], message[4]);
    }

    _parseSensorData(port, type, data) {

        if (this._data_sensors[port] !== data) {
            const portName = port === 0 ? "A" : "B";
            if (DISTANCE_SENSOR_IDS.indexOf(type) >= 0) {
                if (this._sensor_dir[port] != SENSOR.DISTANCE) {
                    this._sensor_dir[port] = SENSOR.DISTANCE;
                }
                this._data_sensors[port] = data;
                return;
            }
            if (TILT_SENSOR_IDS.indexOf(type) >= 0) {
                if (this._sensor_dir[port] != SENSOR.TILT) {
                    this._sensor_dir[port] = SENSOR.TILT;
                }
                let tilt = consts.TITL_EVENT.ANY;
                if (10 <= data && data <= 40) {
                    tilt = consts.TITL_EVENT.DOWN;
                } else if (60 <= data && data <= 90) {
                    tilt = consts.TITL_EVENT.RIGHT;
                } else if (170 <= data && data <= 190) {
                    tilt = consts.TITL_EVENT.UP;
                } else if (220 <= data && data <= 240) {
                    tilt = consts.TITL_EVENT.LEFT;
                }
                if (this._data_sensors[port] !== tilt) {
                    this._data_sensors[port] = tilt;
                }
                return;
            }
        }
    }

    async turnOnMotor(motor, flag_power) {

        const delay = ms => new Promise(res => setTimeout(res, ms));

        if (!this._hub) {
            this._connect();
        }

        let power = this._motor_power[motor];

        if (motor >= 0 && motor <= 1 && power <= 100 && power >= 0) {
            
            power = Math.floor(30 + ((MAX_POWER - 30) * power) / 100) * flag_power * this._motor_dir[motor];
            const motors_pwr = [!motor * power, motor * power];
            
            const message = [UID, 0x40, motors_pwr[0] & 0xff, motors_pwr[0] & 0xff, 0x00, 0x00, 0x00, 0x00, 0x00];
            try {
                this._hub.write(message);
            } catch(e) {
                console.log(e);
            }

            await delay(100);
        }
    }

    setPower(motor, power) {

        if (motor <= 1 && motor >= 0)
        {
            if (power < 0) {
                power *= -1;
                this._motor_dir[motor] *= -1;
            }
            if (power > 100) {
                power = 100;
            }
    
            this._motor_power[motor] = power;
        }
    }

    setDirection(motor, direction) {
        
        if (motor <= 1 && motor >= 0 && (direction == -1 || direction == 1)) {
            this._motor_dir[motor] = direction;
        }
    }

    _getSensorData(type) {

        if (this._sensor_dir[0] === type)
            return this._data_sensors[0];
        else {
            return this._data_sensors[1];
        }
    }

    getDistance() {
    
        return this._getSensorData(SENSOR.DISTANCE);        
    }

    getTilt() {

        return this._getSensorData(SENSOR.TILT);
    }
}

module.exports = Device;
