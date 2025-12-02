import { useDashboardLogic } from '@/hooks/useDashboardLogic';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { ProfileCard } from './dashboard/ProfileCard';
import { AttendanceCard } from './dashboard/AttendanceCard';
import { GeneratorCard } from './dashboard/GeneratorCard';
import { RecentLinksCard } from './dashboard/RecentLinksCard';
import { AdminManagementCard } from './dashboard/AdminManagementCard';
import { MessageDisplay } from './dashboard/MessageDisplay';
import { Loader2 } from 'lucide-react';

export function OfficeDashboard() {
  const {
    userId,
    isLoading,
    profile,
    allProfiles,
    updateProfile,
    updateOtherProfile,
    isAdmin,
    isSales,
    attendance,
    elapsedMinutes,
    handleClockIn,
    handleClockOut,
    paymentLinks,
    genState,
    genDispatch,
    handleGenerateLink,
    message,
    showMessage,
  } = useDashboardLogic();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader profile={profile} />
      
      <MessageDisplay message={message} />

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column - Profile & Attendance */}
          <div className="lg:col-span-4 space-y-6">
            {profile && (
              <ProfileCard
                profile={profile}
                userId={userId}
                onUpdate={updateProfile}
              />
            )}
            
            <AttendanceCard
              attendance={attendance}
              elapsedMinutes={elapsedMinutes}
              onClockIn={handleClockIn}
              onClockOut={handleClockOut}
            />
          </div>

          {/* Middle column - Generator & Recent Links */}
          <div className="lg:col-span-4 space-y-6">
            <GeneratorCard
              isSales={isSales}
              genState={genState}
              genDispatch={genDispatch}
              onGenerate={handleGenerateLink}
              showMessage={showMessage}
            />
            
            <RecentLinksCard
              paymentLinks={paymentLinks}
              showMessage={showMessage}
            />
          </div>

          {/* Right column - Admin Management */}
          <div className="lg:col-span-4">
            {isAdmin ? (
              <AdminManagementCard
                allProfiles={allProfiles}
                currentUserId={userId}
                onUpdateProfile={updateOtherProfile}
              />
            ) : (
              <div className="bg-card border border-border/50 rounded-lg p-8 text-center shadow-md">
                <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="h-8 w-8 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  Admin Area
                </h3>
                <p className="text-sm text-muted-foreground">
                  Employee management features are only available for Admin and Manager roles.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Office Dashboard • Built with React & Tailwind CSS
        </div>
      </footer>
    </div>
  );
}
