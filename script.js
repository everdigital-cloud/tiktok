/* =========================================
   TIKTOK CLONE JAVASCRIPT
========================================= */


/* =========================================
   VARIABLES
========================================= */

const feed = document.getElementById("feed");

const commentsModal =
    document.getElementById("commentsModal");

const closeComments =
    document.getElementById("closeComments");

const commentInput =
    document.getElementById("commentInput");

const postComment =
    document.getElementById("postComment");

const commentsList =
    document.getElementById("commentsList");

const uploadBtn =
    document.getElementById("uploadBtn");

const uploadModal =
    document.getElementById("uploadModal");

const closeUpload =
    document.getElementById("closeUpload");

const videoUpload =
    document.getElementById("videoUpload");

const uploadPreview =
    document.getElementById("uploadPreview");

const publishBtn =
    document.getElementById("publishBtn");

const toast =
    document.getElementById("toast");

let selectedVideo = null;


/* =========================================
   LOCAL STORAGE
========================================= */

function getStorage(key, defaultValue) {

    const data = localStorage.getItem(key);

    if (!data) {
        return defaultValue;
    }

    try {
        return JSON.parse(data);
    } catch {
        return defaultValue;
    }
}


/* =========================================
   TOAST MESSAGE
========================================= */

function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2000);
}


/* =========================================
   LIKE BUTTON
========================================= */

document.querySelectorAll(".like-btn").forEach(button => {

    button.addEventListener("click", function() {

        const card =
            this.closest(".video-card");

        const count =
            card.querySelector(".like-count");

        let currentLikes =
            parseFloat(
                count.textContent
                .replace("K", "")
                .replace("M", "")
            );

        const isLiked =
            this.classList.contains("liked");


        if (!isLiked) {

            this.classList.add("liked");

            if (count.textContent.includes("K")) {
                currentLikes += 0.1;

                count.textContent =
                    currentLikes.toFixed(1) + "K";
            } else {
                currentLikes++;

                count.textContent =
                    currentLikes;
            }

        } else {

            this.classList.remove("liked");

            if (count.textContent.includes("K")) {

                currentLikes -= 0.1;

                count.textContent =
                    Math.max(
                        0,
                        currentLikes
                    ).toFixed(1) + "K";

            } else {

                currentLikes--;

                count.textContent =
                    Math.max(
                        0,
                        currentLikes
                    );
            }
        }

    });

});


/* =========================================
   FOLLOW BUTTON
========================================= */

document.querySelectorAll(".follow-btn").forEach(button => {

    button.addEventListener("click", function() {

        if (this.classList.contains("following")) {

            this.classList.remove("following");

            this.textContent = "Follow";

        } else {

            this.classList.add("following");

            this.textContent = "Following";

        }

    });

});


/* =========================================
   VIDEO PLAY / PAUSE
========================================= */

document.querySelectorAll(".video").forEach(video => {

    video.addEventListener("click", function() {

        if (this.paused) {

            this.play();

        } else {

            this.pause();

        }

    });

});


/* =========================================
   AUTO PLAY VIDEOS
========================================= */

const videoObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                const video =
                    entry.target;

                if (entry.isIntersecting) {

                    document
                        .querySelectorAll(".video")
                        .forEach(otherVideo => {

                            if (
                                otherVideo !== video
                            ) {
                                otherVideo.pause();
                            }

                        });

                    video
                        .play()
                        .catch(() => {});

                } else {

                    video.pause();

                }

            });

        }, {
            threshold: 0.65
        }
    );


document.querySelectorAll(".video").forEach(video => {

    videoObserver.observe(video);

});


/* =========================================
   MUTE / UNMUTE
========================================= */

document.querySelectorAll(".mute-btn").forEach(button => {

    button.addEventListener("click", function() {

        const card =
            this.closest(".video-card");

        const video =
            card.querySelector(".video");

        video.muted = !video.muted;

        const icon =
            this.querySelector("i");

        if (video.muted) {

            icon.className =
                "fa-solid fa-volume-xmark";

        } else {

            icon.className =
                "fa-solid fa-volume-high";

        }

    });

});


/* =========================================
   COMMENTS
========================================= */

document.querySelectorAll(".comment-btn").forEach(button => {

    button.addEventListener("click", function() {

        commentsModal.classList.add("show");

        commentInput.focus();

    });

});


closeComments.addEventListener("click", () => {

    commentsModal.classList.remove("show");

});


commentsModal.addEventListener("click", event => {

    if (event.target === commentsModal) {

        commentsModal.classList.remove("show");

    }

});


