import { CSpinner } from '@coreui/react-pro';
import { useParams } from 'react-router-dom';

import BoardPostDetailsForm from '../../../components/board/BoardPostDetailsForm';
import useBoardPostDetails from '../../../hooks/board/useBoardPostDetails';

const BoardPostDetailsPage = () => {
  const { id } = useParams();
  const boardPostDetails = useBoardPostDetails(id);
  if (boardPostDetails.isLoading)
    return (
      <div className="m-3">
        {/*REMIND CElementCover 사용해서 spinner 사용*/}
        <CSpinner variant="grow" color="primary"></CSpinner>
      </div>
    );
  return (
    <>
      <BoardPostDetailsForm formData={boardPostDetails.postDetails} />
    </>
  );
};
export default BoardPostDetailsPage;
