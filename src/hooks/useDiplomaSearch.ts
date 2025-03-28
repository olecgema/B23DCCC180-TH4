import { useState, useEffect } from 'react';
import { message } from 'antd';
import { Diploma, GraduationDecision, DiplomaSearchParams } from '../models/diploma';
import { DiplomaService } from '../services/diploma';
import moment from 'moment';

export const useDiplomaSearch = () => {
	const [results, setResults] = useState<Diploma[]>([]);
	const [decisions, setDecisions] = useState<GraduationDecision[]>([]);
	const [loading, setLoading] = useState(false);
	const [selectedDiploma, setSelectedDiploma] = useState<Diploma | null>(null);

	const fetchDecisions = async () => {
		try {
			const data = await DiplomaService.getDecisions();
			setDecisions(data);
		} catch (error) {
			message.error('Lỗi khi tải danh sách quyết định tốt nghiệp!');
		}
	};

	const searchDiplomas = async (values: DiplomaSearchParams) => {
		const filledFields = Object.values(values).filter((value) => value);
		if (filledFields.length < 2) {
			message.error('Vui lòng nhập ít nhất 2 tham số để tìm kiếm!');
			return;
		}

		setLoading(true);
		try {
			const diplomas = await DiplomaService.searchDiplomas(values);

			// Gắn thông tin quyết định vào văn bằng
			const enrichedDiplomas = diplomas.map((diploma) => {
				const decision = decisions.find((d) => d.id === diploma.decisionId);
				return {
					...diploma,
					decisionNumber: decision?.decisionNumber || 'Không xác định',
					decisionIssuedDate: decision ? moment(decision.issuedDate).format('DD/MM/YYYY') : 'Không xác định',
				};
			});

			setResults(enrichedDiplomas);
		} catch (error) {
			message.error('Lỗi khi tìm kiếm văn bằng!');
		} finally {
			setLoading(false);
		}
	};

	const handleDiplomaSelect = async (diploma: Diploma) => {
		setSelectedDiploma(diploma);
		if (diploma.decisionId) {
			await DiplomaService.updateSearchCount(diploma.decisionId);
		}
	};

	useEffect(() => {
		fetchDecisions();
	}, []);

	return {
		results,
		decisions,
		loading,
		selectedDiploma,
		setSelectedDiploma,
		searchDiplomas,
		handleDiplomaSelect,
	};
};
