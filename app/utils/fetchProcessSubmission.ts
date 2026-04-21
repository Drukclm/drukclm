import { supabase } from '../../lib/supabaseClinent';


// Fetch all submissions from Supabase
export async function fetchSubmissions(filters?: any) {
    try {
        const { data, error } = await supabase.from('Submission').select('*');
        if (error) throw error;

        let submissions = (data || []).map((row) => ({
            ...row,
            answers: typeof row.answers === 'string' ? JSON.parse(row.answers) : (row.answers || {}),
        }));

        

        // Apply filters in-memory
        if (filters) {
            submissions = filterSubmissions(submissions, filters);
        }

        return submissions;
    } catch (error) {
        console.error('Error fetching submissions:', error);
        return [];
    }
}


// export function filterSubmissions(submissions: any[], filters: any) {
//     return submissions.filter((s) => {
//         // KPO (network)
//         if (filters.kpo && filters.kpo.length && !filters.kpo.includes(s.network)) return false;

//         // Age Range (Q23)
//         if (filters.age && filters.age.length) {
//             const age = parseInt(s.answers?.["23"], 10);
//             if (!filters.age.some((range: string) => {
//                 if (range === "15-24") return age >= 15 && age <= 24;
//                 if (range === "25-34") return age >= 25 && age <= 34;
//                 if (range === "35-44") return age >= 35 && age <= 44;
//                 if (range === "45-54") return age >= 45 && age <= 54;
//                 if (range === "55+") return age >= 55;
//                 return false;
//             })) return false;
//         }

//         // Gender (Q24)
//         if (filters.gender && filters.gender.length && !filters.gender.includes(s.answers?.["24"])) return false;

//         // Key Population Type (Q25, array)
//         if (filters.kpType && filters.kpType.length) {
//             const kp = s.answers?.["25"];
//             if (!Array.isArray(kp) || !filters.kpType.some((type: string) => kp.includes(type))) return false;
//         }

//         // Region (Q4)
//         if (filters.region && filters.region.length && !filters.region.includes(s.answers?.["4"])) return false;

//         // Dzongkhag (Q3)
//         if (filters.dzongkhag && s.answers?.["3"] !== filters.dzongkhag) return false;

//         // Facility (Q5)
//         if (filters.facility && s.answers?.["5"] !== filters.facility) return false;

//         // Date Range (created_at or Q1/Q2)
//         if (filters.fromDate || filters.toDate) {
//             // Use Q2 (Clinic Visit) or created_at
//             const dateStr = s.answers?.["2"] || s.created_at;
//             if (dateStr) {
//                 const date = new Date(dateStr);
//                 if (filters.fromDate && date < new Date(filters.fromDate)) return false;
//                 if (filters.toDate && date > new Date(filters.toDate)) return false;
//             }
//         }

//         return true;
//     });
// }


// Main function to create report

