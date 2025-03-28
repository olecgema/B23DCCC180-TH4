import { useState, useEffect } from 'react';
import { message } from 'antd';
import { GraduationDecision, DiplomaBook } from '../models/graduationDecision';
import { GraduationDecisionService } from '../services/graduationDecision';

export const useGraduationDecision = () => {
	const [decisions, setDecisions] = useState<GraduationDecision[]>([]);
	const [diplomaBooks, setDiplomaBooks] = useState<DiplomaBook[]>([]);
	const [loading, setLoading] = useState(false);

	const fetchDecisions = async () => {
		setLoading(true);
		try {
			const data = await GraduationDecisionService.getDecisions();
			setDecisions(data);
		} catch (error) {
			message.error('Lỗi khi tải dữ liệu quyết định tốt nghiệp!');
		} finally {
			setLoading(false);
		}
	};

	const fetchDiplomaBooks = async () => {
		try {
			const data = await GraduationDecisionService.getDiplomaBooks();
			setDiplomaBooks(data);
		} catch (error) {
			message.error('Lỗi khi tải danh sách sổ văn bằng!');
		}
	};

	const createDecision = async (decision: Partial<GraduationDecision>) => {
		setLoading(true);
		try {
			await GraduationDecisionService.createDecision(decision);
			message.success('Thêm quyết định tốt nghiệp thành công!');
			await fetchDecisions();
		} catch (error) {
			message.error('Lỗi khi lưu dữ liệu quyết định tốt nghiệp!');
		} finally {
			setLoading(false);
		}
	};

	const updateDecision = async (id: string, decision: Partial<GraduationDecision>) => {
		setLoading(true);
		try {
			await GraduationDecisionService.updateDecision(id, decision);
			message.success('Cập nhật quyết định tốt nghiệp thành công!');
			await fetchDecisions();
		} catch (error) {
			message.error('Lỗi khi cập nhật quyết định tốt nghiệp!');
		} finally {
			setLoading(false);
		}
	};

	const deleteDecision = async (id: string) => {
		setLoading(true);
		try {
			await GraduationDecisionService.deleteDecision(id);
			message.success('Xóa quyết định tốt nghiệp thành công!');
			await fetchDecisions();
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

	return {
		decisions,
		diplomaBooks,
		loading,
		createDecision,
		updateDecision,
		deleteDecision,
	};
};
