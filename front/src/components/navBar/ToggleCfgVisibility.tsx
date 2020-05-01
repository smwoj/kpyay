import { Action } from "redux";
import { Button } from "antd";
import { toggleCfgBtnVisibility } from "../../store/actions";
import * as React from "react";
import { connect } from "react-redux";
import { AppState } from "../../store/models";

const ToggleCfgVisibilityButton = (props: {
  showConfigButtons: boolean;
  dispatch: (action: Action) => void;
}): JSX.Element => {
  const { showConfigButtons, dispatch } = props;
  return (
    <Button
      size="large"
      type="primary"
      shape="round"
      className="cfg-toggle"
      onClick={() => {
        dispatch(toggleCfgBtnVisibility());
      }}
    >
      {showConfigButtons ? "hide config buttons" : "show config buttons"}
    </Button>
  );
};
export default connect((state: AppState) => {
  return { showConfigButtons: state.showConfigButtons };
})(ToggleCfgVisibilityButton);
