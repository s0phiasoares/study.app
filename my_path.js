// ==========================================
// STUDY PATH - MY PATH
// ==========================================


// ================================
// USER
// ================================

const savedUser =
    localStorage.getItem("studyPathUser");

if (!savedUser) {

    window.location.href = "profile.html";

}

const user =
    JSON.parse(savedUser);


// ================================
// ELEMENTS
// ================================

const userName =
    document.getElementById("userName");

const avatar =
    document.getElementById("avatar");

const goalText =
    document.getElementById("goalText");

const pathPercent =
    document.getElementById("pathPercent");

const bigProgressFill =
    document.getElementById(
        "bigProgressFill"
    );

const logoutButton =
    document.getElementById("logoutButton");

const pathSteps =
    document.querySelectorAll(
        ".path-step"
    );


// ================================
// USER
// ================================

userName.textContent =
    user.name;


const initials =
    user.name
        .split(" ")
        .map(name => name[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();


avatar.textContent =
    initials;


// ================================
// GOAL
// ================================

if (user.goal) {

    goalText.textContent =
        user.goal;

} else {

    goalText.textContent =
        "Build my future";

}


// ================================
// DATA
// ================================

let subjects =
    JSON.parse(
        localStorage.getItem(
            "studyPathSubjects"
        )
    ) || [];


// ================================
// CALCULATE PROGRESS
// ================================

function calculateProgress() {

    let totalTasks = 0;

    let completedTasks = 0;


    subjects.forEach(subject => {

        totalTasks +=
            subject.tasks.length;


        completedTasks +=
            subject.tasks.filter(
                task =>
                    task.completed
            ).length;

    });


    if (totalTasks === 0) {

        return 0;

    }


    return Math.round(
        (completedTasks / totalTasks) * 100
    );

}


// ================================
// UPDATE PATH
// ================================

function updatePath() {

    const progress =
        calculateProgress();


    pathPercent.textContent =
        progress + "%";


    bigProgressFill.style.width =
        progress + "%";


    /*
        STEP SYSTEM

        0%      → Goal
        20%     → Learn
        40%     → Practice
        60%     → Create
        80%     → Achieve
    */


    pathSteps.forEach(
        (step, index) => {

            const required =
                index * 20;


            const number =
                step.querySelector(
                    ".step-number"
                );


            step.classList.remove(
                "locked",
                "unlocked",
                "completed"
            );


            if (progress >= required + 20) {

                step.classList.add(
                    "completed"
                );

                number.textContent =
                    "✓";

            }

            else if (progress >= required) {

                step.classList.add(
                    "unlocked"
                );

                number.textContent =
                    index + 1;

            }

            else {

                step.classList.add(
                    "locked"
                );

                number.textContent =
                    "🔒";

            }

        }
    );

}


// ================================
// LOGOUT
// ================================

logoutButton.addEventListener(
    "click",
    () => {

        const confirmed =
            confirm(
                "Do you really want to leave your journey?"
            );


        if (confirmed) {

            localStorage.removeItem(
                "studyPathUser"
            );

            window.location.href =
                "index.html";

        }

    }
);


// ================================
// INITIALIZE
// ================================

updatePath();


// Atualiza se outra aba modificar
// os dados de estudo.

window.addEventListener(
    "storage",
    event => {

        if (
            event.key ===
            "studyPathSubjects"
        ) {

            subjects =
                JSON.parse(
                    event.newValue
                ) || [];


            updatePath();

        }

    }
);


console.log(
    "🗺️ My Path loaded for " +
    user.name
);