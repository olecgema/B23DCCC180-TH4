import { Button, Table, Modal, Form, Input, DatePicker, message, Tooltip, Popconfirm, Spin, Select } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

const GraduationDecisionManagement = () => {
  const [decisions, setDecisions] = useState([]);
  const [diplomaBooks, setDiplomaBooks] = useState<{ id: number; year: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingRow, setEditingRow] = useState<{ id: string; [key: string]: any } | null>(null);

  // Fetch danh sách quyết định tốt nghiệp
  const fetchDecisions = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://67e5562818194932a5859df4.mockapi.io/GraduationDecision');
      setDecisions(response.data);
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu quyết định tốt nghiệp!');
    } finally {
      setLoading(false);
    }
  };

  // Fetch danh sách sổ văn bằng
  const fetchDiplomaBooks = async () => {
    try {
      const response = await axios.get('https://67e5baab18194932a5871460.mockapi.io/diplomaBooks');
      setDiplomaBooks(response.data);
    } catch (error) {
      message.error('Lỗi khi tải danh sách sổ văn bằng!');
    }
  };

  // Thêm hoặc chỉnh sửa quyết định tốt nghiệp
  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        issuedDate: values.issuedDate.format('YYYY-MM-DD'), // Định dạng ngày trước khi gửi
      };

      if (editingRow) {
        await axios.put(`https://67e5562818194932a5859df4.mockapi.io/GraduationDecision/${editingRow.id}`, payload);
        message.success('Cập nhật quyết định tốt nghiệp thành công!');
      } else {
        await axios.post('https://67e5562818194932a5859df4.mockapi.io/GraduationDecision', payload);
        message.success('Thêm quyết định tốt nghiệp thành công!');
      }
      fetchDecisions();
      setVisible(false);
      form.resetFields();
      setEditingRow(null);
    } catch (error) {
      message.error('Lỗi khi lưu dữ liệu quyết định tốt nghiệp!');
    } finally {
      setLoading(false);
    }
  };

  // Xóa quyết định tốt nghiệp
  const deleteDecision = async (id: string) => {
    setLoading(true);
    try {
      await axios.delete(`https://67e5562818194932a5859df4.mockapi.io/GraduationDecision/${id}`);
      message.success('Xóa quyết định tốt nghiệp thành công!');
      fetchDecisions();
    } catch (error) {
      message.error('Lỗi khi xóa quyết định tốt nghiệp!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecisions();
    fetchDiplomaBooks();
  }, []);

  const columns = [
    { title: 'Số quyết định', dataIndex: 'decisionNumber', key: 'decisionNumber' },
    { title: 'Ngày ban hành', dataIndex: 'issuedDate', key: 'issuedDate' },
    { title: 'Trích yếu', dataIndex: 'description', key: 'description' },
    {
      title: 'Sổ văn bằng',
      dataIndex: 'diplomaBookId',
      key: 'diplomaBookId',
      render: (diplomaBookId: number) => {
        const foundBook = diplomaBooks.find((book: any) => book.id === diplomaBookId);
        return foundBook ? foundBook.year : 'Không xác định';
      },
    },
    {
      title: 'Hành động',
      render: (record: any) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="link"
              onClick={() => {
                setEditingRow(record);
                form.setFieldsValue({
                  ...record,
                  issuedDate: moment(record.issuedDate),
                });
                setVisible(true);
              }}
            >
              Sửa
            </Button>
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa?"
              onConfirm={() => deleteDecision(record.id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button type="link" danger>
                Xóa
              </Button>
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <div>
        <Button type="primary" onClick={() => setVisible(true)} style={{ marginBottom: 16 }}>
          Thêm quyết định
        </Button>
        <Table dataSource={decisions} columns={columns} rowKey="id" pagination={{ pageSize: 5 }} />
        <Modal
          title={editingRow ? 'Chỉnh sửa quyết định tốt nghiệp' : 'Thêm quyết định tốt nghiệp'}
          visible={visible}
          onCancel={() => {
            setVisible(false);
            form.resetFields();
            setEditingRow(null);
          }}
          onOk={() => form.submit()}
        >
          <Form form={form} onFinish={onFinish}>
            <Form.Item
              label="Số quyết định"
              name="decisionNumber"
              rules={[{ required: true, message: 'Vui lòng nhập số quyết định!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Ngày ban hành"
              name="issuedDate"
              rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
            >
              <DatePicker
                disabledDate={(current) => {
                  // Disable all dates before today
                  return current && current < moment().startOf('day');
                }}
              />
            </Form.Item>
            <Form.Item
              label="Trích yếu"
              name="description"
              rules={[{ required: true, message: 'Vui lòng nhập trích yếu!' }]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              label="Sổ văn bằng"
              name="diplomaBookId"
              rules={[{ required: true, message: 'Vui lòng chọn sổ văn bằng!' }]}
            >
              <Select>
                {diplomaBooks.map((book: any) => (
                  <Select.Option key={book.id} value={book.id}>
                    {book.year}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Spin>
  );
};

export default GraduationDecisionManagement;