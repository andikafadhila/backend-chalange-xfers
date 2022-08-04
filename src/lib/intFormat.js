const intFormat = (int) => {
  let output = int.split(".").join("");
  output = output.replace(/,/g, ".");

  return parseFloat(output);
};

module.exports = { intFormat };
