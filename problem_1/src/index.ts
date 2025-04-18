function main() {
  const input = [1, 3, 5, 7, 9];
  const sortedInput = input.sort((a, b) => b - a);

  let max = 0;
  const result = [];
  let caseCount = 0;

  // 1개, 4개의 경우
  for (let i = 0; i < sortedInput.length; i++) {
    const num1 = sortedInput[i];
    const num2 = Number(
      sortedInput
        .slice(0, i)
        .concat(sortedInput.slice(i + 1))
        .reduce((acc, cur) => String(acc) + String(cur), '')
    );

    if (num1 * num2 > max) {
      max = num1 * num2;
      result[0] = num1;
      result[1] = num2;
    }

    caseCount++;
  }

  // 2개, 3개의 경우
  for (let i = 0; i < sortedInput.length - 1; i++) {
    for (let j = i + 1; j < sortedInput.length; j++) {
      const num1 = Number(String(sortedInput[i]) + String(sortedInput[j]));
      const num2 = Number(
        sortedInput
          .filter((_, index) => index !== i && index !== j)
          .reduce((acc, cur) => String(acc) + String(cur), '')
      );

      if (num1 * num2 > max) {
        max = num1 * num2;
        result[0] = Number(num1);
        result[1] = num2;
      }

      caseCount++;
    }
  }

  console.log(`result: ${result[0]}, ${result[1]}`);
  console.log(`max: ${max}`);
  console.log(`총 경우의 수: ${caseCount}`);
}

main();
