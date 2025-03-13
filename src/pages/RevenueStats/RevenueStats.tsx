import { Column } from '@ant-design/charts';
import { Tabs, DatePicker, Radio, Space } from 'antd';
import { useEffect, useState } from 'react';
import moment from 'moment';

// Lấy services
import { fetchAppointments } from '../../services/appointment';
import { fetchServices } from '../../services/service';
import { fetchEmployees } from '../../services/employee';

// Lấy models
import { Appointment } from '../../models/appointment';
import { Service } from '../../models/service';
import { Employee } from '../../models/employee';
import { RevenueStats, calculateRevenueStats } from '../../models/revenue';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const RevenueStatsPage: React.FC = () => {
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [services, setServices] = useState<Service[]>([]);
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [selectedTab, setSelectedTab] = useState<string>('byService');
	const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment] | null>(null);
	const [timeUnit, setTimeUnit] = useState<'day' | 'month'>('day');
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const [appointmentsData, servicesData, employeesData] = await Promise.all([
					fetchAppointments(),
					fetchServices(),
					fetchEmployees(),
				]);

				setAppointments(appointmentsData);
				setServices(servicesData);
				setEmployees(employeesData);
			} catch (error) {
				console.error('Error fetching data:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const revenueStats = calculateRevenueStats(appointments, services, employees, dateRange || undefined);

	// Cấu hình biểu đồ cột cho dịch vụ
	const serviceChartConfig = {
		data: revenueStats.byService,
		xField: 'serviceName',
		yField: 'totalRevenue',
		label: {
			position: 'middle' as const,
			style: { fill: '#FFFFFF', opacity: 0.6 },
			content: (item: any) => `${item.totalRevenue.toLocaleString()} VND`,
		},
		xAxis: {
			label: {
				autoRotate: true,
				autoHide: true,
			},
		},
		yAxis: {
			title: { text: 'Doanh thu (VND)' },
			label: {
				formatter: (v: number) => `${v.toLocaleString()}`,
			},
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
			content: (item: any) => `${item.totalRevenue.toLocaleString()} VND`,
		},
		xAxis: {
			label: {
				autoRotate: true,
				autoHide: true,
			},
		},
		yAxis: {
			title: { text: 'Doanh thu (VND)' },
			label: {
				formatter: (v: number) => `${v.toLocaleString()}`,
			},
		},
		meta: {
			employeeName: { alias: 'Nhân viên' },
			totalRevenue: { alias: 'Doanh thu' },
		},
		color: '#13c2c2',
	};

	// Cấu hình biểu đồ cột cho số lượng lịch hẹn theo ngày
	const appointmentsByDateChartConfig = {
		data: timeUnit === 'day' ? revenueStats.byDate : revenueStats.byMonth,
		xField: timeUnit === 'day' ? 'date' : 'month',
		yField: 'count',
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
			title: { text: 'Số lượng lịch hẹn' },
		},
		meta: {
			date: { alias: 'Ngày' },
			month: { alias: 'Tháng' },
			count: { alias: 'Số lượng' },
		},
		color: '#722ed1',
	};

	return (
		<div style={{ padding: '20px' }}>
			<h2>Thống kê doanh thu từ lịch hẹn hoàn thành</h2>
			<Tabs defaultActiveKey='byService' onChange={setSelectedTab}>
				<TabPane tab='Theo dịch vụ' key='byService'>
					<Column {...serviceChartConfig} height={400} loading={loading} />
				</TabPane>
				<TabPane tab='Theo nhân viên' key='byEmployee'>
					<Column {...employeeChartConfig} height={400} loading={loading} />
				</TabPane>
				<TabPane tab='Số lượng lịch hẹn' key='byAppointment'>
					<Space direction='vertical' style={{ marginBottom: '20px' }}>
						<Radio.Group
							value={timeUnit}
							onChange={(e) => setTimeUnit(e.target.value)}
							style={{ marginBottom: '10px' }}
						>
							<Radio.Button value='day'>Theo ngày</Radio.Button>
							<Radio.Button value='month'>Theo tháng</Radio.Button>
						</Radio.Group>
						<RangePicker
							onChange={(dates) => setDateRange(dates as [moment.Moment, moment.Moment])}
							format='DD/MM/YYYY'
						/>
					</Space>
					<Column {...appointmentsByDateChartConfig} height={400} loading={loading} />
				</TabPane>
			</Tabs>
		</div>
	);
};

export default RevenueStatsPage;
