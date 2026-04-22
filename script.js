function saveEvents(events) {
    localStorage.setItem("events", JSON.stringify(events));
}

function loadEvents() {
    const data = localStorage.getItem("events");

    if (data) {
        return JSON.parse(data);
    }

    return [
        {
            id: 1,
            title: "Fællesspisning",
            location: "Køkkenet",
            time: "Fredag 18:00",
            max: 8,
            joined: 3,
            usersJoined: false
        },
        {
            id: 2,
            title: "Filmaften",
            location: "Fællesrum",
            time: "Lørdag 20:00",
            max: 10,
            joined: 6,
            usersJoined: false
        },
        {
            id: 3,
            title: "Løbetur",
            location: "Indgangen",
            time: "Søndag 10:00",
            max: 5,
            joined: 2,
            usersJoined: false
        }
    ];
}

const events = loadEvents();


// ---------------- NAV ----------------
function goToMyPage() {
    window.location.href = "minSide.html";
}


// ---------------- FORM TOGGLE ----------------
document.addEventListener("DOMContentLoaded", function () {

    const btn = document.getElementById("openFormBtn");
    const form = document.getElementById("formContainer");

    if (btn && form) {
        btn.addEventListener("click", function () {
            form.classList.toggle("hidden");
        });
    }

});


// ---------------- RENDER ----------------
function renderEvents() {
    const container = document.getElementById("events");
    container.innerHTML = "";

    events.forEach(event => {

        const div = document.createElement("div");
        div.className = "event";

        const title = document.createElement("h2");
        title.textContent = event.title;

        const location = document.createElement("div");
        location.className = "meta";
        location.textContent = "Sted: " + event.location;

        const time = document.createElement("div");
        time.className = "meta";
        time.textContent = "Hvornår: " + event.time;

        const people = document.createElement("div");
        people.className = "meta";
        people.textContent = "Tilmeldte: " + event.joined + "/" + event.max;

        const button = document.createElement("button");
        button.className = "join";

        button.textContent = event.usersJoined ? "Meld af" : "Tilmeld mig";

        button.onclick = function () {
            toggleJoin(event.id);
        };

        div.appendChild(title);
        div.appendChild(location);
        div.appendChild(time);
        div.appendChild(people);
        div.appendChild(button);


        // SLET KNAP (kun hvis du selv har lavet eventet)
        if (event.createdByMe) {

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Slet event";
            deleteBtn.style.color = "white";
            deleteBtn.style.marginTop = "5px";

            deleteBtn.onclick = function () {
                deleteEvent(event.id);
            };

            div.appendChild(deleteBtn);
        }


        container.appendChild(div);
    });
}


// ---------------- JOIN / LEAVE ----------------
function toggleJoin(id) {
    const event = events.find(e => e.id === id);

    if (!event) return;

    if (!event.usersJoined) {
        if (event.joined < event.max) {
            event.joined++;
            event.usersJoined = true;
        } else {
            alert("Eventet er fuldt!");
        }
    } else {
        event.joined--;
        event.usersJoined = false;
    }

    saveEvents(events);
    renderEvents();
}


// ---------------- ADD EVENT ----------------
window.addEvent = function () {

    const title = document.getElementById("title").value;
    const location = document.getElementById("location").value;
    const time = document.getElementById("time").value;
    const max = document.getElementById("max").value;

    if (!title || !location || !time || !max) {
        alert("Udfyld alle felter");
        return;
    }

    const newEvent = {
        id: Date.now(),
        title,
        location,
        time,
        max: Number(max),
        joined: 1,
        usersJoined: true,

        createdByMe: true
    };

    events.push(newEvent);

    saveEvents(events);
    renderEvents();

    document.getElementById("title").value = "";
    document.getElementById("location").value = "";
    document.getElementById("time").value = "";
    document.getElementById("max").value = "";


};


// ---------------- START ----------------
renderEvents();


function deleteEvent(id) {

    const index = events.findIndex(e => e.id === id);

    if (index !== -1) {
        events.splice(index, 1);
    }

    localStorage.setItem("events", JSON.stringify(events));
    renderEvents();
}