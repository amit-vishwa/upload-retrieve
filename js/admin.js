// References & variables
let Files = [];
let FileReaders = [];
let ImageLinksArray = [];

const imgdiv = document.getElementById("imagesDiv");
const addbtn = document.getElementById("addprodbtn");
const selbtn = document.getElementById("selimgsbtn");
const proglab = document.getElementById("loadlab");

const name = document.getElementById("nameinp");
const category = document.getElementById("catinp");
const description = document.getElementById("desarea");
const price = document.getElementById("priceinp");
const stock = document.getElementById("stockinp");

const p1 = document.getElementById("p1inp");
const p2 = document.getElementById("p2inp");
const p3 = document.getElementById("p3inp");
const p4 = document.getElementById("p4inp");

// functions
function OpenFileDialog() {
  let inp = document.createElement("input");
  inp.type = "file";
  inp.multiple = "multiple";
  inp.onchange = (e) => {
    AssignImgsToFilesArray(e.target.files);
    CreateImgTags();
  };
  inp.click();
}

function AssignImgsToFilesArray(thefiles) {
  let num = Files.length + thefiles.length;
  let loopim = num <= 10 ? thefiles.length : 10 - Files.length;
  for (let i = 0; i < loopim; i++) {
    Files.push(thefiles[i]); //TheFiles[i] in video
  }
  if (num > 10) alert("Maximum 10 images can be uploaded");
}

function CreateImgTags() {
  imgdiv.innerHTML = "";
  imgdiv.classList.add("imagesDivStyle");
  for (let i = 0; i < Files.length; i++) {
    FileReaders[i] = new FileReader();
    FileReaders[i].onload = function () {
      let img = document.createElement("img");
      img.id = "imgNo" + i;
      img.classList.add("imgs"); // it should be 'img'
      img.src = FileReaders[i].result;
      imgdiv.append(img);
    };
    FileReaders[i].readAsDataURL(Files[i]);
  }
  let lab = document.getElementById("label");
  lab.innerHTML = "clear images";
  lab.style = "cursor:pointer; display:block; color:navy; font-size:12px";
  lab.addEventListener("click", ClearImages);
  imgdiv.append(lab);
}

function ClearImages() {
  Files = [];
  ImageLinksArray = [];
  imgdiv.innerHTML = "";
  imgdiv.classList.remove("imagesDivStyle");
}

function getShortTitle() {
  let namey = name.value.substring(0, 50);
  return namey.replace(/[^a-zA-Z0-9]/g, ""); //replaces character other than this with a blank
}

function GetImgUploadProgess() {
  return "Images Uploaded " + ImageLinksArray.length + " of " + Files.length;
}

function isAllImagesUploaded() {
  return ImageLinksArray.length == Files.length;
}

function getPoints() {
  let points = [];
  if (p1.value.length > 0) points.push(p1.value);
  if (p2.value.length > 0) points.push(p2.value);
  if (p3.value.length > 0) points.push(p3.value);
  if (p4.value.length > 0) points.push(p4.value);
  return points;
}

function RestoreBack() {
  selbtn.disabled = false;
  addbtn.disabled = false;
}

// Events
selbtn.addEventListener("click", OpenFileDialog);
addbtn.addEventListener("click", UploadAllImages);

// Upload Image to Firebase Storage
function UploadAllImages() {
  selbtn.disabled = true;
  addbtn.disabled = true;
  ImageLinksArray = [];
  for (let i = 0; i < Files.length; i++) {
    UploadAnImage(Files[i], i);
  }
}

function UploadAnImage(imgToUpload, imgNo) {
  const metadata = {
    contentType: imgToUpload.type,
  };
  const storage = getStorage();
  const ImageAddress = "TheImages" + getShortTitle() + "/img#" + (imgNo + 1);
  const storageRef = sRef(storage, ImageAddress);
  const UploadTask = uploadBytesResumable(storageRef, imgToUpload, metadata);
  UploadTask.on(
    "state_changed",
    (snapshot) => {
      proglab.innerHTML = GetImgUploadProgess();
    },
    (error) => {
      alert("Error : Image Upload Failed!");
    },
    () => {
      getDownloadURL(UploadTask.snapshot.ref).then((downloadURL) => {
        ImageLinksArray.push(downloadURL);
        if (isAllImagesUploaded()) {
          proglab.innerHTML = "All Images Uploaded";
          UploadAProduct();
        }
      });
    }
  );
}

// Firebase configurations
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBo5nPXUxmB9iX6fOzlmeT3crxovFN7g_A",
  authDomain: "nodewithfirebase-e05d3.firebaseapp.com",
  projectId: "nodewithfirebase-e05d3",
  storageBucket: "nodewithfirebase-e05d3.appspot.com",
  messagingSenderId: "721313131236",
  appId: "1:721313131236:web:41610d5b8b216f6edadaf1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase storage
import {
  getStorage,
  ref as sRef,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-storage.js";

// Firebase realtime
import {
  getDatabase,
  ref,
  set,
  child,
  get,
} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";
const realdb = getDatabase();

// Upload A Product
function UploadAProduct() {
  set(ref(realdb, "TheProductRealdb/" + getShortTitle()), {
    ProductTitle: name.value,
    Category: category.value,
    Description: description.value,
    Price: price.value,
    Stock: stock.value,
    Points: getPoints(),
    LinkOfImagesArray: ImageLinksArray,
  });
  alert("Upload successful");
  RestoreBack();
}
