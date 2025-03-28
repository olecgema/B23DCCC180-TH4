import { Spin } from 'antd';
import { useDiplomaSearch } from '../../hooks/useDiplomaSearch';
import { SearchForm } from '../../components/diploma/SearchForm';
import { SearchResultTable } from '../../components/diploma/SearchResultTable';
import { DiplomaDetailModal } from '../../components/diploma/DiplomaDetailModal';

const TraCuuVanBang = () => {
	const { results, decisions, loading, selectedDiploma, setSelectedDiploma, searchDiplomas, handleDiplomaSelect } =
		useDiplomaSearch();

	return (
		<Spin spinning={loading}>
			<div>
				<SearchForm decisions={decisions} onFinish={searchDiplomas} />
				<SearchResultTable results={results} decisions={decisions} onSelect={handleDiplomaSelect} />
				<DiplomaDetailModal diploma={selectedDiploma} onClose={() => setSelectedDiploma(null)} />
			</div>
		</Spin>
	);
};

export default TraCuuVanBang;
