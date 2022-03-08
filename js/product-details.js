let product = null;
window.onload = function () {
  product = localStorage.Product;
  if (product) {
    product = JSON.parse(product);
    LoadProduct();
  }
};

function LoadProduct() {
  document.getElementById("titleli").innerHTML = product.Title;
  document.getElementById("catlink").innerHTML = product.Category;
  document.getElementById("bigimg").src = product.LinkOfImagesArray[0];
  document.getElementById("title").innerHTML = product.ProductTitle;
  document.getElementById("description").innerHTML = product.Description;
  document.getElementById("price").innerHTML = "Rs " + product.Price;
  if (product.Stock < 1)
    document.getElementById("btnDiv").innerHTML =
      '<h3 class="text-warning">Out Of Stock</h3>';
  GenLi();
  GenImgs();
}

function GenLi() {
  product.Points.forEach((html) => {
    if (html.length > 1) {
      let li = document.createElement("li");
      li.innerHTML = html;
      document.getElementById("points").append(li);
    }
  });
}

function GenImgs() {
  let i = 1;
  let html = "";
  product.LinkOfImagesArray.forEach((imglink) => {
    let img = document.createElement("img");
    img.src = imglink;
    img.classList.add("smimgs", "mr-2", "mb-2");
    img.id = "im" + i++;
    img.addEventListener("click", ChangeBigImg);
    document.getElementById("smImgsDiv").append(img);
  });
}

function ChangeBigImg(event) {
  let elem = document.getElementById(event.target.id);
  document.getElementById("bigimg").src = elem.src;
}
