let mediaEntries =
    JSON.parse(localStorage.getItem("mediaEntries")) || [];

function saveToLocalStorage() {
    localStorage.setItem(
        "mediaEntries",
        JSON.stringify(mediaEntries)
    );
}

function addEntry() {
    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value;
    const rating = document.getElementById("rating").value;
    const notes = document.getElementById("notes").value.trim();

    if (!title) {
        alert("Please enter a title");
        return;
    }

    const entry = {
        id: Date.now(),
        title,
        category,
        rating,
        notes
    };

    mediaEntries.push(entry);

    saveToLocalStorage();
    renderEntries();

    document.getElementById("title").value = "";
    document.getElementById("notes").value = "";
}

function deleteEntry(id) {
    mediaEntries = mediaEntries.filter(
        entry => entry.id !== id
    );

    saveToLocalStorage();
    renderEntries();
}

function editEntry(id) {
    const entry = mediaEntries.find(
        item => item.id === id
    );

    const newTitle = prompt(
        "Edit Title",
        entry.title
    );

    if (newTitle !== null) {
        entry.title = newTitle;
        saveToLocalStorage();
        renderEntries();
    }
}

function renderEntries() {
    const entriesDiv =
        document.getElementById("entries");

    const search =
        document
            .getElementById("search")
            .value
            .toLowerCase();

    const filter =
        document.getElementById("filter").value;

    let filtered = mediaEntries.filter(entry => {
        const matchSearch =
            entry.title
                .toLowerCase()
                .includes(search);

        const matchFilter =
            filter === "All" ||
            entry.category === filter;

        return matchSearch && matchFilter;
    });

    entriesDiv.innerHTML = "";

    filtered.forEach(entry => {
        entriesDiv.innerHTML += `
            <div class="card">
                <h3>${entry.title}</h3>

                <p>
                    <strong>Category:</strong>
                    ${entry.category}
                </p>

                <p>
                    <strong>Rating:</strong>
                    ${entry.rating} ⭐
                </p>

                <p>${entry.notes}</p>

                <div class="actions">
                    <button
                        class="edit-btn"
                        onclick="editEntry(${entry.id})"
                    >
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteEntry(${entry.id})"
                    >
                        Delete
                    </button>
                </div>
            </div>
        `;
    });
}

renderEntries();