// ==========================================
// STUDY PATH - PLANNER
// ==========================================


// ================================
// USER
// ================================

const savedUser =
    localStorage.getItem("studyPathUser");

if (!savedUser) {

    window.location.href = "profile.html";

}

const user = JSON.parse(savedUser);


// ================================
// ELEMENTS
// ================================

const userName =
    document.getElementById("userName");

const avatar =
    document.getElementById("avatar");

const taskSelect =
    document.getElementById("taskSelect");

const dateInput =
    document.getElementById("dateInput");

const timeInput =
    document.getElementById("timeInput");

const priorityInput =
    document.getElementById("priorityInput");

const plannerForm =
    document.getElementById("plannerForm");

const plansContainer =
    document.getElementById("plansContainer");

const totalPlans =
    document.getElementById("totalPlans");

const pendingPlans =
    document.getElementById("pendingPlans");

const completedPlans =
    document.getElementById("completedPlans");

const highPlans =
    document.getElementById("highPlans");

const logoutButton =
    document.getElementById("logoutButton");


// ================================
// PROFILE
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
// DATA
// ================================

let subjects =
    JSON.parse(
        localStorage.getItem(
            "studyPathSubjects"
        )
    ) || [];


let plans =
    JSON.parse(
        localStorage.getItem(
            "studyPathPlans"
        )
    ) || [];


// ================================
// FILTER
// ================================

let currentFilter = "all";


// ================================
// DATE DEFAULT
// ================================

const today =
    new Date()
        .toISOString()
        .split("T")[0];

dateInput.value = today;


// ================================
// LOAD TASKS
// ================================

function loadTasks() {

    taskSelect.innerHTML = `
        <option value="">
            Select a task
        </option>
    `;


    subjects.forEach(subject => {

        if (subject.tasks.length === 0) {
            return;
        }


        const group =
            document.createElement("optgroup");

        group.label =
            subject.name;


        subject.tasks.forEach(task => {

            const option =
                document.createElement("option");

            option.value =
                `${subject.id}|${task.id}`;

            option.textContent =
                task.title;


            group.appendChild(option);

        });


        taskSelect.appendChild(group);

    });

}


// ================================
// SAVE
// ================================

function savePlans() {

    localStorage.setItem(
        "studyPathPlans",
        JSON.stringify(plans)
    );

}


// ================================
// ADD PLAN
// ================================

plannerForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        if (!taskSelect.value) {

            alert(
                "Please select a task first."
            );

            return;

        }


        const [subjectId, taskId] =
            taskSelect.value
                .split("|")
                .map(Number);


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


        const newPlan = {

            id: Date.now(),

            subjectId: subject.id,

            subjectName: subject.name,

            taskId: task.id,

            taskTitle: task.title,

            date: dateInput.value,

            time: timeInput.value,

            priority: priorityInput.value,

            completed: false

        };


        plans.push(newPlan);


        savePlans();

        renderPlans();

        plannerForm.reset();

        dateInput.value = today;

        priorityInput.value =
            "medium";

    }
);


// ================================
// RENDER
// ================================