export function filterSubmissions(
    submissions: any[],
    filters: any,
    regionIdToName: Record<string, string> = {},
    dzongkhagIdToName: Record<string, string> = {},
    facilityIdToName: Record<string, string> = {}
) {
    const KPO_LABEL_TO_KEY: Record<string, string> = {
        LhakSam: "lhak_sam",
        CPA: "chithuen_phendhey",
        PrideBhutan: "pride_Bhutan",
        RPN: "red_purse_network",
        Others: "others",
        lhak_sam: "lhak_sam",
        pride_Bhutan: "pride_Bhutan",
        chithuen_phendhey: "chithuen_phendhey",
        red_purse_network: "red_purse_network",
        pride_bhutan: "pride_Bhutan",
        others: "others",
    };
    console.log(filters);
    

    return submissions.filter((s) => {
        // KPO (network)
        if (filters.kpo && filters.kpo.length) {
            
            const kpoKeys = filters.kpo.map((label: string) => KPO_LABEL_TO_KEY[label] || label);
            if (!kpoKeys.includes(s.network)) return false;
        }

        // Age Range (Q23)
        if (filters.age && filters.age.length) {
            const age = parseInt(s.answers?.["23"], 10);
            if (!filters.age.some((range: string) => {
                if (range === "15-24") return age >= 15 && age <= 24;
                if (range === "25-34") return age >= 25 && age <= 34;
                if (range === "35-44") return age >= 35 && age <= 44;
                if (range === "45-54") return age >= 45 && age <= 54;
                if (range === "55+") return age >= 55;
                return false;
            })) return false;
        }

        // Gender (Q24)
        if (filters.gender && filters.gender.length) {
            const genderAns = s.answers?.["24"];
            if (Array.isArray(genderAns)) {
                // At least one selected gender must match the filter
                if (!filters.gender.some((g: string) => genderAns.includes(g))) return false;
            } else if (typeof genderAns === "string") {
                // Fallback for old data
                if (!filters.gender.includes(genderAns)) return false;
            } else {
                return false;
            }
        }
        // Key Population Type (Q25, array)
        if (filters.kpType && filters.kpType.length) {
            const kp = s.answers?.["25"];
            if (!Array.isArray(kp) || !filters.kpType.some((type: string) => kp.includes(type))) return false;
        }

        // Region (Q4)
        if (filters.region && filters.region.length) {
            const regionNames = filters.region.map((id: string) => regionIdToName[id] || id);
            if (!regionNames.includes(s.answers?.["4"])) return false;
        }

        // Dzongkhag (Q3)
        if (filters.dzongkhag) {
            const dzongkhagName = dzongkhagIdToName[filters.dzongkhag] || filters.dzongkhag;
            if (s.answers?.["3"] !== dzongkhagName) return false;
        }

        // Facility (Q5)
        if (filters.facility) {
            if (String(s.answers?.["5"]) !== String(filters.facility)) return false;
        }

        // Date Range (created_at or Q2)
        if (filters.fromDate || filters.toDate) {
            const dateStr = s.answers?.["2"] || s.created_at;
            if (dateStr) {
                const date = new Date(dateStr);
                if (filters.fromDate && date < new Date(filters.fromDate)) return false;
                if (filters.toDate && date > new Date(filters.toDate)) return false;
            }
        }

        return true;
    });
}

export async function createReport() {
    const submissions = await fetchSubmissions();
    return {
        kpos: calculateNetworkPercentage(submissions),
        totalParticipants: calculateTotalSubmission(submissions),
        ageDistribution: calculateAgeDistribution(submissions),
        genderDistribution: calculateGenderDistribution(submissions),
        keyPopulationDistribution: calculateKeyPopulationDistribution(submissions),
        regionalDistribution: await calculateParticipationByLocation(submissions),
        serviceAvailability: calculateServiceAvailability(submissions),
        serviceAccessibility: calculateServiceAccesibility(submissions),
        serviceAcceptability: calculateServiceAcceptability(submissions),
        serviceSatisfaction: calculateServiceSatisfaction(submissions),
        waitTime: calculateWaitTime(submissions),
        seriousIncidents: calculateSeriousIncidents(submissions)
    };
}

export function calculateTotalSubmission(array: any) {
    return array.length;
}

//calculate the percentage of submission by network
export function calculateNetworkPercentage(array: any) {
    // Add this mapping here too (or import from your page)
    const NETWORK_KEY_MAP: Record<string, string> = {
        "lhak_sam": "LhakSam",
        "chithuen_phendhey": "CPA",
        "pride_Bhutan": "PrideBhutan",
        "red_purse_network": "RPN",
        "others": "Others",
    };

    const networkCounts: Record<string, number> = {};
    array.forEach((s: any) => {
        if (s.network) {
            const displayKey = NETWORK_KEY_MAP[s.network] || "Others";
            networkCounts[displayKey] = (networkCounts[displayKey] || 0) + 1;
        }
    });
    const total = array.length;
    return Object.entries(networkCounts).map(([name, count]) => ({
        name,
        count,
        percentage: total ? Math.round((count / total) * 1000) / 10 : 0,
    }));
}

//for calculating the age distribution for grqh representation
export function calculateAgeDistribution(array: any) {
    const ageBuckets = ["<15","15-24", "25-34", "35-44", "45-54", "55+"];
    const ageCounts = [0, 0, 0, 0, 0, 0];
    array.forEach((s: any) => {
        const age = parseInt(s.answers?.["23"], 10);
        if (!isNaN(age)) {
            if(age<15) ageCounts[0]++;
            if (15 <=age && age < 25) ageCounts[1]++;
            else if (25<=age && age < 35) ageCounts[2]++;
            else if (35<= age && age < 45) ageCounts[3]++;
            else if (45<= age && age < 55) ageCounts[4]++;
            else if(55<=age) ageCounts[5]++;
        }
    });
    const total = array.length;

    const percentages = ageCounts.map(count => total ? Math.round((count / total) * 1000) / 10 : 0);

    return {
        categories: ageBuckets,
        series: ageCounts,
        total,
        percentages,
    };
}

