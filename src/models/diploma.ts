export interface Diploma {
	id: string;
	entryNumber: number;
	diplomaNumber: string;
	studentName: string;
	studentId: string;
	major: string;
	graduationDate: string;
	diplomaBookId: string;
	DiemTB?: number;
	XepHang?: string;
	HeDaoTao?: string;
	NoiSinh?: string;
	DanToc?: string;
	decisionId?: string;
	birthDate?: string;
	searchCount?: number;
}

export interface DiplomaBook {
	id: string;
	year: number;
	currentEntryNumber?: number;
}

export interface GraduationDecision {
	id: string;
	decisionNumber: string;
	issuedDate: string;
	description: string;
	diplomaBookId: string;
	searchCount?: number;
}

export interface DiplomaSearchParams {
	diplomaNumber?: string;
	studentName?: string;
	studentId?: string;
	entryNumber?: number;
	birthDate?: string;
	decisionId?: string;
}
