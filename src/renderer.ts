/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import "./index.css";

console.log("👋 This message is being logged by \"renderer.js\", included via webpack");

const { desktopCapturer, remote } = require("electron");

const videoElement: HTMLVideoElement = document.querySelector("video");
const startBtn: HTMLElement = document.getElementById("startBtn");
const stopBtn: HTMLElement = document.getElementById("stopBtn");
const videoSelectBtn: HTMLElement = document.getElementById("videoSelectBtn");

const { Menu } = remote;

const selectSource: any = () => {
  console.log("rar");
 };

const getVideoSources: any = async () => {
  const inputSources: Electron.DesktopCapturerSource[] = await desktopCapturer.getSources({
    types: ["window", "screen"]
  });

  const videoOptionsMenu: Electron.Menu = Menu.buildFromTemplate(
    inputSources.map(source => {
      return {
        label: source.name,
        click: () => selectSource()
      };
    })
  );
  videoOptionsMenu.popup();
};

videoSelectBtn.onclick = getVideoSources;