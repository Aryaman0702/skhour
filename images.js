// images.js
// This file contains all the HTML and image links for the major image sections of the website.

document.addEventListener("DOMContentLoaded", () => {

    const imagesList = [
        "life-1.jpg",
        "life-4.jpg",
        "gallery-1.jpg",
        "gallery-3.jpg",
        "gallery-5.jpg",
        "WhatsApp Image 2026-04-17 at 21.16.30.jpeg",
        "WhatsApp Image 2026-04-17 at 21.16.31.jpeg"
    ];

    const photoStripContainer = document.getElementById("photo-strip-container");
    if (photoStripContainer) {
        let stripContent = `<div class="strip-track" id="stripTrack">`;
        
        // Add all images
        imagesList.forEach((img, idx) => {
            stripContent += `
                <div class="sc"><img src="life on skates/${img}" alt="Skating ${idx+1}">
                    <div class="sc-cap">SkatingHour Life</div>
                </div>`;
        });
        
        // Duplicate for infinite scroll
        imagesList.forEach((img, idx) => {
            stripContent += `
                <div class="sc"><img src="life on skates/${img}" alt="Skating ${idx+1}">
                    <div class="sc-cap">SkatingHour Life</div>
                </div>`;
        });
        
        stripContent += `</div>`;
        photoStripContainer.innerHTML = stripContent;

        if (window.gsap && window.ScrollTrigger) {
            ScrollTrigger.refresh();
        }
    }

    const galleryContainer = document.getElementById("gallery-container");
    if (galleryContainer) {
        let galleryContent = `<div class="masonry rv up">`;
        
        // Use first 14 images for gallery (previous 12 + new 2)
        const galleryImages = imagesList.slice(0, 14);
        
        galleryImages.forEach((img, idx) => {
            let extraClass = "";
            // Make the first two (new) photos tall as requested
            if (img === "life-1.jpg" || img === "life-4.jpg") extraClass = "tall";
            else if (idx === 3) extraClass = "wide";
            
            galleryContent += `
                <div class="mi ${extraClass}"><img src="life on skates/${img}" alt="Gallery ${idx+1}">
                    <div class="mi-cap"><span>Skating Experience</span></div>
                </div>`;
        });
        
        galleryContent += `</div>`;
        galleryContainer.innerHTML = galleryContent;

        if (window.gsap && window.ScrollTrigger) {
            ScrollTrigger.refresh();
        }
    }
});
