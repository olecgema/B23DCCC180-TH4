export interface GraduationDecision {
	id: string;
	decisionNumber: string;
	issuedDate: string;
	description: string;
	diplomaBookId: string;
	searchCount?: number;
}

export interface DiplomaBook {
	id: string;
	year: number;
	currentEntryNumber?: number;
}
