// js/app.js

/**
 * This is the main application script for the EcoInsight dashboard.
 * It handles all client-side logic, including:
 * - Single-Page Application (SPA) navigation.
 * - Rendering all charts and data tables.
 * - Handling user interactions like date picking and form submissions via modals.
 * - Implementing mock functionality for buttons.
 */
document.addEventListener('DOMContentLoaded', () => {

    //================================================================================
    // ===== CORE APP SETUP & NAVIGATION =====
    //================================================================================

    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    const pageSections = document.querySelectorAll('.page-section');
    const modal = document.getElementById('form-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalFormContent = document.getElementById('modal-form-content');
    const modalForm = document.getElementById('modal-form');

    /**
     * Sets up the SPA navigation.
     * Hides all pages and shows only the one corresponding to the clicked link.
     */
    function initializeNavigation() {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);

                navLinks.forEach(navLink => navLink.classList.remove('active'));
                pageSections.forEach(section => section.classList.remove('active'));

                link.classList.add('active');
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.classList.add('active');
                }
            });
        });
    }

    //================================================================================
    // ===== EVENT LISTENERS & DYNAMIC FEATURES =====
    //================================================================================

    /**
     * Sets up a date picker to randomize data and re-render a specific page.
     * @param {string} pickerId - The ID of the date input element.
     * @param {Array} dataArray - The data array to be updated.
     * @param {Function} renderFunc - The function to call to re-render the page.
     */
    function setupDatePicker(pickerId, dataArray, renderFunc) {
        const datePicker = document.getElementById(pickerId);
        if (datePicker) {
            datePicker.valueAsDate = new Date(); // Set to today's date
            datePicker.addEventListener('change', () => {
                // Randomize data for demonstration purposes
                dataArray.forEach(stat => {
                    if (stat.baseValue) {
                        const randomizationFactor = (Math.random() - 0.5) * 0.2; // +/- 10%
                        stat.value = Math.round(stat.baseValue * (1 + randomizationFactor));
                    }
                });
                renderFunc(); // Re-render the relevant page
            });
        }
    }

    /**
     * Sets up mock functionality for various buttons.
     */
    function setupMockButtons() {
        document.getElementById('export-report-btn')?.addEventListener('click', () => {
            let csvContent = "data:text/csv;charset=utf-8,Timestamp,Category,Description\n";
            recentActivityData.forEach(row => {
                csvContent += `${row.timestamp},${row.category},"${row.description}"\n`;
            });
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "recent_activity_report.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });

        document.getElementById('all-resources-btn')?.addEventListener('click', () => alert("Feature to view all resources is not yet implemented."));
        document.getElementById('all-goals-btn')?.addEventListener('click', () => alert("Feature to view all goals is not yet implemented."));
    }

    //================================================================================
    // ===== GENERIC RENDER FUNCTIONS =====
    //================================================================================

    /**
     * Renders a set of statistics cards into a container.
     * @param {string} containerId - The ID of the container element.
     * @param {Array<Object>} data - The array of stat objects to render.
     */
    function renderStats(containerId, data) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        data.forEach(stat => {
            const trendClass = stat.trend > 0 ? 'positive' : 'negative';
            const arrowIcon = stat.trend > 0 ? 'public/arrowup.svg' : 'public/arrowdown.svg';
            const statCardHTML = `
                <div class="stat-card">
                    <div class="card-header">
                        <h3>${stat.label}</h3>
                        <img src="${stat.icon}" alt="icon">
                    </div>
                    <div class="card-value">${stat.value} <span class="unit">${stat.unit}</span></div>
                    ${stat.trend ? `<div class="card-trend ${trendClass}"><img src="${arrowIcon}" alt="trend"> ${stat.trend}% vs. last period</div>` : ''}
                    ${stat.progress ? `<div class="progress-bar-container-small"><div class="progress-bar" style="width: ${stat.progress}%; background-color: ${stat.color};"></div></div>` : ''}
                </div>`;
            container.innerHTML += statCardHTML;
        });
    }

    /**
     * Renders rows into a table body.
     * @param {string} containerId - The ID of the table body (tbody) element.
     * @param {Array<Object>} data - The array of data objects.
     * @param {Function} renderRowFunc - A function that takes a data item and returns an HTML string for a table row (<tr>).
     */
    function renderTable(containerId, data, renderRowFunc) {
        const tableBody = document.getElementById(containerId);
        if (!tableBody) return;
        tableBody.innerHTML = '';
        data.forEach(item => { tableBody.innerHTML += renderRowFunc(item); });
    }

    //================================================================================
    // ===== CHART RENDERING FUNCTIONS =====
    //================================================================================

    /**
     * Renders a donut chart with a legend.
     * @param {string} containerId - The ID of the container element.
     * @param {Array<Object>} data - The data for the donut chart segments.
     */
    function renderDonutChart(containerId, data) {
        const container = document.getElementById(containerId);
        if (!container) return;
        let gradient = 'conic-gradient(',
            legendHTML = '<div class="donut-legend">',
            currentPercentage = 0;
        data.forEach(item => {
            gradient += `${item.color} ${currentPercentage}% ${currentPercentage + item.value}%, `;
            legendHTML += `<div class="legend-item"><span class="legend-dot" style="background-color:${item.color};"></span>${item.label}: ${item.value}%</div>`;
            currentPercentage += item.value;
        });
        gradient = gradient.slice(0, -2) + ')';
        container.innerHTML = `<div class="donut-chart" style="background: ${gradient};"></div>${legendHTML}`;
    }

    /**
     * Renders a multi-series bar chart using SVG.
     * @param {string} containerId - The ID of the SVG element.
     * @param {Object} data - The data object for the bar chart.
     */
    function renderBarChartSVG(containerId, data) {
        const svg = document.getElementById(containerId);
        if (!svg) return;
        svg.innerHTML = '';
        const { series, labels, yAxisMax, targetLineValues } = data;
        const width = svg.parentElement.clientWidth || 300, height = 280;
        const padding = { top: 20, right: 20, bottom: 30, left: 40 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

        // Y-Axis labels
        for (let i = 0; i <= 4; i++) {
            const y = padding.top + (i * chartHeight / 4);
            const value = yAxisMax * (1 - i / 4);
            svg.innerHTML += `<text x="${padding.left - 5}" y="${y + 4}" class="axis-label">${value}</text>`;
        }

        const barGroupWidth = chartWidth / labels.length;
        const barWidth = barGroupWidth / (series.length + 1);

        // Bars and X-Axis labels
        labels.forEach((label, i) => {
            const x = padding.left + i * barGroupWidth;
            svg.innerHTML += `<text x="${x + barGroupWidth / 2}" y="${height - padding.bottom + 15}" class="axis-label">${label}</text>`;
            series.forEach((s, j) => {
                const barHeight = (s.values[i] / yAxisMax) * chartHeight;
                const barX = x + (barGroupWidth / 2) - (barWidth * series.length / 2) + (j * barWidth);
                svg.innerHTML += `<rect x="${barX}" y="${height - padding.bottom - barHeight}" width="${barWidth}" height="${barHeight}" fill="${s.color}" class="bar"></rect>`;
            });
        });

        // Target Line
        if (targetLineValues) {
            let points = "";
            targetLineValues.forEach((val, i) => {
                const x = padding.left + i * barGroupWidth + barGroupWidth / 2;
                const y = height - padding.bottom - (val / yAxisMax) * chartHeight;
                points += `${x},${y} `;
            });
            svg.innerHTML += `<polyline points="${points}" class="target-line-svg"></polyline>`;
        }

        // Chart Legend
        const legendContainer = document.getElementById(containerId + '-legend');
        if (legendContainer) {
            let legendHTML = '';
            series.forEach(s => { legendHTML += `<div class="legend-item"><span class="legend-dot" style="background-color:${s.color};"></span>${s.name}</div>`; });
            if (targetLineValues) { legendHTML += `<div class="legend-item"><span class="legend-dot target"></span>Target</div>`; }
            legendContainer.innerHTML = legendHTML;
        }
    }

    /**
     * Renders a multi-series line chart using SVG.
     * @param {string} containerId - The ID of the SVG element.
     * @param {Object} data - The data object for the line chart.
     */
    function renderLineChartSVG(containerId, data) {
        const svg = document.getElementById(containerId);
        if (!svg) return;
        svg.innerHTML = '';
        const { series, labels, yAxisMax } = data;
        const width = svg.parentElement.clientWidth || 300, height = 280;
        const padding = { top: 20, right: 20, bottom: 30, left: 40 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

        // Y-Axis labels
        for (let i = 0; i <= 4; i++) {
            const y = padding.top + (i * chartHeight / 4);
            const value = yAxisMax * (1 - i / 4);
            svg.innerHTML += `<text x="${padding.left - 5}" y="${y + 4}" class="axis-label">${value}</text>`;
        }
        
        // X-Axis labels
        labels.forEach((label, i) => {
             const x = padding.left + (i * chartWidth / (labels.length - 1));
            svg.innerHTML += `<text x="${x}" y="${height - padding.bottom + 15}" class="axis-label">${label}</text>`;
        });

        // Lines
        series.forEach(s => {
            let points = "";
            s.values.forEach((val, i) => {
                const x = padding.left + (i * chartWidth / (labels.length - 1));
                const y = height - padding.bottom - (val / yAxisMax) * chartHeight;
                points += `${x},${y} `;
            });
            svg.innerHTML += `<polyline points="${points}" class="line-chart-svg" style="stroke:${s.color}"></polyline>`;
        });

        // Chart Legend
        const legendContainer = document.getElementById(containerId + '-legend');
        if (legendContainer) {
            let legendHTML = '';
            series.forEach(s => { legendHTML += `<div class="legend-item"><span class="legend-dot" style="background-color:${s.color};"></span>${s.name}</div>`; });
            legendContainer.innerHTML = legendHTML;
        }
    }

    /**
     * Renders an interactive bar chart that allows toggling between data series.
     * @param {string} svgId - The ID of the SVG element.
     * @param {string} controlsId - The ID of the container for the toggle buttons.
     * @param {Object} data - The data object for the chart.
     */
    function renderTogglableResourceChart(svgId, controlsId, data) {
        const svg = document.getElementById(svgId);
        const controls = document.getElementById(controlsId);
        if (!svg || !controls) return;

        controls.innerHTML = '';
        data.series.forEach((series, index) => {
            const btn = document.createElement('button');
            btn.className = 'chart-control-btn';
            btn.textContent = series.name;
            if (index === 0) btn.classList.add('active');
            btn.onclick = () => {
                controls.querySelectorAll('.chart-control-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                drawSingleSeries(series);
            };
            controls.appendChild(btn);
        });

        function drawSingleSeries(series) {
            svg.innerHTML = '';
            const width = svg.parentElement.clientWidth || 300, height = 280;
            const padding = { top: 20, right: 20, bottom: 30, left: 40 };
            const chartWidth = width - padding.left - padding.right;
            const chartHeight = height - padding.top - padding.bottom;
            svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
            const yAxisMax = Math.max(...series.values) * 1.2;

            for (let i = 0; i <= 4; i++) {
                const y = padding.top + (i * chartHeight / 4);
                const value = Math.round(yAxisMax * (1 - i / 4));
                svg.innerHTML += `<text x="${padding.left - 5}" y="${y + 4}" class="axis-label">${value}</text>`;
            }

            const barWidth = (chartWidth / data.labels.length) * 0.6;
            data.labels.forEach((label, i) => {
                const x = padding.left + (i * chartWidth / data.labels.length);
                svg.innerHTML += `<text x="${x + (chartWidth / data.labels.length) / 2}" y="${height - padding.bottom + 15}" class="axis-label">${label}</text>`;
                const barHeight = (series.values[i] / yAxisMax) * chartHeight;
                const barX = x + ((chartWidth / data.labels.length) - barWidth) / 2;
                svg.innerHTML += `<rect x="${barX}" y="${height - padding.bottom - barHeight}" width="${barWidth}" height="${barHeight}" fill="${series.color}" class="bar"></rect>`;
            });
        }
        drawSingleSeries(data.series[0]);
    }

    //================================================================================
    // ===== PAGE-SPECIFIC RENDER LOGIC =====
    //================================================================================

    function renderDashboard() {
        renderStats('dashboard-stats', dashboardStatsData);
        renderTable('recent-activity-table-body', recentActivityData, item => `<tr><td>${item.timestamp}</td><td>${item.category}</td><td>${item.description}</td></tr>`);
        renderBarChartSVG('dashboard-bar-chart-svg', dashboardBarChartData);
        renderDonutChart('dashboard-donut-chart', donutChartData);
    }
    function renderResourceManagement() {
        renderStats('resource-stats', resourceManagementStats);
        renderTogglableResourceChart('resource-bar-chart-svg', 'resource-chart-controls', resourceBarChartData);
    }
    function renderAnalytics() {
        renderStats('analytics-stats', analyticsStats);
        renderTable('waste-sources-table-body', wasteSourcesData, item => `<tr><td>${item.process}</td><td>${item.wasteType}</td><td>${item.amount}kg</td><td>${item.method}</td><td>${item.recyclable}</td></tr>`);
        renderDonutChart('analytics-donut-chart', donutChartData);
        renderLineChartSVG('analytics-line-chart-svg', analyticsLineChartData);
    }
    function renderSustainabilityGoals() {
        renderStats('goals-summary-stats', goalsSummaryData);
        const progressContainer = document.getElementById('goals-progress-cards');
        if(progressContainer) {
            progressContainer.innerHTML = '';
            goalsProgressData.forEach(goal => {
                progressContainer.innerHTML += `<div class="goal-card"><div class="card-header"><h3>${goal.label}</h3><img src="${goal.icon}" alt=""></div><div class="progress-bar-container"><div class="progress-bar" style="width: ${goal.progress}%; background-color: ${goal.color};"><span>${goal.progress}%</span></div></div></div>`;
            });
        }
        const achievementsContainer = document.getElementById('achievements-container');
        if(achievementsContainer) {
            achievementsContainer.innerHTML = '';
            achievementsData.forEach(ach => {
                achievementsContainer.innerHTML += `<div class="achievement-card"><img src="${ach.icon}" class="achievement-card-icon" alt="achievement icon"><h4>${ach.title}</h4><p>${ach.description}</p></div>`;
            });
        }
    }

    //================================================================================
    // ===== MODAL LOGIC =====
    //================================================================================

    function openModal(type) {
        let formHTML = '';
        switch (type) {
            case 'waste':
                modalTitle.textContent = 'Add Waste Entry';
                formHTML = `<div class="form-group"><label for="process-name">Process Name</label><input type="text" id="process-name" required></div><div class="form-group"><label for="waste-type">Waste Type</label><input type="text" id="waste-type" required></div><div class="form-group"><label for="amount">Amount (kg)</label><input type="number" id="amount" required></div><div class="form-group"><label for="recycling-method">Recycling Method</label><input type="text" id="recycling-method" required></div><div class="form-group"><label for="recyclable">Recyclable</label><select id="recyclable" required><option value="Yes">Yes</option><option value="No">No</option></select></div>`;
                break;
            case 'resource':
                modalTitle.textContent = 'Add Resource Log';
                formHTML = `<div class="form-group"><label for="resource-type">Resource Type</label><select id="resource-type"><option>Electricity</option><option>Water</option></select></div><div class="form-group"><label for="resource-usage">Usage</label><input type="number" id="resource-usage" required></div>`;
                break;
            case 'goal':
                modalTitle.textContent = 'Add New Goal';
                formHTML = `<div class="form-group"><label for="goal-name">Goal Name</label><input type="text" id="goal-name" required></div><div class="form-group"><label for="goal-target">Target</label><input type="text" id="goal-target" required></div>`;
                break;
        }
        modalForm.dataset.type = type;
        modalFormContent.innerHTML = formHTML;
        modal.style.display = 'block';
    }

    function setupModal() {
        document.getElementById('add-waste-entry-btn')?.onclick = () => openModal('waste');
        document.getElementById('add-resource-btn')?.onclick = () => openModal('resource');
        document.getElementById('add-goal-btn')?.onclick = () => openModal('goal');

        document.querySelector('.modal-close-btn')?.onclick = () => { modal.style.display = 'none'; };
        document.getElementById('cancel-btn')?.onclick = () => { modal.style.display = 'none'; };
        window.onclick = (event) => { if (event.target == modal) { modal.style.display = "none"; } };

        modalForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            const type = modalForm.dataset.type;
            if (type === 'waste') {
                wasteSourcesData.push({
                    process: document.getElementById('process-name').value, wasteType: document.getElementById('waste-type').value,
                    amount: document.getElementById('amount').value, method: document.getElementById('recycling-method').value,
                    recyclable: document.getElementById('recyclable').value
                });
                renderAnalytics();
            }
            console.log(`New ${type} data submitted.`);
            modal.style.display = 'none';
            modalForm.reset();
        });
    }

    //================================================================================
    // ===== INITIALIZATION =====
    //================================================================================

    function initializeApp() {
        initializeNavigation();
        setupMockButtons();
        setupModal();
        renderDashboard();
        renderResourceManagement();
        renderAnalytics();
        renderSustainabilityGoals();
    }
    
    initializeApp();
});