export function calculateGenderDistribution(array: any) {
    const genderBucket = [
        'Man',
        'Woman',
        'Transgender Man',
        'Transgender Woman',
        'Others',
        'Do not want to disclose'
    ];
    const genderCount = Array(genderBucket.length).fill(0);

    array.forEach((s: any) => {
        const genderAns = s.answers?.["24"];
        if (Array.isArray(genderAns)) {
            genderAns.forEach((g: string) => {
                const idx = genderBucket.indexOf(g);
                if (idx !== -1) genderCount[idx]++;
            });
        } else if (typeof genderAns === "string") {
            const idx = genderBucket.indexOf(genderAns);
            if (idx !== -1) genderCount[idx]++;
        }
    });

    const total = array.length;
    const percentages = genderCount.map(count => total ? Math.round((count / total) * 1000) / 10 : 0);

    return {
        categories: genderBucket,
        series: genderCount,
        total,
        percentages,
    };
}

//calculate the key population distribution for graph 
export function calculateKeyPopulationDistribution(array: any) {
    const kpBucket = [
        'Men who have sex with men',
        'Sex worker',
        'Transgender person',
        'People who use drugs and alcohol',
        'People living with HIV',
        'Do not want to disclose',
    ];
    const kpCount = [0, 0, 0, 0, 0, 0];
    array.forEach((s: any) => {
        const kp = s.answers?.["25"];
        if (Array.isArray(kp)) {
            kpBucket.forEach((bucket, idx) => {
                if (kp.includes(bucket)) kpCount[idx]++;
            });
        } else if (typeof kp === "string") {
            // fallback for single string value
            const idx = kpBucket.indexOf(kp);
            if (idx !== -1) kpCount[idx]++;
        }
    });
    const total = array.length;
    const percentages = kpCount.map(count => total ? Math.round((count / total) * 1000) / 10 : 0);
    return {
        categories: kpBucket,
        series: kpCount,
        total,
        percentages,
    };
}


// Calculate participation by facility name for graph representation
// export async function calculateParticipationByLocation(submissions: any) {
//     // Fetch all facilities from DB
//     const { data: facilities, error } = await supabase.from('facility_name').select('id, name');
//     if (error) throw error;

//     // Create a map from id to name
//     const idToName: Record<string, string> = {};
//     facilities.forEach((f: any) => {
//         idToName[String(f.id)] = f.name;
//     });

//     // Count submissions per facility name
//     const facilityCounts: Record<string, number> = {};
//     submissions.forEach((s: any) => {
//         const facilityId = s.answers?.["5"];
//         const facilityName = idToName[facilityId];
//         if (facilityName) {
//             facilityCounts[facilityName] = (facilityCounts[facilityName] || 0) + 1;
//         }
//     });

//     const categories = Object.keys(facilityCounts);
//     const series = categories.map(name => facilityCounts[name]);
//     const total = submissions.length;
//     const percentages = series.map(count => total ? Math.round((count / total) * 1000) / 10 : 0);

//     return {
//         categories,
//         series,
//         total,
//         percentages,
//     };
// }

/**
 * Calculates participation by region for graph representation.
 * Returns:
 * {
 *   categories: string[], // region names
 *   series: number[],     // counts per region
 *   total: number,        // total submissions
 *   percentages: number[] // percent per region
 * }
 */
export function calculateParticipationByLocation(submissions: any[]) {
    // Collect all region names from submissions
    const regionCounts: Record<string, number> = {};
    submissions.forEach((s: any) => {
        const region = s.answers?.["3"];
        if (region) {
            regionCounts[region] = (regionCounts[region] || 0) + 1;
        }
    });

    const categories = Object.keys(regionCounts);
    const series = categories.map(region => regionCounts[region]);
    const total = submissions.length;
    const percentages = series.map(count => total ? Math.round((count / total) * 1000) / 10 : 0);

    return {
        categories,
        series,
        total,
        percentages,
    };
}



