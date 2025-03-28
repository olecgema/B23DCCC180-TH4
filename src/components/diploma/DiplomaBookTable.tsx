import { Table, Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { DiplomaBook } from '../../models/diploma';
import { TABLE_PAGE_SIZE } from '../../constants/diploma';

interface DiplomaBookTableProps {
	diplomaBooks: DiplomaBook[];
	onEdit: (book: DiplomaBook) => void;
	onDelete: (id: string) => void;
}

export const DiplomaBookTable = ({ diplomaBooks, onEdit, onDelete }: DiplomaBookTableProps) => {
	const columns = [
		{ title: 'Năm', dataIndex: 'year', key: 'year' },
		{ title: 'Số vào sổ hiện tại', dataIndex: 'currentEntryNumber', key: 'currentEntryNumber' },
		{
			title: 'Hành động',
			render: (record: DiplomaBook) => (
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

	return <Table dataSource={diplomaBooks} columns={columns} rowKey='id' pagination={{ pageSize: TABLE_PAGE_SIZE }} />;
};
