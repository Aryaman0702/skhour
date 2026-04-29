        // SYNC INTRO WITH VIDEO START
        (function() {
            const overlay = document.getElementById('intro-overlay');
            const v = document.getElementById('bgVideo');
            if (!overlay || !v) return;
            
            document.body.style.overflow = 'hidden';
            
            let hidden = false;
            const hideIntro = () => {
                if (hidden) return;
                hidden = true;
                overlay.style.transition = 'opacity 0.4s ease, visibility 0.4s';
                overlay.classList.add('hidden');
                document.body.style.overflow = '';
            };

            // Hide intro ONLY when video is actually playing to avoid black screen
            v.addEventListener('playing', hideIntro);
            
            // Fallback: If video is slow/blocked, hide after 2.5s anyway
            setTimeout(hideIntro, 2500);

            // Force play as early as possible
            v.muted = true;
            v.play().catch(() => {
                // If autoplay is blocked by browser
                document.addEventListener('click', () => { v.play(); hideIntro(); }, { once: true });
                document.addEventListener('touchstart', () => { v.play(); hideIntro(); }, { once: true });
            });
        })();
 
         /* Ensure Background Video Plays Smoothly */
         window.addEventListener('load', () => {
             const v = document.getElementById('bgVideo');
             if (v) {
                 v.play().catch(() => {
                     // If autoplay is blocked, play on first interaction
                     document.addEventListener('click', () => v.play(), { once: true });
                     document.addEventListener('touchstart', () => v.play(), { once: true });
                 });
             }
         });



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
        /* Burst effect removed */



        /* MOBILE NAV */
        let mobOpen = false;
        function toggleMob() {
            mobOpen = !mobOpen;
            const nav = document.getElementById('nav');
            if (mobOpen) {
                nav.classList.add('mob-open');
                document.body.style.overflow = 'hidden';
            } else {
                nav.classList.remove('mob-open');
                document.body.style.overflow = '';
            }
        }
        
        // Close mobile nav when clicking a link
        document.querySelectorAll('#nav-ul .nl').forEach(link => {
            link.addEventListener('click', () => {
                mobOpen = false;
                document.getElementById('nav').classList.remove('mob-open');
                document.body.style.overflow = '';
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
            
            // Add back button to non-home pages if it doesn't exist
            if (id !== 'home' && pg) {
                if (!pg.querySelector('.pg-back-btn')) {
                    const backBtn = document.createElement('button');
                    backBtn.className = 'pg-back-btn';
                    backBtn.innerHTML = '← Back to Home';
                    backBtn.onclick = () => goPg('home');
                    pg.insertBefore(backBtn, pg.firstChild);
                }
            }
            
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
            const navUl = document.getElementById('nav-ul');
            if (navUl) navUl.style.cssText = '';
            
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
            // Nav
            document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 60);

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



            ticking = false;
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

            sendEmail({ 
                _subject: "New Enquiry: " + n, 
                type: prefix === 'm' ? 'Trial' : 'Enquiry', // Identify trials vs general enquiries
                name: n, 
                email: em, 
                phone: ph, 
                location: l, 
                level: lv, 
                message: m 
            }, () => {
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
                alert('✦ Subscribed! Welcome to SkatingHour.');
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
        const REG_URL = 'https://skatinghour.classcard.app/en/courses';
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
            botSay("Welcome to **SkatingHour Experts**!");
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
                    pushMenu(['Brampton', 'Burlington', 'Hamilton', 'Kitchener', 'Markham', 'Milton', 'Mississauga', 'North York', 'Oakville', 'Scarborough', 'St. Catharines', 'Pricing']);
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
        let chatMenuStack = [];

        function pushMenu(items) {
            chatMenuStack.push(items);
            showQR(items);
        }

        function popMenu() {
            if (chatMenuStack.length > 1) {
                chatMenuStack.pop();
                showQR(chatMenuStack[chatMenuStack.length - 1], true);
            } else {
                handleMsg("Main Menu");
            }
        }

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

            if (lo.includes('main menu') || lo.includes('go back')) {
                chatMenuStack = [];
                return typeThen(300, `Main menu:`, () => pushMenu(['Brampton', 'Burlington', 'Hamilton', 'Kitchener', 'Markham', 'Milton', 'Mississauga', 'North York', 'Oakville', 'Scarborough', 'St. Catharines', 'Pricing']));
            }

            if (lo === 'back' || lo === 'previous menu' || lo.includes('previous menu')) {
                return popMenu();
            }

            if (lo.match(/register/)) {
                return typeThen(300, `You can register for any location directly on our booking portal:`, () => {
                    botSay(`[**Click here to Register**](${REG_URL})`);
                    showQR(['Pricing', 'Main Menu']);
                });
            }
            
            if (lo.match(/mississauga/)) {
                return typeThen(400, `**Mississauga — Burnhamthorpe Community Centre**
**Address:** 1500 Gulleden Dr, Mississauga, ON L4X 2T7

**Time:** Tue 6:00 PM – 7:00 PM
**Dates:** Spring (Jun 2-30) · Summer (Jul 7-Aug 25)

**[Register Now](https://skatinghour.classcard.app/en/course/45875)**`, () => showQR(['Register', 'Pricing', 'Main Menu']));
            }
            if (lo.match(/milton/)) {
                return typeThen(400, `**Milton — Milton Sports Centre**
**Address:** 605 Santa Maria Blvd, Milton, ON L9T 6J5

**Time:** Tuesday 6:00 PM – 7:00 PM
**Dates:** Spring (Jun 2-30) · Summer (Jul 7-Aug 25)

**[Register Now](https://skatinghour.classcard.app/en/course/45876)**`, () => showQR(['Register', 'Pricing', 'Main Menu']));
            }
            if (lo.match(/oakville/)) {
                return typeThen(400, `**Oakville — Glen Abbey Community Centre**
**Address:** 1415 Third Line, Oakville, ON L6M 3G2

**Session 1:** Wed 6:00 PM – 7:00 PM
**Dates:** Jun 10 - Aug 26

**Session 2:** Fri 6:00 PM – 7:00 PM
**Dates:** Jun 5 - Aug 21

**[Register Now](https://skatinghour.classcard.app/en/course/45874)**`, () => showQR(['Register', 'Pricing', 'Main Menu']));
            }
            if (lo.match(/brampton/)) {
                return typeThen(400, `**Brampton — Tall Pines School**
**Address:** 8525 Torbram Rd, Brampton, ON L6T 5K4

**Time:** Wednesday 5:30 PM & 6:30 PM slots
**Dates:** Spring (Jun 10-24) · Summer (Jul 8-Aug 26)

**[Register Now](https://skatinghour.classcard.app/en/course/45878)**`, () => showQR(['Register', 'Pricing', 'Main Menu']));
            }
            if (lo.match(/scarborough/)) {
                return typeThen(400, `**Scarborough — Agincourt Recreation Centre**
**Address:** 31 Glen Watford Dr, Scarborough, ON M1S 2B7

**Time:** Wednesday 5:30 PM & 6:30 PM slots
**Dates:** Spring (Jun 3-24) · Summer (Jul 8-Aug 26)

**[Register Now](https://skatinghour.classcard.app/en/course/45882)**`, () => showQR(['Register', 'Pricing', 'Main Menu']));
            }
            if (lo.match(/kitchener/)) {
                return typeThen(400, `**Kitchener — Don McLaren Arena**
**Address:** 61 Green St, Kitchener, ON N2G 4K9

**Time:** Thursday 6:00 PM – 7:00 PM
**Dates:** Spring (Jun 11-Jul 2) · Summer (Jul 9-Aug 20)

**[Register Now](https://skatinghour.classcard.app/en/course/45877)**`, () => showQR(['Register', 'Pricing', 'Main Menu']));
            }
            if (lo.match(/burlington/)) {
                return typeThen(400, `**Burlington — Appleby Ice Centre / Mountainside RC**
**Address:** 1201 Appleby Line / 2205 Mt Forest Dr

**Time:** Friday 6:00 PM – 7:00 PM
**Dates:** Spring (Jun 12-Jul 3) · Summer (Jul 10-Aug 28)

**[Register Now](https://skatinghour.classcard.app/en/course/45883)**`, () => showQR(['Register', 'Pricing', 'Main Menu']));
            }
            if (lo.match(/hamilton/)) {
                return typeThen(400, `**Hamilton — Rosedale Arena**
**Address:** 100 Greenhill Ave, Hamilton, ON L8K 6M4

**Time:** Tuesday 5-6 PM, 6-7 PM, 7-8 PM
**Dates:** Spring (Jun 9-30) · Summer (Jul 7-Aug 25)

**[Register Now](https://skatinghour.classcard.app/en/course/45879)**`, () => showQR(['Register', 'Pricing', 'Main Menu']));
            }
            if (lo.match(/markham/)) {
                return typeThen(400, `**Markham — R.J. Clatworthy Arena**
**Address:** 2400 John St., Thornhill, ON L3T 6R8

**Time:** Monday 6:00 PM – 7:00 PM
**Dates:** Spring (Jun 1-29) · Summer (Jul 6-Aug 31)

**[Register Now](https://skatinghour.classcard.app/en/course/45880)**`, () => showQR(['Register', 'Pricing', 'Main Menu']));
            }
            if (lo.includes('st. catharines') || lo.includes('catharines')) {
                return typeThen(400, `**St. Catharines — Haig Bowl Arena**
**Address:** 17 Beech St, St. Catharines, ON L2R 2B6

**Time:** Monday 6:00 PM – 7:00 PM
**Dates:** Spring (Jun 8-29) · Summer (Jul 6-Aug 31)

**[Register Now](https://skatinghour.classcard.app/en/course/46161)**`, () => showQR(['Register', 'Pricing', 'Main Menu']));
            }
            if (lo.match(/north york|york/)) {
                return typeThen(400, `**North York — Mitchell Field Community Centre**
**Address:** 89 Church Ave, North York, ON M2N 6C9

**Session 1:** Friday 5:30 PM – 6:30 PM
**Session 2:** Friday 6:30 PM – 7:30 PM
**Dates:** Spring (Jun 5 – Jul 3) · Summer (Jul 10 – Aug 14)

**[Register Now](https://skatinghour.classcard.app/en/courses)**`, () => showQR(['Register', 'Pricing', 'Main Menu', 'Back']));
            }
            if (lo.match(/price|pricing|cost/)) {
                return typeThen(400, `**Pricing Overview**

• **Trial Class**: CAD $30 (1st class only)
• **Drop-in**: CAD $40
• **Full Program**: $180 - $240 (6 classes)

**Gear is FREE** for your very first class!`, () => showQR(['Locations', 'Register', 'Main Menu', 'Back']));
            }

            if (!window.__liveChatMode) {
                window.__liveChatMode = true;
                return typeThen(500, `Connecting you with a live expert...`, () => botSay("Please wait a moment."));
            }
        }

        function typeThen(delay, text, cb) {
            showTyping();
            setTimeout(() => { 
                removeTyping(); 
                botSay(text); 
                if (cb) cb(); 
            }, delay + 600);
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

        function showQR(items, isFromPop = false) {
            const row = document.getElementById('qrRow');
            if (!row) return;
            row.innerHTML = ''; row.style.display = 'flex';
            
            items.forEach(label => {
                const b = document.createElement('button');
                b.className = 'qb'; b.textContent = label;
                b.onclick = () => { addUser(label); clearQR(); handleMsg(label); };
                row.appendChild(b);
            });
            
            if (!items.includes('Back') && !items.includes('Main Menu') && chatMenuStack.length > 1) {
                const bMain = document.createElement('button');
                bMain.className = 'qb main-btn'; bMain.textContent = 'Main Menu';
                bMain.onclick = () => { addUser('Main Menu'); clearQR(); handleMsg('Main Menu'); };
                row.appendChild(bMain);

                const bBack = document.createElement('button');
                bBack.className = 'qb back-btn'; bBack.textContent = '← Back';
                bBack.onclick = () => { addUser('Previous Menu'); clearQR(); popMenu(); };
                row.appendChild(bBack);
            }
            
            const msgs = document.getElementById('chMsgs');
            if (msgs) msgs.scrollTop = msgs.scrollHeight;
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
                y: 20,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
                delay: 0.3
            });

            // 2. Background Parallax (Smoothed)
            gsap.to(".hero-bg video, .hero-bg img, .pg-hero", {
                yPercent: isMobile ? 3 : 8,
                ease: "power1.inOut",
                scrollTrigger: {
                    trigger: ".hero, .pg-hero",
                    start: "top top",
                    end: "bottom top",
                    scrub: 0.5, // Much snappier scrub
                    force3D: true
                }
            });

            // 3. Robust Section Reveal Engine
            // We use a broader selector and trigger on the elements themselves for 100% reliability
            const items = document.querySelectorAll('.rv, .cc, .lc, .rc, .fbox, .ic-col, .sec-title, .sec-eyebrow');
            
            items.forEach((el, i) => {
                gsap.from(el, {
                    y: 20,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 98%", // Trigger almost immediately as it enters viewport
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
            hamilton: `<div class="ls"><strong>Tue 5-6 PM</strong></div><div class="ls"><strong>Tue 6-7 PM</strong></div><div class="ls"><strong>Tue 7-8 PM</strong></div><div class="ls">Spring: Jun 9-30 · Summer: Jul 7-Aug 25</div>`,
            milton: `<div class="ls"><strong>Tue 6-7 PM</strong>Spring: Jun 2-30 · Summer: Jul 7-Aug 25</div>`,
            mississauga: `<div class="ls"><strong>Tue 6-7 PM (Burnhamthorpe)</strong>Spring: Jun 2-30 · Summer: Jul 7-Aug 25</div>
<div class="ls"><strong>Thu 6-7 PM (Valley CC)</strong>Spring: Jun 4-Jul 2 · Summer: Jul 9-Aug 27</div>`,
            oakville: `<div class="ls"><strong>Wed 6-7 PM</strong>Spring: Jun 10-Jul 8 · Summer: Jul 15-Aug 26</div>
<div class="ls"><strong>Fri 6-7 PM</strong>Spring: Jun 5-Jul 3 · Summer: Jul 10-Aug 21</div>`,
            brampton: `<div class="ls"><strong>Wed 5:30 & 6:30 PM</strong>Spring: Jun 17-Jul 15 · Summer: Jul 22-Aug 26</div>`,
            scarborough: `<div class="ls"><strong>Wed 5:30 & 6:30 PM</strong>Spring: Jun 3-24 · Summer: Jul 8-Aug 26</div>`,
            kitchener: `<div class="ls"><strong>Thu 6-7 PM</strong>Spring: Jun 11-Jul 2 · Summer: Jul 9-Aug 20</div>`,
            burlington: `<div class="ls"><strong>Fri 6-7 PM</strong>Spring: Jun 12-Jul 3 · Summer: Jul 10-Aug 28</div>`,
            markham: `<div class="ls"><strong>Mon 6-7 PM</strong>Spring: Jun 1-29 · Summer: Jul 6-Aug 31</div>`,
            st_catharines: `<div class="ls"><strong>Mon 6-7 PM</strong>Spring: Jun 8-29 · Summer: Jul 6-Aug 31</div>`
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

            // Fallback to defaults is handled by static HTML now
            /*
            let schedules = defaultSchedules;
            const ham = document.getElementById('sess-hamilton');
            if (ham) ham.innerHTML = schedules.hamilton;
            const mil = document.getElementById('sess-milton');
            if (mil) mil.innerHTML = schedules.milton;
            const oak = document.getElementById('sess-oakville');
            if (oak) oak.innerHTML = schedules.oakville;
            */
        }
        document.addEventListener('DOMContentLoaded', renderSchedules);


        /* ══════════════════════════════════════════════
           VIDEO STABILITY ENGINE
        ══════════════════════════════════════════════ */
        (function() {
            const v = document.getElementById('bgVideo');
            if (!v) return;

            const forcePlay = () => {
                if (v.paused) {
                    v.play().catch(() => {
                        // If autoplay is blocked, we wait for a user interaction
                        document.addEventListener('click', () => v.play(), { once: true });
                    });
                }
            };

            // Force play on load and visibility change
            window.addEventListener('load', forcePlay);
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible') forcePlay();
            });


            // Prevent pause on low power mode or other triggers
            v.addEventListener('pause', () => {
                setTimeout(forcePlay, 100);
            });

            // Ensure video starts playing as soon as possible
            v.play().catch(e => console.log("Video autoplay blocked, waiting for interaction."));
        })();

function toggleContactMenu() {
    const menu = document.getElementById('contactMenu');
    if (menu) menu.classList.toggle('open');
}

// Close contact menu when clicking outside
        document.addEventListener('click', (e) => {
            const widget = document.querySelector('.contact-widget');
            const menu = document.getElementById('contactMenu');
            if (widget && !widget.contains(e.target) && menu && menu.classList.contains('open')) {
                menu.classList.remove('open');
            }
        });

        /* ══════════════════════════════════════════════
           LOCATION SEARCH FILTER
        ══════════════════════════════════════════════ */
        function filterLocations(shouldScroll = false) {
            const input = document.getElementById('locSearch');
            if (!input) return;
            const query = input.value.toLowerCase().trim();
            const cards = document.querySelectorAll('#pg-location .lc');
            const grid = document.querySelector('#pg-location .loc-grid');
            
            let foundCount = 0;
            let firstFound = null;

            cards.forEach(card => {
                const city = card.querySelector('h3').textContent.toLowerCase();
                const venue = card.querySelector('.venue').textContent.toLowerCase();
                
                if (query === '' || city.includes(query) || venue.includes(query)) {
                    card.style.display = 'flex';
                    card.style.opacity = '1';
                    card.style.transform = 'none';
                    if (!firstFound) firstFound = card;
                    foundCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            // Handle "No Results" message
            let noRes = document.getElementById('no-loc-results');
            if (foundCount === 0) {
                if (!noRes) {
                    noRes = document.createElement('div');
                    noRes.id = 'no-loc-results';
                    noRes.innerHTML = `<div style="text-align:center;padding:4rem;color:var(--tx3);font-family:'Oswald',sans-serif;width:100%;">
                        <div style="font-size:3rem;margin-bottom:1rem;">🔍</div>
                        <h3 style="font-size:1.5rem;margin-bottom:0.5rem;color:var(--dk);">No locations found</h3>
                        <p>Try searching for another city or venue.</p>
                    </div>`;
                    if (grid) grid.parentNode.appendChild(noRes);
                }
                noRes.style.display = 'block';
            } else if (noRes) {
                noRes.style.display = 'none';
            }

            // If we need to scroll (on search click or enter)
            if (shouldScroll && query !== '' && firstFound) {
                setTimeout(() => {
                    firstFound.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Highlight effect
                    firstFound.style.outline = '3px solid var(--or)';
                    firstFound.style.outlineOffset = '5px';
                    firstFound.style.boxShadow = '0 0 30px rgba(244, 98, 10, 0.3)';
                    setTimeout(() => {
                        firstFound.style.outline = 'none';
                        firstFound.style.boxShadow = '';
                    }, 2500);
                }, 100);
            }
            
            if (window.ScrollTrigger) ScrollTrigger.refresh();
        }
