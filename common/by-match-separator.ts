export default function separateTextbyFirstMatch(text: string, substr: string) {
    const leftIndex = text.indexOf(substr);
    const rightIndex = leftIndex + substr.length;
    const leftPart = text.slice(0, leftIndex);
    const matchPart = text.slice(leftIndex, rightIndex);
    const rightPart = text.slice(rightIndex, text.length);

    return [leftPart, matchPart, rightPart];
}
