import { AdminDashboardComponent } from './admin-dashboard.component';
import { AdminService } from 'src/app/services/admin.service';

describe('AdminDashboardComponent chart', () => {
  it('builds a responsive SVG chart from the revenue trend', () => {
    const component = new AdminDashboardComponent({} as AdminService);
    component.revenueTrend = [
      { label: 'Mon', value: 1000 },
      { label: 'Tue', value: 2000 },
      { label: 'Wed', value: 1500 }
    ];

    const geometry = component.getChartGeometry();

    expect(geometry.points.length).toBe(3);
    expect(geometry.points[0].x).toBe(0);
    expect(geometry.points[2].x).toBe(100);
    expect(geometry.path).toContain('M 0');
    expect(geometry.areaPath).toContain('L 100');
  });
});
