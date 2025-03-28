import { Table, Button } from 'antd';
import moment from 'moment';
import { Diploma, GraduationDecision } from '../../models/diploma';

interface SearchResultTableProps {
	results: Diploma[];
	decisions: GraduationDecision[];
	onSelect: (diploma: Diploma) => void;
}

export const SearchResultTable = ({ results, decisions, onSelect }: SearchResultTableProps) => {
	const columns = [
		{ title: 'Số hiệu văn bằng', dataIndex: 'diplomaNumber', key: 'diplomaNumber' },
		{ title: 'Tên sinh viên', dataIndex: 'studentName', key: 'studentName' },
		{ title: 'Mã sinh viên', dataIndex: 'studentId', key: 'studentId' },
		{
			title: 'Quyết định tốt nghiệp',
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
			title: 'Số lượt tra cứu',
			dataIndex: 'searchCount',
			key: 'searchCount',
			render: (count: number) => count || 0,
		},
		{
			title: 'Hành động',
			render: (record: Diploma) => (
				<Button type='link' onClick={() => onSelect(record)}>
					Xem chi tiết
				</Button>
			),
		},
	];

	return <Table dataSource={results} columns={columns} rowKey='id' />;
};
