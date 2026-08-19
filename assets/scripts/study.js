// ==========================================
// STUDY PATH - STUDY AREA
// ==========================================


// ================================
// USER
// ================================

const savedUser = localStorage.getItem("studyPathUser");

if (!savedUser) {

    window.location.href = "profile.html";

}

const user = JSON.parse(savedUser);


// ================================
// ELEMENTS
// ================================

const userName = document.getElementById("userName");
const avatar = document.getElementById("avatar");

const subjectForm = document.getElementById("subjectForm");
const subjectInput = document.getElementById("subjectInput");

const subjectsContainer =
    document.getElementById("subjectsContainer");

const subjectCount =
    document.getElementById("subjectCount");

const taskCount =
    document.getElementById("taskCount");

const completedCount =
    document.getElementById("completedCount");

const overallProgress =
    document.getElementById("overallProgress");

const logoutButton =
    document.getElementById("logoutButton");


// MODAL

const taskModal =
    document.getElementById("taskModal");

const closeModal =
    document.getElementById("closeModal");

const taskForm =
    document.getElementById("taskForm");

const taskInput =
    document.getElementById("taskInput");

const modalSubjectName =
    document.getElementById("modalSubjectName");


// ================================
// PROFILE
// ================================

userName.textContent = user.name;

const initials = user.name
    .split(" ")
    .map(name => name[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

avatar.textContent = initials;


// ================================
// STUDY DATA
// ================================

let subjects =
    JSON.parse(
        localStorage.getItem("studyPathSubjects")
    ) || [];


// ================================
// CURRENT SUBJECT
// ================================

let currentSubjectId = null;


// ================================
// SAVE
// ================================

function saveSubjects() {

    localStorage.setItem(
        "studyPathSubjects",
        JSON.stringify(subjects)
    );

}


// ================================
// RENDER
// ================================

function renderSubjects() {

    subjectsContainer.innerHTML = "";

    if (subjects.length === 0) {

        subjectsContainer.innerHTML = `
            <div class="empty">

                <strong>
                    📚 No subjects yet
                </strong>

                Add your first subject above
                and start building your study path!

            </div>
        `;

        updateStats();

        return;

    }


    subjects.forEach(subject => {

        const totalTasks =
            subject.tasks.length;

        const completedTasks =
            subject.tasks.filter(
                task => task.completed
            ).length;

        const progress =
            totalTasks === 0
                ? 0
                : Math.round(
                    (completedTasks / totalTasks) * 100
                );


        const card =
            document.createElement("div");

        card.className = "subject-card";


        card.innerHTML = `

            <div class="subject-top">

                <div class="subject-name">

                    <div class="subject-icon">
                        ${getSubjectIcon(subject.name)}
                    </div>

                    <h3>
                        ${escapeHTML(subject.name)}
                    </h3>

                </div>

                <button
                    class="delete-subject"
                    data-id="${subject.id}"
                >
                    🗑️
                </button>

            </div>


            <div class="subject-progress">

                <div class="progress-info">

                    <span>
                        Progress
                    </span>

                    <span>
                        ${progress}%
                    </span>

                </div>

                <div class="progress-bar">

                    <div
                        class="progress-fill"
                        style="width:${progress}%"
                    ></div>

                </div>

            </div>


            <div class="tasks">

                ${
                    subject.tasks.length === 0

                    ? `
                        <p style="
                            color:#8e96b3;
                            font-size:10px;
                            padding:10px 0;
                        ">
                            No tasks yet.
                        Add your first task!
                        </p>
                    `

                    :

                    subject.tasks.map(task => `

                        <div
                            class="task ${
                                task.completed
                                    ? "completed"
                                    : ""
                            }"
                        >

                            <input
                                type="checkbox"
                                class="task-check"
                                data-subject="${subject.id}"
                                data-task="${task.id}"
                                ${task.completed ? "checked" : ""}
                            >

                            <span>
                                ${escapeHTML(task.title)}
                            </span>

                        </div>

                    `).join("")

                }

            </div>


            <button
                class="task-button"
                data-add-task="${subject.id}"
            >
                + Add Task
            </button>

        `;


        subjectsContainer.appendChild(card);

    });


    updateStats();

}


// ================================
// ADD SUBJECT
// ================================

subjectForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();

        const name =
            subjectInput.value.trim();

        if (!name) return;


        const newSubject = {

            id: Date.now(),

            name: name,

            tasks: []

        };


        subjects.push(newSubject);

        saveSubjects();

        renderSubjects();

        subjectInput.value = "";

    }
);


