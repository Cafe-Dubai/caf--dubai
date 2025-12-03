// ===============================
// ABRIR E FECHAR BARRA DE PESQUISA
// ===============================
const openSearch = document.getElementById("openSearch");
const searchBar = document.getElementById("searchBar");
const closeSearch = document.getElementById("closeSearch");

if (openSearch && searchBar && closeSearch) {
    openSearch.addEventListener("click", () => {
        searchBar.classList.add("active");
        document.getElementById("searchInput").focus();
    });

    closeSearch.addEventListener("click", () => {
        searchBar.classList.remove("active");
    });

    document.addEventListener('click', (e) => {
        if (searchBar.classList.contains('active')) {
            if (!searchBar.contains(e.target) && e.target !== openSearch) {
                searchBar.classList.remove('active');
            }
        }
    });
}

// ===============================
// BOTÕES DE SOMAR E SUBTRAIR PRODUTO
// ===============================
document.querySelectorAll(".menu-card").forEach((card) => {
  const minusBtn = card.querySelector(".minus");
  const plusBtn = card.querySelector(".plus");
  const qtyInput = card.querySelector(".qty-input");

    if (minusBtn && plusBtn && qtyInput) {
        minusBtn.onclick = () => {
            let value = Number(qtyInput.value);
            if (value > 1) qtyInput.value = value - 1;
        };

        plusBtn.onclick = () => {
            let value = Number(qtyInput.value);
            qtyInput.value = value + 1;
        };
    }
});

let cart = [];

const cartIcon = document.getElementById("cartIcon");
const cartModal = document.getElementById("cartModal");
const overlay = document.getElementById("overlay");
const closeCart = document.getElementById("closeCart");
const cartList = document.getElementById("cartList");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

// if (cartIcon && cartModal) {
    // cartIcon.addEventListener("click", () => {
        // cartModal.classList.add("active");
        // if (overlay) overlay.classList.add("active");
        // document.body.style.overflow = 'hidden';
    // });
    //esse de cima é meu codigo testar depois 

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
//acaba aqui o de cima
function closeCartModal() {
    if (cartModal) cartModal.classList.remove("active");
    if (overlay) overlay.classList.remove("active");
    document.body.style.overflow = '';
}

if (closeCart) {
    closeCart.addEventListener("click", closeCartModal);
}

if (overlay) {
    overlay.addEventListener("click", closeCartModal);
}

// ===============================
// ADICIONAR PRODUTO AO CARRINHO
// ===============================
document.querySelectorAll(".menu-card").forEach((card) => {
  const addToCartBtn = card.querySelector(".add-to-cart");

    if (addToCartBtn) {
        addToCartBtn.addEventListener("click", () => {
            const name = card.querySelector("h3").innerText;
            const image = card.querySelector("img").src;
            const priceText = card.querySelector(".price").innerText;
            
            const price = parseFloat(
                priceText.replace("R$", "").replace(".", "").replace(",", ".").trim()
            );
            
            const qtyInput = card.querySelector(".qty-input");
            const qty = qtyInput ? parseInt(qtyInput.value) || 1 : 1;

            if (isNaN(price)) {
                console.error("Preço inválido:", priceText);
                alert("Erro: Preço inválido");
                return;
            }

            const existingIndex = cart.findIndex(item => item.name === name);
            
            if (existingIndex !== -1) {
                cart[existingIndex].qty += qty;
            } else {
                cart.push({ 
                    name, 
                    image, 
                    price, 
                    qty,
                    id: Date.now() 
                });
            }

            updateCart();
            
            const originalText = addToCartBtn.textContent;
            const originalBg = addToCartBtn.style.backgroundColor;
            
            addToCartBtn.textContent = "✓ Adicionado!";
            addToCartBtn.style.backgroundColor = "#4CAF50";
            addToCartBtn.style.color = "#fff";
            
            setTimeout(() => {
                addToCartBtn.textContent = originalText;
                addToCartBtn.style.backgroundColor = originalBg;
                addToCartBtn.style.color = "";
            }, 1500);
        });
    }
});

function removeItem(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        updateCart();
    }
}

function updateCart() {
    if (!cartList) return;
    
    cartList.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartList.innerHTML = '<li style="text-align: center; padding: 20px; color: #666;">Carrinho vazio</li>';
    } else {
        cart.forEach((item, index) => {
            const li = document.createElement("li");
            li.className = "cart-item";
            
            const itemTotal = item.price * item.qty;
            total += itemTotal;

            li.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-info">
                    <h4>${item.name}</h4>
                    <p>${item.qty}x — R$ ${itemTotal.toFixed(2).replace(".", ",")}</p>
                </div>
                <i class="fi fi-br-trash remove-item" onclick="removeItem(${index})"></i>
            `;

            cartList.appendChild(li);
        });
    }

    if (cartTotal) {
        cartTotal.innerText = "Total: R$ " + total.toFixed(2).replace(".", ",");
    }

  updateCheckoutButton();
}

function updateCheckoutButton() {
    if (!checkoutBtn) return;
    
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

if (checkoutBtn && checkoutModal) {
    checkoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (!checkoutBtn.classList.contains("disabled")) {
            checkoutModal.classList.add("active");
            document.body.style.overflow = 'hidden';
        }
    });
}

if (closeClient) {
    closeClient.addEventListener("click", () => {
        if (checkoutModal) {
            checkoutModal.classList.remove("active");
            document.body.style.overflow = '';
        }
    });
}

if (checkoutModal) {
    checkoutModal.addEventListener("click", (e) => {
        if (e.target === checkoutModal) {
            checkoutModal.classList.remove("active");
            document.body.style.overflow = '';
        }
    });
}

const clientDataForm = document.getElementById("clientDataForm");
if (clientDataForm) {
    clientDataForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        if (cart.length === 0) {
            alert("Carrinho vazio!");
            return;
        }
        
        const formData = {
            nome: document.getElementById("nomeCompleto").value.trim(),
            cpf: document.getElementById("cpf").value.trim(),
            endereco: document.getElementById("endereco").value.trim(),
            celular: document.getElementById("celular").value.trim(),
            email: document.getElementById("email").value.trim(),
            pedido: [...cart], 
            total: cart.reduce((sum, item) => sum + (item.price * item.qty), 0),
            data: new Date().toLocaleString('pt-BR')
        };

        if (!formData.nome || !formData.cpf || !formData.endereco || !formData.celular || !formData.email) {
            alert("Por favor, preencha todos os campos!");
            return;
        }

        console.log("Dados do pedido:", formData);
        
        enviarParaWhatsApp(formData);
        
        cart = [];
        updateCart();
        
        clientDataForm.reset();
        
        checkoutModal.classList.remove("active");
        document.body.style.overflow = '';
        
        alert("Pedido enviado com sucesso! Entraremos em contato em breve.");
    });
}

function enviarParaWhatsApp(formData) {
    const numeroWhatsApp = "5514999999999"; 
    
    let mensagem = `*NOVO PEDIDO - CAFÉ DUBAI*%0A%0A`;
    mensagem += `*Data:* ${formData.data}%0A%0A`;
    mensagem += `*DADOS DO CLIENTE:*%0A`;
    mensagem += `• Nome: ${formData.nome}%0A`;
    mensagem += `• CPF: ${formData.cpf}%0A`;
    mensagem += `• Endereço: ${formData.endereco}%0A`;
    mensagem += `• Celular: ${formData.celular}%0A`;
    mensagem += `• E-mail: ${formData.email}%0A%0A`;
    mensagem += `*PEDIDO:*%0A`;
    
    formData.pedido.forEach((item, index) => {
        mensagem += `${index + 1}. ${item.name} - ${item.qty}x - R$ ${(item.price * item.qty).toFixed(2).replace(".", ",")}%0A`;
    });
    
    mensagem += `%0A*TOTAL: R$ ${formData.total.toFixed(2).replace(".", ",")}*`;
    
    const url = `https://wa.me/${numeroWhatsApp}?text=${mensagem}`;
    window.open(url, '_blank');
}

const menuToggle = document.querySelector('.menu-toggle');
const navbar = document.querySelector('.navbar');
const menuOverlay = document.querySelector('.menu-overlay');
const navLinks = document.querySelectorAll('.navbar a');

if (menuToggle && navbar && menuOverlay) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navbar.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        document.body.style.overflow = navbar.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navbar.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    menuOverlay.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navbar.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            if (menuToggle && menuToggle.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navbar.classList.remove('active');
                menuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
            
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}
);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (cartModal && cartModal.classList.contains('active')) {
            closeCartModal();
        }
        if (checkoutModal && checkoutModal.classList.contains('active')) {
            checkoutModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        if (menuToggle && menuToggle.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navbar.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

console.log('Café Dubai - Sistema de pedidos carregado! 🚀');
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
    const phoneNumber = "5514997880175";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    // 5. Ações Finais
    // Abre o WhatsApp numa nova aba
    window.open(url, '_blank');

    // Redireciona a página atual para obrigado.html
    window.location.href = "obrigado.html";
}
