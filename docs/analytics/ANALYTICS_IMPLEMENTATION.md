# Analytics Implementation Specification

## Data Collection Layer

### Event Tracking
```typescript
interface AnalyticsEvent {
  eventType: string;
  eventData: Record<string, any>;
  sessionId: string;
  pageUrl: string;
  clientMetadata: {
    userAgent: string;
    screenSize: string;
    timezone: string;
  };
}

// Event tracking function
const trackEvent = async (event: AnalyticsEvent) => {
  await supabase
    .from('analytics_events')
    .insert([event]);
};
```

### Session Tracking
```typescript
interface UserSession {
  startTime: Date;
  endTime?: Date;
  duration?: number;
  pagesVisited: string[];
  deviceInfo: Record<string, any>;
}

// Session management
const startSession = async () => {
  const session: UserSession = {
    startTime: new Date(),
    pagesVisited: [],
    deviceInfo: getUserDeviceInfo()
  };
  return await supabase
    .from('user_sessions')
    .insert([session]);
};
```

## Data Processing Layer

### Real-time Analytics Processing
```typescript
interface AnalyticsProcessor {
  processHiringFunnelMetrics(jobId: string): Promise<void>;
  processJobBoardAnalytics(jobId: string): Promise<void>;
  processDiversityMetrics(jobId: string): Promise<void>;
  processAIEfficiencyMetrics(jobId: string): Promise<void>;
}

// Implementation using Supabase Functions
const processHiringFunnelMetrics = async (jobId: string) => {
  const { data: applications } = await supabase
    .from('job_applications')
    .select('*')
    .eq('job_id', jobId);

  const metrics = calculateFunnelMetrics(applications);
  
  await supabase
    .from('hiring_funnel_metrics')
    .upsert(metrics);
};
```

## Visualization Layer

### Dashboard Components
```typescript
interface DashboardMetrics {
  jobMetrics: JobMetrics[];
  hiringEfficiency: HiringEfficiency;
  diversityStats: DiversityStats;
  jobBoardPerformance: JobBoardPerformance[];
}

// React component for metrics visualization
const MetricsDisplay: React.FC<{ metrics: DashboardMetrics }> = ({ metrics }) => {
  return (
    <DashboardLayout>
      <JobMetricsChart data={metrics.jobMetrics} />
      <HiringFunnelView data={metrics.hiringEfficiency} />
      <DiversityStatsView data={metrics.diversityStats} />
      <JobBoardComparisonChart data={metrics.jobBoardPerformance} />
    </DashboardLayout>
  );
};
```

### Real-time Updates
```typescript
const useRealTimeMetrics = (jobId: string) => {
  const [metrics, setMetrics] = useState<DashboardMetrics>();

  useEffect(() => {
    const subscription = supabase
      .from(`hiring_funnel_metrics:job_id=eq.${jobId}`)
      .on('*', payload => {
        updateMetrics(payload.new);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [jobId]);

  return metrics;
};
```

## Performance Optimization

### Caching Strategy
```typescript
interface CacheConfig {
  ttl: number;
  maxSize: number;
}

class MetricsCache {
  private cache: Map<string, {
    data: any;
    timestamp: number;
  }>;

  constructor(private config: CacheConfig) {
    this.cache = new Map();
  }

  async get(key: string): Promise<any> {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.config.ttl) {
      return cached.data;
    }
    return null;
  }

  set(key: string, data: any): void {
    if (this.cache.size >= this.config.maxSize) {
      this.evictOldest();
    }
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  private evictOldest(): void {
    const oldest = Array.from(this.cache.entries())
      .sort(([, a], [, b]) => a.timestamp - b.timestamp)[0];
    if (oldest) {
      this.cache.delete(oldest[0]);
    }
  }
}
```

### Query Optimization
```typescript
// Optimized query for dashboard metrics
const getDashboardMetrics = async (userId: string) => {
  const { data: metrics } = await supabase
    .rpc('get_dashboard_metrics', { user_id: userId })
    .select(`
      job_metrics:hiring_funnel_metrics(
        job_id,
        stage,
        count,
        conversion_rate
      ),
      job_board_performance:job_board_analytics(
        board_name,
        views,
        applications,
        cost_per_hire
      ),
      diversity_stats:diversity_metrics(
        metric_type,
        percentage
      )
    `);

  return metrics;
};
```

## Security & Access Control

### Role-based Access
```typescript
enum UserRole {
  ADMIN = 'admin',
  HIRING_MANAGER = 'hiring_manager',
  RECRUITER = 'recruiter'
}

interface AccessControl {
  canViewMetrics: boolean;
  canExportData: boolean;
  canModifySettings: boolean;
}

const getAccessControl = (role: UserRole): AccessControl => {
  switch (role) {
    case UserRole.ADMIN:
      return {
        canViewMetrics: true,
        canExportData: true,
        canModifySettings: true
      };
    case UserRole.HIRING_MANAGER:
      return {
        canViewMetrics: true,
        canExportData: true,
        canModifySettings: false
      };
    default:
      return {
        canViewMetrics: true,
        canExportData: false,
        canModifySettings: false
      };
  }
};
``` 