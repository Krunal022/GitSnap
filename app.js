const searchBtn = document.getElementById("searchBtn");
const themeToggle = document.getElementById("themeToggle");
const profileContainer = document.getElementById("profile");

// Dark mode functionality
themeToggle.addEventListener("click", () => {
  document.body.dataset.theme =
    document.body.dataset.theme === "dark" ? "light" : "dark";
  themeToggle.textContent =
    document.body.dataset.theme === "dark" ? "☀️" : "🌙";
});

searchBtn.addEventListener("click", async () => {
  const username = document.getElementById("username").value;
  if (!username) {
    showError("Please enter a username!");
    return;
  }

  profileContainer.innerHTML = '<div class="loading">Loading...</div>';

  try {
    // Fetch user profile
    const res = await fetch(`https://api.github.com/users/${username}`);
    if (!res.ok) throw new Error("User not found");
    const userData = await res.json();

    // Fetch user repos
    const reposRes = await fetch(userData.repos_url);
    const reposData = await reposRes.json();

    // Call display function
    displayProfile(userData, reposData);
  } catch (error) {
    showError(error.message);
  }
});

function showError(message) {
  profileContainer.innerHTML = `<div class="error-message">${message}</div>`;
}

function displayProfile(user, repos) {
  // Sort repos by stars
  const sortedRepos = repos.sort(
    (a, b) => b.stargazers_count - a.stargazers_count
  );

  profileContainer.innerHTML = `
    <div class="profile-card">
      <div class="profile-header">
        <img src="${user.avatar_url}" alt="Avatar" class="profile-avatar"/>
        <div class="profile-info">
          <h2 class="profile-name">${user.name || user.login}</h2>
          <p class="profile-bio">${user.bio || "No bio available."}</p>
          <div class="profile-stats">
            <div class="stat-item">
              <div class="stat-value">${user.followers}</div>
              <div class="stat-label">Followers</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${user.following}</div>
              <div class="stat-label">Following</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${user.public_repos}</div>
              <div class="stat-label">Repositories</div>
            </div>
          </div>
          <div class="profile-details">
            ${user.location ? `<p>📍 ${user.location}</p>` : ""}
            ${user.company ? `<p>🏢 ${user.company}</p>` : ""}
            ${
              user.blog
                ? `<p>🌐 <a href="${user.blog}" target="_blank">${user.blog}</a></p>`
                : ""
            }
            ${
              user.twitter_username
                ? `<p>🐦 <a href="https://twitter.com/${user.twitter_username}" target="_blank">@${user.twitter_username}</a></p>`
                : ""
            }
          </div>
        </div>
      </div>

      <div class="repos-section">
        <h3>Top Repositories</h3>
        <div class="repo-grid">
          ${sortedRepos
            .slice(0, 6)
            .map(
              (repo) => `
            <div class="repo-card">
              <h4 class="repo-name">
                <a href="${repo.html_url}" target="_blank">${repo.name}</a>
              </h4>
              <p class="repo-description">${
                repo.description || "No description available."
              }</p>
              <div class="repo-stats">
                <span class="repo-stat">⭐ ${repo.stargazers_count}</span>
                <span class="repo-stat">🍴 ${repo.forks_count}</span>
                <span class="repo-stat">👀 ${repo.watchers_count}</span>
                ${
                  repo.language
                    ? `<span class="repo-stat">💻 ${repo.language}</span>`
                    : ""
                }
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    </div>
  `;
}