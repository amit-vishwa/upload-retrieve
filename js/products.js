// Firebase configurations
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
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

let outerDiv = document.getElementById("productsDiv");
let ArrayOfProducts = [];
window.addEventListener("load", GetAllProducts);
function GetAllProducts() {
  const dbref = ref(realdb);
  get(child(dbref, "TheProductRealdb")).then((snapshot) => {
    snapshot.forEach((prod) => {
      ArrayOfProducts.push(prod.val());
    });
    AddAllProducts();
  });
}

function AddAllProducts() {
  let i = 0;
  ArrayOfProducts.forEach((prod) => {
    AddProduct(prod, i++);
  });
  AssignAllEvents();
}

function getShortTitle(title) {
  if (title.length > 70) title = title.substring(0, 68);
  else return title;
  return title + "...";
}

function AddProduct(product, index) {
  let html =
    `
            <img src="` +
    product.LinkOfImagesArray[0] +
    `" class="thumb mt-2" id="thumb-` +
    index +
    `"><br>
            <p class="title text-center" id="title-` +
    index +
    `">` +
    getShortTitle(product.ProductTitle) +
    `</p>
            ` +
    GetUl(product.Points) +
    GenerateStockLabel(product.Stock) +
    `
            <h6 class="price">Rs ` +
    product.Price +
    `</h6>
            <button class="detbtn btn btn-outline-primary" id="detbtn-` +
    index +
    `">View Details</button><br>`;

  let newProd = document.createElement("div");
  newProd.classList.add("productcard");
  newProd.innerHTML = html;
  outerDiv.append(newProd);
}

function GenerateStockLabel(stock) {
  let stocklabel = document.createElement("h5");
  stocklabel.classList.add("stock");
  if (stock > 0) {
    stocklabel.innerHTML = "IN STOCK";
    stocklabel.classList.add("text-success");
  } else {
    stocklabel.innerHTML = "OUT OF STOCK";
    stocklabel.classList.add("text-warning");
  }
  return stocklabel.outerHTML;
}

function GetUl(array) {
  let ul = document.createElement("ul");
  ul.classList.add("points");
  array.forEach((element) => {
    let li = document.createElement("li");
    li.innerHTML = element;
    ul.append(li);
  });
  return ul.outerHTML;
}

function GetProductIndex(id) {
  var indstart = id.indexOf("-") + 1;
  var indend = id.length;
  return Number(id.substring(indstart, indend));
}

function GotoProductDetails(event) {
  var index = GetProductIndex(event.target.id);
  localStorage.Product = JSON.stringify(ArrayOfProducts[index]);
  console.log(ArrayOfProducts[index]);
  window.location = "product-details.html";
}

function AssignAllEvents() {
  var btns = document.getElementsByClassName("detbtn");
  var titles = document.getElementsByClassName("title");
  var thumbs = document.getElementsByClassName("thumb");
  for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", GotoProductDetails);
    titles[i].addEventListener("click", GotoProductDetails);
    thumbs[i].addEventListener("click", GotoProductDetails);
  }
}
