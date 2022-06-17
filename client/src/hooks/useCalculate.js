const useCalculate = (tasks, projects) => {
  const dataArr = [];
  projects?.forEach((project) => {
    dataArr.push(project);
    dataArr.push(tasks?.filter((task) => task.projectId === project._id));
  });
  let totalTime = 0;
  tasks?.forEach((task) => (totalTime += task.taskDuration));

  let projectsTotalTime = 0;
  const resultArr = dataArr.map((data, idx) => {
    if (idx % 2) {
      let sumDuration = 0;
      data.forEach((el) => (sumDuration += el.taskDuration));
      projectsTotalTime += sumDuration;
      return sumDuration;
    }
    return data;
  });
  resultArr.push({ title: "Without Project" });
  resultArr.push(totalTime - projectsTotalTime);

  return resultArr;
};

export default useCalculate;
