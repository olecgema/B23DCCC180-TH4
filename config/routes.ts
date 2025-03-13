import route from 'mock/route';
import path from 'path';

export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/ung-dung-dat-lich',
		name: 'Ứng dụng đặt lịch',
		routes: [
			{
				path: '/ung-dung-dat-lich/employee-management',
				name: 'Quản lý nhân viên',
				component: './EmployeeManagement',
				icon: 'UserOutlined',
			},
			{
				path: '/ung-dung-dat-lich/service-management',
				name: 'Quản lý dịch vụ',
				component: './ServiceManagement',
				icon: 'ToolOutlined',
			},
			{
				path: '/ung-dung-dat-lich/appointment-management',
				name: 'Đặt lịch',
				component: './AppointmentManagement',
				icon: 'CalendarOutlined',
			},
			{
				path: '/ung-dung-dat-lich/Review',
				name: 'Đánh giá',
				component: './Review',
				icon: 'StarOutlined',
			},
			{
				path: '/ung-dung-dat-lich/revenue-stats',
				name: 'Thống kê',
				component: './RevenueStats',
				icon: 'DollarOutlined',
			},
		],
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
