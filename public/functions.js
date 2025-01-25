let userData = {};

// Load user data from localStorage when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const storedUserData = localStorage.getItem("userData");
  if (storedUserData) {
    userData = JSON.parse(storedUserData);
  }

  // Use event delegation to handle keydown events
  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission or other default actions

      // Find the nearest comment input within the parent container
      const commentInput = event.target
        .closest(".usericopost")
        .querySelector(".comment");
      const commentsContainer = event.target
        .closest(".usericopost")
        .querySelector(".comments-container");
      const interactionsText = event.target
        .closest(".usericopost")
        .querySelector(".interactions small");

      if (commentInput && commentsContainer) {
        const commentText = commentInput.value.trim();

        if (commentText) {
          // Create new comment element
          const newComment = document.createElement("div");
          newComment.classList.add("commentpost");

          // Set the inner HTML of the new comment
          newComment.innerHTML = `
                        <div class="row-layoutcomments">
                            <div>
                                <img src="./Photos/user.png" width="50px" class="imgclass" />
                            </div>
                            <div class="name">
                                <h4 class="truename">${userData.userName}</h4>
                                <small>${userData.userRole}</small>
                            </div>
                        </div>
                        <span>${commentText}</span>
                    `;

          // Append the new comment to the comments container
          commentsContainer.appendChild(newComment);

          // Update the comment counter
          let commentsCount =
            parseInt(interactionsText.textContent.split(" ")[2]) || 0;
          commentsCount++;
          interactionsText.textContent = `${
            interactionsText.textContent.split(" ")[0]
          } Likes, ${commentsCount} comments`;

          // Clear the input field
          commentInput.value = "";
        }
      }
    }
  });
});

function navigateToPage(event) {
  event.preventDefault(); // Prevents form submission

  // Get values from the input fields
  const name = document.getElementById("name").value;
  const role = document.getElementById("role").value;
  const password = document.getElementById("password").value;

  // Check if inputs are valid
  if (name && role && password) {
    // Save user data to localStorage
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userName: name,
        userRole: role,
        userPassword: password,
      })
    );

    // Navigate to the desired page
    window.location.href = "/";
  } else {
    alert("Please fill out all fields.");
  }
}

function focusCommentInput(container) {
  // Find the closest parent container for the clicked comment image
  var postContainer = container.closest(".usericopost");
  var commentInput = postContainer.querySelector(".comment");
  if (commentInput) {
    commentInput.focus();
  }
}

function Liked(likeElement) {
  // Find the parent element containing the like info
  const interactions = likeElement.closest(".content").querySelector(".interactions");
  
  if (!interactions) return; // Safety check in case no interactions element is found

  // Extract the current likes count from the text
  const likesText = interactions.querySelector("small").textContent;
  const matches = likesText.match(/(\d+)\s+Likes/);
  if (!matches) return; // If the likes text doesn't match the expected pattern, exit

  let currentLikes = parseInt(matches[1], 10); // Get the current likes count as a number

  // Toggle the like state
  const likedImg = likeElement.querySelector(".myImage");
  if (likedImg.classList.contains("liked")) {
    // If already liked, unlike and decrement likes count
    likedImg.src = "./Photos/like.png"; // Revert to unliked image
    likedImg.classList.remove("liked");
    currentLikes--;
  } else {
    // If not liked, like and increment likes count
    likedImg.src = "./Photos/liked.png"; // Change to liked image
    likedImg.classList.add("liked");
    currentLikes++;
  }

  // Update the likes text
  interactions.querySelector("small").textContent = `${currentLikes} Likes, 0 comments`;
}


async function  addPost ()  {
  var postContent = document.getElementById("postInput").value;
  if (postContent.trim() !== "") {

    const endpoint = "http://localhost:3000/posts"; // Replace with your server URL if different
    postData = {
        username: userData.userName,
        role: userData.userRole,
        content: postContent,
    };
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
    finally{
    var newPost = document.createElement("div");
    newPost.className = "usericopost";
    newPost.innerHTML = `
            <div class="row-layout">
                <div>
                    <img src="./Photos/user.png" width="50px" class="imgclass" />
                </div>
                <div class="name">
                    <h3 class="truename">${userData.userName}</h3>
                    <small>${userData.userRole}</small>
                </div>
            </div>
            <hr width="97%" />
            <div class="content">
                <p class="blog">${postContent}</p>
                <div class="interactions">
                    <small>0 Likes, 0 comments</small>
                </div>
                <hr width="97%" />
                <div class="LandC">
                    <div class="cursor" onclick="Liked(this)">
                        <img src="./Photos/like.png" class="myImage" width="30px" />
                        <label>Like</label>
                    </div>
                    <div class="cursor" onclick="focusCommentInput(this)">
                        <img src="./Photos/comment.png" width="30px" />
                        <label>Comment</label>
                    </div>
                </div>
                <hr width="97%" />
                <div class="comments-container"></div>
                <input type="text" class="comment" placeholder="add a comment!" />
            </div>
        `;

    var postForum = document.querySelector(".postforum");
    postForum.insertAdjacentElement("afterend", newPost);
    document.getElementById("postInput").value = "";
  } 
}
else {
  alert("Please enter something to post.");
}}

window.onload = async function () {
  await getPosts(); // Call the function to fetch and display posts when the page loads
};

async function getPosts() {
  const endpoint = "http://localhost:3000/posts"; // Replace with your server URL if different

  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const posts = await response.json();

    const postForum = document.querySelector(".postforum");

    posts.forEach(post => {
      const newPost = document.createElement("div");
      newPost.className = "usericopost";
      newPost.innerHTML = `
        <div class="row-layout">
            <div>
                <img src="./Photos/user.png" width="50px" class="imgclass" />
            </div>
            <div class="name">
                <h3 class="truename">${post.username || "Unknown User"}</h3>
                <small>${post.role || "Unknown Role"}</small>
            </div>
        </div>
        <hr width="97%" />
        <div class="content">
            <p class="blog">${post.content || "No content available"}</p>
            <div class="interactions">
                <small>0 Likes, 0 comments</small>
            </div>
            <hr width="97%" />
            <div class="LandC">
                <div class="cursor" onclick="Liked(this)">
                    <img src="./Photos/like.png" class="myImage" width="30px" />
                    <label>Like</label>
                </div>
                <div class="cursor" onclick="focusCommentInput(this)">
                    <img src="./Photos/comment.png" width="30px" />
                    <label>Comment</label>
                </div>
            </div>
            <hr width="97%" />
            <div class="comments-container"></div>
            <input type="text" class="comment" placeholder="add a comment!" />
        </div>
      `;

      // Insert the post into the DOM
      postForum.insertAdjacentElement("afterend", newPost);
    });
  } catch (error) {
    console.error("Error getting posts:", error);
    throw error;
  }
}
