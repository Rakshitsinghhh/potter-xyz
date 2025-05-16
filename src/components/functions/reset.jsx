export const resetTimer = () => {
  clearInterval(intervalRef.current);
  setTotalSeconds(fullTime);
  intervalRef.current = setInterval(() => {
    setTotalSeconds((prev) => {
      if (prev <= 1) {
        clearInterval(intervalRef.current);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
};

export default resetTimer;
