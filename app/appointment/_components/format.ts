export function capitalizeEachWord(text: string): string {
    if (!text) return ""
    return text
        .toLowerCase()
        .split(" ")
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
}