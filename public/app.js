/**
 * SKILLSWAP - SHARED FRONTEND LOGIC (VIVA-FRIENDLY VERSION)
 * --------------------------------------------------------
 * This file contains utility functions used across all our pages.
 * It handles talking to the server and managing the user session.
 * 
 * VIVA NOTE: All functions here use plain JavaScript.
 * We use 'localStorage' to remember who is logged in.
 */

// The base URL for our API (simple version)
var API_BASE_URL = "/api";
if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    API_BASE_URL = "http://localhost:3000/api";
}

/**
 * apiFetch: A simple wrapper around the browser's 'fetch' tool.
 */
async function apiFetch(endpoint, method, body) {
    if (!method) {
        method = "GET";
    }

    var options = {
        method: method,
        headers: {
            "Content-Type": "application/json"
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        var response = await fetch(API_BASE_URL + endpoint, options);
        var data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Server Error");
        }

        return data;
    } catch (err) {
        console.error("API Error:", err);
        throw err;
    }
}

/**
 * getCurrentUser: Checks if a user is logged in.
 */
function getCurrentUser() {
    var userString = localStorage.getItem("currentUser");
    
    if (!userString) {
        var currentPath = window.location.pathname;
        // If not logged in and not on index page, redirect to index
        if (currentPath.indexOf("index.html") === -1 && currentPath !== "/") {
            window.location.href = "index.html";
        }
        return null;
    }
    
    return JSON.parse(userString);
}

/**
 * logout: Clears session.
 */
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

/**
 * createAvatarCircle: Creates the initials circle.
 */
function createAvatarCircle(name, size) {
    if (!size) size = "sm";
    
    var nameParts = name.split(" ");
    var initials = "";
    for (var i = 0; i < nameParts.length; i++) {
        if (nameParts[i]) {
            initials += nameParts[i].charAt(0).toUpperCase();
        }
    }
    initials = initials.substring(0, 2);

    var avatarDiv = document.createElement("div");
    avatarDiv.className = "avatar avatar-" + size;
    avatarDiv.textContent = initials;
    
    return avatarDiv;
}

/**
 * createSkillTag: Creates a small "pill" for a skill.
 */
function createSkillTag(skill, type) {
    if (!type) type = "know";
    
    var tagSpan = document.createElement("span");
    tagSpan.className = "tag tag-" + type;
    tagSpan.textContent = skill;
    
    return tagSpan;
}

/**
 * timeAgo: Simple time formatter.
 */
function timeAgo(timestamp) {
    var pastDate = new Date(timestamp);
    var nowDate = new Date();
    var secondsDiff = Math.floor((nowDate - pastDate) / 1000);

    if (secondsDiff < 60) return "just now";
    
    var minutesDiff = Math.floor(secondsDiff / 60);
    if (minutesDiff < 60) return minutesDiff + "m ago";
    
    var hoursDiff = Math.floor(minutesDiff / 60);
    if (hoursDiff < 24) return hoursDiff + "h ago";
    
    var daysDiff = Math.floor(hoursDiff / 24);
    return daysDiff + "d ago";
}

/**
 * renderNavbar: Adds the top navigation bar.
 */
function renderNavbar() {
    var user = getCurrentUser();
    if (!user) return;

    var navElement = document.createElement("nav");
    navElement.className = "navbar";
    
    // Using simple string concatenation (+) instead of template literals (``)
    var html = '<div class="container nav-content">';
    html += '<div class="logo">SkillSwap</div>';
    html += '<div class="nav-links">';
    html += '<a href="dashboard.html">Dashboard</a>';
    html += '<a href="search.html">Search</a>';
    html += '<a href="profile.html">My Profile</a>';
    html += '<a href="chat.html">Messages</a>';
    html += '</div>';
    html += '<div class="nav-user">';
    html += '<span style="font-weight: 500">' + user.name + '</span>';
    html += '<div id="nav-avatar-placeholder"></div>';
    html += '<button onclick="logout()" class="btn btn-secondary">Logout</button>';
    html += '</div></div>';
    
    navElement.innerHTML = html;
    document.body.prepend(navElement);
    
    var avatarPlaceholder = document.getElementById("nav-avatar-placeholder");
    if (avatarPlaceholder) {
        avatarPlaceholder.appendChild(createAvatarCircle(user.name, "sm"));
    }
}

// Run when page loads
document.addEventListener("DOMContentLoaded", function() {
    var currentPath = window.location.pathname;
    if (currentPath.indexOf("index.html") === -1 && currentPath !== "/") {
        renderNavbar();
    }
});
