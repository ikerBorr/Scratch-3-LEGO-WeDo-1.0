# New Scratch-Desktop version compatible with LEGO WeDo 1.0.

This extension is compatible with `Scratch-Desktop` and the `LEGO WeDo 1.0` device.

## Installation

To install and build the application, you will need to download the `Scratch-Desktop` repository. Next, you should install the [`node-hid`](https://www.npmjs.com/package/node-hid) module. Finally, save the new extension in the appropriate directory. During this last step, it will also be necessary to modify certain `Scratch-gui` and `Scratch-vm` files.

The application was built using `Node` version [`16.20.0`](https://nodejs.org/en/blog/release/v16.20.0), and the `node-hid` module version `2.1.2` was utilized.

```bash
git clone https://github.com/scratchfoundation/scratch-desktop.git
git clone https://github.com/ikerBorr/Scratch-3-LEGO-WeDo-1.0
cd scratch-desktop
npm install
npm install node-hid
mkdir node_modules/scratch-vm/src/extensions/scratch3_wedo
cp -R ../src/ node_modules/scratch-vm/src/extensions/scratch3_wedo/
cp ../resource/extension-manager.js node_modules/scratch-vm/src/extension-support/.
cp ../resource/index.jsx /node_modules/scratch-gui/src/lib/libraries/extensions/.
```

## Build

Please note that if the executable is not signed in Windows, the terminal will return an error. However, you can still find the unsigned executable inside the `Dist` directory.

```bash
npm run dist
```

## Download

The executable can be found in the release section or can be downloaded using the following [link](https://github.com/ikerBorr/Scratch3-LEGO-WeDo1.0/releases/download/v0.1/Scratch.3.29.1.Setup.exe).

## Contributing

To modify or customize the button images or icons, you can edit the `index.jsx` file. Additionally, the functionality of the extension is described in the files within the `src` directory.

For further information, you can refer to the repositories `scratch-gui`, `scratch-vm` and `scratch-desktop`.

Please note that the [`node-wedo`](https://github.com/nathankellenicki/node-wedo/) module has been used as a reference for controlling the `LEGO WeDo 1.0` device, with some additional modifications.
