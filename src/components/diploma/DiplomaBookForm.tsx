import { Form, Input } from 'antd';
import { DiplomaBook } from '../../models/diploma';

interface DiplomaBookFormProps {
	form: any;
	onFinish: (values: any) => void;
}

export const DiplomaBookForm = ({ form, onFinish }: DiplomaBookFormProps) => {
	return (
		<Form form={form} onFinish={onFinish}>
			<Form.Item label='Năm' name='year' rules={[{ required: true, message: 'Vui lòng nhập năm!' }]}>
				<Input type='number' />
			</Form.Item>
		</Form>
	);
};
