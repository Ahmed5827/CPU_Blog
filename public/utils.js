
async function createPost(postData) {
    const endpoint = "http://localhost:3000/posts"; // Replace with your server URL if different

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
}

(async () => {
    const postData = {
        name: "My First Post",
        email: "ninhas gone mad",
        age: "23",
    };

    try {
        const result = await createPost(postData);
        console.log("Post created successfully:", result);
    } catch (error) {
        console.error("Failed to create post:", error);
    }
})();