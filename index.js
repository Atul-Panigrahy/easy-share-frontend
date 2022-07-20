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

const emailForm = document.querySelector("#emailForm");
const sendEmailBtn = document.querySelector("#sendEmailBtn");

const toast = document.querySelector(".toast");

const host = "http://localhost:3000";
const uploadURL = `${host}/api/files`;
const emailURL = `${host}/api/files/send`;

const maxAllowedSize = 100 * 1024 * 1024;

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
  showToast("Link Copied");
});

emailForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const url = fileDownloadURL.value;
  const formData = {
    uuid: url.split("/").splice(-1, 1)[0],
    emailFrom: emailForm.elements["from-email"].value,
    emailTo: emailForm.elements["to-email"].value,
  };

  // console.table(formData);
  sendEmailBtn.setAttribute("disabled", "true");

  fetch(emailURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.success) {
        sharingContainer.style.display = "none";
        showToast("Email Sent");
      }
    });
});

/* Utility Functions */
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

  sendEmailBtn.removeAttribute("disabled");

  fileInput.value = "";
  progessContainer.style.display = "none";
  fileDownloadURL.value = DownloadURL;
  sharingContainer.style.display = "block";
};

const uploadFile = () => {
  console.log(fileInput.files);
  if (fileInput.files.length > 1) {
    fileInput.value = "";
    showToast("Only upload 1 file");
    console.log("only upload one files");
    return;
  }
  const files = fileInput.files[0];

  if (files.size > maxAllowedSize) {
    fileInput.value = "";
    showToast("Can't upload file size more than 100 MB");
    return;
  }
  progessContainer.style.display = "block";

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

  xhr.upload.onerror = () => {
    fileInput.value = "";
    showToast(`Error in upload ${xhr.statusText}`);
  };

  xhr.open("POST", uploadURL);
  xhr.send(formData);
};

let toastTimer;
// the toast function
const showToast = (msg) => {
  clearTimeout(toastTimer);
  toast.innerText = msg;
  toast.classList.add("show");
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
};
