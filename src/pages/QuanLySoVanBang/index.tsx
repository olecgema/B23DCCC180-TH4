import { Button, Modal, Form, message, Spin, Card, Tabs, Select } from 'antd';
import { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Diploma, DiplomaBook } from '../../models/diploma';
import { useDiploma } from '../../hooks/useDiploma';
import { DiplomaBookTable } from '../../components/diploma/DiplomaBookTable';
import { DiplomaTable } from '../../components/diploma/DiplomaTable';
import { DiplomaForm } from '../../components/diploma/DiplomaForm';
import { DiplomaBookForm } from '../../components/diploma/DiplomaBookForm';
import { TRAINING_TYPES } from '../../constants/diploma';

const { TabPane } = Tabs;

const DiplomaBookManagement = () => {
	const {
		diplomaBooks,
		diplomas,
		decisions,
		loading,
		selectedBook,
		setSelectedBook,
		createDiplomaBook,
		updateDiplomaBook,
		deleteDiplomaBook,
		createDiploma,
		updateDiploma,
		deleteDiploma,
	} = useDiploma();

	const [diplomaFormVisible, setDiplomaFormVisible] = useState(false);
	const [diplomaBookFormVisible, setDiplomaBookFormVisible] = useState(false);
	const [editingDiploma, setEditingDiploma] = useState<Diploma | null>(null);
	const [editingBook, setEditingBook] = useState<DiplomaBook | null>(null);
	const [diplomaForm] = Form.useForm();
	const [diplomaBookForm] = Form.useForm();
	const [selectedTrainingType, setSelectedTrainingType] = useState<string>(TRAINING_TYPES.ALL);

	const handleDiplomaBookEdit = (book: DiplomaBook) => {
		setEditingBook(book);
		setDiplomaBookFormVisible(true);
		diplomaBookForm.setFieldsValue(book);
	};

	const handleDiplomaEdit = (diploma: Diploma) => {
		const formData = {
			...diploma,
			graduationDate: diploma.graduationDate ? moment(diploma.graduationDate) : null,
		};
		setEditingDiploma(diploma);
		setDiplomaFormVisible(true);
		diplomaForm.setFieldsValue(formData);
	};

	const handleDiplomaBookFinish = async (values: Partial<DiplomaBook>) => {
		if (editingBook) {
			await updateDiplomaBook(editingBook.id, values);
		} else {
			await createDiplomaBook(values);
		}
		setDiplomaBookFormVisible(false);
		setEditingBook(null);
		diplomaBookForm.resetFields();
	};

	const handleDiplomaFinish = async (values: Partial<Diploma>) => {
		if (editingDiploma) {
			await updateDiploma(editingDiploma.id, values);
		} else {
			await createDiploma(values);
		}
		setDiplomaFormVisible(false);
		setEditingDiploma(null);
		diplomaForm.resetFields();
	};

	const filteredDiplomas = diplomas.filter((diploma) => {
		if (selectedTrainingType === TRAINING_TYPES.ALL) return true;
		return diploma.HeDaoTao === selectedTrainingType;
	});

	return (
		<Spin spinning={loading}>
			<Card>
				<Tabs defaultActiveKey='1'>
					<TabPane tab='Quản lý sổ văn bằng' key='1'>
						<Button
							type='primary'
							icon={<PlusOutlined />}
							onClick={() => setDiplomaBookFormVisible(true)}
							style={{ marginBottom: 16 }}
						>
							Thêm sổ văn bằng
						</Button>
						<DiplomaBookTable diplomaBooks={diplomaBooks} onEdit={handleDiplomaBookEdit} onDelete={deleteDiplomaBook} />
					</TabPane>
					<TabPane tab='Quản lý văn bằng' key='2' disabled={!selectedBook}>
						{selectedBook ? (
							<>
								<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
									<div style={{ display: 'flex', gap: '16px' }}>
										<Select
											placeholder='Chọn năm'
											style={{ width: 200 }}
											onChange={(value) => {
												const selected = diplomaBooks.find((book) => book.id === value);
												if (selected) {
													setSelectedBook(selected);
												}
											}}
											value={selectedBook?.id}
										>
											{diplomaBooks.map((book) => (
												<Select.Option key={book.id} value={book.id}>
													{book.year}
												</Select.Option>
											))}
										</Select>
										<Select
											placeholder='Chọn hệ đào tạo'
											style={{ width: 200 }}
											onChange={(value) => setSelectedTrainingType(value)}
											value={selectedTrainingType}
										>
											<Select.Option value={TRAINING_TYPES.ALL}>Tất cả</Select.Option>
											<Select.Option value={TRAINING_TYPES.REGULAR}>Chính quy</Select.Option>
											<Select.Option value={TRAINING_TYPES.DISTANCE}>Đào tạo từ xa</Select.Option>
										</Select>
									</div>
									<Button type='primary' icon={<PlusOutlined />} onClick={() => setDiplomaFormVisible(true)}>
										Thêm văn bằng
									</Button>
								</div>
								<DiplomaTable
									diplomas={filteredDiplomas}
									decisions={decisions}
									onEdit={handleDiplomaEdit}
									onDelete={deleteDiploma}
								/>
							</>
						) : (
							<p>Vui lòng chọn một sổ văn bằng để quản lý văn bằng.</p>
						)}
					</TabPane>
				</Tabs>
			</Card>

			<Modal
				title={editingBook ? 'Sửa sổ văn bằng' : 'Thêm sổ văn bằng'}
				visible={diplomaBookFormVisible}
				onCancel={() => {
					setDiplomaBookFormVisible(false);
					setEditingBook(null);
					diplomaBookForm.resetFields();
				}}
				onOk={() => diplomaBookForm.submit()}
			>
				<DiplomaBookForm form={diplomaBookForm} onFinish={handleDiplomaBookFinish} />
			</Modal>

			<Modal
				title={editingDiploma ? 'Sửa văn bằng' : 'Thêm văn bằng'}
				visible={diplomaFormVisible}
				onCancel={() => {
					setDiplomaFormVisible(false);
					setEditingDiploma(null);
					diplomaForm.resetFields();
				}}
				onOk={() => diplomaForm.submit()}
			>
				<DiplomaForm
					form={diplomaForm}
					decisions={decisions.filter((decision) => decision.diplomaBookId === selectedBook?.id)}
					onFinish={handleDiplomaFinish}
				/>
			</Modal>
		</Spin>
	);
};

export default DiplomaBookManagement;