/**
 * Calculates service availability (sought vs received) for all services (6a–6s).
 * Returns: { categories: string[], sought: number[], received: number[], unmet: number[], total: number }
 */
export function calculateServiceAvailability(submissions: any[]) {
    const serviceMappings = [
        { sought: '6a', received: '6aa', label: 'Condom supply' },
        { sought: '6b', received: '6bb', label: 'Lubricant supply' },
        { sought: '6c', received: '6cc', label: 'PrEP initiation sought' },
        { sought: '6d', received: '6dd', label: 'PrEP refill sought' },
        { sought: '6e', received: '6ee', label: 'HIV Testing' },
        { sought: '6f', received: '6ff', label: 'HIV Confirmation Test' },
        { sought: '6g', received: '6gg', label: 'HIV counseling' },
        { sought: '6h', received: '6hh', label: 'STI testing/diagnosis' },
        { sought: '6i', received: '6ii', label: 'ART Initiation' },
        { sought: '6j', received: '6jj', label: 'ART Counselling' },
        { sought: '6k', received: '6kk', label: 'ART Refill' },
        { sought: '6l', received: '6ll', label: 'Other STI Treatment' },
        { sought: '6m', received: '6mm', label: 'Viral Load Testing' },
        { sought: '6n', received: '6nn', label: 'CD4 Testing' },
        { sought: '6o', received: '6oo', label: 'Opportunistic infection management and medicine' },
        { sought: '6p', received: '6pp', label: 'Detoxification for drugs and alcohol' },
        { sought: '6q', received: '6qq', label: 'Rehabilitation services for drugs and alcohol' },
        { sought: '6r', received: '6rr', label: 'Hospital based SUD treatment' },
        { sought: '6s', received: '6ss', label: 'Other HIV services' },
        { sought: '6t', received: '6tt', label: 'TB Services' },
        { sought: '6u', received: '6uu', label: 'Other Health conditions' },
    ];

    const categories: string[] = [];
    const sought: number[] = [];
    const received: number[] = [];
    const unmet: number[] = [];

    serviceMappings.forEach(({ sought: soughtKey, received: receivedKey, label }) => {
        let soughtCount = 0;
        let receivedCount = 0;
        // submissions.forEach((s) => {
        //     if (s.answers?.[soughtKey] === "Yes") soughtCount++;
        //     if (s.answers?.[receivedKey] === "Yes") receivedCount++;
        // });
        submissions.forEach((s) => {
    // Ensure received is only counted if the service was first sought
    if (s.answers?.[soughtKey] === "Yes") {
        soughtCount++;

        if (s.answers?.[receivedKey] === "Yes") {
            receivedCount++;
        }
    }
});
        categories.push(label);
        sought.push(soughtCount);
        received.push(receivedCount);
        unmet.push(Math.max(soughtCount - receivedCount, 0));
    });

    const totalServicesSought = sought.reduce((a, b) => a + b, 0);
    const totalServicesReceived = received.reduce((a, b) => a + b, 0);
    const unmetServiceRequests = unmet.reduce((a, b) => a + b, 0);
    const serviceFulfillmentRate = totalServicesSought
        ? Math.round((totalServicesReceived / totalServicesSought) * 1000) / 10
        : 0;

    return {
        categories,
        sought,
        received,
        unmet,
        total: submissions.length,
        summary: {
            totalServicesSought,
            totalServicesReceived,
            unmetServiceRequests,
            serviceFulfillmentRate, // as percentage, e.g. 96.3
        },
    };
}
/**
 * Calculates service accessibility for questions 7, 8, 9, 10a.
 * Returns:
 * {
 *   categories: string[],
 *   yes: number[],
 *   no: number[],
 *   total: number,
 *   percentages: { yes: number[], no: number[] },
 *   details: [
 *     { key, label, yes, no, yesPercent, noPercent, total }
 *   ]
 * }
 */
