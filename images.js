// images.js
// This file contains all the HTML and image links for the major image sections of the website.
// You can edit the "src" urls below to your own local images (e.g. "my-photo.jpg") or custom links.

document.addEventListener("DOMContentLoaded", () => {

    const photoStripContainer = document.getElementById("photo-strip-container");
    if (photoStripContainer) {
        photoStripContainer.innerHTML = `
            <div class="strip-track" id="stripTrack">
                <div class="sc"><img src="" alt="Wheels">
                    <div class="sc-cap">Roller Rinks</div>
                </div>
                <div class="sc"><img src="122.jpg" alt="Outdoors">
                    <div class="sc-cap">Summer Spins</div>
                </div>
                <div class="sc"><img src="images/images (2).jpg" alt="Vintage">
                    <div class="sc-cap">Disco Derby</div>
                </div>
                <div class="sc"><img src="images/a-shot-of-a-roller-derby-player-coming-out-of-a-turn-her-body-leaned-low-and-her-skate-wheels-gripping-the-track-photo.jpg" alt="Disco">
                    <div class="sc-cap">Night Sessions</div>
                </div>
                <div class="sc"><img src="images/wisthalercom_19_02_tv-bruneck_ha2_1355_b.webp" alt="Derby">
                    <div class="sc-cap">Derby Team</div>
                </div>
                <div class="sc"><img src="images/rs97281-smi-2372lpr.webp" alt="Inline">
                    <div class="sc-cap">Inline Action</div>
                </div>
                <div class="sc"><img src="images/images.jpg" alt="Action">
                    <div class="sc-cap">Tricks & Fun</div>
                </div>
                <div class="sc"><img src="images/360_F_231422052_cqK6XHTUcvAGck4kqdhQ0rqyHywR3WfV.jpg" alt="Skates">
                    <div class="sc-cap">Gear Rentals</div>
                </div>
                <!-- duplicates for infinite scrolling effect -->
                <div class="sc"><img src="images/istockphoto-2182155064-612x612.webp" alt="Wheels">
                    <div class="sc-cap">Roller Rinks</div>
                </div>
                <div class="sc"><img src="images/images (2).jpg" alt="Outdoors">
                    <div class="sc-cap">Summer Spins</div>
                </div>
                <div class="sc"><img src="images/images (2).jpg" alt="Vintage">
                    <div class="sc-cap">Disco Derby</div>
                </div>
                <div class="sc"><img src="images/a-shot-of-a-roller-derby-player-coming-out-of-a-turn-her-body-leaned-low-and-her-skate-wheels-gripping-the-track-photo.jpg" alt="Disco">
                    <div class="sc-cap">Night Sessions</div>
                </div>
                <div class="sc"><img src="images/wisthalercom_19_02_tv-bruneck_ha2_1355_b.webp" alt="Derby">
                    <div class="sc-cap">Derby Team</div>
                </div>
                <div class="sc"><img src="images/rs97281-smi-2372lpr.webp" alt="Inline">
                    <div class="sc-cap">Inline Action</div>
                </div>
                <div class="sc"><img src="images/images.jpg" alt="Action">
                    <div class="sc-cap">Tricks & Fun</div>
                </div>
                <div class="sc"><img src="images/360_F_231422052_cqK6XHTUcvAGck4kqdhQ0rqyHywR3WfV.jpg" alt="Skates">
                    <div class="sc-cap">Gear Rentals</div>
                </div>
            </div>
        `;

        // Ensure animations fire for newly injected HTML
        if (window.gsap && window.ScrollTrigger) {
            ScrollTrigger.refresh();
        }
    }

    const galleryContainer = document.getElementById("gallery-container");
    if (galleryContainer) {
        galleryContainer.innerHTML = `
                <div class="masonry rv up">
                    <div class="mi tall"><img src="images/media__1776444632159.jpg" alt="">
                        <div class="mi-cap"><span>Our Coaches</span></div>
                    </div>
                    <div class="mi"><img src="images/media__1776444632263.jpg" alt="">
                        <div class="mi-cap"><span>Community</span></div>
                    </div>
                    <div class="mi"><img src="images/media__1776444632295.jpg" alt="">
                        <div class="mi-cap"><span>Expert Team</span></div>
                    </div>
                    <div class="mi wide"><img src="images/media__1776444641427.jpg" alt="">
                        <div class="mi-cap"><span>Champions</span></div>
                    </div>
                    <div class="mi"><img src="images/a-shot-of-a-roller-derby-player-coming-out-of-a-turn-her-body-leaned-low-and-her-skate-wheels-gripping-the-track-photo.jpg" alt="">
                        <div class="mi-cap"><span>Gear Rentals</span></div>
                    </div>
                    <div class="mi"><img src="images/two-children-learn-to-skate-roller-skating-hand-sisters-happy-play-sports-summer-431465581.webp" alt="">
                        <div class="mi-cap"><span>Inline Action</span></div>
                    </div>
                    <div class="mi"><img src="images/istockphoto-1602997636-612x612.jpg" alt="">
                        <div class="mi-cap"><span>Tricks & Fun</span></div>
                    </div>
                    <div class="mi wide"><img src="images/group-of-friends-skating-on-rollerblades-in-bright-afternoon-light-at-a-city-park-photo.jpg" alt="">
                        <div class="mi-cap"><span>Summer Spins</span></div>
                    </div>
                </div>
        `;

        // Ensure animations fire for newly injected HTML
        if (window.gsap && window.ScrollTrigger) {
            ScrollTrigger.refresh();
        }
    }
});

