
            let rScore = 0;
            function boopRobot(e) {
                e.stopPropagation();
                rScore++;
                const bot = document.getElementById('jinniAvatar');
                const scoreLbl = document.getElementById('robotScore');
                const bubble = document.getElementById('jinniBubble');

                bot.style.transform = 'scale(1.4) rotate(' + (Math.random() * 40 - 20) + 'deg)';
                setTimeout(() => { bot.style.transform = ''; }, 150);

                scoreLbl.style.display = 'block';
                scoreLbl.innerText = "⭐ " + rScore;

                const bubbleSpan = document.getElementById('bubbleSpan');

                if (rScore === 1) bubbleSpan.innerText = "Hey! That tickles! 😂";
                else if (rScore === 5) bubbleSpan.innerText = "Keep going! 🔥";
                else if (rScore === 10) { bubbleSpan.innerText = "Level Up! 🏆"; bot.innerText = "😎"; }
                else if (rScore === 20) { bubbleSpan.innerText = "Godlike! 👑"; bot.innerText = "🤩"; }
                else bubbleSpan.innerText = "Combo: x" + rScore;

                let plus = document.createElement('div');
                plus.innerText = "+1";
                plus.style.position = 'fixed';
                plus.style.color = 'var(--or)';
                plus.style.fontWeight = '900';
                plus.style.fontSize = '24px';
                plus.style.textShadow = '0 2px 10px rgba(0,0,0,0.2)';
                plus.style.left = (e.clientX - 10) + 'px';
                plus.style.top = (e.clientY - 20) + 'px';
                plus.style.pointerEvents = 'none';
                plus.style.transition = 'all 0.6s cubic-bezier(0.2, 1, 0.3, 1)';
                plus.style.zIndex = '99999';
                document.body.appendChild(plus);

                setTimeout(() => {
                    plus.style.transform = 'translateY(-60px) scale(1.5)';
                    plus.style.opacity = '0';
                }, 30);
                setTimeout(() => { plus.remove(); }, 650);
            }
        

        /* ══════════════════════════════════════════════
           INTRO COOL ANIMATION (FAST SKATE)
        ══════════════════════════════════════════════ */
        (function() {
            const overlay = document.getElementById('intro-overlay');
            if (!overlay) return;
            // lock scroll temporarily
            document.body.style.overflow = 'hidden';
            
            // Hide after animation finishes
            setTimeout(() => {
                overlay.style.transition = 'opacity 0.4s, visibility 0.4s';
                overlay.classList.add('hidden');
                document.body.style.overflow = ''; // unlock scroll
            }, 4000);
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
            window.scrollTo({ top: 0, behavior: 'smooth' });
            // nav highlight
            document.querySelectorAll('nav .nl').forEach(a => {
                a.classList.remove('active');
                const oc = a.getAttribute('onclick') || '';
                if (oc.includes("'" + id + "'")) a.classList.add('active');
            });
            // close mobile nav
            mobOpen = false;
            document.getElementById('nav-ul').style.cssText = '';
            // kick reveal
            setTimeout(initReveal, 80);
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
            if (skatesFell) return;
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
            const p = document.getElementById(prefix + '_p')?.value.trim();
            const l = document.getElementById(prefix + '_l')?.value.trim();
            const em = document.getElementById(prefix + '_e')?.value.trim();
            const ph = document.getElementById(prefix + '_ph')?.value.trim();
            const m = document.getElementById(prefix + '_m')?.value.trim();
            let lv = '';
            if (prefix === 'm') lv = document.getElementById('m_lv')?.value;

            if (!n || !p || !l || !em || !ph) { alert('Please fill in all required fields.'); return; }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { alert('Please enter a valid email address.'); return; }
            const btn = document.getElementById(prefix + '_btn');
            const ok = document.getElementById(prefix + '_ok');
            btn.disabled = true; btn.textContent = '⛸ Submitting…';

            sendEmail({ _subject: "New Enquiry: " + n, name: n, email: em, phone: ph, participants: p, location: l, level: lv, message: m }, () => {
                btn.style.display = 'none';
                ok.style.display = 'block';
                if (prefix === 'm') setTimeout(closeModal, 2200);
            }, (e) => {
                console.log(e);
                window.location.href = `mailto:aryaman070402@gmail.com?subject=New Enquiry from ${n}&body=Name: ${n}%0APhone: ${ph}%0AEmail: ${em}`;
                btn.disabled = false; btn.textContent = 'Submit Registration ⛸';
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
            var lbl = document.getElementById('chatHelpLabel');
            if (lbl) {
                if (CB.open) {
                    lbl.classList.add('hidden');
                } else {
                    lbl.classList.remove('hidden');
                    lbl.style.animation = 'none';
                    lbl.offsetHeight;
                    lbl.style.animation = 'hlabelIn .6s cubic-bezier(.34,1.56,.64,1) .3s both,hlabelFloat 2.4s ease-in-out 1s infinite';
                }
            }
            if (CB.open && !CB.started) initChat();
        }

        function initChat() {
            CB.started = true;
            const bar = document.getElementById('connBar'), txt = document.getElementById('connTxt');
            botSay('👋 Welcome to **Skating Hour Experts**! We\'re really glad you\'re here.');
            botSay('🔄 **5 coaches are online** — please wait while we connect you with someone...');
            let d = 0;
            const iv = setInterval(() => { d = (d + 1) % 4; txt.textContent = 'Connecting you with an expert' + '.'.repeat(d + 1); }, 500);
            setTimeout(() => {
                clearInterval(iv);
                bar.style.display = 'none';
                document.getElementById('agentBar').style.display = 'flex';
                setTimeout(() => botSay('✅ You\'re now connected!'), 300);
                setTimeout(() => {
                    const h = new Date().getHours();
                    const g = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
                    botSay(`**${g}!** 👋 I\'m **Anurag**, your dedicated Skating Consultant at Skating Hour.\n\nI'm here to help you find the perfect skating program and get registered today. Our classes fill up extremely fast, so let's get you set up!\n\nWhat are you looking to enroll in today: **Roller Skates** or **Ice Skating**?`);
                    showQR(['🛼 Roller Skates', '⛸️ Ice Skating', '📍 Locations', '💰 Pricing', '❓ General info']);
                }, 1500);
            }, 3800);
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

        const AI_API_KEY = "YOUR_GEMINI_API_KEY"; // ⚠️ IMPORTANT: Get your free API key from https://aistudio.google.com/
        let aiHistory = [];

        async function handleMsg(text) {
            if (window.__liveChatMode) {
                if (window.__adminConn && window.__adminConn.open) {
                    window.__adminConn.send(text);
                } else {
                    botSay("⚠️ Still connecting... please wait for the connection to complete.");
                }
                return;
            }
            const t = text.trim(), lo = t.toLowerCase();

            // 🤖 REAL AI CHATBOT LOGIC
            if (AI_API_KEY !== "YOUR_GEMINI_API_KEY") {
                showTyping();
                aiHistory.push({ role: "user", parts: [{ text: text }] });
                try {
                    const sysPrompt = `You are Coach Anurag, a highly professional Skating Consultant and proactive sales expert at Skating Hour. 
Your ultimate goal is to convert the user and convince them to click the registration link TODAY.
Details to know:
- We offer Roller Skating (Derby, Disco, Family) and Ice Skating.
- Locations: Hamilton, Milton, Oakville.
- Pricing: Trial is $30 CAD. Drop-in is $40 CAD. 6-class packages range between $180-$240 CAD.
- All ages welcome (3-55+). Skates and safety gear are provided completely FREE for the first class.
Be extremely polite, consultative, but highly persuasive. Listen to their needs and recommend the best fit. Always include a strong call-to-action to register using [this link](${REG_URL}) or message us on WhatsApp [here](${WA_URL}). Use Markdown for formatting but keep conversations natural and concise.`;

                    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${AI_API_KEY}`, {
                        method: "POST", headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ systemInstruction: { role: "system", parts: [{ text: sysPrompt }] }, contents: aiHistory })
                    });
                    const data = await res.json();
                    if (data.candidates && data.candidates[0].content) {
                        const reply = data.candidates[0].content.parts[0].text;
                        aiHistory.push({ role: "model", parts: [{ text: reply }] });
                        removeTyping();
                        botSay(reply);
                        return;
                    }
                } catch (e) {
                    console.error("AI Chatbot Error: ", e);
                    removeTyping();
                    // Fallback to hardcoded script if AI fails
                }
            }

            /* ─ Roller vs Ice ─ */
            if (lo.match(/roller skate|roller|quad/)) {
                return typeThen(500, `🛼 **Roller Skating Sessions**\n\nOur Roller Skating classes are incredibly popular right now! They are perfect for all ages and skill levels, from Roller Derby Basics to Family Sessions.\n\nSpots are strictly limited, so I highly recommend securing yours now before they sell out.\n\n👉 **[Secure Your Spot - Register Now](${REG_URL})**`, () => showQR(['📍 Locations', '💰 Pricing', '⛸️ Ice Skating instead']));
            }
            if (lo.match(/ice skate|ice skating/)) {
                return typeThen(500, `⛸️ **Ice Skating Lessons**\n\nWe offer Canada's top-rated ice skating programs across 3 premier locations for all skill levels (Beginner to Advanced).\n\nLet's get you registered — which city works best for you?`, () => showQR(['🏙️ Hamilton', '🏘️ Milton', '🏡 Oakville']));
            }

            /* ─ Location detection ─ */
            if (lo.match(/hamilton|dave andre|ancaster|dundas|stoney creek/)) {
                return typeThen(600, `📍 **Hamilton — Dave Andre Arena**\n\n` +
                    `**Saturday Classes**\n🕐 6:30 PM – 7:30 PM\n📅 Mar 21, 28 · Apr 4, 11, 18, 25, 2026\n💰 Try: $30 · Drop-in: **$30** · 6-class package: **$180**\n\n` +
                    `**Sunday Classes — 3 Time Slots**\n🕐 1:00 PM | 2:00 PM | 3:00 PM\n📅 Mar 22, 29 · Apr 5, 12, 19, 26, 2026\n💰 Try: $30 · Drop-in: **$30** · 6-class package: **$180**\n\n` +
                    `👤 All ages welcome · ⏱ 60 min sessions\n✅ Skates & gear provided FREE for first class!\n\n` +
                    `Would you like to enroll in the **full program** or try a **drop-in class** first?\n\n` +
                    `👉 **[Register / Book Now](${REG_URL})**\n💬 **[WhatsApp us](${WA_URL})**`,
                    () => showQR(['🏒 Enroll full program', '🎟️ Try drop-in first', '💰 Pricing', '📅 Full schedule']));
            }

            if (lo.match(/\bmilton\b/)) {
                return typeThen(600, `📍 **Milton — Milton Skating Rink**\n\n` +
                    `**Winter Program — Friday Classes**\n🕐 3:45 AM – 4:35 AM · Every Friday\n📅 Jan 10 – Apr 25, 2026\n💰 Try: **CAD $30** · Drop-in: **$40** · 6-class package: **$240**\n\n` +
                    `👤 All ages welcome · ⏱ 50 min sessions\n✅ Skates & gear provided FREE for first class!\n\n` +
                    `Would you like to register?\n\n` +
                    `👉 **[Register / Book Now](${REG_URL})**\n💬 **[WhatsApp us](${WA_URL})**`,
                    () => showQR(['🏒 Register now', '🎟️ Try drop-in', '💰 Pricing', '📅 All locations']));
            }

            if (lo.match(/oakville|cutting edge/)) {
                return typeThen(600, `📍 **Oakville — Cutting Edge Ice Arena**\n\n` +
                    `**❄️ Winter Program** (Jan 12 – Mar 16, 2026) · Ages 3–55\n🕐 12:30 AM | 1:30 AM | 2:30 AM · Sundays\n💰 Try: $30 · Drop-in: **$40** · Package: **$240**\n\n` +
                    `**🏆 Winter Advanced** (Jan 12 – Mar 16) · Ages 6–40\n🕐 3:30 AM · Sundays · *Coach approval required*\n💰 Try: $40 · Drop-in: **$50** · Package: **$320**\n\n` +
                    `**🌸 Spring Program** (Mar 23 – May 4, 2026)\n🕐 12:30 AM | 1:30 AM | 2:30 AM · Sundays\n💰 Try: $30 · Drop-in: **$40** · Package: **$180**\n\n` +
                    `**🏆 Spring Advanced** (Mar 23 – May 4) · Ages 5–17\n🕐 3:30 AM · Sundays · *Coach approval required*\n💰 Try: $40 · Drop-in: **$50** · Package: **$240**\n\n` +
                    `✅ Skates & gear FREE for first class!\n\n` +
                    `👉 **[Register / Book Now](${REG_URL})**\n💬 **[WhatsApp us](${WA_URL})**`,
                    () => showQR(['🏒 Register now', '🏆 Advanced program', '💰 All pricing', '📅 All locations']));
            }

            /* ─ Register / Enroll / Book ─ */
            if (lo.match(/register|enroll|book|sign up|join|how do i register|where.*register|where.*enroll|where.*book/)) {
                return typeThen(500, `Ready to skate? 🎉 Here's how to register:\n\n` +
                    `First — **which location are you interested in?**\n\n` +
                    `🏙️ **Hamilton** — Dave Andre Arena\n🏘️ **Milton** — Milton Skating Rink\n🏡 **Oakville** — Cutting Edge Arena\n\n` +
                    `Once you pick your location, you can register directly here:\n\n` +
                    `👉 **[Register on ClassCard — skatinghour.classcard.app](${REG_URL})**\n\n` +
                    `Or contact us directly:\n💬 **[WhatsApp: +1 (548) 331-2200](${WA_URL})**\n\nSpots fill up fast — don't wait! ⛸`,
                    () => showQR(['🏙️ Hamilton', '🏘️ Milton', '🏡 Oakville']));
            }

            /* ─ Pricing ─ */
            if (lo.match(/price|cost|fee|how much|pricing|cad|\$|charge|expensive|cheap|money/)) {
                return typeThen(600, `Here's a **complete pricing overview** 💰\n\n` +
                    `🏙️ **Hamilton** — Dave Andre Arena\n• Try (1st class): CAD **$30** · Drop-in: **$30** · 6-class pkg: **$180**\n\n` +
                    `🏘️ **Milton**\n• Try: CAD **$30** · Drop-in: **$40** · 6-class pkg: **$240**\n\n` +
                    `🏡 **Oakville** — Regular Programs\n• Try: CAD **$30** · Drop-in: **$40** · Package: from **$180**\n\n` +
                    `🏆 **Oakville Advanced Programs**\n• Try: CAD **$40** · Drop-in: **$50** · Package: from **$240**\n\n` +
                    `---\n✅ **Drop-in Flexibility:** Try a class first — no commitment! Skates & gear are FREE for your first class. Love it? Enroll in the full program anytime.`,
                    () => showQR(['🏙️ Hamilton details', '🏘️ Milton details', '🏡 Oakville details', '⛸ Register now']));
            }

            /* ─ Schedule ─ */
            if (lo.match(/schedule|when|dates|saturday|sunday|friday|time slot|upcoming|calendar/)) {
                return typeThen(600, `📅 **Class Schedules — All Locations**\n\n` +
                    `🏙️ **Hamilton** (Dave Andre Arena)\n• Sat 6:30–7:30 PM · Mar 21–Apr 25, 2026\n• Sun 1:00 | 2:00 | 3:00 PM · Mar 22–Apr 26, 2026\n\n` +
                    `🏘️ **Milton**\n• Fri 3:45–4:35 AM · Jan 10–Apr 25, 2026\n\n` +
                    `🏡 **Oakville** (Cutting Edge)\n• Winter: Sun 12:30|1:30|2:30|3:30 AM · Jan 12–Mar 16\n• Spring: Sun 12:30|1:30|2:30|3:30 AM · Mar 23–May 4\n\nWant details for a specific location?`,
                    () => showQR(['🏙️ Hamilton', '🏘️ Milton', '🏡 Oakville']));
            }

            /* ─ What to bring / gear ─ */
            if (lo.match(/bring|wear|gear|equipment|skate|helmet|glove|what.*need|what.*wear|prepare/)) {
                return typeThen(550, `Here's exactly what to bring ⛸\n\n` +
                    `**For your first class:**\n✅ Nothing! We provide skates & gear free — just show up!\n\n` +
                    `**For ongoing classes:**\n• 🪖 **CSA approved caged helmet** — mandatory for safety\n• 🧤 **Woolen gloves** — for warmth & safety\n• 👕 Comfortable, warm, flexible clothing\n• 🥛 Water bottle\n\n` +
                    `**Pro tips:**\n• Arrive 15–20 minutes early (skate lacing takes time!)\n• Eat a light meal 1–2 hours before\n• Knee pads & elbow pads are optional but recommended for beginners\n\nCheck our full **Skating Guide** on the website for buying recommendations! 😊`);
            }

            /* ─ Age ─ */
            if (lo.match(/age|how old|too old|kids|children|adult|toddler|year old/)) {
                return typeThen(500, `Any age from **3 to 55+ years** is welcome at Skating Hour! 🏒\n\n` +
                    `• **Ages 3+** — Tots classes, patient coaches, fun environment\n• **Ages 6–17** — Kids & youth programs across all locations\n• **Adults** — Welcome at all programs, it\'s never too late!\n• **Ages 40–55** — Many adults start with us and absolutely love it!\n\n` +
                    `Our coaches assess every skater and place them in the right group — Beginner, Intermediate, or Advanced. No experience needed to start! 😊`);
            }

            /* ─ Advanced program ─ */
            if (lo.match(/advanced|advance|elite|competitive|figure|hockey|power skate|edge control/)) {
                return typeThen(600, `🏆 **Advanced Skater Programs** — Oakville (Cutting Edge)\n\n` +
                    `**Who it's for:**\nSkaters with prior experience and a solid foundation — those ready to push to the next level.\n\n` +
                    `**Focus areas:**\n• Advanced balance & edge control\n• Power skating — strength & endurance drills\n• Speed, turns & transitions\n• Performance readiness & confidence building\n\n` +
                    `**Ideal for:** Figure skating clubs, hockey tryouts, competitive skating goals.\n\n` +
                    `⚠️ *Coach approval required — you\'ll be assessed before joining*\n💰 Try: $40 · Drop-in: $50 · Package from $240\n👤 Ages: 5–40 depending on program\n\n` +
                    `👉 **[Apply / Register](${REG_URL})**`);
            }

            /* ─ Drop-in / trial ─ */
            if (lo.match(/drop.?in|trial|try|first class|one class|single session|no commitment/)) {
                return typeThen(500, `🎟️ **Drop-in / Trial Classes** — perfect way to start!\n\n` +
                    `We give drop-in flexibility so you know exactly what you\'re getting into before committing to a full program.\n\n` +
                    `**How it works:**\n• Try your first class for just **CAD $30**\n• ✅ Skates & gear provided FREE for first class\n• If you love it — enroll in the full 6-class program\n• No pressure, no commitment to start!\n\n` +
                    `**Pricing:**\n• Hamilton: Try $30 · Drop-in $30\n• Milton: Try $30 · Drop-in $40\n• Oakville: Try $30–$40 · Drop-in $40–$50\n\n` +
                    `👉 **[Book a trial class](${REG_URL})**`);
            }

            /* ─ Full enroll ─ */
            if (lo.match(/full.*program|full.*session|full.*package|enroll.*full|6 class/)) {
                return typeThen(500, `🏒 **Full Program Enrollment**\n\n` +
                    `Our full programs run for 6 classes and offer the best value:\n\n` +
                    `• 🏙️ Hamilton: **$180** / 6 classes\n• 🏘️ Milton: **$240** / 6 classes\n• 🏡 Oakville Regular: from **$180**\n• 🏆 Oakville Advanced: from **$240**\n\n` +
                    `You can start with a drop-in or trial class first, then enroll anytime!\n\n` +
                    `👉 **[Register for Full Program](${REG_URL})**\n💬 **[WhatsApp for help](${WA_URL})**`);
            }

            /* ─ Contact ─ */
            if (lo.match(/contact|phone|call|email|reach|whatsapp|number|get in touch/)) {
                return typeThen(400, `You can reach Skating Hour anytime:\n\n` +
                    `📞 **Phone:** +1 (548) 331-2200\n✉️ **Email:** contact@skatinghour.com\n💬 **WhatsApp:** [Chat with us →](${WA_URL})\n🌐 **Website:** [skatinghour.com](https://skatinghour.com)\n\nWe typically respond within a few hours! 😊`);
            }

            /* ─ Locations overview ─ */
            if (lo.match(/location|locations|where.*class|which.*city|cities|all.*location/)) {
                return typeThen(500, `We have classes at **3 locations** across Ontario:\n\n` +
                    `🏙️ **Hamilton** — Dave Andre Arena\n🏘️ **Milton** — Milton Skating Rink\n🏡 **Oakville** — Cutting Edge Ice Arena\n\nWhich one would you like to explore?`,
                    () => showQR(['🏙️ Hamilton', '🏘️ Milton', '🏡 Oakville']));
            }

            /* ─ Coaches / staff ─ */
            if (lo.match(/coach|instructor|teacher|trainer|staff|who teach|expertise/)) {
                return typeThen(500, `Our coaches are the heart of Skating Hour! 🏒\n\n` +
                    `**What makes them special:**\n• Experienced, certified, and passionate about skating\n• Trained to work with all ages — from 3-year-olds to adults\n• Each skater is assessed and placed in the *right* level group\n• Small groups = more individual attention per skater\n• Patient, encouraging, and results-focused\n\n` +
                    `Parents consistently say our coaches are what makes Skating Hour truly special. ⭐\n\nMany kids are gliding confidently by the end of their very first class!`);
            }

            /* ─ About Skating Hour ─ */
            if (lo.match(/who.*you|what.*skating hour|about skating|tell.*about|what.*do you|skatinghour/)) {
                return typeThen(500, `**Skating Hour** — *Unlock Your Potential* 🏒\n\n` +
                    `*"You Book the Time. We Handle the Skating."*\n\n` +
                    `Founded in **2022**, we're Canada's premier ice skating school — offering expert lessons for all skill levels across Ontario.\n\n` +
                    `**What makes us different:**\n• Small, level-based groups (max attention for each skater)\n• Expert coaches who assess & place every skater perfectly\n• Family, beginner, and advanced programs\n• Drop-in flexibility — try before you commit!\n• Gear provided FREE for your first class\n\n` +
                    `📍 3 locations: Hamilton · Milton · Oakville\n🌐 [skatinghour.com](https://skatinghour.com)`);
            }

            /* ─ Casual Chat / Human ─ */
            if (lo.match(/are you human|are you a bot|are you real|who are you|ai/)) {
                return typeThen(500, `Haha, yes I'm a real person! I'm Anurag, one of the coaching team here. 🏒\n\nI handle a lot of the online questions when I'm not on the rink teaching. What can I help you with today? Want to look at a class schedule near you?`,
                    () => showQR(['📍 Locations', '💰 Pricing']));
            }

            if (lo.match(/how are you|how do you do|how r you|how's it going|what's up|whats up|how is it/)) {
                const replies = [
                    `I'm doing awesome, thanks for asking! Just finished up a great coaching session on the ice. ⛸️ How can I help you today?`,
                    `Doing great! It's been a busy day at the rink but I love it here. 🏒 What can I help you find today?`,
                    `I'm doing wonderful, thanks! 😊 Just catching up on messages between classes. How can I help you get started with us?`
                ];
                return typeThen(600, replies[Math.floor(Math.random() * replies.length)], () => showQR(['📍 Locations', '⛸ Register', '💰 Pricing']));
            }

            /* ─ Greetings ─ */
            if (/^(hi+|hello|hey|howdy|hii+|sup|yo|good morning|good afternoon|good evening|greetings)[\s!?.]*$/i.test(lo)) {
                const h = new Date().getHours();
                const g = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';

                const greetings = [
                    `${g}! 👋 Great to hear from you. I'm Anurag, one of the head coaches here.\n\nWhat can I help you with today? Want to check out some classes? 😊`,
                    `Hey there! 👋 I'm coach Anurag. Thanks for reaching out to us at Skating Hour! \n\nAre you looking to join a class, or just looking for some info?`,
                    `Hi! 👋 Anurag here from the coaching team. \n\nI can help you find the right class, check schedules, or sort out pricing. What's on your mind?`
                ];
                return typeThen(350, greetings[Math.floor(Math.random() * greetings.length)],
                    () => showQR(['📍 Locations', '💰 Pricing', '⛸ Register', '❓ More info']));
            }

            /* ─ Weather / Small Talk ─ */
            if (lo.match(/weather|cold|outside|indoor|outdoor/)) {
                return typeThen(500, `Don't worry about the weather, all of our classes are held in high-quality **indoor arenas**! ❄️\n\nIt can still feel a little chilly on the ice though, so we always recommend bringing a sweater and some woolen gloves.\n\nReady to see our locations?`, () => showQR(['📍 See Locations']));
            }

            /* ─ Thank you ─ */
            if (lo.match(/thank|thanks|thx|appreciate|helpful|great help/)) {
                return typeThen(300, `You\'re so welcome! 😊 Happy to help anytime.\n\nIf anything else comes up — questions about classes, scheduling, or anything at all — just drop a message here. See you on the ice soon! ⛸`);
            }

            /* ─ Full enroll / drop-in quick replies ─ */
            if (lo.match(/full.*session|enroll full|full program/)) {
                return typeThen(500, `Excellent choice! 🎉 Here\'s the direct registration link:\n\n👉 **[Register for the Full Program](${REG_URL})**\n\nNeed help choosing the right class or schedule?\n💬 **[WhatsApp us](${WA_URL})**\n\nWe\'re excited to see you on the ice! ⛸`);
            }
            if (lo.match(/drop.?in|trial first|try.*first/)) {
                return typeThen(500, `Great call! 😊 Trying a class first is always a smart move.\n\n✅ **Skates & gear provided FREE for your first class!**\n\nBook your trial here:\n👉 **[Book a Trial Class](${REG_URL})**\n💬 **[WhatsApp us](${WA_URL})**\n\nAfter trying, you can easily enroll in the full program — no pressure! 🏒`);
            }

            /* ─ Fallback to Live Human ─ */
            if (!window.__liveChatMode) {
                window.__liveChatMode = true;
                
                typeThen(600, `Connecting you with a live expert... Please wait a moment.`);
                
                window.__clientPeer = new Peer();
                
                window.__clientPeer.on('open', (id) => {
                    const conn = window.__clientPeer.connect('sh-admin-livechat-aryaman-702', { reliable: true });
                    window.__adminConn = conn;
                    
                    conn.on('open', () => {
                        botSay("✅ Connected to Live Expert. You can type your message now!");
                    });
                    
                    conn.on('data', (data) => {
                        botSay(data);
                    });
                    
                    conn.on('close', () => {
                        botSay("❌ The live expert has disconnected. Returning to automated bot.");
                        window.__liveChatMode = false;
                        window.__adminConn = null;
                    });
                });
                
                window.__clientPeer.on('error', (err) => {
                    botSay("⚠️ Sorry, no experts are online right now. Please leave a message or contact us on WhatsApp!");
                    window.__liveChatMode = false;
                });
                
                return;
            }
        }

        /* ── Chat UI Helpers ── */
        function typeThen(delay, text, cb) {
            setTimeout(() => {
                showTyping();
                const t = Math.min(1500 + text.length * 20, 3800);
                setTimeout(() => { removeTyping(); botSay(text); if (cb) cb(); }, t);
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

        let mm = gsap.matchMedia();

        mm.add({
            isDesktop: "(min-width: 1024px)",
            isTablet: "(min-width: 768px) and (max-width: 1023px)",
            isMobile: "(max-width: 767px)",
            reduceMotion: "(prefers-reduced-motion: reduce)"
        }, (context) => {
            let { isDesktop, isTablet, isMobile, reduceMotion } = context.conditions;

            if (reduceMotion) return; // Respect accessibility settings

            // Device-specific scaling factors for maximum performance
            let scrubHero = isMobile ? 1 : 1.5;
            let scrubRv = isMobile ? 1 : (isTablet ? 1.5 : 2.2);
            let yMult = isDesktop ? 1 : (isTablet ? 0.7 : 0.35);
            let allow3D = isDesktop; // 3D transforms only on powerful desktop GPUs

            // 1. Hero Parallax
            gsap.to(".hero-frame img", {
                yPercent: isMobile ? 10 : 20,
                scale: isMobile ? 1.02 : 1.05,
                ease: "none",
                scrollTrigger: {
                    trigger: ".pg-hero",
                    start: "top top",
                    end: "bottom top",
                    scrub: scrubHero
                }
            });

            // 2. Responsive Immersive Reveal
            document.querySelectorAll('.rv').forEach(el => {
                let startY = 80 * yMult, startX = 0, startRotX = 0, startRotY = 0, startScale = 1, startZ = 0;

                if (el.classList.contains('up')) { startY = 120 * yMult; startScale = isMobile ? 1 : 0.95; startRotX = allow3D ? 10 : 0; }
                else if (el.classList.contains('left')) { startX = -80 * yMult; startRotY = allow3D ? -15 : 0; startY = 0; }
                else if (el.classList.contains('right')) { startX = 80 * yMult; startRotY = allow3D ? 15 : 0; startY = 0; }
                else if (el.classList.contains('scale')) { startScale = isMobile ? 0.9 : 0.8; startY = 60 * yMult; }
                else if (el.classList.contains('flip')) { startZ = allow3D ? -100 : 0; startRotX = allow3D ? -30 : 0; startRotY = allow3D ? 10 : 0; startY = 50 * yMult; }

                gsap.set(el, {
                    y: startY, x: startX, z: startZ,
                    rotationX: startRotX, rotationY: startRotY,
                    scale: startScale, opacity: 0,
                    transformPerspective: allow3D ? 1500 : 0
                });

                gsap.to(el, {
                    y: 0, x: 0, z: 0,
                    rotationX: 0, rotationY: 0,
                    scale: 1, opacity: 1,
                    ease: isMobile ? "power2.out" : "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: isMobile ? "top 95%" : "top 100%", // Less aggressive start on mobile
                        end: isMobile ? "top 60%" : "top 35%",    // Shorter travel distance on mobile
                        scrub: scrubRv
                    }
                });
            });

            // 3. Floating depth card parallax (Disabled on mobile to save battery & prevent weird overlapping)
            if (!isMobile) {
                document.querySelectorAll('.hc, .cc, .lc, .mi').forEach(card => {
                    gsap.to(card, {
                        y: -45 * yMult,
                        rotationZ: allow3D ? 1 : 0,
                        ease: "none",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 100%",
                            end: "bottom 0%",
                            scrub: scrubRv
                        }
                    });
                });
            }
        });

        /* ══════════════════════════════════════════════
           DYNAMIC SCHEDULE RENDERING
        ══════════════════════════════════════════════ */
        const defaultSchedules = {
            hamilton: `<div class="ls"><strong>Saturday · 6:30 PM – 7:30 PM</strong>Mar 21, 28 · Apr 4, 11, 18, 25 · 2026</div>\n<div class="ls"><strong>Sunday · 1:00 PM | 2:00 PM | 3:00 PM</strong>Mar 22, 29 · Apr 5, 12, 19, 26 · 2026</div>`,
            milton: `<div class="ls"><strong>Friday · 3:45 AM – 4:35 AM</strong>Jan 10 – Apr 25, 2026 (every Friday)</div>`,
            oakville: `<div class="ls"><strong>❄️ Winter · Sun 12:30 | 1:30 | 2:30 AM</strong>Jan 12 – Mar 16, 2026 · Ages 3–55</div>\n<div class="ls"><strong>🏆 Advanced · Sun 3:30 AM</strong>Jan 12 – Mar 16 · Ages 6–40 · Approval req.</div>\n<div class="ls"><strong>🌸 Spring · Sun 12:30 | 1:30 | 2:30 AM</strong>Mar 23 – May 4, 2026</div>\n<div class="ls"><strong>🏆 Spring Adv · Sun 3:30 AM</strong>Mar 23 – May 4 · Ages 5–17</div>`
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
