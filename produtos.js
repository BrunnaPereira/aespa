
const catalogo = {
    "Photocards": [
        { id: "pc1", nome: "Photocard Karina", preco: 15.00, imagem: "img/cards/1.jpg" },
        { id: "pc2", nome: "Photocard Winter", preco: 15.00, imagem: "img/cards/2.jpg" },
        { id: "pc3", nome: "Photocard Giselle", preco: 15.00, imagem: "img/cards/3.jpg" },
        { id: "pc4", nome: "Photocard Ningning", preco: 15.00, imagem: "img/cards/4.jpg" },
        { id: "pc5", nome: "Photocard Ningning", preco: 15.00, imagem: "img/cards/5.jpg" },
        { id: "pc6", nome: "Photocard Ningning", preco: 15.00, imagem: "img/cards/6.jpg" }
    ],

    "Bonecas": [
        { id: "bn1", nome: "Boneca Karina", preco: 85.00, imagem: "img/bn/1.jpg" },
        { id: "bn2", nome: "Boneca Winter", preco: 85.00, imagem: "img/bn/2.jpg" },
        { id: "bn3", nome: "Boneca Giselle", preco: 85.00, imagem: "img/bn/3.jpg" },
        { id: "bn4", nome: "Boneca Ningning", preco: 85.00, imagem: "img/bn/4.jpg" }
    ],

    "Roupas": [
        { id: "rp1", nome: "Camiseta KWANGYA", preco: 65.00, imagem: "img/rp/1.jpg" },
        { id: "rp2", nome: "Camiseta KWANGYA", preco: 120.00, imagem: "img/rp/2.jpg" },
        { id: "rp3", nome: "Camisa KWANGYA", preco: 150.00, imagem: "img/rp/3.jpg" },
        { id: "rp4", nome: "Camiseta KWANGYA", preco: 80.00, imagem: "img/rp/4.jpg" }
    ],

    "Bolsas": [
        { id: "bl1", nome: "Bolsas KWANGYA", preco: 75.00, imagem: "img/bl/1.jpg" },
        { id: "bl2", nome: "Bolsa branca", preco: 90.00, imagem: "img/bl/2.jpg" },
        { id: "bl3", nome: "Bolsa couro", preco: 90.00, imagem: "img/bl/3.jpg" },
        { id: "bl4", nome: "Bolsa jeans", preco: 90.00, imagem: "img/bl/4.jpg" }
    ],

    "Acessórios": [
        { id: "ac1", nome: "Kit Acessórios KWANGYA", preco: 20.00, imagem: "img/ac/1.jpg" },
        { id: "ac2", nome: "Bastão de Luz KWANGYA", preco: 25.00, imagem: "img/ac/2.jpg" },
        { id: "ac3", nome: "Bracelete KWANGYA", preco: 25.00, imagem: "img/ac/3.jpg" },
        { id: "ac4", nome: "Presilhas KWANGYA", preco: 25.00, imagem: "img/ac/4.jpg" }
    ]
};

const categoria = document.body.dataset.categoria;
const produtos = catalogo[categoria] || [];
const chaveCarrinho = "kwangyaCarrinho";

let carrinho = JSON.parse(localStorage.getItem(chaveCarrinho) || "[]");

const grade = document.getElementById("grade-produtos");
const painel = document.getElementById("painel-carrinho");
const itensCarrinho = document.getElementById("itens-carrinho");
const quantidadeCarrinho = document.getElementById("quantidade-carrinho");
const totalCarrinho = document.getElementById("total-carrinho");

function moeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function salvarCarrinho() {
    localStorage.setItem(chaveCarrinho, JSON.stringify(carrinho));
    atualizarCarrinho();
}

