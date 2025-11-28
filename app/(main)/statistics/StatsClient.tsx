"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Chart,
    BarController,
    BarElement,
    LinearScale,
    CategoryScale,
    PieController,
    ArcElement,
    DoughnutController,
    RadialLinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    RadarController,
} from "chart.js";
import { useThemeStore } from "../../store/themeStore";
import Head from "next/head";
import {
    createReport,
    fetchSubmissions,
    filterSubmissions,
    calculateAgeDistribution,
    calculateGenderDistribution,
    calculateKeyPopulationDistribution,
    calculateParticipationByLocation,
    calculateServiceAvailability,
    calculateServiceAccesibility,
    calculateServiceAcceptability,
    calculateServiceSatisfaction,
    calculateWaitTime,
    calculateSeriousIncidents,
} from "../../utils/fetchProcessSubmission";
import { supabase } from "@/lib/supabaseClinent";

// Register Chart.js components
Chart.register(
    BarController,
    BarElement,
    LinearScale,
    CategoryScale,
    PieController,
    ArcElement,
    DoughnutController,
    RadialLinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    RadarController
);



// Types
interface KPO {
    name: string;
    count: number;
    percentage: number;
}

interface DropdownOption {
    value: string;
    label: string;
}


interface CircularProgressBarProps {
    value: number; // percentage (0-100)
    size?: number; // px
    strokeWidth?: number; // px
    color?: string;
    bgColor?: string;
    label?: string;
    textColor?: string;
}


const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
    value,
    size = 120,
    strokeWidth = 10,
    color = "#3B82F6", // blue-500
    bgColor = "#E5E7EB", // gray-200
    label,
    textColor = "#111827", // gray-900
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div style={{ width: size, height: size, position: "relative" }}>
            <svg width={size} height={size}>
                <circle
                    stroke={bgColor}
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    stroke={color}
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    style={{ transition: "stroke-dashoffset 0.5s" }}
                />
            </svg>
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: size,
                    height: size,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: textColor,
                }}
            >
                <span style={{ fontSize: size * 0.3, fontWeight: "bold" }}>{value}%</span>
                {label && (
                    <span style={{ fontSize: size * 0.13, opacity: 0.7 }}>{label}</span>
                )}
            </div>
        </div>
    );
};


