let startTime, pastTime;
let timerId;

const timer = (beginTime, baseTime, setTime, sw, countMode = true) => {
  // console.log("countMode", countMode, "sw", sw, "beginTime", beginTime);
  if (countMode) {
    if (sw === "start") {
      startTime = Math.floor(beginTime / 1000);
      timerId = setInterval(() => {
        pastTime = Math.floor(new Date().getTime() / 1000) - startTime;
        const setTimeData = baseTime - pastTime;
        // console.log(
        //   "duration(within interval)",
        //   new Date().getTime() / 1000 - startTime,
        //   "setTimeData",
        //   setTimeData
        // );
        if (setTimeData > 0) {
          const timeMin = Math.floor(setTimeData / 60);
          const timeSec = Math.floor(setTimeData % 60);
          document.title = `
        ${("00" + timeMin).slice(-2)}:${("00" + timeSec).slice(
            -2
          )} - TimeTracker
    `;
          setTime(timeMin, timeSec);
        } else {
          const timeMin = Math.floor(baseTime / 60);
          const timeSec = Math.floor(baseTime % 60);
          clearInterval(timerId);
          // console.log(new Date().getTime());
          // console.log(
          //   "duration(within interval)",
          //   new Date().getTime() / 1000 - startTime
          // );
          document.title = `${("00" + timeMin).slice(-2)}:${(
            "00" + timeSec
          ).slice(-2)}`;
          setTime(timeMin, timeSec, "finish");
        }
      }, 100);
    } else {
      if (beginTime === "") {
        const timeMin = Math.floor(baseTime / 60);
        const timeSec = Math.floor(baseTime % 60);
        document.title = `${("00" + timeMin).slice(-2)}:${(
          "00" + timeSec
        ).slice(-2)}`;
      } else {
        const setTimeData = baseTime - pastTime;
        const timeMin = Math.floor(setTimeData / 60);
        const timeSec = Math.floor(setTimeData % 60);
        clearInterval(timerId);
        document.title = `${("00" + timeMin).slice(-2)}:${(
          "00" + timeSec
        ).slice(-2)}`;
        setTime(timeMin, timeSec, "stop");
      }
    }
  } else {
    if (sw === "start") {
      startTime = Math.floor(beginTime / 1000);
      timerId = setInterval(() => {
        pastTime = Math.floor(new Date().getTime() / 1000) - startTime;
        const timeMin = Math.floor(pastTime / 60);
        const timeSec = Math.floor(pastTime % 60);
        document.title = `
        ${("00" + timeMin).slice(-2)}:${("00" + timeSec).slice(
          -2
        )} - TimeTracker
    `;
        setTime(timeMin, timeSec);
      }, 100);
    } else {
      const timeMin = Math.floor(pastTime / 60);
      const timeSec = Math.floor(pastTime % 60);
      clearInterval(timerId);
      document.title = `00:00 - TimeTracker`;
      setTime(timeMin, timeSec, "stop");
    }
  }
};

export default timer;
