const form = document.getElementById("profileForm");

form.addEventListener("submit", (e)=>{

    e.preventDefault();

    const user = {
        name: document.getElementById("name").value,
        goal: document.getElementById("goal").value,
        area: document.getElementById("area").value,
        deadline: document.getElementById("deadline").value
    };

    localStorage.setItem(
        "studyPathUser",
        JSON.stringify(user)
    );

    window.location.href = "dashboard.html";

});