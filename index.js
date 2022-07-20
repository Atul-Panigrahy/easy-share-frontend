const dropZone = document.querySelector(".drop-zone");
const browseBtn = document.querySelector("#browseBtn");
const fileInput = document.querySelector("#fileInput");

const progessContainer = document.querySelector(".progress-container");
const bgProgress = document.querySelector(".bg-progress");
const percentDiv = document.querySelector("#percent");
const progressBar = document.querySelector(".progress-bar");

const sharingContainer = document.querySelector(".sharing-container");
const fileDownloadURL = document.querySelector("#fileDownloadURL");
const copyBtn = document.querySelector("#copyBtn");

const host = "http://localhost:3000";
const uploadURL = `${host}/api/files`;

browseBtn.addEventListener("click", (event) => {
  fileInput.click();
});

dropZone.addEventListener("dragover", (event) => {
  event.stopPropagation();
  event.dataTransfer.dropEffect = "copy";
  event.preventDefault();
  if (!dropZone.classList.contains("dragged")) {
    dropZone.classList.add("dragged");
  }
});

dropZone.addEventListener("drop", (event) => {
  event.stopPropagation();
  event.preventDefault();
  dropZone.classList.remove("dragged");

  const files = event.dataTransfer.files;
  // console.log(files);
  if (files.length) {
    fileInput.files = files;
    uploadFile();
  } else {
    console.log("Upload a File!");
  }
});

dropZone.addEventListener("dragleave", (event) => {
  event.preventDefault();
  dropZone.classList.remove("dragged");
});

fileInput.addEventListener("change", () => {
  uploadFile();
});

copyBtn.addEventListener("click", (event) => {
  fileDownloadURL.select();
  document.execCommand("copy");
});

const updateProgress = (event) => {
  progessContainer.style.display = "block";

  // in Chrome console network tab Enable network throttling and present to slow 3G
  // console.log(event);

  const loaded = event.loaded;
  const total = event.total;

  const percentLoaded = Math.round((loaded / total) * 100);
  // console.log(percentLoaded);
  bgProgress.style.width = `${percentLoaded}%`;
  percentDiv.innerText = `${percentLoaded}%`;

  progressBar.style.transform = `scaleX(${percentLoaded / 100})`;
};

const showLink = ({ file: DownloadURL }) => {
  // console.log(DownloadURL);
  progessContainer.style.display = "none";
  fileDownloadURL.value = DownloadURL;
  sharingContainer.style.display = "block";
};

const uploadFile = () => {
  const files = fileInput.files[0];
  const formData = new FormData();
  formData.append("myfile", files);

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    // console.log(xhr.readyState);
    if (xhr.readyState === XMLHttpRequest.DONE) {
      console.log(xhr.response);
      showLink(JSON.parse(xhr.response));
    }
  };

  xhr.upload.onprogress = updateProgress;

  xhr.open("POST", uploadURL);
  xhr.send(formData);
};
