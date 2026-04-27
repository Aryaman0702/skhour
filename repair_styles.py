
import re

file_path = r'c:\Users\aryam\OneDrive\Desktop\skating hours\styles.css'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to find the corrupted section between .orb2 and .hero h1
# We want to restore everything in between correctly.
pattern = re.compile(r'\.orb2 \{.*?\.hero h1 \{', re.DOTALL)

restored_section = """.orb2 {
            width: 480px;
            height: 480px;
            bottom: -80px;
            left: -60px;
            background: radial-gradient(circle, rgba(244, 98, 10, .05), transparent 68%);
            animation: orbFloat 18s ease-in-out infinite reverse;
        }

        .orb3 {
            width: 300px;
            height: 300px;
            top: 35%;
            left: 38%;
            background: radial-gradient(circle, rgba(15, 76, 219, .04), transparent 68%);
            animation: orbFloat 10s ease-in-out infinite 2s;
        }

        @keyframes orbFloat {
            0%, 100% { transform: scale(1) rotate(0deg) }
            50% { transform: scale(1.15) rotate(12deg) }
        }

        /* ring decorations */
        .ring {
            position: absolute;
            border-radius: 50%;
            border: 1px dashed;
            pointer-events: none;
            animation: spin linear infinite;
        }

        .ring1 {
            width: 440px;
            height: 440px;
            top: 4%;
            right: 0;
            border-color: rgba(15, 76, 219, .06);
            animation-duration: 45s;
        }

        .ring2 {
            width: 290px;
            height: 290px;
            top: 17%;
            right: 9%;
            border-color: rgba(244, 98, 10, .08);
            animation-duration: 28s;
            animation-direction: reverse;
        }

        .ring3 {
            width: 160px;
            height: 160px;
            top: 29%;
            right: 18%;
            border-color: rgba(15, 76, 219, .1);
            animation-duration: 20s;
        }

        @keyframes spin {
            from { transform: rotate(0deg) }
            to { transform: rotate(360deg) }
        }

        .ring-dot {
            position: absolute;
            width: 9px;
            height: 9px;
            border-radius: 50%;
            top: 0;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        .ring1 .ring-dot {
            background: var(--bl);
            box-shadow: 0 0 10px rgba(15, 76, 219, .6);
        }

        .ring2 .ring-dot {
            background: var(--or);
            box-shadow: 0 0 10px rgba(244, 98, 10, .6);
        }

        .ring3 .ring-dot {
            background: var(--bl2);
        }

        .hero-in {
            position: relative;
            z-index: 2;
            max-width: 1320px;
            margin: 0 auto;
            padding: 0 5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
        }

        .hero-center-box {
            text-align: center;
            max-width: 800px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .hero-pill {
            display: inline-flex;
            align-items: center;
            gap: .7rem;
            background: linear-gradient(90deg, var(--bl-lt), var(--or-lt));
            border: 1px solid rgba(15, 76, 219, .14);
            padding: .48rem 1.2rem;
            margin-bottom: 1.8rem;
            font-size: .58rem;
            font-weight: 700;
            letter-spacing: .24em;
            text-transform: uppercase;
            color: var(--bl);
            opacity: 0;
            animation: fadeUp .7s .1s forwards;
        }

        .pill-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: var(--or);
            animation: pulseDot 1.8s infinite;
        }

        @keyframes pulseDot {
            0%, 100% { transform: scale(1); opacity: 1 }
            50% { transform: scale(1.7); opacity: .3 }
        }

        .hero h1 {"""

new_content = pattern.sub(restored_section, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Styles repaired successfully.")
