import { Column } from '@ant-design/charts';
import { Tabs, DatePicker, Radio, Space } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

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
	byDate: { date: string; count: number }[];
	byMonth: { month: string; count: number }[];
}

const RevenueStatsPage: React.FC = () => {
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [services, setServices] = useState<Service[]>([]);
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [selectedTab, setSelectedTab] = useState<string>('byService');
	const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment] | null>(null);
	const [timeUnit, setTimeUnit] = useState<'day' | 'month'>('day');

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
		const completedAppointments = appointments.filter((app) => app.status === 'Hoàn thành');
		let filteredAppointments = completedAppointments;

		// Lọc theo khoảng thời gian nếu có
		if (dateRange && dateRange[0] && dateRange[1]) {
			filteredAppointments = completedAppointments.filter((app) => {
				const appDate = moment(app.date);
				return appDate.isBetween(dateRange[0], dateRange[1], 'day', '[]');
			});
		}

		// Thống kê theo dịch vụ
		const revenueByService = filteredAppointments.reduce((acc, app) => {
			const service = services.find((s) => s.id === app.serviceId);
			if (!service) return acc;

			const existing = acc.find((item) => item.serviceId === app.serviceId);
			if (existing) {
				existing.totalRevenue += Number(service.price);
			} else {
				acc.push({ serviceId: app.serviceId, serviceName: service.name, totalRevenue: Number(service.price) });
			}
			return acc;
		}, [] as { serviceId: string; serviceName: string; totalRevenue: number }[]);

		// Thống kê theo nhân viên
		const revenueByEmployee = filteredAppointments.reduce((acc, app) => {
			const service = services.find((s) => s.id === app.serviceId);
			const employee = employees.find((e) => e.id === app.employeeId);
			if (!service || !employee) return acc;

			const existing = acc.find((item) => item.employeeId === app.employeeId);
			if (existing) {
				existing.totalRevenue += Number(service.price);
			} else {
				acc.push({ employeeId: app.employeeId, employeeName: employee.name, totalRevenue: Number(service.price) });
			}
			return acc;
		}, [] as { employeeId: string; employeeName: string; totalRevenue: number }[]);

		// Thống kê số lượng lịch hẹn theo ngày
		const appointmentsByDate = appointments.reduce((acc, app) => {
			const date = app.date;
			const existing = acc.find((item) => item.date === date);
			if (existing) {
				existing.count += 1;
			} else {
				acc.push({ date, count: 1 });
			}
			return acc;
		}, [] as { date: string; count: number }[]);

		// Thống kê số lượng lịch hẹn theo tháng
		const appointmentsByMonth = appointments.reduce((acc, app) => {
			const month = moment(app.date).format('MM/YYYY');
			const existing = acc.find((item) => item.month === month);
			if (existing) {
				existing.count += 1;
			} else {
				acc.push({ month, count: 1 });
			}
			return acc;
		}, [] as { month: string; count: number }[]);

		// Sắp xếp theo thứ tự thời gian
		appointmentsByDate.sort((a, b) => moment(a.date).diff(moment(b.date)));
		appointmentsByMonth.sort((a, b) => moment(a.month, 'MM/YYYY').diff(moment(b.month, 'MM/YYYY')));

		return {
			byService: revenueByService,
			byEmployee: revenueByEmployee,
			byDate: appointmentsByDate,
			byMonth: appointmentsByMonth,
		};
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
					<Column {...serviceChartConfig} height={400} />
				</TabPane>
				<TabPane tab='Theo nhân viên' key='byEmployee'>
					<Column {...employeeChartConfig} height={400} />
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
					<Column {...appointmentsByDateChartConfig} height={400} />
				</TabPane>
			</Tabs>
		</div>
	);
};

export default RevenueStatsPage;
