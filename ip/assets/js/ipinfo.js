// @ts-check

/**
 * @typedef {Object} IpApiLocation
 * @property {string} ip
 * @property {string} network
 * @property {string} version
 * @property {string} city
 * @property {string} region
 * @property {string} region_code
 * @property {string} postal
 * @property {string} country
 * @property {string} country_name
 * @property {string} country_code
 * @property {string} country_code_iso3
 * @property {string} country_capital
 * @property {string} country_tld
 * @property {string} continent_code
 * @property {boolean} in_eu
 * @property {number} latitude
 * @property {number} longitude
 * @property {string} timezone
 * @property {string} utc_offset
 * @property {string} country_calling_code
 * @property {string} currency
 * @property {string} currency_name
 * @property {string} languages
 * @property {number} country_area
 * @property {number} country_population
 * @property {string} asn
 * @property {string} org
 */

/**
 * Displays the location HTML table element
 * @param {IpApiLocation} data 
 */
function showLocationTable(data) {
    const target = document.querySelector('#app');

    if (target && target.parentNode) {
        const table = document.createElement('table');
        table.className = 'location-table';

        const rows = [
            ['IP Address:', data.ip],
            ['ISP:', data.org],
            ['City:', data.city],
            ['Zipcode:', data.postal],
            ['Region:', data.region],
            ['Country:', data.country_code_iso3],
            ['Timezone:', data.timezone],
            ['Network:', data.network],
            ['Version:', data.version],
        ];

        rows.forEach(([key, value]) => {
            const tr = document.createElement('tr');

            const th = document.createElement('th');
            th.textContent = key;

            const td = document.createElement('td');
            td.textContent = value;

            tr.appendChild(th);
            tr.appendChild(td);
            table.appendChild(tr);
        });

        target.parentNode.insertBefore(table, target);
    }
}

async function displayPublicIP() {
    try {
        const res = await fetch('https://ipapi.co/json');
        const data = await res.json();
        showLocationTable(data);
    } catch (err) {
        console.error("Failed to fetch public IP info:", err);
    }
}

displayPublicIP();
