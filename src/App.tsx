import React, { useState } from 'react';
import { MRVProvider, useMRV } from './context/MRVContext';
import { Header } from './components/layout/Header';
import { AmbientBackground } from './components/ui/AmbientBackground';

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

const MainAppContent: React.FC = () => {
  const { currentRole, activeView, setActiveView } = useMRV();
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return currentRole === 'EAD_REVIEWER' ? <EADDashboardView /> : <FacilityDashboardView />;
      case 'facility':
      case 'registration':
      case 'annual-renewal':
      case 'report-change':
        return <FacilityRegistrationView />;
      case 'data-entry':
      case 'monitoring-plan':
      case 'emissions-data':
      case 'report-upload':
        return <DataEntryView />;
      case 'data-review':
        return <DataReviewView />;
      case 'reports':
      case 'mrv-reports':
      case 'submissions':
      case 'version-history':
        return <MRVReportsView />;
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
      case 'ead-facilities':
        return <EADFacilitiesView />;
      default:
        return currentRole === 'EAD_REVIEWER' ? <EADDashboardView /> : <FacilityDashboardView />;
    }
  };

  return (
    <div className="relative h-screen w-screen flex flex-col bg-[#E5E8ED] text-[#0D0E12] font-sans antialiased overflow-hidden">
      {/* Dynamic Ambient Mesh Canvas */}
      <AmbientBackground />

      {/* Fixed Top Header with SugarCRM Navigation Styling */}
      <Header onLogout={() => setIsAuthenticated(false)} />

      {/* Body Area with Scrollable Main Content */}
      <div className="flex-1 min-h-0 flex overflow-hidden p-3 sm:p-5 lg:p-6 max-w-[1600px] w-full mx-auto">
        {/* Main View Container (No corner radius to prevent clipping buttons) */}
        <main className="flex-1 min-h-0 h-full overflow-hidden">
          {renderActiveView()}
        </main>
      </div>
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
