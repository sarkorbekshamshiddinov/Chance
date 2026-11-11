// =====================================
// CHANCE — DEMO APPLICATION
// =====================================


// DEMO PROFILES

const profiles = [

    {
        id: 1,
        name: "Alex",
        age: 24,
        location: "Warsaw, Poland",
        bio: "I love travelling, photography and discovering new places.",
        interests: ["Travel", "Photography", "Music"],
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900",
        likesYou: true,
        previouslySkippedYou: false
    },

    {
        id: 2,
        name: "Jordan",
        age: 26,
        location: "Krakow, Poland",
        bio: "Coffee enthusiast and weekend explorer.",
        interests: ["Coffee", "Books", "Nature"],
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900",
        likesYou: false,
        previouslySkippedYou: true
    },

    {
        id: 3,
        name: "Taylor",
        age: 25,
        location: "Gdansk, Poland",
        bio: "Creative soul who enjoys art and good conversations.",
        interests: ["Art", "Design", "Movies"],
        image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900",
        likesYou: false,
        previouslySkippedYou: false
    },

    {
        id: 4,
        name: "Morgan",
        age: 27,
        location: "Wroclaw, Poland",
        bio: "Adventure seeker. Always looking for something new.",
        interests: ["Hiking", "Fitness", "Travel"],
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900",
        likesYou: true,
        previouslySkippedYou: false
    }

];


// =====================================
// APPLICATION STATE
// =====================================

let currentProfileIndex = 0;

let likedProfiles = [];

let skippedProfiles = [];

let matches = [];

let conversations = {};

let activeConversationId = null;


let currentUser = {

    name: "Sarkorbek",

    bio: ""

};


let settings = {

    darkMode: false,

    matchNotifications: true,

    messageNotifications: true,

    profileVisibility: true

};


// =====================================
// LOCAL STORAGE
// =====================================

function saveSettings() {

    localStorage.setItem(
        "chanceSettings",
        JSON.stringify(settings)
    );

}


function loadSettings() {

    const savedSettings = localStorage.getItem("chanceSettings");

    if (savedSettings) {

        try {

            settings = {
                ...settings,
                ...JSON.parse(savedSettings)
            };

        } catch (error) {

            console.error("Could not load settings.", error);

        }

    }

}


function saveUserProfile() {

    localStorage.setItem(
        "chanceUser",
        JSON.stringify(currentUser)
    );

}


function loadUserProfile() {

    const savedUser = localStorage.getItem("chanceUser");

    if (savedUser) {

        try {

            currentUser = {
                ...currentUser,
                ...JSON.parse(savedUser)
            };

        } catch (error) {

            console.error("Could not load profile.", error);

        }

    }

}


// =====================================
// HTML ESCAPE
// =====================================

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, character => {

        const entities = {

            "&": "&amp;",

            "<": "&lt;",

            ">": "&gt;",

            '"': "&quot;",

            "'": "&#039;"

        };

        return entities[character];

    });

}


// =====================================
// DISCOVER
// =====================================

function showProfile() {

    const profileCard = document.getElementById("profile-card");


    if (!settings.profileVisibility) {

        profileCard.innerHTML = `

            <div class="end-message">

                <h2>Profile Hidden</h2>

                <p>Your demo profile visibility is turned off.</p>

                <button class="continue-btn" id="open-settings-btn">

                    Open Settings

                </button>

            </div>

        `;


        document.getElementById("open-settings-btn")
            .addEventListener("click", () => openPage("settings"));

        return;

    }


    if (currentProfileIndex >= profiles.length) {

        showEndMessage();

        return;

    }


    const profile = profiles[currentProfileIndex];


    profileCard.innerHTML = `

        <div class="profile-image">

            <img
                src="${profile.image}"
                alt="Demo profile">

            <div class="image-overlay"></div>

            <div class="profile-badge">
                ✦ New Connection
            </div>

            <div class="profile-info">

                <h2>
                    ${escapeHTML(profile.name)}, ${profile.age}
                </h2>

                <p>
                    📍 ${escapeHTML(profile.location)}
                </p>

                <p>
                    ${escapeHTML(profile.bio)}
                </p>

                <div class="interests-container">

                    ${profile.interests.map(interest => `

                        <span class="interest-tag">
                            ${escapeHTML(interest)}
                        </span>

                    `).join("")}

                </div>

            </div>

        </div>


        <div class="profile-actions">

            <button id="skip-btn"
                    class="action-btn skip-btn">
                ✕
            </button>

            <button id="like-btn"
                    class="action-btn like-btn">
                ♡
            </button>

        </div>

    `;


    document.getElementById("skip-btn")
        .addEventListener("click", skipProfile);

    document.getElementById("like-btn")
        .addEventListener("click", likeProfile);

}


