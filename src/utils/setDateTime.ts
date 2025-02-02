export function setDateTime(date: Date) {
    return new Date(date).setHours(new Date(date).getHours() + 19);
}