import { getConvertedChar } from "../lib/libFunctions";
import { CAPITALFOLLOWS, NUMBERFOLLOWS, SPACEBRAILLE } from "../variables/constants";
import { alphToBraille, digitToBraille, punctToBraille } from "../variables/mappings";

export const engllishToBraille = (englishArray: string[]): string => {
  let isNum: boolean = false; // Track when we have numbers
  let brailleStr: string = ""; // This will be the returned string
  let isNumIdentifierOn = false; // Track when we have the number follows set

  const periodToBraille = (char: string) => {
    const period = getConvertedChar(char, punctToBraille);
    brailleStr += period;
    isNum = false;
    isNumIdentifierOn = false;
  };

  // Check context of '.' is not in number format, if not convert to braille and add to string
  const isCharacterPeriodAndConvert = (char: string, idx: number) => {
    const isNextDigit: boolean = digitToBraille.get(englishArray[idx + 1]) !== undefined;
    const isPeriod = char === "." && !isNextDigit;
    if (isPeriod) {
      periodToBraille(char);
      return true;
    }
    return false;
  };

  for (let ii = 0; ii < englishArray.length; ii++) {
    const char: string = englishArray[ii];

    if (digitToBraille.has(char) && !isNumIdentifierOn) {
      // Check context of '.' is not in number format, if not convert to braille and add to string
      if (isCharacterPeriodAndConvert(char, ii)) {
        continue;
      }
      isNum = true;
      isNumIdentifierOn = true;
      brailleStr += NUMBERFOLLOWS;
    }

    if (char === " ") {
      brailleStr += SPACEBRAILLE;
      isNum = false;
      isNumIdentifierOn = false;
      continue;
    }

    // punctuation - don't care about 'number follows'
    if (char !== ".") {
      const braillePunct = getConvertedChar(char, punctToBraille);
      brailleStr += braillePunct;
    }
    // Check context of '.' is not in number format, if not convert to braille and add to string
    else if (isCharacterPeriodAndConvert(char, ii)) {
      continue;
    }

    // alphabet
    if (!isNum) {
      const isCapital = char >= "A" && char <= "Z";
      const brailleLetter = getConvertedChar(char.toLowerCase(), alphToBraille);
      brailleStr += isCapital ? CAPITALFOLLOWS + brailleLetter.toUpperCase() : brailleLetter;
    }
    // Number
    else {
      const brailleNumber = getConvertedChar(char, digitToBraille);
      brailleStr += brailleNumber;
    }
  }

  return brailleStr;
};