export function calculateServiceAccesibility(submissions: any[]) {
    // Define mapping for each accessibility question
    const accessibilityMappings = [
        { key: "7", label: "Safety of Location" },
        { key: "8", label: "Convenient Location" },
        { key: "9", label: "Optimal Hours" },
        { key: "10a", label: "Service Affordability" },
    ];

    const categories: string[] = [];
    const yes: number[] = [];
    const no: number[] = [];
    const details: any[] = [];

    accessibilityMappings.forEach(({ key, label }) => {
        let yesCount = 0;
        let noCount = 0;
        submissions.forEach((s) => {
            const ans = s.answers?.[key];
            if (ans === "Yes") yesCount++;
            else if (ans === "No") noCount++;
        });
        const total = yesCount + noCount;
        const yesPercent = total ? Math.round((yesCount / total) * 100) : 0;
        const noPercent = total ? Math.round((noCount / total) * 100) : 0;

        categories.push(label);
        yes.push(yesCount);
        no.push(noCount);
        details.push({
            key,
            label,
            yes: yesCount,
            no: noCount,
            yesPercent,
            noPercent,
            total,
        });
    });

    // For overall total responses (should be the same for all, but take max just in case)
    const total = Math.max(...details.map(d => d.total));

    return {
        categories,
        yes,
        no,
        total,
        percentages: {
            yes: details.map(d => d.yesPercent),
            no: details.map(d => d.noPercent),
        },
        details,
    };
}


/**
 * Calculates service acceptability and quality for graph representation.
 * Returns:
 * {
 *   acceptability: {
 *     aspects: string[],
 *     yes: number[],
 *     no: number[],
 *     yesPercent: number[],
 *     noPercent: number[],
 *     total: number,
 *     positive: number,
 *     positivePercent: number,
 *     details: { key, label, yes, no, yesPercent, noPercent, total }[]
 *   },
 *   quality: {
 *     aspects: string[],
 *     yes: number[],
 *     no: number[],
 *     yesPercent: number[],
 *     noPercent: number[],
 *     total: number,
 *     positive: number,
 *     positivePercent: number,
 *     details: { key, label, yes, no, yesPercent, noPercent, total }[]
 *   }
 * }
 */
export function calculateServiceAcceptability(submissions: any[]) {
    // Acceptability aspects (Q11, Q12, Q14, Q15)
    const acceptabilityMappings = [
        { key: "11", label: "Respectful Treatment" },
        { key: "12", label: "Consent Sought" },
        { key: "14", label: "Privacy Breach" },
        { key: "15", label: "Confidentiality Breach" },
    ];
    // Quality aspects (Q13, Q14, Q15)
    const qualityMappings = [
        { key: "13", label: "Information Received" },
        { key: "14", label: "Questions Answered" },
        { key: "15", label: "Items Received" },
    ];

    function processMappings(mappings: { key: string, label: string }[]) {
        const aspects: string[] = [];
        const yes: number[] = [];
        const no: number[] = [];
        const yesPercent: number[] = [];
        const noPercent: number[] = [];
        const details: any[] = [];
        let positive = 0;
        let total = 0;

        mappings.forEach(({ key, label }) => {
            let yesCount = 0;
            let noCount = 0;
            submissions.forEach((s) => {
                const ans = s.answers?.[key];
                if (ans === "Yes") yesCount++;
                else if (ans === "No") noCount++;
            });
            const aspectTotal = yesCount + noCount;
            const aspectYesPercent = aspectTotal ? Math.round((yesCount / aspectTotal) * 100) : 0;
            const aspectNoPercent = aspectTotal ? Math.round((noCount / aspectTotal) * 100) : 0;
            aspects.push(label);
            yes.push(yesCount);
            no.push(noCount);
            yesPercent.push(aspectYesPercent);
            noPercent.push(aspectNoPercent);
            details.push({
                key,
                label,
                yes: yesCount,
                no: noCount,
                yesPercent: aspectYesPercent,
                noPercent: aspectNoPercent,
                total: aspectTotal,
            });
            positive += yesCount;
            total += aspectTotal;
        });

        const positivePercent = total ? Math.round((positive / total) * 100) : 0;

        return {
            aspects,
            yes,
            no,
            yesPercent,
            noPercent,
            total,
            positive,
            positivePercent,
            details,
        };
    }

    return {
        acceptability: processMappings(acceptabilityMappings),
        quality: processMappings(qualityMappings),
    };
}

