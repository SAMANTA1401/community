import subprocess

result = subprocess.run(
            ["pix2tex", "cal.png"],
            capture_output=True,
            text=True,
            timeout=60  # increased timeout
        )

