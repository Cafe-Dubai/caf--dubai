const openSearch = document.getElementById("openSearch");
const searchBar = document.getElementById("searchBar");
const closeSearch = document.getElementById("closeSearch");

openSearch.addEventListener("click", () => {
    searchBar.classList.add("active");
});

closeSearch.addEventListener("click", () => {
    searchBar.classList.remove("active");
});


document.querySelectorAll(".menu-card").forEach(card => {
    const minusBtn = card.querySelector(".minus");
    const plusBtn = card.querySelector(".plus");
    const qtyInput = card.querySelector(".qty-input");

    minusBtn.onclick = () => {
        let value = Number(qtyInput.value);
        if (value > 1) qtyInput.value = value - 1;
    };

    plusBtn.onclick = () => {
        let value = Number(qtyInput.value);
        qtyInput.value = value + 1;
    };
});


let cart = [];

const cartIcon = document.querySelector(".fi-br-shopping-cart");
const cartModal = document.getElementById("cartModal");
const overlay = document.getElementById("overlay");
const closeCart = document.getElementById("closeCart");
const cartList = document.getElementById("cartList");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");


cartIcon.addEventListener("click", () => {
    cartModal.classList.add("active");
    overlay.classList.add("active");
});


closeCart.addEventListener("click", closeCartModal);
overlay.addEventListener("click", closeCartModal);

function closeCartModal() {
    cartModal.classList.remove("active");
    overlay.classList.remove("active");
}


document.querySelectorAll(".menu-card").forEach(card => {
    const addToCartBtn = card.querySelector(".add-to-cart");

    addToCartBtn.addEventListener("click", () => {
        const name = card.querySelector("h3").innerText;
        const image = card.querySelector("img").src;
        const price = parseFloat(
            card.querySelector(".price").innerText.replace("R$ ", "").replace(",", ".")
        );
        const qty = parseInt(card.querySelector(".qty-input").value);

        const existing = cart.find(item => item.name === name);

        if (existing) {
            existing.qty += qty;
        } else {
            cart.push({ name, image, price, qty });
        }

        updateCart();
    });
});


function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}


function updateCart() {
    cartList.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        const li = document.createElement("li");

        li.innerHTML = `
            <img src="${item.image}">
            <div class="cart-info">
                <h4>${item.name}</h4>
                <p>${item.qty}x — R$ ${(item.price * item.qty).toFixed(2)}</p>
            </div>
            <i class="fi fi-br-trash remove-item" onclick="removeItem(${index})"></i>
        `;

        cartList.appendChild(li);

        total += item.price * item.qty;
    });

    cartTotal.innerText = "Total: R$ " + total.toFixed(2);

    updateCheckoutButton();
}


function updateCheckoutButton() {
    if (cart.length === 0) {
        checkoutBtn.classList.add("disabled");
        checkoutBtn.disabled = true;
    } else {
        checkoutBtn.classList.remove("disabled");
        checkoutBtn.disabled = false;
    }
}



const checkoutModal = document.getElementById("checkoutModal");
const closeClient = document.querySelector(".close-client");


checkoutBtn.addEventListener("click", () => {
    if (!checkoutBtn.classList.contains("disabled")) {
        checkoutModal.classList.add("active");
    }
});


closeClient.addEventListener("click", () => {
    checkoutModal.classList.remove("active");
});


checkoutModal.addEventListener("click", (e) => {
    if (e.target === checkoutModal) {
        checkoutModal.classList.remove("active");
    }
});

// Menu Hamburger
const menuToggle = document.querySelector('.menu-toggle');
const navbar = document.querySelector('.navbar');
const menuOverlay = document.querySelector('.menu-overlay');
const navLinks = document.querySelectorAll('.navbar a');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navbar.classList.toggle('active');
    menuOverlay.classList.toggle('active');
});

// Fechar menu ao clicar em um link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navbar.classList.remove('active');
        menuOverlay.classList.remove('active');
    });
});

// Fechar menu ao clicar no overlay
menuOverlay.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    navbar.classList.remove('active');
    menuOverlay.classList.remove('active');
});

// Header que esconde ao rolar (para Opção 2)
let lastScrollY = window.scrollY;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
        header.classList.add('hidden');
    } else {
        header.classList.remove('hidden');
    }
    lastScrollY = window.scrollY;
});


document.getElementById("cep").addEventListener("input", function () {
    let cep = this.value.replace(/\D/g, "");
    if (cep.length > 5) {
        this.value = cep.replace(/(\d{5})(\d{1,3})/, "$1-$2");
    } else {
        this.value = cep;
    }
});


document.getElementById("cep").addEventListener("blur", function () {
    let cep = this.value.replace(/\D/g, "");

    if (cep.length !== 8) return;

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(res => res.json())
        .then(data => {
            if (data.erro) return;

            document.getElementById("endereco").value = data.logradouro || "";
            document.getElementById("bairro").value = data.bairro || "";
            document.getElementById("cidade").value = data.localidade || "";
            document.getElementById("estado").value = data.uf || "";
        });
});


function whatsappApi () {
    console.log('a');
}
