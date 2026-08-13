import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ReportingContext = createContext();

const initialReports = [
  {
    id: "RPT-1001",
    name: "Daily Claims Report",
    type: "Daily",
    category: "Claims",
    date: "2026-08-13",
    totalClaims: 42,
    completed: 28,
    pending: 10,
    escalated: 4,
    slaCompliance: 91,
  },
  {
    id: "RPT-1002",
    name: "Weekly Operations Report",
    type: "Weekly",
    category: "Operations",
    date: "2026-08-10",
    totalClaims: 245,
    completed: 187,
    pending: 42,
    escalated: 16,
    slaCompliance: 89,
  },
  {
    id: "RPT-1003",
    name: "Monthly Claims Report",
    type: "Monthly",
    category: "Claims",
    date: "2026-08-01",
    totalClaims: 980,
    completed: 812,
    pending: 124,
    escalated: 44,
    slaCompliance: 92,
  },
];

const initialMetrics = {
  totalClaims: 1267,
  completedClaims: 1027,
  pendingClaims: 176,
  escalatedClaims: 64,
  slaCompliance: 91,
  productivity: 87,
  revenue: 4285000,
  customerSatisfaction: 94,
};

function ReportingProvider({ children }) {
  const [reports, setReports] = useState(() => {
    const stored =
      localStorage.getItem(
        "claimcare_reports"
      );

    return stored
      ? JSON.parse(stored)
      : initialReports;
  });

  const [metrics, setMetrics] = useState(() => {
    const stored =
      localStorage.getItem(
        "claimcare_report_metrics"
      );

    return stored
      ? JSON.parse(stored)
      : initialMetrics;
  });

  useEffect(() => {
    localStorage.setItem(
      "claimcare_reports",
      JSON.stringify(reports)
    );
  }, [reports]);

  useEffect(() => {
    localStorage.setItem(
      "claimcare_report_metrics",
      JSON.stringify(metrics)
    );
  }, [metrics]);

  const addReport = (report) => {
    const newReport = {
      ...report,
      id: `RPT-${Date.now()}`,
      date:
        report.date ||
        new Date()
          .toISOString()
          .split("T")[0],
    };

    setReports((previous) => [
      newReport,
      ...previous,
    ]);
  };

  const updateMetric = (
    key,
    value
  ) => {
    setMetrics((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const getReportsByType = (
    type
  ) => {
    return reports.filter(
      (report) =>
        report.type === type
    );
  };

  const exportReport = (report) => {
    const data = JSON.stringify(
      report,
      null,
      2
    );

    const blob = new Blob(
      [data],
      {
        type: "application/json",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download = `${report.id}.json`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <ReportingContext.Provider
      value={{
        reports,
        metrics,
        addReport,
        updateMetric,
        getReportsByType,
        exportReport,
      }}
    >
      {children}
    </ReportingContext.Provider>
  );
}

export function useReporting() {
  return useContext(
    ReportingContext
  );
}

export default ReportingProvider;