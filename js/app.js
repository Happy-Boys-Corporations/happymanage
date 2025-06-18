// js/app.js

document.addEventListener('DOMContentLoaded', () => {

    // ===== NAVIGATION LOGIC =====
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    const pageSections = document.querySelectorAll('.page-section');

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

    // ===== DATE PICKER LOGIC =====
    const datePicker = document.getElementById('date-picker');
    if(datePicker) {
        datePicker.valueAsDate = new Date();
        datePicker.addEventListener('change', () => {
            updateDataForDate();
            renderDashboard(); 
        });
    }

    function updateDataForDate() {
        dashboardStatsData.forEach(stat => {
            if (stat.baseValue) {
                const randomizationFactor = (Math.random() - 0.5) * 0.2;
                stat.value = Math.round(stat.baseValue * (1 + randomizationFactor));
            }
        });
    }

    // ===== GENERIC RENDER FUNCTIONS =====
    function renderStats(containerId, data) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        data.forEach(stat => {
            const trendClass = stat.trend > 0 ? 'positive' : 'negative';
            const arrowIcon = stat.trend > 0 ? 'public/arrowup.svg' : 'public/arrowdown.svg';
            const statCardHTML = `<div class="stat-card"><div class="card-header"><h3>${stat.label}</h3><img src="${stat.icon}" alt="icon"></div><div class="card-value">${stat.value} <span class="unit">${stat.unit}</span></div>${stat.trend ? `<div class="card-trend ${trendClass}"><img src="${arrowIcon}" alt="trend"> ${stat.trend}% vs. last period</div>` : ''}${stat.progress ? `<div class="progress-bar-container-small"><div class="progress-bar" style="width: ${stat.progress}%; background-color: ${stat.color};"></div></div>` : ''}</div>`;
            container.innerHTML += statCardHTML;
        });
    }

    function renderTable(containerId, data, renderRowFunc) {
        const tableBody = document.getElementById(containerId);
        if (!tableBody) return;
        tableBody.innerHTML = '';
        data.forEach(item => {
            tableBody.innerHTML += renderRowFunc(item);
        });
    }

    // ===== CHART RENDERING =====
    function renderDonutChart(containerId, data) {
        const container = document.getElementById(containerId);
        if (!container) return;
        let gradient = 'conic-gradient(', legendHTML = '<div class="donut-legend">', currentPercentage = 0;
        data.forEach(item => {
            gradient += `${item.color} ${currentPercentage}% ${currentPercentage + item.value}%, `;
            legendHTML += `<div class="legend-item"><span class="legend-dot" style="background-color:${item.color};"></span>${item.label}: ${item.value}%</div>`;
            currentPercentage += item.value;
        });
        gradient = gradient.slice(0, -2) + ')';
        container.innerHTML = `<div class="donut-chart" style="background: ${gradient};"></div>${legendHTML}`;
    }
    
    function renderBarChartSVG(containerId, data) {
        const svg = document.getElementById(containerId);
        if (!svg) return;
        svg.innerHTML = ''; 
        const seriesCount = data.series.length;
        const width = svg.parentElement.clientWidth || 300, height = 280, padding = { top: 20, right: 20, bottom: 30, left: 40 };
        const chartWidth = width - padding.left - padding.right, chartHeight = height - padding.top - padding.bottom;
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        const barGroupWidth = chartWidth / data.labels.length, barWidth = barGroupWidth / (seriesCount + 1);
        for (let i = 0; i <= 4; i++) {
            const y = padding.top + (i * chartHeight / 4), value = data.yAxisMax * (1 - i / 4);
            svg.innerHTML += `<text x="${padding.left - 5}" y="${y + 4}" class="axis-label">${value}</text>`;
        }
        data.labels.forEach((label, i) => {
            const x = padding.left + i * barGroupWidth;
            svg.innerHTML += `<text x="${x + barGroupWidth / 2}" y="${height - padding.bottom + 15}" class="axis-label">${label}</text>`;
            data.series.forEach((series, j) => {
                const barHeight = (series.values[i] / data.yAxisMax) * chartHeight;
                const barX = x + (barGroupWidth / 2) - (barWidth * seriesCount / 2) + (j * barWidth);
                svg.innerHTML += `<rect x="${barX}" y="${height - padding.bottom - barHeight}" width="${barWidth}" height="${barHeight}" fill="${series.color}" class="bar"></rect>`;
            });
        });
        if (data.targetLineValues) {
            let points = "";
            data.targetLineValues.forEach((val, i) => {
                const x = padding.left + i * barGroupWidth + barGroupWidth / 2, y = height - padding.bottom - (val / data.yAxisMax) * chartHeight;
                points += `${x},${y} `;
            });
            svg.innerHTML += `<polyline points="${points}" class="target-line-svg"></polyline>`;
        }
    }

    function renderLineChartSVG(containerId, data) {
        const svg = document.getElementById(containerId);
        if (!svg) return;
        svg.innerHTML = '';
        const width = svg.parentElement.clientWidth || 300, height = 280, padding = { top: 20, right: 20, bottom: 30, left: 40 };
        const chartWidth = width - padding.left - padding.right, chartHeight = height - padding.top - padding.bottom;
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        for (let i = 0; i <= 4; i++) {
            const y = padding.top + (i * chartHeight / 4), value = data.yAxisMax * (1 - i / 4);
            svg.innerHTML += `<text x="${padding.left - 5}" y="${y + 4}" class="axis-label">${value}</text>`;
        }
        data.labels.forEach((label, i) => {
             const x = padding.left + (i * chartWidth / (data.labels.length - 1));
            svg.innerHTML += `<text x="${x}" y="${height - padding.bottom + 15}" class="axis-label">${label}</text>`;
        });
        data.series.forEach(series => {
            let points = "";
            series.values.forEach((val, i) => {
                 const x = padding.left + (i * chartWidth / (data.labels.length - 1));
                const y = height - padding.bottom - (val / data.yAxisMax) * chartHeight;
                points += `${x},${y} `;
            });
            svg.innerHTML += `<polyline points="${points}" class="line-chart-svg" style="stroke:${series.color}"></polyline>`;
        });
    }

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
            const width = svg.parentElement.clientWidth || 300, height = 280, padding = { top: 20, right: 20, bottom: 30, left: 40 };
            const chartWidth = width - padding.left - padding.right, chartHeight = height - padding.top - padding.bottom;
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

    // ===== PAGE-SPECIFIC RENDER LOGIC =====
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

    // ===== MODAL LOGIC =====
    const modal = document.getElementById('form-modal'), modalTitle = document.getElementById('modal-title'), modalFormContent = document.getElementById('modal-form-content'), modalForm = document.getElementById('modal-form');
    function openModal(type) {
        let formHTML = '';
        if (type === 'waste') {
            modalTitle.textContent = 'Add Waste Entry';
            formHTML = `<div class="form-group"><label for="process-name">Process Name</label><input type="text" id="process-name" required></div><div class="form-group"><label for="waste-type">Waste Type</label><input type="text" id="waste-type" required></div><div class="form-group"><label for="amount">Amount (kg)</label><input type="number" id="amount" required></div><div class="form-group"><label for="recycling-method">Recycling Method</label><input type="text" id="recycling-method" required></div><div class="form-group"><label for="recyclable">Recyclable</label><select id="recyclable" required><option value="Yes">Yes</option><option value="No">No</option></select></div>`;
            modalForm.dataset.type = 'waste';
        } else if (type === 'resource') {
            modalTitle.textContent = 'Add Resource Log';
            formHTML = `<div class="form-group"><label for="resource-type">Resource Type</label><select id="resource-type"><option>Electricity</option><option>Water</option></select></div><div class="form-group"><label for="resource-usage">Usage</label><input type="number" id="resource-usage" required></div>`;
            modalForm.dataset.type = 'resource';
        } else if (type === 'goal') {
            modalTitle.textContent = 'Add New Goal';
            formHTML = `<div class="form-group"><label for="goal-name">Goal Name</label><input type="text" id="goal-name" required></div><div class="form-group"><label for="goal-target">Target</label><input type="text" id="goal-target" required></div>`;
            modalForm.dataset.type = 'goal';
        }
        modalFormContent.innerHTML = formHTML;
        modal.style.display = 'block';
    }

    document.getElementById('add-waste-entry-btn').onclick = () => openModal('waste');
    document.getElementById('add-resource-btn').onclick = () => openModal('resource');
    document.getElementById('add-goal-btn').onclick = () => openModal('goal');

    document.querySelector('.modal-close-btn').onclick = () => { modal.style.display = 'none'; };
    document.getElementById('cancel-btn').onclick = () => { modal.style.display = 'none'; };
    window.onclick = (event) => { if (event.target == modal) { modal.style.display = "none"; } };

    modalForm.addEventListener('submit', (e) => {
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

    // ===== INITIAL PAGE LOAD RENDER =====
    function renderAllPages() {
        renderDashboard();
        renderResourceManagement();
        renderAnalytics();
        renderSustainabilityGoals();
    }
    
    renderAllPages();
});