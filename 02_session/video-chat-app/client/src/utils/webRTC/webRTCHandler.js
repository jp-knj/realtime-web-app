import store from "../../store/store";
import {
  callStates,
  setCallState,
  setLocalStream,
} from "../../store/actions/callActions";

const defaultConstraints = {
  video: true,
  audio: true,
};

export const getLocalStream = () => {
  navigator.mediaDevices
    .getUserMedia(defaultConstraints)
    .then((stream) => {
      store.dispatch(setLocalStream(stream));
      store.dispatch(setCallState(callStates.CALL_AVAILABLE));
    })
    .catch((err) => {
      console.log(err);
    });
};
