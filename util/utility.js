// Split user command and user request
const parseReq = (req) => {
  const text = req.split(" ");
  if (text.length === 1) {
    return text; // [string]
  }
  text.shift();
  return text.join(" "); // string
};

module.exports = { parseReq };
