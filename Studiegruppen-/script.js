// ---------------- SAVE / LOAD EVENTS ----------------

// Gemmer events-arrayet i localStorage som JSON
function saveEvents(events) {
    localStorage.setItem("events", JSON.stringify(events));
}

// Loader events fra localStorage
function loadEvents() {
    const data = localStorage.getItem("events");

    // Hvis der allerede findes gemte events → brug dem
    if (data) {
        return JSON.parse(data);
    }

    // Standard-events hvis localStorage er tom
    return [
        {
            id: 1,
            title: "Communal Dining",
            location: "Kitchen",
            time: "Friday 18:00",
            max: 8,
            joined: 3,
            usersJoined: false
        },
        {
            id: 2,
            title: "Movie Night",
            location: "Common Room",
            time: "Saturday 20:00",
            max: 10,
            joined: 6,
            usersJoined: false
        },
        {
            id: 3,
            title: "Running",
            location: "Front Door",
            time: "Sunday 10:00",
            max: 5,
            joined: 2,
            usersJoined: false
        }
    ];
}

const events = loadEvents();


// ---------------- MY PAGE BUTTON ----------------

// Sender brugeren til minSide.html
function goToMyPage() {
    window.location.href = "minSide.html";
}


// ---------------- FORM ----------------

document.addEventListener("DOMContentLoaded", function () {

    const btn = document.getElementById("openFormBtn");
    const form = document.getElementById("formContainer");

    // Åbn/luk formular
    if (btn && form) {
        btn.addEventListener("click", function () {
            form.classList.toggle("hidden");
        });
    }

});


// ---------------- RENDER EVENTS ----------------

// Viser alle events på siden
function renderEvents() {
    const container = document.getElementById("events");

    // Ryd container før rendering
    container.innerHTML = "";

    events.forEach(event => {

        const div = document.createElement("div");
        div.className = "event";

        // Titel
        const title = document.createElement("h2");
        title.textContent = event.title;

        // Location
        const location = document.createElement("div");
        location.className = "meta";
        location.textContent = "Location: " + event.location;

        // Time
        const time = document.createElement("div");
        time.className = "meta";
        time.textContent = "Time: " + event.time;

        // Registered people
        const people = document.createElement("div");
        people.className = "meta";
        people.textContent = "Registered: " + event.joined + "/" + event.max;

        // Register / Cancel button
        const button = document.createElement("button");
        button.className = "join";

        button.textContent = event.usersJoined ? "Cancel" : "Register";

        button.onclick = function () {
            toggleJoin(event.id);
        };

        // Tilføj elementer
        div.appendChild(title);
        div.appendChild(location);
        div.appendChild(time);
        div.appendChild(people);
        div.appendChild(button);

        // Hvis brugeren selv har oprettet eventet → vis delete button
        if (event.createdByMe) {
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete Event";
            deleteBtn.style.color = "white";
            deleteBtn.style.marginTop = "8px";

            deleteBtn.onclick = function () {
                deleteEvent(event.id);
            };

            div.appendChild(deleteBtn);
        }

        container.appendChild(div);
    });
}


// ---------------- JOIN / LEAVE EVENT ----------------

// Håndterer tilmelding og afmelding
function toggleJoin(id) {
    const event = events.find(e => e.id === id);

    if (!event) return;

    // Hvis brugeren ikke er tilmeldt endnu
    if (!event.usersJoined) {

        if (event.joined < event.max) {
            event.joined++;
            event.usersJoined = true;
        } else {
            alert("The event is full!");
        }

    } else {
        // Hvis brugeren allerede er tilmeldt → afmeld
        event.joined--;
        event.usersJoined = false;
    }

    saveEvents(events);
    renderEvents();
}


// ---------------- ADD EVENT ----------------

// Gøres global så HTML kan kalde den
window.addEvent = function () {

    // Hent inputværdier
    const title = document.getElementById("title").value;
    const location = document.getElementById("location").value;
    const time = document.getElementById("time").value;
    const max = document.getElementById("max").value;

    // Tjek om alle felter er udfyldt
    if (!title || !location || !time || !max) {
        alert("Please fill in all fields");
        return;
    }

    // Nyt event
    const newEvent = {
        id: Date.now(),
        title: title,
        location: location,
        time: time,
        max: Number(max),
        joined: 1, // Opretteren er automatisk tilmeldt
        usersJoined: true,
        createdByMe: true
    };

    // Tilføj event
    events.push(newEvent);

    saveEvents(events);
    renderEvents();

    // Nulstil formular
    document.getElementById("title").value = "";
    document.getElementById("location").value = "";
    document.getElementById("time").value = "";
    document.getElementById("max").value = "";
};


// ---------------- DELETE EVENT ----------------

// Sletter event ud fra id
function deleteEvent(id) {
    const index = events.findIndex(e => e.id === id);

    if (index !== -1) {
        events.splice(index, 1);
    }

    saveEvents(events);
    renderEvents();
}


// ---------------- START ----------------

// Renderer events når siden loader
renderEvents();