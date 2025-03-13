import { Column } from '@ant-design/charts';
import { Tabs } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';

const { TabPane } = Tabs;

interface Service {
  id: string;
  name: string;
  price: number;
  workSchedule: string[];
}

interface Employee {
  id: string;
  name: string;
  maxCustomersPerDay: number;
  workSchedule: string[];
  services: string[];
}

interface Appointment {
  id?: string;
  date: string;
  time: string;
  employeeId: string;
  serviceId: string;
  status: string;
}

interface RevenueStats {
  byService: { serviceId: string; serviceName: string; totalRevenue: number }[];
  byEmployee: { employeeId: string; employeeName: string; totalRevenue: number }[];
}

const RevenueStats: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('byService');

  const fetchAppointments = async () => {
    const response = await axios.get('https://67d2592590e0670699bd2980.mockapi.io/lich-hen/Lich');
    setAppointments(response.data as Appointment[]);
  };

  const fetchServices = async () => {
    const response = await axios.get('https://67d237fd90e0670699bcb276.mockapi.io/cuahang/Vieclam');
    setServices(response.data as Service[]);
  };

  const fetchEmployees = async () => {
    const response = await axios.get('https://67d237fd90e0670699bcb276.mockapi.io/cuahang/Nhanvien');
    setEmployees(response.data as Employee[]);
  };

  useEffect(() => {
    fetchAppointments();
    fetchServices();
    fetchEmployees();
  }, []);

  const calculateRevenueStats = (): RevenueStats => {
    const completedAppointments = appointments.filter(app => app.status === 'Hoàn thành');

    // Thống kê theo dịch vụ
    const revenueByService = completedAppointments.reduce((acc, app) => {
      const service = services.find(s => s.id === app.serviceId);
      if (!service) return acc;

      const existing = acc.find(item => item.serviceId === app.serviceId);
      if (existing) {
        existing.totalRevenue += service.price;
      } else {
        acc.push({ serviceId: app.serviceId, serviceName: service.name, totalRevenue: service.price });
      }
      return acc;
    }, [] as { serviceId: string; serviceName: string; totalRevenue: number }[]);

    // Thống kê theo nhân viên
    const revenueByEmployee = completedAppointments.reduce((acc, app) => {
      const service = services.find(s => s.id === app.serviceId);
      const employee = employees.find(e => e.id === app.employeeId);
      if (!service || !employee) return acc;

      const existing = acc.find(item => item.employeeId === app.employeeId);
      if (existing) {
        existing.totalRevenue += service.price;
      } else {
        acc.push({ employeeId: app.employeeId, employeeName: employee.name, totalRevenue: service.price });
      }
      return acc;
    }, [] as { employeeId: string; employeeName: string; totalRevenue: number }[]);

    return { byService: revenueByService, byEmployee: revenueByEmployee };
  };

  const revenueStats = calculateRevenueStats();

  // Cấu hình biểu đồ cột cho dịch vụ
  const serviceChartConfig = {
    data: revenueStats.byService,
    xField: 'serviceName',
    yField: 'totalRevenue',
    label: {
      position: 'middle' as const,
      style: { fill: '#FFFFFF', opacity: 0.6 },
    },
    xAxis: {
      label: {
        autoRotate: true,
        autoHide: true,
      },
    },
    yAxis: {
      title: { text: 'Doanh thu (VND)' },
    },
    meta: {
      serviceName: { alias: 'Dịch vụ' },
      totalRevenue: { alias: 'Doanh thu' },
    },
    color: '#1890ff',
  };

  // Cấu hình biểu đồ cột cho nhân viên
  const employeeChartConfig = {
    data: revenueStats.byEmployee,
    xField: 'employeeName',
    yField: 'totalRevenue',
    label: {
      position: 'middle' as const,
      style: { fill: '#FFFFFF', opacity: 0.6 },
    },
    xAxis: {
      label: {
        autoRotate: true,
        autoHide: true,
      },
    },
    yAxis: {
      title: { text: 'Doanh thu (VND)' },
    },
    meta: {
      employeeName: { alias: 'Nhân viên' },
      totalRevenue: { alias: 'Doanh thu' },
    },
    color: '#13c2c2',
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Thống kê doanh thu từ lịch hẹn hoàn thành</h2>
      <Tabs defaultActiveKey="byService" onChange={setSelectedTab}>
        <TabPane tab="Theo dịch vụ" key="byService">
          <Column {...serviceChartConfig} height={400} />
        </TabPane>
        <TabPane tab="Theo nhân viên" key="byEmployee">
          <Column {...employeeChartConfig} height={400} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default RevenueStats;