document.getElementById('fetch-posts').addEventListener('click', fetchPosts);

async function fetchPosts() {
    const loadingIndicator = document.getElementById('loading-indicator');
    const postsContainer = document.getElementById('posts-container');
    const postDetailsContainer = document.getElementById('post-details-container');
    
    loadingIndicator.classList.remove('hidden');
    postsContainer.innerHTML = '';
    postDetailsContainer.classList.add('hidden');

    try {
        const [postsResponse, usersResponse] = await Promise.all([
            fetch('https://jsonplaceholder.typicode.com/posts'),
            fetch('https://jsonplaceholder.typicode.com/users')
        ]);

        const posts = await postsResponse.json();
        const users = await usersResponse.json();
        const usersMap = new Map(users.map(user => [user.id, user]));

        posts.forEach(post => {
            const user = usersMap.get(post.userId);
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.body}</p>
                <div class="user-info">By ${user.name} (${user.email})</div>
            `;
            postElement.addEventListener('click', () => fetchPostDetails(post.id));
            postsContainer.appendChild(postElement);
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        postsContainer.innerHTML = '<div id="error-message">Error fetching posts. Please try again later.</div>';
    } finally {
        loadingIndicator.classList.add('hidden');
    }
}

async function fetchPostDetails(postId) {
    const postDetailsContainer = document.getElementById('post-details-container');
    const loadingIndicator = document.getElementById('loading-indicator');

    loadingIndicator.classList.remove('hidden');
    postDetailsContainer.innerHTML = '';

    try {
        const [postResponse, commentsResponse] = await Promise.all([
            fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`),
            fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
        ]);

        const post = await postResponse.json();
        const comments = await commentsResponse.json();

        postDetailsContainer.innerHTML = `
            <div class="post-details">
                <h2>${post.title}</h2>
                <p>${post.body}</p>
                <div class="comments">
                    <h3>Comments:</h3>
                    ${comments.map(comment => `
                        <div class="comment">
                            <p>${comment.body}</p>
                            <div class="comment-email">By ${comment.email}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        postDetailsContainer.classList.remove('hidden');
    } catch (error) {
        console.error('Error fetching post details:', error);
        postDetailsContainer.innerHTML = '<div id="error-message">Error fetching post details. Please try again later.</div>';
    } finally {
        loadingIndicator.classList.add('hidden');
    }
}
