// images.js
// This file contains all the HTML and image links for the major image sections of the website.

document.addEventListener("DOMContentLoaded", () => {

    const imagesList = [
        "life-1.jpg",
        "life-4.jpg",
        "gallery-1.jpg",
        "gallery-2.jpg",
        "gallery-3.jpg",
        "gallery-4.jpg",
        "gallery-5.jpg",
        "IMG_2037.JPG",
        "IMG_2047.JPG",
        "WhatsApp Image 2026-04-29 at 00.24.12.jpeg",
        "WhatsApp Image 2026-04-29 at 00.24.13 (1).jpeg",
        "WhatsApp Image 2026-04-29 at 00.24.13.jpeg"
    ];

    const photoStripContainer = document.getElementById("stripTrack");
    if (photoStripContainer) {
        let stripContent = "";
        
        // Use first 8 images for strip
        const stripImages = imagesList.slice(0, 8);
        
        // Add all images
        stripImages.forEach((img, idx) => {
            stripContent += `
                <div class="sc"><img src="life on skates/${img}" alt="Skating ${idx+1}">
                    <div class="sc-cap">SkatingHour Life</div>
                </div>`;
        });
        
        // Duplicate for infinite scroll
        stripImages.forEach((img, idx) => {
            stripContent += `
                <div class="sc"><img src="life on skates/${img}" alt="Skating ${idx+1}">
                    <div class="sc-cap">SkatingHour Life</div>
                </div>`;
        });
        
        photoStripContainer.innerHTML = stripContent;

        if (window.gsap && window.ScrollTrigger) {
            ScrollTrigger.refresh();
        }
    }

    const galleryContainer = document.getElementById("gallery-container");
    if (galleryContainer) {
        // Define specific sets for the new layout
        const verticalImages = ["IMG_2037.JPG", "IMG_2047.JPG", "life-1.jpg"];
        const horizontalImages = ["gallery-1.jpg", "gallery-2.jpg", "gallery-3.jpg", "gallery-4.jpg"];

        let galleryContent = `<div class="gallery-grid rv up">`;
        
        // Vertical Row (3 photos)
        galleryContent += `<div class="gallery-row-v">`;
        verticalImages.forEach((img, idx) => {
            galleryContent += `
                <div class="mi v-item"><img src="life on skates/${img}" alt="Vertical ${idx+1}">
                    <div class="mi-cap"><span>Skating Experience</span></div>
                </div>`;
        });
        galleryContent += `</div>`;

        // Horizontal Row (4 photos)
        galleryContent += `<div class="gallery-row-h">`;
        horizontalImages.forEach((img, idx) => {
            galleryContent += `
                <div class="mi h-item"><img src="life on skates/${img}" alt="Horizontal ${idx+1}">
                    <div class="mi-cap"><span>Skating Experience</span></div>
                </div>`;
        });
        galleryContent += `</div>`;
        
        galleryContent += `</div>`;
        galleryContainer.innerHTML = galleryContent;

        if (window.gsap && window.ScrollTrigger) {
            ScrollTrigger.refresh();
        }
    }
});
