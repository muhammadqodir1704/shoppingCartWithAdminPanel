const cardWrapper = document.getElementById("cardWrapper");
const cartNumber = document.querySelector("#cartNumber");
const modalBody = document.querySelector("#exampleModal .modal-body");
const cart = [];

const toastSuccess = (message) => {
  Toastify({
    text: message,
    duration: 2000,
    style: {
      paddingTop: "10px",
      margin: "20px",
      background: "rgb(79, 179, 79)",
      borderRadius: "10px",
      width: "300px",
      height: "50px",
      fontSize: "20px",
      textAlign: "center",
      color: "white",
      position: "fixed",
      zIndex: 1,
    },
  }).showToast();
};

const toastError = (message) => {
  Toastify({
    text: message,
    duration: 2000,
    style: {
      paddingTop: "10px",
      margin: "20px",
      background: "rgb(201, 68, 68)",
      borderRadius: "10px",
      width: "300px",
      height: "50px",
      fontSize: "20px",
      textAlign: "center",
      color: "white",
      position: "fixed",
      zIndex: 1,
    },
  }).showToast();
};

fetch("https://json-api-c6gv.onrender.com/products", {
  method: "GET",
})
  .then((res) => res.json())
  .then((json) => {
    json.forEach((element) => {
      printProduct(element);
    });
  });

function printProduct(product) {
  const title = product.title.split(" ").slice(0, 2).join(" ");
  const sale = product.rating.count <= 250;
  const stars = Math.round(product?.rating?.rate);
  let star = "";
  for (let i = 0; i < stars; i++) {
    star += "<div class='bi-star-fill'></div>";
  }

  cardWrapper.innerHTML += `
    <div class="col mb-5">
        <div class="card h-100">
            ${
              sale
                ? `<div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Sale</div>`
                : ""
            }
            <img class="card-img-top p-4" height="250" src="${
              product?.image
            }" alt="${title}" />
            <div class="card-body p-4"> 
                <div class="text-center">
                    <h5 class="fw-bolder">${title}... </h5>
                    <div class="d-flex justify-content-center small text-warning mb-2">
                        ${star}
                    </div>
                    $${product?.price}
                </div>
            </div>
            <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                <div class="text-center">
                    <a class="btn btn-outline-dark mt-auto" onclick="addToCart('${
                      product?.id
                    }')">Add to cart</a>
                </div>
            </div>
        </div>
    </div>`;
}

function addToCart(productId) {
  fetch(`https://json-api-c6gv.onrender.com/products/${productId}`)
    .then((res) => res.json())
    .then((product) => {
      cart.push(product);
      cartNumber.textContent = cart.length;
      console.log(cart);
      updateModal();
    });
  toastSuccess("Mahsulot savatga qo'shildi");
}

function updateModal() {
  modalBody.innerHTML = "";
  cart.forEach((product) => {
    const title = product.title.split(" ").slice(0, 2).join(" "); 
    modalBody.innerHTML += `
      <div class="cart-item">
        <img src="${product.image}" alt="${title}" width="100">
        <div class="cart-item-details">
          <h2>${title}</h2>
          <h4 style="color:green">$${product.price}</h4>
        </div>
        <i onclick="deleteItem(${product.id})" class="fa-solid fa-trash-can"></i>
      </div>      
    `;
  });
}

function deleteItem(productId){
  const index = cart.findIndex(product => product.id === productId);
  cart.splice(index, 1);
  toastError("Mahsulot savatdan o'chirildi");
  cartNumber.textContent = cart.length; 
  updateModal();
}