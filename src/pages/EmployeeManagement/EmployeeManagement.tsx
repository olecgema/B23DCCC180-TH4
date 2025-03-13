import { Button, Form, Input, Modal, Table, Select, message } from 'antd';
import { useEffect, useState } from 'react';

// Import services
import { fetchEmployees, createEmployee, updateEmployee, deleteEmployee } from '../../services/employee';
import { fetchServices } from '../../services/service';

// Import models
import { Employee } from '../../models/employee';
import { Service } from '../../models/service';

const { Option } = Select;

const EmployeeForm: React.FC<{
	isEdit: boolean;
	row: Employee | undefined;
	setVisible: (visible: boolean) => void;
	fetchEmployeeData: () => void;
	services: Service[];
}> = ({ isEdit, row, setVisible, fetchEmployeeData, services }) => {
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
	}, [form, row, isEdit]);

	const onFinish = async (values: any) => {
		try {
			const employeeData = {
				name: values.name,
				maxCustomersPerDay: values.maxCustomersPerDay,
				workSchedule: values.workSchedule || [],
				services: values.services || [],
			};

			if (isEdit && row?.id) {
				await updateEmployee(row.id, employeeData);
				message.success('Cập nhật nhân viên thành công!');
			} else {
				await createEmployee(employeeData);
				message.success('Thêm nhân viên thành công!');
			}

			setVisible(false);
			fetchEmployeeData();
		} catch (error) {
			console.error('Error saving employee:', error);
			message.error('Có lỗi xảy ra khi lưu thông tin nhân viên!');
		}
	};

	return (
		<Form form={form} layout='vertical' onFinish={onFinish}>
			<Form.Item
				name='name'
				label='Tên nhân viên'
				rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên!' }]}
			>
				<Input placeholder='Nhập tên nhân viên' />
			</Form.Item>

			<Form.Item
				name='maxCustomersPerDay'
				label='Số khách tối đa mỗi ngày'
				rules={[{ required: true, message: 'Vui lòng nhập số khách tối đa!' }]}
			>
				<Input type='number' placeholder='Nhập số khách tối đa' />
			</Form.Item>

			<Form.Item
				name='workSchedule'
				label='Lịch làm việc'
				rules={[{ required: true, message: 'Vui lòng chọn lịch làm việc!' }]}
			>
				<Select mode='multiple' placeholder='Chọn lịch làm việc'>
					<Option value='T2'>Thứ 2</Option>
					<Option value='T3'>Thứ 3</Option>
					<Option value='T4'>Thứ 4</Option>
					<Option value='T5'>Thứ 5</Option>
					<Option value='T6'>Thứ 6</Option>
					<Option value='T7'>Thứ 7</Option>
					<Option value='CN'>Chủ nhật</Option>
				</Select>
			</Form.Item>

			<Form.Item
				name='services'
				label='Dịch vụ đảm nhận'
				rules={[{ required: true, message: 'Vui lòng chọn dịch vụ!' }]}
			>
				<Select mode='multiple' placeholder='Chọn dịch vụ'>
					{services.map((service) => (
						<Option key={service.id} value={service.id}>
							{service.name}
						</Option>
					))}
				</Select>
			</Form.Item>

			<Form.Item>
				<Button type='primary' htmlType='submit'>
					{isEdit ? 'Cập nhật' : 'Thêm mới'}
				</Button>
			</Form.Item>
		</Form>
	);
};

const EmployeeManagement: React.FC = () => {
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [services, setServices] = useState<Service[]>([]);
	const [visible, setVisible] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [currentRow, setCurrentRow] = useState<Employee | undefined>(undefined);
	const [loading, setLoading] = useState(true);

	const fetchEmployeeData = async () => {
		setLoading(true);
		try {
			const [employeesData, servicesData] = await Promise.all([fetchEmployees(), fetchServices()]);

			setEmployees(employeesData);
			setServices(servicesData);
		} catch (error) {
			console.error('Error fetching data:', error);
			message.error('Có lỗi xảy ra khi tải dữ liệu!');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchEmployeeData();
	}, []);

	const handleAdd = () => {
		setIsEdit(false);
		setCurrentRow(undefined);
		setVisible(true);
	};

	const handleEdit = (record: Employee) => {
		setIsEdit(true);
		setCurrentRow(record);
		setVisible(true);
	};

	const handleDelete = async (id: string) => {
		try {
			await deleteEmployee(id);
			message.success('Xóa nhân viên thành công!');
			fetchEmployeeData();
		} catch (error) {
			console.error('Error deleting employee:', error);
			message.error('Có lỗi xảy ra khi xóa nhân viên!');
		}
	};

	const columns = [
		{
			title: 'Tên nhân viên',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Số khách tối đa/ngày',
			dataIndex: 'maxCustomersPerDay',
			key: 'maxCustomersPerDay',
		},
		{
			title: 'Lịch làm việc',
			dataIndex: 'workSchedule',
			key: 'workSchedule',
			render: (workSchedule: string[]) => workSchedule.join(', '),
		},
		{
			title: 'Dịch vụ đảm nhận',
			dataIndex: 'services',
			key: 'services',
			render: (serviceIds: string[]) => {
				const serviceNames = serviceIds.map((id) => {
					const service = services.find((s) => s.id === id);
					return service ? service.name : '';
				});
				return serviceNames.join(', ');
			},
		},
		{
			title: 'Thao tác',
			key: 'action',
			render: (_: any, record: Employee) => (
				<>
					<Button type='link' onClick={() => handleEdit(record)}>
						Sửa
					</Button>
					<Button type='link' danger onClick={() => handleDelete(record.id)}>
						Xóa
					</Button>
				</>
			),
		},
	];

	return (
		<div style={{ padding: '20px' }}>
			<div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
				<h2>Quản lý nhân viên</h2>
				<Button type='primary' onClick={handleAdd}>
					Thêm nhân viên
				</Button>
			</div>

			<Table columns={columns} dataSource={employees} rowKey='id' loading={loading} />

			<Modal
				title={isEdit ? 'Sửa thông tin nhân viên' : 'Thêm nhân viên mới'}
				visible={visible}
				onCancel={() => setVisible(false)}
				footer={null}
			>
				<EmployeeForm
					isEdit={isEdit}
					row={currentRow}
					setVisible={setVisible}
					fetchEmployeeData={fetchEmployeeData}
					services={services}
				/>
			</Modal>
		</div>
	);
};

export default EmployeeManagement;
