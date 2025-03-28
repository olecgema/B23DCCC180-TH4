import { Button, Table, Modal, Form, Input, message, Spin, Tooltip, Popconfirm, DatePicker } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

const DiplomaBookManagement = () => {
  const [diplomaBooks, setDiplomaBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState<{ id: string; year: number; currentEntryNumber: number } | null>(null);
  const [diplomas, setDiplomas] = useState([]);
  const [diplomaFormVisible, setDiplomaFormVisible] = useState(false);
  const [diplomaForm] = Form.useForm();

  // Fetch danh sách sổ văn bằng
  const fetchDiplomaBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://67e5baab18194932a5871460.mockapi.io/diplomaBooks');
      if (response.data) {
        setDiplomaBooks(response.data);
      } else {
        message.warning('Không có dữ liệu sổ văn bằng!');
      }
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu sổ văn bằng!');
    } finally {
      setLoading(false);
    }
  };

  // Fetch danh sách văn bằng trong sổ
  const fetchDiplomas = async (bookId: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://67e554c818194932a5859888.mockapi.io/api/diplomas/diploma?diplomaBookId=${bookId}`);
      if (response.data) {
        setDiplomas(response.data);
      } else {
        message.warning('Không có dữ liệu văn bằng!');
      }
    } catch (error) {
      message.error('Lỗi khi tải danh sách văn bằng!');
    } finally {
      setLoading(false);
    }
  };

  // Thêm văn bằng mới
  const addDiploma = async (values: any) => {
    if (!selectedBook) {
      message.error('Vui lòng chọn một sổ văn bằng trước khi thêm văn bằng!');
      return;
    }

    setLoading(true);
    try {
      // Lấy số vào sổ hiện tại từ sổ văn bằng
      const currentEntryNumber = selectedBook.currentEntryNumber || 1;

      // Tạo văn bằng mới
      const newDiploma = {
        ...values,
        entryNumber: currentEntryNumber,
        diplomaBookId: selectedBook.id,
      };

      // Gửi yêu cầu thêm văn bằng
      await axios.post('https://67e554c818194932a5859888.mockapi.io/api/diplomas/diploma', newDiploma);

      // Cập nhật số vào sổ hiện tại trong sổ văn bằng
      await axios.put(`https://67e5baab18194932a5871460.mockapi.io/diplomaBooks/${selectedBook.id}`, {
        currentEntryNumber: currentEntryNumber + 1,
      });

      message.success('Thêm văn bằng thành công!');
      fetchDiplomas(selectedBook.id);
      setDiplomaFormVisible(false);
      diplomaForm.resetFields();
    } catch (error) {
      message.error('Lỗi khi thêm văn bằng!');
    } finally {
      setLoading(false);
    }
  };

  // Mở sổ văn bằng mới
  const openNewDiplomaBook = async () => {
    setLoading(true);
    try {
      const currentYear = new Date().getFullYear();
      const existingBook = diplomaBooks.find((book: any) => book.year === currentYear);

      if (existingBook) {
        message.warning('Sổ văn bằng cho năm hiện tại đã tồn tại!');
        return;
      }

      await axios.post('https://67e5baab18194932a5871460.mockapi.io/diplomaBooks', {
        year: currentYear,
        createdAt: new Date().toISOString(),
        currentEntryNumber: 1, // Reset số vào sổ về 1
      });
      message.success('Mở sổ văn bằng mới thành công!');
      fetchDiplomaBooks();
    } catch (error) {
      message.error('Lỗi khi mở sổ văn bằng mới!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiplomaBooks();
  }, []);

  const columns = [
    { title: 'Năm', dataIndex: 'year', key: 'year' },
    { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt' },
    { title: 'Số vào sổ hiện tại', dataIndex: 'currentEntryNumber', key: 'currentEntryNumber' },
    {
      title: 'Hành động',
      render: (record: any) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Tooltip title="Quản lý văn bằng">
            <Button
              type="link"
              onClick={() => {
                setSelectedBook(record);
                fetchDiplomas(record.id);
              }}
            >
              Văn bằng
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const diplomaColumns = [
    { title: 'Số vào sổ', dataIndex: 'entryNumber', key: 'entryNumber' },
    { title: 'Số hiệu văn bằng', dataIndex: 'diplomaNumber', key: 'diplomaNumber' },
    { title: 'Tên sinh viên', dataIndex: 'studentName', key: 'studentName' },
    { title: 'Mã sinh viên', dataIndex: 'studentId', key: 'studentId' },
    { title: 'Ngành học', dataIndex: 'major', key: 'major' },
    { title: 'Ngày tốt nghiệp', dataIndex: 'graduationDate', key: 'graduationDate' },
  ];

  return (
    <Spin spinning={loading}>
      <div>
        <Button type="primary" onClick={openNewDiplomaBook} style={{ marginBottom: 16 }}>
          Mở sổ văn bằng mới
        </Button>
        <Table dataSource={diplomaBooks} columns={columns} rowKey="id" pagination={{ pageSize: 5 }} />
        {selectedBook && (
          <Modal
            title={`Quản lý văn bằng - Năm ${selectedBook.year}`}
            visible={!!selectedBook}
            onCancel={() => setSelectedBook(null)}
            footer={[
              <Button key="add" type="primary" onClick={() => setDiplomaFormVisible(true)}>
                Thêm văn bằng
              </Button>,
            ]}
          >
            <Table dataSource={diplomas} columns={diplomaColumns} rowKey="id" pagination={{ pageSize: 5 }} />
          </Modal>
        )}
        <Modal
          title="Thêm văn bằng"
          visible={diplomaFormVisible}
          onCancel={() => setDiplomaFormVisible(false)}
          onOk={() => diplomaForm.submit()}
        >
          <Form form={diplomaForm} onFinish={addDiploma}>
            <Form.Item
              label="Số hiệu văn bằng"
              name="diplomaNumber"
              rules={[{ required: true, message: 'Vui lòng nhập số hiệu văn bằng!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Tên sinh viên"
              name="studentName"
              rules={[{ required: true, message: 'Vui lòng nhập tên sinh viên!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Mã sinh viên"
              name="studentId"
              rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Ngành học"
              name="major"
              rules={[{ required: true, message: 'Vui lòng nhập ngành học!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Ngày tốt nghiệp"
              name="graduationDate"
              rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
            >
              <DatePicker
                disabledDate={(current) => {
                  // Disable all dates before today
                  return current && current < moment().startOf('day');
                }}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Spin>
  );
};

export default DiplomaBookManagement;