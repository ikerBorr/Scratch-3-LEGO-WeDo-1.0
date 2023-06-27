const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Runtime = require('../../engine/runtime');

const consts = require("./consts");
const Device = require("./device");

const OP = {
    '<': 0, 
    '>': 1
}

const iconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOS4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9Ii0yODUgMjMzIDQwIDQwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IC0yODUgMjMzIDQwIDQwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDojRTZFN0U4O3N0cm9rZTojN0M4N0E1O3N0cm9rZS13aWR0aDowLjg2MztzdHJva2UtbWl0ZXJsaW1pdDoxMDt9DQoJLnN0MXtmaWxsOiNFNkU3RTg7c3Ryb2tlOiM3Qzg3QTU7c3Ryb2tlLXdpZHRoOjAuODYzO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDt9DQoJLnN0MntmaWxsOm5vbmU7c3Ryb2tlOiM3Qzg3QTU7c3Ryb2tlLXdpZHRoOjAuODYzO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDt9DQo8L3N0eWxlPg0KPGc+DQoJPHBhdGggY2xhc3M9InN0MCIgZD0iTS0yNzAuNCwyNDcuMWgtMS4zYy0wLjQsMC0wLjctMC4zLTAuNy0wLjd2LTAuN2MwLTAuMiwwLjItMC40LDAuNC0wLjRoMS45YzAuMiwwLDAuNCwwLjIsMC40LDAuNHYwLjcNCgkJQy0yNjkuNywyNDYuOC0yNzAsMjQ3LjEtMjcwLjQsMjQ3LjF6Ii8+DQoJPGVsbGlwc2UgY2xhc3M9InN0MCIgY3g9Ii0yNzEiIGN5PSIyNDUuNSIgcng9IjEuMyIgcnk9IjAuMyIvPg0KPC9nPg0KPGc+DQoJPHBhdGggY2xhc3M9InN0MCIgZD0iTS0yNjUuNywyNDcuMWgtMS4zYy0wLjQsMC0wLjctMC4zLTAuNy0wLjd2LTAuN2MwLTAuMiwwLjItMC40LDAuNC0wLjRoMS45YzAuMiwwLDAuNCwwLjIsMC40LDAuNHYwLjcNCgkJQy0yNjUsMjQ2LjgtMjY1LjMsMjQ3LjEtMjY1LjcsMjQ3LjF6Ii8+DQoJPGVsbGlwc2UgY2xhc3M9InN0MCIgY3g9Ii0yNjYuMyIgY3k9IjI0NS41IiByeD0iMS4zIiByeT0iMC4zIi8+DQo8L2c+DQo8Zz4NCgk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNLTI1OS4xLDI1Mi43aC0xLjNjLTAuNCwwLTAuNy0wLjMtMC43LTAuN3YtMC43YzAtMC4yLDAuMi0wLjQsMC40LTAuNGgxLjljMC4yLDAsMC40LDAuMiwwLjQsMC40djAuNw0KCQlDLTI1OC40LDI1Mi40LTI1OC43LDI1Mi43LTI1OS4xLDI1Mi43eiIvPg0KCTxlbGxpcHNlIGNsYXNzPSJzdDAiIGN4PSItMjU5LjciIGN5PSIyNTEuMiIgcng9IjEuMyIgcnk9IjAuMyIvPg0KPC9nPg0KPGc+DQoJPHBhdGggY2xhc3M9InN0MCIgZD0iTS0yNTQuOSwyNTIuN2gtMS4zYy0wLjQsMC0wLjctMC4zLTAuNy0wLjd2LTAuN2MwLTAuMiwwLjItMC40LDAuNC0wLjRoMS45YzAuMiwwLDAuNCwwLjIsMC40LDAuNHYwLjcNCgkJQy0yNTQuMiwyNTIuNC0yNTQuNSwyNTIuNy0yNTQuOSwyNTIuN3oiLz4NCgk8ZWxsaXBzZSBjbGFzcz0ic3QwIiBjeD0iLTI1NS41IiBjeT0iMjUxLjIiIHJ4PSIxLjMiIHJ5PSIwLjMiLz4NCjwvZz4NCjxnPg0KCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0tMjUyLjYsMjUxLjIiLz4NCgk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNLTI1My41LDI2MC42aC0yNGMtMC41LDAtMC45LTAuNC0wLjktMC45VjI1MmMwLTIuOSwyLjQtNS4zLDUuMy01LjNoOC44YzAuOCwwLDEuNSwwLjcsMS41LDEuNWwwLDIuNQ0KCQljMCwwLjgsMC43LDEuNSwxLjUsMS41aDguMWMwLjMsMCwwLjUsMC4yLDAuNSwwLjV2Ni45Qy0yNTIuNiwyNjAuMi0yNTMsMjYwLjYtMjUzLjUsMjYwLjZ6Ii8+DQoJPHBhdGggY2xhc3M9InN0MSIgZD0iTS0yNTAsMjUxLjIiLz4NCgk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNLTI1MS43LDI1MS4yIi8+DQo8L2c+DQo8cG9seWxpbmUgY2xhc3M9InN0MiIgcG9pbnRzPSItMjc4LjIsMjUzLjcgLTI3Mi43LDI1My43IC0yNjcuNywyNTguMSAtMjUyLjcsMjU4LjEgIi8+DQo8L3N2Zz4NCg==';

