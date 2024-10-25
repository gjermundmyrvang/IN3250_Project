export type question = {
    id: number,
    item: string,
    questions: Array<string>,
}

export type answer = {
    question: string,
    answer: string
}