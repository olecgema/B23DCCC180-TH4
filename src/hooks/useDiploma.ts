import { useState, useEffect } from 'react';
import { message } from 'antd';
import { Diploma, DiplomaBook, GraduationDecision } from '../models/diploma';
import { DiplomaService } from '../services/diploma';

export const useDiploma = () => {
	const [diplomaBooks, setDiplomaBooks] = useState<DiplomaBook[]>([]);
	const [diplomas, setDiplomas] = useState<Diploma[]>([]);
	const [decisions, setDecisions] = useState<GraduationDecision[]>([]);
	const [loading, setLoading] = useState(false);
	const [selectedBook, setSelectedBook] = useState<DiplomaBook | null>(null);

	const fetchDiplomaBooks = async () => {
		setLoading(true);
		try {
			const data = await DiplomaService.getDiplomaBooks();
			setDiplomaBooks(data);
		} catch (error) {
			message.error('Lỗi khi tải danh sách sổ văn bằng!');
		} finally {
			setLoading(false);
		}
	};

	const fetchDiplomas = async (bookId: string) => {
		setLoading(true);
		try {
			const data = await DiplomaService.getDiplomas(bookId);
			setDiplomas(data);
		} catch (error) {
			message.error('Lỗi khi tải danh sách văn bằng!');
		} finally {
			setLoading(false);
		}
	};

	const fetchDecisions = async () => {
		try {
			const data = await DiplomaService.getDecisions();
			setDecisions(data);
		} catch (error) {
			message.error('Lỗi khi tải danh sách quyết định tốt nghiệp!');
		}
	};

	const createDiplomaBook = async (book: Partial<DiplomaBook>) => {
		setLoading(true);
		try {
			await DiplomaService.createDiplomaBook(book);
			message.success('Thêm sổ văn bằng thành công!');
			await fetchDiplomaBooks();
		} catch (error) {
			message.error('Lỗi khi lưu sổ văn bằng!');
		} finally {
			setLoading(false);
		}
	};

	const updateDiplomaBook = async (id: string, book: Partial<DiplomaBook>) => {
		setLoading(true);
		try {
			await DiplomaService.updateDiplomaBook(id, book);
			message.success('Cập nhật sổ văn bằng thành công!');
			await fetchDiplomaBooks();
		} catch (error) {
			message.error('Lỗi khi cập nhật sổ văn bằng!');
		} finally {
			setLoading(false);
		}
	};

	const deleteDiplomaBook = async (id: string) => {
		setLoading(true);
		try {
			const linkedDiplomas = diplomas.filter((diploma) => diploma.diplomaBookId === id);
			if (linkedDiplomas.length > 0) {
				message.error('Không thể xóa sổ văn bằng vì có văn bằng liên kết!');
				return;
			}
			await DiplomaService.deleteDiplomaBook(id);
			message.success('Xóa sổ văn bằng thành công!');
			await fetchDiplomaBooks();
		} catch (error) {
			message.error('Lỗi khi xóa sổ văn bằng!');
		} finally {
			setLoading(false);
		}
	};

	const createDiploma = async (diploma: Partial<Diploma>) => {
		setLoading(true);
		try {
			if (selectedBook) {
				const currentEntryNumber = selectedBook.currentEntryNumber || 1;
				await DiplomaService.createDiploma({
					...diploma,
					entryNumber: currentEntryNumber,
					diplomaBookId: selectedBook.id,
				});
				await DiplomaService.updateDiplomaBook(selectedBook.id, {
					currentEntryNumber: currentEntryNumber + 1,
				});
				message.success('Thêm văn bằng thành công!');
				await fetchDiplomas(selectedBook.id);
			}
		} catch (error) {
			message.error('Lỗi khi lưu văn bằng!');
		} finally {
			setLoading(false);
		}
	};

	const updateDiploma = async (id: string, diploma: Partial<Diploma>) => {
		setLoading(true);
		try {
			await DiplomaService.updateDiploma(id, diploma);
			message.success('Cập nhật văn bằng thành công!');
			if (selectedBook) {
				await fetchDiplomas(selectedBook.id);
			}
		} catch (error) {
			message.error('Lỗi khi cập nhật văn bằng!');
		} finally {
			setLoading(false);
		}
	};

	const deleteDiploma = async (id: string) => {
		setLoading(true);
		try {
			await DiplomaService.deleteDiploma(id);
			message.success('Xóa văn bằng thành công!');
			if (selectedBook) {
				await fetchDiplomas(selectedBook.id);
			}
		} catch (error) {
			message.error('Lỗi khi xóa văn bằng!');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchDiplomaBooks();
		fetchDecisions();
	}, []);

	useEffect(() => {
		if (diplomaBooks.length > 0 && !selectedBook) {
			setSelectedBook(diplomaBooks[0]);
			fetchDiplomas(diplomaBooks[0].id);
		}
	}, [diplomaBooks]);

	useEffect(() => {
		if (selectedBook) {
			fetchDiplomas(selectedBook.id);
		}
	}, [selectedBook]);

	return {
		diplomaBooks,
		diplomas,
		decisions,
		loading,
		selectedBook,
		setSelectedBook,
		createDiplomaBook,
		updateDiplomaBook,
		deleteDiplomaBook,
		createDiploma,
		updateDiploma,
		deleteDiploma,
	};
};
