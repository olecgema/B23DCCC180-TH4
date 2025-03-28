import { Form, Input, DatePicker, InputNumber, Select } from 'antd';
import moment from 'moment';
import { Diploma, GraduationDecision } from '../../models/diploma';

interface DiplomaFormProps {
	form: any;
	decisions: GraduationDecision[];
	onFinish: (values: any) => void;
}

export const DiplomaForm = ({ form, decisions, onFinish }: DiplomaFormProps) => {
	return (
		<Form form={form} onFinish={onFinish} layout='vertical'>
			<Form.Item
				label='Số hiệu văn bằng'
				name='diplomaNumber'
				rules={[{ required: true, message: 'Vui lòng nhập số hiệu văn bằng!' }]}
			>
				<Input />
			</Form.Item>
			<Form.Item
				label='Tên sinh viên'
				name='studentName'
				rules={[{ required: true, message: 'Vui lòng nhập tên sinh viên!' }]}
			>
				<Input />
			</Form.Item>
			<Form.Item
				label='Mã sinh viên'
				name='studentId'
				rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên!' }]}
			>
				<Input />
			</Form.Item>
			<Form.Item label='Ngành học' name='major' rules={[{ required: true, message: 'Vui lòng nhập ngành học!' }]}>
				<Input />
			</Form.Item>
			<Form.Item
				label='Ngày tốt nghiệp'
				name='graduationDate'
				rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
			>
				<DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} />
			</Form.Item>
			<Form.Item
				label='Điểm trung bình'
				name='DiemTB'
				rules={[{ required: true, message: 'Vui lòng nhập điểm trung bình!' }]}
			>
				<InputNumber min={0} max={10} step={0.1} style={{ width: '100%' }} />
			</Form.Item>
			<Form.Item label='Xếp hạng' name='XepHang'>
				<Input />
			</Form.Item>
			<Form.Item label='Hệ đào tạo' name='HeDaoTao' rules={[{ required: true, message: 'Vui lòng chọn hệ đào tạo!' }]}>
				<Select placeholder='Chọn hệ đào tạo'>
					<Select.Option value='Chính quy'>Chính quy</Select.Option>
					<Select.Option value='Đào tạo từ xa'>Đào tạo từ xa</Select.Option>
				</Select>
			</Form.Item>
			<Form.Item label='Nơi sinh' name='NoiSinh'>
				<Input />
			</Form.Item>
			<Form.Item label='Dân tộc' name='DanToc'>
				<Input />
			</Form.Item>
			<Form.Item
				label='Thuộc quyết định'
				name='decisionId'
				rules={[{ required: true, message: 'Vui lòng chọn quyết định!' }]}
			>
				<Select placeholder='Chọn quyết định'>
					{decisions.map((decision) => (
						<Select.Option key={decision.id} value={decision.id}>
							{decision.decisionNumber} - {moment(decision.issuedDate).format('DD/MM/YYYY')}
						</Select.Option>
					))}
				</Select>
			</Form.Item>
		</Form>
	);
};
