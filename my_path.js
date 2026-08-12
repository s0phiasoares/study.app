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

const path =
    document.getElementById("path");

const progressNumber =
    document.getElementById("progressNumber");

const progressFill =
    document.getElementById("progressFill");

const progressMessage =
    document.getElementById("progressMessage");

const logoutButton =
    document.getElementById("logoutButton");


// MODAL

const stepModal =
    document.getElementById("stepModal");

const closeModal =
    document.getElementById("closeModal");

const modalIcon =
    document.getElementById("modalIcon");

const modalStep =
    document.getElementById("modalStep");

const modalTitle =
    document.getElementById("modalTitle");

const modalDescription =
    document.getElementById(
        "modalDescription"
    );

const modalPercent =
    document.getElementById(
        "modalPercent"
    );

const modalFill =
    document.getElementById(
        "modalFill"
    );

const modalTasks =
    document.getElementById(
        "modalTasks"
    );

const modalAction =
    document.getElementById(
        "modalAction"
    );


// ================================
// USER DATA
// ================================

userName.textContent =
    user.name;


avatar.textContent =
    user.name
        .split(" ")
        .map(word => word[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();


goalText.textContent =
    user.goal || "Build my future";


// ================================
// STUDY DATA
// ================================

let subjects =
    JSON.parse(
        localStorage.getItem(
            "studyPathSubjects"
        )
    ) || [];


// ================================
// PATH DATA
// ================================

const pathSteps = [

    {
        id: 1,

        icon: "🎯",

        title: "Define Your Goal",

        description:
            "Choose where you want your future to take you.",

        requirement: 0

    },

    {
        id: 2,

        icon: "📚",

        title: "Learn",

        description:
            "Build the knowledge you need to reach your goal.",

        requirement: 20

    },

    {
        id: 3,

        icon: "💻",

        title: "Practice",

        description:
            "Turn what you learn into real skills.",

        requirement: 40

    },

    {
        id: 4,

        icon: "🛠️",

        title: "Create",

        description:
            "Use your skills to create real projects.",

        requirement: 60

    },

    {
        id: 5,

        icon: "🏆",

        title: "Achieve",

        description:
            "Reach an important milestone on your journey.",

        requirement: 80

    }

];


// ================================
// CALCULATE STUDY PROGRESS
// ================================

function getStudyProgress() {

    let total = 0;

    let completed = 0;


    subjects.forEach(subject => {

        total +=
            subject.tasks.length;


        completed +=
            subject.tasks.filter(
                task =>
                    task.completed
            ).length;

    });


    if (total === 0) {

        return 0;

    }


    return Math.round(
        (completed / total) * 100
    );

}


// ================================
// GET ALL TASKS
// ================================

function getAllTasks() {

    const tasks = [];


    subjects.forEach(subject => {

        subject.tasks.forEach(task => {

            tasks.push({

                ...task,

                subjectName:
                    subject.name

            });

        });

    });


    return tasks;

}


// ================================
// STEP STATE
// ================================

function getStepState(
    step,
    progress
) {

    if (
        progress >=
        step.requirement + 20
    ) {

        return "completed";

    }


    if (
        progress >=
        step.requirement
    ) {

        return "active";

    }


    return "locked";

}


// ================================
// RENDER PATH
// ================================

function renderPath() {

    path.innerHTML = "";


    const progress =
        getStudyProgress();


    pathSteps.forEach(
        (step, index) => {

            const state =
                getStepState(
                    step,
                    progress
                );


            const stepElement =
                document.createElement(
                    "div"
                );


            stepElement.className =
                `path-step ${state}`;


            stepElement.dataset.id =
                step.id;


            const stepProgress =
                calculateStepProgress(
                    step,
                    progress
                );


            stepElement.innerHTML = `

                <div
                    class="node"
                    title="Open step"
                >

                    ${
                        state === "completed"
                            ? "✓"
                            : state === "locked"
                                ? "🔒"
                                : step.icon
                    }

                </div>


                <div class="path-card">

                    <div class="card-top">

                        <div class="card-icon">
                            ${step.icon}
                        </div>

                        <div class="card-info">

                            <small>
                                STEP 0${step.id}
                            </small>

                            <h3>
                                ${step.title}
                            </h3>

                        </div>

                    </div>


                    <p>
                        ${step.description}
                    </p>


                    <div class="mini-progress">

                        <div
                            class="mini-progress-fill"
                            style="
                                width:${stepProgress}%
                            "
                        ></div>

                    </div>

                </div>

            `;


            stepElement.addEventListener(
                "click",
                () => {

                    openStep(step);

                }
            );


            path.appendChild(
                stepElement
            );

        }
    );


    updatePathLine();

}


// ================================
// STEP PROGRESS
// ================================

function calculateStepProgress(
    step,
    globalProgress
) {

    const start =
        step.requirement;


    const end =
        step.requirement + 20;


    if (globalProgress >= end) {

        return 100;

    }


    if (globalProgress <= start) {

        return 0;

    }


    return Math.round(
        (
            (globalProgress - start)
            /
            (end - start)
        ) * 100
    );

}


// ================================
// PATH LINE
// ================================

function updatePathLine() {

    const progress =
        getStudyProgress();


    const totalHeight =
        path.offsetHeight;


    const percentage =
        Math.min(
            progress / 100,
            1
        );


    path.style.setProperty(
        "--path-height",
        `${totalHeight * percentage}px`
    );

}


// ================================
// MAIN PROGRESS
// ================================

function updateProgress() {

    const progress =
        getStudyProgress();


    progressNumber.textContent =
        `${progress}%`;


    progressFill.style.width =
        `${progress}%`;


    if (progress === 0) {

        progressMessage.textContent =
            "Your journey starts with your first task. 🚀";

    }

    else if (progress < 20) {

        progressMessage.textContent =
            "Great start! Keep going. 🌱";

    }

    else if (progress < 40) {

        progressMessage.textContent =
            "You're learning and growing! 📚";

    }

    else if (progress < 60) {

        progressMessage.textContent =
            "Your skills are taking shape! 💻";

    }

    else if (progress < 80) {

        progressMessage.textContent =
            "You're becoming a creator! 🛠️";

    }

    else if (progress < 100) {

        progressMessage.textContent =
            "The finish line is getting closer! 🏆";

    }

    else {

        progressMessage.textContent =
            "You completed your path! 🚀🏆";

    }

}


// ================================
// OPEN STEP
// ================================

function openStep(step) {

    const progress =
        getStudyProgress();


    const state =
        getStepState(
            step,
            progress
        );


    if (state === "locked") {

        showLockedMessage(step);

        return;

    }


    modalIcon.textContent =
        step.icon;


    modalStep.textContent =
        `STEP 0${step.id}`;


    modalTitle.textContent =
        step.title;


    modalDescription.textContent =
        step.description;


    const stepProgress =
        calculateStepProgress(
            step,
            progress
        );


    modalPercent.textContent =
        `${stepProgress}%`;


    modalFill.style.width =
        `${stepProgress}%`;


    renderModalTasks(step);


    modalAction.textContent =
        getActionText(step);


    modalAction.onclick =
        () => {

            closeStepModal();

            if (step.id === 2) {

                window.location.href =
                    "study.html";

            }

            else if (step.id === 3) {

                window.location.href =
                    "study.html";

            }

            else if (step.id === 4) {

                window.location.href =
                    "dashboard.html";

            }

        };


    stepModal.classList.add(
        "show"
    );

}


// ================================
// MODAL TASKS
// ================================

function renderModalTasks(step) {

    const tasks =
        getAllTasks();


    modalTasks.innerHTML = "";


    if (tasks.length === 0) {

        modalTasks.innerHTML = `

            <div class="modal-task">

                📚

                <span>
                    Create tasks in Study
                    to track your progress.
                </span>

            </div>

        `;

        return;

    }


    let selectedTasks = [];


    if (step.id === 2) {

        selectedTasks =
            tasks.slice(0, 4);

    }

    else if (step.id === 3) {

        selectedTasks =
            tasks.slice(0, 4);

    }

    else if (step.id === 4) {

        selectedTasks =
            tasks.filter(
                task =>
                    task.completed
            );

    }

    else {

        selectedTasks =
            tasks.slice(0, 4);

    }


    selectedTasks.forEach(task => {

        const item =
            document.createElement(
                "div"
            );


        item.className =
            `modal-task ${
                task.completed
                    ? "completed"
                    : ""
            }`;


        item.innerHTML = `

            <span>

                ${
                    task.completed
                        ? "✅"
                        : "⬜"
                }

            </span>

            <span>
                ${escapeHTML(
                    task.title
                )}
            </span>

        `;


        modalTasks.appendChild(
            item
        );

    });

}


// ================================
// ACTION TEXT
// ================================

function getActionText(step) {

    if (step.id === 1) {

        return "🎯 View My Goal";

    }

    if (step.id === 2) {

        return "📚 Go to Study";

    }

    if (step.id === 3) {

        return "💻 Practice";

    }

    if (step.id === 4) {

        return "🛠️ Build Something";

    }

    return "🏆 Keep Going";

}


// ================================
// LOCKED
// ================================

function showLockedMessage(step) {

    modalIcon.textContent =
        "🔒";


    modalStep.textContent =
        `STEP 0${step.id}`;


    modalTitle.textContent =
        `${step.title} is locked`;


    modalDescription.textContent =
        `Complete more study tasks to unlock this part of your journey.`;


    modalPercent.textContent =
        "Locked";


    modalFill.style.width =
        "0%";


    modalTasks.innerHTML = `

        <div class="modal-task">

            🔐

            <span>
                Keep completing your tasks
                to unlock this step.
            </span>

        </div>

    `;


    modalAction.textContent =
        "📚 Go to Study";


    modalAction.onclick =
        () => {

            window.location.href =
                "study.html";

        };


    stepModal.classList.add(
        "show"
    );

}


// ================================
// CLOSE MODAL
// ================================

function closeStepModal() {

    stepModal.classList.remove(
        "show"
    );

}


closeModal.addEventListener(
    "click",
    closeStepModal
);


stepModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            stepModal
        ) {

            closeStepModal();

        }

    }
);


// ================================
// SECURITY
// ================================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

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
// UPDATE
// ================================

function updateEverything() {

    updateProgress();

    renderPath();

}


updateEverything();


// ================================
// LISTEN FOR CHANGES
// ================================

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


            updateEverything();

        }

    }
);


// ================================
// AUTO UPDATE
// ================================

setInterval(
    () => {

        subjects =
            JSON.parse(
                localStorage.getItem(
                    "studyPathSubjects"
                )
            ) || [];


        updateEverything();

    },
    3000
);


console.log(
    "🗺️ Dynamic My Path loaded!"
);