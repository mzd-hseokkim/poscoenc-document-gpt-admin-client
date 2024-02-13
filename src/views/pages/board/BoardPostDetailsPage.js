import { CSpinner } from '@coreui/react-pro';
import { useParams } from 'react-router-dom';

import BoardPostDetailsForm from '../../../components/board/BoardPostDetailsForm';
import useBoardPostDetails from '../../../hooks/board/useBoardPostDetails';

const BoardPostDetailsPage = () => {
  const { id } = useParams();
  const { postDetails, isLoading } = useBoardPostDetails(id);
  if (isLoading)
    return (
      <div className="m-3">
        <CSpinner variant="grow" color="primary"></CSpinner>
      </div>
    );
  return (
    <>
      <BoardPostDetailsForm formData={postDetails} />
    </>
  );
};
export default BoardPostDetailsPage;
