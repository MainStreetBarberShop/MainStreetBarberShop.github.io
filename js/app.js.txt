"use strict"; // Enables strict mode for better debugging and scope management

// Global variables
let imagePageCount = 5;
let currentPage = 1;
let totalPages;
let galleryEntries = [];

const prevBtn = document.querySelector("#prevButton");
const nextBtn = document.querySelector("#nextButton");


// Initialization functions
function initializeApp() {
    console.log("App initialized!");

    console.log(`artworkData.length: ${artworkData[0].entries.length}`);
    console.log("artworkData:", artworkData);

    $(document).foundation(); // Initialize Foundation 
}

function initArtGallery() {
    getArtworkData(1)
    getPageController(currentPage);
    renderPage(1);
};


// Helper functions
function getArtworkData(pageNumber) {   
    console.log("Art Gallery initialized!");

    galleryEntries = artworkData[0].entries;
    totalPages = Math.ceil(galleryEntries.length / imagePageCount);

    const startIndex = (currentPage - 1) * imagePageCount;
    const endIndex = startIndex + imagePageCount;

    console.log(`Total Pages: ${totalPages}`);
    
    return galleryEntries.slice(startIndex, endIndex);
}


function getPageController(pageNumber) {
    pageNumber = parseInt(pageNumber);

    if (isNaN(pageNumber) || pageNumber < 1) {
        alert("No Page Number Defined");
        return []; // Return empty array to prevent further errors
    }

    // Wrap page number to keep cycling
    if (pageNumber < 1) pageNumber = totalPages;
    if (pageNumber > totalPages) pageNumber = 1;

    currentPage = pageNumber; // Set global state
    const startIndex = (currentPage - 1) * imagePageCount;
    const endIndex = startIndex + imagePageCount;

    console.log(`Displaying page: ${currentPage}`);
    console.log(`Start Index: ${startIndex}`);
    console.log(`End Index: ${endIndex}`);
};

function renderPage(pageNumber) {
    const pageData = getArtworkData(pageNumber);
    const pageContainer = document.getElementById("artGalleryPage");
    const pageIndicator = document.getElementById("pageIndicator");
    const artGallery = document.createElement("div");
    artGallery.classList.add("artGallery"); // Ensure correct styling

    pageContainer.innerHTML = ""; // Clear previous content

    console.log(`Displaying page ${currentPage}`);
    console.log("pageData:", pageData);

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




    // pageData.forEach(art => {
    //     if (art.entries && art.entries.length > 0) {
    //         art.entries.forEach(entry => {
    //             galleryHTML += `
    //                 <div class="artworkDisplay"> 
    //                     <div class="artworkTitle">${entry.title}</div> 
    //                     <a href="${entry.image_url}" data-lightbox="gallery" data-title="${entry.title}">
    //                     <img src="${entry.image_url}" alt="${entry.title}">
    //                     </a>
    //                     <div class="artworkOverlay">${entry.description}</div>
    //                 </div>`;
    //         });
    //     } else {
    //         console.warn("No entries found for:", art.title);
    //     }
    // });

    artGallery.innerHTML = galleryHTML;
    pageContainer.appendChild(artGallery);


    // Optional: update visible page indicator
    if (pageIndicator) {
        pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
    }
}


// Event listeners
document.addEventListener("DOMContentLoaded", () => {
    initializeApp();
    initArtGallery();

    prevBtn.addEventListener("click", () => {
        currentPage = currentPage > 1 ? currentPage - 1 : totalPages;

        console.log(`Current Page= ${currentPage}`);

        //currentPage--;
        renderPage(currentPage);

        // if (currentPage > 0) {
        //     //getPageData(currentPage);
        //     //renderPage(currentPage);
        // }        
    });

    nextBtn.addEventListener("click", () => {
        currentPage = currentPage < totalPages ? currentPage + 1 : 1;

        console.log(`Current Page= ${currentPage}`);

        //currentPage++;
        renderPage(currentPage);

        // if (currentPage < totalPages) {
        //     //getPageData(currentPage);
        //     //renderPage(currentPage);
        // }
    });

    document.getElementById("pageIndicator").textContent = `Page ${currentPage} of ${totalPages}`;
});