// =====================================
// SKIP
// =====================================

function skipProfile() {

    if (currentProfileIndex >= profiles.length) return;

    const profile = profiles[currentProfileIndex];

    skippedProfiles.push(profile.id);

    currentProfileIndex++;

    showProfile();

}


// =====================================
// LIKE
// =====================================

function likeProfile() {

    if (currentProfileIndex >= profiles.length) return;

    const profile = profiles[currentProfileIndex];


    if (profile.previouslySkippedYou) {

        previousSwipeEffect();

        currentProfileIndex++;

        setTimeout(showProfile, 450);

        return;

    }


    likedProfiles.push(profile.id);


    if (profile.likesYou) {

        matches.push(profile);

        createConversation(profile);

        renderMatches();

        renderConversations();

        showMatch(profile);

        if (settings.matchNotifications) {

            showToast("You have a new match! ♡");

        }

    } else {

        showToast("Like sent successfully ♡");

    }


    currentProfileIndex++;

    showProfile();

}


// =====================================
// PREVIOUS SWIPE EFFECT
// =====================================

function previousSwipeEffect() {

    if (navigator.vibrate) {

        navigator.vibrate([100, 50, 100]);

    }


    const card = document.getElementById("profile-card");

    card.classList.add("shake");


    showToast("This profile previously skipped yours.");


    setTimeout(() => {

        card.classList.remove("shake");

    }, 450);

}


// =====================================
// MATCH MODAL
// =====================================

function showMatch(profile) {

    const modal = document.createElement("div");

    modal.className = "match-overlay";


    modal.innerHTML = `

        <div class="match-modal">

            <div class="match-heart">∞</div>

            <h2>It's a Match!</h2>

            <p>
                You and ${escapeHTML(profile.name)}
                liked each other.
                A new connection begins!
            </p>

            <button class="continue-btn">
                Continue Exploring
            </button>

        </div>

    `;


    document.body.appendChild(modal);


    modal.querySelector(".continue-btn").addEventListener("click", () => {

        modal.remove();

    });

}


// =====================================
// END OF PROFILES
// =====================================

function showEndMessage() {

    const profileCard = document.getElementById("profile-card");


    profileCard.innerHTML = `

        <div class="end-message">

            <h2>You've seen everyone! ♡</h2>

            <p>
                You've reached the end of our demo profiles.
            </p>

            <p>
                Total Matches: ${matches.length}
            </p>

            <button class="continue-btn" id="restart-btn">
                Start Again
            </button>

        </div>

    `;


    document.getElementById("restart-btn").addEventListener("click", () => {

        currentProfileIndex = 0;

        likedProfiles = [];

        skippedProfiles = [];

        matches = [];

        conversations = {};

        activeConversationId = null;


        renderMatches();

        renderConversations();

        showProfile();

        showToast("Demo restarted!");

    });

}


// =====================================
// MATCHES
// =====================================

function renderMatches() {

    const grid = document.getElementById("matches-grid");

    const count = document.getElementById("matches-count");


    count.textContent = matches.length;


    if (matches.length === 0) {

        grid.innerHTML = `

            <div class="no-matches">

                <h3>No matches yet ♡</h3>

                <p>Your connections will appear here.</p>

            </div>

        `;

        return;

    }


    grid.innerHTML = matches.map(profile => `

        <div class="match-card" data-id="${profile.id}">

            <img
                src="${profile.image}"
                alt="Demo profile">

            <h3>
                ${escapeHTML(profile.name)}, ${profile.age}
            </h3>

            <p class="match-status">
                ♡ It's a Match!
            </p>

        </div>

    `).join("");


    document.querySelectorAll(".match-card").forEach(card => {

        card.addEventListener("click", () => {

            openConversation(Number(card.dataset.id));

        });

    });

}


// =====================================
// CREATE CONVERSATION
// =====================================

function createConversation(profile) {

    if (conversations[profile.id]) return;


    conversations[profile.id] = [

        {
            sender: "them",

            text: "Hi! Nice to connect with you. ♡",

            time: "Demo"

        }

    ];

}


