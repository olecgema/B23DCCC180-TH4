import axios from 'axios';
import { Diploma, DiplomaBook, GraduationDecision, DiplomaSearchParams } from '../models/diploma';
import { API_ENDPOINTS } from '../constants/diploma';
import moment from 'moment';

const DIPLOMA_API = 'https://67e554c818194932a5859888.mockapi.io/api/diplomas/diploma';
const DIPLOMA_BOOK_API = 'https://67e5baab18194932a5871460.mockapi.io/diplomaBooks';
const DECISION_API = 'https://67e5562818194932a5859df4.mockapi.io/GraduationDecision';

export const DiplomaService = {
	// Diploma Book APIs
	getDiplomaBooks: async (): Promise<DiplomaBook[]> => {
		const response = await axios.get(DIPLOMA_BOOK_API);
		return response.data;
	},

	createDiplomaBook: async (book: Partial<DiplomaBook>): Promise<DiplomaBook> => {
		const response = await axios.post(DIPLOMA_BOOK_API, {
			...book,
			currentEntryNumber: 0,
		});
		return response.data;
	},

	updateDiplomaBook: async (id: string, book: Partial<DiplomaBook>): Promise<DiplomaBook> => {
		const response = await axios.put(`${DIPLOMA_BOOK_API}/${id}`, book);
		return response.data;
	},

	deleteDiplomaBook: async (id: string): Promise<void> => {
		await axios.delete(`${DIPLOMA_BOOK_API}/${id}`);
	},

	// Diploma APIs
	getDiplomas: async (bookId?: string): Promise<Diploma[]> => {
		const url = bookId ? `${API_ENDPOINTS.DIPLOMA}?diplomaBookId=${bookId}` : API_ENDPOINTS.DIPLOMA;
		const response = await axios.get(url);
		return response.data;
	},

	createDiploma: async (diploma: Partial<Diploma>): Promise<Diploma> => {
		const response = await axios.post(API_ENDPOINTS.DIPLOMA, {
			...diploma,
			graduationDate: diploma.graduationDate ? moment(diploma.graduationDate).format('YYYY-MM-DD') : null,
		});
		return response.data;
	},

	updateDiploma: async (id: string, diploma: Partial<Diploma>): Promise<Diploma> => {
		const response = await axios.put(`${API_ENDPOINTS.DIPLOMA}/${id}`, {
			...diploma,
			graduationDate: diploma.graduationDate ? moment(diploma.graduationDate).format('YYYY-MM-DD') : null,
		});
		return response.data;
	},

	deleteDiploma: async (id: string): Promise<void> => {
		await axios.delete(`${API_ENDPOINTS.DIPLOMA}/${id}`);
	},

	// Graduation Decision APIs
	getDecisions: async (): Promise<GraduationDecision[]> => {
		const response = await axios.get(API_ENDPOINTS.DECISION);
		return response.data;
	},

	createDecision: async (decision: Partial<GraduationDecision>): Promise<GraduationDecision> => {
		const response = await axios.post(DECISION_API, {
			...decision,
			issuedDate: moment(decision.issuedDate).format('YYYY-MM-DD'),
		});
		return response.data;
	},

	updateDecision: async (id: string, decision: Partial<GraduationDecision>): Promise<GraduationDecision> => {
		const response = await axios.put(`${DECISION_API}/${id}`, {
			...decision,
			issuedDate: moment(decision.issuedDate).format('YYYY-MM-DD'),
		});
		return response.data;
	},

	deleteDecision: async (id: string): Promise<void> => {
		await axios.delete(`${DECISION_API}/${id}`);
	},

	// Search APIs
	searchDiplomas: async (params: DiplomaSearchParams): Promise<Diploma[]> => {
		const response = await axios.get(API_ENDPOINTS.DIPLOMA, { params });
		return response.data;
	},

	updateSearchCount: async (decisionId: string): Promise<void> => {
		try {
			const response = await axios.get(`${API_ENDPOINTS.DECISION}/${decisionId}`);
			const currentCount = response.data.searchCount || 0;
			await axios.put(`${API_ENDPOINTS.DECISION}/${decisionId}`, {
				searchCount: currentCount + 1,
			});
		} catch (error) {
			console.error('Lỗi khi cập nhật lượt tra cứu:', error);
		}
	},
};
