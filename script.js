// ---------------- SAVE / LOAD EVENTS ----------------

function saveEvents(events) {
    localStorage.setItem("events", JSON.stringify(events));
}

function loadEvents() {
    const data = localStorage.getItem("events");
    if (data) return JSON.parse(data);

    // No default events at all — completely empty for everyone
    return [];
}


// ---------------- NAVIGATION ----------------

function goToMyPage() {
    window.location.href = "minSide.html";
}

function goBack() {
    window.location.href = "index.html";
}


// ---------------- FORM (INDEX) ----------------

document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("openFormBtn");
    const form = document.getElementById("formContainer");

    if (btn && form) {
        btn.addEventListener("click", () => form.classList.toggle("hidden"));
    }
});


// ---------------- RENDER EVENTS (INDEX) ----------------

function renderEvents() {
    const container = document.getElementById("events");
    if (!container) return;

    const events = loadEvents();
    container.innerHTML = "";

    events.forEach(event => {
        const div = document.createElement("div");
        div.className = "event";

        const title = document.createElement("h2");
        title.textContent = event.title;

        const location = document.createElement("div");
        location.className = "meta";
        location.textContent = "Location: " + event.location;

        const time = document.createElement("div");
        time.className = "meta";
        time.textContent = "Time: " + formatDateTime(event.datetime);

        const people = document.createElement("div");
        people.className = "meta";
        people.textContent = "Registered: " + event.joined + "/" + event.max;

        const button = document.createElement("button");
        button.className = "join";
        button.textContent = event.usersJoined ? "Cancel" : "Register";
        button.onclick = () => toggleJoin(event.id);

        div.appendChild(title);
        div.appendChild(location);
        div.appendChild(time);
        div.appendChild(people);
        div.appendChild(button);

        container.appendChild(div);
    });
}


// ---------------- JOIN / LEAVE (INDEX) ----------------

function toggleJoin(id) {
    const events = loadEvents();
    const event = events.find(e => e.id === id);
    if (!event) return;

    if (!event.usersJoined) {
        if (event.joined < event.max) {
            event.joined++;
            event.usersJoined = true;
        } else {
            alert("The event is full!");
        }
    } else {
        event.joined = Math.max(0, event.joined - 1);
        event.usersJoined = false;
    }

    saveEvents(events);
    renderEvents();
}


// ---------------- ADD EVENT (INDEX) ----------------

window.addEvent = function () {
    const title = document.getElementById("title").value;
    const location = document.getElementById("location").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const max = document.getElementById("max").value;

    if (!title || !location || !date || !time || !max) {
        alert("Please fill in all fields");
        return;
    }

    const datetime = date + "T" + time;

    const events = loadEvents();

    const newEvent = {
        id: Date.now(),
        title,
        location,
        date,
        time,
        datetime,
        max: Number(max),
        joined: 1,
        usersJoined: true
    };

    events.push(newEvent);
    saveEvents(events);
    renderEvents();

    document.getElementById("title").value = "";
    document.getElementById("location").value = "";
    document.getElementById("date").value = "";
    document.getElementById("time").value = "";
    document.getElementById("max").value = "";
};


// ---------------- MY EVENTS (MINSIDE) ----------------

function renderMyEvents() {
    const container = document.getElementById("myEvents");
    if (!container) return;

    const events = loadEvents();
    container.innerHTML = "";

    const myEvents = events.filter(e => e.usersJoined);

    myEvents.forEach(event => {
        const div = document.createElement("div");
        div.className = "event";

        const title = document.createElement("h2");
        title.textContent = event.title;

        const location = document.createElement("div");
        location.textContent = event.location;

        const time = document.createElement("div");
        time.textContent = formatDateTime(event.datetime);

        const people = document.createElement("div");
        people.textContent = event.joined + "/" + event.max;

        const button = document.createElement("button");
        button.textContent = "Delete event";
        button.onclick = () => leaveEvent(event.id);

        div.appendChild(title);
        div.appendChild(location);
        div.appendChild(time);
        div.appendChild(people);
        div.appendChild(button);

        container.appendChild(div);
    });
}

function leaveEvent(id) {
    let events = loadEvents();

    // ⭐ Ask for confirmation ⭐
    const confirmDelete = confirm("Are you sure you want to delete this event?");
    if (!confirmDelete) return;

    // ⭐ Delete event completely ⭐
    events = events.filter(e => e.id !== id);

    saveEvents(events);

    renderMyEvents();
    renderCalendar();
    renderEvents();
}


// ---------------- POPUP (MINSIDE) ----------------

let popupEventId = null;

function openPopup(event) {
    popupEventId = event.id;

    document.getElementById("popupTitle").textContent = event.title;
    document.getElementById("popupLocation").textContent = "Location: " + event.location;
    document.getElementById("popupTime").textContent = "Time: " + formatDateTime(event.datetime);
    document.getElementById("popupPeople").textContent = "Registered: " + event.joined + "/" + event.max;

    document.getElementById("eventPopup").classList.remove("hidden");
}

function closePopup() {
    document.getElementById("eventPopup").classList.add("hidden");
}

function unregisterFromPopup() {
    leaveEvent(popupEventId);
    closePopup();
}


// ---------------- MONTH CALENDAR (MINSIDE) ----------------

let currentYear;
let currentMonth;

(function initCalendarState() {
    const today = new Date();
    currentYear = today.getFullYear();
    currentMonth = today.getMonth();
})();

function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

function renderCalendar() {
    const container = document.getElementById("calendar");
    const monthLabel = document.getElementById("calendarMonth");
    if (!container || !monthLabel) return;

    const events = loadEvents();

    container.innerHTML = "";

    const date = new Date(currentYear, currentMonth, 1);

    monthLabel.textContent = date.toLocaleString("en-GB", {
        month: "long",
        year: "numeric"
    });

    const weekdaysRow = document.createElement("div");
    weekdaysRow.className = "calendar-weekdays";
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    weekdays.forEach(d => {
        const w = document.createElement("div");
        w.className = "weekday";
        w.textContent = d;
        weekdaysRow.appendChild(w);
    });
    container.appendChild(weekdaysRow);

    const grid = document.createElement("div");
    grid.className = "calendar-grid";

    const firstDay = new Date(currentYear, currentMonth, 1);
    let start = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const myEvents = events.filter(e => e.usersJoined);

    for (let i = 0; i < start; i++) {
        const empty = document.createElement("div");
        empty.className = "day empty";
        grid.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        const dayEvents = myEvents.filter(e => e.date === dateStr);

        const dayDiv = document.createElement("div");
        dayDiv.className = "day";

        const num = document.createElement("div");
        num.className = "day-number";
        num.textContent = day;
        dayDiv.appendChild(num);

        const evContainer = document.createElement("div");
        evContainer.className = "day-events";

        dayEvents.forEach(ev => {
            const evBtn = document.createElement("button");
            evBtn.className = "day-event";
            evBtn.textContent = ev.title;
            evBtn.onclick = () => openPopup(ev);
            evContainer.appendChild(evBtn);
        });

        dayDiv.appendChild(evContainer);
        grid.appendChild(dayDiv);
    }

    container.appendChild(grid);
}


// ---------------- FORMATTER ----------------

function formatDateTime(dt) {
    const d = new Date(dt);
    return d.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).replace(",", " —");
}


// ---------------- START (INDEX) ----------------

renderEvents();
