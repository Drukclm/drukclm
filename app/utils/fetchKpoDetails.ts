import { supabase } from "@/lib/supabaseClinent";
import { fetchSubmissions, filterSubmissions } from "./fetchProcessSubmission"


/**
 * Fetches all Dzongkhags (facility locations) from Supabase.
 * Returns: Array<{ name: string, id: number, region_id: number }>
 */
export async function fetchDzongkhags() {
    const { data, error } = await supabase
        .from("facility_location")
        .select("id, name, region_id");
    if (error) {
        console.error("Error fetching Dzongkhags:", error);
        return [];
    }
    return data || [];
}


/**
 * Fetches all Regions from Supabase.
 * Returns: Array<{ id: number, name: string }>
 */
export async function fetchRegions() {
    const { data, error } = await supabase
        .from("Region")
        .select("id, name");
    if (error) {
        console.error("Error fetching Regions:", error);
        return [];
    }
    return data || [];
}

export async function getKpoReport(filters?: any) {
    const data = await fetchSubmissions(filters);


    const report = {
        totalNumber: data.length,
        weeklyNumber: await getweeklySubmissionsNumber(filters),
        serviceAvailability: getServiceAvailabilitySummary(data),
        serviceAccessibility: getServiceAccessibilitySummary(data),
        getServiceAcceptabilitySummary: getServiceAcceptabilitySummary(data),
        calculateDzongkhagDistribution: calculateDzongkhagDistribution(data, await fetchDzongkhags()),
        calculateKPOGenderDistribution: calculateKPOGenderDistribution(data),
        calculateKpoKeyPopulationDistribution: calculateKpoKeyPopulationDistribution(data),
        calculateServiceFacilityStats: await calculateServiceFacilityStats(data),
        calculateRegionDistribution: calculateRegionDistribution(data, await fetchRegions()),
        calculateAgeDistribution: calculateAgeDistribution(data),
    }
    return report;


}



export const getweeklySubmissionsNumber = async (filters?: { kpo?: string }) => {
    // Get today's date and 7 days ago in UTC
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    // Format dates as YYYY-MM-DD for Supabase/Postgres
    const todayStr = today.toISOString().split("T")[0];
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0];

    // Build Supabase query
    let query = supabase
        .from("Submission")
        .select("id,created_at,network", { count: "exact", head: false })
        .gte("created_at", sevenDaysAgoStr)
        .lte("created_at", todayStr);

    if (filters?.kpo) {
        query = query.eq("network", filters.kpo);
    }

    const { data, count, error } = await query;

    if (error) {
        console.error("Error fetching weekly submissions:", error);
        return 0;
    }

    // Return the count (number of submissions in the last week for this KPO)
    return count ?? 0;
};



/**
 * Returns service availability summary:
 * {
 *   mostSought: { label, count },
 *   leastSought: { label, count },
 *   mostReceived: { label, count },
 *   leastReceived: { label, count }
 * }
 */
export function getServiceAvailabilitySummary(submissions: any[]) {
    // Map question keys to labels
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

    // Count "Yes" for each service
    const soughtCounts = serviceMappings.map(({ sought }) =>
        submissions.reduce((acc, s) => acc + (s.answers?.[sought] === "Yes" ? 1 : 0), 0)
    );
    const receivedCounts = serviceMappings.map(({ received }) =>
        submissions.reduce((acc, s) => acc + (s.answers?.[received] === "Yes" ? 1 : 0), 0)
    );

    // Find max/min for sought
    const maxSoughtIdx = soughtCounts.indexOf(Math.max(...soughtCounts));
    const minSoughtIdx = soughtCounts.indexOf(Math.min(...soughtCounts));
    // Find max/min for received
    const maxReceivedIdx = receivedCounts.indexOf(Math.max(...receivedCounts));
    const minReceivedIdx = receivedCounts.indexOf(Math.min(...receivedCounts));

    return {
        mostSought: {
            label: serviceMappings[maxSoughtIdx].label,
            count: soughtCounts[maxSoughtIdx],
        },
        leastSought: {
            label: serviceMappings[minSoughtIdx].label,
            count: soughtCounts[minSoughtIdx],
        },
        mostReceived: {
            label: serviceMappings[maxReceivedIdx].label,
            count: receivedCounts[maxReceivedIdx],
        },
        leastReceived: {
            label: serviceMappings[minReceivedIdx].label,
            count: receivedCounts[minReceivedIdx],
        },
        // Optionally, return all counts for charting
        soughtCounts: serviceMappings.map((m, i) => ({ label: m.label, count: soughtCounts[i] })),
        receivedCounts: serviceMappings.map((m, i) => ({ label: m.label, count: receivedCounts[i] })),
    };
}

/**
 * Returns service accessibility summary for charting.
 * {
 *   categories: string[],
 *   yes: number[],
 *   no: number[],
 *   details: [
 *     { key, label, yes, no, yesPercent, noPercent, total }
 *   ]
 * }
 */
