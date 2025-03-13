import { Button, Form, Input, Modal, Table, Select, DatePicker, TimePicker, message, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

const { Option } = Select;
const { TabPane } = Tabs;

interface Service {
  id: string;
  name: string;
  price: number;
  workSchedule: string[];
}

interface Employee {
  id: string;
  name: string;
  maxCustomersPerDay: number;
  workSchedule: string[];
  services: string[];
}

interface Appointment {
  id?: string;
  date: string;
  time: string;
  employeeId: string;
  serviceId: string;
  status: string;
}

const AppointmentForm: React.FC<{
  isEdit: boolean;
  row: Appointment | undefined;
  setVisible: (visible: boolean) => void;
  fetchAppointments: () => void;
  services: Service[];
  employees: Employee[];
}> = ({ isEdit, row, setVisible, fetchAppointments, services, employees }) => {
  const [form] = Form.useForm();
  const [availableEmployees, setAvailableEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    if (row && isEdit) {
      form.setFieldsValue({
        date: moment(row.date),
        time: moment(row.time, 'HH:mm'),
        serviceId: row.serviceId,
        employeeId: row.employeeId,
        status: row.status,
      });
    } else {
      form.resetFields();
    }
  }, [row, isEdit, form]);

  const onServiceChange = (serviceId: string) => {
    form.setFieldsValue({ employeeId: undefined });
    const selectedService = services.find(service => service.id === serviceId);
    if (selectedService) {
      const available = employees.filter(employee =>
        employee.services.includes(serviceId) &&
        employee.workSchedule.some(schedule => selectedService.workSchedule.includes(schedule))
      );
      setAvailableEmployees(available);
    }
  };

  const disabledDate = (current: moment.Moment) => {
    return current && current < moment().startOf('day');
  };

  const disabledTime = (current: moment.Moment) => {
    if (form.getFieldValue('date')?.isSame(moment(), 'day')) {
      return {
        disabledHours: () => Array.from({ length: 24 }, (_, i) => i).filter(hour => hour < moment().hour()),
        disabledMinutes: () => Array.from({ length: 60 }, (_, i) => i).filter(minute => minute < moment().minute()),
      };
    }
    return {};
  };

  const onFinish = async (values: any) => {
    const apiUrl = 'https://67d2592590e0670699bd2980.mockapi.io/lich-hen/Lich';
    const appointmentData = {
      date: values.date.format('YYYY-MM-DD'),
      time: values.time.format('HH:mm'),
      employeeId: values.employeeId,
      serviceId: values.serviceId,
      status: values.status,
    };

    // Kiểm tra lịch trùng
    const response = await axios.get(apiUrl);
    const existingAppointments = response.data as Appointment[];
    const isDuplicate = existingAppointments.some(
      (appointment) =>
        appointment.date === appointmentData.date &&
        appointment.time === appointmentData.time &&
        appointment.employeeId === appointmentData.employeeId &&
        (!isEdit || appointment.id !== row?.id)
    );

    if (isDuplicate) {
      message.error('Lịch hẹn trùng với lịch đã có!');
      return;
    }

    if (isEdit && row?.id) {
      await axios.put(`${apiUrl}/${row.id}`, appointmentData);
    } else {
      await axios.post(apiUrl, appointmentData);
    }
    setVisible(false);
    fetchAppointments();
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item label="Dịch vụ" name="serviceId" rules={[{ required: true, message: 'Vui lòng chọn dịch vụ!' }]}>
        <Select placeholder="Chọn dịch vụ" onChange={onServiceChange}>
          {services.map((service) => (
            <Option key={service.id} value={service.id}>
              {service.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Ngày" name="date" rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}>
        <DatePicker disabledDate={disabledDate} />
      </Form.Item>
      <Form.Item label="Giờ" name="time" rules={[{ required: true, message: 'Vui lòng chọn giờ!' }]}>
        <TimePicker format="HH:mm" disabledTime={disabledTime} />
      </Form.Item>
      <Form.Item label="Nhân viên" name="employeeId" rules={[{ required: true, message: 'Vui lòng chọn nhân viên!' }]}>
        <Select placeholder="Chọn nhân viên">
          {availableEmployees.map((employee) => (
            <Option key={employee.id} value={employee.id}>
              {employee.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Trạng thái" name="status" rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}>
        <Select placeholder="Chọn trạng thái">
          <Option value="Chờ duyệt">Chờ duyệt</Option>
          <Option value="Xác nhận">Xác nhận</Option>
          <Option value="Hoàn thành">Hoàn thành</Option>
          <Option value="Hủy">Hủy</Option>
        </Select>
      </Form.Item>
      <div className="form-footer">
        <Button htmlType="submit" type="primary">
          {isEdit ? 'Lưu' : 'Thêm'}
        </Button>
        <Button onClick={() => setVisible(false)}>Hủy</Button>
      </div>
    </Form>
  );
};

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Appointment | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<string>('Chờ duyệt');

  const fetchAppointments = async () => {
    const response = await axios.get('https://67d2592590e0670699bd2980.mockapi.io/lich-hen/Lich');
    setAppointments(response.data);
  };

  const fetchServices = async () => {
    const response = await axios.get('https://67d237fd90e0670699bcb276.mockapi.io/cuahang/Vieclam');
    setServices(response.data);
  };

  const fetchEmployees = async () => {
    const response = await axios.get('https://67d237fd90e0670699bcb276.mockapi.io/cuahang/Nhanvien');
    setEmployees(response.data);
  };

  useEffect(() => {
    fetchAppointments();
    fetchServices();
    fetchEmployees();
  }, []);

  const columns = [
    { title: 'Dịch vụ', dataIndex: 'serviceId', key: 'service', width: 200, render: (serviceId: string) => services.find(service => service.id === serviceId)?.name || 'Không xác định' },
    { title: 'Ngày', dataIndex: 'date', key: 'date', width: 150 },
    { title: 'Giờ', dataIndex: 'time', key: 'time', width: 100 },
    {
      title: 'Nhân viên',
      dataIndex: 'employeeId',
      key: 'employee',
      width: 200,
      render: (employeeId: string) => employees.find((employee) => employee.id === employeeId)?.name || 'Không xác định',
    },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', width: 150 },
    {
      title: 'Hành động',
      width: 200,
      align: 'center' as const,
      render: (record: Appointment) => (
        <div>
          <Button
            onClick={() => {
              setVisible(true);
              setSelectedRow(record);
              setIsEdit(true);
            }}
          >
            Sửa
          </Button>
          <Button
            style={{ marginLeft: 10 }}
            type="primary"
            onClick={async () => {
              await axios.delete(`https://67d2592590e0670699bd2980.mockapi.io/lich-hen/Lich/${record.id}`);
              fetchAppointments();
            }}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  const filteredAppointments = appointments.filter(appointment => appointment.status === selectedStatus);

  return (
    <div>
      <Button type="primary" onClick={() => { setVisible(true); setIsEdit(false); }}>
        Thêm lịch hẹn
      </Button>
      <Tabs defaultActiveKey="Chờ duyệt" onChange={setSelectedStatus}>
        <TabPane tab="Chờ duyệt" key="Chờ duyệt" />
        <TabPane tab="Xác nhận" key="Xác nhận" />
        <TabPane tab="Hoàn thành" key="Hoàn thành" />
        <TabPane tab="Hủy" key="Hủy" />
      </Tabs>
      <Table dataSource={filteredAppointments} columns={columns} rowKey="id" />
      <Modal
        destroyOnClose
        footer={false}
        title={isEdit ? 'Sửa lịch hẹn' : 'Thêm lịch hẹn'}
        visible={visible}
        onCancel={() => setVisible(false)}
      >
        <AppointmentForm
          isEdit={isEdit}
          row={selectedRow}
          setVisible={setVisible}
          fetchAppointments={fetchAppointments}
          services={services}
          employees={employees}
        />
      </Modal>
    </div>
  );
};

export default AppointmentManagement;