function renderizarProdutos() {
    if (!grade) return;

    if (produtos.length === 0) {
        grade.innerHTML = "<p>Nenhum produto cadastrado nesta categoria.</p>";
        return;
    }

    grade.innerHTML = produtos.map(produto => `
        <article class="produto-card">
            <img
                src="${produto.imagem}"
                alt="${produto.nome}"
                onerror="this.onerror=null; this.src='img/logo-lemonade.png';"
            >

            <div class="produto-info">
                <h3>${produto.nome}</h3>
                <p class="produto-preco">${moeda(produto.preco)}</p>

                <button
                    class="adicionar-carrinho"
                    type="button"
                    data-id="${produto.id}">
                    ADICIONAR AO CARRINHO
                </button>
            </div>
        </article>
    `).join("");

    grade.querySelectorAll(".adicionar-carrinho").forEach(botao => {
        botao.addEventListener("click", () => {
            adicionarProduto(botao.dataset.id);
        });
    });
}

function adicionarProduto(id) {
    const produto = produtos.find(item => item.id === id);
    if (!produto) return;

    const existente = carrinho.find(item => item.id === id);

    if (existente) {
        existente.quantidade++;
    } else {
        carrinho.push({
            ...produto,
            quantidade: 1
        });
    }

    salvarCarrinho();
}

function atualizarCarrinho() {
    if (!itensCarrinho) return;

    const quantidade = carrinho.reduce(
        (soma, item) => soma + item.quantidade, 0
    );

    quantidadeCarrinho.textContent = quantidade;

    if (carrinho.length === 0) {
        itensCarrinho.innerHTML =
            '<p class="carrinho-vazio">Seu carrinho ainda está vazio.</p>';
    } else {
        itensCarrinho.innerHTML = carrinho.map(item => `
            <div class="item-carrinho">
                <div>
                    <h3>${item.nome}</h3>
                    <p>${moeda(item.preco)} cada</p>

                    <div class="controles-item">
                        <button type="button" data-acao="diminuir" data-id="${item.id}">−</button>
                        <span>${item.quantidade}</span>
                        <button type="button" data-acao="aumentar" data-id="${item.id}">+</button>
                    </div>
                </div>

                <div>
                    <p>${moeda(item.preco * item.quantidade)}</p>
                    <button class="remover-item" type="button"
                        data-acao="remover" data-id="${item.id}">
                        Remover
                    </button>
                </div>
            </div>
        `).join("");
    }

    const total = carrinho.reduce(
        (soma, item) => soma + item.preco * item.quantidade, 0
    );

    totalCarrinho.textContent = moeda(total);
}

itensCarrinho.addEventListener("click", evento => {
    const botao = evento.target.closest("button[data-acao]");
    if (!botao) return;

    const item = carrinho.find(item => item.id === botao.dataset.id);
    if (!item) return;

    switch (botao.dataset.acao) {
        case "aumentar":
            item.quantidade++;
            break;

        case "diminuir":
            item.quantidade--;

            if (item.quantidade <= 0) {
                carrinho = carrinho.filter(produto => produto.id !== item.id);
            }
            break;

        case "remover":
            carrinho = carrinho.filter(produto => produto.id !== item.id);
            break;
    }

    salvarCarrinho();
});

document.getElementById("abrir-carrinho").addEventListener("click", () => {
    painel.hidden = false;
});

document.getElementById("fechar-carrinho").addEventListener("click", () => {
    painel.hidden = true;
});

document.getElementById("finalizar-compra").addEventListener("click", () => {
    if (carrinho.length === 0) {
        alert("Adicione pelo menos um produto ao carrinho!");
        return;
    }

    const numeroWhatsApp = "5511999999999"; // Troque pelo número correto da loja.

    const resumo = carrinho.map(item =>
        `${item.nome} x${item.quantidade} - ${moeda(item.preco * item.quantidade)}`
    ).join("\n");

    const total = carrinho.reduce(
        (soma, item) => soma + item.preco * item.quantidade, 0
    );

    const mensagem =
        `Olá! Gostaria de fazer este pedido:\n\n${resumo}\n\nTotal: ${moeda(total)}`;

    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

    window.open(url, "_blank", "noopener,noreferrer");
});

renderizarProdutos();
atualizarCarrinho();