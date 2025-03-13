import { Button, Form, Input, Modal, Table, Select, DatePicker, TimePicker, message, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import moment from 'moment';

// Import services
import { fetchAppointments, createAppointment, updateAppointment, deleteAppointment } from '../../services/appointment';
import { fetchServices } from '../../services/service';
import { fetchEmployees } from '../../services/employee';

// Import models
import { Appointment } from '../../models/appointment';
import { Service } from '../../models/service';
import { Employee } from '../../models/employee';
import { getEmployeesByServiceId, isEmployeeAvailable } from '../../models/employee';

const { Option } = Select;
const { TabPane } = Tabs;

const AppointmentForm: React.FC<{
	isEdit: boolean;
	row: Appointment | undefined;
	setVisible: (visible: boolean) => void;
	fetchAppointmentData: () => void;
	services: Service[];
	employees: Employee[];
}> = ({ isEdit, row, setVisible, fetchAppointmentData, services, employees }) => {
	const [form] = Form.useForm();
	const [availableEmployees, setAvailableEmployees] = useState<Employee[]>([]);

	useEffect(() => {
		if (row && isEdit) {
			form.setFieldsValue({
				date: moment(row.date),
				time: moment(row.time, 'HH:mm'),
				serviceId: row.serviceId,
				employeeId: row.employeeId,
				status: row.status,
			});
		}
	}, [form, row, isEdit]);

	const onServiceChange = (serviceId: string) => {
		// Lọc nhân viên có thể thực hiện dịch vụ này
		const filteredEmployees = getEmployeesByServiceId(employees, serviceId);
		setAvailableEmployees(filteredEmployees);

		// Reset giá trị nhân viên nếu nhân viên hiện tại không thể thực hiện dịch vụ mới
		const currentEmployeeId = form.getFieldValue('employeeId');
		if (currentEmployeeId && !filteredEmployees.some((e) => e.id === currentEmployeeId)) {
			form.setFieldsValue({ employeeId: undefined });
		}
	};

	const disabledDate = (current: moment.Moment) => {
		// Không cho phép chọn ngày trong quá khứ
		return current && current < moment().startOf('day');
	};

	const disabledTime = (current: moment.Moment) => {
		if (!current) return false;

		// Không cho phép chọn giờ trong quá khứ nếu là ngày hiện tại
		const today = moment().startOf('day');
		const isToday = current.isSame(today, 'day');

		if (isToday) {
			const currentHour = moment().hour();
			return current.hour() < currentHour;
		}

		return false;
	};

	const onFinish = async (values: any) => {
		try {
			const appointmentData = {
				date: values.date.format('YYYY-MM-DD'),
				time: values.time.format('HH:mm'),
				employeeId: values.employeeId,
				serviceId: values.serviceId,
				status: values.status || 'Chờ xác nhận',
			};

			if (isEdit && row?.id) {
				await updateAppointment(row.id, appointmentData);
				message.success('Cập nhật lịch hẹn thành công!');
			} else {
				await createAppointment(appointmentData);
				message.success('Tạo lịch hẹn thành công!');
			}

			setVisible(false);
			form.resetFields();
			fetchAppointmentData();
		} catch (error) {
			console.error('Error saving appointment:', error);
			message.error('Có lỗi xảy ra khi lưu lịch hẹn!');
		}
	};

	return (
		<Form form={form} layout='vertical' onFinish={onFinish}>
			<Form.Item name='date' label='Ngày hẹn' rules={[{ required: true, message: 'Vui lòng chọn ngày hẹn!' }]}>
				<DatePicker disabledDate={disabledDate} format='DD/MM/YYYY' style={{ width: '100%' }} />
			</Form.Item>

			<Form.Item name='time' label='Giờ hẹn' rules={[{ required: true, message: 'Vui lòng chọn giờ hẹn!' }]}>
				<TimePicker format='HH:mm' style={{ width: '100%' }} />
			</Form.Item>

			<Form.Item name='serviceId' label='Dịch vụ' rules={[{ required: true, message: 'Vui lòng chọn dịch vụ!' }]}>
				<Select placeholder='Chọn dịch vụ' onChange={onServiceChange}>
					{services.map((service) => (
						<Option key={service.id} value={service.id}>
							{service.name} - {service.price.toLocaleString()} VND
						</Option>
					))}
				</Select>
			</Form.Item>

			<Form.Item name='employeeId' label='Nhân viên' rules={[{ required: true, message: 'Vui lòng chọn nhân viên!' }]}>
				<Select placeholder='Chọn nhân viên' disabled={availableEmployees.length === 0}>
					{availableEmployees.map((employee) => (
						<Option key={employee.id} value={employee.id}>
							{employee.name}
						</Option>
					))}
				</Select>
			</Form.Item>

			{isEdit && (
				<Form.Item name='status' label='Trạng thái'>
					<Select>
						<Option value='Chờ xác nhận'>Chờ xác nhận</Option>
						<Option value='Đã xác nhận'>Đã xác nhận</Option>
						<Option value='Hoàn thành'>Hoàn thành</Option>
						<Option value='Đã hủy'>Đã hủy</Option>
					</Select>
				</Form.Item>
			)}

			<Form.Item>
				<Button type='primary' htmlType='submit'>
					{isEdit ? 'Cập nhật' : 'Tạo mới'}
				</Button>
			</Form.Item>
		</Form>
	);
};

const AppointmentManagement = () => {
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [services, setServices] = useState<Service[]>([]);
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [visible, setVisible] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [currentRow, setCurrentRow] = useState<Appointment | undefined>(undefined);
	const [activeTab, setActiveTab] = useState('all');
	const [loading, setLoading] = useState(true);

	const fetchAppointmentData = async () => {
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
			message.error('Có lỗi xảy ra khi tải dữ liệu!');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAppointmentData();
	}, []);

	const handleAdd = () => {
		setIsEdit(false);
		setCurrentRow(undefined);
		setVisible(true);
	};

	const handleEdit = (record: Appointment) => {
		setIsEdit(true);
		setCurrentRow(record);
		setVisible(true);
	};

	const handleDelete = async (id: string) => {
		try {
			await deleteAppointment(id);
			message.success('Xóa lịch hẹn thành công!');
			fetchAppointmentData();
		} catch (error) {
			console.error('Error deleting appointment:', error);
			message.error('Có lỗi xảy ra khi xóa lịch hẹn!');
		}
	};

	const columns = [
		{
			title: 'Ngày hẹn',
			dataIndex: 'date',
			key: 'date',
			render: (text: string) => moment(text).format('DD/MM/YYYY'),
		},
		{
			title: 'Giờ hẹn',
			dataIndex: 'time',
			key: 'time',
		},
		{
			title: 'Dịch vụ',
			dataIndex: 'serviceId',
			key: 'serviceId',
			render: (serviceId: string) => {
				const service = services.find((s) => s.id === serviceId);
				return service ? service.name : 'N/A';
			},
		},
		{
			title: 'Nhân viên',
			dataIndex: 'employeeId',
			key: 'employeeId',
			render: (employeeId: string) => {
				const employee = employees.find((e) => e.id === employeeId);
				return employee ? employee.name : 'N/A';
			},
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
		},
		{
			title: 'Thao tác',
			key: 'action',
			render: (_: any, record: Appointment) => (
				<>
					<Button type='link' onClick={() => handleEdit(record)}>
						Sửa
					</Button>
					<Button type='link' danger onClick={() => handleDelete(record.id!)}>
						Xóa
					</Button>
				</>
			),
		},
	];

	const filteredAppointments =
		activeTab === 'all' ? appointments : appointments.filter((app) => app.status === activeTab);

	return (
		<div style={{ padding: '20px' }}>
			<div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
				<h2>Quản lý lịch hẹn</h2>
				<Button type='primary' onClick={handleAdd}>
					Thêm lịch hẹn
				</Button>
			</div>

			<Tabs activeKey={activeTab} onChange={setActiveTab}>
				<TabPane tab='Tất cả' key='all' />
				<TabPane tab='Chờ xác nhận' key='Chờ xác nhận' />
				<TabPane tab='Đã xác nhận' key='Đã xác nhận' />
				<TabPane tab='Hoàn thành' key='Hoàn thành' />
				<TabPane tab='Đã hủy' key='Đã hủy' />
			</Tabs>

			<Table columns={columns} dataSource={filteredAppointments} rowKey='id' loading={loading} />

			<Modal
				title={isEdit ? 'Sửa lịch hẹn' : 'Thêm lịch hẹn'}
				visible={visible}
				onCancel={() => setVisible(false)}
				footer={null}
			>
				<AppointmentForm
					isEdit={isEdit}
					row={currentRow}
					setVisible={setVisible}
					fetchAppointmentData={fetchAppointmentData}
					services={services}
					employees={employees}
				/>
			</Modal>
		</div>
	);
};

export default AppointmentManagement;
