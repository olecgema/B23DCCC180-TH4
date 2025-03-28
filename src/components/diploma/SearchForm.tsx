import { Form, Input, DatePicker, Select, Button } from 'antd';
import moment from 'moment';
import { GraduationDecision } from '../../models/diploma';

interface SearchFormProps {
	decisions: GraduationDecision[];
	onFinish: (values: any) => void;
}

export const SearchForm = ({ decisions, onFinish }: SearchFormProps) => {
	return (
		<Form onFinish={onFinish} layout='inline' style={{ marginBottom: 16 }}>
			<Form.Item name='diplomaNumber'>
				<Input placeholder='Số hiệu văn bằng' />
			</Form.Item>
			<Form.Item name='studentName'>
				<Input placeholder='Họ tên' />
			</Form.Item>
			<Form.Item name='studentId'>
				<Input placeholder='Mã sinh viên' />
			</Form.Item>
			<Form.Item name='entryNumber'>
				<Input placeholder='Số vào sổ' type='number' />
			</Form.Item>
			<Form.Item name='birthDate'>
				<DatePicker format='DD/MM/YYYY' placeholder='Ngày sinh' style={{ width: '100%' }} />
			</Form.Item>
			<Form.Item name='decisionId'>
				<Select placeholder='Chọn quyết định tốt nghiệp' style={{ width: 200 }}>
					{decisions.map((decision) => (
						<Select.Option key={decision.id} value={decision.id}>
							{decision.decisionNumber} - {moment(decision.issuedDate).format('DD/MM/YYYY')}
						</Select.Option>
					))}
				</Select>
			</Form.Item>
			<Button type='primary' htmlType='submit'>
				Tìm kiếm
			</Button>
		</Form>
	);
};
