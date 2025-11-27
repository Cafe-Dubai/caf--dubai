// ===============================
// ABRIR E FECHAR BARRA DE PESQUISA
// ===============================
const openSearch = document.getElementById("openSearch");
const searchBar = document.getElementById("searchBar");
const closeSearch = document.getElementById("closeSearch");

// Abre a barra de pesquisa
openSearch.addEventListener("click", () => {
  searchBar.classList.add("active");
});

// Fecha a barra de pesquisa
closeSearch.addEventListener("click", () => {
  searchBar.classList.remove("active");
});


// ===============================
// BOTÕES DE SOMAR E SUBTRAIR PRODUTO
// ===============================
document.querySelectorAll(".menu-card").forEach((card) => {
  const minusBtn = card.querySelector(".minus");
  const plusBtn = card.querySelector(".plus");
  const qtyInput = card.querySelector(".qty-input");

  // Diminuir número, mínimo 1
  minusBtn.onclick = () => {
    let value = Number(qtyInput.value);
    if (value > 1) qtyInput.value = value - 1;
  };

  // Aumentar número
  plusBtn.onclick = () => {
    let value = Number(qtyInput.value);
    qtyInput.value = value + 1;
  };
});


// ===============================
// SISTEMA DE CARRINHO
// ===============================
let cart = []; // Armazena todos os itens do carrinho

const cartIcon = document.querySelector(".fi-br-shopping-cart");
const cartModal = document.getElementById("cartModal");
const overlay = document.getElementById("overlay");
const closeCart = document.getElementById("closeCart");
const cartList = document.getElementById("cartList");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

// Abre o modal do carrinho
cartIcon.addEventListener("click", () => {
  cartModal.classList.add("active");
  overlay.classList.add("active");
});

// Fecha cart modal e overlay
closeCart.addEventListener("click", closeCartModal);
overlay.addEventListener("click", closeCartModal);

// Função que fecha o carrinho
function closeCartModal() {
  cartModal.classList.remove("active");
  overlay.classList.remove("active");
}


// ===============================
// ADICIONAR PRODUTO AO CARRINHO
// ===============================
document.querySelectorAll(".menu-card").forEach((card) => {
  const addToCartBtn = card.querySelector(".add-to-cart");

  addToCartBtn.addEventListener("click", () => {
    const name = card.querySelector("h3").innerText; // Nome
    const image = card.querySelector("img").src; // Imagem

    // Converte preço de "12,90" para número 12.90
    const price = parseFloat(
      card.querySelector(".price").innerText.replace("R$ ", "").replace(",", ".")
    );

    const qty = parseInt(card.querySelector(".qty-input").value); // Quantidade

    const existing = cart.find((item) => item.name === name);

    if (existing) {
      existing.qty += qty; // Se já existe, só soma a quantidade
    } else {
      cart.push({ name, image, price, qty }); // Adiciona novo item
    }

    updateCart();
  });
});


// ===============================
// REMOVER ITEM DO CARRINHO
// ===============================
function removeItem(index) {
  cart.splice(index, 1); // Remove item pelo índice
  updateCart();
}