/* =========================================
   ADD COMMENT
========================================= */

function addComment() {

    const text =
        commentInput.value.trim();

    if (!text) {

        showToast("Write a comment first");

        return;
    }


    const comment =
        document.createElement("div");

    comment.className = "comment";

    comment.innerHTML = `

        <img
            src="https://i.pravatar.cc/60?img=12"
            alt=""
        >

        <div>

            <strong>@you</strong>

            <p>${escapeHTML(text)}</p>

            <small>Just now</small>

        </div>

    `;


    commentsList.prepend(comment);

    commentInput.value = "";

    showToast("Comment posted");

}


postComment.addEventListener(
    "click",
    addComment
);


commentInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            addComment();

        }

    }
);


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* =========================================
   SHARE BUTTON
========================================= */

document.querySelectorAll(".share-btn").forEach(button => {

    button.addEventListener("click", async function() {

        const card =
            this.closest(".video-card");

        const creator =
            card.querySelector(".creator h3");

        const shareText =
            `Check out this video from ${creator.textContent}`;

        try {

            if (navigator.share) {

                await navigator.share({
                    title: "TikTok Clone",
                    text: shareText,
                    url: window.location.href
                });

            } else {

                await navigator.clipboard.writeText(
                    window.location.href
                );

                showToast("Video link copied");

            }

        } catch (error) {

            console.log(
                "Share cancelled"
            );

        }

    });

});


/* =========================================
   UPLOAD MODAL
========================================= */

uploadBtn.addEventListener("click", () => {

    uploadModal.classList.add("show");

});


closeUpload.addEventListener("click", () => {

    uploadModal.classList.remove("show");

});


uploadModal.addEventListener("click", event => {

    if (event.target === uploadModal) {

        uploadModal.classList.remove("show");

    }

});


/* =========================================
   VIDEO FILE SELECTION
========================================= */

videoUpload.addEventListener(
    "change",
    function() {

        const file =
            this.files[0];

        if (!file) {
            return;
        }

        selectedVideo = file;

        const videoURL =
            URL.createObjectURL(file);


        uploadPreview.innerHTML = `

            <video
                src="${videoURL}"
                controls
                autoplay
                muted
            ></video>

        `;

    }
);


/* =========================================
   PUBLISH VIDEO
========================================= */

publishBtn.addEventListener(
    "click",
    function() {

        if (!selectedVideo) {

            showToast(
                "Please select a video"
            );

            return;
        }


        const videoURL =
            URL.createObjectURL(
                selectedVideo
            );


        const videoCard =
            document.createElement("article");

        videoCard.className =
            "video-card";


        videoCard.innerHTML = `

            <video
                class="video"
                src="${videoURL}"
                loop
                playsinline
                muted
            ></video>

            <div class="video-overlay">

                <div class="video-info">

                    <div class="creator">

                        <img
                            src="https://i.pravatar.cc/100?img=12"
                            alt="You"
                        >

                        <div>

                            <h3>@you</h3>

                            <span>Your video</span>

                        </div>

                        <button
                            class="follow-btn"
                        >
                            Follow
                        </button>

                    </div>

                    <p class="caption">
                        My new video 🎬
                        #fyp #viral
                    </p>

                    <div class="music">

                        <i class="fa-solid fa-music"></i>

                        Original sound - You

                    </div>

                </div>


                <div class="video-actions">

                    <div class="action">

                        <button
                            class="action-btn like-btn"
                        >
                            <i class="fa-solid fa-heart"></i>
                        </button>

                        <span class="like-count">
                            0
                        </span>

                    </div>


                    <div class="action">

                        <button
                            class="action-btn comment-btn"
                        >
                            <i class="fa-solid fa-comment-dots"></i>
                        </button>

                        <span>0</span>

                    </div>


                    <div class="action">

                        <button
                            class="action-btn share-btn"
                        >
                            <i class="fa-solid fa-share"></i>
                        </button>

                        <span>Share</span>

                    </div>


                    <div class="action">

                        <button
                            class="action-btn mute-btn"
                        >
                            <i class="fa-solid fa-volume-xmark"></i>
                        </button>

                    </div>

                </div>

            </div>

        `;


        feed.appendChild(videoCard);


        /*
         * Add functionality to the newly
         * created video.
         */

        setupNewVideo(videoCard);


        uploadModal.classList.remove(
            "show"
        );

        videoUpload.value = "";

        uploadPreview.innerHTML = "";

        selectedVideo = null;

        showToast(
            "Video added to your feed"
        );

    }
);


