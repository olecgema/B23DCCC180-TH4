import { Button, Form, Input, Modal, Table, Select } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';

const { Option } = Select;

interface Service {
	id: string;
	name: string;
	price: number;
	workSchedule: string[];
}

interface Employee {
	id?: string;
	name: string;
	maxCustomersPerDay: number;
	workSchedule: string[]; // Mảng lịch làm việc
	services: string[]; // Mảng ID dịch vụ
}

const EmployeeForm: React.FC<{
	isEdit: boolean;
	row: Employee | undefined;
	setVisible: (visible: boolean) => void;
	fetchEmployees: () => void;
	services: Service[];
}> = ({ isEdit, row, setVisible, fetchEmployees, services }) => {
	const [form] = Form.useForm();

	useEffect(() => {
		if (row && isEdit) {
			form.setFieldsValue({
				name: row.name,
				maxCustomersPerDay: row.maxCustomersPerDay,
				workSchedule: Array.isArray(row.workSchedule) ? row.workSchedule : [],
				services: Array.isArray(row.services) ? row.services : [],
			});
		} else {
			form.resetFields();
		}
	}, [row, isEdit, form]);

	const onFinish = async (values: any) => {
		const apiUrl = 'https://67d237fd90e0670699bcb276.mockapi.io/cuahang/Nhanvien';
		const employeeData = {
			name: values.name,
			maxCustomersPerDay: values.maxCustomersPerDay,
			workSchedule: values.workSchedule || [],
			services: values.services || [],
		};

		if (isEdit && row?.id) {
			await axios.put(`${apiUrl}/${row.id}`, employeeData);
		} else {
			await axios.post(apiUrl, employeeData);
		}
		setVisible(false);
		fetchEmployees();
	};

	return (
		<Form form={form} onFinish={onFinish}>
			<Form.Item
				label='Tên nhân viên'
				name='name'
				rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên!' }]}
			>
				<Input />
			</Form.Item>
			<Form.Item
				label='Số khách tối đa/ngày'
				name='maxCustomersPerDay'
				rules={[{ required: true, message: 'Vui lòng nhập số khách tối đa!' }]}
			>
				<Input type='number' />
			</Form.Item>
			<Form.Item
				label='Lịch làm việc'
				name='workSchedule'
				rules={[{ required: true, message: 'Vui lòng chọn ít nhất một lịch làm việc!' }]}
			>
				<Select mode='multiple' placeholder='Chọn ngày và ca làm việc' allowClear>
					{['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'].flatMap((day) =>
						['7h-12h', '13h-18h', '19h-22h'].map((shift) => (
							<Option key={`${day}, ${shift}`} value={`${day}, ${shift}`}>
								{`${day}, ${shift}`}
							</Option>
						)),
					)}
				</Select>
			</Form.Item>
			<Form.Item
				label='Dịch vụ'
				name='services'
				rules={[{ required: true, message: 'Vui lòng chọn ít nhất một dịch vụ!' }]}
			>
				<Select mode='multiple' placeholder='Chọn dịch vụ' allowClear>
					{services.map((service) => (
						<Option key={service.id} value={service.id}>
							{service.name}
						</Option>
					))}
				</Select>
			</Form.Item>
			<div className='form-footer'>
				<Button htmlType='submit' type='primary'>
					{isEdit ? 'Lưu' : 'Thêm'}
				</Button>
				<Button onClick={() => setVisible(false)}>Hủy</Button>
			</div>
		</Form>
	);
};

const EmployeeManagement = () => {
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [services, setServices] = useState<Service[]>([]);
	const [visible, setVisible] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [selectedRow, setSelectedRow] = useState<Employee | undefined>();

	const fetchEmployees = async () => {
		const response = await axios.get('https://67d237fd90e0670699bcb276.mockapi.io/cuahang/Nhanvien');
		setEmployees(response.data);
	};

	const fetchServices = async () => {
		const response = await axios.get('https://67d237fd90e0670699bcb276.mockapi.io/cuahang/Vieclam');
		setServices(response.data);
	};

	useEffect(() => {
		fetchEmployees();
		fetchServices();
	}, []);

	const columns = [
		{ title: 'Tên nhân viên', dataIndex: 'name', key: 'name', width: 200 },
		{ title: 'Số khách tối đa/ngày', dataIndex: 'maxCustomersPerDay', key: 'maxCustomers', width: 150 },
		{
			title: 'Lịch làm việc',
			dataIndex: 'workSchedule',
			key: 'schedule',
			width: 300,
			render: (workSchedule: string[]) => (Array.isArray(workSchedule) ? workSchedule.join('; ') : 'Chưa có lịch'),
		},
		{
			title: 'Dịch vụ',
			dataIndex: 'services',
			key: 'services',
			width: 300,
			render: (serviceIds: string[]) =>
				Array.isArray(serviceIds)
					? serviceIds.map((id) => services.find((service) => service.id === id)?.name || 'Không xác định').join('; ')
					: 'Chưa có dịch vụ',
		},
		{
			title: 'Hành động',
			width: 200,
			align: 'center' as const,
			render: (record: Employee) => (
				<div>
					<Button
						onClick={() => {
							setVisible(true);
							setSelectedRow(record);
							setIsEdit(true);
						}}
					>
						Sửa
					</Button>
					<Button
						style={{ marginLeft: 10 }}
						type='primary'
						onClick={async () => {
							await axios.delete(`https://67d237fd90e0670699bcb276.mockapi.io/cuahang/Nhanvien/${record.id}`);
							fetchEmployees();
						}}
					>
						Xóa
					</Button>
				</div>
			),
		},
	];

	return (
		<div>
			<Button
				type='primary'
				onClick={() => {
					setVisible(true);
					setIsEdit(false);
				}}
			>
				Thêm nhân viên
			</Button>
			<Table dataSource={employees} columns={columns} rowKey='id' />
			<Modal
				destroyOnClose
				footer={false}
				title={isEdit ? 'Sửa nhân viên' : 'Thêm nhân viên'}
				visible={visible}
				onCancel={() => setVisible(false)}
			>
				<EmployeeForm
					isEdit={isEdit}
					row={selectedRow}
					setVisible={setVisible}
					fetchEmployees={fetchEmployees}
					services={services}
				/>
			</Modal>
		</div>
	);
};

export default EmployeeManagement;
