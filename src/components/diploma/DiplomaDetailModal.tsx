import { Modal } from 'antd';
import { Diploma } from '../../models/diploma';

interface DiplomaDetailModalProps {
	diploma: Diploma | null;
	onClose: () => void;
}

export const DiplomaDetailModal = ({ diploma, onClose }: DiplomaDetailModalProps) => {
	if (!diploma) return null;

	return (
		<Modal title='Chi tiết văn bằng' visible={!!diploma} onCancel={onClose} footer={null}>
			<p>Số hiệu văn bằng: {diploma.diplomaNumber}</p>
			<p>Tên sinh viên: {diploma.studentName}</p>
			<p>Mã sinh viên: {diploma.studentId}</p>
			<p>Quyết định tốt nghiệp: {diploma.decisionId}</p>
			<p>Ngày ban hành quyết định: {diploma.decisionIssuedDate}</p>
		</Modal>
	);
};