// =====================================
// CONVERSATION LIST
// =====================================

function renderConversations() {

    const list = document.getElementById("conversation-list");


    if (matches.length === 0) {

        list.innerHTML = `

            <div class="no-matches">
                No conversations yet.
            </div>

        `;

        return;

    }


    list.innerHTML = matches.map(profile => {

        const messages = conversations[profile.id] || [];

        const lastMessage = messages.length
            ? messages[messages.length - 1].text
            : "Start a conversation";


        return `

            <div class="conversation-item
                ${activeConversationId === profile.id ? "active" : ""}"
                data-id="${profile.id}">

                <img
                    src="${profile.image}"
                    class="conversation-avatar"
                    alt="Demo profile">

                <div class="conversation-details">

                    <strong>
                        ${escapeHTML(profile.name)}
                    </strong>

                    <p>
                        ${escapeHTML(lastMessage)}
                    </p>

                </div>

            </div>

        `;

    }).join("");


    document.querySelectorAll(".conversation-item").forEach(item => {

        item.addEventListener("click", () => {

            openConversation(Number(item.dataset.id));

        });

    });

}


// =====================================
// OPEN CONVERSATION
// =====================================

function openConversation(profileId) {

    activeConversationId = profileId;

    openPage("messages");

    renderConversations();


    const profile = matches.find(p => p.id === profileId);

    if (!profile) return;


    renderChat(profile);

}


// =====================================
// CHAT
// =====================================

function renderChat(profile) {

    const chatPanel = document.getElementById("chat-panel");

    const messages = conversations[profile.id] || [];


    chatPanel.innerHTML = `

        <div class="chat-header">

            <img
                src="${profile.image}"
                alt="Demo profile">

            <div>

                <h3>${escapeHTML(profile.name)}</h3>

                <p>Demo conversation</p>

            </div>

        </div>


        <div class="chat-messages" id="chat-messages">

            ${messages.map(message => `

                <div class="message ${message.sender === "me" ? "sent" : "received"}">

                    ${escapeHTML(message.text)}

                    <span class="message-time">
                        ${escapeHTML(message.time)}
                    </span>

                </div>

            `).join("")}

        </div>


        <form class="chat-input-area" id="chat-form">

            <input
                type="text"
                id="message-input"
                placeholder="Write a message..."
                maxlength="500"
                autocomplete="off"
                required>

            <button type="submit" class="send-button">
                Send
            </button>

        </form>

    `;


    document.getElementById("chat-form").addEventListener("submit", event => {

        event.preventDefault();

        sendMessage(profile.id);

    });


    scrollChatToBottom();

}


// =====================================
// SEND MESSAGE
// =====================================

function sendMessage(profileId) {

    const input = document.getElementById("message-input");

    const text = input.value.trim();


    if (!text) return;


    conversations[profileId].push({

        sender: "me",

        text: text,

        time: getCurrentTime()

    });


    const profile = matches.find(p => p.id === profileId);


    renderChat(profile);

    renderConversations();


    if (settings.messageNotifications) {

        showToast("Demo message sent successfully.");

    }

}


// =====================================
// TIME
// =====================================

function getCurrentTime() {

    return new Date().toLocaleTimeString([], {

        hour: "2-digit",

        minute: "2-digit"

    });

}


// =====================================
// SCROLL CHAT
// =====================================

function scrollChatToBottom() {

    const messages = document.getElementById("chat-messages");

    if (messages) {

        messages.scrollTop = messages.scrollHeight;

    }

}


// =====================================
// PAGE NAVIGATION
// =====================================

function openPage(pageName) {

    document.querySelectorAll(".page-section").forEach(page => {

        page.classList.remove("active");

    });


    document.querySelectorAll(".nav-link").forEach(link => {

        link.classList.remove("active");

    });


    const selectedPage = document.getElementById(pageName + "-page");

    if (selectedPage) {

        selectedPage.classList.add("active");

    }


    const selectedLink = document.querySelector(
        `.nav-link[data-page="${pageName}"]`
    );

    if (selectedLink) {

        selectedLink.classList.add("active");

    }


    const titles = {

        discover: ["Welcome to Chance", "Discover new connections."],

        matches: ["Your Matches", "Connections that started with a chance."],

        messages: ["Messages", "Continue your conversations."],

        settings: ["Settings", "Personalize your experience."]

    };


    document.getElementById("page-title").textContent =
        titles[pageName][0];

    document.getElementById("page-subtitle").textContent =
        titles[pageName][1];


    if (pageName === "matches") {

        renderMatches();

    }


    if (pageName === "messages") {

        renderConversations();

    }

}


