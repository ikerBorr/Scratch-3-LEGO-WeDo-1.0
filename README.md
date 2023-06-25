# New Scratch-Desktop version compatible with LEGO WeDo 1.0.

This is an extension compatible with `Scratch-Desktop` and the `LEGO WeDo 1.0` device.

## Installation

In order to install and build the application you need to download the [`Scratch-Desktop`](https://github.com/scratchfoundation/scratch-desktop) repository. Afterwards, the [`node-hid`](https://www.npmjs.com/package/node-hid) module must be installed. And, finally, save the new extension in the corresponding directory. In this last step it will also be necessary to modify some `Scratch-gui` and `Scratch-vm` files.

The [`Node`](https://nodejs.org/en/blog/release/v16.20.0) version used was `16.20.0`. And the version of `node-hid` has been `2.1.2`.

```bash
git clone https://github.com/scratchfoundation/scratch-desktop.git
git clone https://github.com/ikerBorr/Scratch3-LEGO-WeDo1.0.git
cd scratch-desktop
npm install
npm install node-hid
mkdir node_modules/scratch-vm/src/extensions/scratch3_wedo
cp -R ../src/ node_modules/scratch-vm/src/extensions/scratch3_wedo/
cp ../resource/extension-manager.js node_modules/scratch-vm/src/extension-support/.
cp ../resource/index.jsx /node_modules/scratch-gui/src/lib/libraries/extensions/.
```

## Build
 
Note that if the executable is not signed in Windows, the terminal will return an error. In any case, inside the `Dist` directory, you can find the unsigned executable.

```bash
npm run dist
```

## Download

The executable can be found in the release section or can be downloaded via the following [link](https://github.com/ikerBorr/Scratch3-LEGO-WeDo1.0/releases/download/v0.1/Scratch.3.29.1.Setup.exe).

## Contributing

In order to modify or customize the button images or icons, you can edit the `index.jsx` file. On the other hand, the operation of the extension is described in the files of the `src` directory.

All remaining information can be found in the repositories [`scratch-gui`](https://github.com/scratchfoundation/scratch-gui), [`scratch-vm`](https://github.com/scratchfoundation/scratch-vm) and [`scratch-desktop`](https://github.com/scratchfoundation/scratch-desktop).

It should be noted that in order to control the `LEGO WeDo 1.0` device, the [`node-wedo`](https://github.com/nathankellenicki/node-wedo/) module has been used as a reference, although some modifications have been added.
