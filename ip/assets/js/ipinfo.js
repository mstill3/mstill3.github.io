// Display location
function showLocationHtmlElement(data) {
    // add text div before date time div
    const target = document.querySelector('#info');

    if (target) {
        const div = document.createElement('div');
        div.className = 'flex mt-4 w-full justify-end';
        div.style.color = '#d4d4d4';
        div.style.fontSize = '14px';
        div.style.textAlign = 'right';
        div.style.lineHeight = '1.6';

        const rows = [
            ['IP Address', data.ip],
            ['ISP', data.isp],
            ['City', data.city],
            ['Region', data.region],
            ['Country', data.country],
            ['Coordinates', `${data.latitude}, ${data.longitude}`],
        ];

        rows.forEach(([key, value]) => {
            const row = document.createElement('div');
            row.textContent = `${key}: ${value}`;
            div.appendChild(row);
        });

        target.parentNode.insertBefore(div, target);
    }
}

async function displayPublicIP() {
    try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        showLocationHtmlElement(data);
    } catch (err) {
        console.error("Failed to fetch public IP info:", err);
    }
}

displayPublicIP();
