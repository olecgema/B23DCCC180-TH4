import { Button, Form, Input, Modal, Table, Select } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';

const { Option } = Select;

interface Service {
	id?: string;
	name: string;
	price: number;
	workSchedule: string[]; // Mảng lịch làm việc
}

const ServiceForm: React.FC<{
	isEdit: boolean;
	row: Service | undefined;
	setVisible: (visible: boolean) => void;
	fetchServices: () => void;
}> = ({ isEdit, row, setVisible, fetchServices }) => {
	const [form] = Form.useForm();

	useEffect(() => {
		if (row && isEdit) {
			form.setFieldsValue({
				name: row.name,
				price: row.price,
				workSchedule: Array.isArray(row.workSchedule) ? row.workSchedule : [],
			});
		} else {
			form.resetFields();
		}
	}, [row, isEdit, form]);

	const onFinish = async (values: any) => {
		const apiUrl = 'https://67d237fd90e0670699bcb276.mockapi.io/cuahang/Vieclam';
		const serviceData = {
			name: values.name,
			price: values.price,
			workSchedule: values.workSchedule || [],
		};

		if (isEdit && row?.id) {
			await axios.put(`${apiUrl}/${row.id}`, serviceData);
		} else {
			await axios.post(apiUrl, serviceData);
		}
		setVisible(false);
		fetchServices();
	};

	return (
		<Form form={form} onFinish={onFinish}>
			<Form.Item label='Tên dịch vụ' name='name' rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ!' }]}>
				<Input />
			</Form.Item>
			<Form.Item label='Giá (VND)' name='price' rules={[{ required: true, message: 'Vui lòng nhập giá dịch vụ!' }]}>
				<Input type='number' />
			</Form.Item>
			<Form.Item
				label='Lịch thực hiện'
				name='workSchedule'
				rules={[{ required: true, message: 'Vui lòng chọn ít nhất một lịch thực hiện!' }]}
			>
				<Select mode='multiple' placeholder='Chọn ngày và ca thực hiện' allowClear>
					{['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'].flatMap((day) =>
						['7h-12h', '13h-18h', '19h-22h'].map((shift) => (
							<Option key={`${day}, ${shift}`} value={`${day}, ${shift}`}>
								{`${day}, ${shift}`}
							</Option>
						)),
					)}
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

const ServiceManagement = () => {
	const [services, setServices] = useState<Service[]>([]);
	const [visible, setVisible] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [selectedRow, setSelectedRow] = useState<Service | undefined>();

	const fetchServices = async () => {
		const response = await axios.get('https://67d237fd90e0670699bcb276.mockapi.io/cuahang/Vieclam');
		setServices(response.data);
	};

	useEffect(() => {
		fetchServices();
	}, []);

	const columns = [
		{ title: 'Tên dịch vụ', dataIndex: 'name', key: 'name', width: 200 },
		{ title: 'Giá (VND)', dataIndex: 'price', key: 'price', width: 150 },
		{
			title: 'Lịch thực hiện',
			dataIndex: 'workSchedule',
			key: 'schedule',
			width: 300,
			render: (workSchedule: string[]) => (Array.isArray(workSchedule) ? workSchedule.join('; ') : 'Chưa có lịch'),
		},
		{
			title: 'Hành động',
			width: 200,
			align: 'center' as const,
			render: (record: Service) => (
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
							await axios.delete(`https://67d237fd90e0670699bcb276.mockapi.io/cuahang/Vieclam/${record.id}`);
							fetchServices();
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
				Thêm dịch vụ
			</Button>
			<Table dataSource={services} columns={columns} rowKey='id' />
			<Modal
				destroyOnClose
				footer={false}
				title={isEdit ? 'Sửa dịch vụ' : 'Thêm dịch vụ'}
				visible={visible}
				onCancel={() => setVisible(false)}
			>
				<ServiceForm isEdit={isEdit} row={selectedRow} setVisible={setVisible} fetchServices={fetchServices} />
			</Modal>
		</div>
	);
};

export default ServiceManagement;
