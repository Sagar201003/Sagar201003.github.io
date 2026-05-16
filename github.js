const GITHUB_USERNAME = "Sagar201003";
// Put the exact GitHub repo names here that you want to feature as large cards.
// If empty, it will automatically pick the 3 most starred repos.
const FEATURED_REPOS = [
    // "repo-name-1", 
    // "repo-name-2"
];

/**
 * Fetches all public repositories for the user.
 * Excludes forked repositories.
 */
async function fetchGithubRepos() {
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
        if (!response.ok) throw new Error("Failed to fetch repos");
        
        const repos = await response.json();
        
        // Filter out forks
        return repos.filter(repo => !repo.fork);
    } catch (error) {
        console.error("Error fetching GitHub repos:", error);
        return [];
    }
}

/**
 * Fetches the raw README.md for a given repository.
 */
async function fetchReadme(repoName) {
    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/readme`);
        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error("Failed to fetch README");
        }
        
        const data = await response.json();
        // GitHub API returns Base64 encoded content
        // Decode it properly handling UTF-8 characters
        const binaryString = atob(data.content);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        const decoder = new TextDecoder('utf-8');
        return decoder.decode(bytes);
    } catch (error) {
        console.error(`Error fetching README for ${repoName}:`, error);
        return null;
    }
}

/**
 * Helper to process repos into Featured and All lists
 */
async function getProcessedRepos() {
    const allRepos = await fetchGithubRepos();
    let featured = [];
    let rest = [];

    if (FEATURED_REPOS.length > 0) {
        featured = allRepos.filter(repo => FEATURED_REPOS.includes(repo.name));
        rest = allRepos.filter(repo => !FEATURED_REPOS.includes(repo.name));
    } else {
        // If no featured repos specified, pick top 3 by stars
        const sortedByStars = [...allRepos].sort((a, b) => b.stargazers_count - a.stargazers_count);
        featured = sortedByStars.slice(0, 3);
        rest = sortedByStars.slice(3); // Wait, the prompt says "Show ALL non-forked public repos (including pinned ones) as a minimal compact list"
        // So 'All Projects' section B should include ALL repos, even featured ones.
        rest = allRepos; // We will show all in Section B
    }

    return { featured, all: allRepos };
}

// Utility to format repo name (e.g., "my-awesome-repo" -> "My Awesome Repo")
function formatRepoName(name) {
    return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}
