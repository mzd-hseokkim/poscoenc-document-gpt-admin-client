import { CFormInput, CFormLabel, CFormTextarea, CInputGroup, CInputGroupText } from '@coreui/react-pro';
import { format } from 'date-fns';

const BoardComments = ({ formData }) => {
  return (
    <div className="comments-section">
      <CFormLabel htmlFor="postComments">댓글</CFormLabel>
      {formData?.comments?.map((comment, index) => (
        <div key={index} className="comment-item mb-2">
          <CInputGroup id="postComments" className="mb-1">
            <CFormInput value={comment.createdByName} readOnly />
            <CInputGroupText>{format(new Date(comment.createdAt), 'yyyy/MM/dd HH:mm:ss')}</CInputGroupText>
            {/*REMIND 신고 버튼, 답글 작성 기능추가 */}
          </CInputGroup>
          <CInputGroup>
            <CFormTextarea value={comment.content} readOnly></CFormTextarea>
          </CInputGroup>
        </div>
      ))}
      <CInputGroup className="mb-3">
        <CInputGroupText>댓글</CInputGroupText>
        <CFormTextarea placeholder="댓글을 입력해주세요..." />
        <CInputGroupText onClick={null} style={{ cursor: 'pointer' }}>
          작성
        </CInputGroupText>
      </CInputGroup>
    </div>
  );
};

export default BoardComments;