export function getServiceAccessibilitySummary(submissions: any[]) {
    // Define mapping for each accessibility question
    const accessibilityMappings = [
        { key: "7", label: "Safe Location" },
        { key: "8", label: "Convenient Location" },
        { key: "9", label: "Suitable Opening Hrs" },
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

    return {
        categories,
        yes,
        no,
        details,
    };
}

/**
 * Calculates Service Acceptability:
 * - Respectful Treatment (Q11)
 * - Consent Sought (Q12)
 * Returns { respectful: number, consent: number }
 */
export function getServiceAcceptabilitySummary(submissions: any[]) {
    const total = submissions.length || 1; // avoid division by zero

    // Count "Yes" for Q11 and Q12
    const respectfulCount = submissions.reduce(
        (acc, s) => acc + (s.answers?.["11"] === "Yes" ? 1 : 0),
        0
    );
    const consentCount = submissions.reduce(
        (acc, s) => acc + (s.answers?.["12"] === "Yes" ? 1 : 0),
        0
    );

    return {
        respectful: Math.round((respectfulCount / total) * 100),
        consent: Math.round((consentCount / total) * 100),
        total,
        respectfulCount,
        consentCount,
    };
}





/**
 * Returns chart data for Dzongkhag distribution.
 * @param submissions Array of submissions (filtered for KPO if needed)
 * @param dzongkhags Array of all dzongkhags from fetchDzongkhags()
 * @returns { categories: string[], counts: number[], details: { dzongkhag: string, count: number }[] }
 */
export function calculateDzongkhagDistribution(
    submissions: { answers: { [key: string]: string } }[],
    dzongkhags: { name: string }[]
): {
    categories: string[];
    counts: number[];
    details: { dzongkhag: string; count: number }[];
} {
    // Build a map of dzongkhag name -> count
    const dzongkhagCounts: Record<string, number> = {};
    dzongkhags.forEach((dz) => {
        dzongkhagCounts[dz.name] = 0;
    });

    submissions.forEach((s) => {
        const dzongkhag = s.answers?.["3"];
        if (dzongkhag && dzongkhagCounts.hasOwnProperty(dzongkhag)) {
            dzongkhagCounts[dzongkhag]++;
        }
    });

    const categories = dzongkhags.map(dz => dz.name);
    const counts = categories.map(name => dzongkhagCounts[name] || 0);
    const details = categories.map((dzongkhag, i) => ({
        dzongkhag,
        count: counts[i],
    }));

    return { categories, counts, details };
}


//////////////////// ============== clm perticipation ============== ////////////////////




/**
 * Calculate the gender distribution of a given array of submissions, filtered for KPO if needed.
 * Returns a chart data object with categories, series, total, and percentages.
 */
export function calculateKPOGenderDistribution(array: any) {
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
export function calculateKpoKeyPopulationDistribution(array: any) {
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


/**
 * Calculates Service Facility stats for dashboard.
 * Returns:
 * {
 *   categories: string[], // service facility names
 *   series: number[],     // counts per facility
 *   total: number,
 *   details: { id: number, name: string, count: number }[]
 * }
 */
export async function calculateServiceFacilityStats(submissions: any[]) {
    //  Fetch all service facilities
    const { data: serviceFacilities, error: sfError } = await supabase
        .from('service_facility')
        .select('id, name');
    if (sfError) {
        console.error("Error fetching service_facility:", sfError);
        return { categories: [], series: [], total: 0, details: [] };
    }

    //  Fetch all facility_name records with their service_facility
    const { data: facilityNames, error: fnError } = await supabase
        .from('facility_name')
        .select('id, service_facility');
    if (fnError) {
        console.error("Error fetching facility_name:", fnError);
        return { categories: [], series: [], total: 0, details: [] };
    }

    //  Map facility_name id to service_facility id
    const facilityIdToServiceFacilityId: Record<string, number> = {};
    facilityNames.forEach((f: any) => {
        facilityIdToServiceFacilityId[String(f.id)] = f.service_facility;
    });

    //  Count submissions per service facility
    const sfIdToCount: Record<number, number> = {};
    serviceFacilities.forEach((sf: any) => {
        sfIdToCount[sf.id] = 0;
    });

    submissions.forEach((s: any) => {
        const facilityNameId = s.answers?.["5"];
        const sfId = facilityIdToServiceFacilityId[String(facilityNameId)];
        if (sfId && sfIdToCount.hasOwnProperty(sfId)) {
            sfIdToCount[sfId]++;
        }
    });

    // 5. Prepare chart data
    const categories = serviceFacilities.map((sf: any) => sf.name);
    const series = serviceFacilities.map((sf: any) => sfIdToCount[sf.id] || 0);
    const details = serviceFacilities.map((sf: any) => ({
        id: sf.id,
        name: sf.name,
        count: sfIdToCount[sf.id] || 0,
    }));

    return {
        categories,
        series,
        total: submissions.length,
        details,
    };
}



/**
 * Calculates CLM participation by KPO for graph representation.
 * Returns:
 * {
 *   categories: string[],   // ["LhakSam", "CPA", "PrideBhutan", "RPN", "Others"]
 *   series: number[],       // [count, count, ...]
 *   total: number,          // total submissions
 *   percentages: number[],  // [%, %, ...]
 * }
 */
export function calculateClmParticipationByKPO(submissions: any[]) {
    // Map network keys to display names (same as your donut chart)
    const NETWORK_KEY_MAP: Record<string, string> = {
        "lhak_sam": "LhakSam",
        "chithuen_phendhey": "CPA",
        "pride_Bhutan": "PrideBhutan",
        "red_purse_network": "RPN",
        "others": "Others",
    };

    // Initialize counts for all KPOs (to ensure 0s are shown)
    const kpoBuckets = ["LhakSam", "CPA", "PrideBhutan", "RPN", "Others"];
    const kpoCounts: Record<string, number> = {};
    kpoBuckets.forEach(kpo => { kpoCounts[kpo] = 0; });

    // Count submissions per KPO
    submissions.forEach((s: any) => {
        const displayKey = NETWORK_KEY_MAP[s.network] || "Others";
        if (kpoCounts[displayKey] !== undefined) {
            kpoCounts[displayKey]++;
        }
    });

    const total = submissions.length;
    const categories = kpoBuckets;
    const series = categories.map(kpo => kpoCounts[kpo]);
    const percentages = series.map(count => total ? Math.round((count / total) * 1000) / 10 : 0);

    return {
        categories,   // ["LhakSam", "CPA", "PrideBhutan", "RPN", "Others"]
        series,       // [count, count, ...]
        total,        // total submissions
        percentages,  // [%, %, ...]
    };
}

/**
 * Returns chart data for Region distribution.
 * @param submissions Array of submissions (filtered for KPO if needed)
 * @param regions Array of all regions from fetchRegions()
 * @returns { categories: string[], counts: number[], details: { region: string, count: number }[] }
 */
export function calculateRegionDistribution(
    submissions: { answers: { [key: string]: string } }[],
    regions: { name: string }[]
): {
    categories: string[];
    counts: number[];
    details: { region: string; count: number }[];
} {
    // Build a map of region name -> count
    const regionCounts: Record<string, number> = {};
    regions.forEach((r) => {
        regionCounts[r.name] = 0;
    });

    submissions.forEach((s) => {
        const region = s.answers?.["4"];
        if (region && regionCounts.hasOwnProperty(region)) {
            regionCounts[region]++;
        }
    });

    const categories = regions.map(r => r.name);
    const counts = categories.map(name => regionCounts[name] || 0);
    const details = categories.map((region, i) => ({
        region,
        count: counts[i],
    }));

    return { categories, counts, details };
}



//for calculating the age distribution for grqh representation
export function calculateAgeDistribution(array: any) {
    const ageBuckets = ["15-24", "25-34", "35-44", "45-54", "55+"];
    const ageCounts = [0, 0, 0, 0, 0];
    array.forEach((s: any) => {
        const age = parseInt(s.answers?.["23"], 10);
        if (!isNaN(age)) {
            if (age < 25) ageCounts[0]++;
            else if (age < 35) ageCounts[1]++;
            else if (age < 45) ageCounts[2]++;
            else if (age < 55) ageCounts[3]++;
            else ageCounts[4]++;
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


/////////////////////////==============Service availablity==============////////////////

/**
 * Returns service availability stats for a single KPO:
 * - Table: for each service, show this KPO's sought count, % of total sought, received count, % of sought received
 * - Chart: categories, soughtPercent (of total), receivedPercent (of sought)
 */
// export function getKpoServiceAvailabilityStats(submissions: any[], kpoName: string) {
//     // Service mappings
//     const serviceMappings = [
//         { sought: '6a', received: '6aa', label: 'Condom supply' },
//         { sought: '6b', received: '6bb', label: 'Lubricant supply' },
//         { sought: '6c', received: '6cc', label: 'PrEP initiation sought' },
//         { sought: '6d', received: '6dd', label: 'PrEP refill sought' },
//         { sought: '6e', received: '6ee', label: 'HIV Testing' },
//         { sought: '6f', received: '6ff', label: 'HIV Confirmation Test' },
//         { sought: '6g', received: '6gg', label: 'HIV counseling' },
//         { sought: '6h', received: '6hh', label: 'STI testing/diagnosis' },
//         { sought: '6i', received: '6ii', label: 'ART Initiation' },
//         { sought: '6j', received: '6jj', label: 'ART Counselling' },
//         { sought: '6k', received: '6kk', label: 'ART Refill' },
//         { sought: '6l', received: '6ll', label: 'Other STI Treatment' },
//         { sought: '6m', received: '6mm', label: 'Viral Load Testing' },
//         { sought: '6n', received: '6nn', label: 'CD4 Testing' },
//         { sought: '6o', received: '6oo', label: 'Opportunistic infection management and medicine' },
//         { sought: '6p', received: '6pp', label: 'Detoxification for drugs and alcohol' },
//         { sought: '6q', received: '6qq', label: 'Rehabilitation services for drugs and alcohol' },
//         { sought: '6r', received: '6rr', label: 'Hospital based SUD treatment' },
//         { sought: '6s', received: '6ss', label: 'Other HIV services' },
//         { sought: '6t', received: '6tt', label: 'TB Services' },
//         { sought: '6u', received: '6uu', label: 'Other Health conditions' },
//     ];

//     // All submissions (all KPOs)
//     const totalSought = serviceMappings.map(({ sought }) =>
//         submissions.reduce((acc, s) => acc + (s.answers?.[sought] === "Yes" ? 1 : 0), 0)
//     );
//     // console.log(kpoName);


//     // Submissions for this KPO only
//     const kpoSubs = filterSubmissions(submissions, { kpo: [kpoName] })
//     //submissions.filter(s => s.network === kpoName);



//     const kpoSought = serviceMappings.map(({ sought }) =>
//         kpoSubs.reduce((acc, s) => acc + (s.answers?.[sought] === "Yes" ? 1 : 0), 0)
//     );
//     const kpoReceived = serviceMappings.map(({ received }) =>
//         kpoSubs.reduce((acc, s) => acc + (s.answers?.[received] === "Yes" ? 1 : 0), 0)
//     );

//     // Table rows
//     const table = serviceMappings.map((m, i) => {
//         const sought = kpoSought[i];
//         const received = kpoReceived[i];
//         const totalS = totalSought[i];
//         return {
//             label: m.label,
//             sought,
//             soughtPercentOfTotal: totalS ? Math.round((sought / totalS) * 1000) / 10 : 0, // % of all sought for this service
//             received,
//             receivedPercentOfSought: sought ? Math.round((received / sought) * 1000) / 10 : 0, // % of this KPO's sought that were received
//             totalSought: totalS,
//         };
//     });

//     // For chart: percent of total sought, percent received (of sought)
//     const categories = serviceMappings.map(m => m.label);
//     const soughtPercent = table.map(row => row.soughtPercentOfTotal);
//     const receivedPercent = table.map(row => row.receivedPercentOfSought);

//     return {
//         table, // for table rendering
//         chart: {
//             categories,
//             soughtPercent,
//             receivedPercent,
//         }
//     };
// }





// Helper: Gender buckets as per your dashboard

// export function getKpoServiceAvailabilityStats(submissions: any[], kpoName: string) {
//     // Service mappings
//     const serviceMappings = [
//         { sought: '6a', received: '6aa', label: 'Condom supply' },
//         { sought: '6b', received: '6bb', label: 'Lubricant supply' },
//         { sought: '6c', received: '6cc', label: 'PrEP initiation sought' },
//         { sought: '6d', received: '6dd', label: 'PrEP refill sought' },
//         { sought: '6e', received: '6ee', label: 'HIV Testing' },
//         { sought: '6f', received: '6ff', label: 'HIV Confirmation Test' },
//         { sought: '6g', received: '6gg', label: 'HIV counseling' },
//         { sought: '6h', received: '6hh', label: 'STI testing/diagnosis' },
//         { sought: '6i', received: '6ii', label: 'ART Initiation' },
//         { sought: '6j', received: '6jj', label: 'ART Counselling' },
//         { sought: '6k', received: '6kk', label: 'ART Refill' },
//         { sought: '6l', received: '6ll', label: 'Other STI Treatment' },
//         { sought: '6m', received: '6mm', label: 'Viral Load Testing' },
//         { sought: '6n', received: '6nn', label: 'CD4 Testing' },
//         { sought: '6o', received: '6oo', label: 'Opportunistic infection management and medicine' },
//         { sought: '6p', received: '6pp', label: 'Detoxification for drugs and alcohol' },
//         { sought: '6q', received: '6qq', label: 'Rehabilitation services for drugs and alcohol' },
//         { sought: '6r', received: '6rr', label: 'Hospital based SUD treatment' },
//         { sought: '6s', received: '6ss', label: 'Other HIV services' },
//         { sought: '6t', received: '6tt', label: 'TB Services' },
//         { sought: '6u', received: '6uu', label: 'Other Health conditions' },
//     ];

//     // All submissions (all KPOs)
//     const totalSought = serviceMappings.map(({ sought }) =>
//         submissions.reduce((acc, s) => acc + (s.answers?.[sought] === "Yes" ? 1 : 0), 0)
//     );
//     // console.log(kpoName);


//     // if it is admin we have to give all the data 

//     let kpoSubs;
//     if (kpoName != "admin") {
//         kpoSubs = filterSubmissions(submissions, { kpo: [kpoName] })
//     }
//     else{
//         kpoSubs = submissions;
//     }

//     console.log(kpoSubs);

//     // Submissions for this KPO only
//     //submissions.filter(s => s.network === kpoName);



//     const kpoSought = serviceMappings.map(({ sought }) =>
//         kpoSubs.reduce((acc, s) => acc + (s.answers?.[sought] === "Yes" ? 1 : 0), 0)
//     );
//     const kpoReceived = serviceMappings.map(({ received }) =>
//         kpoSubs.reduce((acc, s) => acc + (s.answers?.[received] === "Yes" ? 1 : 0), 0)
//     );

//     // Table rows
//     const table = serviceMappings.map((m, i) => {
//         const sought = kpoSought[i];
//         const received = kpoReceived[i];
//         const totalS = totalSought[i];
//         return {
//             label: m.label,
//             sought,
//             soughtPercentOfTotal: totalS ? Math.round((sought / totalS) * 1000) / 10 : 0, // % of all sought for this service
//             received,
//             receivedPercentOfSought: sought ? Math.round((received / sought) * 1000) / 10 : 0, // % of this KPO's sought that were received
//             totalSought: totalS,
//         };
//     });

//     // For chart: percent of total sought, percent received (of sought)
//     const categories = serviceMappings.map(m => m.label);
//     const soughtPercent = table.map(row => row.soughtPercentOfTotal);
//     const receivedPercent = table.map(row => row.receivedPercentOfSought);

//     return {
//         table, // for table rendering
//         chart: {
//             categories,
//             soughtPercent,
//             receivedPercent,
//         }
//     };
// }


export function getKpoServiceAvailabilityStats(submissions: any[], kpoName: string) {
    // Service mappings

    console.log("getKpoServiceAvailabilityStats");
    console.log(kpoName);


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

    // All submissions (all KPOs)
    const totalSought = serviceMappings.map(({ sought }) =>
        submissions.reduce((acc, s) => acc + (s.answers?.[sought] === "Yes" ? 1 : 0), 0)
    );
    // console.log(kpoName);


    // if it is admin we have to give all the data 

    let kpoSubs;
    if (kpoName != "admin") {
        kpoSubs = filterSubmissions(submissions, { kpo: [kpoName] })
    }
    else {
        kpoSubs = submissions;
    }

    console.log(kpoSubs);

    // Submissions for this KPO only
    //submissions.filter(s => s.network === kpoName);



    const kpoSought = serviceMappings.map(({ sought }) =>
        kpoSubs.reduce((acc, s) => acc + (s.answers?.[sought] === "Yes" ? 1 : 0), 0)
    );
    const kpoReceived = serviceMappings.map(({ received }) =>
        kpoSubs.reduce((acc, s) => acc + (s.answers?.[received] === "Yes" ? 1 : 0), 0)
    );

    // Table rows
    const table = serviceMappings.map((m, i) => {
        const sought = kpoSought[i];
        const received = kpoReceived[i];
        const totalS = totalSought[i];
        return {
            label: m.label,
            sought,
            soughtPercentOfTotal: totalS ? Math.round((sought / totalS) * 1000) / 10 : 0, // % of all sought for this service
            received,
            receivedPercentOfSought: sought ? Math.round((received / sought) * 1000) / 10 : 0, // % of this KPO's sought that were received
            totalSought: totalS,
        };
    });

    // For chart: percent of total sought, percent received (of sought)
    const categories = serviceMappings.map(m => m.label);
    const soughtPercent = table.map(row => row.soughtPercentOfTotal);
    const receivedPercent = table.map(row => row.receivedPercentOfSought);

    return {
        table, // for table rendering
        chart: {
            categories,
            soughtPercent,
            receivedPercent,
        }
    };
}






const genderBuckets = [
    'Man',
    'Woman',
    'Transgender Man',
    'Transgender Woman',
    'Do not want to disclose'
];

// Helper: Get gender(s) from answers["24"]
function getGenders(ans: any): string[] {
    const g = ans?.["24"];
    if (Array.isArray(g)) return g;
    if (typeof g === "string") return [g];
    return [];
}

// ================== Service Accessibility ==================
export async function getServiceAccessibilityStats(submissions: any[]) {
    const accessibilityMappings = [
        { key: "7", label: "Safe Location" },
        { key: "8", label: "Convenient Location" },
        { key: "9", label: "Suitable Opening Hrs" },
        { key: "10a", label: "Service Affordability" },
    ];

    // Fetch all service facilities
    const { data: serviceFacilities } = await supabase
        .from('service_facility')
        .select('id, name');
    const { data: facilityNames } = await supabase
        .from('facility_name')
        .select('id, service_facility');
    const facilityIdToServiceFacilityId: Record<string, number> = {};
    facilityNames?.forEach((f: any) => {
        facilityIdToServiceFacilityId[String(f.id)] = f.service_facility;
    });

    // --- Table by Service Facility ---
    const facilityStats: Record<number, any> = {};
    serviceFacilities?.forEach((sf: any) => {
        facilityStats[sf.id] = {
            id: sf.id,
            name: sf.name,
            accessibility: accessibilityMappings.map(q => ({
                key: q.key,
                label: q.label,
                yes: 0,
                no: 0,
            })),
        };
    });
    submissions.forEach((s: any) => {
        const facilityNameId = s.answers?.["5"];
        const sfId = facilityIdToServiceFacilityId[String(facilityNameId)];
        if (!sfId || !facilityStats[sfId]) return;
        accessibilityMappings.forEach((q, idx) => {
            const ans = s.answers?.[q.key];
            if (ans === "Yes") facilityStats[sfId].accessibility[idx].yes++;
            else if (ans === "No") facilityStats[sfId].accessibility[idx].no++;
        });
    });
    const tableByFacility = serviceFacilities?.map((sf: any) => {
        const row: any = { id: sf.id, name: sf.name };
        facilityStats[sf.id].accessibility.forEach((acc: any) => {
            const total = acc.yes + acc.no;
            row[acc.label] = {
                yes: acc.yes,
                no: acc.no,
                yesPercent: total ? Math.round((acc.yes / total) * 1000) / 10 : 0,
                noPercent: total ? Math.round((acc.no / total) * 1000) / 10 : 0,
            };
        });
        return row;
    });

    // --- Table by Gender ---
    const tableByGender = genderBuckets.map(gender => {
        const filtered = submissions.filter(s => getGenders(s.answers).includes(gender));
        const row: any = { gender };
        accessibilityMappings.forEach(({ key, label }) => {
            const yes = filtered.filter(s => s.answers?.[key] === "Yes").length;
            const no = filtered.filter(s => s.answers?.[key] === "No").length;
            const total = yes + no;
            row[label] = {
                yes,
                no,
                yesPercent: total ? Math.round((yes / total) * 1000) / 10 : 0,
                noPercent: total ? Math.round((no / total) * 1000) / 10 : 0,
            };
        });
        return row;
    });

    // --- Overall chart data ---
    const chart = accessibilityMappings.map(({ key, label }) => {
        let yes = 0, no = 0;
        submissions.forEach((s: any) => {
            const ans = s.answers?.[key];
            if (ans === "Yes") yes++;
            else if (ans === "No") no++;
        });
        const total = yes + no;
        return {
            key,
            label,
            yes,
            no,
            yesPercent: total ? Math.round((yes / total) * 1000) / 10 : 0,
            noPercent: total ? Math.round((no / total) * 1000) / 10 : 0,
        };
    });

    return { tableByFacility, tableByGender, chart };
}

// ================== Service Acceptability ==================
export async function getServiceAcceptabilityStats(submissions: any[]) {
    // Fetch all service facilities
    const { data: serviceFacilities } = await supabase
        .from('service_facility')
        .select('id, name');
    const { data: facilityNames } = await supabase
        .from('facility_name')
        .select('id, service_facility');
    const facilityIdToServiceFacilityId: Record<string, number> = {};
    facilityNames?.forEach((f: any) => {
        facilityIdToServiceFacilityId[String(f.id)] = f.service_facility;
    });

    // --- Table by Service Facility ---
    const facilityStats: Record<number, any> = {};
    serviceFacilities?.forEach((sf: any) => {
        facilityStats[sf.id] = {
            id: sf.id,
            name: sf.name,
            respectYes: 0,
            respectNo: 0,
            consentYes: 0,
            consentNo: 0,
        };
    });
    submissions.forEach((s: any) => {
        const facilityNameId = s.answers?.["5"];
        const sfId = facilityIdToServiceFacilityId[String(facilityNameId)];
        if (!sfId || !facilityStats[sfId]) return;
        if (s.answers?.["11"] === "Yes") facilityStats[sfId].respectYes++;
        if (s.answers?.["11"] === "No") facilityStats[sfId].respectNo++;
        if (s.answers?.["12"] === "Yes") facilityStats[sfId].consentYes++;
        if (s.answers?.["12"] === "No") facilityStats[sfId].consentNo++;
    });
    const tableByFacility = serviceFacilities?.map((sf: any) => {
        const stat = facilityStats[sf.id];
        const respectTotal = stat.respectYes + stat.respectNo;
        const consentTotal = stat.consentYes + stat.consentNo;
        return {
            id: sf.id,
            name: sf.name,
            respectYes: stat.respectYes,
            respectNo: stat.respectNo,
            respectYesPercent: respectTotal ? Math.round((stat.respectYes / respectTotal) * 1000) / 10 : 0,
            respectNoPercent: respectTotal ? Math.round((stat.respectNo / respectTotal) * 1000) / 10 : 0,
            consentYes: stat.consentYes,
            consentNo: stat.consentNo,
            consentYesPercent: consentTotal ? Math.round((stat.consentYes / consentTotal) * 1000) / 10 : 0,
            consentNoPercent: consentTotal ? Math.round((stat.consentNo / consentTotal) * 1000) / 10 : 0,
            respectTotal,
            consentTotal,
        };
    });

    // --- Table by Gender ---
    const tableByGender = genderBuckets.map(gender => {
        const filtered = submissions.filter(s => getGenders(s.answers).includes(gender));
        const respectYes = filtered.filter(s => s.answers?.["11"] === "Yes").length;
        const respectNo = filtered.filter(s => s.answers?.["11"] === "No").length;
        const consentYes = filtered.filter(s => s.answers?.["12"] === "Yes").length;
        const consentNo = filtered.filter(s => s.answers?.["12"] === "No").length;
        const respectTotal = respectYes + respectNo;
        const consentTotal = consentYes + consentNo;
        return {
            gender,
            respectYes,
            respectNo,
            respectYesPercent: respectTotal ? Math.round((respectYes / respectTotal) * 1000) / 10 : 0,
            respectNoPercent: respectTotal ? Math.round((respectNo / respectTotal) * 1000) / 10 : 0,
            consentYes,
            consentNo,
            consentYesPercent: consentTotal ? Math.round((consentYes / consentTotal) * 1000) / 10 : 0,
            consentNoPercent: consentTotal ? Math.round((consentNo / consentTotal) * 1000) / 10 : 0,
            respectTotal,
            consentTotal,
        };
    });

    // --- Overall chart data ---
    let respectYes = 0, respectNo = 0, consentYes = 0, consentNo = 0;
    submissions.forEach((s: any) => {
        if (s.answers?.["11"] === "Yes") respectYes++;
        if (s.answers?.["11"] === "No") respectNo++;
        if (s.answers?.["12"] === "Yes") consentYes++;
        if (s.answers?.["12"] === "No") consentNo++;
    });
    const respectTotal = respectYes + respectNo;
    const consentTotal = consentYes + consentNo;
    const chart = {
        respect: {
            yes: respectYes,
            no: respectNo,
            yesPercent: respectTotal ? Math.round((respectYes / respectTotal) * 1000) / 10 : 0,
            noPercent: respectTotal ? Math.round((respectNo / respectTotal) * 1000) / 10 : 0,
        },
        consent: {
            yes: consentYes,
            no: consentNo,
            yesPercent: consentTotal ? Math.round((consentYes / consentTotal) * 1000) / 10 : 0,
            noPercent: consentTotal ? Math.round((consentNo / consentTotal) * 1000) / 10 : 0,
        },
        respectTotal,
        consentTotal,
    };

    return { tableByFacility, tableByGender, chart };
}


//=========================== Service Quality =============================
export async function getServiceQualityStats(submissions: any[]) {
    // Quality questions and labels
    const qualityMappings = [
        { key: "15", label: "Items Received" },
        { key: "13", label: "Received All Information" },
        { key: "14", label: "Questions Answered" },
    ];

    // Gender buckets as per dashboard
    const genderBuckets = [
        'Man',
        'Woman',
        'Transgender Man',
        'Transgender Woman',
        'Do not want to disclose'
    ];

    // Helper: Get gender(s) from answers["24"]
    function getGenders(ans: any): string[] {
        const g = ans?.["24"];
        if (Array.isArray(g)) return g;
        if (typeof g === "string") return [g];
        return [];
    }

    // 1. Fetch all service facilities
    const { data: serviceFacilities, error: sfError } = await supabase
        .from('service_facility')
        .select('id, name');
    if (sfError) {
        console.error("Error fetching service_facility:", sfError);
        return { tableByFacility: [], tableByGender: [], chart: [] };
    }

    // 2. Fetch all facility_name records with their service_facility
    const { data: facilityNames, error: fnError } = await supabase
        .from('facility_name')
        .select('id, service_facility');
    if (fnError) {
        console.error("Error fetching facility_name:", fnError);
        return { tableByFacility: [], tableByGender: [], chart: [] };
    }

    // 3. Map facility_name id to service_facility id
    const facilityIdToServiceFacilityId: Record<string, number> = {};
    facilityNames.forEach((f: any) => {
        facilityIdToServiceFacilityId[String(f.id)] = f.service_facility;
    });

    // --- Table by Service Facility ---
    const facilityStats: Record<number, any> = {};
    serviceFacilities.forEach((sf: any) => {
        facilityStats[sf.id] = {
            id: sf.id,
            name: sf.name,
            quality: qualityMappings.map(q => ({
                key: q.key,
                label: q.label,
                yes: 0,
                no: 0,
            })),
        };
    });
    submissions.forEach((s: any) => {
        const facilityNameId = s.answers?.["5"];
        const sfId = facilityIdToServiceFacilityId[String(facilityNameId)];
        if (!sfId || !facilityStats[sfId]) return;
        qualityMappings.forEach((q, idx) => {
            const ans = s.answers?.[q.key];
            if (ans === "Yes") facilityStats[sfId].quality[idx].yes++;
            else if (ans === "No") facilityStats[sfId].quality[idx].no++;
        });
    });
    const tableByFacility = serviceFacilities.map((sf: any) => {
        const row: any = { id: sf.id, name: sf.name };
        facilityStats[sf.id].quality.forEach((acc: any) => {
            const total = acc.yes + acc.no;
            row[acc.label] = {
                yes: acc.yes,
                no: acc.no,
                yesPercent: total ? Math.round((acc.yes / total) * 1000) / 10 : 0,
                noPercent: total ? Math.round((acc.no / total) * 1000) / 10 : 0,
            };
        });
        return row;
    });

    // --- Table by Gender ---
    const tableByGender = genderBuckets.map(gender => {
        const filtered = submissions.filter(s => getGenders(s.answers).includes(gender));
        const row: any = { gender };
        qualityMappings.forEach(({ key, label }) => {
            const yes = filtered.filter(s => s.answers?.[key] === "Yes").length;
            const no = filtered.filter(s => s.answers?.[key] === "No").length;
            const total = yes + no;
            row[label] = {
                yes,
                no,
                yesPercent: total ? Math.round((yes / total) * 1000) / 10 : 0,
                noPercent: total ? Math.round((no / total) * 1000) / 10 : 0,
            };
        });
        return row;
    });

    // --- Overall chart data ---
    const chart = qualityMappings.map(({ key, label }) => {
        let yes = 0, no = 0;
        submissions.forEach((s: any) => {
            const ans = s.answers?.[key];
            if (ans === "Yes") yes++;
            else if (ans === "No") no++;
        });
        const total = yes + no;
        return {
            key,
            label,
            yes,
            no,
            yesPercent: total ? Math.round((yes / total) * 1000) / 10 : 0,
            noPercent: total ? Math.round((no / total) * 1000) / 10 : 0,
        };
    });

    return { tableByFacility, tableByGender, chart };
}


/**
 * Returns a histogram of waiting times (Q16) with x-axis as each minute (1, 2, 3, ..., 360).
 * Output: { x: minute, y: count }[] for charting (line/bar).
 */
export function getWaitingTimeLineChart(submissions: any[]) {
    // Collect all valid wait times (Q16)
    const waitTimes: number[] = [];
    submissions.forEach((s) => {
        const val = parseInt(s.answers?.["16"], 10);
        if (!isNaN(val) && val > 0) waitTimes.push(val);
    });

    // Count occurrences for each minute
    const counts: Record<number, number> = {};
    waitTimes.forEach((wt) => {
        counts[wt] = (counts[wt] || 0) + 1;
    });

    // Build sorted array for charting
    const min = Math.min(...waitTimes, 1);
    const max = Math.max(...waitTimes, 360);
    const data: { x: number, y: number }[] = [];
    for (let minute = min; minute <= max; minute++) {
        data.push({ x: minute, y: counts[minute] || 0 });
    }

    return data;
}


///========================Serious Incidents=================================//
export async function getSeriousIncidentStats(submissions: any[]) {
    // Incident mappings: question key, label, and for 18a, the option string to match in array
    const incidentMappings = [
        { key: "18a", label: "Stigma & Discrimination", option: "Stigma and discrimination (negative attitude towards you or treated you unfairly by health worker during your visit because of your identity as Key Population" },
        { key: "18a", label: "Violence", option: "Violence (such as verbal abuse, physical abuse, sexual abuse, negligence by staff or person at the health facility)" },
        { key: "18a", label: "Harassment", option: "Harassment (including sexual) from the service staff or other clients" },
        { key: "18a", label: "Privacy", option: "Breach of privacy (physical privacy maintained)" },
        { key: "18a", label: "Confidentiality", option: "Breach of confidentiality was your information shared with others without your consent)" },
        { key: "18a", label: "Refused Services", option: "Refused service because of gender, identity case, risk behaviors or other" },
        { key: "18a", label: "Pain or Distress", option: "Physical pain or mental distress" },
        { key: "18a", label: "Other", option: "Other" },
    ];

    // Gender buckets as per dashboard
    const genderBuckets = [
        'Man',
        'Woman',
        'Transgender Man',
        'Transgender Woman',
        'Do not want to disclose'
    ];

    // Helper: Get gender(s) from answers["24"]
    function getGenders(ans: any): string[] {
        const g = ans?.["24"];
        if (Array.isArray(g)) return g;
        if (typeof g === "string") return [g];
        return [];
    }

    // 1. Fetch all service facilities
    const { data: serviceFacilities, error: sfError } = await supabase
        .from('service_facility')
        .select('id, name');
    if (sfError) {
        console.error("Error fetching service_facility:", sfError);
        return { tableByFacility: [], tableByGender: [], chart: [] };
    }

    // 2. Fetch all facility_name records with their service_facility
    const { data: facilityNames, error: fnError } = await supabase
        .from('facility_name')
        .select('id, service_facility');
    if (fnError) {
        console.error("Error fetching facility_name:", fnError);
        return { tableByFacility: [], tableByGender: [], chart: [] };
    }

    // 3. Map facility_name id to service_facility id
    const facilityIdToServiceFacilityId: Record<string, number> = {};
    facilityNames.forEach((f: any) => {
        facilityIdToServiceFacilityId[String(f.id)] = f.service_facility;
    });

    // --- Table by Service Facility ---
    const facilityStats: Record<number, any> = {};
    serviceFacilities.forEach((sf: any) => {
        facilityStats[sf.id] = {
            id: sf.id,
            name: sf.name,
            incidents: incidentMappings.map(q => ({
                label: q.label,
                yes: 0,
                no: 0,
            })),
        };
    });
    submissions.forEach((s: any) => {
        const facilityNameId = s.answers?.["5"];
        const sfId = facilityIdToServiceFacilityId[String(facilityNameId)];
        if (!sfId || !facilityStats[sfId]) return;
        incidentMappings.forEach((q, idx) => {
            const ans = s.answers?.[q.key];
            // For 18a, can be array or string
            let yes = false;
            if (Array.isArray(ans)) {
                yes = ans.includes(q.option);
            } else if (typeof ans === "string") {
                yes = ans === q.option;
            }
            if (yes) facilityStats[sfId].incidents[idx].yes++;
            else facilityStats[sfId].incidents[idx].no++;
        });
    });
    const tableByFacility = serviceFacilities.map((sf: any) => {
        const row: any = { id: sf.id, name: sf.name };
        facilityStats[sf.id].incidents.forEach((inc: any) => {
            const total = inc.yes + inc.no;
            row[inc.label] = {
                yes: inc.yes,
                no: inc.no,
                yesPercent: total ? Math.round((inc.yes / total) * 1000) / 10 : 0,
                noPercent: total ? Math.round((inc.no / total) * 1000) / 10 : 0,
            };
        });
        return row;
    });

    // --- Table by Gender ---
    const tableByGender = genderBuckets.map(gender => {
        const filtered = submissions.filter(s => getGenders(s.answers).includes(gender));
        const row: any = { gender };
        incidentMappings.forEach((q) => {
            let yes = 0, no = 0;
            filtered.forEach(s => {
                const ans = s.answers?.[q.key];
                let found = false;
                if (Array.isArray(ans)) found = ans.includes(q.option);
                else if (typeof ans === "string") found = ans === q.option;
                if (found) yes++;
                else no++;
            });
            const total = yes + no;
            row[q.label] = {
                yes,
                no,
                yesPercent: total ? Math.round((yes / total) * 1000) / 10 : 0,
                noPercent: total ? Math.round((no / total) * 1000) / 10 : 0,
            };
        });
        return row;
    });

    // --- Overall chart data ---
    const chart = incidentMappings.map((q) => {
        let yes = 0;
        submissions.forEach((s: any) => {
            const ans = s.answers?.[q.key];
            if (Array.isArray(ans) && ans.includes(q.option)) yes++;
            else if (typeof ans === "string" && ans === q.option) yes++;
        });
        return {
            label: q.label,
            count: yes,
        };
    });

    return { tableByFacility, tableByGender, chart };
}



//==========================follow up details===========================//
export function getFollowupConsentSubmissions(submissions: any[]) {
    return submissions.filter(
        (s) => s.answers?.["20"] === "Yes"
    );
}

export function getDzongkhagSubmissionCounts(submissions: any[]): Record<string, number> {
    const counts: Record<string, number> = {};
    submissions.forEach(sub => {
        const dz = sub.answers?.["3"];
        if (dz && typeof dz === "string") {
            const key = dz.trim().toLowerCase();
            counts[key] = (counts[key] || 0) + 1;
        }
    });
    return counts;
}
