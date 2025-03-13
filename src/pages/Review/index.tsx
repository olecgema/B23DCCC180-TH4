import { Button, Form, Input, Select, Rate, message, Avatar, Typography, Space, Card, Divider, Tag, Empty } from 'antd';
import { LikeOutlined, CommentOutlined, UserOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

const { Option } = Select;
const { Text, Paragraph, Title } = Typography;

interface Review {
  id?: string;
  appointmentId: string;
  employeeId: string;
  serviceId: string;
  rating: number;
  comment: string;
  response?: string;
  createdAt?: string;
}

interface Employee {
  id: string;
  name: string;
}

interface Service {
  id: string;
  name: string;
}

interface Appointment {
  id: string;
  status: string;
  date: string;
  time: string;
  serviceId: string;
  employeeId: string;
}

const ReviewForm: React.FC<{
  appointment: Appointment;
  employees: Employee[];
  services: Service[];
  fetchReviews: () => void;
}> = ({ appointment, employees, services, fetchReviews }) => {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    const apiUrl = 'https://67d2592590e0670699bd2980.mockapi.io/lich-hen/danh-gia';
    const reviewData = {
      appointmentId: appointment.id,
      employeeId: values.employeeId,
      serviceId: values.serviceId,
      rating: values.rating,
      comment: values.comment,
      createdAt: new Date().toISOString(),
    };

    await axios.post(apiUrl, reviewData);
    message.success('Đánh giá đã được thêm thành công!');
    fetchReviews();
    form.resetFields();
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item label="Dịch vụ" name="serviceId" initialValue={appointment.serviceId} rules={[{ required: true, message: 'Vui lòng chọn dịch vụ!' }]}>
        <Select placeholder="Chọn dịch vụ" disabled>
          {services.map((service) => (
            <Option key={service.id} value={service.id}>
              {service.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Nhân viên" name="employeeId" initialValue={appointment.employeeId} rules={[{ required: true, message: 'Vui lòng chọn nhân viên!' }]}>
        <Select placeholder="Chọn nhân viên" disabled>
          {employees.map((employee) => (
            <Option key={employee.id} value={employee.id}>
              {employee.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Đánh giá" name="rating" rules={[{ required: true, message: 'Vui lòng chọn đánh giá!' }]}>
        <Rate allowHalf />
      </Form.Item>
      <Form.Item label="Bình luận" name="comment" rules={[{ required: true, message: 'Vui lòng nhập bình luận!' }]}>
        <Input.TextArea rows={4} placeholder="Hãy chia sẻ cảm nhận của bạn về dịch vụ này..." />
      </Form.Item>
      <div style={{ textAlign: 'right' }}>
        <Button htmlType="submit" type="primary">
          Gửi đánh giá
        </Button>
      </div>
    </Form>
  );
};

const ResponseForm: React.FC<{
  review: Review;
  fetchReviews: () => void;
}> = ({ review, fetchReviews }) => {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    const apiUrl = `https://67d2592590e0670699bd2980.mockapi.io/lich-hen/danh-gia/${review.id}`;
    
    await axios.put(apiUrl, {
      ...review,
      response: values.response,
    });
    
    message.success('Phản hồi đánh giá thành công!');
    fetchReviews();
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item name="response" rules={[{ required: true, message: 'Vui lòng nhập phản hồi!' }]}>
        <Input.TextArea rows={4} placeholder="Nhập phản hồi của bạn..." />
      </Form.Item>
      <div style={{ textAlign: 'right' }}>
        <Space>
          <Button htmlType="submit" type="primary">Gửi phản hồi</Button>
        </Space>
      </div>
    </Form>
  );
};

const ReviewCard: React.FC<{
  review: Review;
  employees: Employee[];
  services: Service[];
  fetchReviews: () => void;
}> = ({ review, employees, services, fetchReviews }) => {
  const [responseVisible, setResponseVisible] = useState(false);
  
  const employee = employees.find(e => e.id === review.employeeId);
  const service = services.find(s => s.id === review.serviceId);
  
  return (
    <Card 
      className="review-card" 
      style={{ marginBottom: 16, borderRadius: 8 }}
      bordered={false}
      hoverable
    >
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <Avatar size={48} icon={<UserOutlined />} style={{ marginRight: 16 }} />
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Text strong>Khách hàng</Text>
              <div>
                <Rate disabled defaultValue={review.rating} style={{ fontSize: 14 }} />
                <Text type="secondary" style={{ marginLeft: 8 }}>
                  {moment(review.createdAt).format('DD/MM/YYYY HH:mm')}
                </Text>
              </div>
            </div>
            
            <Tag color="blue">{service?.name || 'Không xác định'}</Tag>
          </div>
          
          <Paragraph style={{ margin: '12px 0' }}>
            {review.comment}
          </Paragraph>
          
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <Button type="text" icon={<LikeOutlined />}>Hữu ích</Button>
            <Button type="text" icon={<CommentOutlined />} onClick={() => setResponseVisible(!responseVisible)}>
              Phản hồi
            </Button>
          </div>
          
          {responseVisible && (
            <ResponseForm 
              review={review}
              fetchReviews={fetchReviews}
            />
          )}
          
          {review.response && (
            <Card 
              type="inner" 
              style={{ background: '#f5f5f5', borderRadius: 8 }}
              bordered={false}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <Avatar 
                  size={36} 
                  style={{ marginRight: 12, backgroundColor: '#1890ff' }}
                >
                  {employee?.name?.charAt(0) || 'N'}
                </Avatar>
                
                <div>
                  <Text strong>{employee?.name || 'Nhân viên'}</Text>
                  <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                    {moment(review.createdAt).add(1, 'day').format('DD/MM/YYYY HH:mm')}
                  </Text>
                  <Paragraph style={{ marginTop: 8 }}>
                    {review.response}
                  </Paragraph>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Card>
  );
};

const ReviewManagement = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const fetchReviews = async () => {
    const response = await axios.get('https://67d2592590e0670699bd2980.mockapi.io/lich-hen/danh-gia');
    setReviews(response.data);
  };

  const fetchEmployees = async () => {
    const response = await axios.get('https://67d237fd90e0670699bcb276.mockapi.io/cuahang/Nhanvien');
    setEmployees(response.data);
  };

  const fetchServices = async () => {
    const response = await axios.get('https://67d237fd90e0670699bcb276.mockapi.io/cuahang/Vieclam');
    setServices(response.data);
  };

  const fetchAppointments = async () => {
    const response = await axios.get('https://67d2592590e0670699bd2980.mockapi.io/lich-hen/Lich');
    setAppointments(response.data);
  };

  useEffect(() => {
    fetchReviews();
    fetchEmployees();
    fetchServices();
    fetchAppointments();
  }, []);

  const completedAppointments = appointments.filter(appointment => appointment.status === 'Hoàn thành');

  const filteredReviews = filterRating 
    ? reviews.filter(review => review.rating === filterRating)
    : reviews;

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
  });

  const getAverageRating = (employeeId: string) => {
    const employeeReviews = reviews.filter(review => review.employeeId === employeeId);
    if (employeeReviews.length === 0) return 0;
    const totalRating = employeeReviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / employeeReviews.length;
  };

  return (
    <div className="review-management" style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3}>Đánh giá và phản hồi</Title>
        
        <Space>
          <Select
            placeholder="Lọc đánh giá"
            allowClear
            style={{ width: 140 }}
            onChange={value => setFilterRating(value)}
          >
            <Option value={5}>5 sao</Option>
            <Option value={4}>4 sao</Option>
            <Option value={3}>3 sao</Option>
            <Option value={2}>2 sao</Option>
            <Option value={1}>1 sao</Option>
          </Select>
        </Space>
      </div>
      
      <div className="reviews-container">
        {sortedReviews.length > 0 ? (
          sortedReviews.map(review => (
            <ReviewCard
              key={review.id}
              review={review}
              employees={employees}
              services={services}
              fetchReviews={fetchReviews}
            />
          ))
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Chưa có đánh giá nào"
            style={{ margin: '40px 0' }}
          />
        )}
      </div>
      
      <Divider />

      <div className="completed-appointments">
        <Title level={4}>Lịch hẹn đã hoàn thành</Title>
        {completedAppointments.length > 0 ? (
          completedAppointments.map(appointment => (
            <Card 
              key={appointment.id}
              title={`${appointment.date} ${appointment.time} - ${services.find(s => s.id === appointment.serviceId)?.name || 'Không xác định'}`}
              style={{ marginBottom: 16 }}
            >
              <ReviewForm
                appointment={appointment}
                employees={employees}
                services={services}
                fetchReviews={fetchReviews}
              />
            </Card>
          ))
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Chưa có lịch hẹn hoàn thành nào"
            style={{ margin: '40px 0' }}
          />
        )}
      </div>

      <Divider />

      <div className="employee-ratings">
        <Title level={4}>Đánh giá trung bình của nhân viên</Title>
        {employees.map(employee => (
          <Card key={employee.id} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar size={48} icon={<UserOutlined />} style={{ marginRight: 16 }} />
              <div>
                <Text strong>{employee.name}</Text>
                <div>
                  <Rate disabled value={getAverageRating(employee.id)} style={{ fontSize: 14 }} />
                  <Text type="secondary" style={{ marginLeft: 8 }}>
                    {getAverageRating(employee.id).toFixed(1)} / 5
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewManagement;