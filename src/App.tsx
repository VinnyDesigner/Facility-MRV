import React, { useState } from 'react';
import { MRVProvider, useMRV } from './context/MRVContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';

// Views
import { LoginView } from './views/LoginView';
import { FacilityDashboardView } from './views/FacilityDashboardView';
import { FacilityRegistrationView } from './views/FacilityRegistrationView';
import { ComplianceCheckerView } from './views/ComplianceCheckerView';
import { MonitoringPlanView } from './views/MonitoringPlanView';
import { EmissionsDataView } from './views/EmissionsDataView';
import { ReportUploadView } from './views/ReportUploadView';
import { SubmissionTrackingView } from './views/SubmissionTrackingView';
import { VerifierRegistryView } from './views/VerifierRegistryView';
import { ComplianceCenterView } from './views/ComplianceCenterView';
import { NotificationsView } from './views/NotificationsView';
import { HelpGuidanceView } from './views/HelpGuidanceView';
import { EADDashboardView } from './views/EADDashboardView';
import { EADAnalyticsView } from './views/EADAnalyticsView';
import { EADReviewQueueView } from './views/EADReviewQueueView';
import { EADReviewDetailView } from './views/EADReviewDetailView';
import { EADFacilitiesView } from './views/EADFacilitiesView';

import { DataReviewView } from './views/DataReviewView';
import { DataEntryView } from './views/DataEntryView';
import { MRVReportsView } from './views/MRVReportsView';
import { VersionHistoryView } from './views/VersionHistoryView';
import { AnnualEmissionDataView } from './views/AnnualEmissionDataView';
import { VerificationModuleView } from './views/VerificationModuleView';
import { SubmissionDetailView } from './views/SubmissionDetailView';
import { MRVDataHistoryView } from './views/MRVDataHistoryView';
import { ReadOnlyRecordViewer } from './components/mrv/ReadOnlyRecordViewer';
import { AdministrationView } from './views/AdministrationView';

const MainAppContent: React.FC = () => {
  const { currentRole, activeView, setActiveView, resetDemoData } = useMRV();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleLoginSuccess = () => {
    resetDemoData();
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    resetDemoData();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return currentRole === 'EAD_REVIEWER' ? <EADDashboardView /> : <FacilityDashboardView />;
      case 'facility':
      case 'registration':
      case 'annual-renewal':
      case 'report-change':
      case 'ead-facilities':
        return <FacilityRegistrationView />;
      case 'data-entry':
      case 'monitoring-plan':
      case 'monitoring-plan-module':
      case 'emissions-data':
      case 'report-upload':
        return <DataEntryView />;
      case 'annual-emission-data':
        return <AnnualEmissionDataView />;
      case 'verification':
        return <VerificationModuleView />;
      case 'data-review':
        return <DataReviewView />;
      case 'reports':
      case 'mrv-reports':
      case 'submissions':
      case 'version-history':
        return <MRVReportsView />;
      case 'submission-detail':
        return <SubmissionDetailView />;
      case 'mrv-data-history':
        return <MRVDataHistoryView />;
      case 'compliance-checker':
        return <ComplianceCheckerView />;
      case 'verifier-registry':
      case 'verifiers':
        return <VerifierRegistryView />;
      case 'compliance':
        return <ComplianceCenterView />;
      case 'notifications':
        return <NotificationsView />;
      case 'help':
        return <HelpGuidanceView />;
      case 'ead-queue':
        return <EADReviewQueueView />;
      case 'ead-review-detail':
        return <EADReviewDetailView />;
      case 'ead-analytics':
        return <EADAnalyticsView />;
      case 'administration':
      case 'admin':
      case 'admin-entity':
      case 'admin-roles':
      case 'admin-users':
      case 'admin-permissions':
      case 'admin-logs':
      case 'admin-action-logs':
      case 'entity':
      case 'roles':
      case 'users':
      case 'permissions':
      case 'action-logs':
        return <AdministrationView />;
      default:
        return currentRole === 'EAD_REVIEWER' ? <EADDashboardView /> : <FacilityDashboardView />;
    }
  };

  return (
    <div className="relative h-screen w-screen flex bg-[#E5E8ED] text-[#0D0E12] font-sans antialiased overflow-hidden">
      {/* Left Navigation Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        onLogout={handleLogout}
      />

      {/* Right Column Area with Fixed Header & Scrollable Main Views */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* Top Header */}
        <Header
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          onLogout={handleLogout}
        />

        {/* Main View Container */}
        <div className="flex-1 min-h-0 flex overflow-hidden px-2.5 sm:px-3.5 py-1.5 sm:py-2 w-full mx-auto">
          <main className="flex-1 min-h-0 h-full overflow-hidden">
            {renderActiveView()}
          </main>
        </div>
      </div>

      {/* Global Comprehensive Read-Only Record Viewer Modal */}
      <ReadOnlyRecordViewer />
    </div>
  );
};

export function App() {
  return (
    <MRVProvider>
      <MainAppContent />
    </MRVProvider>
  );
}

export default App;