/**
 * Calculates service satisfaction (Q17) for graph representation.
 * Returns:
 * {
 *   average: number,
 *   total: number,
 *   distribution: number[], // [5 stars, 4 stars, 3 stars, 2 stars, 1 star]
 *   categories: string[],   // ["5 Stars", "4 Stars", ...]
 * }
 */
export function calculateServiceSatisfaction(submissions: any[]) {
    // Distribution: [5 stars, 4 stars, 3 stars, 2 stars, 1 star]
    const distribution = [0, 0, 0, 0, 0];
    let sum = 0;
    let count = 0;

    submissions.forEach((s) => {
        const val = parseInt(s.answers?.["17"], 10);
        if (val >= 1 && val <= 5) {
            distribution[5 - val]++; // 5-star at index 0, 1-star at index 4
            sum += val;
            count++;
        }
    });

    const average = count ? Math.round((sum / count) * 10) / 10 : 0;
    const categories = ["5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Star"];

    return {
        average,
        total: count,
        distribution,
        categories,
    };
}




/**
 * Calculates wait time distribution and summary statistics from Q16.
 * Returns:
 * {
 *   histogram: number[], // counts per bucket
 *   categories: string[], // bucket labels
 *   average: number,
 *   median: number,
 *   max: number,
 *   total: number
 * }
 */
export function calculateWaitTime(submissions: any[]) {
    // Define buckets (in minutes)

    const totalPetient = submissions.length;
    const buckets = [
        { min: 0, max: 60, label: "0-60" },
        { min: 60, max: 120, label: "60-120" },
        { min: 120, max: 180, label: "120-180" },
        { min: 180, max: 240, label: "180-240" },
        { min: 240, max: 300, label: "240-300" },
        { min: 300, max: 360, label: "300-360" },
        { min: 360, max: 420, label: "360-420" },
        { min: 420, max: Infinity, label: "420+" },
    ];

    // Collect all valid wait times
    const waitTimes: number[] = [];
    submissions.forEach((s) => {
        const val = parseInt(s.answers?.["16"], 10);
        if (!isNaN(val) && val >= 0) waitTimes.push(val);
    });


    // Build histogram
    const histogram = Array(buckets.length).fill(0);
    waitTimes.forEach((wt) => {
        const idx = buckets.findIndex(b => wt >= b.min && wt < b.max);
        if (idx !== -1) histogram[idx]++;
    });

    // Calculate stats
    const total = waitTimes.length;
    const average = total ? Math.round((waitTimes.reduce((a, b) => a + b, 0) / total) * 10) / 10 : 0;
    const sorted = [...waitTimes].sort((a, b) => a - b);
    const median = total
        ? (total % 2 === 1
            ? sorted[Math.floor(total / 2)]
            : Math.round(((sorted[total / 2 - 1] + sorted[total / 2]) / 2) * 10) / 10)
        : 0;
    const max = total ? Math.max(...waitTimes) : 0;

    return {
        histogram,
        categories: buckets.map(b => b.label),
        average,
        median,
        max,
        total: totalPetient,
    };
}


/**
 * Calculates serious incidents (Q18a as multi-select OR Q18a–Q18h as individual yes/no) for graph representation.
 * Returns:
 * {
 *   categories: string[],
 *   counts: number[],
 *   percentages: number[],
 *   totalParticipants: number,
 *   participantsReportingIncidents: number,
 *   details: { key, label, count, percent }[]
 * }
 */
