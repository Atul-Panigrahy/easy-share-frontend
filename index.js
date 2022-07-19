const dropZone = document.querySelector(".drop-zone");
const browseBtn = document.querySelector("#browseBtn");
const fileInput = document.querySelector("#fileInput");

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
  console.log(files);
});

dropZone.addEventListener("dragleave", (event) => {
  event.preventDefault();
  dropZone.classList.remove("dragged");
});
