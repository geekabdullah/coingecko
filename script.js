const API_KEY = 'CG-mTH5Sci6MCX3vm6ds2mvDLMz'; // Your CoinGecko API key
const BASE_URL = 'https://api.coingecko.com/api/v3';

// Market stats cards data
async function loadMarketStats() {
    try {
        const response = await fetch(`${BASE_URL}/global`, {
            headers: {
                'X-CG-Api-Key': API_KEY
            }
        });
        const data = await response.json();
        const stats = data.data;

        const marketStatsHTML = `
            <div class="market-stats">
                <h3>Active Cryptocurrencies</h3>
                <p>${stats.active_cryptocurrencies.toLocaleString()}</p>
            </div>
            <div class="market-stats">
                <h3>Total Market Cap</h3>
                <p>$${Math.round(stats.total_market_cap.usd).toLocaleString()}</p>
            </div>
            <div class="market-stats">
                <h3>24h Volume</h3>
                <p>$${Math.round(stats.total_volume.usd).toLocaleString()}</p>
            </div>
            <div class="market-stats">
                <h3>BTC Dominance</h3>
                <p>${stats.market_cap_percentage.btc.toFixed(1)}%</p>
            </div>
        `;

        document.getElementById('marketStats').innerHTML = marketStatsHTML;
    } catch (error) {
        console.error('Error loading market stats:', error);
        document.getElementById('marketStats').innerHTML = `
            <div class="market-stats">
                <h3>Error Loading Data</h3>
                <p>Please check your API key or try again later.</p>
            </div>
        `;
    }
}

// Crypto table data
async function loadCryptoData() {
    try {
        const response = await fetch(
            `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`,
            {
                headers: {
                    'X-CG-Api-Key': API_KEY
                }
            }
        );
        const data = await response.json();

        const tableBody = document.getElementById('cryptoTableBody');
        tableBody.innerHTML = data.map((coin, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>
                    <img src="${coin.image}" alt="${coin.name}" class="coin-image">
                    ${coin.name} (${coin.symbol.toUpperCase()})
                </td>
                <td>$${coin.current_price.toLocaleString()}</td>
                <td class="${coin.price_change_percentage_24h > 0 ? 'positive' : 'negative'}">
                    ${coin.price_change_percentage_24h.toFixed(2)}%
                </td>
                <td>$${coin.market_cap.toLocaleString()}</td>
                <td>$${coin.total_volume.toLocaleString()}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading crypto data:', error);
        document.getElementById('cryptoTableBody').innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center;">
                    Error loading cryptocurrency data. Please check your API key or try again later.
                </td>
            </tr>
        `;
    }
}

// Search functionality
document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#cryptoTableBody tr');

    rows.forEach(row => {
        const coinName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        row.style.display = coinName.includes(searchTerm) ? '' : 'none';
    });
});

// Initial load
loadMarketStats();
loadCryptoData();

// Refresh data every 60 seconds
setInterval(() => {
    loadMarketStats();
    loadCryptoData();
}, 60000);