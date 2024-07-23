import { CPopover } from '@coreui/react-pro';

export const AIModelIcon = ({ modelName }) => {
  return (
    <>
      <CPopover content={<span className="bold">{modelName}</span>} trigger="hover" delay={300} placement="top">
        <span className={`ai-model-icon ${modelName}`}></span>
      </CPopover>
    </>
  );
};
