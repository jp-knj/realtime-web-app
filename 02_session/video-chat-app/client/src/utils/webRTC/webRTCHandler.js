import store from "../../store/store";
import { setLocalStream } from "../../store/actions/callActions";

const defaultConstraints = {
  video: true,
  audio: true,
};

export const getLocalStream = () => {
  navigator.mediaDevices
    .getUserMedia(defaultConstraints)
    .then((stream) => {
      store.dispatch(setLocalStream(stream));
    })
    .catch((err) => {
      console.log(err);
    });
};
