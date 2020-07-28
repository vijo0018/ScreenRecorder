const { desktopCapturer, remote } = require("electron");
const { writeFile } = require("fs");

type mimeType = {
  mimeType: string;
};

import "./index.css";

console.log("👋 This message is being logged by \"renderer.js\", included via webpack");

const videoElement: HTMLVideoElement = document.querySelector("video");
const startBtn: HTMLElement = document.getElementById("startBtn");
const stopBtn: HTMLElement = document.getElementById("stopBtn");
const videoSelectBtn: HTMLElement = document.getElementById("videoSelectBtn");

const { Menu, dialog } = remote;

let mediaRecorder: MediaRecorder;
let recordedChunks: any = [];

startBtn.onclick = e => {
  mediaRecorder.start();
  startBtn.classList.add("is-danger");
  startBtn.innerText = "Recording";
};


stopBtn.onclick = e => {
  mediaRecorder.stop();
  startBtn.classList.remove("is-danger");
  startBtn.innerText = "Start";
};

const handleDataAvailable: any = (e: any) => {
  console.log("video data available");
  recordedChunks.push(e.data);
};

const handleStop: any = async (e: any) => {
  console.log("stop")
  const blob: Blob = new Blob(recordedChunks, {
    type: "video/webm; codecs=vp9"
  });

  const buffer: Buffer = Buffer.from(await blob.arrayBuffer());
  const { filePath } = await dialog.showSaveDialog({
    buttonLabel: "Save video",
    defaultPath: `vid-${Date.now()}.webm`
  });

  if (filePath) {
    writeFile(filePath, buffer, () => console.log("video saved successfully!"));
  }
};

const selectSource: any = async (source: any) => {
  videoSelectBtn.innerText = source.name;

  const constraints: any = {
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: "desktop",
        chromeMediaSourceId: source.id
      }
    }
  };
  const stream: MediaStream = await navigator.mediaDevices.getUserMedia(constraints);
  videoElement.srcObject = stream;
  videoElement.play();

  const options: mimeType = { mimeType: "video/webm; codecs=vp9" };
  mediaRecorder = new MediaRecorder(stream, options);

  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.onstop = handleStop;
};


const getVideoSources: any = async () => {
  const inputSources: Electron.DesktopCapturerSource[] = await desktopCapturer.getSources({
    types: ["window", "screen"]
  });

  const videoOptionsMenu: Electron.Menu = Menu.buildFromTemplate(
    inputSources.map(source => {
      return {
        label: source.name,
        click: () => selectSource(source)
      };
    })
  );
  videoOptionsMenu.popup();
};

videoSelectBtn.onclick = getVideoSources;