document.querySelectorAll(".nav-link").forEach(link => {

    link.addEventListener("click", event => {

        event.preventDefault();

        openPage(link.dataset.page);

    });

});


// =====================================
// SETTINGS — PROFILE
// =====================================

function initializeProfileSettings() {

    const nameInput = document.getElementById("settings-name");

    const bioInput = document.getElementById("settings-bio");


    nameInput.value = currentUser.name;

    bioInput.value = currentUser.bio;


    document.getElementById("save-profile-btn").addEventListener("click", () => {

        const newName = nameInput.value.trim();

        const newBio = bioInput.value.trim();


        if (!newName) {

            showToast("Please enter a display name.");

            return;

        }


        currentUser.name = newName;

        currentUser.bio = newBio;


        saveUserProfile();

        updateTopbar();


        showToast("Profile updated successfully! ♡");

    });

}


// =====================================
// UPDATE TOPBAR
// =====================================

function updateTopbar() {

    document.getElementById("topbar-name").textContent =
        currentUser.name;

}


// =====================================
// SETTINGS — DARK MODE
// =====================================

function initializeDarkMode() {

    const toggle = document.getElementById("dark-mode-toggle");


    toggle.checked = settings.darkMode;

    applyDarkMode();


    toggle.addEventListener("change", () => {

        settings.darkMode = toggle.checked;

        applyDarkMode();

        saveSettings();


        showToast(
            settings.darkMode
                ? "Dark Mode enabled."
                : "Light Mode enabled."
        );

    });

}


function applyDarkMode() {

    document.body.classList.toggle(
        "dark-mode",
        settings.darkMode
    );

}


// =====================================
// SETTINGS — NOTIFICATIONS
// =====================================

function initializeNotifications() {

    const matchToggle = document.getElementById("match-notifications");

    const messageToggle = document.getElementById("message-notifications");


    matchToggle.checked = settings.matchNotifications;

    messageToggle.checked = settings.messageNotifications;


    matchToggle.addEventListener("change", () => {

        settings.matchNotifications = matchToggle.checked;

        saveSettings();

        showToast("Match notification preference updated.");

    });


    messageToggle.addEventListener("change", () => {

        settings.messageNotifications = messageToggle.checked;

        saveSettings();

        showToast("Message notification preference updated.");

    });

}


// =====================================
// SETTINGS — PRIVACY
// =====================================

function initializePrivacy() {

    const visibilityToggle = document.getElementById("profile-visibility");


    visibilityToggle.checked = settings.profileVisibility;


    visibilityToggle.addEventListener("change", () => {

        settings.profileVisibility = visibilityToggle.checked;

        saveSettings();


        if (!settings.profileVisibility) {

            showToast("Demo profile visibility disabled.");

        } else {

            showToast("Demo profile visibility enabled.");

        }


        showProfile();

    });

}


// =====================================
// SETTINGS — LOG OUT
// =====================================

function initializeLogout() {

    document.getElementById("logout-btn").addEventListener("click", () => {

        const confirmed = confirm(
            "Are you sure you want to reset your demo session?"
        );


        if (!confirmed) return;


        localStorage.removeItem("chanceSettings");

        localStorage.removeItem("chanceUser");


        location.reload();

    });

}


// =====================================
// TOAST
// =====================================

function showToast(message) {

    const existingToast = document.querySelector(".chance-toast");

    if (existingToast) {

        existingToast.remove();

    }


    const toast = document.createElement("div");

    toast.className = "chance-toast";

    toast.textContent = message;


    document.body.appendChild(toast);


    setTimeout(() => {

        toast.classList.add("show");

    }, 10);


    setTimeout(() => {

        toast.classList.remove("show");


        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 2800);

}


// =====================================
// INITIALIZE APPLICATION
// =====================================

function initializeApp() {

    loadSettings();

    loadUserProfile();


    initializeProfileSettings();

    initializeDarkMode();

    initializeNotifications();

    initializePrivacy();

    initializeLogout();


    updateTopbar();


    showProfile();

    renderMatches();

    renderConversations();

}


// START APPLICATION

initializeApp();