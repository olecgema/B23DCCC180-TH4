import { Form, Input, DatePicker, Select } from 'antd';
import moment from 'moment';
import { GraduationDecision, DiplomaBook } from '../../models/graduationDecision';

interface DecisionFormProps {
	form: any;
	diplomaBooks: DiplomaBook[];
	onFinish: (values: any) => void;
}

export const DecisionForm = ({ form, diplomaBooks, onFinish }: DecisionFormProps) => {
	return (
		<Form form={form} onFinish={onFinish}>
			<Form.Item
				label='Số quyết định'
				name='decisionNumber'
				rules={[{ required: true, message: 'Vui lòng nhập số quyết định!' }]}
			>
				<Input />
			</Form.Item>
			<Form.Item label='Ngày ban hành' name='issuedDate' rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}>
				<DatePicker
					disabledDate={(current) => {
						// Disable all dates before today
						return current && current < moment().startOf('day');
					}}
				/>
			</Form.Item>
			<Form.Item label='Trích yếu' name='description' rules={[{ required: true, message: 'Vui lòng nhập trích yếu!' }]}>
				<Input.TextArea />
			</Form.Item>
			<Form.Item
				label='Sổ văn bằng'
				name='diplomaBookId'
				rules={[{ required: true, message: 'Vui lòng chọn sổ văn bằng!' }]}
			>
				<Select>
					{diplomaBooks.map((book) => (
						<Select.Option key={book.id} value={book.id}>
							{book.year}
						</Select.Option>
					))}
				</Select>
			</Form.Item>
		</Form>
	);
};
