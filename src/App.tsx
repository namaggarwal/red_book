import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { Sidebar } from './components/layout/Sidebar';
import { EmergencyBanner } from './components/layout/EmergencyBanner';
import { LoginScreen } from './components/screens/LoginScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { GrowthScreen } from './components/screens/GrowthScreen';
import { VaccinationsScreen } from './components/screens/VaccinationsScreen';
import { DevelopmentScreen } from './components/screens/DevelopmentScreen';
import { HealthReviewsScreen } from './components/screens/HealthReviewsScreen';
import { HealthEventsScreen } from './components/screens/HealthEventsScreen';
import { AppointmentsScreen } from './components/screens/AppointmentsScreen';
import { FeedingSleepScreen } from './components/screens/FeedingSleepScreen';
import { TimelineScreen } from './components/screens/TimelineScreen';
import { ReportsScreen } from './components/screens/ReportsScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { MoreMenuScreen } from './components/screens/MoreMenuScreen';
import { QuickAddModal } from './components/modals/QuickAddModal';
import { RecordDetailModal } from './components/modals/RecordDetailModal';
import { SetupProfileModal } from './components/modals/SetupProfileModal';
import { ExitDemoModal } from './components/modals/ExitDemoModal';

const MainLayout: React.FC = () => {
  const {
    isUnlocked,
    currentScreen,
    quickAddOpen,
    setQuickAddOpen,
    quickAddDefaultType,
    setupModalOpen,
    setSetupModalOpen,
    profile,
  } = useApp();

  if (!isUnlocked) {
    return <LoginScreen />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'growth':
        return <GrowthScreen />;
      case 'timeline':
        return <TimelineScreen />;
      case 'development':
        return <DevelopmentScreen />;
      case 'vaccines':
        return <VaccinationsScreen />;
      case 'reviews':
        return <HealthReviewsScreen />;
      case 'events':
        return <HealthEventsScreen />;
      case 'appointments':
        return <AppointmentsScreen />;
      case 'feeding':
        return <FeedingSleepScreen />;
      case 'reports':
        return <ReportsScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'more':
        return <MoreMenuScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-ivory-100 flex flex-col font-sans text-stone-800">
      <Header />
      <EmergencyBanner />

      <div className="flex-1 max-w-6xl w-full mx-auto flex">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 max-w-full">
          {renderScreen()}
        </main>
      </div>

      <BottomNav />

      {/* Global Modals */}
      <QuickAddModal
        isOpen={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        initialType={quickAddDefaultType}
      />
      <RecordDetailModal />
      <SetupProfileModal
        isOpen={setupModalOpen}
        onClose={() => setSetupModalOpen(false)}
        existingProfile={profile}
      />
      <ExitDemoModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
