// ==========================================
// STUDY PATH - DASHBOARD
// ==========================================


// PEGAR DADOS DO USUÁRIO

const savedUser = localStorage.getItem("studyPathUser");


// SE NÃO EXISTIR PERFIL

if (!savedUser) {

    window.location.href = "profile.html";

}


// TRANSFORMAR JSON EM OBJETO

const user = JSON.parse(savedUser);


// ELEMENTOS

const userName = document.getElementById("userName");
const avatar = document.getElementById("avatar");

const goalTitle = document.getElementById("goalTitle");
const goalText = document.getElementById("goalText");

const areaText = document.getElementById("areaText");
const deadlineText = document.getElementById("deadlineText");

const logoutButton = document.getElementById("logoutButton");
const studyButton = document.getElementById("studyButton");


// ================================
// NOME
// ================================

userName.textContent = user.name;


// ================================
// AVATAR
// ================================

const initials = user.name
    .split(" ")
    .map(name => name[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

avatar.textContent = initials;


// ================================
// OBJETIVO
// ================================

goalTitle.textContent = user.goal;

goalText.textContent = user.goal;


// ================================
// ÁREA
// ================================

areaText.textContent = user.area;


// ================================
// PRAZO
// ================================

deadlineText.textContent = user.deadline;


// ================================
// PROGRESSO INICIAL
// ================================

let progress = 0;

const progressFill =
    document.querySelector(".progress-fill");

const progressNumber =
    document.querySelector(".goal-progress strong");


// pequena animação

setTimeout(() => {

    progressFill.style.width = progress + "%";

}, 300);

progressNumber.textContent = progress + "%";


// ================================
// LOGOUT
// ================================

logoutButton.addEventListener("click", () => {

    const confirmLogout = confirm(
        "Do you really want to leave your journey?"
    );

    if (confirmLogout) {

        localStorage.removeItem("studyPathUser");

        window.location.href = "index.html";

    }

});


// ================================
// STUDY BUTTON
// ================================

studyButton.addEventListener("click", () => {

    alert(
        "📚 Study section coming next!\n\n" +
        "Here you'll be able to create subjects, " +
        "tasks and study sessions."
    );

});


// ================================
// CONSOLE
// ================================

console.log(
    "🚀 Welcome to Study Path, " +
    user.name + "!"
);