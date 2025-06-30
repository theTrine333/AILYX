import { useEffect, useState } from "react";
import { Keyboard, KeyboardEvent } from "react-native";

function useKeyboardStatus() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const onShow = (e: KeyboardEvent) => setKeyboardVisible(true);
    const onHide = (e: KeyboardEvent) => setKeyboardVisible(false);

    const showSubscription = Keyboard.addListener("keyboardDidShow", onShow);
    const hideSubscription = Keyboard.addListener("keyboardDidHide", onHide);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return keyboardVisible;
}

export default useKeyboardStatus;
