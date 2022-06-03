const useThrottle = (cb, delay) => {
    let shouldWait = false;
    let waitArgs = null;
    let setTimeoutFunc = () => {
        if (waitArgs == null) {
            shouldWait = false;
        }else {
            cb(...waitArgs);
            waitArgs = null;
            setTimeout(setTimeoutFunc, delay);
        }
    };

    return (...args) => {
      if(shouldWait) {
        waitArgs = args
        return;
      }
      cb(...args)
      shouldWait = true;
      setTimeout(setTimeoutFunc, delay)
    };
}
 
export default useThrottle;