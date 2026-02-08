import { MetricCard } from '../components/widgets/MetricCard';
import { ChartWidget } from '../components/widgets/ChartWidget';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Users,
  Calendar,
  Download,
  Church,
  Megaphone,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  useDashboardOverview,
  useUserGrowth,
  useActivityStatistics,
  useMostActiveParishes,
} from '../lib/hooks/useDashboard';

// All data now comes from backend APIs

export function Dashboard() {
  const { data: overview, isLoading: overviewLoading } = useDashboardOverview();
  const { data: userGrowth, isLoading: growthLoading } = useUserGrowth(12);

  // Get current month date range for activity statistics
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const startDate = startOfMonth.toISOString().split('T')[0];
  const endDate = endOfMonth.toISOString().split('T')[0];

  const { data: activityStats } = useActivityStatistics(startDate, endDate);
  const { data: activeParishes } = useMostActiveParishes(5);

  // Transform user growth data for charts
  const growthData = userGrowth?.map((item) => ({
    month: new Date(item.month).toLocaleDateString('fr-FR', { month: 'short' }),
    nouveaux: item.newUsers,
  })) || [];

  if (overviewLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Vue d'aujourd'hui</h2>
            <p className="text-sm text-gray-600">Résumé des activités paroissiales</p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total des utilisateurs"
            value={overview?.overview.totalUsers.toString() || '0'}
            change={`${overview?.recentActivity.newUsersLast30Days || 0} nouveaux ce mois`}
            changeType="increase"
            icon={Users}
            iconBgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <MetricCard
            title="Messes programmées"
            value={overview?.overview.totalCelebrations.toString() || '0'}
            change={`${overview?.recentActivity.upcomingCelebrationsNext7Days || 0} cette semaine`}
            changeType="increase"
            icon={Church}
            iconBgColor="bg-purple-50"
            iconColor="text-purple-600"
          />
          <MetricCard
            title="Activités"
            value={overview?.overview.totalActivities.toString() || '0'}
            changeType="neutral"
            icon={Calendar}
            iconBgColor="bg-green-50"
            iconColor="text-green-600"
          />
          <MetricCard
            title="Annonces actives"
            value={overview?.recentActivity.activeAnnouncements.toString() || '0'}
            changeType="neutral"
            icon={Megaphone}
            iconBgColor="bg-orange-50"
            iconColor="text-orange-600"
          />
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Member Growth Chart */}
        <ChartWidget title="Croissance des utilisateurs" subtitle="Nouveaux utilisateurs par mois">
          {growthLoading ? (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-gray-500">Chargement...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="nouveaux" fill="#3b82f6" name="Nouveaux utilisateurs" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartWidget>

        {/* Statistics Overview */}
        <ChartWidget title="Statistiques générales" subtitle="Vue d'ensemble du système">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Unités ecclésiales</p>
              <p className="text-2xl font-bold text-blue-600">
                {overview?.overview.totalEcclesiasticalUnits || 0}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Confessions</p>
              <p className="text-2xl font-bold text-green-600">
                {overview?.overview.totalConfessions || 0}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Lieux saints</p>
              <p className="text-2xl font-bold text-purple-600">
                {overview?.overview.totalHolyPlaces || 0}
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Objets sacrés</p>
              <p className="text-2xl font-bold text-orange-600">
                {overview?.overview.totalSacredObjects || 0}
              </p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Activité récente (30 derniers jours)</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Nouveaux utilisateurs</p>
                <p className="text-xl font-bold text-indigo-600">
                  {overview?.recentActivity.newUsersLast30Days || 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Annonces actives</p>
                <p className="text-xl font-bold text-purple-600">
                  {overview?.recentActivity.activeAnnouncements || 0}
                </p>
              </div>
            </div>
          </div>
        </ChartWidget>
      </div>

      {/* Activity Statistics for Current Month */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartWidget title="Activité ce mois-ci" subtitle={`Du ${startOfMonth.toLocaleDateString('fr-FR')} au ${endOfMonth.toLocaleDateString('fr-FR')}`}>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Messes créées</p>
              <p className="text-3xl font-bold text-purple-600">
                {activityStats?.statistics.celebrationsCreated || 0}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Activités créées</p>
              <p className="text-3xl font-bold text-green-600">
                {activityStats?.statistics.activitiesCreated || 0}
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Annonces publiées</p>
              <p className="text-3xl font-bold text-orange-600">
                {activityStats?.statistics.announcementsPublished || 0}
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Nouveaux utilisateurs</p>
              <p className="text-3xl font-bold text-blue-600">
                {activityStats?.statistics.newUsers || 0}
              </p>
            </div>
          </div>
        </ChartWidget>

        {/* Most Active Parishes */}
        <ChartWidget title="Paroisses les plus actives" subtitle="Top 5 des paroisses">
          <div className="space-y-3">
            {activeParishes && activeParishes.length > 0 ? (
              activeParishes.map((parish, index) => (
                <div
                  key={parish.code}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-indigo-600">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {parish.libelle}
                    </p>
                    <p className="text-xs text-gray-500">
                      {parish.subscribers} abonnés
                    </p>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                      {parish.celebrations} messes
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                      {parish.activities} activités
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                Aucune paroisse active pour le moment
              </div>
            )}
          </div>
        </ChartWidget>
      </div>

    </div>
  );
}
