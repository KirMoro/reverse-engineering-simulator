const TOKEN_CLASSES = {
  attr: 'text-syntax-attr',
  attrValue: 'text-syntax-attrValue',
  comment: 'text-syntax-comment',
  function: 'text-syntax-function',
  keyword: 'text-syntax-keyword',
  number: 'text-syntax-number',
  operator: 'text-syntax-operator',
  string: 'text-syntax-string',
  tag: 'text-syntax-tag',
  type: 'text-syntax-type',
};

const XML_PATTERNS = [
  { type: 'comment', regex: /<!--.*?-->/g },
  { type: 'tag', regex: /<\/?[A-Za-z0-9:-]+/g },
  { type: 'attr', regex: /\b[A-Za-z_:][\w:.-]*(?==)/g },
  { type: 'attrValue', regex: /"(?:\\.|[^"])*"/g },
  { type: 'operator', regex: /\/?>|=/g },
];

const CODE_PATTERNS = [
  { type: 'comment', regex: /\/\/.*|#.*/g },
  { type: 'string', regex: /"(?:\\.|[^"])*"|'(?:\\.|[^'])*'/g },
  { type: 'number', regex: /\b(?:0x[\da-fA-F]+|\d+)\b/g },
  {
    type: 'keyword',
    regex:
      /\b(?:public|private|protected|class|final|static|if|else|return|throw|new|void|int|boolean|true|false|null|package|import|try|catch|function|var|let|const|this)\b/g,
  },
  {
    type: 'type',
    regex:
      /\b(?:String|JSONObject|HttpClient|CreditCard|RuntimeException|Java|Object|Number|Boolean|Array|Promise|[A-Z][A-Za-z0-9_$]*)\b/g,
  },
  { type: 'function', regex: /\b[A-Za-z_$][\w$]*(?=\()/g },
  { type: 'operator', regex: /->|=>|==|!=|<=|>=|\|\||&&|[=+\-*/<>]/g },
];

const SMALI_PATTERNS = [
  { type: 'comment', regex: /#.*/g },
  { type: 'string', regex: /"(?:\\.|[^"])*"/g },
  { type: 'number', regex: /\b(?:0x[\da-fA-F]+|\d+)\b/g },
  {
    type: 'keyword',
    regex:
      /\.(?:method|end)\b|\b(?:public|return|invoke-static|invoke-virtual|move-result|const\/4)\b/g,
  },
  { type: 'type', regex: /\bL[A-Za-z0-9/_$;]+/g },
  { type: 'operator', regex: /->|[=+\-*/<>]/g },
];

function getPatterns(language) {
  if (language === 'xml') {
    return XML_PATTERNS;
  }

  if (language === 'smali') {
    return SMALI_PATTERNS;
  }

  return CODE_PATTERNS;
}

function cloneRegex(regex) {
  return new RegExp(regex.source, regex.flags);
}

function findNextMatch(line, startIndex, patterns) {
  let winner = null;

  patterns.forEach((pattern, priority) => {
    const regex = cloneRegex(pattern.regex);
    regex.lastIndex = startIndex;
    const match = regex.exec(line);

    if (!match) {
      return;
    }

    if (
      !winner ||
      match.index < winner.match.index ||
      (match.index === winner.match.index && priority < winner.priority)
    ) {
      winner = {
        match,
        priority,
        type: pattern.type,
      };
    }
  });

  return winner;
}

export function highlightLine(line, language = 'java') {
  if (!line.length) {
    return [{ className: '', text: ' ' }];
  }

  const patterns = getPatterns(language);
  const tokens = [];
  let cursor = 0;

  while (cursor < line.length) {
    const next = findNextMatch(line, cursor, patterns);

    if (!next) {
      tokens.push({ className: '', text: line.slice(cursor) });
      break;
    }

    if (next.match.index > cursor) {
      tokens.push({
        className: '',
        text: line.slice(cursor, next.match.index),
      });
    }

    tokens.push({
      className: TOKEN_CLASSES[next.type] ?? '',
      text: next.match[0],
    });

    cursor = next.match.index + next.match[0].length;
  }

  return tokens;
}