const StatsClient = ({ initialData }: { initialData: any }) => {
    const { isDarkMode } = useThemeStore();
    const [isLoading, setIsLoading] = useState(true);
    const [kpos, setKpos] = useState<KPO[]>([]);
    const [totalParticipants, setTotalParticipants] = useState(0);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [regions, setRegions] = useState<DropdownOption[]>([]);
    const [dzongkhags, setDzongkhags] = useState<DropdownOption[]>([]);
    const [facilities, setFacilities] = useState<DropdownOption[]>([]);
    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
    const [selectedDzongkhag, setSelectedDzongkhag] = useState("");
    const [selectedFacility, setSelectedFacility] = useState("");
    const [data, setData] = useState<any>(initialData);
    const [error, setError] = useState<string | null>(null);
    const [selectedKPOs, setSelectedKPOs] = useState<string[]>([]);
    const [dateFrom, setDateFrom] = useState("");
    const [dateTill, setDateTill] = useState("");
    const [selectedAges, setSelectedAges] = useState<string[]>([]);
    const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
    const [selectedKPTypes, setSelectedKPTypes] = useState<string[]>([]);

    const [filteredData, setFilteredData] = useState<any>(null);
    const [filters, setFilters] = useState<any>({});

    // Chart refs
    const ageChartRef = useRef<HTMLCanvasElement>(null);
    const genderChartRef = useRef<HTMLCanvasElement>(null);
    const keyPopulationChartRef = useRef<HTMLCanvasElement>(null);
    const regionChartRef = useRef<HTMLCanvasElement>(null);
    const servicesChartRef = useRef<HTMLCanvasElement>(null);
    const safetyChartRef = useRef<HTMLCanvasElement>(null);
    const distanceChartRef = useRef<HTMLCanvasElement>(null);
    const hoursChartRef = useRef<HTMLCanvasElement>(null);
    const affordabilityChartRef = useRef<HTMLCanvasElement>(null);
    const sonamRadialChartRef = useRef<HTMLCanvasElement>(null);
    const sonamBarChartRef = useRef<HTMLCanvasElement>(null);
    const roshanRadialChartRef = useRef<HTMLCanvasElement>(null);
    const roshanBarChartRef = useRef<HTMLCanvasElement>(null);
    const satisfactionChartRef = useRef<HTMLCanvasElement>(null);
    const waitingTimeHistogramRef = useRef<HTMLCanvasElement>(null);
    const waitingTimeGaugeRef = useRef<HTMLCanvasElement>(null);
    const incidentsChartRef = useRef<HTMLCanvasElement>(null);



    // Store chart instances to destroy them later
    const chartInstancesRef = useRef<Chart[]>([]);

    // Get chart colors based on theme
    const getChartColors = () => {
        return {
            background: isDarkMode ? "#1F2937" : "#F3F4F6",
            text: isDarkMode ? "#E5E7EB" : "#111827",
            grid: isDarkMode ? "#374151" : "#E5E7EB",
            cardBg: isDarkMode ? "#1E293B" : "#FFFFFF",
            cardText: isDarkMode ? "#F3F4F6" : "#111827",
            barColors: isDarkMode
                ? ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]
                : ["#2563EB", "#059669", "#D97706", "#DC2626", "#7C3AED"],
            doughnutColors: isDarkMode
                ? ["#3B82F6", "#EF4444"]
                : ["#2563EB", "#DC2626"],
            radialColors: isDarkMode
                ? ["rgba(59, 130, 246, 0.2)", "rgba(59, 130, 246, 1)"]
                : ["rgba(245, 158, 11, 0.2)", "rgba(245, 158, 11, 1)"],
            satisfactionColors: isDarkMode
                ? ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#6B7280"]
                : ["#059669", "#2563EB", "#D97706", "#DC2626", "#9CA3AF"],
        };
    };



    // 1. Define your master KPO list with color classes for both modes
    const ALL_KPOS = [
        {
            key: "LhakSam",
            label: "LhakSam",
            icon: "fa-users",
            light: { bg: "bg-pink-100", text: "text-pink-500", bar: "bg-pink-400" },
            dark: { bg: "bg-pink-900/20", text: "text-pink-400", bar: "bg-pink-500" },
        },
        {
            key: "CPA",
            label: "CPA",
            icon: "fa-users",
            light: { bg: "bg-blue-100", text: "text-blue-500", bar: "bg-blue-400" },
            dark: { bg: "bg-blue-900/20", text: "text-blue-400", bar: "bg-blue-500" },
        },
        {
            key: "PrideBhutan",
            label: "PrideBhutan",
            icon: "fa-users",
            light: { bg: "bg-green-100", text: "text-green-500", bar: "bg-green-400" },
            dark: { bg: "bg-green-900/20", text: "text-green-400", bar: "bg-green-500" },
        },
        {
            key: "RPN",
            label: "RPN",
            icon: "fa-users",
            light: { bg: "bg-purple-100", text: "text-purple-500", bar: "bg-purple-400" },
            dark: { bg: "bg-purple-900/20", text: "text-purple-400", bar: "bg-purple-500" },
        },
        {
            key: "Others",
            label: "Others",
            icon: "fa-users",
            light: { bg: "bg-yellow-100", text: "text-yellow-500", bar: "bg-yellow-400" },
            dark: { bg: "bg-yellow-900/20", text: "text-yellow-400", bar: "bg-yellow-500" },
        },
    ];

    function getDisplayKPOs(kpoStats: any[], total: number) {
        return ALL_KPOS.map((kpo) => {
            const found = kpoStats.find((x) => x.name === kpo.key);
            return {
                ...kpo,
                count: found ? found.count : 0,
                percentage: found && total > 0 ? Number(found.percentage) : 0,
            };
        });
    }
    useEffect(() => {
        if (!isLoading && (filteredData || data)) {
            initializeCharts();
        }
        // Cleanup function to destroy charts
        return () => {
            chartInstancesRef.current.forEach((chart) => {
                if (chart) {
                    chart.destroy();
                }
            });
            chartInstancesRef.current = [];
        };
    }, [isLoading, isDarkMode, data, filteredData]);

    useEffect(() => {
        const fetchRegions = async () => {
            const { data, error } = await supabase.from("Region").select("id, name");
            if (data) {
                setRegions(data.map((r: any) => ({ value: r.id, label: r.name })));
            }
        };
        fetchRegions();
    }, []);

    useEffect(() => {
        if (!selectedRegions.length) {
            setDzongkhags([]);
            setSelectedDzongkhag("");
            setFacilities([]);
            setSelectedFacility("");
            return;
        }
        const fetchDzongkhags = async () => {
            const { data, error } = await supabase
                .from("facility_location")
                .select("id, name, region_id")
                .in("region_id", selectedRegions); // <-- Use .in for array
            if (data) {
                setDzongkhags(data.map((d: any) => ({ value: d.id, label: d.name })));
                setSelectedDzongkhag("");
                setFacilities([]);
                setSelectedFacility("");
            }
        };
        fetchDzongkhags();
    }, [selectedRegions]);

    useEffect(() => {
        if (!selectedDzongkhag) {
            setFacilities([]);
            setSelectedFacility("");
            return;
        }
        const fetchFacilities = async () => {
            const { data, error } = await supabase
                .from("facility_name")
                .select("id, name")
                .eq("facility_location_id", selectedDzongkhag);
            if (data) {
                setFacilities(data.map((f: any) => ({ value: f.id, label: f.name })));
                setSelectedFacility("");
            }
        };
        fetchFacilities();
    }, [selectedDzongkhag]);

    // Initialize charts when component mounts or theme changes
    const createChart = (
        canvasRef: React.RefObject<HTMLCanvasElement | null>,
        config: any
    ): Chart | null => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            if (!ctx) return null;

            const chart = new Chart(ctx, config);
            chartInstancesRef.current.push(chart);
            return chart;
        }
        return null;
    };


    const initializeCharts = () => {
        // Destroy existing charts first
        chartInstancesRef.current.forEach((chart) => {
            if (chart) {
                chart.destroy();
            }
        });
        chartInstancesRef.current = [];

        const colors = getChartColors();

        // Common bar chart options
        const barChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                    labels: {
                        color: colors.text,
                    },
                },
                tooltip: {
                    enabled: true,
                    mode: "index",
                    intersect: false,
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: colors.grid,
                    },
                    ticks: {
                        color: colors.text,
                    },
                },
                x: {
                    grid: {
                        color: colors.grid,
                    },
                    ticks: {
                        color: colors.text,
                    },
                },
            },
        };

        // Age Distribution Chart
        createChart(ageChartRef, {
            type: "bar",
            data: {
                labels: data.ageDistribution.categories,
                datasets: [
                    {
                        label: "Participants",
                        data: filteredData?.ageDistribution.series || data.ageDistribution.series,
                        backgroundColor: colors.barColors,
                        borderRadius: 6,
                        borderWidth: 1,
                        borderColor: isDarkMode ? "#374151" : "#E5E7EB",
                    },
                ],
            },
            options: {
                ...barChartOptions,
                plugins: {
                    ...barChartOptions.plugins,
                    title: {
                        display: true,
                        text: "Age Distribution of Participants",
                        color: colors.text,
                        font: {
                            size: 16,
                            weight: "bold",
                        },
                    },
                },
            },
        });

        // Gender Distribution Chart
        createChart(genderChartRef, {
            type: "bar",
            data: {
                labels: data.genderDistribution.categories,
                datasets: [
                    {
                        label: "Participants",
                        data: filteredData?.genderDistribution.series || data.genderDistribution.series,
                        backgroundColor: colors.barColors,
                        borderRadius: 6,
                        borderWidth: 1,
                        borderColor: isDarkMode ? "#374151" : "#E5E7EB",
                    },
                ],
            },
            options: {
                ...barChartOptions,
                plugins: {
                    ...barChartOptions.plugins,
                    title: {
                        display: true,
                        text: "Gender Distribution of Participants",
                        color: colors.text,
                        font: {
                            size: 16,
                            weight: "bold",
                        },
                    },
                },
            },
        });

        // Key Population Chart
        createChart(keyPopulationChartRef, {
            type: "bar",
            data: {
                labels: data.keyPopulationDistribution.categories,
                datasets: [
                    {
                        label: "Participants",
                        data: filteredData?.keyPopulationDistribution.series || data.keyPopulationDistribution.series,
                        backgroundColor: colors.barColors,
                        borderRadius: 6,
                        borderWidth: 1,
                        borderColor: isDarkMode ? "#374151" : "#E5E7EB",
                    },
                ],
            },
            options: {
                ...barChartOptions,
                indexAxis: "y",
                plugins: {
                    ...barChartOptions.plugins,
                    title: {
                        display: true,
                        text: "Key Population Distribution",
                        color: colors.text,
                        font: {
                            size: 16,
                            weight: "bold",
                        },
                    },
                },
            },
        });

        // Region Distribution Chart
        // createChart(regionChartRef, {
        //     type: "bar",
        //     data: {
        //         labels: data.regionalDistribution.categories,
        //         datasets: [
        //             {
        //                 label: "Participants",
        //                 data: filteredData?.regionalDistribution.series || data.regionalDistribution.series,
        //                 backgroundColor: colors.barColors,
        //                 borderRadius: 6,
        //                 borderWidth: 1,
        //                 borderColor: isDarkMode ? "#374151" : "#E5E7EB",
        //             },
        //         ],
        //     },
        //     options: {
        //         ...barChartOptions,
        //         plugins: {
        //             ...barChartOptions.plugins,
        //             title: {
        //                 display: true,
        //                 text: "Regional Distribution of Participants",
        //                 color: colors.text,
        //                 font: {
        //                     size: 16,
        //                     weight: "bold",
        //                 },
        //             },
        //         },
        //     },
        // });
        createChart(regionChartRef, {
            type: "bar",
            data: {
                labels: filteredData?.regionalDistribution.categories ?? data.regionalDistribution.categories,
                datasets: [
                    {
                        label: "Participants",
                        data: filteredData?.regionalDistribution.series ?? data.regionalDistribution.series,
                        backgroundColor: colors.barColors,
                        borderRadius: 6,
                        borderWidth: 1,
                        borderColor: isDarkMode ? "#374151" : "#E5E7EB",
                    },
                ],
            },
            options: {
                ...barChartOptions,
                plugins: {
                    ...barChartOptions.plugins,
                    title: {
                        display: true,
                        text: "Regional Distribution of Participants",
                        color: colors.text,
                        font: {
                            size: 16,
                            weight: "bold",
                        },
                    },
                },
            },
        });
        // Services Chart
        createChart(servicesChartRef, {
            type: "bar",
            data: {
                labels: data.serviceAvailability.categories,
                datasets: [
                    {
                        label: "Sought",
                        data: filteredData?.serviceAvailability.sought || data.serviceAvailability.sought,
                        backgroundColor: colors.barColors[0],
                        borderRadius: 6,
                    },
                    {
                        label: "Received",
                        data: filteredData?.serviceAvailability.received || data.serviceAvailability.received,
                        backgroundColor: colors.barColors[1],
                        borderRadius: 6,
                    },
                ],
            },
            options: {
                ...barChartOptions,
                plugins: {
                    ...barChartOptions.plugins,
                    legend: {
                        position: "bottom",
                        labels: {
                            color: colors.text,
                        },
                    },
                    title: {
                        display: true,
                        text: "Services Sought vs Received",
                        color: colors.text,
                        font: {
                            size: 16,
                            weight: "bold",
                        },
                    },
                },
            },
        });

        // Accessibility Charts
        const accessibilityChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        color: colors.text,
                    },
                },
                title: {
                    display: true,
                    color: colors.text,
                    font: {
                        size: 14,
                        weight: "bold",
                    },
                },
            },
        };

        createChart(safetyChartRef, {
            type: "doughnut",
            data: {
                labels: ["Yes", "No"],
                datasets: [
                    {
                        data: [
                            filteredData?.serviceAccessibility.details[0].yes ?? data.serviceAccessibility.details[0].yes,
                            filteredData?.serviceAccessibility.details[0].no ?? data.serviceAccessibility.details[0].no,
                        ],
                        backgroundColor: colors.doughnutColors,
                        borderColor: colors.background,
                        borderWidth: 2,
                    },
                ],
            },
            options: {
                ...accessibilityChartOptions,
                plugins: {
                    ...accessibilityChartOptions.plugins,
                    title: {
                        ...accessibilityChartOptions.plugins.title,
                        text: "Safety of Location",
                    },
                },
            },
        });

        createChart(distanceChartRef, {
            type: "doughnut",
            data: {
                labels: ["Yes", "No"],
                datasets: [
                    {
                        data: [
                            filteredData?.serviceAccessibility.details[1].yes ?? data.serviceAccessibility.details[1].yes,
                            filteredData?.serviceAccessibility.details[1].no ?? data.serviceAccessibility.details[1].no,
                        ],
                        backgroundColor: colors.doughnutColors,
                        borderColor: colors.background,
                        borderWidth: 2,
                    },
                ],
            },
            options: {
                ...accessibilityChartOptions,
                plugins: {
                    ...accessibilityChartOptions.plugins,
                    title: {
                        ...accessibilityChartOptions.plugins.title,
                        text: "Convenient Location",
                    },
                },
            },
        });

        createChart(hoursChartRef, {
            type: "doughnut",
            data: {
                labels: ["Yes", "No"],
                datasets: [
                    {
                        data: [
                            filteredData?.serviceAccessibility.details[2].yes ?? data.serviceAccessibility.details[2].yes,
                            filteredData?.serviceAccessibility.details[2].no ?? data.serviceAccessibility.details[2].no,
                        ],
                        backgroundColor: colors.doughnutColors,
                        borderColor: colors.background,
                        borderWidth: 2,
                    },
                ],
            },
            options: {
                ...accessibilityChartOptions,
                plugins: {
                    ...accessibilityChartOptions.plugins,
                    title: {
                        ...accessibilityChartOptions.plugins.title,
                        text: "Optimal Hours",
                    },
                },
            },
        });

        createChart(affordabilityChartRef, {
            type: "doughnut",
            data: {
                labels: ["Yes", "No"],
                datasets: [
                    {
                        data: [
                            filteredData?.serviceAccessibility.details[3].yes ?? data.serviceAccessibility.details[3].yes,
                            filteredData?.serviceAccessibility.details[3].no ?? data.serviceAccessibility.details[3].no,
                        ],
                        backgroundColor: colors.doughnutColors,
                        borderColor: colors.background,
                        borderWidth: 2,
                    },
                ],
            },
            options: {
                ...accessibilityChartOptions,
                plugins: {
                    ...accessibilityChartOptions.plugins,
                    title: {
                        ...accessibilityChartOptions.plugins.title,
                        text: "Service Affordability",
                    },
                },
            },
        });

        // Quality Radial Charts
        const radialChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: {
                        display: false,
                    },
                    suggestedMin: 0,
                    suggestedMax: 100,
                    ticks: {
                        stepSize: 20,
                        display: false,
                    },
                    pointLabels: {
                        color: colors.text,
                        font: {
                            size: 14,
                            weight: "bold",
                        },
                    },
                    grid: {
                        color: colors.grid,
                    },
                },
            },
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: true,
                    text: "Overall Rating",
                    color: colors.text,
                    font: {
                        size: 16,
                        weight: "bold",
                    },
                },
            },
        };

        createChart(sonamRadialChartRef, {
            type: "doughnut",
            data: {
                labels: ["Overall"],
                datasets: [
                    {
                        data: [
                            filteredData?.serviceAcceptability.acceptability.positivePercent || data.serviceAcceptability.acceptability.positivePercent,
                            100 - (filteredData?.serviceAcceptability.acceptability.positivePercent || data.serviceAcceptability.acceptability.positivePercent)
                        ],
                        backgroundColor: [colors.radialColors[1], colors.radialColors[0]],
                        borderColor: colors.radialColors[1],
                        pointBackgroundColor: colors.radialColors[1],
                        pointBorderColor: "#fff",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: colors.radialColors[1],
                        borderWidth: 2,
                    },
                ],
            },
            options: {
                cutout: "80%", // Makes the center large
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false },
                    title: {
                        display: false,
                    },
                },
            },
        });

        createChart(roshanRadialChartRef, {
            type: "doughnut",
            data: {
                labels: ["Overall"],
                datasets: [
                    {
                        data: [
                            filteredData?.serviceAcceptability.quality.positivePercent || data.serviceAcceptability.quality.positivePercent,
                            100 - (filteredData?.serviceAcceptability.quality.positivePercent || data.serviceAcceptability.quality.positivePercent)
                        ],
                        backgroundColor: [colors.radialColors[1], colors.radialColors[0]],
                        borderColor: colors.radialColors[1],
                        pointBackgroundColor: colors.radialColors[1],
                        pointBorderColor: "#fff",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: colors.radialColors[1],
                        borderWidth: 2,
                    },
                ],
            },
            options: {
                cutout: "80%", // Makes the center large
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false },
                    title: {
                        display: false,
                    },
                },
            },
        });

        // Quality Bar Charts
        const qualityBarChartOptions = {
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    min: 0,
                    max: 100,
                    ticks: {
                        callback: function (value: any) {
                            return value + "%";
                        },
                        color: colors.text,
                    },
                    grid: {
                        color: colors.grid,
                    },
                },
                y: {
                    ticks: {
                        color: colors.text,
                    },
                    grid: {
                        color: colors.grid,
                    },
                },
            },
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: true,
                    text: "Detailed Ratings",
                    color: colors.text,
                    font: {
                        size: 16,
                        weight: "bold",
                    },
                },
            },
        };

        createChart(sonamBarChartRef, {
            type: "bar",
            data: {
                labels: data.serviceAcceptability.acceptability.details.map(
                    (d: any) => d.label
                ),
                datasets: [
                    {
                        label: "Rating",
                        data: filteredData?.serviceAcceptability.acceptability.details.map((d: any) => d.yesPercent) || data.serviceAcceptability.acceptability.details.map(
                            (d: any) => d.yesPercent
                        ),
                        backgroundColor: colors.barColors[0],
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor: isDarkMode ? "#374151" : "#E5E7EB",
                    },
                ],
            },
            options: qualityBarChartOptions,
        });

        createChart(roshanBarChartRef, {
            type: "bar",
            data: {
                labels: data.serviceAcceptability.quality.details.map(
                    (d: any) => d.label
                ),
                datasets: [
                    {
                        label: "Rating",
                        data: filteredData?.serviceAcceptability.quality.details.map((d: any) => d.yesPercent) || data.serviceAcceptability.quality.details.map(
                            (d: any) => d.yesPercent
                        ),
                        backgroundColor: colors.barColors[1],
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor: isDarkMode ? "#374151" : "#E5E7EB",
                    },
                ],
            },
            options: qualityBarChartOptions,
        });

        // Satisfaction Chart
        createChart(satisfactionChartRef, {
            type: "bar",
            data: {
                labels: data.serviceSatisfaction.categories,
                datasets: [
                    {
                        label: "Ratings",
                        data: filteredData?.serviceSatisfaction.distribution ?? data.serviceSatisfaction.distribution,
                        backgroundColor: colors.satisfactionColors,
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor: isDarkMode ? "#374151" : "#E5E7EB",
                    },
                ],
            },
            options: {
                indexAxis: "y",
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: {
                            color: colors.grid,
                        },
                        ticks: {
                            color: colors.text,
                        },
                    },
                    y: {
                        grid: {
                            color: colors.grid,
                        },
                        ticks: {
                            color: colors.text,
                        },
                    },
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true,
                        text: "Satisfaction Rating Distribution",
                        color: colors.text,
                        font: {
                            size: 16,
                            weight: "bold",
                        },
                    },
                },
            },
        });

        // Waiting Time Histogram
        createChart(waitingTimeHistogramRef, {
            type: "bar",
            data: {
                labels: data.waitTime.categories,
                datasets: [
                    {
                        label: "Patients",
                        data: filteredData?.waitTime.histogram || data.waitTime.histogram,
                        backgroundColor: colors.barColors,
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor: isDarkMode ? "#374151" : "#E5E7EB",
                    },
                ],
            },
            options: {
                ...barChartOptions,
                plugins: {
                    ...barChartOptions.plugins,
                    title: {
                        display: true,
                        text: "Wait Time Distribution (minutes)",
                        color: colors.text,
                        font: {
                            size: 16,
                            weight: "bold",
                        },
                    },
                },
            },
        });

        // Waiting Time Gauge
        const avgWait = filteredData?.waitTime.average || data.waitTime.average;
        const maxWait = filteredData?.waitTime.max || data.waitTime.max;

        createChart(waitingTimeGaugeRef, {
            type: "doughnut",
            data: {
                labels: ["Average Wait Time", "Remaining"],
                datasets: [
                    {
                        data: [avgWait, Math.max(0, maxWait - avgWait)],
                        backgroundColor: [colors.radialColors[1], colors.radialColors[0]],
                        borderWidth: 0,
                    },
                ],
            },
            options: {
                cutout: "80%",
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false },
                    title: { display: false },
                },
            },
        });

        // Incidents Chart
        // createChart(incidentsChartRef, {
        //   type: "bar",
        //   data: {
        //     labels: data.seriousIncidents.categories,
        //     datasets: [
        //       {
        //         label: "Incidents",
        //         data: filteredData.seriousIncidents.counts || data.seriousIncidents.counts,
        //         backgroundColor: colors.barColors,
        //         borderRadius: 4,
        //         borderWidth: 1,
        //         borderColor: isDarkMode ? "#374151" : "#E5E7EB",
        //       },
        //     ],
        //   },
        //   options: {
        //     ...barChartOptions,
        //     indexAxis: "y",
        //     plugins: {
        //       ...barChartOptions.plugins,
        //       title: {
        //         display: true,
        //         text: "Incidents by Type",
        //         color: colors.text,
        //         font: {
        //           size: 16,
        //           weight: "bold",
        //         },
        //       },
        //     },
        //   },
        // });
    };

    // Fetch and process data
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Fetch and process data
                // const processedData = await createReport();

                if (!initialData) {
                    throw new Error("No data received from server");
                }

                setData(initialData);
                setKpos(initialData.kpos || []);
                setTotalParticipants(initialData.totalParticipants || 0);

                // Mock dzongkhags and facilities for filters
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load data. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const displayKpos = getDisplayKPOs(kpos, totalParticipants);

    const applyFilters = async (e: React.FormEvent) => {
        e.preventDefault();

        // Gather filter values from form (example, adapt as needed)
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        // KPO (network) filter
        const kpo = Array.from(formData.getAll("keyPopulationOrgs"));
        // Age Range
        const age = Array.from(formData.getAll("ageRanges"));
        // Gender
        const gender = Array.from(formData.getAll("genders"));
        // Key Population Type
        const kpType = Array.from(formData.getAll("keyPopulationTypes"));
        // Region
        const region = selectedRegions;
        // Dzongkhag
        const dzongkhag = selectedDzongkhag;
        // Facility
        const facility = selectedFacility;
        // Date Range
        const fromDate = formData.get("dateFrom") as string;
        const toDate = formData.get("dateTill") as string;

        // Fetch mapping tables
        const { data: regions } = await supabase.from("Region").select("id, name");
        const { data: dzongkhags } = await supabase.from("facility_location").select("id, name");
        const { data: facilities } = await supabase.from("facility_name").select("id, name");

        const regionIdToName = Object.fromEntries((regions || []).map((r: any) => [String(r.id), r.name]));
        const dzongkhagIdToName = Object.fromEntries((dzongkhags || []).map((d: any) => [String(d.id), d.name]));
        const facilityIdToName = Object.fromEntries((facilities || []).map((f: any) => [String(f.id), f.name]));


        // Build filter object
        const filterObj: any = {
            kpo: selectedKPOs,
            age: selectedAges,
            gender: selectedGenders,
            kpType: selectedKPTypes,
            region: selectedRegions,
            dzongkhag: selectedDzongkhag,
            facility: selectedFacility,
            fromDate: dateFrom,
            toDate: dateTill,
        };

        setFilters(filterObj);

        // Fetch all submissions (unfiltered)
        const allSubmissions = await fetchSubmissions();

        // Filter submissions in-memory
        const filtered = filterSubmissions(allSubmissions, filterObj, regionIdToName, dzongkhagIdToName, facilityIdToName);
        // console.log();

        console.log(filtered);


        // Build filtered report (charts, etc)
        const filteredReport = {
            ageDistribution: calculateAgeDistribution(filtered),
            genderDistribution: calculateGenderDistribution(filtered),
            keyPopulationDistribution: calculateKeyPopulationDistribution(filtered),
            regionalDistribution: await calculateParticipationByLocation(filtered),
            serviceAvailability: calculateServiceAvailability(filtered),
            serviceAccessibility: calculateServiceAccesibility(filtered),
            serviceAcceptability: calculateServiceAcceptability(filtered),
            serviceSatisfaction: calculateServiceSatisfaction(filtered),
            waitTime: calculateWaitTime(filtered),
            seriousIncidents: calculateSeriousIncidents(filtered),
        };

        // console.log(filteredReport.genderDistribution);


        // console.log(filteredReport);


        setFilteredData(filteredReport);
    };

    const formRef = useRef<HTMLFormElement>(null); // Add this at the top of your component

    const resetFilters = () => {
        setFilters({});
        setFilteredData(null);

        setSelectedKPOs([]);
        setDateFrom("");
        setDateTill("");
        setSelectedAges([]);
        setSelectedGenders([]);
        setSelectedKPTypes([]);
        setSelectedRegions([]);
        setSelectedDzongkhag("");
        setFacilities([]);
        setSelectedFacility("");
    };

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(
                    <svg
                        key={i}
                        className="w-6 h-6 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                );
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(
                    <svg
                        key={i}
                        className="w-6 h-6 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <defs>
                            <linearGradient id="half-star" x1="0" x2="100%" y1="0" y2="0">
                                <stop offset="50%" stopColor="currentColor" />
                                <stop offset="50%" stopColor="gray" stopOpacity="0.3" />
                            </linearGradient>
                        </defs>
                        <path
                            fill="url(#half-star)"
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                        />
                    </svg>
                );
            } else {
                stars.push(
                    <svg
                        key={i}
                        className="w-6 h-6 text-yellow-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                    </svg>
                );
            }
        }

        return stars;
    };

    if (!data) {
        return (
            <div
                className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
                    }`}
            >
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>HIV Statistics in Bhutan - Interactive Dashboard</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>

            <div
                className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
                    }`}
            >
                {/* Loading overlay */}
                {isLoading && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                )}
                {/* Main Content */}
                <main className="container mx-auto px-4 py-8">
                    {/* Participation By Key Population Organization */}
                    <section className="mb-12 px-4 py-8">
                        <h2
                            className={`text-2xl font-bold mb-6 text-center ${isDarkMode ? "text-white" : "text-gray-800"
                                }`}
                        >
                            Participation By Key Population Organization
                        </h2>
                        <p
                            className={`mb-8 text-center text-xl ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                        >
                            Total Participants:{" "}
                            <span
                                className={`font-bold ${isDarkMode ? "text-blue-400" : "text-indigo-600"
                                    }`}
                            >
                                {totalParticipants}
                            </span>
                        </p>

                        {isLoading ? (
                            <div className="text-center py-8">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                                <p
                                    className={`mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"
                                        }`}
                                >
                                    Loading data...
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
                                {displayKpos.map((kpo, index) => (
                                    <div
                                        key={kpo.key}
                                        className={`rounded-2xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
                                    >
                                        <div className="p-4 sm:p-5">
                                            <div className="flex items-center mb-4">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDarkMode ? kpo.dark.bg : kpo.light.bg}`}>
                                                    <span className={`text-lg ${isDarkMode ? kpo.dark.text : kpo.light.text}`}>
                                                        <i className={`fas ${kpo.icon}`}></i>
                                                    </span>
                                                </div>
                                                <div className="ml-3">
                                                    <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>{kpo.label}</h3>
                                                    <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Total: {kpo.count}</p>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Percentage</span>
                                                    <span className={`text-xl font-bold ${isDarkMode ? kpo.dark.text : kpo.light.text}`}>
                                                        {kpo.percentage.toFixed(2)}%
                                                    </span>
                                                </div>
                                                <div className={`w-full rounded-full h-2 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                                                    <div
                                                        className={`h-2 rounded-full transition-all duration-500 ease-out ${isDarkMode ? kpo.dark.bar : kpo.light.bar}`}
                                                        style={{ width: `${kpo.percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Filters Section */}
                    <section className="mb-8">
                        <div
                            className={`rounded-lg shadow-md overflow-hidden ${isDarkMode ? "bg-gray-800" : "bg-white"
                                }`}
                        >
                            <div
                                onClick={() => setFiltersOpen(!filtersOpen)}
                                className={`flex justify-between items-center p-5 cursor-pointer transition duration-300 ${isDarkMode
                                    ? "bg-gray-800 hover:bg-gray-700"
                                    : "bg-white hover:bg-gray-100"
                                    }`}
                            >
                                <h2
                                    className={`text-xl font-bold ${isDarkMode ? "text-gray-300" : "text-gray-500"
                                        }`}
                                >
                                    <i className="fas fa-filter mr-3"></i>Apply Filters
                                </h2>
                                <i
                                    className={`fas ${filtersOpen ? "fa-chevron-up" : "fa-chevron-down"
                                        } ${isDarkMode ? "text-gray-300" : "text-gray-500"} text-xl`}
                                ></i>
                            </div>

                            {filtersOpen && (
                                <div className="p-6">
                                    <form onSubmit={applyFilters} className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {/* Key Population Organization */}
                                            <div
                                                className={`p-4 rounded-lg shadow-inner ${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
                                                    }`}
                                            >
                                                <h3
                                                    className={`text-lg font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"
                                                        }`}
                                                >
                                                    Key Population Organization
                                                </h3>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {ALL_KPOS.map((kpo) => (
                                                        <div key={kpo.label} className="flex items-center">
                                                            <input
                                                                id={kpo.label}
                                                                value={kpo.label}
                                                                name="keyPopulationOrgs"
                                                                type="checkbox"
                                                                checked={selectedKPOs.includes(kpo.label)}
                                                                onChange={e => {
                                                                    if (e.target.checked) {
                                                                        setSelectedKPOs([...selectedKPOs, kpo.label]);
                                                                    } else {
                                                                        setSelectedKPOs(selectedKPOs.filter(val => val !== kpo.label));
                                                                    }
                                                                }}
                                                                className="h-5 w-5 rounded"
                                                            />
                                                            <label htmlFor={kpo.label} className="ml-2 text-sm">{kpo.label}</label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Date Range */}
                                            <div
                                                className={`p-4 rounded-lg shadow-inner ${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
                                                    }`}
                                            >
                                                <h3
                                                    className={`text-lg font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"
                                                        }`}
                                                >
                                                    Date Range
                                                </h3>
                                                <div className="space-y-3">
                                                    <div>
                                                        <label
                                                            htmlFor="dateFrom"
                                                            className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                                                }`}
                                                        >
                                                            From Date
                                                        </label>
                                                        <input
                                                            type="date"
                                                            id="dateFrom"
                                                            name="dateFrom"
                                                            value={dateFrom}
                                                            onChange={e => setDateFrom(e.target.value)}
                                                            className="w-full rounded-md shadow-sm ..."
                                                        />
                                                    </div>
                                                    <div>
                                                        <label
                                                            htmlFor="dateTill"
                                                            className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                                                }`}
                                                        >
                                                            Till Date
                                                        </label>
                                                        <input
                                                            type="date"
                                                            id="dateTill"
                                                            name="dateTill"
                                                            value={dateTill}
                                                            onChange={e => setDateTill(e.target.value)}
                                                            className="w-full rounded-md shadow-sm ..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Location */}
                                            <div
                                                className={`p-4 rounded-lg shadow-inner ${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
                                                    }`}
                                            >
                                                <h3
                                                    className={`text-lg font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"
                                                        }`}
                                                >
                                                    Location
                                                </h3>
                                                <div className="space-y-3">
                                                    {/* Region */}
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">Region</label>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {regions.map(r => (
                                                                <div key={r.value} className="flex items-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={`region-${r.value}`}
                                                                        value={r.value}
                                                                        checked={selectedRegions.includes(r.value)}
                                                                        onChange={e => {
                                                                            if (e.target.checked) {
                                                                                setSelectedRegions([...selectedRegions, r.value]);
                                                                            } else {
                                                                                setSelectedRegions(selectedRegions.filter(val => val !== r.value));
                                                                            }
                                                                            setSelectedDzongkhag(""); // Reset dzongkhag on region change
                                                                        }}
                                                                        className="h-5 w-5 rounded"
                                                                    />
                                                                    <label htmlFor={`region-${r.value}`} className="ml-2 text-sm">{r.label}</label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Dzongkhag */}
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">Dzongkhag</label>
                                                        <select
                                                            value={selectedDzongkhag}
                                                            onChange={e => setSelectedDzongkhag(e.target.value)}
                                                            className="w-full rounded-md"
                                                            disabled={!selectedRegions.length}
                                                        >
                                                            <option value="">Select Dzongkhag</option>
                                                            {dzongkhags.map(d => (
                                                                <option key={d.value} value={d.value}>{d.label}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    {/* Facility */}
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">Facility</label>
                                                        <select
                                                            value={selectedFacility}
                                                            onChange={e => setSelectedFacility(e.target.value)}
                                                            className="w-full rounded-md"
                                                            disabled={!selectedDzongkhag}
                                                        >
                                                            <option value="">Select Facility</option>
                                                            {facilities.map(f => (
                                                                <option key={f.value} value={f.value}>{f.label}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Age Range */}
                                            <div
                                                className={`p-4 rounded-lg shadow-inner ${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
                                                    }`}
                                            >
                                                <h3
                                                    className={`text-lg font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"
                                                        }`}
                                                >
                                                    Age Range
                                                </h3>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                    {data.ageDistribution.categories.map((range: string) => (
                                                        <div key={range} className="flex items-center">
                                                            <input
                                                                id={`age${range}`}
                                                                value={range}
                                                                name="ageRanges"
                                                                type="checkbox"
                                                                checked={selectedAges.includes(range)}
                                                                onChange={e => {
                                                                    if (e.target.checked) {
                                                                        setSelectedAges([...selectedAges, range]);
                                                                    } else {
                                                                        setSelectedAges(selectedAges.filter(val => val !== range));
                                                                    }
                                                                }}
                                                                className="h-5 w-5 rounded"
                                                            />
                                                            <label htmlFor={`age${range}`} className="ml-2 text-sm">{range}</label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Gender */}
                                            <div
                                                className={`p-4 rounded-lg shadow-inner ${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
                                                    }`}
                                            >
                                                <h3
                                                    className={`text-lg font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"
                                                        }`}
                                                >
                                                    Gender
                                                </h3>
                                                <div className="space-y-2">
                                                    {data.genderDistribution.categories.map((gender: string) => (
                                                        <div key={gender} className="flex items-center">
                                                            <input
                                                                id={`gender${gender.replace(" ", "")}`}
                                                                value={gender}
                                                                name="genders"
                                                                type="checkbox"
                                                                checked={selectedGenders.includes(gender)}
                                                                onChange={e => {
                                                                    if (e.target.checked) {
                                                                        setSelectedGenders([...selectedGenders, gender]);
                                                                    } else {
                                                                        setSelectedGenders(selectedGenders.filter(val => val !== gender));
                                                                    }
                                                                }}
                                                                className="h-5 w-5 rounded"
                                                            />
                                                            <label htmlFor={`gender${gender.replace(" ", "")}`} className="ml-2 text-sm">{gender}</label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Key Population Type */}
                                            <div
                                                className={`p-4 rounded-lg shadow-inner ${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
                                                    }`}
                                            >
                                                <h3
                                                    className={`text-lg font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"
                                                        }`}
                                                >
                                                    Key Population Type
                                                </h3>
                                                <div className="space-y-2">
                                                    {data.keyPopulationDistribution.categories.map((type: string) => (
                                                        <div key={type} className="flex items-center">
                                                            <input
                                                                id={`kp${type.replace(/\s+/g, "")}`}
                                                                value={type}
                                                                name="keyPopulationTypes"
                                                                type="checkbox"
                                                                checked={selectedKPTypes.includes(type)}
                                                                onChange={e => {
                                                                    if (e.target.checked) {
                                                                        setSelectedKPTypes([...selectedKPTypes, type]);
                                                                    } else {
                                                                        setSelectedKPTypes(selectedKPTypes.filter(val => val !== type));
                                                                    }
                                                                }}
                                                                className="h-5 w-5 rounded"
                                                            />
                                                            <label htmlFor={`kp${type.replace(/\s+/g, "")}`} className="ml-2 text-sm">{type}</label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end space-x-4 mt-8">
                                            <button
                                                type="button"
                                                onClick={resetFilters}
                                                className={`px-6 py-3 border-2 rounded-full text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md ${isDarkMode
                                                    ? "border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700"
                                                    : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                                                    }`}
                                            >
                                                <i className="fas fa-redo-alt mr-2"></i>Reset
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-6 py-3 border-2 border-transparent rounded-full shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md"
                                            >
                                                <i className="fas fa-filter mr-2"></i>Apply Filters
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* A1. CLM Participation */}
                    <section className="mb-8">
                        <h2
                            className={`text-2xl font-semibold mb-6 ${isDarkMode ? "text-white" : "text-gray-800"
                                }`}
                        >
                            A1. CLM Participation
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div
                                className={`rounded-lg shadow-md p-6 ${isDarkMode ? "bg-gray-800" : "bg-white"
                                    }`}
                            >
                                <h3
                                    className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                        }`}
                                >
                                    Participation Age Distribution
                                </h3>
                                <div className="h-[350px]">
                                    <canvas ref={ageChartRef} />
                                </div>
                            </div>
                            <div
                                className={`rounded-lg shadow-md p-6 ${isDarkMode ? "bg-gray-800" : "bg-white"
                                    }`}
                            >
                                <h3
                                    className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                        }`}
                                >
                                    Participation by Gender
                                </h3>
                                <div className="h-[350px]">
                                    <canvas ref={genderChartRef} />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-6 mt-6">
                            <div
                                className={`rounded-lg shadow-md p-4 ${isDarkMode ? "bg-gray-800" : "bg-white"
                                    }`}
                            >
                                <h3
                                    className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                        }`}
                                >
                                    Participation by Key Population Type
                                </h3>
                                <div className="h-[350px]">
                                    <canvas ref={keyPopulationChartRef} />
                                </div>
                            </div>
                            <div
                                className={`rounded-lg shadow-md p-4 ${isDarkMode ? "bg-gray-800" : "bg-white"
                                    }`}
                            >
                                <h3
                                    className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                        }`}
                                >
                                    Participation by Location
                                </h3>
                                <div className="h-[350px]">
                                    <canvas ref={regionChartRef} />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* A2 Service Availability Charts */}
                    <section className="mb-8">
                        <h2
                            className={`text-2xl font-semibold mb-6 ${isDarkMode ? "text-white" : "text-gray-800"
                                }`}
                        >
                            A2. Service Availability
                        </h2>
                        <div className="grid grid-cols-1 gap-6">
                            <div
                                className={`rounded-lg shadow-md p-6 ${isDarkMode ? "bg-gray-800" : "bg-white"
                                    }`}
                            >
                                <h3
                                    className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                        }`}
                                >
                                    Services Sought vs Received
                                </h3>
                                <div className="h-[350px]">
                                    <canvas ref={servicesChartRef} />
                                </div>
                            </div>
                            <div
                                className={`rounded-lg shadow-md p-6 ${isDarkMode ? "bg-gray-800" : "bg-white"
                                    }`}
                            >
                                <h3
                                    className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                        }`}
                                >
                                    Service Availability Summary
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div
                                        className={`rounded-lg p-4 ${isDarkMode ? "bg-blue-900/20" : "bg-blue-100"
                                            }`}
                                    >
                                        <h4
                                            className={`text-sm font-medium mb-2 ${isDarkMode ? "text-blue-300" : "text-blue-800"
                                                }`}
                                        >
                                            Total Services Sought
                                        </h4>
                                        <p
                                            className={`text-2xl font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"
                                                }`}
                                        >
                                            {filteredData?.serviceAvailability.summary.totalServicesSought ?? data.serviceAvailability.summary.totalServicesSought}
                                        </p>
                                    </div>
                                    <div
                                        className={`rounded-lg p-4 ${isDarkMode ? "bg-green-900/20" : "bg-green-100"
                                            }`}
                                    >
                                        <h4
                                            className={`text-sm font-medium mb-2 ${isDarkMode ? "text-green-300" : "text-green-800"
                                                }`}
                                        >
                                            Total Services Received
                                        </h4>
                                        <p
                                            className={`text-2xl font-bold ${isDarkMode ? "text-green-400" : "text-green-600"
                                                }`}
                                        >
                                            {filteredData?.serviceAvailability.summary.totalServicesReceived ?? data.serviceAvailability.summary.totalServicesReceived}
                                        </p>
                                    </div>
                                    <div
                                        className={`rounded-lg p-4 ${isDarkMode ? "bg-red-900/20" : "bg-red-100"
                                            }`}
                                    >
                                        <h4
                                            className={`text-sm font-medium mb-2 ${isDarkMode ? "text-red-300" : "text-red-800"
                                                }`}
                                        >
                                            Unmet Service Requests
                                        </h4>
                                        <p
                                            className={`text-2xl font-bold ${isDarkMode ? "text-red-400" : "text-red-600"
                                                }`}
                                        >
                                            {filteredData?.serviceAvailability.summary.unmetServiceRequests ?? data.serviceAvailability.summary.unmetServiceRequests}
                                        </p>
                                    </div>
                                    <div
                                        className={`rounded-lg p-4 ${isDarkMode ? "bg-yellow-900/20" : "bg-yellow-100"
                                            }`}
                                    >
                                        <h4
                                            className={`text-sm font-medium mb-2 ${isDarkMode ? "text-yellow-300" : "text-yellow-800"
                                                }`}
                                        >
                                            Service Fulfillment Rate
                                        </h4>
                                        <p
                                            className={`text-2xl font-bold ${isDarkMode ? "text-yellow-400" : "text-yellow-600"
                                                }`}
                                        >
                                            {filteredData?.serviceAvailability.summary.serviceFulfillmentRate ?? data.serviceAvailability.summary.serviceFulfillmentRate}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* A3 Service Accessibility Charts */}
                    <section className="mb-8 px-4 sm:px-6 lg:px-8">
                        <h2
                            className={`text-2xl font-semibold mb-6 ${isDarkMode ? "text-white" : "text-gray-800"
                                }`}
                        >
                            A3. Service Accessibility
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            <div
                                className={`rounded-lg shadow-md p-4 sm:p-6 ${isDarkMode ? "bg-gray-800" : "bg-white"
                                    }`}
                            >
                                <h3
                                    className={`text-lg text-center font-medium mb-2 break-words ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                        }`}
                                >
                                    Is location safe?
                                </h3>
                                <div className="h-[250px]">
                                    <canvas ref={safetyChartRef} />
                                </div>
                            </div>
                            <div
                                className={`rounded-lg shadow-md p-4 sm:p-6 ${isDarkMode ? "bg-gray-800" : "bg-white"
                                    }`}
                            >
                                <h3
                                    className={`text-lg text-center font-medium mb-2 break-words ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                        }`}
                                >
                                    Location not far/hard to travel to?
                                </h3>
                                <div className="h-[250px]">
                                    <canvas ref={distanceChartRef} />
                                </div>
                            </div>
                            <div
                                className={`rounded-lg shadow-md p-4 sm:p-6 ${isDarkMode ? "bg-gray-800" : "bg-white"
                                    }`}
                            >
                                <h3
                                    className={`text-lg text-center font-medium mb-2 break-words ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                        }`}
                                >
                                    Are the hours convenient?
                                </h3>
                                <div className="h-[250px]">
                                    <canvas ref={hoursChartRef} />
                                </div>
                            </div>
                            <div
                                className={`rounded-lg shadow-md p-4 sm:p-6 ${isDarkMode ? "bg-gray-800" : "bg-white"
                                    }`}
                            >
                                <h3
                                    className={`text-lg text-center font-medium mb-2 break-words ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                        }`}
                                >
                                    Is service affordable?
                                </h3>
                                <div className="h-[250px]">
                                    <canvas ref={affordabilityChartRef} />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* A4 A5 A6 Service Quality Charts */}
                    <section className="mb-12">
                        <h2
                            className={`text-3xl font-bold mb-8 ${isDarkMode ? "text-white" : "text-gray-800"
                                }`}
                        >
                            Service Acceptability, Quality & Satisfaction
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* A4 card */}
                            <div
                                className={`rounded-xl shadow-lg p-6 transition-all duration-300 ease-in-out hover:shadow-xl ${isDarkMode ? "bg-gray-800" : "bg-white"
                                    }`}
                            >
                                <h4
                                    className={`font-bold mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-800"
                                        }`}
                                >
                                    A4. Service Acceptability: (
                                    {filteredData?.serviceAcceptability.acceptability.positive ?? data.serviceAcceptability.acceptability.positive} /{" "}
                                    {filteredData?.serviceAcceptability.acceptability.total ?? data.serviceAcceptability.acceptability.total})
                                </h4>
                                <div className="space-y-6">
                                    <div className="flex justify-center items-center w-full">
                                        <div className="relative" style={{ width: 220, height: 220 }}>
                                            <canvas ref={sonamRadialChartRef} width={220} height={220} />
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className={`text-4xl font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                                                    {filteredData?.serviceAcceptability.acceptability.positivePercent ?? data.serviceAcceptability.acceptability.positivePercent}%
                                                </span>
                                                <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                                    Positive Experience
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-[250px]">
                                        <canvas ref={sonamBarChartRef} />
                                    </div>
                                </div>
                            </div>

                            {/* A5 card */}
                            <div
                                className={`rounded-xl shadow-lg p-6 transition-all duration-300 ease-in-out hover:shadow-xl ${isDarkMode ? "bg-gray-800" : "bg-white"
                                    }`}
                            >
                                <h4
                                    className={`font-bold mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-800"
                                        }`}
                                >
                                    A5. Service Quality: (
                                    {filteredData?.serviceAcceptability.quality.positive ?? data.serviceAcceptability.quality.positive} /{" "}
                                    {filteredData?.serviceAcceptability.quality.total ?? data.serviceAcceptability.quality.total})
                                </h4>
                                <div className="space-y-6">
                                    <div className="flex justify-center items-center w-full">
                                        <div className="relative" style={{ width: 220, height: 220 }}>
                                            <canvas ref={roshanRadialChartRef} width={220} height={220} />
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className={`text-4xl font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                                                    {filteredData?.serviceAcceptability.quality.positivePercent ?? data.serviceAcceptability.quality.positivePercent}%
                                                </span>
                                                <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                                    Positive Experience
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-[250px]">
                                        <canvas ref={roshanBarChartRef} />
                                    </div>
                                </div>
                            </div>

                            {/* A6 card */}
                            <div
                                className={`rounded-lg shadow-lg p-6 h-full flex flex-col ${isDarkMode ? "bg-gray-800" : "bg-white"
                                    }`}
                            >
                                <h4
                                    className={`font-semibold mb-6 text-center ${isDarkMode ? "text-gray-300" : "text-gray-800"
                                        }`}
                                >
                                    A6. Service Satisfaction: (
                                    {(filteredData?.serviceSatisfaction.total ?? data.serviceSatisfaction.total)} / {totalParticipants})
                                </h4>
                                <div
                                    id="satisfaction-rating-card"
                                    className="flex flex-col items-center flex-grow"
                                >
                                    <div className="text-center mb-6 pt-6">
                                        <h4
                                            className={`${isDarkMode ? "text-gray-400" : "text-gray-600"
                                                } mb-2`}
                                        >
                                            Average
                                        </h4>
                                        <div
                                            className={`text-5xl font-bold mb-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"
                                                }`}
                                        >
                                            {(filteredData?.serviceSatisfaction.average ?? data.serviceSatisfaction.average).toFixed(1)}
                                        </div>
                                        <div className="flex justify-center space-x-1 mb-4">
                                            {renderStars(filteredData?.serviceSatisfaction.average ?? data.serviceSatisfaction.average)}
                                        </div>
                                        <div
                                            className={`w-full max-w-xs rounded-full h-2.5 mb-4 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                                                }`}
                                        >
                                            <div
                                                className={`h-2.5 rounded-full ${isDarkMode ? "bg-blue-500" : "bg-blue-600"
                                                    }`}
                                                style={{
                                                    width: `${((filteredData?.serviceSatisfaction.average ?? data.serviceSatisfaction.average) / 5) * 100
                                                        }%`,
                                                }}
                                            ></div>
                                        </div>
                                        <p
                                            className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                                                }`}
                                        >
                                            Based on {(filteredData?.serviceSatisfaction.total ?? data.serviceSatisfaction.total)} ratings
                                        </p>
                                    </div>

                                    <div className="flex-grow"></div>

                                    <div className="w-full mt-auto">
                                        <h5
                                            className={`font-semibold mb-4 text-center ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                                }`}
                                        >
                                            Rating Distribution
                                        </h5>
                                        <div className="h-[250px]">
                                            <canvas ref={satisfactionChartRef} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Waiting Time Chart */}
                    <section className="mb-8">
                        <h2
                            className={`text-2xl font-semibold mb-6 ${isDarkMode ? "text-white" : "text-gray-800"
                                }`}
                        >
                            Waiting Time
                        </h2>
                        <div className="grid grid-cols-12 gap-6">
                            <div
                                className={`col-span-12 lg:col-span-9 rounded-lg shadow-md p-6 ${isDarkMode ? "bg-gray-800" : "bg-white"
                                    }`}
                            >
                                <h3
                                    className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                        }`}
                                >
                                    Wait Time Distribution
                                </h3>
                                <div className="h-[350px]">
                                    <canvas ref={waitingTimeHistogramRef} />
                                </div>
                            </div>
                            <div
                                className={`col-span-12 lg:col-span-3 rounded-lg shadow-md p-6 ${isDarkMode ? "bg-gray-800" : "bg-white"
                                    }`}
                            >
                                <h3
                                    className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                        }`}
                                >
                                    Average Wait Time
                                </h3>
                                <div className="relative h-[250px]">
                                    <canvas ref={waitingTimeGaugeRef} />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span
                                            className={`text-4xl font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"
                                                }`}
                                        >
                                            {filteredData?.waitTime.average ?? data.waitTime.average} mins
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className={`mt-6 rounded-lg shadow-md p-6 ${isDarkMode ? "bg-gray-800" : "bg-white"
                                }`}
                        >
                            <h3
                                className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                    }`}
                            >
                                Summary Statistics
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div
                                    className={`text-center p-4 rounded-lg ${isDarkMode ? "bg-blue-900/20" : "bg-blue-50"
                                        }`}
                                >
                                    <p
                                        className={`text-sm mb-2 ${isDarkMode ? "text-blue-300" : "text-blue-800"
                                            }`}
                                    >
                                        Total Patients
                                    </p>
                                    <p
                                        className={`text-3xl font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"
                                            }`}
                                    >
                                        {filteredData?.waitTime.total ?? data.waitTime.total}
                                    </p>
                                </div>
                                <div
                                    className={`text-center p-4 rounded-lg ${isDarkMode ? "bg-green-900/20" : "bg-green-50"
                                        }`}
                                >
                                    <p
                                        className={`text-sm mb-2 ${isDarkMode ? "text-green-300" : "text-green-800"
                                            }`}
                                    >
                                        Average Wait Time
                                    </p>
                                    <p
                                        className={`text-3xl font-bold ${isDarkMode ? "text-green-400" : "text-green-600"
                                            }`}
                                    >
                                        {filteredData?.waitTime.average ?? data.waitTime.average} mins
                                    </p>
                                </div>
                                <div
                                    className={`text-center p-4 rounded-lg ${isDarkMode ? "bg-yellow-900/20" : "bg-yellow-50"
                                        }`}
                                >
                                    <p
                                        className={`text-sm mb-2 ${isDarkMode ? "text-yellow-300" : "text-yellow-800"
                                            }`}
                                    >
                                        Median Wait Time
                                    </p>
                                    <p
                                        className={`text-3xl font-bold ${isDarkMode ? "text-yellow-400" : "text-yellow-600"
                                            }`}
                                    >
                                        {filteredData?.waitTime.median ?? data.waitTime.median} mins
                                    </p>
                                </div>
                                <div
                                    className={`text-center p-4 rounded-lg ${isDarkMode ? "bg-red-900/20" : "bg-red-50"
                                        }`}
                                >
                                    <p
                                        className={`text-sm mb-2 ${isDarkMode ? "text-red-300" : "text-red-800"
                                            }`}
                                    >
                                        Max Wait Time
                                    </p>
                                    <p
                                        className={`text-3xl font-bold ${isDarkMode ? "text-red-400" : "text-red-600"
                                            }`}
                                    >
                                        {filteredData?.waitTime.max ?? data.waitTime.max} mins
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Serious Incident Charts */}

                    <section className="mb-8">
                        <h2 className={`text-2xl font-semibold mb-6 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                            A7. Serious Incidents
                        </h2>
                        <div className={`rounded-lg shadow-md p-6 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {filteredData?.seriousIncidents.details.map((incident: any, idx: number) => {
                                    // Choose color and icon per incident type
                                    const colorMap = [
                                        { bar: "bg-red-400", text: "text-red-500", badge: "bg-red-100 text-red-500", icon: "⚠️" },
                                        { bar: "bg-yellow-400", text: "text-yellow-600", badge: "bg-yellow-100 text-yellow-600", icon: "✊" },
                                        { bar: "bg-cyan-400", text: "text-cyan-600", badge: "bg-cyan-100 text-cyan-600", icon: "✋" },
                                        { bar: "bg-indigo-400", text: "text-indigo-600", badge: "bg-indigo-100 text-indigo-600", icon: "🏛️" },
                                        { bar: "bg-green-400", text: "text-green-600", badge: "bg-green-100 text-green-600", icon: "🔒" },
                                        { bar: "bg-gray-400", text: "text-gray-600", badge: "bg-gray-100 text-gray-600", icon: "🚫" },
                                        { bar: "bg-purple-400", text: "text-purple-600", badge: "bg-purple-100 text-purple-600", icon: "😟" },
                                        { bar: "bg-pink-400", text: "text-pink-600", badge: "bg-pink-100 text-pink-600", icon: "❓" },
                                    ];
                                    const color = colorMap[idx % colorMap.length];
                                    const percent = incident.percent?.toFixed(2) || "0.00";
                                    return (
                                        <div key={incident.key} className={`rounded-xl shadow p-6 flex flex-col justify-between ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
                                            <div className="flex items-center mb-2">
                                                <span className="text-2xl mr-2">{color.icon}</span>
                                                <span className={`font-semibold text-lg ${isDarkMode ? "text-white" : "text-gray-800"}`}>{incident.label}</span>
                                                <span className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${color.badge}`}>
                                                    {percent}%
                                                </span>
                                            </div>
                                            <div className={`text-3xl font-bold mb-2 ${color.text}`}>{incident.count}</div>
                                            <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 mb-2">
                                                <div
                                                    className={`h-2 rounded-full ${color.bar} transition-all duration-500`}
                                                    style={{ width: `${percent}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                }) || data.seriousIncidents.details.map((incident: any, idx: number) => {
                                    // Choose color and icon per incident type
                                    const colorMap = [
                                        { bar: "bg-red-400", text: "text-red-500", badge: "bg-red-100 text-red-500", icon: "⚠️" },
                                        { bar: "bg-yellow-400", text: "text-yellow-600", badge: "bg-yellow-100 text-yellow-600", icon: "✊" },
                                        { bar: "bg-cyan-400", text: "text-cyan-600", badge: "bg-cyan-100 text-cyan-600", icon: "✋" },
                                        { bar: "bg-indigo-400", text: "text-indigo-600", badge: "bg-indigo-100 text-indigo-600", icon: "🏛️" },
                                        { bar: "bg-green-400", text: "text-green-600", badge: "bg-green-100 text-green-600", icon: "🔒" },
                                        { bar: "bg-gray-400", text: "text-gray-600", badge: "bg-gray-100 text-gray-600", icon: "🚫" },
                                        { bar: "bg-purple-400", text: "text-purple-600", badge: "bg-purple-100 text-purple-600", icon: "😟" },
                                        { bar: "bg-pink-400", text: "text-pink-600", badge: "bg-pink-100 text-pink-600", icon: "❓" },
                                    ];
                                    const color = colorMap[idx % colorMap.length];
                                    const percent = incident.percent?.toFixed(2) || "0.00";
                                    return (
                                        <div key={incident.key} className={`rounded-xl shadow p-6 flex flex-col justify-between ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
                                            <div className="flex items-center mb-2">
                                                <span className="text-2xl mr-2">{color.icon}</span>
                                                <span className={`font-semibold text-lg ${isDarkMode ? "text-white" : "text-gray-800"}`}>{incident.label}</span>
                                                <span className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${color.badge}`}>
                                                    {percent}%
                                                </span>
                                            </div>
                                            <div className={`text-3xl font-bold mb-2 ${color.text}`}>{incident.count}</div>
                                            <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 mb-2">
                                                <div
                                                    className={`h-2 rounded-full ${color.bar} transition-all duration-500`}
                                                    style={{ width: `${percent}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex flex-wrap justify-end gap-6 mt-6 text-sm">
                                <span className="font-semibold">
                                    Total Participants: <span className="text-blue-500">{filteredData?.seriousIncidents.totalParticipants || data.seriousIncidents.totalParticipants}</span>
                                </span>
                                <span className="font-semibold">
                                    Participants Reporting Incidents: <span className="text-blue-500">{filteredData?.seriousIncidents.participantsReportingIncidents || data.seriousIncidents.participantsReportingIncidents}</span>
                                </span>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
};

export default StatsClient;