// ================================
// SUBJECT BUTTONS
// ================================

subjectsContainer.addEventListener(
    "click",
    (event) => {

        // DELETE SUBJECT

        if (
            event.target.classList
                .contains("delete-subject")
        ) {

            const id =
                Number(
                    event.target.dataset.id
                );


            const confirmed =
                confirm(
                    "Delete this subject and all its tasks?"
                );


            if (!confirmed) return;


            subjects =
                subjects.filter(
                    subject =>
                        subject.id !== id
                );


            saveSubjects();

            renderSubjects();

        }


        // ADD TASK

        if (
            event.target.dataset.addTask
        ) {

            currentSubjectId =
                Number(
                    event.target.dataset.addTask
                );


            const subject =
                subjects.find(
                    item =>
                        item.id === currentSubjectId
                );


            modalSubjectName.textContent =
                subject.name;


            taskModal.classList.add("active");

            taskInput.focus();

        }

    }
);


// ================================
// ADD TASK
// ================================

taskForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();

        const title =
            taskInput.value.trim();

        if (!title) return;


        const subject =
            subjects.find(
                item =>
                    item.id === currentSubjectId
            );


        if (!subject) return;


        subject.tasks.push({

            id: Date.now(),

            title: title,

            completed: false

        });


        saveSubjects();

        renderSubjects();

        taskInput.value = "";

        closeTaskModal();

    }
);


// ================================
// CHECK TASK
// ================================

subjectsContainer.addEventListener(
    "change",
    (event) => {

        if (
            !event.target.classList
                .contains("task-check")
        ) {

            return;

        }


        const subjectId =
            Number(
                event.target.dataset.subject
            );


        const taskId =
            Number(
                event.target.dataset.task
            );


        const subject =
            subjects.find(
                item =>
                    item.id === subjectId
            );


        if (!subject) return;


        const task =
            subject.tasks.find(
                item =>
                    item.id === taskId
            );


        if (!task) return;


        task.completed =
            event.target.checked;


        saveSubjects();

        renderSubjects();

    }
);


// ================================
// CLOSE MODAL
// ================================

function closeTaskModal() {

    taskModal.classList.remove("active");

    taskInput.value = "";

    currentSubjectId = null;

}


closeModal.addEventListener(
    "click",
    closeTaskModal
);


taskModal.addEventListener(
    "click",
    event => {

        if (event.target === taskModal) {

            closeTaskModal();

        }

    }
);


// ================================
// STATS
// ================================

function updateStats() {

    const totalSubjects =
        subjects.length;


    let totalTasks = 0;

    let completedTasks = 0;


    subjects.forEach(subject => {

        totalTasks +=
            subject.tasks.length;


        completedTasks +=
            subject.tasks.filter(
                task => task.completed
            ).length;

    });


    const progress =
        totalTasks === 0
            ? 0
            : Math.round(
                (completedTasks / totalTasks) * 100
            );


    subjectCount.textContent =
        totalSubjects;


    taskCount.textContent =
        totalTasks;


    completedCount.textContent =
        completedTasks;


    overallProgress.textContent =
        progress + "%";

}


// ================================
// ICONS
// ================================

function getSubjectIcon(name) {

    const lower =
        name.toLowerCase();


    if (lower.includes("math")) {
        return "📐";
    }

    if (
        lower.includes("program") ||
        lower.includes("python") ||
        lower.includes("javascript") ||
        lower.includes("coding")
    ) {
        return "💻";
    }

    if (
        lower.includes("english") ||
        lower.includes("ingl")
    ) {
        return "🇬🇧";
    }

    if (
        lower.includes("physics") ||
        lower.includes("física")
    ) {
        return "⚡";
    }

    if (
        lower.includes("chem") ||
        lower.includes("quím")
    ) {
        return "🧪";
    }

    if (
        lower.includes("history") ||
        lower.includes("história")
    ) {
        return "📜";
    }

    return "📚";

}


// ================================
// SECURITY
// ================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ================================
// LOGOUT
// ================================

logoutButton.addEventListener(
    "click",
    () => {

        const confirmLogout =
            confirm(
                "Do you really want to leave your journey?"
            );


        if (confirmLogout) {

            localStorage.removeItem(
                "studyPathUser"
            );

            window.location.href =
                "../index.html";

        }

    }
);


// ================================
// INITIALIZE
// ================================

renderSubjects();

console.log(
    "📚 Study Area loaded for " +
    user.name
);