// ===============================
// ATUALIZAR VISUAL DO CARRINHO
// ===============================
function updateCart() {
  cartList.innerHTML = ""; // Limpa lista
  let total = 0; // Soma total

  cart.forEach((item, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
    <img src="${item.image}">
    <div class="cart-info">
        <h4>${item.name}</h4>
        <p>${item.qty}x — R$ ${(item.price * item.qty)
          .toFixed(2)
          .replace(".", ",")}</p>
    </div>
    <i class="fi fi-br-trash remove-item" onclick="removeItem(${index})"></i>
`;

    cartList.appendChild(li);

    total += item.price * item.qty; // Soma total final
  });

  // Correção: agora exibe vírgula em vez de ponto
  cartTotal.innerText = "Total: R$ " + total.toFixed(2).replace(".", ",");

  updateCheckoutButton();
}


// ===============================
// DESABILITA BOTÃO DE FINALIZAR SE NÃO TIVER ITENS
// ===============================
function updateCheckoutButton() {
  if (cart.length === 0) {
    checkoutBtn.classList.add("disabled");
    checkoutBtn.disabled = true;
  } else {
    checkoutBtn.classList.remove("disabled");
    checkoutBtn.disabled = false;
  }
}


// ===============================
// MODAL DE FINALIZAR COMPRA (CLIENTE)
// ===============================
const checkoutModal = document.getElementById("checkoutModal");
const closeClient = document.querySelector(".close-client");

// Abre modal se houver itens
checkoutBtn.addEventListener("click", () => {
  if (!checkoutBtn.classList.contains("disabled")) {
    checkoutModal.classList.add("active");
  }
});

// Fecha modal cliente
closeClient.addEventListener("click", () => {
  checkoutModal.classList.remove("active");
});

// Fecha ao clicar fora do conteúdo
checkoutModal.addEventListener("click", (e) => {
  if (e.target === checkoutModal) {
    checkoutModal.classList.remove("active");
  }
});


document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navbar = document.querySelector(".navbar");
    const menuOverlay = document.querySelector(".menu-overlay");
    const navLinks = document.querySelectorAll(".navbar a");

    // Verifica se estamos no mobile antes de adicionar eventos
    if (window.innerWidth <= 768) {
        if (menuToggle && navbar && menuOverlay) {
            // Abre/fecha menu
            menuToggle.addEventListener("click", () => {
                menuToggle.classList.toggle("active");
                navbar.classList.toggle("active");
                menuOverlay.classList.toggle("active");
            });

            // Fecha menu ao clicar em link
            navLinks.forEach(link => {
                link.addEventListener("click", () => {
                    menuToggle.classList.remove("active");
                    navbar.classList.remove("active");
                    menuOverlay.classList.remove("active");
                });
            });

            // Fecha menu ao clicar no overlay
            menuOverlay.addEventListener("click", () => {
                menuToggle.classList.remove("active");
                navbar.classList.remove("active");
                menuOverlay.classList.remove("active");
            });

            // Fecha menu ao apertar ESC
            document.addEventListener("keydown", e => {
                if (e.key === "Escape") {
                    menuToggle.classList.remove("active");
                    navbar.classList.remove("active");
                    menuOverlay.classList.remove("active");
                }
            });
        }
    }
});

// ===============================
// MÁSCARA + AUTOPREENCHIMENTO VIA CEP
// ===============================


// --- FUNÇÃO AUTOMÁTICA DE CEP --- //

function enableCepAutoComplete() {
    const cepInput = document.getElementById("cep");
    if (!cepInput) return;  // evita erro caso o modal ainda não exista

    cepInput.addEventListener("blur", async () => {
        let cep = cepInput.value.replace(/\D/g, "");

        if (cep.length !== 8) return;

        try {
            let response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            let data = await response.json();

            if (data.erro) {
                alert("CEP não encontrado.");
                return;
            }

            document.getElementById("endereco").value = data.logradouro || "";
            document.getElementById("bairro").value = data.bairro || "";
            document.getElementById("cidade").value = data.localidade || "";
            document.getElementById("estado").value = data.uf || "";

        } catch (err) {
            console.error("Erro ao buscar CEP:", err);
        }
    });
}

// --- ATIVA AUTOMATICAMENTE QUANDO O MODAL ABRIR --- //

document.addEventListener("DOMContentLoaded", () => {
    const checkoutBtn = document.getElementById("checkoutBtn");
    const checkoutModal = document.getElementById("checkoutModal");

    if (checkoutBtn && checkoutModal) {
        checkoutBtn.addEventListener("click", () => {
            checkoutModal.classList.add("show");
            setTimeout(() => enableCepAutoComplete(), 200);
        });
    }

    const closeClient = document.querySelector(".close-client");
    if (closeClient) {
        closeClient.addEventListener("click", () => {
            checkoutModal.classList.remove("show");
        });
    }
});



// ===============================
// FUTURA FUNÇÃO PARA API DO WHATSAPP
// ===============================
function whatsappApi() {
  console.log("a");
}
