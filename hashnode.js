const HASHNODE_HOST = "sagar2003.hashnode.dev";

/**
 * Fetches the latest published articles from Hashnode
 * @param {number} limit - Number of articles to fetch
 * @returns {Array} Array of post objects
 */
async function fetchHashnodePosts(limit = 10) {
    const query = `
        query Publication {+
            publication(host: "${HASHNODE_HOST}") {
                posts(first: ${limit}) {
                    edges {
                        node {
                            title
                            brief
                            slug
                            coverImage { url }
                            tags { name }
                            publishedAt
                            readTimeInMinutes
                        }
                    }
                }
            }
        }
    `;

    try {
        const response = await fetch("https://gql.hashnode.com/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query })
        });
        const result = await response.json();

        if (result.errors) {
            console.error("Hashnode API Error:", result.errors);
            return [];
        }

        return result.data?.publication?.posts?.edges?.map(edge => edge.node) || [];
    } catch (error) {
        console.error("Error fetching Hashnode posts:", error);
        return [];
    }
}

/**
 * Fetches a single full article by its slug
 * @param {string} slug - The article slug
 * @returns {Object} Post object with HTML content
 */
async function fetchHashnodePostBySlug(slug) {
    const query = `
        query Publication {
            publication(host: "${HASHNODE_HOST}") {
                post(slug: "${slug}") {
                    title
                    content { html }
                    coverImage { url }
                    tags { name }
                    publishedAt
                    readTimeInMinutes
                    author {
                        name
                        profilePicture
                    }
                }
            }
        }
    `;

    try {
        const response = await fetch("https://gql.hashnode.com/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query })
        });
        const result = await response.json();

        if (result.errors) {
            console.error("Hashnode API Error:", result.errors);
            return null;
        }

        return result.data?.publication?.post || null;
    } catch (error) {
        console.error("Error fetching Hashnode post:", error);
        return null;
    }
}

// Utility to format dates like "Oct 24, 2025"
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}
