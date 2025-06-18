// js/data.js

const dashboardStatsData = [
    { label: "Resource Efficiency", value: 320, unit: "kWh", trend: -8.5, icon: "public/electric.svg", baseValue: 320 },
    { label: "Water Consumption", value: 20, unit: "m³", trend: -3.2, icon: "public/waterbig.svg", baseValue: 20 },
    { label: "Waste Generated", value: 1200, unit: "kg", trend: 1.2, icon: "public/recycle-sign.png", baseValue: 1200 },
    { label: "Resource Efficiency", value: 85, unit: "%", trend: 4.7, icon: "public/industrial.svg", baseValue: 85 }
];
const resourceManagementStats = [
    { label: "Electricity", value: 8750, unit: "kWh", trend: -8.5, icon: "public/electric.svg" },
    { label: "Water Consumption", value: 20, unit: "m³", trend: -6.3, icon: "public/waterbig.svg" },
    { label: "Waste Generated", value: 1200, unit: "kg", trend: 3.2, icon: "public/recycle-sign.png" }
];
const analyticsStats = [
    { label: "Resource Efficiency", value: 320, unit: "kWh", trend: -8.5, icon: "public/electric.svg" },
    { label: "Water Consumption", value: 20, unit: "m³", trend: -3.2, icon: "public/waterbig.svg" },
    { label: "Waste Recycled", value: 1200, unit: "kg", trend: 1.2, icon: "public/recycle-sign.png" },
    { label: "Carbon Emmision", value: 85, unit: "%", trend: 4.7, icon: "public/industrial.svg" }
];
const goalsSummaryData = [
    { label: "Energy Goals", value: "3", unit: "goals", progress: 60, color: "#f59e0b", icon: "public/electric.svg" },
    { label: "Water Goals", value: "2", unit: "goals", progress: 40, color: "#3b82f6", icon: "public/waterbig.svg" },
    { label: "Waste Goals", value: "4", unit: "goals", progress: 80, color: "#10b981", icon: "public/recycle-sign.png" },
    { label: "Carbon Goals", value: "2", unit: "goals", progress: 50, color: "#6b7280", icon: "public/industrial.svg" }
];
const goalsProgressData = [
    { label: "Energy Goals", progress: 75, color: "#f59e0b", icon: "public/electric.svg" },
    { label: "Waste Goals", progress: 85, color: "#10b981", icon: "public/recycle-sign.png" },
    { label: "Water Goals", progress: 50, color: "#3b82f6", icon: "public/waterbig.svg" },
    { label: "Carbon Goals", progress: 60, color: "#6b7280", icon: "public/industrial.svg" }
];
const achievementsData = [
    { title: "Water Recycling System", description: "Implemented closed-loop water recycling for Production Line A", icon: "public/waterbig.svg" },
    { title: "Solar Panel Installation", description: "Completed installation of roof mounted solar panels", icon: "public/electric.svg" },
    { title: "Paper Usage Reduction", description: "Reduced paper consumption by 25% through digitalization initiatives", icon: "public/box.svg" }
];
const recentActivityData = [
    { timestamp: "2025-05-15", category: "Energy", description: "HVAC system optimization completed" },
    { timestamp: "2025-05-16", category: "Water", description: "Water recycling system maintenance" },
    { timestamp: "2025-05-17", category: "Waste", description: "Plasting recycling target updated" }
];
const wasteSourcesData = [
    { process: "Packaging", wasteType: "Plastic", amount: 180, method: "Mechanical Recycling", recyclable: "Yes" },
    { process: "Assembly", wasteType: "Metal", amount: 120, method: "Metal recovery", recyclable: "Yes" },
    { process: "Office Operations", wasteType: "Paper", amount: 150, method: "Pulping", recyclable: "Yes" }
];
const dashboardBarChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    series: [
        { name: "Water", color: "#3b82f6", values: [400, 420, 390, 380, 410, 390, 350, 330, 320, 340, 310, 290] },
        { name: "Electricity", color: "#f59e0b", values: [380, 350, 340, 330, 320, 310, 290, 270, 260, 250, 240, 220] }
    ],
    targetLineValues: [450, 440, 430, 435, 420, 425, 410, 400, 395, 390, 380, 370],
    yAxisMax: 600
};
const resourceBarChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    series: [
        { name: "Electricity", color: "#f59e0b", values: [8750, 8600, 8800, 8700, 8900, 8850] },
        { name: "Water", color: "#3b82f6", values: [20, 22, 21, 23, 20, 24] },
        { name: "Waste", color: "#10b981", values: [1200, 1250, 1150, 1300, 1220, 1280] }
    ]
};
const analyticsLineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    series: [
        { name: "Plastic", color: "#5e35b1", values: [180, 190, 170, 200, 180, 210] },
        { name: "Paper", color: "#1e88e5", values: [150, 160, 155, 165, 170, 160] },
        { name: "Metal", color: "#fb8c00", values: [120, 110, 130, 125, 140, 135] }
    ],
    yAxisMax: 250
};
const donutChartData = [
    { label: "Plastic", value: 38, color: "#5e35b1" },
    { label: "Paper", value: 30, color: "#1e88e5" },
    { label: "Metal", value: 20, color: "#fb8c00" },
    { label: "Organic", value: 7, color: "#43a047" },
    { label: "Electronic", value: 5, color: "#e53935" }
];
let resourcesData = [], goalsData = [];
