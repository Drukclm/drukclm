"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useMemo,
} from "react";
import { getKpoReport } from "../../../utils/fetchKpoDetails";
import useAuthStore from "../../../store/authStore";

// -------------------- Helpers --------------------
const normalizeKpoKey = (label: string) => {
  const key = label.trim().toLowerCase().replace(/\s+/g, "_");
  const map: Record<string, string> = {
    "lhak-sam": "lhak_sam",
    lhak_sam: "lhak_sam",
    cpa: "chithuen_phendhey",
    chithuen_phendhey: "chithuen_phendhey",
    "pride bhutan": "pride_bhutan",
    pride_bhutan: "pride_bhutan",
    "red purse network": "red_purse_network",
    red_purse_network: "red_purse_network",
    others: "others",
    "all kpos": "all_kpos",
    overall: "all_kpos",
  };
  return map[key] || key;
};

const kpoDisplayNamesMap: Record<string, string> = {
  all_kpos: "All KPOs",
  lhak_sam: "Lhak-sam",
  chithuen_phendhey: "CPA",
  pride_Bhutan: "Pride Bhutan",
  red_purse_network: "Red Purse Network",
  others: "Others",
};

// -------------------- Types --------------------
interface ReportData {
  totalNumber: number;
  weeklyNumber: number;
  serviceAvailability: any;
  serviceAccessibility: any;
  getServiceAcceptabilitySummary: any;
  calculateDzongkhagDistribution: any;
  calculateKPOGenderDistribution: any;
  calculateKpoKeyPopulationDistribution: any;
  calculateServiceFacilityStats: any;
  calculateRegionDistribution: any;
  calculateAgeDistribution: any;
  calculateClmParticipationByKPO?: any;
}

interface CLMDataContextType {
  report: ReportData | null;
  loading: boolean;
  selectedKpo: string;
  setSelectedKpo: React.Dispatch<React.SetStateAction<string>>;
  currentUserRole: string;
  kpoDisplayNamesMap: typeof kpoDisplayNamesMap;
  allKpoKeysForDropdown: string[];
  currentKpoDisplayName: string;
}

const CLMDataContext = createContext<CLMDataContextType | undefined>(undefined);

export function useCLMData() {
  const context = useContext(CLMDataContext);
  if (!context) {
    throw new Error("useCLMData must be used within a CLMDataProvider");
  }
  return context;
}

// -------------------- Provider --------------------
interface CLMDataProviderProps {
  children: ReactNode;
}

export function CLMDataProvider({ children }: CLMDataProviderProps) {
  const { profile } = useAuthStore();
  const currentUserRole = profile?.role || "";

  const initialKpoValue = useMemo(() => {
    if (currentUserRole === "admin") return "all_kpos";
    if (profile?.kpo_name) return normalizeKpoKey(profile.kpo_name);
    return "all_kpos";
  }, [currentUserRole, profile?.kpo_name]);

  const [selectedKpo, setSelectedKpo] = useState(initialKpoValue);
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  const allKpoKeysForDropdown = useMemo(
    () => Object.keys(kpoDisplayNamesMap),
    []
  );

  const currentKpoDisplayName = useMemo(
    () => kpoDisplayNamesMap[selectedKpo] || selectedKpo.toUpperCase(),
    [selectedKpo]
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!profile) {
        setReport(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const filterOptions: { kpo?: string[] } = {};
        if (selectedKpo !== "all_kpos") {
          filterOptions.kpo = [selectedKpo];
        }
        const fetchedReport = await getKpoReport(filterOptions);
        setReport(fetchedReport);
      } catch (err) {
        console.error("Error fetching CLM report:", err);
        setReport(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedKpo, profile]);

  const value: CLMDataContextType = {
    report,
    loading,
    selectedKpo,
    setSelectedKpo,
    currentUserRole,
    kpoDisplayNamesMap,
    allKpoKeysForDropdown,
    currentKpoDisplayName,
  };

  return (
    <CLMDataContext.Provider value={value}>{children}</CLMDataContext.Provider>
  );
}
