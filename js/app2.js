"use strict";

const Starfire = {
    // -------------------------------------------------------------
    // 1. ENGINE STATE & CONFIGURATION (No more loose global variables)
    // -------------------------------------------------------------
    imagePageCount: 5,
    currentPage: 1,
    totalPages: 0,
    galleryEntries: [],
    prevBtn: null,
    nextBtn: null,

    // -------------------------------------------------------------
    // 2. CORE ORCHESTRATOR
    // -------------------------------------------------------------
    init: function() {
        console.log("Starfire Engine v2 Initialized.");
        
        // Safely catch Foundation if it's loaded in the environment
        if (typeof $ !== 'undefined' && $.fn.foundation) {
            $(document).foundation(); 
        }

        // Run the feature guards
        this.bindComponents();
    },

    // -------------------------------------------------------------
    // 3. FEATURE GUARDS (Component Registry)
    // -------------------------------------------------------------
    bindComponents: function() {
        // Look for the specific structural wrappers on the page
        if (document.getElementById("artGalleryPage")) {
            this.initArtGallery();
        }
        if (document.getElementById("carouselContainer")) {
            this.initCarousel();
        }
        if (document.getElementById("guildHomePage")) {
            this.initMasterAudioToggle();
        }
    },


    // Add inside your Starfire object or initialization routine
    initMasterAudioToggle: function() {
        const audioBtn = document.getElementById("sfMasterAudioToggle");
        const video1 = document.getElementById("sfVideoPlayer1");
        const video2 = document.getElementById("sfVideoPlayer2");

        if (!audioBtn || !video1 || !video2) return;

        audioBtn.addEventListener("click", () => {
            // Toggle mute state across BOTH tactical video feeds
            const targetMutedState = !video1.muted;
            
            video1.muted = targetMutedState;
            video2.muted = targetMutedState;

            // Force playback sync
            video1.play().catch(() => {});
            video2.play().catch(() => {});

            audioBtn.textContent = targetMutedState ? "🔊 Unleash Audio" : "🔇 Silence Feeds";
            audioBtn.classList.toggle("activeAudio", !targetMutedState);
        });
    },


    // -------------------------------------------------------------
    // 4. ART GALLERY COMPONENT MODULE
    // -------------------------------------------------------------
    initArtGallery: function() {
        console.log("Art Gallery Component Engaged!");

        // Cache DOM elements directly to the engine instance
        this.prevBtn = document.querySelector("#prevButton");
        this.nextBtn = document.querySelector("#nextButton");

        // Kick off calculations, listeners, and the initial paint
        this.getArtworkData();
        this.setupGalleryEvents();
        this.renderPage();
    },

    getArtworkData: function() {   
        // Safely check if your external data array exists
        if (typeof artworkData !== 'undefined' && artworkData[0]) {
            this.galleryEntries = artworkData[0].entries;
            this.totalPages = Math.ceil(this.galleryEntries.length / this.imagePageCount);
        }

        const startIndex = (this.currentPage - 1) * this.imagePageCount;
        const endIndex = startIndex + this.imagePageCount;

        return this.galleryEntries.slice(startIndex, endIndex);
    },

    renderPage: function() {
        const pageData = this.getArtworkData();
        const pageContainer = document.getElementById("artGalleryPage");
        const pageIndicator = document.getElementById("pageIndicator");
        
        if (!pageContainer) return; // Defensive guard

        pageContainer.innerHTML = ""; 
        const artGallery = document.createElement("div");
        artGallery.classList.add("artGallery"); 

        let galleryHTML = "";

        if (pageData.length === 0) {
            console.warn("No entries found for this page.");
        } else {
            pageData.forEach(entry => {
                galleryHTML += `
                    <div class="artworkDisplay"> 
                        <div class="artworkTitle">${entry.title}</div> 
                        <a href="${entry.image_url}" data-lightbox="gallery" data-title="${entry.title}">
                            <img src="${entry.image_url}" alt="${entry.title}">
                        </a>
                        <div class="artworkOverlay">${entry.description}</div>
                    </div>`;
            });
        }

        artGallery.innerHTML = galleryHTML;
        pageContainer.appendChild(artGallery);

        // Update indicator text dynamically
        if (pageIndicator && this.totalPages) {
            pageIndicator.textContent = `Page ${this.currentPage} of ${this.totalPages}`;
        }
    },

    setupGalleryEvents: function() {
        // CRITICAL: We use Arrow Functions () => here intentionally.
        // It locks the scope of 'this' to Starfire instead of the HTML Button!
        
        if (this.prevBtn) {
            this.prevBtn.addEventListener("click", () => {
                this.currentPage = this.currentPage > 1 ? this.currentPage - 1 : this.totalPages;
                console.log(`Current Page = ${this.currentPage}`);
                this.renderPage();
            });
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener("click", () => {
                this.currentPage = this.currentPage < this.totalPages ? this.currentPage + 1 : 1;
                console.log(`Current Page = ${this.currentPage}`);
                this.renderPage();
            });
        }
    },

    // -------------------------------------------------------------
    // 5. CAROUSEL COMPONENT MODULE
    // -------------------------------------------------------------
    // initCarousel: function() {
    //     console.log("Carousel Component Engaged!");
    //     const track = document.querySelector('.sf-carousel-track');
        
    //     if (typeof carouselVideos !== 'undefined') {
    //         console.log("Carousel data loaded:", carouselVideos);
    //     }
    // }

    // initCarousel: function() {
    //     const nextBtn = document.querySelector(".sfButtonNext");
    //     const backBtn = document.querySelector(".sfButtonBack");
        
    //     // Safety check: Only run if these elements exist on the page
    //     if (!nextBtn || !backBtn) return; 

    //     console.log("Product Carousel initialized.");

    //     nextBtn.addEventListener("click", () => {
    //         // Logic for next item
    //         console.log("Next product slide triggered.");
    //     });

    //     backBtn.addEventListener("click", () => {
    //         // Logic for previous item
    //         console.log("Back product slide triggered.");
    //     });
    // }


    // initCarousel: function() {
    //     const nextBtn = document.querySelector(".sfButtonNext");
    //     const backBtn = document.querySelector(".sfButtonBack");
    //     const videoPlayer = document.getElementById("sfVideoPlayer");
    //     const videoSource = document.getElementById("sfVideoSource");

    //     // Guard: check if all elements and data exist
    //     if (!nextBtn || !backBtn || !videoPlayer || typeof carouselVideos === 'undefined') {
    //         console.warn("Carousel initialization failed: Elements or Data missing.");
    //         return; 
    //     }

    //     let currentIndex = 0;

    //     // The Swap Logic
    //     const loadVideo = (index) => {
    //         const videoData = carouselVideos[index];
    //         videoSource.src = videoData.source;
    //         videoPlayer.load(); // CRITICAL: Tells the browser to reload the source
    //         videoPlayer.play();
    //         console.log(`Now playing: ${videoData.title}`);
    //     };

    //     // Event Mapping
    //     nextBtn.addEventListener("click", () => {
    //         currentIndex = (currentIndex + 1) % carouselVideos.length;
    //         loadVideo(currentIndex);
    //     });

    //     backBtn.addEventListener("click", () => {
    //         currentIndex = (currentIndex - 1 + carouselVideos.length) % carouselVideos.length;
    //         loadVideo(currentIndex);
    //     });

    //     console.log("Product Carousel mapped and functional.");
    // }


    // // Add this as your updated initCarousel method in app2.js
    // initCarousel: function(options = { wrap: false }) {
    //     const nextBtn = document.querySelector(".sfButtonNext");
    //     const backBtn = document.querySelector(".sfButtonBack");
    //     const videoPlayer = document.getElementById("sfVideoPlayer");
    //     const videoSource = document.getElementById("sfVideoSource");

    //     if (!nextBtn || !backBtn || !videoPlayer || typeof carouselVideos === 'undefined') {
    //         console.warn("Carousel initialization failed: Elements or Data missing.");
    //         return; 
    //     }

    //     let currentIndex = 0;

    //     const loadVideo = (index) => {
    //         const videoData = carouselVideos[index];
    //         videoSource.src = videoData.source;
    //         videoPlayer.load();
    //         videoPlayer.play();
    //         console.log(`Now playing: ${videoData.title}`);
    //     };

    //     console.log("Carousel Container dataset wrap value:", container.dataset.wrap);
    //     console.log("Carousel Container raw attribute:", container.getAttribute('data-wrap'))

    //     nextBtn.addEventListener("click", () => {
    //         if (options.wrap) {
    //             // Infinite loop
    //             currentIndex = (currentIndex + 1) % carouselVideos.length;
    //         } else {
    //             // Hard stop at end
    //             currentIndex = Math.min(currentIndex + 1, carouselVideos.length - 1);
    //         }
    //         loadVideo(currentIndex);
    //     });

    //     backBtn.addEventListener("click", () => {
    //         if (options.wrap) {
    //             // Infinite loop
    //             currentIndex = (currentIndex - 1 + carouselVideos.length) % carouselVideos.length;
    //         } else {
    //             // Hard stop at beginning
    //             currentIndex = Math.max(currentIndex - 1, 0);
    //         }
    //         loadVideo(currentIndex);
    //     });

    //     console.log(`Product Carousel initialized. (Wrap: ${options.wrap})`);
    // }


    initCarousel: function() {
        // 1. Define the container first
        const container = document.getElementById("carouselContainer");
        const nextBtn = document.querySelector(".sfButtonNext");
        const backBtn = document.querySelector(".sfButtonBack");
        const videoPlayer = document.getElementById("sfVideoPlayer");
        const videoSource = document.getElementById("sfVideoSource");

        const videoData = carouselVideos[0];
        const titleEl = document.getElementById("sfVideoTitle");
        const descEl = document.getElementById("sfVideoDesc");


        // 2. Guard: ensure container exists before doing anything
        if (!container || !nextBtn || !backBtn || !videoPlayer || typeof carouselVideos === 'undefined') {
            console.warn("Carousel initialization failed: Elements or Data missing.");
            return; 
        }

        // 3. Read the flag
        const wrapOption = container.dataset.wrap === 'true';
        let currentIndex = 0;

        console.log(`Product Carousel initialized. (Wrap: ${wrapOption})`);
        document.getElementById("sfVideoTitle").innerText = videoData.title;
        document.getElementById("sfVideoDesc").innerText = videoData.description;

        // const loadVideo = (index) => {
        //     const videoData = carouselVideos[index];
        //     videoSource.src = videoData.source;
        //     videoPlayer.load();
        //     videoPlayer.play();
        //     console.log(`Now playing: ${videoData.title}`);
        // };

        const loadVideo = (index) => {
            const videoData = carouselVideos[index];
                       
            // Update the Source
            videoSource.src = videoData.source;
            
            // Update the Title (The new binding)
            const titleEl = document.getElementById("sfVideoTitle");
            const descEl = document.getElementById("sfVideoDesc");

            // Update Title
            document.getElementById("sfVideoTitle").innerText = videoData.title;
            document.getElementById("sfVideoDesc").innerText = videoData.description;


            if (titleEl) {
                titleEl.innerText = videoData.title;
            }

            if (descEl) {
                descEl.innerText = videoData.description || ""; // Fallback to empty string
            }

            videoSource.src = videoData.source;
            
            
            videoPlayer.load();
            videoPlayer.play();
            console.log(`Now playing: ${videoData.title}`);
        };


        nextBtn.addEventListener("click", () => {
            if (wrapOption) {
                currentIndex = (currentIndex + 1) % carouselVideos.length;
            } else {
                currentIndex = Math.min(currentIndex + 1, carouselVideos.length - 1);
            }
            loadVideo(currentIndex);
        });

        backBtn.addEventListener("click", () => {
            if (wrapOption) {
                currentIndex = (currentIndex - 1 + carouselVideos.length) % carouselVideos.length;
            } else {
                currentIndex = Math.max(currentIndex - 1, 0);
            }
            loadVideo(currentIndex);
        });
    }
};

// -------------------------------------------------------------
// 6. RUN ENGINE
// -------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    Starfire.init();
});