/* =========================================
   SETUP NEW VIDEO
========================================= */

function setupNewVideo(card) {

    const video =
        card.querySelector(".video");

    videoObserver.observe(video);


    /* Play / pause */

    video.addEventListener(
        "click",
        function() {

            if (this.paused) {

                this.play();

            } else {

                this.pause();

            }

        }
    );


    /* Like */

    const likeButton =
        card.querySelector(".like-btn");

    likeButton.addEventListener(
        "click",
        function() {

            const count =
                card.querySelector(
                    ".like-count"
                );

            let likes =
                parseInt(
                    count.textContent
                );


            if (
                this.classList.contains(
                    "liked"
                )
            ) {

                likes--;

                this.classList.remove(
                    "liked"
                );

            } else {

                likes++;

                this.classList.add(
                    "liked"
                );

            }


            count.textContent =
                Math.max(0, likes);

        }
    );


    /* Follow */

    const followButton =
        card.querySelector(
            ".follow-btn"
        );

    followButton.addEventListener(
        "click",
        function() {

            this.classList.toggle(
                "following"
            );

            this.textContent =
                this.classList.contains(
                    "following"
                ) ?
                "Following" :
                "Follow";

        }
    );


    /* Comments */

    const commentButton =
        card.querySelector(
            ".comment-btn"
        );

    commentButton.addEventListener(
        "click",
        () => {

            commentsModal.classList.add(
                "show"
            );

            commentInput.focus();

        }
    );


    /* Mute */

    const muteButton =
        card.querySelector(
            ".mute-btn"
        );

    muteButton.addEventListener(
        "click",
        function() {

            video.muted = !video.muted;

            const icon =
                this.querySelector("i");

            icon.className =
                video.muted ?
                "fa-solid fa-volume-xmark" :
                "fa-solid fa-volume-high";

        }
    );


    /* Share */

    const shareButton =
        card.querySelector(
            ".share-btn"
        );

    shareButton.addEventListener(
        "click",
        async() => {

            try {

                await navigator.clipboard.writeText(
                    window.location.href
                );

                showToast(
                    "Video link copied"
                );

            } catch {

                showToast(
                    "Unable to copy link"
                );

            }

        }
    );

}


/* =========================================
   SEARCH
========================================= */

const searchInput =
    document.getElementById(
        "searchInput"
    );

const searchBtn =
    document.getElementById(
        "searchBtn"
    );


function searchVideos() {

    const search =
        searchInput.value
        .toLowerCase()
        .trim();


    const cards =
        document.querySelectorAll(
            ".video-card"
        );


    if (!search) {

        cards.forEach(card => {

            card.style.display =
                "flex";

        });

        return;
    }


    cards.forEach(card => {

        const text =
            card.textContent
            .toLowerCase();

        if (text.includes(search)) {

            card.style.display =
                "flex";

        } else {

            card.style.display =
                "none";

        }

    });


    showToast(
        `Searching for "${search}"`
    );

}


searchBtn.addEventListener(
    "click",
    searchVideos
);


searchInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            searchVideos();

        }

    }
);


/* =========================================
   KEYBOARD CONTROLS
========================================= */

document.addEventListener(
    "keydown",
    event => {

        /*
         * Escape closes modals
         */

        if (event.key === "Escape") {

            commentsModal.classList.remove(
                "show"
            );

            uploadModal.classList.remove(
                "show"
            );

        }


        /*
         * Space controls currently
         * visible video
         */

        if (
            event.code === "Space" &&
            document.activeElement.tagName !== "INPUT"
        ) {

            event.preventDefault();

            const videos =
                document.querySelectorAll(
                    ".video"
                );

            let currentVideo = null;


            videos.forEach(video => {

                const rect =
                    video.getBoundingClientRect();

                if (
                    rect.top < window.innerHeight / 2 &&
                    rect.bottom > window.innerHeight / 2
                ) {
                    currentVideo = video;
                }

            });


            if (currentVideo) {

                if (currentVideo.paused) {

                    currentVideo.play();

                } else {

                    currentVideo.pause();

                }

            }

        }

    }
);


/* =========================================
   START FIRST VIDEO
========================================= */

window.addEventListener(
    "load",
    () => {

        const firstVideo =
            document.querySelector(
                ".video"
            );

        if (firstVideo) {

            document.addEventListener("click", () => {

                document.querySelectorAll(".video").forEach(video => {
                    video.muted = false;
                });

            }, { once: true });
        }

    }
);
