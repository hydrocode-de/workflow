export interface Graph {
    id: string;
    [key: string]: any;
    freezed?: boolean;
    children?: Graph[];
}