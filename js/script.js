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


// ===============================
// MENU HAMBÚRGUER MOBILE
// ===============================
const menuToggle = document.querySelector(".menu-toggle");
const navbar = document.querySelector(".navbar");
const menuOverlay = document.querySelector(".menu-overlay");
const navLinks = document.querySelectorAll(".navbar a");

// Abre/fecha menu mobile
menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active");
  navbar.classList.toggle("active");
  menuOverlay.classList.toggle("active");
});

// Fecha menu ao clicar em link
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.classList.remove("active");
    navbar.classList.remove("active");
    menuOverlay.classList.remove("active");
  });
});

// Fecha menu ao clicar no fundo
if (menuOverlay) {
  menuOverlay.addEventListener("click", () => {
    menuToggle?.classList.remove("active");
    navbar?.classList.remove("active");
    menuOverlay.classList.remove("active");
  });
}


// ===============================
// HEADER QUE ESCONDE AO ROLAR
// ===============================
let lastScrollY = window.scrollY;
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  if (window.scrollY > lastScrollY && window.scrollY > 100) {
    header.classList.add("hidden"); // Esconde
  } else {
    header.classList.remove("hidden"); // Mostra
  }
  lastScrollY = window.scrollY;
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
// FUNÇÃO PARA API DO WHATSAPP (FINALIZAR PEDIDO)
// ===============================
function whatsappApi() {
    const form = document.getElementById('clientDataForm');

    // 1. Validação Manual (pois mudamos o botão para type="button")
    if (!form.checkValidity()) {
        form.reportValidity(); // Mostra os alertas padrão do navegador
        return; // Para a execução se inválido
    }

    // 2. Coletar dados do Formulário
    const nome = document.getElementById('nomeCompleto').value;
    const cpf = document.getElementById('cpf').value;
    const celular = document.getElementById('celular').value;
    const cep = document.getElementById('cep').value;
    const endereco = document.getElementById('endereco').value;
    const numero = document.getElementById('numero').value;
    const bairro = document.getElementById('bairro').value;
    const cidade = document.getElementById('cidade').value;
    const estado = document.getElementById('estado').value;

    // 3. Montar a Mensagem
    let message = "Olá! Gostaria de finalizar aqui o pedido que fiz pelo site do Café Dubai!\n\n";

    message += "*Segue as informações cadastradas:*\n";
    // Loop pelos itens do carrinho (variável global 'cart')
    cart.forEach(item => {
        // Ex: - Café Dubai ouro (2x) - R$ 120,00
        message += `- ${item.name} (${item.qty}x) - R$ ${(item.price * item.qty).toFixed(2).replace('.', ',')}\n`;
    });

    message += "\n*Dados para envio:*\n";
    message += `- Nome: ${nome}\n`;
    message += `- CPF: ${cpf}\n`;
    message += `- Celular: ${celular}\n`;
    message += `- CEP: ${cep}\n`;
    message += `- Endereço: ${endereco}, ${numero}\n`;
    message += `- Bairro: ${bairro}\n`;
    message += `- Cidade: ${cidade} - ${estado}\n`;

    // 4. Codificar a mensagem para URL
    const phoneNumber = "5518997346625";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    // 5. Ações Finais
    // Abre o WhatsApp numa nova aba
    window.open(url, '_blank');

    // Redireciona a página atual para obrigado.html
    window.location.href = "obrigado.html";
}