class Wedo1 {
    constructor (runtime) {
        this._runtime = runtime;
        this._wedo = new Device();      
        this._runtime.on(Runtime.PROJECT_STOP_ALL, this.reset.bind(this));
    }

    getInfo () {
        return {
            id: "wedo1",
            name: "WeDo 1.0",
            blockIconURI: iconURI,
            blocks: [
                {
                    opcode: "turnOnTime",
                    blockType: BlockType.COMMAND,
                    text: "turn [motor] on for [time] secs",
                    arguments: {
                        motor: {
                            type: ArgumentType.STRING,
                            menu: "POWERED",
                            defaultValue: "motor"
                        },
                        time: {
                            type: ArgumentType.NUMBER,
                            defaultValue: "1"
                        }
                    }
                },
                {
                    opcode: "turnOn",
                    blockType: BlockType.COMMAND,
                    text: "turn [motor] on",
                    arguments: {
                        motor: {
                            type: ArgumentType.STRING,
                            menu: "POWERED",
                            defaultValue: "motor"
                        }
                    }
                },
                {
                    opcode: "turnOff",
                    blockType: BlockType.COMMAND,
                    text: "turn [motor] off",
                    arguments: {
                        motor: {
                            type: ArgumentType.STRING,
                            menu: "POWERED",
                            defaultValue: "motor"
                        }
                    }
                },
                {
                    opcode: "setPower",
                    blockType: BlockType.COMMAND,
                    text: "set [motor] power to [power]",
                    arguments: {
                        motor: {
                            type: ArgumentType.STRING,
                            menu: "POWERED",
                            defaultValue: "motor"
                        },
                        power: {
                            type: ArgumentType.NUMBER,
                            defaultValue: "100"
                        }
                    }
                },
                {
                    opcode: "setDirection",
                    blockType: BlockType.COMMAND,
                    text: "set [motor] direction to [direction]",
                    arguments: {
                        motor: {
                            type: ArgumentType.STRING,
                            menu: "POWERED",
                            defaultValue: "motor"
                        },
                        direction: {
                            type: ArgumentType.STRING,
                            menu: "DIRECTION",
                            defaultValue: "forward"
                        }
                    }
                },
                {
                    opcode: "whenDistance",
                    blockType: BlockType.HAT,
                    text: "when distance [op] [num]",
                    arguments: {
                        op: {
                            type: ArgumentType.STRING,
                            menu: "OP",
                            defaultValue: "<"
                        },
                        num: {
                            type: ArgumentType.NUMBER,
                            defaultValue: "20"
                        }
                    }
                },
                {
                    opcode: "whenTilt",
                    blockType: BlockType.HAT,
                    text: "when tilted [tilt]",
                    arguments: {
                        tilt: {
                            type: ArgumentType.STRING,
                            menu: "TILT",
                            defaultValue: "any"
                        }
                    }
                },
                {
                    opcode: "getDistance",
                    blockType: BlockType.REPORTER,
                    text: "distance",
                    arguments: {
                    }
                },
                {
                    opcode: "getTilt",
                    blockType: BlockType.BOOLEAN,
                    text: "tilted [tilt]?",
                    arguments: {
                        tilt: {
                            type: ArgumentType.STRING,
                            menu: "TILT",
                            defaultValue: "any"
                        }
                    }
                }
            ],
            menus: {
                OP: Object.keys(OP),
                TILT: Object.keys(consts.TITL_EVENT).map(key => key.toLowerCase()),
                POWERED: Object.keys(consts.MOTOR),
                DIRECTION: Object.keys(consts.DIRECTION)
            }
        };
    }

    reset() {
        this._wedo.stopAll();
        this._wedo.startEx();
        return 0;
    }

    async turnOnTime({motor, time}) {

        const delay = ms => new Promise(res => setTimeout(res, ms));

        await this._wedo.turnOnMotor(consts.MOTOR[motor], consts.FLAG_POWER.DEFAULT);
        await delay(time * 1000);
        await this._wedo.turnOnMotor(consts.MOTOR[motor], consts.FLAG_POWER.OFF);
    }

    async turnOn({motor}){

        await this._wedo._turnOnMotor(consts.MOTOR[motor], consts.FLAG_POWER.DEFAULT);
    }

    async turnOff({motor}){

        await this._wedo._turnOnMotor(consts.MOTOR[motor], consts.FLAG_POWER.OFF);
    }

    setPower({motor, power}){

        this._wedo.setPower(consts.MOTOR[motor], power);
    }

    setDirection({motor, direction}){
        
        this._wedo.setDirection(consts.MOTOR[motor], consts.DIRECTION[direction]);
    }

    whenDistance({op, num}){
        
        const distance = this._wedo.getDistance();

        if (op == OP["<"]){
            return distance < num;
        } else if (op == OP[">"]) {
            return distance > num;
        }
    }

    whenTilt({tilt}){

        return this._wedo.getTilt() === tilt; 

    }

    getDistance({}) {
        
        return this._wedo.getDistance();
    }

    getTilt({tilt}){
        
        return this._wedo.getTilt() === tilt;
    }
}

module.exports = Wedo1;
