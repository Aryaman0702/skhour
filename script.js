

        /* ══════════════════════════════════════════════
           INTRO COOL ANIMATION (FAST SKATE)
        ══════════════════════════════════════════════ */
                (function() {
            const overlay = document.getElementById('intro-overlay');
            if (!overlay) return;
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                overlay.style.transition = 'opacity 0.6s ease, visibility 0.6s';
                overlay.classList.add('hidden');
                document.body.style.overflow = '';
            }, 3600);
        })();

        /* ══════════════════════════════════════════════
           CANVAS NETWORK BACKGROUND
        ══════════════════════════════════════════════ */
        (function () {
            const c = document.getElementById('bgc'), ctx = c.getContext('2d');
            let W, H, pts = [], fr = 0;
            const resize = () => { W = c.width = window.innerWidth; H = c.height = window.innerHeight; };
            window.addEventListener('resize', resize); resize();
            for (let i = 0; i < 55; i++)pts.push({
                x: Math.random() * W, y: Math.random() * H,
                vx: (Math.random() - .5) * .42, vy: (Math.random() - .5) * .42,
                r: Math.random() * 2.2 + .8,
                col: Math.random() > .5 ? [15, 76, 219] : [244, 98, 10],
                op: Math.random() * .4 + .1
            });
            const draw = () => {
                ctx.clearRect(0, 0, W, H); fr++;
                for (let i = 0; i < pts.length; i++) {
                    for (let j = i + 1; j < pts.length; j++) {
                        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.sqrt(dx * dx + dy * dy);
                        if (d < 155) {
                            const al = (1 - d / 155) * .09, t = Math.sin(fr * .007 + i * .3) * .5 + .5;
                            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
                            ctx.strokeStyle = `rgba(${Math.round(15 + (244 - 15) * t)},${Math.round(76 + (98 - 76) * t)},${Math.round(219 + (10 - 219) * t)},${al})`;
                            ctx.lineWidth = .65; ctx.stroke();
                        }
                    }
                }
                pts.forEach((p, i) => {
                    const pulse = Math.sin(fr * .022 + i) * .5 + .5;
                    ctx.beginPath(); ctx.arc(p.x, p.y, p.r + pulse * .65, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${p.col[0]},${p.col[1]},${p.col[2]},${p.op * (0.5 + pulse * .5)})`;
                    ctx.fill();
                    p.x += p.vx; p.y += p.vy;
                    if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
                    if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20;
                });
                requestAnimationFrame(draw);
            };
            draw();
        })();

        /* ══════════════════════════════════════════════
           CUSTOM CURSOR
        ══════════════════════════════════════════════ */
        const curEl = document.getElementById('cur'), ringEl = document.getElementById('cur-ring');
        let mx = 0, my = 0, rx = 0, ry = 0;
        document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
        (function loop() {
            curEl.style.left = mx + 'px'; curEl.style.top = my + 'px';
            rx += (mx - rx) * .13; ry += (my - ry) * .13;
            ringEl.style.left = rx + 'px'; ringEl.style.top = ry + 'px';
            requestAnimationFrame(loop);
        })();

        /* ══════════════════════════════════════════════
           CLICK BURST
        ══════════════════════════════════════════════ */
        document.addEventListener('click', e => {
            if (e.target.closest('.modal') || e.target.closest('.chat-win')) return;
            const shapes = ['●', '◆', '★', '▲', '✦', '⬟'];
            const cols = ['#f4620a', '#ff8c38', '#0f4cdb', '#2d6ef5', '#ffb470'];
            for (let i = 0; i < 8; i++) {
                const el = document.createElement('span');
                const ang = (360 / 8) * i + Math.random() * 18 - 9;
                const dist = 35 + Math.random() * 55;
                const dur = 380 + Math.random() * 320;
                el.textContent = shapes[Math.floor(Math.random() * shapes.length)];
                Object.assign(el.style, {
                    position: 'fixed', left: e.clientX + 'px', top: e.clientY + 'px',
                    fontSize: (6 + Math.random() * 12) + 'px', color: cols[Math.floor(Math.random() * cols.length)],
                    pointerEvents: 'none', zIndex: '99999', userSelect: 'none',
                    transform: 'translate(-50%,-50%)', opacity: '1',
                    transition: `transform ${dur}ms cubic-bezier(.15,.85,.35,1),opacity ${dur}ms ease`
                });
                document.body.appendChild(el);
                const rad = ang * Math.PI / 180;
                requestAnimationFrame(() => requestAnimationFrame(() => {
                    el.style.transform = `translate(calc(-50% + ${Math.cos(rad) * dist}px),calc(-50% + ${Math.sin(rad) * dist}px)) scale(0) rotate(${ang}deg)`;
                    el.style.opacity = '0';
                }));
                setTimeout(() => el.remove(), dur + 50);
            }
        });

        /* ══════════════════════════════════════════════
           NAVIGATION SCROLL + SMOOTH SCROLL SKATER
        ══════════════════════════════════════════════ */
        let targetSkaterY = -100;
        let currentSkaterY = -100;
        let targetSwayX = 0;
        let currentSwayX = 0;
        let targetRot = 15;
        let currentRot = 15;

        const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

        window.addEventListener('scroll', () => {
            const sy = window.scrollY;
            // Nav
            document.getElementById('nav').classList.toggle('scrolled', sy > 60);

            // Calculate Skater target values
            const skater = document.getElementById('scroll-skater');
            if (skater) {
                const winH = window.innerHeight;
                const docH = document.documentElement.scrollHeight;
                const maxScroll = Math.max(docH - winH, 1);

                const scrollPct = Math.min(Math.max(sy / maxScroll, 0), 1);

                // Apply an ease-out curve so the skater enters the visible screen much earlier
                const earlyPct = Math.pow(scrollPct, 0.4);

                // Target position and rotation based on early scroll percent
                targetSkaterY = -20 + (earlyPct * (winH + 120));
                targetSwayX = Math.sin(sy * 0.01) * 20;
                targetRot = Math.sin(sy * 0.02) * 15 + 15;
            }
        });

        // Render loop for smooth butter-like animation
        function renderSkater() {
            const skater = document.getElementById('scroll-skater');
            if (skater) {
                currentSkaterY = lerp(currentSkaterY, targetSkaterY, 0.08);
                currentSwayX = lerp(currentSwayX, targetSwayX, 0.08);
                currentRot = lerp(currentRot, targetRot, 0.08);

                skater.style.transform = `translate(${currentSwayX}px, ${currentSkaterY}px)`;
                skater.querySelector('img').style.transform = `rotate(${currentRot}deg)`;
            }
            requestAnimationFrame(renderSkater);
        }
        renderSkater();

        /* MOBILE NAV */
        let mobOpen = false;
        function toggleMob() {
            mobOpen = !mobOpen;
            const nav = document.getElementById('nav');
            if (mobOpen) {
                nav.classList.add('mob-open');
            } else {
                nav.classList.remove('mob-open');
            }
        }
        
        // Close mobile nav when clicking a link
        document.querySelectorAll('#nav-ul .nl').forEach(link => {
            link.addEventListener('click', () => {
                mobOpen = false;
                document.getElementById('nav').classList.remove('mob-open');
            });
        });

        /* ══════════════════════════════════════════════
           PAGE ROUTING
        ══════════════════════════════════════════════ */
        function goPg(id) {
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            const pg = document.getElementById('pg-' + id);
            if (pg) pg.classList.add('active');
            
            // Scroll to top instantly
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;

            // nav highlight
            document.querySelectorAll('nav .nl').forEach(a => {
                a.classList.remove('active');
                const oc = a.getAttribute('onclick') || '';
                if (oc.includes("'" + id + "'")) a.classList.add('active');
            });
            // close mobile nav
            mobOpen = false;
            document.getElementById('nav-ul').style.cssText = '';
            
            // Reset GSAP and refresh
            if (window.ScrollTrigger) {
                ScrollTrigger.refresh(true);
            }
        }

        /* ══════════════════════════════════════════════
           SCROLL REVEAL (GSAP ENGINE)
        ══════════════════════════════════════════════ */
        function initReveal() {
            if (window.ScrollTrigger) ScrollTrigger.refresh();
        }

        /* ══════════════════════════════════════════════
           COUNTER ANIMATION
        ══════════════════════════════════════════════ */
        const statsSection = document.querySelector('.stats-bar');
        if (statsSection) {
            const cntObs = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) {
                    document.querySelectorAll('[data-count]').forEach(el => animCount(el));
                    cntObs.disconnect();
                }
            }, { threshold: 0.15 });
            cntObs.observe(statsSection);
        }

        function animCount(el) {
            const target = parseInt(el.dataset.count), dur = 1200; // Snappier duration
            let start = null;
            el.style.fontVariantNumeric = "tabular-nums";
            let lastVal = -1;

            const step = ts => {
                if (!start) start = ts;
                const p = Math.min((ts - start) / dur, 1);
                const ease = 1 - Math.pow(1 - p, 3); // Cubic ease out instead of quartic so it doesn't drag at the end
                const currentVal = Math.floor(ease * target);

                if (currentVal !== lastVal || p === 1) {
                    let suffix = '';
                    if (target !== 2022 && target !== 3 && target !== 4) suffix = '+';
                    if (target === 2022) suffix = '';

                    el.textContent = currentVal + suffix;
                    lastVal = currentVal;
                }

                if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        }

        /* ══════════════════════════════════════════════
           PARALLAX ON SCROLL (OPTIMIZED)
        ══════════════════════════════════════════════ */
        // Cache heavy DOM queries outside the scroll loop to prevent massive CPU lag
        const orbEls = document.querySelectorAll('.orb');
        const ringEls = document.querySelectorAll('.ring');
        const hstatEls = document.querySelectorAll('.hstat');
        const stTrack = document.getElementById('stripTrack');
        const heroH1 = document.querySelector('.hero h1');
        const heroDesc = document.querySelector('.hero-desc');

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(doParallax);
                ticking = true;
            }
        }, { passive: true }); // passive true drastically improves scroll performance

        function doParallax() {
            if (window.innerWidth < 768) { ticking = false; return; } // Disable heavy parallax on mobile
            const sy = window.scrollY;

            // Hero orbs drift
            orbEls.forEach((o, i) => o.style.transform = `translateY(${sy * (0.06 + i * .025)}px)`);
            // Hero rings rotate a bit with scroll
            ringEls.forEach((r, i) => r.style.transform = `rotate(${sy * (0.015 + i * .008)}deg)`);
            // Hero stat cards subtle float
            hstatEls.forEach((s, i) => s.style.transform = `translateY(${-sy * (0.03 + i * .015)}px)`);

            // Strip speed changes with scroll velocity
            if (stTrack) {
                const speed = Math.max(18, 34 - sy * .006);
                stTrack.style.animationDuration = speed + 's';
            }

            // Subtle scale on hero h1 and desc
            if (heroH1) {
                heroH1.style.transform = `scale(${Math.max(0.8, 1 - sy * .00012)}) translateY(${sy * .04}px)`;
                heroH1.style.opacity = Math.max(0, 1 - sy * .0015);
            }
            if (heroDesc) {
                heroDesc.style.transform = `translateY(${sy * .06}px)`;
                heroDesc.style.opacity = Math.max(0, 1 - sy * .002);
            }

            if (sy > 20) triggerRainingSkates();

            ticking = false;
        }

        /* ══════════════════════════════════════════════
           FALLING SKATES ON FIRST SCROLL
        ══════════════════════════════════════════════ */
        let skatesFell = false;
        function triggerRainingSkates() {
            if (skatesFell || window.innerWidth < 768) return;
            skatesFell = true; // only trigger once
            
            const numSkates = 15;
            for (let i = 0; i < numSkates; i++) {
                const skate = document.createElement('div');
                skate.className = 'falling-skate';
                
                // Distributed mostly from left to right
                const leftPos = (i / numSkates) * 100 + (Math.random() * 5);
                skate.style.left = leftPos + 'vw';
                
                // Randomize sizes
                const size = 60 + Math.random() * 70;
                skate.style.width = size + 'px';
                
                // Randomize rotations
                const startRot = (Math.random() - 0.5) * 60;
                const endRot = startRot + (Math.random() > 0.5 ? 200 : -200);
                skate.style.setProperty('--r-start', startRot + 'deg');
                skate.style.setProperty('--r-end', endRot + 'deg');
                
                // Randomize delay and duration 
                const delay = Math.random() * 1.5;
                const dur = 2.5 + Math.random() * 2.0;
                skate.style.animation = `fallDownSkates ${dur}s ease-in ${delay}s forwards`;
                
                // Image
                const img = document.createElement('img');
                img.src = 'images/ice-ice-skating-quad-skates-roller-skating-roller-rink-shoe-music-logo-png-clipart-removebg-preview.png';
                skate.appendChild(img);
                document.body.appendChild(skate);
                
                // Cleanup after animation finishes
                setTimeout(() => {
                    if (document.body.contains(skate)) skate.remove();
                }, (dur + delay) * 1000 + 500);
            }
        }

        /* ══════════════════════════════════════════════
           FAQ ACCORDION
        ══════════════════════════════════════════════ */
        function faq(el) {
            // Close others
            document.querySelectorAll('.faq-item.open').forEach(f => { if (f !== el) f.classList.remove('open'); });
            el.classList.toggle('open');
        }

        /* ══════════════════════════════════════════════
           MODAL
        ══════════════════════════════════════════════ */
        function openModal() {
            document.getElementById('modalBg').classList.add('open');
            document.body.style.overflow = 'hidden';
        }
        function closeModal() {
            document.getElementById('modalBg').classList.remove('open');
            document.body.style.overflow = '';
        }
        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

        /* ══════════════════════════════════════════════
           FORM SUBMIT
        ══════════════════════════════════════════════ */
        async function sendEmail(data, onSuccess, onError) {
            try {
                const res = await fetch('/api/enquiries', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                if (res.ok) {
                    if (onSuccess) onSuccess({ success: "true" });
                } else {
                    if (onError) onError();
                }
            } catch(e) {
                console.error(e);
                if (onError) onError();
            }
        }

        function fSubmit(prefix) {
            const n = document.getElementById(prefix + '_n')?.value.trim();
            const l = document.getElementById(prefix + '_l')?.value.trim();
            const em = document.getElementById(prefix + '_e')?.value.trim();
            const ph = document.getElementById(prefix + '_ph')?.value.trim();
            const m = document.getElementById(prefix + '_m')?.value.trim();
            let lv = '';
            if (prefix === 'm') lv = document.getElementById('m_lv')?.value;

            if (!n || !l || !em || !ph) { alert('Please fill in all required fields.'); return; }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { alert('Please enter a valid email address.'); return; }
            const btn = document.getElementById(prefix + '_btn');
            const ok = document.getElementById(prefix + '_ok');
            btn.disabled = true; btn.textContent = 'Submitting…';

            sendEmail({ _subject: "New Enquiry: " + n, name: n, email: em, phone: ph, location: l, level: lv, message: m }, () => {
                btn.style.display = 'none';
                ok.style.display = 'block';
                if (prefix === 'm') setTimeout(closeModal, 2200);
            }, (e) => {
                console.log(e);
                window.location.href = `mailto:aryaman070402@gmail.com?subject=New Enquiry from ${n}&body=Name: ${n}%0APhone: ${ph}%0AEmail: ${em}`;
                btn.disabled = false; btn.textContent = 'Submit Registration ';
            });
        }
        function doSub(id) {
            const em = document.getElementById(id)?.value.trim();
            if (!em) { alert('Please enter your email address.'); return; }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { alert('Please enter a valid email.'); return; }

            const btn = document.querySelector(`button[onclick="doSub('${id}')"]`);
            let ogText = 'Submit';
            if (btn) { ogText = btn.textContent; btn.disabled = true; btn.textContent = '...'; }

            sendEmail({ _subject: "New Subscriber", email: em }, () => {
                alert('✦ Subscribed! Welcome to Skating Hour.');
                document.getElementById(id).value = '';
                if (btn) { btn.disabled = false; btn.textContent = ogText; }
            }, () => {
                window.location.href = `mailto:aryaman070402@gmail.com?subject=New Subscriber&body=Email: ${em}`;
                if (btn) { btn.disabled = false; btn.textContent = ogText; }
            });
        }

                /* ══════════════════════════════════════════════
           CHATBOT — AI-style, answers freely
           Greets → asks location once → shows all details
           Answers questions like ChatGPT / Gemini
        ══════════════════════════════════════════════ */
        const REG_URL = 'https://skatinghour.classcard.app/en/course/42792';
        const WA_URL = 'https://wa.me/15483312200';
        const CB = { open: false, started: false };

        function toggleChat() {
            CB.open = !CB.open;
            document.getElementById('chatWin').classList.toggle('open', CB.open);
            document.getElementById('chatBtn').classList.toggle('open', CB.open);
            document.getElementById('chatBadge').style.display = 'none';
            if (CB.open && !CB.started) initChat();
        }

        function initChat() {
            CB.started = true;
            const bar = document.getElementById('connBar'), txt = document.getElementById('connTxt');
            botSay("Welcome to **Skating Hour Experts**!");
            botSay(" **5 coaches are online** — please wait while we connect you...");
            let d = 0;
            const iv = setInterval(() => { d = (d + 1) % 4; txt.textContent = 'Connecting' + '.'.repeat(d + 1); }, 500);
            setTimeout(() => {
                clearInterval(iv);
                bar.style.display = 'none';
                document.getElementById('agentBar').style.display = 'flex';
                setTimeout(() => botSay("You're now connected!"), 300);
                setTimeout(() => {
                    botSay(`I'm **Anurag**, your Skating Consultant.

What city are you looking to enroll in today for our **Summer Roller Skating** sessions?`);
                    showQR(['Brampton', 'Milton', 'Mississauga', 'Oakville', 'Pricing']);
                }, 1000);
            }, 3000);
        }

        function sendMsg() {
            const inp = document.getElementById('chInp');
            const txt = inp.value.trim();
            if (!txt) return;
            inp.value = '';
            clearQR();
            addUser(txt);
            if (!CB.started) return;
            handleMsg(txt);
        }

        const AI_API_KEY = "YOUR_GEMINI_API_KEY";
        let aiHistory = [];

                async function handleMsg(text) {
            if (window.__liveChatMode) {
                if (window.__adminConn && window.__adminConn.open) { window.__adminConn.send(text); }
                else { botSay("⚠ Still connecting..."); }
                return;
            }
            const t = text.trim(), lo = t.toLowerCase();

            if (AI_API_KEY !== "YOUR_GEMINI_API_KEY") {
                showTyping();
                aiHistory.push({ role: "user", parts: [{ text: text }] });
                try {
                    const sysPrompt = `You are Coach Anurag. Goal: Roller Skating (June-August 2026).
- Milton (Sports Centre): Tue 6-7 PM. Spring: Jun 2-30. Summer: Jul 7-Aug 25.
- Mississauga: Burnhamthorpe (Tue 6-7 PM), Valley CC (Thu 6-7 PM).
- Oakville (Glen Abbey): Wed 6-7 PM, Fri 6-7 PM.
- Brampton (TallPine): Wed 5:30/6:30 PM.
- Scarborough (Agincourt): Wed 5:30/6:30 PM.
- Kitchener (Don McLaurin): Thu 6-7 PM.
- Burlington (Appleby/Mountainside): Fri 6-7 PM.
Pricing: Trial $30. [Register](${REG_URL}). FREE gear for 1st class.`;
                    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${AI_API_KEY}`, {
                        method: "POST", headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ systemInstruction: { role: "system", parts: [{ text: sysPrompt }] }, contents: aiHistory })
                    });
                    const data = await res.json();
                    if (data.candidates && data.candidates[0].content) {
                        const reply = data.candidates[0].content.parts[0].text;
                        aiHistory.push({ role: "model", parts: [{ text: reply }] });
                        removeTyping(); botSay(reply); return;
                    }
                } catch (e) { removeTyping(); }
            }

            if (lo.match(/go back to main menu|main menu/)) {
                return typeThen(300, `Main menu:`, () => showQR(['Brampton', 'Milton', 'Mississauga', 'Oakville', 'Scarborough', 'More Cities', 'Pricing']));
            }
            
            if (lo.match(/mississauga/)) {
                return typeThen(400, `**Mississauga Sessions**

**Venue 1:** Burnhamthorpe CC
**Time:** Tue 6:00 PM – 7:00 PM
**Dates:** Spring (Jun 2-30) · Summer (Jul 7-Aug 25)

**Venue 2:** Mississauga Valley CC
**Time:** Thu 6:00 PM – 7:00 PM
**Dates:** Spring (Jun 4-Jul 2) · Summer (Jul 9-Aug 27)

**[Register Now](${REG_URL})**`, () => showQR(['Register', 'Pricing', 'Main Menu']));
            }
            if (lo.match(/milton/)) {
                return typeThen(400, `**Milton — Milton Sports Centre**

**Time:** Tuesday 6:00 PM – 7:00 PM
**Dates:** Spring (Jun 2-30) · Summer (Jul 7-Aug 25)

**[Register Now](${REG_URL})**`, () => showQR(['Register', 'Pricing', 'Main Menu']));
            }
            if (lo.match(/oakville/)) {
                return typeThen(400, `**Oakville — Glen Abbey Community Centre**

**Session 1:** Wed 6:00 PM – 7:00 PM
**Dates:** Jun 10 - Aug 26

**Session 2:** Fri 6:00 PM – 7:00 PM
**Dates:** Jun 5 - Aug 21

**[Register Now](${REG_URL})**`, () => showQR(['Register', 'Pricing', 'Main Menu']));
            }
            if (lo.match(/brampton/)) {
                return typeThen(400, `**Brampton — TallPine School**

**Time:** Wednesday 5:30 PM & 6:30 PM slots
**Dates:** Spring (Jun 10-24) · Summer (Jul 8-Aug 26)

**[Register Now](${REG_URL})**`, () => showQR(['Register', 'Pricing', 'Main Menu']));
            }
            if (lo.match(/scarborough/)) {
                return typeThen(400, `**Scarborough — Agincourt Recreation Centre**

**Time:** Wednesday 5:30 PM & 6:30 PM slots
**Dates:** Spring (Jun 3-24) · Summer (Jul 8-Aug 26)

**[Register Now](${REG_URL})**`, () => showQR(['Register', 'Pricing', 'Main Menu']));
            }
            if (lo.match(/kitchener/)) {
                return typeThen(400, `**Kitchener — Don McLaurin Arena**

**Time:** Thursday 6:00 PM – 7:00 PM
**Dates:** Spring (Jun 11-Jul 2) · Summer (Jul 9-Aug 20)

**[Register Now](${REG_URL})**`, () => showQR(['Register', 'Pricing', 'Main Menu']));
            }
            if (lo.match(/burlington/)) {
                return typeThen(400, `**Burlington — Appleby/Mountainside**

**Time:** Friday 6:00 PM – 7:00 PM
**Dates:** Spring (Jun 12-Jul 3) · Summer (Jul 10-Aug 28)

**[Register Now](${REG_URL})**`, () => showQR(['Register', 'Pricing', 'Main Menu']));
            }
            if (lo.match(/price|pricing|cost/)) {
                return typeThen(400, `**Pricing Overview**

• **Trial Class**: CAD $30 (1st class only)
• **Drop-in**: CAD $40
• **Full Program**: $180 - $240 (6 classes)

**Gear is FREE** for your very first class!`, () => showQR(['Locations', 'Register', 'Main Menu']));
            }

            if (!window.__liveChatMode) {
                window.__liveChatMode = true;
                return typeThen(500, `Connecting you with a live expert...`, () => botSay("Please wait a moment."));
            }
        }

        function typeThen(delay, text, cb) {
            setTimeout(() => {
                showTyping();
                setTimeout(() => { removeTyping(); botSay(text); if (cb) cb(); }, 1000);
            }, delay);
        }

        

        function botSay(text) {
            const m = document.getElementById('chMsgs');
            const d = document.createElement('div');
            d.className = 'cmsg b';
            d.innerHTML = `<div class="cav">A</div><div class="bub">${fmt(text)}</div>`;
            m.appendChild(d); m.scrollTop = m.scrollHeight;
        }

        function addUser(text) {
            const m = document.getElementById('chMsgs');
            const d = document.createElement('div');
            d.className = 'cmsg u';
            d.innerHTML = `<div class="bub">${esc(text)}</div>`;
            m.appendChild(d); m.scrollTop = m.scrollHeight;
        }

        function showTyping() {
            const m = document.getElementById('chMsgs');
            const d = document.createElement('div');
            d.className = 'cmsg b'; d.id = 'typ-ind';
            d.innerHTML = `<div class="cav">A</div><div class="typ-ind"><span></span><span></span><span></span></div>`;
            m.appendChild(d); m.scrollTop = m.scrollHeight;
        }

        function removeTyping() {
            const el = document.getElementById('typ-ind');
            if (el) el.remove();
        }

        function showQR(items) {
            const row = document.getElementById('qrRow');
            row.innerHTML = ''; row.style.display = 'flex';
            items.forEach(label => {
                const b = document.createElement('button');
                b.className = 'qb'; b.textContent = label;
                b.onclick = () => { addUser(label); clearQR(); handleMsg(label); };
                row.appendChild(b);
            });
        }

        function clearQR() {
            const r = document.getElementById('qrRow');
            r.innerHTML = ''; r.style.display = 'none';
        }

        function fmt(t) {
            return t
                .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" style="color:var(--bl);font-weight:600;text-decoration:none;">$1</a>')
                .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid rgba(15,76,219,.1);margin:.5rem 0;">')
                .replace(/\n/g, '<br>');
        }
        function esc(t) { return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
        /* ══════════════════════════════════════════════
           MAGNETIC BUTTONS & 3D CARDS (COOL EFFECTS)
        ══════════════════════════════════════════════ */
        document.querySelectorAll('.btn-fire, .btn-out, .btn-sm, .btn-wh, .btn-loc, .btn-sub, .nav-reg').forEach(btn => {
            btn.addEventListener('mousemove', function (e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                this.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
                this.style.transition = 'transform 0.1s ease-out';
            });
            btn.addEventListener('mouseleave', function () {
                this.style.transform = '';
                this.style.transition = 'transform 0.5s ease-out';
            });
        });

        document.querySelectorAll('.hc, .cc, .lc, .gc, .rc, .fbox').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const cx = rect.width / 2;
                const cy = rect.height / 2;
                const rotateX = ((y - cy) / cy) * -6;
                const rotateY = ((x - cx) / cx) * 6;
                card.style.transform = `perspective(1000px) translateY(-8px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                card.style.transition = 'none';
                card.style.zIndex = '10';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'all .5s ease';
                card.style.zIndex = '1';
            });
        });
    

                                gsap.registerPlugin(ScrollTrigger);

        // Ensure all triggers are calculated correctly after load
        window.addEventListener('load', () => ScrollTrigger.refresh());

        let mm = gsap.matchMedia();

        mm.add({
            isDesktop: "(min-width: 1024px)",
            isTablet: "(min-width: 768px) and (max-width: 1023px)",
            isMobile: "(max-width: 767px)"
        }, (context) => {
            let { isMobile } = context.conditions;

            // 1. Hero Content Reveal
            gsap.from(".hero-center-box > *", {
                y: 30,
                opacity: 0,
                duration: 1.2,
                stagger: 0.2,
                ease: "power3.out",
                delay: 0.5
            });

            // 2. Background Parallax
            gsap.to(".hero-bg video, .hero-bg img, .pg-hero", {
                yPercent: isMobile ? 5 : 12,
                ease: "none",
                scrollTrigger: {
                    trigger: ".hero, .pg-hero",
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });

            // 3. Robust Section Reveal Engine
            // We use a broader selector and trigger on the elements themselves for 100% reliability
            const items = document.querySelectorAll('.rv, .cc, .lc, .rc, .fbox, .ic-col, .sec-title, .sec-eyebrow');
            
            items.forEach((el, i) => {
                gsap.from(el, {
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 95%", // More generous trigger point
                        toggleActions: "play none none reverse"
                    }
                });
            });

            // 4. Subtle Parallax for Floating Orbs
            if (!isMobile) {
                gsap.to(".orb1", { y: -120, x: 50, scrollTrigger: { trigger: "body", scrub: 1.5 } });
                gsap.to(".orb2", { y: 120, x: -50, scrollTrigger: { trigger: "body", scrub: 1.5 } });
                gsap.to(".orb3", { y: 60, scrollTrigger: { trigger: "body", scrub: 2 } });
            }
        });







        /* ══════════════════════════════════════════════
           DYNAMIC SCHEDULE RENDERING
        ══════════════════════════════════════════════ */
                const defaultSchedules = {
            milton: `<div class="ls"><strong>Tue 6-7 PM</strong>Spring: Jun 2-30 · Summer: Jul 7-Aug 25</div>`,
            mississauga: `<div class="ls"><strong>Tue 6-7 PM (Burnhamthorpe)</strong>Jun 2-Aug 25</div>
<div class="ls"><strong>Thu 6-7 PM (Valley CC)</strong>Jun 4-Aug 27</div>`,
            oakville: `<div class="ls"><strong>Wed 6-7 PM</strong>Jun 10-Aug 26</div>
<div class="ls"><strong>Fri 6-7 PM</strong>Jun 5-Aug 21</div>`,
            brampton: `<div class="ls"><strong>Wed 5:30 & 6:30 PM</strong>Jun 10-Aug 26</div>`,
            scarborough: `<div class="ls"><strong>Wed 5:30 & 6:30 PM</strong>Jun 3-Aug 26</div>`,
            kitchener: `<div class="ls"><strong>Thu 6-7 PM</strong>Jun 11-Aug 20</div>`,
            burlington: `<div class="ls"><strong>Fri 6-7 PM</strong>Jun 12-Aug 28</div>`
        };

        async function renderSchedules() {
            try {
                const res = await fetch('/api/schedules');
                if (res.ok) {
                    const classes = await res.json();
                    if (classes && Array.isArray(classes)) {
                        const cities = ['Hamilton', 'Milton', 'Oakville'];
                        cities.forEach(city => {
                            const citySess = document.getElementById(`sess-${city.toLowerCase()}`);
                            const cityVenue = document.getElementById(`venue-${city.toLowerCase()}`);
                            
                            const cityClasses = classes.filter(c => c.location === city);
                            
                            if (citySess) {
                                if (cityClasses.length > 0) {
                                    citySess.innerHTML = cityClasses.map(c => 
                                        `<div class="ls"><strong>${c.sessions} · ${c.timing}</strong>${c.date}</div>`
                                    ).join('\n');
                                    
                                    if (cityVenue && cityClasses[0].venue) {
                                        cityVenue.textContent = cityClasses[0].venue;
                                    }
                                } else {
                                    citySess.innerHTML = '<div class="ls">No sessions currently scheduled.</div>';
                                }
                            }
                        });
                        return;
                    }
                }
            } catch(e) { console.error(e); }

            // Fallback to defaults
            let schedules = defaultSchedules;
            const ham = document.getElementById('sess-hamilton');
            if (ham) ham.innerHTML = schedules.hamilton;
            const mil = document.getElementById('sess-milton');
            if (mil) mil.innerHTML = schedules.milton;
            const oak = document.getElementById('sess-oakville');
            if (oak) oak.innerHTML = schedules.oakville;
        }
        document.addEventListener('DOMContentLoaded', renderSchedules);

        /* ══════════════════════════════════════════════
           BACKGROUND SLIDER JS - Removed for continuous video
        ══════════════════════════════════════════════ */
