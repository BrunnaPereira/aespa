const tela = document.querySelector(".tela-inicial");
tela.addEventListener("click", function () {
    tela.classList.add("saindo");

    setTimeout(function() {
        window.location.href = "home.html";
    }, 700);
});