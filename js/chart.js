// Chart configuration and initialization
(function() {
    'use strict';
    
    // Colors for charts
    const CHART_COLORS = {
        northern: {
            primary: 'rgb(52, 152, 219)',
            light: 'rgba(52, 152, 219, 0.2)',
            dark: 'rgb(41, 128, 185)'
        },
        central: {
            primary: 'rgb(46, 204, 113)',
            light: 'rgba(46, 204, 113, 0.2)',
            dark: 'rgb(39, 174, 96)'
        },
        southern: {
            primary: 'rgb(231, 76, 60)',
            light: 'rgba(231, 76, 60, 0.2)',
            dark: 'rgb(192, 57, 43)'
        }
    };
    
    // Data configuration
    const REGION_DATA = {
        labels: ['Northern Region', 'Central Region', 'Southern Region'],
        averages: [3, 5.6, 6.4],
        ranges: ['0-10', '5.6', '6.4'],
        marketShare: [20.0, 37.3, 42.7],
        descriptions: [
            'Mzuzu & surrounding areas (0-10 range, 20% market share)',
            'Lilongwe & areas (5.6 average, 37.3% market share)',
            'Blantyre & areas (6.4 average, 42.7% market share)'
        ]
    };
    
    // Initialize all charts
    window.initializeCharts = function() {
        try {
            initializeMainChart();
            initializeRegionalCharts();
            initializeDistributionChart();
            initializeComparisonChart();
            
            console.log('All charts initialized successfully');
        } catch (error) {
            console.error('Error initializing charts:', error);
        }
    };
    
    // Main Chart Configuration
    function initializeMainChart() {
        const ctx = document.getElementById('mainChart');
        if (!ctx) {
            console.error('Main chart canvas not found');
            return;
        }
        
        const chartData = {
            labels: REGION_DATA.labels,
            datasets: [{
                label: 'Monthly Advertisement Average',
                data: REGION_DATA.averages,
                backgroundColor: [
                    CHART_COLORS.northern.primary,
                    CHART_COLORS.central.primary,
                    CHART_COLORS.southern.primary
                ],
                borderColor: [
                    CHART_COLORS.northern.dark,
                    CHART_COLORS.central.dark,
                    CHART_COLORS.southern.dark
                ],
                borderWidth: 2,
                borderRadius: 6,
                hoverBackgroundColor: [
                    CHART_COLORS.northern.dark,
                    CHART_COLORS.central.dark,
                    CHART_COLORS.southern.dark
                ],
                hoverBorderWidth: 3
            }]
        };
        
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        padding: 15,
                        font: {
                            size: window.innerWidth < 768 ? 12 : 14
                        },
                        color: '#2c3e50'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                    titleFont: { 
                        size: window.innerWidth < 768 ? 12 : 14,
                        family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                    },
                    bodyFont: { 
                        size: window.innerWidth < 768 ? 11 : 13,
                        family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                    },
                    padding: 12,
                    cornerRadius: 6,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            const index = context.dataIndex;
                            return `${context.dataset.label}: ${REGION_DATA.ranges[index]} | ${REGION_DATA.descriptions[index]}`;
                        },
                        footer: function() {
                            return 'Based on Advert Shared Data';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Monthly Advertisement Average',
                        font: {
                            size: window.innerWidth < 768 ? 12 : 14,
                            weight: 'bold'
                        },
                        color: '#2c3e50',
                        padding: { top: 10, bottom: 10 }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            size: window.innerWidth < 768 ? 11 : 12
                        },
                        color: '#6c757d',
                        callback: function(value) {
                            return value.toFixed(1);
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Regions of Malawi',
                        font: {
                            size: window.innerWidth < 768 ? 12 : 14,
                            weight: 'bold'
                        },
                        color: '#2c3e50',
                        padding: { top: 10, bottom: 10 }
                    },
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: window.innerWidth < 768 ? 11 : 13,
                            weight: 'bold'
                        },
                        color: '#2c3e50'
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart',
                onProgress: function(animation) {
                    // Animation progress tracking
                },
                onComplete: function() {
                    // Animation complete
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            hover: {
                animationDuration: 200
            }
        };
        
        window.mainChart = new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: chartData,
            options: chartOptions
        });
    }
    
    // Regional Mini Charts
    function initializeRegionalCharts() {
        // Northern Region Chart
        const northernCtx = document.getElementById('northernChart');
        if (northernCtx) {
            new Chart(northernCtx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ['W1', 'W2', 'W3', 'W4'],
                    datasets: [{
                        data: [1, 0, 2, 0],
                        borderColor: CHART_COLORS.northern.primary,
                        backgroundColor: CHART_COLORS.northern.light,
                        tension: 0.4,
                        fill: true,
                        borderWidth: 2,
                        pointRadius: 3,
                        pointBackgroundColor: CHART_COLORS.northern.primary,
                        pointBorderColor: 'white',
                        pointBorderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { 
                        legend: { display: false },
                        tooltip: { enabled: false }
                    },
                    scales: {
                        x: { 
                            display: false,
                            grid: { display: false }
                        },
                        y: { 
                            display: false,
                            grid: { display: false },
                            beginAtZero: true
                        }
                    },
                    elements: {
                        line: {
                            tension: 0.4
                        }
                    },
                    interaction: { intersect: false }
                }
            });
        }
        
        // Central Region Chart
        const centralCtx = document.getElementById('centralChart');
        if (centralCtx) {
            new Chart(centralCtx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ['W1', 'W2', 'W3', 'W4'],
                    datasets: [{
                        data: [2, 1, 1, 2],
                        borderColor: CHART_COLORS.central.primary,
                        backgroundColor: CHART_COLORS.central.light,
                        tension: 0.4,
                        fill: true,
                        borderWidth: 2,
                        pointRadius: 3,
                        pointBackgroundColor: CHART_COLORS.central.primary,
                        pointBorderColor: 'white',
                        pointBorderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { 
                        legend: { display: false },
                        tooltip: { enabled: false }
                    },
                    scales: {
                        x: { 
                            display: false,
                            grid: { display: false }
                        },
                        y: { 
                            display: false,
                            grid: { display: false },
                            beginAtZero: true
                        }
                    },
                    elements: {
                        line: {
                            tension: 0.4
                        }
                    },
                    interaction: { intersect: false }
                }
            });
        }
        
        // Southern Region Chart
        const southernCtx = document.getElementById('southernChart');
        if (southernCtx) {
            new Chart(southernCtx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ['W1', 'W2', 'W3', 'W4'],
                    datasets: [{
                        data: [2, 2, 1, 2],
                        borderColor: CHART_COLORS.southern.primary,
                        backgroundColor: CHART_COLORS.southern.light,
                        tension: 0.4,
                        fill: true,
                        borderWidth: 2,
                        pointRadius: 3,
                        pointBackgroundColor: CHART_COLORS.southern.primary,
                        pointBorderColor: 'white',
                        pointBorderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { 
                        legend: { display: false },
                        tooltip: { enabled: false }
                    },
                    scales: {
                        x: { 
                            display: false,
                            grid: { display: false }
                        },
                        y: { 
                            display: false,
                            grid: { display: false },
                            beginAtZero: true
                        }
                    },
                    elements: {
                        line: {
                            tension: 0.4
                        }
                    },
                    interaction: { intersect: false }
                }
            });
        }
    }
    
    // Distribution Chart
    function initializeDistributionChart() {
        const ctx = document.getElementById('distributionChart');
        if (!ctx) return;
        
        new Chart(ctx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Northern (20%)', 'Central (37.3%)', 'Southern (42.7%)'],
                datasets: [{
                    data: REGION_DATA.marketShare,
                    backgroundColor: [
                        CHART_COLORS.northern.primary,
                        CHART_COLORS.central.primary,
                        CHART_COLORS.southern.primary
                    ],
                    borderColor: [
                        CHART_COLORS.northern.dark,
                        CHART_COLORS.central.dark,
                        CHART_COLORS.southern.dark
                    ],
                    borderWidth: 2,
                    hoverOffset: 10,
                    hoverBorderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: window.innerWidth < 768 ? 'bottom' : 'right',
                        labels: {
                            padding: 15,
                            font: {
                                size: window.innerWidth < 768 ? 11 : 12
                            },
                            color: '#2c3e50',
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        titleFont: { 
                            size: window.innerWidth < 768 ? 12 : 14
                        },
                        bodyFont: { 
                            size: window.innerWidth < 768 ? 11 : 13
                        },
                        padding: 12,
                        cornerRadius: 6,
                        callbacks: {
                            label: function(context) {
                                const regions = [
                                    'Northern: Mzuzu area',
                                    'Central: Lilongwe area', 
                                    'Southern: Blantyre area'
                                ];
                                return `${context.label}: ${context.raw}% market share (${regions[context.dataIndex]})`;
                            }
                        }
                    }
                },
                cutout: '55%',
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });
    }
    
    // Comparison Chart
    function initializeComparisonChart() {
        const ctx = document.getElementById('comparisonChart');
        if (!ctx) return;
        
        new Chart(ctx.getContext('2d'), {
            type: 'radar',
            data: {
                labels: ['Vacancy Rate', 'Consistency', 'Growth Potential', 'Market Share', 'Regional Impact'],
                datasets: [
                    {
                        label: 'Northern Region',
                        data: [3, 2, 8, 2, 3],
                        backgroundColor: CHART_COLORS.northern.light,
                        borderColor: CHART_COLORS.northern.primary,
                        borderWidth: 2,
                        pointBackgroundColor: CHART_COLORS.northern.primary,
                        pointBorderColor: 'white',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    },
                    {
                        label: 'Central Region',
                        data: [5.6, 6, 5, 5.8, 6],
                        backgroundColor: CHART_COLORS.central.light,
                        borderColor: CHART_COLORS.central.primary,
                        borderWidth: 2,
                        pointBackgroundColor: CHART_COLORS.central.primary,
                        pointBorderColor: 'white',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    },
                    {
                        label: 'Southern Region',
                        data: [6.4, 7, 3, 6.5, 7],
                        backgroundColor: CHART_COLORS.southern.light,
                        borderColor: CHART_COLORS.southern.primary,
                        borderWidth: 2,
                        pointBackgroundColor: CHART_COLORS.southern.primary,
                        pointBorderColor: 'white',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 10,
                        ticks: {
                            display: false,
                            stepSize: 2
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        angleLines: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        pointLabels: {
                            font: {
                                size: window.innerWidth < 768 ? 10 : 12
                            },
                            color: '#2c3e50'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: {
                                size: window.innerWidth < 768 ? 11 : 12
                            },
                            padding: 10
                        }
                    }
                },
                elements: {
                    line: {
                        tension: 0.3
                    }
                }
            }
        });
    }
    
    // Chart type switching
    window.setupChartSwitching = function() {
        const chartActions = document.querySelectorAll('.btn-chart-action');
        
        chartActions.forEach(button => {
            button.addEventListener('click', function() {
                if (!window.mainChart) return;
                
                // Remove active class from all buttons
                chartActions.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Change chart type
                const chartType = this.dataset.chart;
                window.mainChart.config.type = chartType;
                
                // Update animation based on chart type
                if (chartType === 'pie' || chartType === 'doughnut') {
                    window.mainChart.options.animation.animateRotate = true;
                    window.mainChart.options.animation.animateScale = true;
                } else {
                    window.mainChart.options.animation.animateRotate = false;
                    window.mainChart.options.animation.animateScale = false;
                }
                
                window.mainChart.update();
            });
        });
    };
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.mainChart) {
                window.mainChart.resize();
            }
        }, 250);
    });
    
})();