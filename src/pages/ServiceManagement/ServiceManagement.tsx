import { Button, Form, Input, Modal, Table, Select, message } from 'antd';
import { useEffect, useState } from 'react';

// Import services
import { fetchServices, createService, updateService, deleteService } from '../../services/service';

// Import models
import { Service } from '../../models/service';

const { Option } = Select;

const ServiceForm: React.FC<{
	isEdit: boolean;
	row: Service | undefined;
	setVisible: (visible: boolean) => void;
	fetchServiceData: () => void;
}> = ({ isEdit, row, setVisible, fetchServiceData }) => {
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
	}, [form, row, isEdit]);

	const onFinish = async (values: any) => {
		try {
			const serviceData = {
				name: values.name,
				price: Number(values.price),
				workSchedule: values.workSchedule || [],
			};

			if (isEdit && row?.id) {
				await updateService(row.id, serviceData);
				message.success('Cập nhật dịch vụ thành công!');
			} else {
				await createService(serviceData);
				message.success('Thêm dịch vụ thành công!');
			}

			setVisible(false);
			fetchServiceData();
		} catch (error) {
			console.error('Error saving service:', error);
			message.error('Có lỗi xảy ra khi lưu thông tin dịch vụ!');
		}
	};

	return (
		<Form form={form} layout='vertical' onFinish={onFinish}>
			<Form.Item name='name' label='Tên dịch vụ' rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ!' }]}>
				<Input placeholder='Nhập tên dịch vụ' />
			</Form.Item>

			<Form.Item name='price' label='Giá dịch vụ' rules={[{ required: true, message: 'Vui lòng nhập giá dịch vụ!' }]}>
				<Input type='number' placeholder='Nhập giá dịch vụ' />
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

			<Form.Item>
				<Button type='primary' htmlType='submit'>
					{isEdit ? 'Cập nhật' : 'Thêm mới'}
				</Button>
			</Form.Item>
		</Form>
	);
};

const ServiceManagement: React.FC = () => {
	const [services, setServices] = useState<Service[]>([]);
	const [visible, setVisible] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [currentRow, setCurrentRow] = useState<Service | undefined>(undefined);
	const [loading, setLoading] = useState(true);

	const fetchServiceData = async () => {
		setLoading(true);
		try {
			const servicesData = await fetchServices();
			setServices(servicesData);
		} catch (error) {
			console.error('Error fetching services:', error);
			message.error('Có lỗi xảy ra khi tải dữ liệu!');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchServiceData();
	}, []);

	const handleAdd = () => {
		setIsEdit(false);
		setCurrentRow(undefined);
		setVisible(true);
	};

	const handleEdit = (record: Service) => {
		setIsEdit(true);
		setCurrentRow(record);
		setVisible(true);
	};

	const handleDelete = async (id: string) => {
		try {
			await deleteService(id);
			message.success('Xóa dịch vụ thành công!');
			fetchServiceData();
		} catch (error) {
			console.error('Error deleting service:', error);
			message.error('Có lỗi xảy ra khi xóa dịch vụ!');
		}
	};

	const columns = [
		{
			title: 'Tên dịch vụ',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Giá dịch vụ',
			dataIndex: 'price',
			key: 'price',
			render: (price: number) => `${price.toLocaleString()} VND`,
		},
		{
			title: 'Lịch làm việc',
			dataIndex: 'workSchedule',
			key: 'workSchedule',
			render: (workSchedule: string[]) => workSchedule.join(', '),
		},
		{
			title: 'Thao tác',
			key: 'action',
			render: (_: any, record: Service) => (
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
				<h2>Quản lý dịch vụ</h2>
				<Button type='primary' onClick={handleAdd}>
					Thêm dịch vụ
				</Button>
			</div>

			<Table columns={columns} dataSource={services} rowKey='id' loading={loading} />

			<Modal
				title={isEdit ? 'Sửa thông tin dịch vụ' : 'Thêm dịch vụ mới'}
				visible={visible}
				onCancel={() => setVisible(false)}
				footer={null}
			>
				<ServiceForm isEdit={isEdit} row={currentRow} setVisible={setVisible} fetchServiceData={fetchServiceData} />
			</Modal>
		</div>
	);
};

export default ServiceManagement;