export function calculateSeriousIncidents(submissions: any[]) {
    // Short, user-friendly labels for UI
    const incidentLabels = [
        'Stigma/Discrimination',
        'Violence',
        'Harassment',
        'Privacy Breach',
        'Confidentiality Breach',
        'Refused Service',
        'Physical/Mental Distress',
        'Other'
    ];

    // Map old keys to new labels for backward compatibility
    const oldKeyToLabel: Record<string, string> = {
        "18a": incidentLabels[0],
        "18b": incidentLabels[1],
        "18c": incidentLabels[2],
        "18d": incidentLabels[3],
        "18e": incidentLabels[4],
        "18f": incidentLabels[5],
        "18g": incidentLabels[6],
        "18h": incidentLabels[7],
    };

    // Map long-form new labels (from multi-select) to short labels
    const longToShort: Record<string, string> = {
        'Stigma and discrimination (negative attitude towards you or treated you unfairly by health worker during your visit because of your identity as Key Population': incidentLabels[0],
        'Violence (such as verbal abuse, physical abuse, sexual abuse, negligence by staff or person at the health facility)': incidentLabels[1],
        'Harassment (including sexual) from the service staff or other clients': incidentLabels[2],
        'Breach of privacy (physical privacy maintained)': incidentLabels[3],
        'Breach of confidentiality was your information shared with others without your consent)': incidentLabels[4],
        'Refused service because of gender, identity case, risk behaviors or other': incidentLabels[5],
        'Physical pain or mental distress': incidentLabels[6],
        'Other': incidentLabels[7],
    };

    // Initialize counts
    const counts = Array(incidentLabels.length).fill(0);

    // Count for each incident type
    submissions.forEach((s) => {
        const ans18a = s.answers?.["18a"];
        // New format: 18a is an array of selected incidents (long labels)
        if (Array.isArray(ans18a)) {
            ans18a.forEach((longLabel: string) => {
                const shortLabel = longToShort[longLabel];
                const idx = incidentLabels.indexOf(shortLabel);
                if (idx !== -1) counts[idx]++;
            });
        } else {
            // Old format: 18a–18h are individual yes/no
            Object.entries(oldKeyToLabel).forEach(([key, shortLabel], idx) => {
                if (s.answers?.[key] === "Yes") counts[idx]++;
            });
        }
    });

    const totalParticipants = submissions.length;
    // Number of participants who reported at least one incident
    const participantsReportingIncidents = submissions.filter(s => {
        const ans18a = s.answers?.["18a"];
        if (Array.isArray(ans18a)) {
            return ans18a.length > 0;
        } else {
            // Old format: any of 18a–18h is "Yes"
            return Object.keys(oldKeyToLabel).some(key => s.answers?.[key] === "Yes");
        }
    }).length;

    // Calculate percentages for each incident type (of all who reported any incident)
    const percentBase = participantsReportingIncidents || 1; // avoid division by zero
    const percentages = counts.map(count => Math.round((count / percentBase) * 10000) / 100);

    const details = incidentLabels.map((label, idx) => ({
        key: idx,
        label,
        count: counts[idx],
        percent: percentages[idx],
    }));

    return {
        categories: incidentLabels,
        counts,
        percentages,
        totalParticipants,
        participantsReportingIncidents,
        details,
    };
}




// export function calculateSeriousIncidents(submissions: any[]) {
//     // Define mapping for each incident question
//     const incidentMappings = [
//         { key: "18a", label: "Stigma and Discrimination (A8)" },
//         { key: "18b", label: "Violence" },
//         { key: "18c", label: "Harassment" },
//         { key: "18d", label: "Breach of Privacy" },
//         { key: "18e", label: "Breach of Confidentiality" },
//         { key: "18f", label: "Refused Service" },
//         { key: "18g", label: "Physical/Mental Distress" },
//         { key: "18h", label: "Other Issues" },
//     ];

//     const categories: string[] = [];
//     const counts: number[] = [];
//     const percentages: number[] = [];
//     const details: any[] = [];

//     // Count for each incident type
//     incidentMappings.forEach(({ key, label }) => {
//         let count = 0;
//         submissions.forEach((s) => {
//             if (s.answers?.[key] === "Yes") count++;
//         });
//         categories.push(label);
//         counts.push(count);
//         details.push({ key, label, count });
//     });

//     const totalParticipants = submissions.length;
//     // Number of participants who reported at least one incident
//     const participantsReportingIncidents = submissions.filter(s =>
//         incidentMappings.some(({ key }) => s.answers?.[key] === "Yes")
//     ).length;

//     // Calculate percentages for each incident type (of all who reported any incident)
//     const percentBase = participantsReportingIncidents || 1; // avoid division by zero
//     details.forEach(d => {
//         d.percent = Math.round((d.count / percentBase) * 10000) / 100; // e.g. 50.63
//         percentages.push(d.percent);
//     });

//     return {
//         categories,
//         counts,
//         percentages,
//         totalParticipants,
//         participantsReportingIncidents,
//         details,
//     };
// }