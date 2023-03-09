const json_data = require("./cat.json");
const prompt = require("prompt-sync")({ sigint: true });

const get2019Data = () => {
  let data = json_data.filter((data) => data.year == 2019)[0];
  delete data["year"];
  return data;
};

const get2024Data = () => {
  let data = json_data.filter((data) => data.year == 2024)[0];
  delete data["year"];
  return data;
};

const sortObjects = (obj) => {
  const sortable = Object.entries(obj)
    .sort(([, a], [, b]) => b - a)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

  return sortable;
};

const getRankedList = (obj) => {
  let rankedList = Object.keys(obj);
  let rankedListWithRank = [];
  rank = 1;
  rankedList.forEach((item) => {
    rankedListWithRank.push({
      name: item,
      rank,
    });
    rank++;
  });
  return rankedListWithRank;
};

const getThree = (list) => {
  let length = list.length;

  // get top and bottom three
  let topThree = list.slice(0, 3);
  let bottomThree = list.slice(length - 4, length - 1);

  // get names of top and bottom three
  let topThreeName = topThree.map((item) => item.name);
  let bottomThreeName = bottomThree.map((item) => item.name);

  return [topThreeName, bottomThreeName];
};

const getRankFromUserInput = (list) => {
  let property = prompt("Please enter value of property: ");
  let itemRequired = list.filter((item) => item.name === property)[0];
  console.log(`Rank of ${property} is ${itemRequired.rank}`);
};

const compareThree = (objA, objB) => {
  let diffList = [];
  let objBList = Object.keys(objB);
  let valA = Object.values(objA);
  let valB = Object.values(objB);
  let length = valA.length;
  for (let i = 0; i < length; i++) {
    diffList.push(valA[i] - valB[i]);
  }
  let sortedDiffList = [...diffList].sort((a, b) => b - a);
  let fastThree = sortedDiffList.slice(0, 3);
  let slowThree = sortedDiffList.slice(length - 4, length - 1);
  let fastThreeGrowing = [];
  let slowThreeGrowing = [];
  fastThree.forEach((element) => {
    let index = diffList.indexOf(element);
    fastThreeGrowing.push(objBList[index]);
  });
  slowThree.forEach((element) => {
    let index = diffList.indexOf(element);
    slowThreeGrowing.push(objBList[index]);
  });
  return [fastThreeGrowing, slowThreeGrowing];
};

const main = () => {
  let data2019 = get2019Data();
  let data2024 = get2024Data();
  const sortedData2019 = sortObjects(data2019);
  const sortedData2024 = sortObjects(data2024);
  const rankToday = getRankedList(sortedData2019);
  const rankFuture = getRankedList(sortedData2024);
  const [topThreeToday, bottomThreeToday] = getThree(rankToday);
  const [topThreeFuture, bottomThreeFuture] = getThree(rankFuture);
  const [fastThreeGrowing, slowThreeGrowing] = compareThree(data2019, data2024);
  console.log(`Parsed JSON data for 2019 record: ${JSON.stringify(data2019)}`);
  console.log(`Parsed JSON data for 2024 record: ${JSON.stringify(data2024)}`);
  console.log(
    `Top three today: ${topThreeToday.join(
      ", "
    )} and bottom three today: ${bottomThreeToday.join(", ")}`
  );
  console.log(
    `Top three future: ${topThreeFuture.join(
      ", "
    )} and bottom three future: ${bottomThreeFuture.join(", ")}`
  );
  console.log(
    `Top three acclerating: ${fastThreeGrowing.join(
      ", "
    )} and bottom three acclerating: ${slowThreeGrowing.join(", ")}`
  );
  console.log("Get rank for today");
  getRankFromUserInput(rankToday);
  console.log("Get rank for future");
  getRankFromUserInput(rankFuture);
};

main();