function renderPlans() {

    let filteredPlans =
        [...plans];


    if (currentFilter === "pending") {

        filteredPlans =
            filteredPlans.filter(
                plan =>
                    !plan.completed
            );

    }


    if (currentFilter === "completed") {

        filteredPlans =
            filteredPlans.filter(
                plan =>
                    plan.completed
            );

    }


    // ORDER BY DATE

    filteredPlans.sort(
        (a, b) => {

            const dateA =
                new Date(
                    `${a.date}T${a.time || "00:00"}`
                );

            const dateB =
                new Date(
                    `${b.date}T${b.time || "00:00"}`
                );

            return dateA - dateB;

        }
    );


    plansContainer.innerHTML = "";


    if (filteredPlans.length === 0) {

        plansContainer.innerHTML = `

            <div class="empty">

                <strong>
                    📅 Your planner is empty
                </strong>

                Add a study session above
                to start organizing your week.

            </div>

        `;

        updateStats();

        return;

    }


    filteredPlans.forEach(plan => {

        const date =
            new Date(
                `${plan.date}T00:00:00`
            );


        const day =
            date.getDate();


        const month =
            date.toLocaleDateString(
                "en-US",
                {
                    month: "short"
                }
            );


        const card =
            document.createElement("div");

        card.className =
            "plan-card";


        if (plan.completed) {

            card.classList.add(
                "completed"
            );

        }


        card.innerHTML = `

            <div class="plan-date">

                <strong>
                    ${day}
                </strong>

                <span>
                    ${month}
                </span>

            </div>


            <div class="plan-info">

                <h3>
                    ${escapeHTML(
                        plan.taskTitle
                    )}
                </h3>

                <p>
                    📚 ${escapeHTML(
                        plan.subjectName
                    )}
                </p>

            </div>


            <div class="plan-time">

                ${
                    plan.time
                        ? `⏰ ${plan.time}`
                        : "⏰ Anytime"
                }

            </div>


            <div>

                <span
                    class="priority ${plan.priority}"
                >

                    ${getPriorityLabel(
                        plan.priority
                    )}

                </span>

            </div>


            <div class="plan-actions">

                <button
                    class="complete-plan"
                    data-id="${plan.id}"
                    title="Complete"
                >
                    ${plan.completed ? "↩️" : "✓"}
                </button>

                <button
                    class="delete-plan"
                    data-id="${plan.id}"
                    title="Delete"
                >
                    🗑️
                </button>

            </div>

        `;


        plansContainer.appendChild(card);

    });


    updateStats();

}


// ================================
// ACTIONS
// ================================

plansContainer.addEventListener(
    "click",
    event => {

        const completeButton =
            event.target.closest(
                ".complete-plan"
            );


        const deleteButton =
            event.target.closest(
                ".delete-plan"
            );


        // COMPLETE

        if (completeButton) {

            const id =
                Number(
                    completeButton.dataset.id
                );


            const plan =
                plans.find(
                    item =>
                        item.id === id
                );


            if (!plan) return;


            plan.completed =
                !plan.completed;


            // Também atualiza a tarefa original

            const subject =
                subjects.find(
                    item =>
                        item.id ===
                        plan.subjectId
                );


            if (subject) {

                const task =
                    subject.tasks.find(
                        item =>
                            item.id ===
                            plan.taskId
                    );


                if (task) {

                    task.completed =
                        plan.completed;

                }

            }


            localStorage.setItem(
                "studyPathSubjects",
                JSON.stringify(subjects)
            );


            savePlans();

            renderPlans();

        }


        // DELETE

        if (deleteButton) {

            const id =
                Number(
                    deleteButton.dataset.id
                );


            const confirmed =
                confirm(
                    "Delete this study plan?"
                );


            if (!confirmed) return;


            plans =
                plans.filter(
                    plan =>
                        plan.id !== id
                );


            savePlans();

            renderPlans();

        }

    }
);


// ================================
// FILTER BUTTONS
// ================================

document
    .querySelectorAll(".filter")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".filter"
                    )
                    .forEach(btn => {

                        btn.classList.remove(
                            "active"
                        );

                    });


                button.classList.add(
                    "active"
                );


                currentFilter =
                    button.dataset.filter;


                renderPlans();

            }
        );

    });


// ================================
// STATS
// ================================

function updateStats() {

    const total =
        plans.length;


    const completed =
        plans.filter(
            plan =>
                plan.completed
        ).length;


    const pending =
        total - completed;


    const high =
        plans.filter(
            plan =>
                plan.priority === "high" &&
                !plan.completed
        ).length;


    totalPlans.textContent =
        total;


    pendingPlans.textContent =
        pending;


    completedPlans.textContent =
        completed;


    highPlans.textContent =
        high;

}


// ================================
// PRIORITY
// ================================

function getPriorityLabel(priority) {

    if (priority === "high") {

        return "🔴 High";

    }

    if (priority === "medium") {

        return "🟡 Medium";

    }

    return "🟢 Low";

}


// ================================
// SECURITY
// ================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

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
                "../index.html";

        }

    }
);


// ================================
// INITIALIZE
// ================================

loadTasks();

renderPlans();

console.log(
    "📅 Planner loaded for " +
    user.name
);