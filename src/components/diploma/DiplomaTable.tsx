import { Table, Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Diploma, GraduationDecision } from '../../models/diploma';
import { TABLE_PAGE_SIZE } from '../../constants/diploma';

interface DiplomaTableProps {
	diplomas: Diploma[];
	decisions: GraduationDecision[];
	onEdit: (diploma: Diploma) => void;
	onDelete: (id: string) => void;
}

export const DiplomaTable = ({ diplomas, decisions, onEdit, onDelete }: DiplomaTableProps) => {
	const columns = [
		{ title: 'Số vào sổ', dataIndex: 'entryNumber', key: 'entryNumber' },
		{ title: 'Số hiệu văn bằng', dataIndex: 'diplomaNumber', key: 'diplomaNumber' },
		{ title: 'Tên sinh viên', dataIndex: 'studentName', key: 'studentName' },
		{ title: 'Mã sinh viên', dataIndex: 'studentId', key: 'studentId' },
		{ title: 'Ngành học', dataIndex: 'major', key: 'major' },
		{
			title: 'Ngày tốt nghiệp',
			dataIndex: 'graduationDate',
			key: 'graduationDate',
			render: (date: string) => {
				return date ? moment(date).format('DD/MM/YYYY') : '';
			},
		},
		{ title: 'Điểm trung bình', dataIndex: 'DiemTB', key: 'DiemTB' },
		{ title: 'Xếp hạng', dataIndex: 'XepHang', key: 'XepHang' },
		{ title: 'Hệ đào tạo', dataIndex: 'HeDaoTao', key: 'HeDaoTao' },
		{ title: 'Nơi sinh', dataIndex: 'NoiSinh', key: 'NoiSinh' },
		{ title: 'Dân tộc', dataIndex: 'DanToc', key: 'DanToc' },
		{
			title: 'Quyết định',
			dataIndex: 'decisionId',
			key: 'decisionId',
			render: (decisionId: string) => {
				const decision = decisions.find((d) => d.id === decisionId);
				return decision
					? `${decision.decisionNumber} - ${moment(decision.issuedDate).format('DD/MM/YYYY')}`
					: 'Không xác định';
			},
		},
		{
			title: 'Hành động',
			render: (record: Diploma) => (
				<div style={{ display: 'flex', gap: '10px' }}>
					<Button type='link' icon={<EditOutlined />} onClick={() => onEdit(record)}>
						Sửa
					</Button>
					<Popconfirm
						title='Bạn có chắc chắn muốn xóa?'
						onConfirm={() => onDelete(record.id)}
						okText='Xóa'
						cancelText='Hủy'
					>
						<Button type='link' danger icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</div>
			),
		},
	];

	return <Table dataSource={diplomas} columns={columns} rowKey='id' pagination={{ pageSize: TABLE_PAGE_SIZE }} />;
};
